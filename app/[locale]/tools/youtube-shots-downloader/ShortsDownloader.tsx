"use client"
import React from "react"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
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
  Copy,
  Share2,
  X,
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

const VIDEO_DOWNLOADER_PATH = "/tools/youtube-video-downloader"

function buildVideoDownloaderHref(videoUrl: string): string {
  return `${VIDEO_DOWNLOADER_PATH}?url=${encodeURIComponent(videoUrl.trim())}`
}

function formatDuration(seconds: number | null): string | null {
  if (seconds == null || seconds <= 0) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

type ShortsDownloaderProps = {
  variant?: "hero" | "default"
  autoFocus?: boolean
}

const BTN =
  "inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold leading-none transition-[background-color,border-color,opacity] duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-45 md:min-h-12 md:text-sm"

const RAPIDAPI_HOST = "youtube-shorts-video-downloader-and-converter.p.rapidapi.com"

const DEFAULT_SHORTS_QUALITY = "360p"
const SHORTS_QUALITY_OPTIONS = ["144p", "240p", "360p", "480p", "720p", "1080p"] as const
const SHORTS_QUALITY_LABEL = SHORTS_QUALITY_OPTIONS.join(" / ")
const DAILY_QUOTA_STORAGE_KEY = "shorts_downloader_daily_quota_v1"
const DAILY_FREE_LIMIT = 3
const SHARE_BONUS_CLICKS = 3
const MAX_DAILY_SHARE_UNLOCKS = 2
const SIMULATED_PROGRESS_DURATION_MS = 60_000
const SIMULATED_PROGRESS_TICK_MS = 200

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function sanitizeFileName(name: string): string {
  const normalized = name.trim().replace(/[\\/:*?"<>|]+/g, "_")
  if (!normalized) return "youtube-shorts-video"
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

type DailyQuotaState = {
  date: string
  remainingClicks: number
  sharesCountToday: number
}

function getTodayDateKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, "0")
  const day = `${now.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function createDailyQuota(date: string): DailyQuotaState {
  return {
    date,
    remainingClicks: DAILY_FREE_LIMIT,
    sharesCountToday: 0,
  }
}

function normalizeDailyQuota(raw: unknown, today: string): DailyQuotaState {
  if (!raw || typeof raw !== "object") {
    return createDailyQuota(today)
  }
  const candidate = raw as Partial<DailyQuotaState>
  const parsedDate = typeof candidate.date === "string" ? candidate.date : ""
  if (parsedDate !== today) {
    return createDailyQuota(today)
  }
  const remainingClicks = Number(candidate.remainingClicks)
  const sharesCountToday = Number(candidate.sharesCountToday)
  return {
    date: today,
    remainingClicks: Number.isFinite(remainingClicks)
      ? Math.max(0, Math.floor(remainingClicks))
      : 0,
    sharesCountToday: Number.isFinite(sharesCountToday)
      ? Math.max(0, Math.floor(sharesCountToday))
      : 0,
  }
}

type VideoResultCardProps = {
  video: VideoPreview
  t: ReturnType<typeof useTranslations<"ShortsDownloader">>
}
type ShortsDownloaderT = ReturnType<typeof useTranslations<"ShortsDownloader">>

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
        {/* Preview row: thumb + meta (mobile & desktop) */}
        <div className="flex gap-3 md:gap-4 lg:gap-5">
          {video.thumbnail ? (
            <div className="relative h-[122px] w-[69px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black shadow-lg shadow-black/40 md:h-[150px] md:w-[84px] md:rounded-xl lg:h-[160px] lg:w-[90px]">
              <Image
                src={video.thumbnail}
                alt=""
                fill
                sizes="(max-width: 767px) 69px, (max-width: 1023px) 84px, 90px"
                className="object-cover"
                unoptimized
              />
              {duration && (
                <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white">
                  {duration}
                </span>
              )}
            </div>
          ) : (
            <div
              className="flex h-[122px] w-[69px] shrink-0 items-center justify-center rounded-lg border border-dashed border-white/15 bg-slate-900/80 md:h-[150px] md:w-[84px] md:rounded-xl lg:h-[160px] lg:w-[90px]"
              aria-hidden
            >
              <Download className="h-8 w-8 text-slate-600" />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
            <h3 className="line-clamp-3 text-base font-semibold leading-5 text-slate-50 md:line-clamp-2 md:text-lg md:leading-snug lg:text-xl">
              {video.title}
            </h3>
            {video.author && (
              <p className="mt-1 line-clamp-2 text-base leading-5 text-slate-400 md:text-lg">
                {video.author}
              </p>
            )}
          </div>
        </div>

        <p className="mt-3 border-t border-white/10 pt-3 text-center text-xs leading-relaxed text-yellow-500 md:mt-4 md:pt-4 md:text-left md:text-base">
          {t("download_note", { qualities: SHORTS_QUALITY_LABEL })}
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
  t: ShortsDownloaderT
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

type ShareModalProps = {
  isOpen: boolean
  shareLink: string
  unlockAmount: number
  t: ShortsDownloaderT
  onClose: () => void
  onUnlock: () => void
}

function ShareModal({ isOpen, shareLink, unlockAmount, t, onClose, onUnlock }: ShareModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(null)
      setCopyError(null)
      return
    }
    if (countdown == null) return
    if (countdown <= 0) {
      onUnlock()
      setCountdown(null)
      return
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => (prev == null ? null : prev - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [countdown, isOpen, onUnlock])

  if (!isOpen) return null

  const startVerification = () => {
    if (countdown != null) return
    setCountdown(5)
  }

  const handleCopyAndUnlock = async () => {
    setCopyError(null)
    try {
      await navigator.clipboard.writeText(shareLink)
    } catch {
      setCopyError(t("share_copy_failed"))
    } finally {
      startVerification()
    }
  }

  const handleSocialShareAndUnlock = () => {
    const target = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      t("share_social_text")
    )}&url=${encodeURIComponent(shareLink)}`
    window.open(target, "_blank", "noopener,noreferrer")
    startVerification()
  }

  const verifying = countdown != null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-900/95 p-5 shadow-2xl shadow-black/40 md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-100">{t("share_modal_title")}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-300">
              {t("share_modal_subtitle_before")}
              <strong>{t("share_modal_subtitle_strong", { count: unlockAmount })}</strong>
              {t("share_modal_subtitle_after")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={verifying}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t("share_modal_close_aria")}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
          {t("share_modal_link_label")}
        </label>
        <input
          type="text"
          value={shareLink}
          readOnly
          className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-200 outline-none"
        />
        {copyError ? <p className="mt-2 text-xs text-orange-300">{copyError}</p> : null}

        <div className="mt-4 grid gap-2.5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => void handleCopyAndUnlock()}
            disabled={verifying}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {verifying
              ? t("share_modal_verifying_copy", { seconds: countdown ?? 0 })
              : t("share_modal_copy_unlock")}
          </button>
          <button
            type="button"
            onClick={handleSocialShareAndUnlock}
            disabled={verifying}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-slate-800/60 px-4 text-sm font-semibold text-slate-100 transition hover:border-primary-400/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {verifying
              ? t("share_modal_verifying_social", { seconds: countdown ?? 0 })
              : t("share_modal_social_unlock")}
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          {t("share_modal_footer_hint", { count: unlockAmount })}
        </p>
      </div>
    </div>
  )
}

export default function ShortsDownloader({
  variant = "default",
  autoFocus = false,
}: ShortsDownloaderProps) {
  const t = useTranslations("ShortsDownloader")
  const router = useRouter()
  const searchParams = useSearchParams()
  const initializedFromQuery = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const progressTimerRef = useRef<number | null>(null)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [quality, setQuality] = useState<string>(DEFAULT_SHORTS_QUALITY)
  const [errorKey, setErrorKey] = useState<ApiErrorCode | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)
  const [video, setVideo] = useState<VideoPreview | null>(null)
  const [quotaState, setQuotaState] = useState<DailyQuotaState | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLink, setShareLink] = useState("https://youtubeshortdownloader.com?ref=fission_share")
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

  const persistQuotaState = useCallback((next: DailyQuotaState) => {
    setQuotaState(next)
    try {
      window.localStorage.setItem(DAILY_QUOTA_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // localStorage unavailable: fail open, keep UI from crashing.
      setQuotaState(null)
    }
  }, [])

  const syncDailyQuota = useCallback((): DailyQuotaState | null => {
    const today = getTodayDateKey()
    try {
      const raw = window.localStorage.getItem(DAILY_QUOTA_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as unknown) : null
      const normalized = normalizeDailyQuota(parsed, today)
      window.localStorage.setItem(DAILY_QUOTA_STORAGE_KEY, JSON.stringify(normalized))
      setQuotaState(normalized)
      return normalized
    } catch {
      setQuotaState(null)
      return null
    }
  }, [])

  useEffect(() => {
    syncDailyQuota()
    const { origin, pathname } = window.location
    setShareLink(`${origin}${pathname}?ref=fission_share`)
  }, [syncDailyQuota])

  const redirectToVideoDownloader = useCallback(
    (videoUrl: string) => {
      router.push(buildVideoDownloaderHref(videoUrl))
    },
    [router]
  )

  const fetchVideo = useCallback(
    async (inputUrl?: string) => {
      const trimmed = (inputUrl ?? url).trim()
      setErrorKey(null)
      resetDownloadState()
      setVideo(null)

      const parsed = parseYouTubeUrl(trimmed)
      if (parsed?.kind === "video") {
        redirectToVideoDownloader(trimmed)
        return
      }

      setLoading(true)

      try {
        const videoId = parsed?.kind === "shorts" ? parsed.videoId : null
        if (!videoId) {
          setErrorKey("invalid_url")
          return
        }

        const metadata = await fetchYouTubeMetadataClient(videoId, t("default_shorts_title"))
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
    [redirectToVideoDownloader, resetDownloadState, t, url]
  )

  useEffect(() => {
    if (initializedFromQuery.current) return
    const incoming = searchParams.get("url")?.trim()
    if (!incoming) return
    const parsed = parseYouTubeUrl(incoming)
    if (parsed?.kind === "video") {
      initializedFromQuery.current = true
      redirectToVideoDownloader(incoming)
      return
    }
    if (parsed?.kind !== "shorts") return
    initializedFromQuery.current = true
    setUrl(incoming)
    void fetchVideo(incoming)
  }, [fetchVideo, redirectToVideoDownloader, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || loading) return
    void fetchVideo(url.trim())
  }

  const handleDownload = async () => {
    const selectedVideo = video
    if (!selectedVideo || downloading || isDownloadCooldown) return
    const latestQuota = syncDailyQuota()
    if (latestQuota && latestQuota.remainingClicks <= 0) {
      if (latestQuota.sharesCountToday >= MAX_DAILY_SHARE_UNLOCKS) {
        setDownloadError(t("error_quota_exhausted_today"))
        startCooldown()
      } else {
        setShowShareModal(true)
      }
      return
    }

    setDownloadError(null)
    setDownloadSuccess(null)
    setDownloading(true)
    setDownloadProgress(0)
    startProgressSimulation()

    const requestUrl = `https://${RAPIDAPI_HOST}/download-short-mp4/${selectedVideo.videoId}?quality=${quality}`

    try {
      const response = await axios({
        url: requestUrl,
        method: "GET",
        responseType: "blob",
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY_SHORTS,
        },
      })
      const contentType = String(response.headers["content-type"] || "")
      if (!contentType.includes("octet-stream") && !contentType.includes("video")) {
        const maybeText = await response.data.text()
        try {
          const parsed = JSON.parse(maybeText) as { error?: string; message?: string }
          throw new Error(parsed.error || parsed.message || t("error_invalid_media_response"))
        } catch {
          throw new Error(maybeText?.slice(0, 200) || t("error_invalid_media_response"))
        }
      }
      const blob = response.data
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
      if (latestQuota) {
        const nextQuota: DailyQuotaState = {
          ...latestQuota,
          remainingClicks: Math.max(0, latestQuota.remainingClicks - 1),
        }
        persistQuotaState(nextQuota)
      }
      setVideo(null)
    } catch (error) {
      setDownloadProgress(0)
      let message = t("error_download_failed")
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data
        if (responseData instanceof Blob) {
          try {
            const text = await responseData.text()
            const parsed = JSON.parse(text) as { error?: string; message?: string }
            message = parsed.error || parsed.message || error.message || message
          } catch {
            message = error.message || message
          }
        } else if (typeof responseData === "object" && responseData && "message" in responseData) {
          message = String(
            (responseData as { message?: unknown }).message ?? error.message ?? message
          )
        } else {
          message = error.response?.statusText || error.message || message
        }
      } else if (error instanceof Error) {
        message = error.message || message
      }
      const mappedError = mapDownloaderApiError(message)
      setDownloadError(
        getDownloaderErrorMessage(t, mappedError) ?? `${t("error_download_failed")} (${message})`
      )
      startCooldown()
    } finally {
      stopProgressSimulation()
      setDownloading(false)
    }
  }

  const handleShareUnlock = useCallback(() => {
    const latestQuota = syncDailyQuota()
    if (!latestQuota) {
      setShowShareModal(false)
      setDownloadSuccess(t("share_unlock_success", { count: SHARE_BONUS_CLICKS }))
      return
    }
    if (latestQuota.sharesCountToday >= MAX_DAILY_SHARE_UNLOCKS) {
      setShowShareModal(false)
      setDownloadError(t("error_share_unlock_limit_reached"))
      return
    }
    const nextQuota: DailyQuotaState = {
      ...latestQuota,
      remainingClicks: latestQuota.remainingClicks + SHARE_BONUS_CLICKS,
      sharesCountToday: latestQuota.sharesCountToday + 1,
    }
    persistQuotaState(nextQuota)
    setShowShareModal(false)
    setDownloadError(null)
    setDownloadSuccess(t("share_unlock_success", { count: SHARE_BONUS_CLICKS }))
  }, [persistQuotaState, syncDailyQuota, t])

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
    <>
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
          <label htmlFor="shorts-url" className="sr-only">
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
                id="shorts-url"
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
                {SHORTS_QUALITY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
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

          <p className="mt-2 text-center text-[11px] leading-relaxed text-green-500 md:mt-2.5 md:text-left md:text-base">
            {t("hint", { qualities: SHORTS_QUALITY_LABEL })}
          </p>
        </form>

        {isHero && (
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
        )}
      </div>

      {quotaState ? (
        <p className="mt-2 w-full text-center text-xs leading-relaxed text-slate-400 md:mt-4 md:text-sm">
          {t("quota_status_line", {
            remaining: quotaState.remainingClicks,
            used: quotaState.sharesCountToday,
            max: MAX_DAILY_SHARE_UNLOCKS,
          })}
        </p>
      ) : null}

      <ShareModal
        isOpen={showShareModal}
        shareLink={shareLink}
        unlockAmount={SHARE_BONUS_CLICKS}
        t={t}
        onClose={() => setShowShareModal(false)}
        onUnlock={handleShareUnlock}
      />
    </>
  )
}
