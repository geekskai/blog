"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"

interface PlaylistInputProps {
  url: string
  onUrlChange: (url: string) => void
  format: "mp3" | "wav"
  onFormatChange: (format: "mp3" | "wav") => void
  isTrackError: boolean
  onFetchPlaylist: () => void
  isLoading: boolean
  error?: string
}

export default function PlaylistInput({
  url,
  onUrlChange,
  format,
  onFormatChange,
  isTrackError,
  onFetchPlaylist,
  isLoading,
  error,
}: PlaylistInputProps) {
  const t = useTranslations("SoundCloudPlaylistDownloader")
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading && url.trim()) {
      onFetchPlaylist()
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm sm:rounded-2xl">
        <div className="flex flex-col items-center justify-between gap-2 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 px-3 py-2.5 sm:px-4 sm:py-3 md:flex-row md:gap-4 md:py-3 lg:px-6">
          <h2 className="text-sm font-semibold text-white sm:text-base md:text-xl">
            {t("form_title")}
          </h2>
          <div className="text-xs text-slate-400 sm:text-sm md:text-base">
            {t("related_tool_text")} 👉
            <Link
              href="/tools/soundcloud-to-wav"
              target="_blank"
              className="text-cyan-400 underline transition-colors hover:text-cyan-300"
            >
              {t("related_tool_link")}
            </Link>
          </div>
        </div>
        <div className="space-y-2 p-3 sm:p-4 md:p-5 lg:p-6">
          {/* <div className="mb-3 flex flex-col-reverse justify-between gap-2 text-sm font-semibold text-white/90 md:flex-row">
            {t("form_label_playlist_url")}
            <div className="text-sm text-slate-400">
              {t("related_tool_text")} 👉
              <Link
                href="/tools/soundcloud-to-wav"
                target="_blank"
                className="text-cyan-400 underline transition-colors hover:text-cyan-300"
              >
                {t("related_tool_link")}
              </Link>
            </div>
          </div> */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-white/5 p-1.5 backdrop-blur-sm sm:left-4 sm:p-2">
              <span className="text-base sm:text-xl">🔗</span>
            </div>
            <input
              type="text"
              value={url}
              suppressHydrationWarning
              onChange={(e) => onUrlChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="https://soundcloud.com/username/sets/playlist-name"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-base text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:py-4 sm:pl-16 sm:pr-6 sm:text-lg"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
            <button
              type="button"
              onClick={onFetchPlaylist}
              disabled={isLoading || !url.trim()}
              className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-lg sm:px-6 sm:py-3 sm:text-base md:min-h-[44px]"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin sm:h-5 sm:w-5"
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
                    <span>{t("form_button_loading")}</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg sm:text-xl">🔍</span>
                    <span>{t("form_button_fetch")}</span>
                  </>
                )}
              </span>
            </button>

            {isTrackError ? (
              <Link
                href="/tools/soundcloud-to-wav"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-emerald-200 sm:px-4"
              >
                <span>{t("related_tool_text")} 👉</span>
                <span>{t("error_track_url_link")}</span>
                <span className="text-lg sm:text-xl">🔗</span>
              </Link>
            ) : null}

            <select
              value={format}
              onChange={(e) => onFormatChange(e.target.value as "mp3" | "wav")}
              className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:rounded-lg sm:py-3 sm:text-base md:w-32"
              disabled={isLoading}
            >
              <option value="mp3" className="bg-slate-900">
                {t("form_select_format_mp3")}
              </option>
              <option value="wav" className="bg-slate-900">
                {t("form_select_format_wav")}
              </option>
            </select>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-900/20 p-2.5 backdrop-blur-sm sm:mt-5 sm:p-3 md:mt-6 md:p-4">
              <div className="flex flex-col flex-wrap items-center gap-1.5 text-red-400 sm:gap-2 md:flex-row md:gap-3">
                <span className="text-lg sm:text-xl">⚠️</span>
                <span className="text-center text-xs font-medium sm:text-sm md:text-left">
                  {error}
                </span>
                {/* {isTrackError ? (
                  <Link
                    href="/tools/soundcloud-to-wav"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-emerald-200 sm:px-4"
                  >
                    <span>🔗</span>
                    <span>{t("error_track_url_link")}</span>
                  </Link>
                ) : null} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
