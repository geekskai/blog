"use client"

import React, { useState, useCallback } from "react"
import PlaylistInput from "./components/PlaylistInput"
import PlaylistTracks from "./components/PlaylistTracks"
import DownloadProgress from "./components/DownloadProgress"
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
      </div>
    </div>
  )
}
