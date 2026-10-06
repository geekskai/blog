"use client"
import { readSoundCloudFailure } from "@/lib/soundcloud/client-errors"

import { FormEvent, useCallback, useMemo, useState } from "react"
import { useDownloadQuota } from "@/components/download-quota/useDownloadQuota"
import {
  isShortSoundCloudUrl,
  isValidSoundCloudPlaylistUrl,
  isValidSoundCloudTrackUrl,
  normalizeSoundCloudUrl,
} from "../../soundcloud-downloader/lib/url"
import { downloadSoundCloudFile } from "../../soundcloud-downloader/lib/download"

export type LoadingState = "idle" | "loading" | "success" | "error"

interface ArtworkUserInfo {
  username?: string
}

export interface ArtworkTrackInfo {
  id?: number
  title?: string
  artwork_url?: string
  permalink_url?: string
  duration?: number
  description?: string
  likes_count?: number
  playback_count?: number
  user?: ArtworkUserInfo
}

export const getPreviewArtworkUrl = (artworkUrl?: string): string => {
  if (!artworkUrl) {
    return ""
  }

  return artworkUrl.replace(
    /-(?:original|t500x500|crop|large|t300x300|badge|tiny|small)(\.[a-z0-9]+)(?:\?.*)?$/i,
    "-t500x500$1"
  )
}

export function useSoundCloudArtworkDownloadForm(t: (key: string) => string) {
  const [url, setUrl] = useState("")
  const [trackInfo, setTrackInfo] = useState<ArtworkTrackInfo | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [downloading, setDownloading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isPlaylistError, setIsPlaylistError] = useState(false)
  const [infoProgress, setInfoProgress] = useState(0)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [infoStatus, setInfoStatus] = useState("")
  const [downloadStatus, setDownloadStatus] = useState("")
  const restoreRegistrationState = useCallback((state: Record<string, unknown>) => {
    if (typeof state.url === "string") setUrl(state.url)
  }, [])
  const downloadQuota = useDownloadQuota({
    toolId: "soundcloud-artwork",
    interruptedState: { url },
    onRegistrationReturn: restoreRegistrationState,
  })

  const previewArtworkUrl = useMemo(() => getPreviewArtworkUrl(trackInfo?.artwork_url), [trackInfo])

  const resetInfoState = useCallback(() => {
    setInfoProgress(0)
    setInfoStatus("")
  }, [])

  const resetDownloadState = useCallback(() => {
    setDownloadProgress(0)
    setDownloadStatus("")
    setDownloading(false)
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
      console.log("soundcloud artwork downloader invalid url", normalizedUrl)
      setErrorMessage(t("error_invalid_url"))
      return false
    }

    return true
  }, [t, url])

  const handleUrlChange = useCallback(
    (newUrl: string) => {
      setUrl(newUrl)
      setTrackInfo(null)
      setLoadingState("idle")
      resetInfoState()
      resetDownloadState()
      resetError()
    },
    [resetDownloadState, resetError, resetInfoState]
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
        setTrackInfo(null)
        resetError()
        resetInfoState()
        setInfoStatus(t("progress_connecting"))

        const startTime = Date.now()
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          if (elapsed < 1000) {
            setInfoStatus(t("progress_connecting"))
            setInfoProgress(15)
          } else if (elapsed < 2500) {
            setInfoStatus(t("progress_fetching"))
            setInfoProgress(45)
          } else {
            setInfoStatus(t("progress_processing"))
            setInfoProgress(70)
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
          const errorData = await response.json().catch(() => ({
            error: t("error_get_info_failed"),
          }))
          throw readSoundCloudFailure(response, errorData)
        }

        const data = await response.json()
        const info = data.info as ArtworkTrackInfo | undefined

        if (!data.success || !info) {
          throw new Error(data.error || t("error_get_info_failed"))
        }

        if (!info.artwork_url) {
          throw new Error(t("error_no_artwork"))
        }

        setTrackInfo(info)
        setLoadingState("success")
        setInfoProgress(100)
        setInfoStatus(t("progress_complete"))
        setTimeout(resetInfoState, 1000)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : t("error_network"))
        setLoadingState("error")
        resetInfoState()
        console.error("Get artwork info error:", error)
      }
    },
    [resetError, resetInfoState, t, url, validateUrl]
  )

  const handleDownload = useCallback(async () => {
    if (!trackInfo?.artwork_url || downloading || !validateUrl()) {
      return
    }

    const quotaCheck = await downloadQuota.checkQuotaBeforeDownload()
    if (!quotaCheck.allowed) {
      if (quotaCheck.message) {
        setErrorMessage(quotaCheck.message)
      }
      return
    }

    let downloadLaunched = false
    try {
      setDownloading(true)
      resetError()
      setDownloadProgress(5)
      setDownloadStatus(t("progress_sending_request"))

      await downloadSoundCloudFile({
        url,
        format: "artwork",
        operationId: quotaCheck.operationId,
        quotaToolId: "soundcloud-artwork",
        onProgress: (progress) => {
          setDownloadProgress(progress.percent ?? 0)
          setDownloadStatus(t("progress_downloading_file"))
        },
      })
      downloadLaunched = true
      setDownloadProgress(100)
      setDownloadStatus(t("progress_saving_file"))
      await downloadQuota.consumeDownloadQuota(quotaCheck.operationId)

      setTimeout(resetDownloadState, 1000)
    } catch (error) {
      if (!downloadLaunched) {
        await downloadQuota.releaseDownloadQuota(quotaCheck.operationId)
      }
      console.error("Artwork download error:", error)
      setErrorMessage(error instanceof Error ? error.message : t("error_download_failed"))
      resetDownloadState()
    }
  }, [downloadQuota, downloading, resetDownloadState, resetError, t, trackInfo, url, validateUrl])

  return {
    url,
    trackInfo,
    previewArtworkUrl,
    loadingState,
    downloading,
    errorMessage,
    isPlaylistError,
    infoProgress,
    infoStatus,
    downloadProgress,
    downloadStatus,
    downloadQuota,
    handleUrlChange,
    handleGetInfo,
    handleDownload,
  }
}
