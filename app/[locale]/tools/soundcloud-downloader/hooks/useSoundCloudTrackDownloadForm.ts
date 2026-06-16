import { FormEvent, useCallback, useState } from "react"
import {
  isValidSoundCloudPlaylistUrl,
  isValidSoundCloudTrackUrl,
  isShortSoundCloudUrl,
  normalizeSoundCloudUrl,
} from "../lib/url"

export type LoadingState = "idle" | "loading" | "success" | "error"
export type DownloadFormat = "mp3" | "wav"

interface SoundCloudTrackInfoLike {
  title?: string
}

interface UseSoundCloudTrackDownloadFormOptions<TTrackInfo extends SoundCloudTrackInfoLike> {
  initialExtension: DownloadFormat
  t: (key: string) => string
  invalidUrlLogPrefix: string
  getFileName: (trackInfo: TTrackInfo | null, extension: DownloadFormat) => string
  createDownloadLink: (blob: Blob, fileName: string) => void
}

const triggerDirectDownload = (directUrl: string, fileName: string): void => {
  const anchor = document.createElement("a")
  anchor.href = directUrl
  anchor.download = fileName
  anchor.rel = "noopener"
  anchor.target = "_blank"
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export function useSoundCloudTrackDownloadForm<TTrackInfo extends SoundCloudTrackInfoLike>({
  initialExtension,
  t,
  invalidUrlLogPrefix,
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
          let errorMsg = t("error_get_info_failed")
          try {
            const errorData = await response.json()
            errorMsg = errorData.error || errorMsg
          } catch {
            errorMsg = `${t("error_get_info_failed")} (${response.status})`
          }
          throw new Error(errorMsg)
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

    try {
      setDownloading(true)
      resetError()
      resetDownloadProgress()
      setDownloadStatus(t("progress_sending_request"))
      setDownloadProgress(5)

      const response = await fetch("/api/download-soundcloud/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success || !data.directUrl) {
        setErrorMessage(data.error || t("error_download_failed"))
        resetDownloadState()
        return
      }

      setDownloadStatus(t("progress_server_processing"))
      setDownloadProgress(80)

      const safeExtension: DownloadFormat = extension === "wav" ? "wav" : "mp3"
      const fileName = getFileName(
        data.info?.title
          ? ({ ...trackInfo, ...data.info, downloadable: true } as TTrackInfo)
          : trackInfo,
        safeExtension
      )

      if (data.info?.title) {
        setTrackInfo({
          ...(trackInfo ?? {}),
          ...data.info,
          downloadable: true,
        } as unknown as TTrackInfo)
      }

      triggerDirectDownload(data.directUrl, fileName)

      setDownloadProgress(100)
      setDownloadStatus(t("progress_saving_file"))
      setTimeout(resetDownloadState, 1000)
    } catch (error) {
      console.error("Download error:", error)
      setErrorMessage(error instanceof Error ? error.message : t("error_download_failed"))
      resetDownloadState()
    }
  }, [
    downloading,
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
    setExtension,
    handleUrlChange,
    handleGetInfo,
    handleDownload,
  }
}
