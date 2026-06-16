import { FormEvent, useCallback, useState } from "react"
import { downloadSoundCloudTrack } from "../lib/download"
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
}

const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2)
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
      setDownloadProgress(10)

      const safeExtension: DownloadFormat = extension === "wav" ? "wav" : "mp3"
      const fileName = getFileName(trackInfo, safeExtension)
      const mimeType = safeExtension === "wav" ? "audio/wav" : "audio/mpeg"

      setDownloadStatus(t("progress_server_processing"))
      setDownloadProgress(20)

      const result = await downloadSoundCloudTrack(url.trim(), fileName, {
        mimeType,
        onProgress: (loadedBytes, totalBytes) => {
          if (totalBytes && totalBytes > 0) {
            const progress = Math.round((loadedBytes / totalBytes) * 70 + 20)
            setDownloadProgress(progress)
            const loadedMB = formatFileSize(loadedBytes)
            const totalMB = formatFileSize(totalBytes)
            setDownloadStatus(`${t("progress_downloading_file")}: ${loadedMB}MB / ${totalMB}MB`)
          } else {
            setDownloadStatus(t("progress_downloading_file"))
            setDownloadProgress((prev) => Math.min(prev + 2, 90))
          }
        },
      })

      if (result.info?.title) {
        setTrackInfo({
          ...(trackInfo ?? {}),
          ...result.info,
          downloadable: true,
        } as unknown as TTrackInfo)
      }

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
