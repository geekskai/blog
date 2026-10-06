import { readSoundCloudFailure } from "@/lib/soundcloud/client-errors"
import { FormEvent, useCallback, useState } from "react"
import { useDownloadQuota } from "@/components/download-quota/useDownloadQuota"
import { trackToolEvent } from "@/lib/analytics/tool-events"
import { downloadSoundCloudTrack } from "../lib/download"
import {
  isValidSoundCloudPlaylistUrl,
  isValidSoundCloudTrackUrl,
  isShortSoundCloudUrl,
  normalizeSoundCloudUrl,
} from "../lib/url"

export type LoadingState = "idle" | "loading" | "success" | "error"
export type DownloadFormat = "mp3" | "m4a" | "wav"

interface SoundCloudTrackInfoLike {
  title?: string
}

interface UseSoundCloudTrackDownloadFormOptions<TTrackInfo extends SoundCloudTrackInfoLike> {
  initialExtension: DownloadFormat
  t: (key: string, values?: Record<string, string | number>) => string
  invalidUrlLogPrefix: string
  analyticsToolId: string
  getFileName: (trackInfo: TTrackInfo | null, extension: DownloadFormat) => string
}

export function useSoundCloudTrackDownloadForm<TTrackInfo extends SoundCloudTrackInfoLike>({
  initialExtension,
  t,
  invalidUrlLogPrefix,
  analyticsToolId,
  getFileName,
}: UseSoundCloudTrackDownloadFormOptions<TTrackInfo>) {
  const [url, setUrl] = useState("")
  const [extension, setExtension] = useState<DownloadFormat>(initialExtension)
  const [downloading, setDownloading] = useState(false)
  const [trackInfo, setTrackInfo] = useState<TTrackInfo | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isPlaylistError, setIsPlaylistError] = useState<boolean>(false)
  const [infoProgress, setInfoProgress] = useState<number>(0)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [infoStatus, setInfoStatus] = useState<string>("")
  const [downloadStatus, setDownloadStatus] = useState<string>("")
  const [hasCompletedDownload, setHasCompletedDownload] = useState(false)
  const restoreRegistrationState = useCallback((state: Record<string, unknown>) => {
    if (typeof state.url === "string") setUrl(state.url)
    if (state.extension === "mp3" || state.extension === "m4a") setExtension(state.extension)
    if (state.extension === "wav") setExtension("wav")
  }, [])
  const downloadQuota = useDownloadQuota({
    toolId: "soundcloud-track",
    analyticsToolId,
    interruptedState: { url, extension },
    onRegistrationReturn: restoreRegistrationState,
  })

  const resetInfoState = useCallback(() => {
    setInfoProgress(0)
    setInfoStatus("")
  }, [])

  const resetDownloadState = useCallback(() => {
    setDownloadProgress(0)
    setDownloadStatus("")
    setDownloading(false)
  }, [])

  const resetDownloadProgress = useCallback(() => {
    setDownloadProgress(0)
    setDownloadStatus("")
  }, [])

  const resetError = useCallback(() => {
    setErrorMessage("")
    setIsPlaylistError(false)
  }, [])

  const validateUrl = useCallback((): boolean => {
    const trimmedUrl = url.trim()
    const normalizedUrl = normalizeSoundCloudUrl(trimmedUrl)

    if (!trimmedUrl) {
      setErrorMessage(t("error_empty_url"))
      return false
    }

    if (isValidSoundCloudPlaylistUrl(normalizedUrl)) {
      setIsPlaylistError(true)
      setErrorMessage(t("error_playlist_url"))
      return false
    }

    if (isShortSoundCloudUrl(normalizedUrl)) {
      return true
    }

    if (!isValidSoundCloudTrackUrl(normalizedUrl)) {
      console.log(`${invalidUrlLogPrefix} invalid url`, normalizedUrl)
      setErrorMessage(t("error_invalid_url"))
      return false
    }

    return true
  }, [invalidUrlLogPrefix, t, url])

  const handleUrlChange = useCallback(
    (newUrl: string) => {
      setUrl(newUrl)
      resetError()
      setLoadingState("idle")
      setHasCompletedDownload(false)
    },
    [resetError]
  )

  const handleGetInfo = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault()

      if (!validateUrl()) {
        setLoadingState("error")
        return
      }

      try {
        setLoadingState("loading")
        resetError()
        setTrackInfo(null)
        resetInfoState()
        setInfoStatus(t("progress_connecting"))

        const startTime = Date.now()
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          if (elapsed < 1000) {
            setInfoStatus(t("progress_connecting"))
            setInfoProgress(10)
          } else if (elapsed < 3000) {
            setInfoStatus(t("progress_fetching"))
            setInfoProgress(30)
          } else {
            setInfoStatus(t("progress_processing"))
            setInfoProgress(60)
          }
        }, 500)

        const response = await fetch("/api/soundcloud-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        })

        clearInterval(progressInterval)
        setInfoStatus(t("progress_parsing"))
        setInfoProgress(90)

        if (!response.ok) {
          const failurePayload: unknown = await response.json()
          throw readSoundCloudFailure(response, failurePayload)
        }

        const data = await response.json()

        if (data.success) {
          setInfoProgress(100)
          setInfoStatus(t("progress_complete"))
          setTrackInfo({ ...data.info, downloadable: true } as TTrackInfo)
          setLoadingState("success")
          setTimeout(resetInfoState, 1000)
        } else {
          setErrorMessage(data.error || t("error_get_info_failed"))
          setLoadingState("error")
          resetInfoState()
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : t("error_network")
        setErrorMessage(errorMsg)
        setLoadingState("error")
        resetInfoState()
        console.error("Get info error:", error)
      }
    },
    [resetError, resetInfoState, t, url, validateUrl]
  )

  const handleDownload = useCallback(async () => {
    if (!validateUrl() || downloading) {
      return
    }

    const safeExtension: DownloadFormat = extension
    const quotaCheck = await downloadQuota.checkQuotaBeforeDownload()
    if (!quotaCheck.allowed) {
      if (quotaCheck.message) {
        setErrorMessage(quotaCheck.message)
      }
      return
    }

    trackToolEvent("tool_started", {
      tool_id: analyticsToolId,
      action: "download",
      format: safeExtension,
    })

    let downloadLaunched = false

    try {
      setDownloading(true)
      resetError()
      resetDownloadProgress()
      setDownloadStatus(t("progress_sending_request"))
      setDownloadProgress(10)

      const fileName = getFileName(trackInfo, safeExtension)

      setDownloadStatus(t("progress_server_processing"))
      setDownloadProgress(20)

      const result = await downloadSoundCloudTrack(url.trim(), fileName, {
        preferredFormat: safeExtension,
        operationId: quotaCheck.operationId,
        quotaToolId: "soundcloud-track",
        onProgress: (progress) => {
          setDownloadProgress(progress.percent ?? 0)
          setDownloadStatus(
            t(
              progress.phase === "downloading"
                ? "progress_downloading_file"
                : "progress_server_processing"
            )
          )
        },
      })
      downloadLaunched = true
      trackToolEvent("tool_succeeded", {
        tool_id: analyticsToolId,
        action: "download",
        format: result.selectedFormat.extension,
        result_count: 1,
      })

      setDownloadProgress(100)
      setDownloadStatus(
        t("progress_saving_actual_format", {
          format: result.selectedFormat.extension.toUpperCase(),
        })
      )
      await downloadQuota.consumeDownloadQuota(quotaCheck.operationId)
      setHasCompletedDownload(true)
      setTimeout(resetDownloadState, 1000)
    } catch (error) {
      if (!downloadLaunched) {
        await downloadQuota.releaseDownloadQuota(quotaCheck.operationId)
      }
      if (!downloadLaunched) {
        trackToolEvent("tool_failed", {
          tool_id: analyticsToolId,
          action: "download",
          format: safeExtension,
        })
      }
      console.error("Download error:", error)
      setErrorMessage(error instanceof Error ? error.message : t("error_download_failed"))
      resetDownloadState()
    }
  }, [
    downloadQuota,
    downloading,
    analyticsToolId,
    extension,
    getFileName,
    resetDownloadProgress,
    resetDownloadState,
    resetError,
    t,
    trackInfo,
    url,
    validateUrl,
  ])

  return {
    url,
    extension,
    downloading,
    trackInfo,
    loadingState,
    errorMessage,
    isPlaylistError,
    infoProgress,
    downloadProgress,
    infoStatus,
    downloadStatus,
    hasCompletedDownload,
    setExtension,
    handleUrlChange,
    handleGetInfo,
    handleDownload,
    downloadQuota,
  }
}
