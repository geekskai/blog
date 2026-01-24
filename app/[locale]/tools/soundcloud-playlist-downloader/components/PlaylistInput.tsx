"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"

interface PlaylistInputProps {
  url: string
  onUrlChange: (url: string) => void
  format: "mp3" | "wav"
  onFormatChange: (format: "mp3" | "wav") => void
  onFetchPlaylist: () => void
  isLoading: boolean
  error?: string
}

export default function PlaylistInput({
  url,
  onUrlChange,
  format,
  onFormatChange,
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
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
        <div className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 px-4 py-3">
          <h2 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
            {t("form_title")}
          </h2>
        </div>
        <div className="space-y-2 p-4">
          <div className="mb-3 flex flex-col-reverse justify-between gap-2 text-sm font-semibold text-white/90 md:flex-row">
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
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-white/5 p-2 backdrop-blur-sm">
              <span className="text-xl">🔗</span>
            </div>
            <input
              type="text"
              value={url}
              suppressHydrationWarning
              onChange={(e) => onUrlChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="https://soundcloud.com/username/sets/playlist-name"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-4 pl-16 pr-6 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onFetchPlaylist}
              disabled={isLoading || !url.trim()}
              className="group relative flex-1 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
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
                    <span>{t("form_button_loading")}</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🔍</span>
                    <span>{t("form_button_fetch")}</span>
                  </>
                )}
              </span>
            </button>

            <select
              value={format}
              onChange={(e) => onFormatChange(e.target.value as "mp3" | "wav")}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:w-32"
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
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-900/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-red-400">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
