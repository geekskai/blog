"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  Download,
  Music,
  Link2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  ArrowRight,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/app/i18n/navigation"
import {
  fetchYouTubeMetadataClient,
  getDownloaderErrorMessage,
  mapDownloaderApiError,
  type DownloaderApiErrorCode,
} from "@/components/downloader/shared"
import DownloadShareModal from "@/components/download-quota/DownloadShareModal"
import { useDownloadQuota } from "@/components/download-quota/useDownloadQuota"
import { parseYouTubeUrl } from "@/app/lib/youtube/parse-url"

type VideoPreview = {
  videoId: string
  title: string
  thumbnail: string | null
  author: string | null
  durationSeconds: number | null
}

type ApiErrorCode = DownloaderApiErrorCode

function formatDuration(seconds: number | null): string | null {
  if (seconds == null || seconds <= 0) return null
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }
  return `${m}:${s.toString().padStart(2, "0")}`
}

function downloadHref(videoId: string, qualityId: string): string {
  const q = new URLSearchParams({ videoId, quality: qualityId })
  return `/api/audio/download?${q}`
}

type AudioDownloaderProps = {
  variant?: "hero" | "default"
  autoFocus?: boolean
}

const BTN =
  "inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold leading-none transition-[background-color,border-color,opacity] duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-45 md:min-h-12 md:text-sm"
const DEFAULT_AUDIO_QUALITY_ID = "251"
const SHORTS_DOWNLOADER_PATH = "/tools/youtube-shorts-downloader"

type AudioDownloaderT = ReturnType<typeof useTranslations<"AudioDownloader">>

type VideoResultCardProps = {
  video: VideoPreview
  downloading: boolean
  downloadProgress: number
  onDownload: () => void
  t: AudioDownloaderT
}

function VideoResultCard({
  video,
  downloading,
  downloadProgress,
  onDownload,
  t,
}: VideoResultCardProps) {
  const duration = formatDuration(video.durationSeconds)

  return (
    <article className="overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-slate-950/90 via-slate-900/50 to-slate-950/90 md:rounded-2xl">
      <header className="border-b border-white/10 px-3.5 py-2 md:px-4 md:py-2.5 lg:px-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100 md:px-3 md:text-[11px]">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {t("ready")}
        </span>
      </header>

      <div className="p-3.5 md:p-4 lg:p-5">
        <div className="flex gap-3 md:gap-4 lg:gap-5">
          {video.thumbnail ? (
            <div className="relative h-[122px] w-[217px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black shadow-lg shadow-black/40 md:h-[138px] md:w-[246px] md:rounded-xl lg:h-[152px] lg:w-[270px]">
              <Image
                src={video.thumbnail}
                alt=""
                fill
                sizes="(max-width: 767px) 217px, (max-width: 1023px) 246px, 270px"
                className="object-cover"
                unoptimized
              />
              {duration ? (
                <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white">
                  {duration}
                </span>
              ) : null}
            </div>
          ) : (
            <div
              className="flex h-[122px] w-[217px] shrink-0 items-center justify-center rounded-lg border border-dashed border-white/15 bg-slate-900/80 md:h-[138px] md:w-[246px] md:rounded-xl lg:h-[152px] lg:w-[270px]"
              aria-hidden
            >
              <Music className="h-8 w-8 text-slate-600" />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
            <h3 className="line-clamp-3 text-base font-semibold leading-5 text-slate-50 md:line-clamp-2 md:text-lg md:leading-snug lg:text-xl">
              {video.title}
            </h3>
            {video.author ? (
              <p className="mt-1 line-clamp-2 text-base leading-5 text-slate-400 md:text-lg">
                {video.author}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-3 border-t border-white/10 pt-3 md:mt-4 md:pt-4">
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className={`${BTN} w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:brightness-110`}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            <span>{downloading ? t("downloading") : t("button_download")}</span>
          </button>

          {downloading ? (
            <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 md:px-3.5 md:py-3">
              <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
                <span>{t("download_preparing_file")}</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <p className="mt-3 text-center text-xs leading-relaxed text-emerald-400 md:text-left md:text-base">
          {t("download_note")}
        </p>
      </div>
    </article>
  )
}

export default function AudioDownloader({
  variant = "default",
  autoFocus = false,
}: AudioDownloaderProps) {
  const t = useTranslations("AudioDownloader")
  const searchParams = useSearchParams()
  const router = useRouter()
  const initializedFromQuery = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [errorKey, setErrorKey] = useState<ApiErrorCode | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [video, setVideo] = useState<VideoPreview | null>(null)
  const downloadQuota = useDownloadQuota()

  useEffect(() => {
    if (!autoFocus) return
    const mq = window.matchMedia("(min-width: 640px)")
    if (mq.matches) inputRef.current?.focus({ preventScroll: true })
  }, [autoFocus])

  const fetchVideo = useCallback(
    async (inputUrl?: string) => {
      const trimmed = (inputUrl ?? url).trim()
      setErrorKey(null)
      setDownloadError(null)
      setVideo(null)
      setDownloadProgress(0)

      const parsed = parseYouTubeUrl(trimmed)
      if (parsed?.kind === "shorts") {
        router.push(`${SHORTS_DOWNLOADER_PATH}?url=${encodeURIComponent(trimmed)}`)
        return
      }

      setLoading(true)
      try {
        const videoId = parsed?.kind === "video" ? parsed.videoId : null
        if (!videoId) {
          setErrorKey("invalid_url")
          return
        }

        const metadata = await fetchYouTubeMetadataClient(videoId, t("default_audio_title"))
        setVideo({
          videoId: metadata.videoId,
          title: metadata.title,
          thumbnail: metadata.thumbnail,
          author: metadata.author,
          durationSeconds: metadata.durationSeconds,
        })
      } catch (error) {
        setErrorKey(mapDownloaderApiError(error instanceof Error ? error.message : undefined))
      } finally {
        setLoading(false)
      }
    },
    [router, t, url]
  )

  useEffect(() => {
    if (initializedFromQuery.current) return
    const incoming = searchParams.get("url")?.trim()
    if (!incoming) return
    const parsed = parseYouTubeUrl(incoming)
    if (parsed?.kind !== "video") return
    initializedFromQuery.current = true
    setUrl(incoming)
    void fetchVideo(incoming)
  }, [fetchVideo, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || loading) return
    void fetchVideo()
  }

  const handleDownload = () => {
    if (!video || downloading) return

    const quotaCheck = downloadQuota.checkQuotaBeforeDownload()
    if (!quotaCheck.allowed) {
      if (quotaCheck.message) {
        setDownloadError(quotaCheck.message)
      }
      return
    }

    setDownloading(true)
    setDownloadError(null)
    setDownloadProgress(10)
    const intervalId = window.setInterval(() => {
      setDownloadProgress((current) => Math.min(current + 8, 90))
    }, 350)
    window.location.assign(downloadHref(video.videoId, DEFAULT_AUDIO_QUALITY_ID))
    downloadQuota.consumeDownloadQuota()
    window.setTimeout(() => {
      window.clearInterval(intervalId)
      setDownloading(false)
      setDownloadProgress(0)
    }, 15000)
  }

  const isHero = variant === "hero"
  const shellClass = isHero
    ? "w-full rounded-xl border border-white/10 bg-slate-900/50 p-3.5 backdrop-blur-sm md:rounded-2xl md:p-5 lg:p-6"
    : "mx-auto w-full max-w-2xl rounded-xl border border-white/10 bg-slate-900/50 p-3.5 backdrop-blur-sm md:max-w-3xl md:rounded-2xl md:p-6 lg:max-w-4xl lg:p-8"

  const errorMessage = getDownloaderErrorMessage(t, errorKey)
  const downloadFeedbackMessage = errorMessage || downloadError || downloadQuota.quotaMessage

  return (
    <>
      <div className={shellClass}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="audio-url" className="sr-only">
            {t("input_label")}
          </label>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[minmax(0,1fr)_auto] md:items-stretch md:gap-3 lg:gap-4">
            <div className="relative min-w-0 flex-1">
              <Link2
                className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500"
                aria-hidden
              />
              <input
                ref={inputRef}
                id="audio-url"
                type="url"
                inputMode="url"
                autoComplete="off"
                enterKeyHint="go"
                placeholder={t("input_placeholder")}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-950/60 py-3 pl-10 pr-3 text-[15px] leading-6 text-slate-100 transition-[border-color,box-shadow] duration-200 placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 md:min-h-12 md:py-3.5 md:pl-11 md:pr-4 md:text-base"
              />
            </div>

            <div className="flex flex-col gap-2 md:shrink-0 md:flex-row md:items-stretch md:gap-2">
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className={`${BTN} order-1 w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:brightness-110 md:order-2 md:min-w-[136px] lg:min-w-[148px]`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden />
                )}
                <span>{loading ? t("loading") : t("button_fetch")}</span>
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-[11px] leading-relaxed text-emerald-400 md:mt-2.5 md:text-left md:text-base">
            {t("hint")}
          </p>
        </form>

        <div className="mb-3.5 mt-3 md:mb-4">
          {downloadFeedbackMessage ? (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2.5 text-[13px] leading-5 text-orange-100 md:px-3.5 md:py-3 md:text-sm"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" aria-hidden />
              <p>{downloadFeedbackMessage}</p>
            </div>
          ) : null}

          {downloadQuota.unlockSuccessMessage ? (
            <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2.5 text-[13px] leading-5 text-emerald-100 md:px-3.5 md:py-3 md:text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
              <p>{downloadQuota.unlockSuccessMessage}</p>
            </div>
          ) : null}

          {loading && !video ? (
            <p className="flex items-center justify-center gap-2 py-2 text-[13px] text-slate-400 md:text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-400" aria-hidden />
              {t("loading")}
            </p>
          ) : null}
        </div>

        {video ? (
          <VideoResultCard
            video={video}
            downloading={downloading}
            downloadProgress={downloadProgress}
            onDownload={handleDownload}
            t={t}
          />
        ) : null}

        {isHero ? (
          <ol className="mt-5 grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10 sm:pt-6 md:mt-6 lg:mt-7">
            {(["step_1", "step_2", "step_3"] as const).map((key, i) => (
              <li
                key={key}
                className="flex items-start gap-2.5 sm:flex-col sm:items-center sm:px-3 sm:text-center"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-200">
                  {i + 1}
                </span>
                <span className="text-xs leading-snug text-slate-400 sm:text-[13px] md:text-sm">
                  {t(key)}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
      <DownloadShareModal
        isOpen={downloadQuota.showShareModal}
        shareLink={downloadQuota.shareLink}
        unlockAmount={downloadQuota.quotaConfig.shareBonusClicks}
        onClose={downloadQuota.closeShareModal}
        onUnlock={downloadQuota.handleShareUnlock}
      />
    </>
  )
}
