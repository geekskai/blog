"use client"

import React, { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import PlaylistInput from "./components/PlaylistInput"
import PlaylistTracks from "./components/PlaylistTracks"
import DownloadProgress from "./components/DownloadProgress"
import {
  CoreFactsSection,
  FAQSection,
  HowToSection,
  FormatComparisonSection,
  UseCasesSection,
  KeyFeaturesSection,
  ContentFreshnessBadge,
} from "./SEOContent"
import type {
  PlaylistTrack,
  PlaylistInfo,
  DownloadProgress as DownloadProgressType,
  DownloadFormat,
  LoadingState,
} from "./types"
import { isValidSoundCloudPlaylistUrl, createDownloadLink, getSafeFileName } from "./lib/utils"

export default function SoundCloudPlaylistDownloaderPage() {
  const t = useTranslations("SoundCloudPlaylistDownloader")
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState<DownloadFormat>("mp3")
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
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
    if (!url.trim()) {
      setErrorMessage(t("error_empty_url"))
      return false
    }
    if (!isValidSoundCloudPlaylistUrl(url.trim())) {
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
      console.error("Fetch playlist error:", error)
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
        // Call download API
        const downloadResult = await fetch("/api/download-soundcloud", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: track.url }),
        })

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
    <div className="relative min-h-screen bg-slate-950">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-12 text-center">
          {/* Tool Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-6 py-3 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30">
            <div className="rounded-full bg-white/20 p-1">
              <span className="text-xl">🎵</span>
            </div>
            <span className="font-semibold">{t("tool_badge")}</span>
          </div>

          {/* Main Title */}
          <h1 className="my-6 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-3xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
            {t("page_title")}
          </h1>

          {/* Subtitle */}
          <p className="text-md mx-auto mb-6 max-w-3xl leading-relaxed text-slate-300 md:text-lg">
            {t.rich("page_subtitle", {
              mp3: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
              wav: (chunks) => <strong className="text-cyan-400">{chunks}</strong>,
              free: (chunks) => <strong className="text-emerald-400">{chunks}</strong>,
              fast: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              no_registration: (chunks) => <strong className="text-pink-400">{chunks}</strong>,
            })}
          </p>

          {/* Content Freshness Badge */}
          <div className="flex flex-col items-center gap-4">
            <ContentFreshnessBadge lastModified={new Date("2026-01-02")} />
            <div className="text-sm text-slate-400">
              {t("related_tool_text")}{" "}
              <a
                href="/tools/soundcloud-to-wav"
                className="text-cyan-400 underline transition-colors hover:text-cyan-300"
              >
                {t("related_tool_link")}
              </a>
            </div>
          </div>
        </header>

        {/* Input Section */}
        <div className="mb-12">
          <PlaylistInput
            url={url}
            onUrlChange={(newUrl) => {
              setUrl(newUrl)
              resetError()
              setLoadingState("idle")
            }}
            format={format}
            onFormatChange={setFormat}
            onFetchPlaylist={handleFetchPlaylist}
            isLoading={loadingState === "loading"}
            error={errorMessage}
          />
        </div>

        {/* Download Progress */}
        {downloadProgress.status !== "idle" && (
          <div className="mb-12">
            <DownloadProgress progress={downloadProgress} />
          </div>
        )}

        {/* Playlist Tracks */}
        {playlistInfo && playlistInfo.tracks.length > 0 && (
          <div className="mb-12">
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
          <div className="mx-auto max-w-2xl text-center">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-12 shadow-xl backdrop-blur-sm">
              <div className="mb-6 text-7xl">🎼</div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t("empty_state_title")}</h3>
              <p className="text-slate-300">{t("empty_state_description")}</p>
            </div>
          </div>
        )}

        {/* SEO Content Sections */}
        <div className="mx-auto mt-32 space-y-24">
          {/* What is this tool section */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10"></div>
            <div className="relative z-10">
              <h2 className="mb-8 text-3xl font-bold text-white">{t("section_what_is_title")}</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">
                    {t.rich("section_what_is_description_1", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                  <p className="text-lg leading-relaxed text-slate-300">
                    {t.rich("section_what_is_description_2", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
                  <h3 className="mb-6 flex items-center text-xl font-semibold text-white">
                    <span className="mr-3 text-2xl">✨</span>
                    {t("section_what_is_key_benefits")}
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-purple-400"></div>
                      {t("section_what_is_benefit_1")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-pink-400"></div>
                      {t("section_what_is_benefit_2")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-emerald-400"></div>
                      {t("section_what_is_benefit_3")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                      {t("section_what_is_benefit_4")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
          <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
            <h2 className="mb-6 text-3xl font-bold text-white">{t("section_legal_title")}</h2>
            <div className="prose prose-lg max-w-none text-slate-300 prose-headings:text-white prose-strong:font-bold prose-strong:text-orange-300 prose-ul:text-slate-300">
              <p>{t("section_legal_description")}</p>
              <ul className="list-inside list-disc space-y-3">
                <li>{t("section_legal_point_1")}</li>
                <li>{t("section_legal_point_2")}</li>
                <li>{t("section_legal_point_3")}</li>
                <li>{t("section_legal_point_4")}</li>
              </ul>
              <p className="mt-6">{t("section_legal_footer")}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
