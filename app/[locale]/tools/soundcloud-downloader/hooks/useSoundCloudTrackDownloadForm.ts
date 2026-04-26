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

const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2)
}

export function useSoundCloudTrackDownloadForm<TTrackInfo extends SoundCloudTrackInfoLike>({
  initialExtension,
  t,
  invalidUrlLogPrefix,
  getFileName,
  createDownloadLink,
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
      setDownloadStatus(t("progress_connecting"))
      setDownloadStatus(t("progress_sending_request"))
      setDownloadProgress(5)

      let response: Response

      try {
        const directUrlResponse = await fetch("/api/download-soundcloud", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim(), directUrl: true }),
        })

        if (!directUrlResponse.ok) {
          throw new Error("Direct URL request failed")
        }

        const directData = await directUrlResponse.json()
        if (directData.success && directData.directUrl) {
          console.log("Using direct download link to save Vercel bandwidth")
          try {
            response = await fetch(directData.directUrl)
            if (!response.ok) {
              throw new Error("Direct link fetch failed")
            }
          } catch (e) {
            console.warn("Direct download failed (CORS?), falling back to proxy", e)
            response = await fetch("/api/download-soundcloud", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: url.trim() }),
            })
          }
        } else {
          response = await fetch("/api/download-soundcloud", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url.trim() }),
          })
        }
      } catch (e) {
        console.warn("Direct URL check failed, falling back to proxy", e)
        response = await fetch("/api/download-soundcloud", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: t("error_download_failed"),
        }))
        setErrorMessage(errorData.error || t("error_download_failed"))
        resetDownloadState()
        return
      }

      setDownloadStatus(t("progress_server_processing"))
      setDownloadProgress(10)

      const contentLength = response.headers.get("Content-Length")
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0
      const infoHeader = response.headers.get("X-SoundCloud-Info")
      let downloadedInfo: TTrackInfo | null = null

      if (infoHeader) {
        try {
          downloadedInfo = {
            ...(JSON.parse(infoHeader) as TTrackInfo),
            downloadable: true,
          } as TTrackInfo
          setTrackInfo(downloadedInfo)
        } catch (e) {
          console.warn("Failed to parse SoundCloud info:", e)
        }
      }

      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()
      const chunks: BlobPart[] = []
      let loadedBytes = 0

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        chunks.push(value)
        loadedBytes += value.length

        if (totalBytes > 0) {
          const progress = Math.round((loadedBytes / totalBytes) * 80 + 20)
          setDownloadProgress(progress)
          const loadedMB = formatFileSize(loadedBytes)
          const totalMB = formatFileSize(totalBytes)
          setDownloadStatus(`${t("progress_downloading_file")}: ${loadedMB}MB / ${totalMB}MB`)
        } else {
          setDownloadStatus(t("progress_downloading_file"))
          setDownloadProgress((prev) => Math.min(prev + 2, 95))
        }
      }

      setDownloadProgress(100)
      setDownloadStatus(t("progress_saving_file"))

      const blob = new Blob(chunks, { type: extension === "mp3" ? "audio/mpeg" : "audio/wav" })
      const safeExtension: DownloadFormat = extension === "wav" ? "wav" : "mp3"
      createDownloadLink(blob, getFileName(downloadedInfo || trackInfo, safeExtension))

      setTimeout(resetDownloadState, 1000)
    } catch (error) {
      console.error("Download error:", error)
      setErrorMessage(error instanceof Error ? error.message : t("error_download_failed"))
      resetDownloadState()
    }
  }, [
    createDownloadLink,
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
