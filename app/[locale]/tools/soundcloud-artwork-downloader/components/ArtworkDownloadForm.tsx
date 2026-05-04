"use client"

import React from "react"
import { Link } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import type { FormEventHandler } from "react"
import type { LoadingState } from "../hooks/useSoundCloudArtworkDownloadForm"

interface ArtworkDownloadFormProps {
  formId: string
  url: string
  placeholder: string
  loadingState: LoadingState
  canDownload: boolean
  downloading: boolean
  errorMessage: string
  isPlaylistError: boolean
  infoProgress: number
  infoStatus: string
  downloadProgress: number
  downloadStatus: string
  onUrlChange: (newUrl: string) => void
  onSubmit: FormEventHandler<HTMLFormElement>
  onDownload: () => void
}

const LoadingSpinner = () => (
  <svg
    className="h-5 w-5 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const ProgressBar = ({ progress, status }: { progress: number; status: string }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs text-white/90">
      <span className={progress > 0 ? "truncate" : ""}>{status || "Processing..."}</span>
      {progress > 0 ? (
        <span className="ml-2 flex-shrink-0 font-semibold text-pink-300">{progress}%</span>
      ) : null}
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
      {progress > 0 ? (
        <div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-500 shadow-lg shadow-pink-500/40 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      ) : (
        <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-fuchsia-500/50 via-pink-500/50 to-orange-500/50" />
      )}
    </div>
  </div>
)

export default function ArtworkDownloadForm({
  formId,
  url,
  placeholder,
  loadingState,
  canDownload,
  downloading,
  errorMessage,
  isPlaylistError,
  infoProgress,
  infoStatus,
  downloadProgress,
  downloadStatus,
  onUrlChange,
  onSubmit,
  onDownload,
}: ArtworkDownloadFormProps) {
  const t = useTranslations("SoundCloudArtworkDownloader")
  const isLoading = loadingState === "loading"

  return (
    <div className="space-y-2">
      <form id={formId} onSubmit={onSubmit} className="space-y-2 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col-reverse justify-between gap-3 text-xs text-slate-400 md:flex-row md:text-sm">
            <span className="text-sm font-semibold text-white/90 md:text-base">
              {t("form_label_soundcloud_link")}
            </span>
            <div className="flex flex-col gap-2 text-xs text-slate-400 md:flex-row md:gap-3 md:text-sm">
              <span>{t("related_tool_text")} 👉</span>
              <Link
                href="/tools/soundcloud-downloader"
                target="_blank"
                className="text-emerald-400 underline transition-colors hover:text-emerald-300"
              >
                {t("related_tool_link")}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-white/5 p-1 backdrop-blur-sm">
              <span className="text-lg md:text-xl">🖼️</span>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-14 pr-4 text-base text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-pink-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/20 md:pl-16 md:pr-6 md:text-lg"
            />
          </div>
        </div>

        <div className="space-y-2 md:space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="group overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 px-2 py-1 text-base font-medium text-white shadow-lg transition-all hover:from-fuchsia-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3 md:text-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span>{t("form_button_fetching")}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg md:text-xl">🔍</span>
                      <span>{t("form_button_get_artwork")}</span>
                    </>
                  )}
                </span>
              </button>
              {isLoading ? <ProgressBar progress={infoProgress} status={infoStatus} /> : null}
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <button
                type="button"
                onClick={onDownload}
                disabled={downloading || !url.trim() || isLoading || !canDownload}
                className="group overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-2 py-1 text-base font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3 md:text-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  {downloading ? (
                    <>
                      <LoadingSpinner />
                      <span>{t("form_button_downloading")}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg md:text-xl">⬇️</span>
                      <span>{t("form_button_download_artwork")}</span>
                    </>
                  )}
                </span>
              </button>
              {downloading ? (
                <ProgressBar progress={downloadProgress} status={downloadStatus} />
              ) : null}
            </div>
          </div>
        </div>
      </form>

      {errorMessage ? (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-900/20 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3 text-red-400">
            <span className="text-xl">⚠️</span>
            <div className="flex-1 space-y-3 text-sm font-medium">
              <p>{errorMessage}</p>
              {isPlaylistError ? (
                <Link
                  href="/tools/soundcloud-downloader"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-emerald-200"
                >
                  <span>🎵</span>
                  <span>{t("error_playlist_url_link")}</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
