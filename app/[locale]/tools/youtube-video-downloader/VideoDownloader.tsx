"use client"

import React, { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import axios from "axios"
import {
  Download,
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
import { useDownloadRetryCooldown } from "@/components/downloader/useDownloadRetryCooldown"
import { parseYouTubeUrl } from "@/app/lib/youtube/parse-url"

type VideoPreview = {
  videoId: string
  title: string
  thumbnail: string | null
  author: string | null
  durationSeconds: number | null
}

type ApiErrorCode = DownloaderApiErrorCode

const VIDEO_QUALITY_OPTIONS = [
  { label: "1080p", value: "137" },
  { label: "720p", value: "247" },
  { label: "480p", value: "135" },
  { label: "360p", value: "134" },
  { label: "240p", value: "133" },
] as const

const DEFAULT_VIDEO_QUALITY = "247"
const VIDEO_QUALITY_LABEL = VIDEO_QUALITY_OPTIONS.map((q) => q.label).join(" / ")
const SHORTS_DOWNLOADER_PATH = "/tools/youtube-shorts-downloader"
const SIMULATED_PROGRESS_DURATION_MS = 60_000
const SIMULATED_PROGRESS_TICK_MS = 200

function buildShortsDownloaderHref(shortsUrl: string): string {
  return `${SHORTS_DOWNLOADER_PATH}?url=${encodeURIComponent(shortsUrl.trim())}`
}

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function sanitizeFileName(name: string): string {
  const normalized = name.trim().replace(/[\\/:*?"<>|]+/g, "_")
  if (!normalized) return "youtube-video"
  return normalized
}

function downloadBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(objectUrl)
}

function downloadHref(videoId: string, qualityId: string): string {
  const q = new URLSearchParams({ videoId, quality: qualityId })
  return `/api/video/download?${q}`
}

type VideoDownloaderProps = {
  variant?: "hero" | "default"
  autoFocus?: boolean
}

const BTN =
  "inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold leading-none transition-[background-color,border-color,opacity] duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-45 md:min-h-12 md:text-sm"

type VideoDownloaderT = ReturnType<typeof useTranslations<"VideoDownloader">>

type VideoResultCardProps = {
  video: VideoPreview
  t: VideoDownloaderT
}

function VideoResultCard({ video, t }: VideoResultCardProps) {
  const duration = formatDuration(video.durationSeconds)

  return (
    <article className="overflow-hidden rounded-xl border border-primary-500/20 bg-gradient-to-br from-slate-950/90 via-slate-900/50 to-slate-950/90 md:rounded-2xl">
      <header className="border-b border-white/10 px-3.5 py-2 md:px-4 md:py-2.5 lg:px-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-400/35 bg-primary-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-100 md:px-3 md:text-[11px]">
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
              <Download className="h-8 w-8 text-slate-600" />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
            <h3 className="line-clamp-3 text-base font-semibold leading-5 text-slate-50 md:line-clamp-2 md:text-lg md:leading-snug lg:text-xl">
              {video.title}
            </h3>
            {video.author ? (
              <p className="mt-1 line-clamp-2 text-base leading-5 text-slate-400 md:text-lg">{video.author}</p>
            ) : null}
          </div>
        </div>

        <p className="mt-3 border-t border-white/10 pt-3 text-center text-xs leading-relaxed text-cyan-400 md:mt-4 md:pt-4 md:text-left md:text-base">
          {t("download_note", { qualities: VIDEO_QUALITY_LABEL })}
        </p>
      </div>
    </article>
  )
}

type DownloadFeedbackProps = {
  loading: boolean
  downloading: boolean
  errorMessage: string | null
  errorExtra?: ReactNode
  downloadError: string | null
  downloadSuccess: string | null
  downloadProgress: number
  t: VideoDownloaderT
}

function DownloadFeedback({
  loading,
  downloading,
  errorMessage,
  errorExtra,
  downloadError,
  downloadSuccess,
  downloadProgress,
  t,
}: DownloadFeedbackProps) {
  return (
    <div className="mb-3.5 md:mb-4" aria-live="polite" aria-busy={loading || downloading}>
      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2.5 text-[13px] leading-5 text-orange-100 md:px-3.5 md:py-3 md:text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" aria-hidden />
          <p>
            {errorMessage}
            {errorExtra}
          </p>
        </div>
      ) : null}

      {loading ? (
        <p className="flex items-center justify-center gap-2 py-2 text-[13px] text-slate-400 md:text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-primary-400" aria-hidden />
          {t("loading")}
        </p>
      ) : null}

      {downloading ? (
        <div className="mt-2 rounded-xl border border-primary-500/25 bg-primary-500/10 px-3 py-2.5 md:px-3.5 md:py-3">
          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
            <span>{t("download_progress_label")}</span>
            <span>{downloadProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400 transition-[width] duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      ) : null}

      {downloadError ? (
        <div
          role="alert"
          className="mt-2 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[13px] leading-5 text-rose-100 md:px-3.5 md:py-3 md:text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" aria-hidden />
          <p>{downloadError}</p>
        </div>
      ) : null}

      {downloadSuccess ? (
        <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2.5 text-[13px] leading-5 text-emerald-100 md:px-3.5 md:py-3 md:text-sm">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
          <p>{downloadSuccess}</p>
        </div>
      ) : null}
    </div>
  )
}

export default function VideoDownloader({ variant = "default", autoFocus = false }: VideoDownloaderProps) {
  const t = useTranslations("VideoDownloader")
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const initializedFromQuery = useRef(false)
  const progressTimerRef = useRef<number | null>(null)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [quality, setQuality] = useState<string>(DEFAULT_VIDEO_QUALITY)
  const [errorKey, setErrorKey] = useState<ApiErrorCode | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)
  const [video, setVideo] = useState<VideoPreview | null>(null)
  const { isDownloadCooldown, cooldownSecondsLeft, startCooldown, clearCooldown } =
    useDownloadRetryCooldown()

  useEffect(() => {
    if (!autoFocus) return
    const mq = window.matchMedia("(min-width: 640px)")
    if (mq.matches) inputRef.current?.focus({ preventScroll: true })
  }, [autoFocus])

  const stopProgressSimulation = useCallback(() => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }, [])

  const startProgressSimulation = useCallback(() => {
    stopProgressSimulation()
    const startedAt = Date.now()
    progressTimerRef.current = window.setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 99) return 99
        const elapsed = Date.now() - startedAt
        const ratio = Math.min(elapsed / SIMULATED_PROGRESS_DURATION_MS, 1)
        const target = Math.floor(ratio * 99)
        return Math.min(99, Math.max(prev, target))
      })
    }, SIMULATED_PROGRESS_TICK_MS)
  }, [stopProgressSimulation])

  const resetDownloadState = useCallback(() => {
    stopProgressSimulation()
    setDownloadError(null)
    setDownloadSuccess(null)
    setDownloadProgress(0)
  }, [stopProgressSimulation])

  const resetPreviewState = useCallback(() => {
    setVideo(null)
    setErrorKey(null)
    resetDownloadState()
    clearCooldown()
  }, [clearCooldown, resetDownloadState])

  const fetchVideo = useCallback(
    async (inputUrl?: string) => {
      const trimmed = (inputUrl ?? url).trim()
      setErrorKey(null)
      resetDownloadState()
      setVideo(null)

      const parsed = parseYouTubeUrl(trimmed)
      if (parsed?.kind === "shorts") {
        router.push(buildShortsDownloaderHref(trimmed))
        return
      }

      setLoading(true)
      try {
        const videoId = parsed?.kind === "video" ? parsed.videoId : null
        if (!videoId) {
          setErrorKey("invalid_url")
          return
        }
        const metadata = await fetchYouTubeMetadataClient(videoId, t("default_video_title"))
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
    [resetDownloadState, router, t, url]
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
    void fetchVideo(url.trim())
  }

  const handleDownload = async () => {
    const selectedVideo = video
    if (!selectedVideo || downloading || isDownloadCooldown) return

    setDownloadError(null)
    setDownloadSuccess(null)
    setDownloading(true)
    setDownloadProgress(0)
    startProgressSimulation()

    try {
      const initRes = await fetch(downloadHref(selectedVideo.videoId, quality), {
        redirect: "manual",
        cache: "no-store",
      })
      if (initRes.status !== 302) {
        const body = (await initRes.json().catch(() => ({}))) as { error?: string; message?: string }
        throw new Error(body.message || body.error || `${t("error_download_failed")} (${initRes.status})`)
      }
      const fileUrl = initRes.headers.get("Location")
      if (!fileUrl) {
        throw new Error(t("error_no_download_url"))
      }

      const response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob",
      })

      const contentType = String(response.headers["content-type"] || "")
      if (!contentType.includes("octet-stream") && !contentType.includes("video")) {
        const maybeText = await response.data.text()
        throw new Error(maybeText?.slice(0, 200) || t("error_invalid_media_response"))
      }

      const blob = response.data as Blob
      const fileName = `${sanitizeFileName(selectedVideo.title)}.mp4`

      stopProgressSimulation()
      setDownloadProgress(100)
      downloadBlob(blob, fileName)
      setDownloadSuccess(
        t("download_success", {
          filename: fileName,
          size: formatBytes(blob.size),
        })
      )
      setVideo(null)
    } catch (error) {
      setDownloadProgress(0)
      const message = error instanceof Error ? error.message : t("error_download_failed")
      const mappedError = mapDownloaderApiError(message)
      setDownloadError(getDownloaderErrorMessage(t, mappedError) ?? `${t("error_download_failed")} (${message})`)
      startCooldown()
    } finally {
      stopProgressSimulation()
      setDownloading(false)
    }
  }

  useEffect(() => () => stopProgressSimulation(), [stopProgressSimulation])

  const isHero = variant === "hero"
  const shellClass = isHero
    ? "w-full rounded-xl border border-white/10 bg-slate-900/50 p-3.5 backdrop-blur-sm md:rounded-2xl md:p-5 lg:p-6"
    : "mx-auto w-full max-w-2xl rounded-xl border border-white/10 bg-slate-900/50 p-3.5 backdrop-blur-sm md:max-w-3xl md:rounded-2xl md:p-6 lg:max-w-4xl lg:p-8"

  const errorMessage = getDownloaderErrorMessage(t, errorKey)
  const canDownload = Boolean(video)
  const downloadButtonLabel = downloading
    ? t("downloading")
    : isDownloadCooldown
      ? t("download_cooldown", { seconds: cooldownSecondsLeft })
      : t("button_download")

  return (
    <div className={shellClass}>
      {video ? (
        <div className="mb-2 md:mb-4">
          <VideoResultCard video={video} t={t} />
        </div>
      ) : null}

      <DownloadFeedback
        loading={loading}
        downloading={downloading}
        errorMessage={errorMessage}
        downloadError={downloadError}
        downloadSuccess={downloadSuccess}
        downloadProgress={downloadProgress}
        t={t}
      />

      <form onSubmit={handleSubmit}>
        <label htmlFor="video-url" className="sr-only">
          {t("input_label")}
        </label>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[minmax(0,1fr)_150px_auto] md:items-stretch md:gap-3 lg:grid-cols-[minmax(0,1fr)_170px_auto] lg:gap-4">
          <div className="relative min-w-0 flex-1">
            <Link2
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500"
              aria-hidden
            />
            <input
              ref={inputRef}
              id="video-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              enterKeyHint="go"
              placeholder={t("input_placeholder")}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                resetPreviewState()
              }}
              className="w-full rounded-xl border border-white/15 bg-slate-950/60 py-3 pl-10 pr-3 text-[15px] leading-6 text-slate-100 transition-[border-color,box-shadow] duration-200 placeholder:text-slate-500 focus:border-primary-400/60 focus:outline-none focus:ring-4 focus:ring-primary-500/20 md:min-h-12 md:py-3.5 md:pl-11 md:pr-4 md:text-base"
            />
          </div>

          <div className="relative min-w-0">
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-slate-950/60 py-3 pl-3 pr-3 text-[14px] text-slate-100 transition-[border-color,box-shadow] duration-200 focus:border-primary-400/60 focus:outline-none focus:ring-4 focus:ring-primary-500/20 md:min-h-12 md:py-3.5 md:text-sm"
            >
              {VIDEO_QUALITY_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 md:shrink-0 md:flex-row md:items-stretch md:gap-2">
            {canDownload ? (
              <button
                type="button"
                onClick={() => void handleDownload()}
                disabled={downloading || isDownloadCooldown}
                className={`${BTN} order-1 w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-900/30 hover:brightness-110 md:order-2 md:min-w-[136px] lg:min-w-[148px]`}
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Download className="h-4 w-4" aria-hidden />
                )}
                <span>{downloadButtonLabel}</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className={`${BTN} order-1 w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-900/30 hover:brightness-110 md:order-2 md:min-w-[136px] lg:min-w-[148px]`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden />
                )}
                <span>{loading ? t("loading") : t("button_fetch")}</span>
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] leading-relaxed text-cyan-400 md:mt-2.5 md:text-left md:text-base">
          {t("hint", { qualities: VIDEO_QUALITY_LABEL })}
        </p>
      </form>

      {isHero ? (
        <ol className="mt-5 grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10 sm:pt-6 md:mt-6 lg:mt-7">
          {(["step_1", "step_2", "step_3"] as const).map((key, i) => (
            <li
              key={key}
              className="flex items-start gap-2.5 sm:flex-col sm:items-center sm:px-3 sm:text-center"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-[11px] font-bold text-primary-200">
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
  )
}
