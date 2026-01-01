"use client"

import React, { useState, useCallback } from "react"
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
      setErrorMessage("Please enter a playlist URL")
      return false
    }
    if (!isValidSoundCloudPlaylistUrl(url.trim())) {
      setErrorMessage("Please enter a valid SoundCloud playlist URL")
      return false
    }
    return true
  }, [url])

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
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch playlist" }))
        setErrorMessage(errorData.error || "Failed to fetch playlist")
        setLoadingState("error")
        return
      }

      const data = (await response.json()) as PlaylistInfo

      if (data.success && data.tracks.length > 0) {
        setPlaylistInfo(data)
        setLoadingState("success")
      } else {
        setErrorMessage("No tracks found in this playlist")
        setLoadingState("error")
      }
    } catch (error) {
      console.error("Fetch playlist error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Network error")
      setLoadingState("error")
    }
  }, [url, validateUrl, resetError])

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
            <span className="font-semibold">Playlist Downloader</span>
          </div>

          {/* Main Title */}
          <h1 className="my-6 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-3xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
            SoundCloud Playlist Downloader
          </h1>

          {/* Subtitle */}
          <p className="text-md mx-auto mb-6 max-w-3xl leading-relaxed text-slate-300 md:text-lg">
            Download entire SoundCloud playlists in <strong className="text-purple-400">MP3</strong>{" "}
            or <strong className="text-cyan-400">WAV</strong> format.{" "}
            <strong className="text-emerald-400">Free</strong>,{" "}
            <strong className="text-blue-400">fast</strong>, and{" "}
            <strong className="text-pink-400">no registration required</strong>.
          </p>

          {/* Content Freshness Badge */}
          <div className="flex flex-col items-center gap-4">
            <ContentFreshnessBadge lastModified={new Date("2026-01-01")} />
            <div className="text-sm text-slate-400">
              Need to download a single track?{" "}
              <a
                href="/tools/soundcloud-to-wav"
                className="text-cyan-400 underline transition-colors hover:text-cyan-300"
              >
                Try SoundCloud to MP3/WAV Converter
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
              <h3 className="mb-3 text-2xl font-bold text-white">Ready to Download</h3>
              <p className="text-slate-300">Enter a SoundCloud playlist URL above to get started</p>
            </div>
          </div>
        )}

        {/* SEO Content Sections */}
        <div className="mx-auto mt-32 space-y-24">
          {/* What is this tool section */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10"></div>
            <div className="relative z-10">
              <h2 className="mb-8 text-3xl font-bold text-white">
                What is SoundCloud Playlist Downloader?
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">
                    Our <strong className="text-purple-300">SoundCloud playlist downloader</strong>{" "}
                    is a free online tool that allows you to download entire SoundCloud playlists
                    with just a few clicks. Whether you're a DJ building your music library, a
                    content creator needing background music, or a music enthusiast wanting offline
                    access, our tool makes it easy to batch download all tracks from any public
                    SoundCloud playlist.
                  </p>
                  <p className="text-lg leading-relaxed text-slate-300">
                    Unlike single-track downloaders, our{" "}
                    <strong className="text-purple-300">playlist downloader</strong> fetches all
                    tracks from a playlist at once, displays them in an organized list, and allows
                    you to download the entire collection or select individual tracks. Choose
                    between MP3 for smaller file sizes or WAV for uncompressed audio quality.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
                  <h3 className="mb-6 flex items-center text-xl font-semibold text-white">
                    <span className="mr-3 text-2xl">✨</span>
                    Key Benefits
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-purple-400"></div>
                      Batch download entire playlists instantly
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-pink-400"></div>
                      Individual track download option
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-emerald-400"></div>
                      MP3 and WAV format support
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                      Free and unlimited downloads
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
            <h2 className="mb-6 text-3xl font-bold text-white">Legal and Ethical Considerations</h2>
            <div className="prose prose-lg max-w-none text-slate-300 prose-headings:text-white prose-strong:font-bold prose-strong:text-orange-300 prose-ul:text-slate-300">
              <p>
                Our SoundCloud playlist downloader is provided as a tool for users who have the
                legal right to download content. It is your responsibility to ensure you have
                permission to download any content you access through this tool.
              </p>
              <ul className="list-inside list-disc space-y-3">
                <li>
                  Only download content you have permission to use or that is explicitly available
                  for free download
                </li>
                <li>
                  Respect copyright laws and the rights of content creators and copyright holders
                </li>
                <li>
                  Do not redistribute downloaded content without proper authorization from the
                  copyright holder
                </li>
                <li>
                  Use downloaded content in accordance with SoundCloud's Terms of Service and
                  applicable copyright laws
                </li>
              </ul>
              <p className="mt-6">
                By using this tool, you agree to use it responsibly and in compliance with all
                applicable laws and regulations. We are not responsible for any misuse of this tool
                or any copyright violations.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
