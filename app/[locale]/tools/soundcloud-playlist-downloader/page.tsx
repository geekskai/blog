"use client"
import React, { useState, useCallback, useEffect, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { GoogleAdUnitPlaceholder } from "@/components/GoogleAdUnitPlaceholder"
import SoundCloudToolSwitcher from "@/components/SoundCloudToolSwitcher"
import DownloadShareModal from "@/components/download-quota/DownloadShareModal"
import { useDownloadQuota } from "@/components/download-quota/useDownloadQuota"
import PlaylistTracks from "./components/PlaylistTracks"
import DownloadProgress from "./components/DownloadProgress"
import TrackDownloadForm from "../soundcloud-downloader/components/TrackDownloadForm"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
import ShareButtons from "@/components/ShareButtons"
import SoundCloudEvidenceContent from "@/components/SoundCloudEvidenceContent"
import { getSoundCloudPageCopy, SOUNDCLOUD_SEO_UPDATED } from "@/data/soundCloudSeo"

import type {
  PlaylistInfo,
  DownloadProgress as DownloadProgressType,
  DownloadFormat,
  LoadingState,
} from "./types"
import { downloadSoundCloudTrack } from "../soundcloud-downloader/lib/download"
import { getSafeFileName } from "./lib/utils"
import { detectSoundCloudUrlKind } from "../soundcloud-downloader/lib/url"

const DeferredGoogleAdUnitWrap = dynamic(() => import("@/components/GoogleAdUnitWrap"), {
  ssr: false,
  loading: () => <GoogleAdUnitPlaceholder />,
})

export default function SoundCloudPlaylistDownloaderPage() {
  const t = useTranslations("SoundCloudPlaylistDownloader")
  const locale = useLocale()
  const copy = getSoundCloudPageCopy("playlist", locale)
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState<DownloadFormat>("mp3")
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  // is track error means the url is a single track url
  const [isTrackError, setIsTrackError] = useState<boolean>(false)
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgressType>({
    current: 0,
    total: 0,
    currentTrack: "",
    status: "idle",
  })
  const restoreRegistrationState = useCallback((state: Record<string, unknown>) => {
    if (typeof state.url === "string") setUrl(state.url)
    if (state.format === "mp3" || state.format === "wav") setFormat(state.format)
  }, [])
  const downloadQuota = useDownloadQuota({
    toolId: "soundcloud-playlist",
    interruptedState: { url, format },
    onRegistrationReturn: restoreRegistrationState,
  })
  const resultSectionRef = useRef<HTMLDivElement | null>(null)

  // Reset error message
  const resetError = useCallback(() => {
    setErrorMessage("")
  }, [])

  // Validate URL
  const validateUrl = useCallback((): boolean => {
    setIsTrackError(false)
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setErrorMessage(t("error_empty_url"))
      return false
    }

    const urlKind = detectSoundCloudUrlKind(trimmedUrl)
    if (urlKind !== "playlist") {
      if (urlKind === "track") {
        setIsTrackError(true)
      }
      setErrorMessage(t("error_invalid_url"))
      return false
    }

    return true
  }, [url, t])

  // Fetch playlist info
  const handleFetchPlaylist = useCallback(async () => {
    if (!validateUrl()) {
      setLoadingState("error")
      return
    }

    try {
      setLoadingState("loading")
      resetError()
      setPlaylistInfo(null)

      const response = await fetch("/api/soundcloud-playlist-downloader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlistUrl: url.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: t("error_fetch_failed") }))
        setErrorMessage(errorData.error || t("error_fetch_failed"))
        setLoadingState("error")
        return
      }

      const data = (await response.json()) as PlaylistInfo

      if (data.success && data.tracks.length > 0) {
        setPlaylistInfo(data)
        setLoadingState("success")
      } else {
        setErrorMessage(t("error_no_tracks"))
        setLoadingState("error")
      }
    } catch (error) {
      // console.error("Fetch playlist error:", error)
      setErrorMessage(error instanceof Error ? error.message : t("error_network"))
      setLoadingState("error")
    }
  }, [url, validateUrl, resetError, t])

  // Download all tracks
  const handleDownloadAll = useCallback(async () => {
    if (!playlistInfo || playlistInfo.tracks.length === 0) {
      return
    }

    const tracks = playlistInfo.tracks
    const total = tracks.length

    setDownloadProgress({
      current: 0,
      total,
      currentTrack: "",
      status: "downloading",
    })

    let successCount = 0
    let errorCount = 0

    // Download tracks sequentially to avoid overwhelming the browser
    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index]

      setDownloadProgress((prev) => ({
        ...prev,
        current: index,
        currentTrack: track.title,
      }))

      const quotaCheck = await downloadQuota.checkQuotaBeforeDownload()
      if (!quotaCheck.allowed) {
        if (quotaCheck.message) setErrorMessage(quotaCheck.message)
        errorCount += tracks.length - index
        break
      }

      try {
        const fileName = getSafeFileName(track.title, format)
        await downloadSoundCloudTrack(track.url, fileName, {
          preferredFormat: format,
          operationId: quotaCheck.operationId,
          quotaToolId: "soundcloud-playlist",
        })
        await downloadQuota.consumeDownloadQuota(quotaCheck.operationId)
        successCount++
      } catch (error) {
        await downloadQuota.releaseDownloadQuota(quotaCheck.operationId)
        errorCount++
        console.error(`Failed to download track ${index + 1} (${track.title}):`, error)
      }

      // Small delay between downloads to avoid overwhelming the browser
      if (index < tracks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setDownloadProgress((prev) => ({
      ...prev,
      current: total,
      status: errorCount > 0 ? "error" : "completed",
    }))

    console.log(`Download completed: ${successCount} successful, ${errorCount} failed`)
  }, [downloadQuota, playlistInfo, format])

  useEffect(() => {
    if (!playlistInfo?.tracks.length || !resultSectionRef.current) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 150)

    return () => window.clearTimeout(timeoutId)
  }, [playlistInfo])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative mx-auto max-w-7xl space-y-2 px-4 py-2 sm:space-y-3 sm:px-6 sm:py-6 md:space-y-5 md:py-5">
        {/* Content Freshness Badge */}
        <ContentFreshnessBadge
          lastModified={new Date(SOUNDCLOUD_SEO_UPDATED)}
          namespace="SoundCloudPlaylistDownloader"
        />
        {/* Header Section */}
        <header className="text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Tool Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-3 py-1.5 text-xs text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base">
              <div className="rounded-full bg-white/20 p-1">
                <span className="text-sm sm:text-base md:text-lg">🎵</span>
              </div>
              <span className="font-semibold">{t("tool_badge")}</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="my-2 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-2xl font-bold leading-tight text-transparent sm:my-3 sm:text-3xl md:text-4xl lg:text-5xl lg:leading-snug">
            {copy.pageTitle}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-2 max-w-7xl px-1 text-sm text-slate-300 sm:mb-3 sm:text-base md:text-lg">
            {copy.heroDescription}
          </p>
        </header>

        {/* Input Section */}
        <div className="mx-auto mb-6 max-w-7xl sm:mb-8 md:mb-8">
          <TrackDownloadForm
            namespace="SoundCloudPlaylistDownloader"
            variant="playlist"
            formId="soundcloud-playlist-form"
            url={url}
            onUrlChange={(newUrl) => {
              setUrl(newUrl)
              resetError()
              setLoadingState("idle")
            }}
            placeholder="https://soundcloud.com/username/sets/playlist-name"
            relatedToolHref="/tools/soundcloud-downloader/"
            extension={format}
            loadingState={loadingState}
            errorMessage={errorMessage}
            isTrackError={isTrackError}
            onExtensionChange={setFormat}
            onSubmit={(e) => {
              e.preventDefault()
              handleFetchPlaylist()
            }}
          />
        </div>

        <SoundCloudToolSwitcher current="playlist" />

        {/* Download Progress */}
        {downloadProgress.status !== "idle" && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <DownloadProgress progress={downloadProgress} />
          </div>
        )}
        {/* Playlist Tracks */}
        {playlistInfo && playlistInfo.tracks.length > 0 && (
          <div ref={resultSectionRef} className="mb-6 scroll-mt-24 sm:mb-8 md:mb-10">
            <PlaylistTracks
              tracks={playlistInfo.tracks}
              onDownloadAll={handleDownloadAll}
              isDownloading={downloadProgress.status === "downloading"}
              format={format}
              downloadQuota={downloadQuota}
            />
          </div>
        )}

        {/* Empty State */}
        {loadingState === "idle" && !playlistInfo && (
          <div className="mx-auto max-w-7xl px-0 text-center sm:px-0">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm sm:p-8 md:p-10 lg:rounded-3xl lg:p-12">
              <div className="mb-4 text-5xl sm:mb-5 sm:text-6xl md:mb-6 md:text-7xl">🎼</div>
              <h2 className="mb-2 text-xl font-bold leading-tight text-white sm:mb-3 sm:text-2xl md:text-2xl">
                {t("empty_state_title")}
              </h2>
              <p className="text-sm text-slate-300 sm:text-base md:text-base">
                {t("empty_state_description")}
              </p>
            </div>
          </div>
        )}

        <ShareButtons />

        <DeferredGoogleAdUnitWrap />

        <SoundCloudEvidenceContent page="playlist" />
      </div>
      <DownloadShareModal
        isOpen={downloadQuota.showShareModal}
        shareLink={downloadQuota.shareLink}
        unlockAmount={downloadQuota.quotaConfig.shareBonusClicks}
        canRegister={!downloadQuota.quotaConfig.isRegistered}
        canShare={downloadQuota.quotaConfig.shareUnlockAvailable}
        used={downloadQuota.quotaConfig.used}
        limit={downloadQuota.quotaConfig.limit}
        remaining={downloadQuota.quotaConfig.remaining}
        errorMessage={downloadQuota.quotaMessage}
        onClose={downloadQuota.closeShareModal}
        onUnlock={downloadQuota.handleShareUnlock}
        onCreateAccount={downloadQuota.startRegistration}
      />
    </div>
  )
}
