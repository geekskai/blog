"use client"

import React from "react"
import type { DownloadProgress as DownloadProgressType } from "../types"

interface DownloadProgressProps {
  progress: DownloadProgressType
  className?: string
}

export default function DownloadProgress({ progress, className = "" }: DownloadProgressProps) {
  const { current, total, currentTrack, status } = progress

  if (status === "idle") {
    return null
  }

  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Download Progress</h3>
            <p className="text-sm text-slate-400">
              {current} of {total} tracks
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-300">{percentage}%</div>
        </div>

        <div className="mb-4">
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
            {percentage > 0 ? (
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 shadow-lg shadow-purple-500/50 transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            ) : (
              <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-cyan-500/50" />
            )}
          </div>
        </div>

        {currentTrack && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="text-xl">🎵</span>
            <span className="truncate">Downloading: {currentTrack}</span>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3">
            <div className="flex items-center gap-2 text-sm text-red-400">
              <span>⚠️</span>
              <span>Some tracks failed to download. Check console for details.</span>
            </div>
          </div>
        )}

        {status === "completed" && (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-3">
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <span>✅</span>
              <span>All tracks downloaded successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
