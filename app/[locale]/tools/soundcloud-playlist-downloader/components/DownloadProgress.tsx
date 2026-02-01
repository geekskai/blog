"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { DownloadProgress as DownloadProgressType } from "../types"

interface DownloadProgressProps {
  progress: DownloadProgressType
  className?: string
}

export default function DownloadProgress({ progress, className = "" }: DownloadProgressProps) {
  const t = useTranslations("SoundCloudPlaylistDownloader")
  const { current, total, currentTrack, status } = progress

  if (status === "idle") {
    return null
  }

  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm sm:rounded-2xl sm:p-5 md:p-6 lg:p-8">
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-snug text-white sm:text-lg md:text-lg">
              {t("download_progress_title")}
            </h3>
            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
              {current} of {total} {t("download_progress_tracks")}
            </p>
          </div>
          <div className="shrink-0 text-xl font-bold text-purple-300 sm:text-2xl md:text-2xl">
            {percentage}%
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <div className="h-2 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm sm:h-2.5">
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
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-300 sm:text-sm">
            <span className="shrink-0 text-base sm:text-xl">🎵</span>
            <span className="min-w-0 truncate">
              {t("download_progress_downloading")} {currentTrack}
            </span>
          </div>
        )}

        {status === "error" && (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-900/20 p-2.5 sm:mt-4 sm:p-3">
            <div className="flex items-center gap-2 text-xs text-red-400 sm:text-sm">
              <span>⚠️</span>
              <span>{t("download_progress_error")}</span>
            </div>
          </div>
        )}

        {status === "completed" && (
          <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-2.5 sm:mt-4 sm:p-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400 sm:text-sm">
              <span>✅</span>
              <span>{t("download_progress_completed")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
