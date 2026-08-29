"use client"

import { Link } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import type { FormEventHandler } from "react"
import type { DownloadFormat, LoadingState } from "../hooks/useSoundCloudTrackDownloadForm"

type TrackNamespace = "SoundCloudToMP3" | "SoundCloudToWAV"
type PlaylistNamespace = "SoundCloudPlaylistDownloader"
type FormVariant = "track" | "playlist"

interface BaseTrackDownloadFormProps {
  namespace: TrackNamespace | PlaylistNamespace
  variant: FormVariant
  formId: string
  url: string
  placeholder: string
  relatedToolHref: string
  extension: DownloadFormat
  loadingState: LoadingState
  errorMessage: string
  showFormatSelect?: boolean
  onUrlChange: (newUrl: string) => void
  onExtensionChange: (format: DownloadFormat) => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

interface TrackVariantProps extends BaseTrackDownloadFormProps {
  variant: "track"
  downloading: boolean
  isPlaylistError: boolean
  infoProgress: number
  infoStatus: string
  downloadProgress: number
  downloadStatus: string
  onDownload: () => void
}

interface PlaylistVariantProps extends BaseTrackDownloadFormProps {
  variant: "playlist"
  isTrackError: boolean
}

type TrackDownloadFormProps = TrackVariantProps | PlaylistVariantProps

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

interface ProgressBarProps {
  progress: number
  status: string
}

const ProgressBar = ({ progress, status }: ProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs text-white/90">
      <span className={progress > 0 ? "truncate" : ""}>{status || "Processing..."}</span>
      {progress > 0 && (
        <span className="ml-2 flex-shrink-0 font-semibold text-purple-300">{progress}%</span>
      )}
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
      {progress > 0 ? (
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 shadow-lg shadow-purple-500/50 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      ) : (
        <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-cyan-500/50" />
      )}
    </div>
  </div>
)

export default function TrackDownloadForm(props: TrackDownloadFormProps) {
  const {
    namespace,
    variant,
    formId,
    url,
    placeholder,
    relatedToolHref,
    extension,
    loadingState,
    errorMessage,
    showFormatSelect = true,
    onUrlChange,
    onExtensionChange,
    onSubmit,
  } = props
  const t = useTranslations(namespace)
  const isTrackMode = variant === "track"
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
                href={relatedToolHref}
                target="_blank"
                className="text-emerald-400 underline transition-colors hover:text-emerald-300"
              >
                {t("related_tool_link")}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-white/5 p-1 backdrop-blur-sm">
              <span className="text-lg md:text-xl">🔗</span>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-14 pr-4 text-base text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 md:pl-16 md:pr-6 md:text-lg"
            />
          </div>
        </div>

        <div className="space-y-2 md:space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="group overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-2 py-1 text-base font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3 md:text-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span>
                        {isTrackMode ? t("form_button_fetching") : t("form_button_loading")}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg md:text-xl">🔍</span>
                      <span>
                        {isTrackMode ? t("form_button_get_info") : t("form_button_fetch")}
                      </span>
                    </>
                  )}
                </span>
              </button>
              {isTrackMode && isLoading && (
                <ProgressBar progress={props.infoProgress} status={props.infoStatus} />
              )}
            </div>

            {isTrackMode ? (
              <div className="flex flex-1 flex-col gap-3">
                <button
                  type="button"
                  onClick={props.onDownload}
                  disabled={props.downloading || !url.trim() || isLoading}
                  className="group overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-2 py-1 text-base font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3 md:text-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    {props.downloading ? (
                      <>
                        <LoadingSpinner />
                        <span>{t("form_button_downloading")}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg md:text-xl">⬇️</span>
                        <span>{t("form_button_download")}</span>
                      </>
                    )}
                  </span>
                </button>
                {props.downloading && (
                  <ProgressBar progress={props.downloadProgress} status={props.downloadStatus} />
                )}
              </div>
            ) : null}

            {showFormatSelect ? (
              <div className="flex w-full flex-col gap-3 md:w-32">
                <select
                  value={extension}
                  onChange={(e) => onExtensionChange(e.target.value as DownloadFormat)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-base text-white backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 md:px-6 md:py-3 md:text-lg"
                >
                  <option value="mp3" className="bg-slate-900">
                    {t("form_select_format_mp3")}
                  </option>
                  <option value="wav" className="bg-slate-900">
                    {t("form_select_format_wav")}
                  </option>
                </select>
              </div>
            ) : null}
          </div>
        </div>
      </form>

      {errorMessage && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-900/20 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3 text-red-400">
            <span className="text-xl">⚠️</span>
            <div className="flex-1 space-y-3 text-sm font-medium">
              <p>{errorMessage}</p>
              {isTrackMode && props.isPlaylistError && (
                <Link
                  href="/tools/soundcloud-playlist-downloader"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-emerald-200"
                >
                  <span>🎵</span>
                  <span>{t("error_playlist_url_link")}</span>
                </Link>
              )}
              {!isTrackMode && props.isTrackError && (
                <Link
                  href="/tools/soundcloud-to-wav"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-emerald-200"
                >
                  <span>🎵</span>
                  <span>{t("error_track_url_link")}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
