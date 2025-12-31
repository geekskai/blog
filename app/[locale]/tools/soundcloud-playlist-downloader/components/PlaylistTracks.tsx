"use client"

import React from "react"
import type { PlaylistTrack } from "../types"
import Image from "next/image"

interface PlaylistTracksProps {
  tracks: PlaylistTrack[]
  onDownloadAll: () => void
  isDownloading: boolean
}

export default function PlaylistTracks({
  tracks,
  onDownloadAll,
  isDownloading,
}: PlaylistTracksProps) {
  if (tracks.length === 0) {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-white">Playlist Tracks ({tracks.length})</h2>
          <p className="text-sm text-slate-400">Ready to download all tracks</p>
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
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <span className="text-xl">⬇️</span>
                <span>Download All</span>
              </>
            )}
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {tracks.map((track, index) => (
          <div
            key={track.id || index}
            className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            <div className="flex items-center gap-4">
              {track.artworkUrl && (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 border-white/20">
                  <Image
                    src={track.artworkUrl.replace("-large", "-t300x300")}
                    width={60}
                    height={60}
                    alt={track.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                <p className="text-sm text-slate-400">{track.artist}</p>
              </div>
              <div className="text-sm text-slate-500">#{index + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
