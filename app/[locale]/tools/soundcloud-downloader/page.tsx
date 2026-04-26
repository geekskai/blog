"use client"

import GoogleAdUnitWrap from "@/components/GoogleAdUnitWrap"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
import ShareButtons from "@/components/ShareButtons"
import React, { useCallback, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import TrackInfoCard, { TrackInfo } from "../soundcloud-to-mp3/TrackInfoCard"
import PlaylistTracks from "../soundcloud-playlist-downloader/components/PlaylistTracks"
import DownloadProgress from "../soundcloud-playlist-downloader/components/DownloadProgress"
import TrackDownloadForm from "./components/TrackDownloadForm"
import type {
  DownloadFormat,
  DownloadProgress as DownloadProgressType,
  PlaylistInfo,
} from "../soundcloud-playlist-downloader/types"
import { createDownloadLink, getSafeFileName } from "../soundcloud-playlist-downloader/lib/utils"
import { detectSoundCloudUrlKind } from "./lib/url"
import { useSoundCloudTrackDownloadForm } from "./hooks/useSoundCloudTrackDownloadForm"
import { CoreFactsSection, FAQSection, HowItWorksSection } from "./SEOContent"

const getFileName = (trackInfo: TrackInfo | null, extension: string): string => {
  return trackInfo?.title ? `${trackInfo.title}.${extension}` : `audio-${Date.now()}.${extension}`
}

const seoContentVisibilityStyle: React.CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "auto 2200px",
}

type PlaylistLoadingState = "idle" | "loading" | "success" | "error"

export default function SoundCloudDownloaderPage() {
  const tDownloader = useTranslations("SoundCloudDownloader")
  const tTrack = useTranslations("SoundCloudToMP3")
  const tPlaylist = useTranslations("SoundCloudPlaylistDownloader")

  const {
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
  } = useSoundCloudTrackDownloadForm<TrackInfo>({
    initialExtension: "mp3",
    t: tTrack,
    invalidUrlLogPrefix: "soundcloud downloader",
    getFileName,
    createDownloadLink: (blob, fileName) => createDownloadLink(blob, fileName.toLowerCase()),
  })

  const [playlistLoadingState, setPlaylistLoadingState] = useState<PlaylistLoadingState>("idle")
  const [playlistErrorMessage, setPlaylistErrorMessage] = useState("")
  const [isTrackError, setIsTrackError] = useState(false)
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [playlistDownloadProgress, setPlaylistDownloadProgress] = useState<DownloadProgressType>({
    current: 0,
    total: 0,
    currentTrack: "",
    status: "idle",
  })

  const urlKind = useMemo(() => detectSoundCloudUrlKind(url), [url])
  const isPlaylistMode = urlKind === "playlist"
  const format = extension as DownloadFormat

  const handleUnifiedUrlChange = useCallback(
    (newUrl: string) => {
      handleUrlChange(newUrl)
      setPlaylistErrorMessage("")
      setIsTrackError(false)
      setPlaylistLoadingState("idle")
      setPlaylistInfo(null)
      setPlaylistDownloadProgress({
        current: 0,
        total: 0,
        currentTrack: "",
        status: "idle",
      })
    },
    [handleUrlChange]
  )

  const validatePlaylistUrl = useCallback((): boolean => {
    setIsTrackError(false)
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setPlaylistErrorMessage(tPlaylist("error_empty_url"))
      return false
    }

    const kind = detectSoundCloudUrlKind(trimmedUrl)
    if (kind !== "playlist") {
      if (kind === "track") {
        setIsTrackError(true)
      }
      setPlaylistErrorMessage(tPlaylist("error_invalid_url"))
      return false
    }

    return true
  }, [tPlaylist, url])

  const handleFetchPlaylist = useCallback(async () => {
    if (!validatePlaylistUrl()) {
      setPlaylistLoadingState("error")
      return
    }

    try {
      setPlaylistLoadingState("loading")
      setPlaylistErrorMessage("")
      setPlaylistInfo(null)

      const response = await fetch("/api/soundcloud-playlist-downloader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistUrl: url.trim() }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: tPlaylist("error_fetch_failed") }))
        setPlaylistErrorMessage(errorData.error || tPlaylist("error_fetch_failed"))
        setPlaylistLoadingState("error")
        return
      }

      const data = (await response.json()) as PlaylistInfo
      if (data.success && data.tracks.length > 0) {
        setPlaylistInfo(data)
        setPlaylistLoadingState("success")
      } else {
        setPlaylistErrorMessage(tPlaylist("error_no_tracks"))
        setPlaylistLoadingState("error")
      }
    } catch (error) {
      setPlaylistErrorMessage(error instanceof Error ? error.message : tPlaylist("error_network"))
      setPlaylistLoadingState("error")
    }
  }, [tPlaylist, url, validatePlaylistUrl])

  const handleDownloadAll = useCallback(async () => {
    if (!playlistInfo || playlistInfo.tracks.length === 0) {
      return
    }

    const tracks = playlistInfo.tracks
    const total = tracks.length
    setPlaylistDownloadProgress({
      current: 0,
      total,
      currentTrack: "",
      status: "downloading",
    })

    let errorCount = 0

    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index]
      setPlaylistDownloadProgress((prev) => ({
        ...prev,
        current: index,
        currentTrack: track.title,
      }))

      try {
        let downloadResult: Response
        try {
          const directUrlResponse = await fetch("/api/download-soundcloud", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: track.url, directUrl: true }),
          })
          const directData = await directUrlResponse.json()

          if (directData.success && directData.directUrl) {
            try {
              downloadResult = await fetch(directData.directUrl)
              if (!downloadResult.ok) {
                throw new Error("Direct fetch failed")
              }
            } catch {
              downloadResult = await fetch("/api/download-soundcloud", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: track.url }),
              })
            }
          } else {
            downloadResult = await fetch("/api/download-soundcloud", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: track.url }),
            })
          }
        } catch {
          downloadResult = await fetch("/api/download-soundcloud", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: track.url }),
          })
        }

        if (!downloadResult.ok) {
          throw new Error(`Failed track ${index + 1}`)
        }

        const blob = await downloadResult.blob()
        const fileName = getSafeFileName(track.title, format)
        createDownloadLink(blob, fileName)
      } catch {
        errorCount++
      }

      if (index < tracks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setPlaylistDownloadProgress((prev) => ({
      ...prev,
      current: total,
      status: errorCount > 0 ? "error" : "completed",
    }))
  }, [format, playlistInfo])

  const handleUnifiedSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (isPlaylistMode) {
        void handleFetchPlaylist()
      } else {
        void handleGetInfo(e)
      }
    },
    [handleFetchPlaylist, handleGetInfo, isPlaylistMode]
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative mx-auto max-w-6xl space-y-4 p-4">
        <ContentFreshnessBadge
          lastModified={new Date("2026-04-26")}
          namespace="SoundCloudDownloader"
        />

        <header className="text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-4 py-2 text-sm text-white shadow-lg shadow-purple-500/25 md:px-6 md:py-3 md:text-base">
            <div className="rounded-full bg-white/20 p-1">
              <span className="text-base md:text-lg">🎵</span>
            </div>
            <span className="font-semibold">{tDownloader("tool_badge")}</span>
          </div>

          <h1 className="my-3 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-2xl font-bold leading-tight text-transparent md:text-5xl">
            {tDownloader("page_title")}
          </h1>

          <p className="mx-auto mb-3 max-w-6xl text-base text-slate-300 md:text-lg">
            {tDownloader("page_subtitle")}
          </p>

          <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10 p-5 shadow-2xl backdrop-blur-md sm:p-6 md:mt-12 md:p-10">
            <h2 className="mb-4 text-base font-bold text-purple-300 sm:text-lg md:text-2xl">
              {tDownloader("page_quick_answer_title")}
            </h2>
            <p className="text-sm text-slate-200 sm:text-base md:text-lg md:leading-loose">
              {tDownloader("page_quick_answer_content")}
            </p>
          </div>
        </header>

        <GoogleAdUnitWrap />

        <div className="mx-auto max-w-6xl md:mb-12">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <div className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 px-4 py-3">
              <h2 className="text-lg font-semibold text-white md:text-2xl">
                {tDownloader("auto_mode_label")} (
                {isPlaylistMode
                  ? tDownloader("auto_mode_playlist")
                  : tDownloader("auto_mode_track")}
                )
              </h2>
            </div>

            {isPlaylistMode ? (
              <TrackDownloadForm
                namespace="SoundCloudPlaylistDownloader"
                variant="playlist"
                formId="soundcloud-downloader-form"
                url={url}
                placeholder="https://soundcloud.com/username/sets/playlist-name"
                relatedToolHref="/tools/soundcloud-to-mp3"
                extension={format}
                loadingState={playlistLoadingState}
                errorMessage={playlistErrorMessage}
                isTrackError={isTrackError}
                onUrlChange={handleUnifiedUrlChange}
                onExtensionChange={setExtension}
                onSubmit={handleUnifiedSubmit}
              />
            ) : (
              <TrackDownloadForm
                namespace="SoundCloudToMP3"
                variant="track"
                formId="soundcloud-downloader-form"
                url={url}
                placeholder="https://soundcloud.com/username/song-name"
                relatedToolHref="/tools/soundcloud-playlist-downloader"
                extension={format}
                loadingState={loadingState}
                downloading={downloading}
                errorMessage={errorMessage}
                isPlaylistError={isPlaylistError}
                infoProgress={infoProgress}
                infoStatus={infoStatus}
                downloadProgress={downloadProgress}
                downloadStatus={downloadStatus}
                onUrlChange={handleUnifiedUrlChange}
                onExtensionChange={setExtension}
                onSubmit={handleUnifiedSubmit}
                onDownload={handleDownload}
              />
            )}
          </div>
        </div>

        <ShareButtons />

        {isPlaylistMode && playlistDownloadProgress.status !== "idle" && (
          <DownloadProgress progress={playlistDownloadProgress} />
        )}

        {isPlaylistMode && playlistInfo && playlistInfo.tracks.length > 0 && (
          <PlaylistTracks
            tracks={playlistInfo.tracks}
            onDownloadAll={handleDownloadAll}
            isDownloading={playlistDownloadProgress.status === "downloading"}
            format={format}
          />
        )}

        {!isPlaylistMode && loadingState === "loading" && !trackInfo && (
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
              <div className="animate-pulse space-y-4 p-8">
                <div className="h-64 rounded-lg bg-white/10"></div>
                <div className="space-y-2">
                  <div className="h-8 w-3/4 rounded-lg bg-white/10"></div>
                  <div className="h-4 w-1/2 rounded-lg bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isPlaylistMode && trackInfo && (
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                {tDownloader("track_info_title")}
              </h2>
              <p className="text-xs text-slate-400 md:text-sm">
                {tDownloader("track_info_subtitle")}
              </p>
            </div>
            <TrackInfoCard
              trackInfo={trackInfo}
              onDownload={handleDownload}
              isDownloading={downloading}
            />
          </div>
        )}

        {/* {((isPlaylistMode && !playlistInfo && playlistLoadingState === "idle") ||
          (!isPlaylistMode && loadingState === "idle" && !trackInfo)) && (
          <div className="mx-auto max-w-6xl text-center">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm md:p-10">
              <div className="mb-4 text-5xl md:mb-6 md:text-7xl">🎼</div>
              <h2 className="mb-2 text-xl font-bold text-white md:mb-3 md:text-2xl">
                {tDownloader("empty_state_title")}
              </h2>
              <p className="text-sm text-slate-300 md:text-base">
                {tDownloader("empty_state_description")}
              </p>
            </div>
          </div>
        )} */}

        <div
          className="mx-auto max-w-6xl space-y-8 md:space-y-12"
          style={seoContentVisibilityStyle}
        >
          <CoreFactsSection />
          <HowItWorksSection />

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
              {tDownloader("boundary_title")}
            </h2>
            <p className="text-slate-300">{tDownloader("boundary_description")}</p>
          </section>

          <FAQSection />
        </div>
      </div>
    </div>
  )
}
