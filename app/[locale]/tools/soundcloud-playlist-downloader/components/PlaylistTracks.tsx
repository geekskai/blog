"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import type { PlaylistTrack, DownloadFormat } from "../types"
import Image from "next/image"
import { createDownloadLink, getSafeFileName } from "../lib/utils"

interface PlaylistTracksProps {
  tracks: PlaylistTrack[]
  onDownloadAll: () => void
  isDownloading: boolean
  format: DownloadFormat
}

interface TrackDownloadState {
  [key: number | string]: boolean
}

export default function PlaylistTracks({
  tracks,
  onDownloadAll,
  isDownloading,
  format,
}: PlaylistTracksProps) {
  const t = useTranslations("SoundCloudPlaylistDownloader")
  const [downloadingTracks, setDownloadingTracks] = useState<TrackDownloadState>({})

  const handleDownloadTrack = async (track: PlaylistTrack) => {
    const trackKey = track.id || track.url

    // Prevent duplicate downloads
    if (downloadingTracks[trackKey]) {
      return
    }

    try {
      setDownloadingTracks((prev) => ({ ...prev, [trackKey]: true }))

      // Call download API
      const downloadResult = await fetch("/api/download-soundcloud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: track.url }),
      })

      if (!downloadResult.ok) {
        throw new Error(`Failed to download track`)
      }

      // Get audio blob
      const blob = await downloadResult.blob()

      // Create download link
      const fileName = getSafeFileName(track.title, format)
      createDownloadLink(blob, fileName)

      console.log(`Downloaded: ${track.title} (${blob.size} bytes)`)
    } catch (error) {
      console.error(`Failed to download track (${track.title}):`, error)
      alert(`${t("playlist_tracks_download")} ${track.title} ${t("error_network")}`)
    } finally {
      setDownloadingTracks((prev) => {
        const newState = { ...prev }
        delete newState[trackKey]
        return newState
      })
    }
  }

  if (tracks.length === 0) {
    return null
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-white">
            {t("playlist_tracks_title")} ({tracks.length})
          </h2>
          <p className="text-sm text-slate-400">{t("playlist_tracks_subtitle")}</p>
        </div>
        <button
          onClick={onDownloadAll}
          disabled={isDownloading}
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-base font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
          <span className="relative flex items-center gap-2">
            {isDownloading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{t("playlist_tracks_downloading")}</span>
              </>
            ) : (
              <>
                <span className="text-xl">⬇️</span>
                <span>{t("playlist_tracks_download_all")}</span>
              </>
            )}
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {tracks.map((track, index) => {
          const trackKey = track.id || track.url
          const isDownloadingTrack = downloadingTracks[trackKey] || false
          const artworkUrl = track.artworkUrl?.replace("-large", "-t500x500") || ""

          return (
            <div
              key={trackKey}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            >
              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                  {/* Artwork */}
                  {artworkUrl && (
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg shadow-purple-500/25 md:h-28 md:w-28">
                      <Image
                        src={artworkUrl}
                        alt={track.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Track Info */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white md:text-2xl">{track.title}</h3>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-base text-slate-300">{track.artist}</span>
                        <span className="text-sm text-slate-500">#{index + 1}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleDownloadTrack(track)}
                        disabled={isDownloadingTrack || isDownloading}
                        className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                        <span className="relative flex items-center gap-2">
                          {isDownloadingTrack ? (
                            <>
                              <svg
                                className="h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <span>{t("playlist_tracks_downloading")}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-base">⬇️</span>
                              <span>{t("playlist_tracks_download")}</span>
                            </>
                          )}
                        </span>
                      </button>

                      {track.url && (
                        <a
                          href={track.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10"
                        >
                          <span className="mr-2 text-base">🔗</span>
                          <span>{t("playlist_tracks_view_soundcloud")}</span>
                        </a>
                      )}

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur-sm">
                        {format.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
