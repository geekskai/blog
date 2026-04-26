"use client"
import GoogleAdUnitWrap from "@/components/GoogleAdUnitWrap"
import React, { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import PlaylistTracks from "./components/PlaylistTracks"
import DownloadProgress from "./components/DownloadProgress"
import TrackDownloadForm from "../soundcloud-downloader/components/TrackDownloadForm"
import {
  CoreFactsSection,
  FAQSection,
  HowToSection,
  FormatComparisonSection,
  UseCasesSection,
  KeyFeaturesSection,
} from "./SEOContent"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
import ShareButtons from "@/components/ShareButtons"

import type {
  PlaylistInfo,
  DownloadProgress as DownloadProgressType,
  DownloadFormat,
  LoadingState,
} from "./types"
import { createDownloadLink, getSafeFileName } from "./lib/utils"
import { detectSoundCloudUrlKind } from "../soundcloud-downloader/lib/url"

export default function SoundCloudPlaylistDownloaderPage() {
  const t = useTranslations("SoundCloudPlaylistDownloader")
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

      try {
        // --- Optimize: Try to get direct download link to save Vercel traffic ---
        let downloadResult: Response
        let isDirectDownload = false

        try {
          const directUrlResponse = await fetch("/api/download-soundcloud", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: track.url, directUrl: true }),
          })

          const directData = await directUrlResponse.json()
          if (directData.success && directData.directUrl) {
            console.log(`Using direct download for track: ${track.title}`)
            try {
              downloadResult = await fetch(directData.directUrl)
              if (downloadResult.ok) {
                isDirectDownload = true
              } else {
                throw new Error("Direct fetch failed")
              }
            } catch (e) {
              console.warn(`Direct download failed for ${track.title}, falling back to proxy`, e)
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
        } catch (e) {
          console.warn(`Direct URL check failed for ${track.title}, falling back to proxy`, e)
          downloadResult = await fetch("/api/download-soundcloud", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: track.url }),
          })
        }
        // --- Optimize end ---

        if (!downloadResult.ok) {
          throw new Error(`Failed to download track ${index + 1}`)
        }

        // Get audio blob
        const blob = await downloadResult.blob()

        // Create download link
        const fileName = getSafeFileName(track.title, format)
        createDownloadLink(blob, fileName)

        successCount++
        console.log(`Downloaded: ${track.title} (${blob.size} bytes)`)
      } catch (error) {
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
  }, [playlistInfo, format])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative mx-auto max-w-6xl space-y-2 px-4 py-2 sm:space-y-3 sm:px-6 sm:py-6 md:space-y-5 md:py-5">
        {/* Content Freshness Badge */}
        <ContentFreshnessBadge
          lastModified={new Date("2026-04-26")}
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
            {t("page_title")}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-2 max-w-6xl px-1 text-sm text-slate-300 sm:mb-3 sm:text-base md:text-lg">
            {t.rich("page_subtitle", {
              mp3: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
              wav: (chunks) => <strong className="text-cyan-400">{chunks}</strong>,
              free: (chunks) => <strong className="text-emerald-400">{chunks}</strong>,
              fast: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              no_registration: (chunks) => <strong className="text-pink-400">{chunks}</strong>,
            })}
          </p>
        </header>

        <GoogleAdUnitWrap />
        {/* Input Section */}
        <div className="mx-auto mb-8 max-w-6xl sm:mb-10 md:mb-12">
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
            relatedToolHref="/tools/soundcloud-downloader"
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

        {/* Download Progress */}
        {downloadProgress.status !== "idle" && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <DownloadProgress progress={downloadProgress} />
          </div>
        )}
        <ShareButtons />

        {/* Playlist Tracks */}
        {playlistInfo && playlistInfo.tracks.length > 0 && (
          <div className="mb-6 sm:mb-8 md:mb-10">
            <PlaylistTracks
              tracks={playlistInfo.tracks}
              onDownloadAll={handleDownloadAll}
              isDownloading={downloadProgress.status === "downloading"}
              format={format}
            />
          </div>
        )}

        {/* Empty State */}
        {loadingState === "idle" && !playlistInfo && (
          <div className="mx-auto max-w-6xl px-0 text-center sm:px-0">
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

        {/* SEO Content Sections */}
        <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
          {/* What is this tool section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 md:p-8 lg:p-12">
            <div className="relative z-10">
              <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-6 sm:text-3xl md:mb-8 lg:text-3xl">
                {t("section_what_is_title")}
              </h2>
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
                <div>
                  <p className="mb-4 text-base text-slate-300 sm:mb-6 sm:text-lg">
                    {t.rich("section_what_is_description_1", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                  <p className="text-base text-slate-300 sm:text-lg">
                    {t.rich("section_what_is_description_2", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm sm:rounded-2xl sm:p-6 md:p-8">
                  <h3 className="mb-4 flex items-center text-lg font-semibold text-white sm:mb-5 sm:text-xl md:mb-6">
                    <span className="mr-2 text-xl sm:mr-3 sm:text-2xl">✨</span>
                    {t("section_what_is_key_benefits")}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300 sm:space-y-3 sm:text-base">
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-purple-400"></div>
                      {t("section_what_is_benefit_1")}
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-pink-400"></div>
                      {t("section_what_is_benefit_2")}
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400"></div>
                      {t("section_what_is_benefit_3")}
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-blue-400"></div>
                      {t("section_what_is_benefit_4")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Download SoundCloud Playlists Online Section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 md:p-8 lg:p-12">
            <h2 className="mb-4 text-2xl font-bold leading-tight text-white sm:mb-5 sm:text-3xl md:mb-6 lg:text-3xl">
              {t("section_download_online_title")}
            </h2>
            <p className="text-base text-slate-300 sm:text-lg lg:leading-relaxed">
              {t("section_download_online_description")}
            </p>
          </section>

          {/* Core Facts Section */}
          <CoreFactsSection />

          {/* Key Features Section */}
          <KeyFeaturesSection />

          {/* How-to Guide Section */}
          <HowToSection />

          {/* Format Comparison Section */}
          <FormatComparisonSection />

          {/* Use Cases Section */}
          <UseCasesSection />

          {/* FAQ Section */}
          <FAQSection />

          {/* Legal and Ethical Section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 md:p-8 lg:p-12">
            <h2 className="mb-4 text-2xl font-bold leading-tight text-white sm:mb-5 sm:text-3xl md:mb-6 lg:text-3xl">
              {t("section_legal_title")}
            </h2>
            <div className="prose prose-sm max-w-none text-slate-300 sm:prose-base md:prose-lg prose-headings:text-white prose-strong:font-bold prose-strong:text-orange-300 prose-ul:text-slate-300">
              <p className="leading-relaxed">{t("section_legal_description")}</p>
              <ul className="list-inside list-disc space-y-2 sm:space-y-3">
                <li>{t("section_legal_point_1")}</li>
                <li>{t("section_legal_point_2")}</li>
                <li>{t("section_legal_point_3")}</li>
                <li>{t("section_legal_point_4")}</li>
              </ul>
              <p className="mt-4 sm:mt-6">{t("section_legal_footer")}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
