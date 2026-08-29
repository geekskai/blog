"use client"

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  Archive,
  ArrowRight,
  CheckCircle2,
  Coins,
  Crown,
  FileAudio,
  LogIn,
  Loader2,
  RotateCcw,
  Square,
  Trash2,
  Upload,
  Waves,
  X,
} from "lucide-react"
import { saveAs } from "file-saver"
import JSZip from "jszip"
import Link from "next/link"
import { readBillingJson } from "@/lib/billing/client-response"
import type { AudioCreditBalance } from "@/lib/billing/types"
import { creditsForDuration } from "@/lib/billing/domain"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { authUrlWithRedirect } from "@/lib/auth/redirect"
import { getAudioSelectionIssue, readLocalAudioDuration } from "@/lib/workspace/audio"
import {
  cancelAudioProcessing,
  processAudioFile,
  type AudioOutputFormat,
  type WavBitDepth,
} from "@/lib/workspace/processor"
import type { AudioPreparationSettings } from "@/lib/workspace/state"

type QueueItem = {
  name: string
  durationSeconds: number
  status: "waiting" | "processing" | "done" | "failed"
  progress: number
  error?: string
}

type BatchSummary = {
  status: "completed" | "partial" | "canceled"
  completed: number
  failed: number
  creditsUsed: number
  format: AudioOutputFormat
}

const outputName = (name: string, extension: string) =>
  `${name.replace(/\.[^.]+$/, "").replace(/[/\\?%*:|"<>]/g, "_")}-normalized.${extension}`
const MOBILE_DEVICE_QUERY = "(max-width: 767px), (pointer: coarse) and (hover: none)"

const inputClass =
  "mt-2 min-h-11 w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 text-white outline-none transition-[border-color] duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"

const fieldLabelClass = "text-sm font-medium text-slate-300"

export default function AudioProcessorPanel({
  initialCredits,
  locale,
  checkoutSuccess,
  isSignedIn,
  settings,
  onSettingsChange,
}: {
  initialCredits: AudioCreditBalance | null
  locale: string
  checkoutSuccess: boolean
  isSignedIn: boolean
  settings: AudioPreparationSettings
  onSettingsChange: (settings: AudioPreparationSettings) => void
}) {
  const [credits, setCredits] = useState(initialCredits)
  const [files, setFiles] = useState<File[]>([])
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [batchSummary, setBatchSummary] = useState<BatchSummary | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(checkoutSuccess)
  const [confirmationTimedOut, setConfirmationTimedOut] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const canceledRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { format, loudnessTarget: loudness, wavBitDepth: bitDepth } = settings
  const effectiveBatchFileLimit = isMobile ? 1 : (credits?.batchFileLimit ?? 1)
  const totalDurationSeconds = queue.reduce((total, item) => total + item.durationSeconds, 0)
  const estimatedCredits = creditsForDuration(totalDurationSeconds)
  const selectionIssue = useMemo(
    () => (files.length ? getAudioSelectionIssue(files, effectiveBatchFileLimit) : null),
    [effectiveBatchFileLimit, files]
  )
  const audioToolkitPath = `${locale === "en" ? "" : `/${locale}`}/audio-toolkit/`
  const signInHref = authUrlWithRedirect("/sign-in/", audioToolkitPath)

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_DEVICE_QUERY)
    const updateMobileState = () => setIsMobile(mobileQuery.matches)
    updateMobileState()
    mobileQuery.addEventListener("change", updateMobileState)
    return () => mobileQuery.removeEventListener("change", updateMobileState)
  }, [])

  useEffect(() => {
    if (!confirming) return
    let attempts = 0
    const poll = window.setInterval(async () => {
      attempts += 1
      const response = await fetch("/api/audio-credits/", { cache: "no-store" })
      if (response.ok) {
        const next = await readBillingJson<AudioCreditBalance>(response)
        if (next) setCredits(next)
        if (next && next.paidAccess) {
          setConfirming(false)
          setConfirmationTimedOut(false)
          window.clearInterval(poll)
        }
      }
      if (attempts >= 15) {
        setConfirming(false)
        setConfirmationTimedOut(true)
        window.clearInterval(poll)
      }
    }, 2_000)
    return () => window.clearInterval(poll)
  }, [confirming])

  const chooseFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(event.target.files ?? [])
    setBatchSummary(null)
    setFiles(next)
    setQueue(
      next.map((file) => ({ name: file.name, durationSeconds: 0, status: "waiting", progress: 0 }))
    )
    const issue = getAudioSelectionIssue(next, effectiveBatchFileLimit)
    setError(issue)
    if (!issue && next.length) {
      try {
        const durations = await Promise.all(next.map(readLocalAudioDuration))
        setQueue(
          next.map((file, index) => ({
            name: file.name,
            durationSeconds: durations[index],
            status: "waiting",
            progress: 0,
          }))
        )
      } catch (durationError) {
        setError(
          durationError instanceof Error
            ? durationError.message
            : "Audio duration could not be read."
        )
      }
    }
    if (next.length > 0) {
      trackClarityEvent(next.length > 1 ? "audio_files_selected_batch" : "audio_file_selected")
    }
  }

  const resetSelection = () => {
    setFiles([])
    setQueue([])
    setBatchSummary(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeFile = (index: number) => {
    const nextFiles = files.filter((_, itemIndex) => itemIndex !== index)
    setFiles(nextFiles)
    setQueue((items) => items.filter((_, itemIndex) => itemIndex !== index))
    setBatchSummary(null)
    setError(null)
    if (!nextFiles.length && fileInputRef.current) fileInputRef.current.value = ""
  }

  const runProcessing = async (activeFiles: File[], activeQueue: QueueItem[]) => {
    const issue = getAudioSelectionIssue(activeFiles, effectiveBatchFileLimit)
    if (issue) return setError(issue)
    if (!isSignedIn) {
      return setError("Sign in before choosing audio files.")
    }
    const activeDurationSeconds = activeQueue.reduce(
      (total, item) => total + item.durationSeconds,
      0
    )
    const activeEstimatedCredits = creditsForDuration(activeDurationSeconds)
    if (!activeDurationSeconds || activeEstimatedCredits < 1) {
      return setError("Wait until the selected audio duration is available.")
    }
    if (credits && activeEstimatedCredits > credits.total) {
      return setError(`You need ${activeEstimatedCredits} Credits for this batch.`)
    }
    canceledRef.current = false
    trackClarityEvent(
      activeFiles.length > 1 ? "audio_processing_started_batch" : "audio_processing_started"
    )
    setFiles(activeFiles)
    setQueue(
      activeQueue.map((item) => ({ ...item, status: "waiting", progress: 0, error: undefined }))
    )
    setBatchSummary(null)
    setBusy(true)
    setError(null)
    const zip = new JSZip()
    const zipExportAllowed = effectiveBatchFileLimit > 1
    let completed = 0
    let completedDurationSeconds = 0
    const completedOutputs: Array<{ name: string; blob: Blob }> = []
    const operationId = crypto.randomUUID()
    let heartbeat: number | null = null
    try {
      const reservationResponse = await fetch("/api/audio-credits/operations/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          operationId,
          totalDurationSeconds: activeDurationSeconds,
          fileCount: activeFiles.length,
        }),
      })
      const reservation = await readBillingJson<{
        outcome?: string
        balance?: AudioCreditBalance
        error?: string
      }>(reservationResponse)
      if (
        !reservationResponse.ok ||
        !reservation ||
        reservation.outcome === "insufficient_credits"
      ) {
        if (reservation?.balance) setCredits(reservation.balance)
        throw new Error(
          reservation?.outcome === "insufficient_credits"
            ? `You need ${activeEstimatedCredits} Credits for this batch.`
            : (reservation?.error ?? "Credits could not be reserved.")
        )
      }
      if (reservation.balance) setCredits(reservation.balance)
      heartbeat = window.setInterval(() => {
        void fetch(`/api/audio-credits/operations/${operationId}/heartbeat/`, { method: "POST" })
      }, 5 * 60_000)
      for (let index = 0; index < activeFiles.length; index += 1) {
        if (canceledRef.current) break
        const file = activeFiles[index]
        setQueue((items) =>
          items.map((item, itemIndex) =>
            itemIndex === index ? { ...item, status: "processing", progress: 0 } : item
          )
        )
        try {
          const blob = await processAudioFile(file, {
            outputFormat: format,
            wavBitDepth: bitDepth,
            loudnessTarget: loudness,
            onProgress: (progress) =>
              setQueue((items) =>
                items.map((item, itemIndex) =>
                  itemIndex === index ? { ...item, progress: Math.round(progress * 100) } : item
                )
              ),
          })
          const name = outputName(file.name, format)
          completedOutputs.push({ name, blob })
          completed += 1
          completedDurationSeconds += activeQueue[index]?.durationSeconds ?? 0
          setQueue((items) =>
            items.map((item, itemIndex) =>
              itemIndex === index ? { ...item, status: "done", progress: 100 } : item
            )
          )
        } catch (processingError) {
          if (canceledRef.current) {
            setQueue((items) =>
              items.map((item, itemIndex) =>
                itemIndex === index
                  ? { ...item, status: "failed", progress: 0, error: "Canceled." }
                  : item
              )
            )
            break
          }
          const message =
            processingError instanceof Error ? processingError.message : "Processing failed."
          setQueue((items) =>
            items.map((item, itemIndex) =>
              itemIndex === index
                ? { ...item, status: "failed", progress: 0, error: message }
                : item
            )
          )
        }
      }
      const completionResponse = await fetch(
        `/api/audio-credits/operations/${operationId}/complete/`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ completedDurationSeconds, completedFileCount: completed }),
        }
      )
      const completion = await readBillingJson<{
        status?: string
        balance?: AudioCreditBalance
        error?: string
      }>(completionResponse)
      if (!completionResponse.ok || !completion) {
        throw new Error(completion?.error ?? "Credit settlement failed; no download was started.")
      }
      if (completed > 0 && completion.status !== "consumed") {
        throw new Error("The Credit reservation expired; no download was started.")
      }
      if (completion.balance) setCredits(completion.balance)
      if (completedOutputs.length === 1) {
        saveAs(completedOutputs[0].blob, completedOutputs[0].name)
      } else if (completedOutputs.length > 1 && zipExportAllowed) {
        completedOutputs.forEach((output) => zip.file(output.name, output.blob))
        saveAs(await zip.generateAsync({ type: "blob" }), "geekskai-audio-toolkit.zip")
      }
      if (completed > 0) {
        void fetch("/api/workspace/activation/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ kind: completed > 1 ? "batch" : "single" }),
        })
      }
      if (completed > 0) {
        trackClarityEvent(
          completed > 1 ? "audio_processing_completed_batch" : "audio_processing_completed"
        )
      }
      if (completed < activeFiles.length && !canceledRef.current) {
        trackClarityEvent("audio_processing_failed")
      }
      setBatchSummary({
        status: canceledRef.current
          ? "canceled"
          : completed === activeFiles.length
            ? "completed"
            : "partial",
        completed,
        failed: activeFiles.length - completed,
        creditsUsed: creditsForDuration(completedDurationSeconds),
        format,
      })
    } catch (processingError) {
      if (heartbeat !== null) window.clearInterval(heartbeat)
      void fetch(`/api/audio-credits/operations/${operationId}/release/`, { method: "POST" })
      setError(processingError instanceof Error ? processingError.message : "Processing failed.")
    } finally {
      if (heartbeat !== null) window.clearInterval(heartbeat)
      setBusy(false)
    }
  }

  const processFiles = () => void runProcessing(files, queue)

  const retryFailed = () => {
    const failedIndexes = queue.flatMap((item, index) => (item.status === "failed" ? [index] : []))
    const retryFiles = failedIndexes.map((index) => files[index])
    const retryQueue = failedIndexes.map((index) => ({
      ...queue[index],
      status: "waiting" as const,
      progress: 0,
      error: undefined,
    }))
    if (retryFiles.length) void runProcessing(retryFiles, retryQueue)
  }

  const cancel = () => {
    canceledRef.current = true
    trackClarityEvent("audio_processing_canceled")
    cancelAudioProcessing()
    setError("Processing canceled. Completed downloads remain on your device.")
  }

  const canProcess =
    isSignedIn &&
    !busy &&
    files.length > 0 &&
    !selectionIssue &&
    Boolean(totalDurationSeconds) &&
    !(credits && estimatedCredits > credits.total)

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-950/70"
      aria-labelledby="audio-processor-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
        aria-hidden
      />

      <div className="border-b border-slate-800/80 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-400">
              <Waves className="h-3.5 w-3.5" aria-hidden />
              Local audio processing
            </p>
            <h2 id="audio-processor-title" className="mt-1 text-lg font-bold text-white sm:text-xl">
              Normalize and convert your tracks
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Two-pass LUFS in-browser · Chrome & Edge · Safari beta
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 text-xs font-semibold text-violet-100">
              <Coins className="h-3.5 w-3.5" aria-hidden />
              {isSignedIn ? `${credits?.total ?? 0} Credits` : "Sign in required"}
            </span>
            <span className="inline-flex min-h-8 items-center rounded-lg border border-slate-700/80 bg-slate-900/60 px-2.5 text-xs font-medium text-slate-300">
              {isMobile
                ? "1 file · mobile"
                : `${effectiveBatchFileLimit} ${effectiveBatchFileLimit === 1 ? "file" : "files"} · batch`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0">
        {/* Top · Upload */}
        <div className="space-y-3 border-b border-slate-800/80 p-4 sm:p-5">
          {confirming ? (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-lg border border-sky-400/20 bg-sky-950/35 px-3 py-2.5 text-xs leading-5 text-sky-100 sm:text-sm"
            >
              <Loader2
                className="mt-0.5 h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none"
                aria-hidden
              />
              Confirming PayPal payment and refreshing Credits…
            </div>
          ) : null}
          {confirmationTimedOut ? (
            <div
              role="alert"
              className="rounded-lg border border-amber-400/20 bg-amber-950/30 px-3 py-2.5 text-xs leading-5 text-amber-100 sm:text-sm"
            >
              Payment confirmation is delayed.{" "}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="font-semibold underline underline-offset-2"
              >
                Refresh
              </button>{" "}
              or email support@geekskai.com.
            </div>
          ) : null}

          {isSignedIn ? (
            <label className="group flex min-h-[7.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600/70 bg-slate-900/35 px-4 py-4 text-center transition-[border-color,background-color] duration-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 hover:border-sky-500/45 hover:bg-slate-900/55 motion-reduce:transition-none sm:min-h-[8rem]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-500/25 bg-sky-500/10 text-sky-300">
                <Upload className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm font-medium text-slate-200">
                {files.length
                  ? `${files.length} file${files.length === 1 ? "" : "s"} selected`
                  : "Choose MP3, WAV, FLAC, or M4A"}
              </span>
              <span className="text-sm text-slate-400">Tap to browse · files stay on device</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.flac,.m4a,audio/*"
                multiple={!isMobile}
                className="sr-only"
                onChange={chooseFiles}
                disabled={busy}
              />
            </label>
          ) : (
            <div className="flex min-h-[8rem] flex-col items-center justify-center gap-3 rounded-xl border border-sky-400/25 bg-sky-950/25 px-5 py-5 text-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-400/25 bg-sky-500/10 text-sky-200">
                <LogIn className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-white">Sign in before choosing audio</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Your account authorizes Credits. Audio files remain on this device.
                </p>
              </div>
              <Link
                href={signInHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none"
              >
                <LogIn className="h-4 w-4" aria-hidden />
                Sign in to continue
              </Link>
            </div>
          )}

          {files.length > 0 && totalDurationSeconds > 0 ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-violet-400/20 bg-violet-500/[0.07] px-3 py-2.5 text-xs text-violet-100 sm:text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Coins className="h-3.5 w-3.5" aria-hidden />
                {estimatedCredits} Credits
              </span>
              <span className="text-violet-200/65">
                · {Math.round(totalDurationSeconds)}s · {files.length} file
                {files.length === 1 ? "" : "s"}
              </span>
            </div>
          ) : files.length > 0 ? (
            <p className="text-sm text-slate-400">Reading duration for Credit estimate…</p>
          ) : null}

          {(selectionIssue || error) && (
            <p
              role="alert"
              className="rounded-lg border border-amber-400/20 bg-amber-950/30 px-3 py-2.5 text-xs leading-5 text-amber-100 sm:text-sm"
            >
              {error ?? selectionIssue}
            </p>
          )}

          {queue.length > 0 ? (
            <div className="space-y-2" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Queue ({queue.length})
                </p>
                {!busy ? (
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Clear
                  </button>
                ) : null}
              </div>
              <div className="max-h-40 space-y-1.5 overflow-y-auto pr-0.5 sm:max-h-48">
                {queue.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="rounded-lg border border-slate-800/70 bg-slate-900/35 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2 text-slate-200">
                        <FileAudio className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden />
                        <span className="truncate text-xs sm:text-sm">{item.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1">
                        <span
                          className={`text-xs font-medium ${
                            item.status === "failed"
                              ? "text-rose-300"
                              : item.status === "done"
                                ? "text-emerald-300"
                                : "text-slate-400"
                          }`}
                        >
                          {item.status === "processing" ? `${item.progress}%` : item.status}
                        </span>
                        {!busy ? (
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            aria-label={`Remove ${item.name}`}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                          >
                            <X className="h-4 w-4" aria-hidden />
                          </button>
                        ) : null}
                      </span>
                    </div>
                    {item.status === "processing" ? (
                      <div
                        className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800"
                        role="progressbar"
                        aria-valuenow={item.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-[width] duration-200 motion-reduce:transition-none"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    ) : null}
                    {item.error ? <p className="mt-1 text-xs text-rose-300">{item.error}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Middle · Options */}
        <div className="border-b border-slate-800/80 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Choose the result you need
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={busy}
              aria-pressed={format === "wav" && loudness === -9 && bitDepth === 24}
              onClick={() =>
                onSettingsChange({ format: "wav", loudnessTarget: -9, wavBitDepth: 24 })
              }
              className="min-h-16 rounded-xl border border-sky-400/25 bg-sky-950/20 px-4 py-3 text-left transition-colors hover:bg-sky-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:opacity-60 aria-pressed:border-sky-300 aria-pressed:bg-sky-500/15 motion-reduce:transition-none"
            >
              <span className="block text-sm font-semibold text-white">Club / DJ preparation</span>
              <span className="mt-1 block text-sm text-slate-300">WAV · −9 LUFS · 24-bit</span>
            </button>
            <button
              type="button"
              disabled={busy}
              aria-pressed={format === "mp3" && loudness === -14}
              onClick={() =>
                onSettingsChange({ format: "mp3", loudnessTarget: -14, wavBitDepth: 24 })
              }
              className="min-h-16 rounded-xl border border-violet-400/25 bg-violet-950/20 px-4 py-3 text-left transition-colors hover:bg-violet-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:opacity-60 aria-pressed:border-violet-300 aria-pressed:bg-violet-500/15 motion-reduce:transition-none"
            >
              <span className="block text-sm font-semibold text-white">Streaming / portable</span>
              <span className="mt-1 block text-sm text-slate-300">MP3 · 320 kbps · −14 LUFS</span>
            </button>
          </div>

          <details className="group mt-4 border-t border-slate-800/80 pt-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-2 text-sm font-semibold text-slate-200 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 [&::-webkit-details-marker]:hidden">
              Advanced settings
              <span className="font-normal text-slate-400">
                {format.toUpperCase()} · {loudness} LUFS
                {format === "wav" ? ` · ${bitDepth}-bit` : ""}
              </span>
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className={fieldLabelClass}>Format</span>
                <select
                  value={format}
                  onChange={(event) =>
                    onSettingsChange({
                      ...settings,
                      format: event.target.value as AudioOutputFormat,
                    })
                  }
                  disabled={busy}
                  className={inputClass}
                >
                  <option value="wav">WAV</option>
                  <option value="mp3">MP3 · 320 kbps</option>
                </select>
              </label>
              <label className="block">
                <span className={fieldLabelClass}>Target loudness (LUFS)</span>
                <input
                  type="number"
                  min={-24}
                  max={-5}
                  value={loudness}
                  onChange={(event) =>
                    onSettingsChange({ ...settings, loudnessTarget: Number(event.target.value) })
                  }
                  disabled={busy}
                  className={inputClass}
                />
              </label>
              {format === "wav" ? (
                <label className="block sm:col-span-2 lg:col-span-1">
                  <span className={fieldLabelClass}>WAV bit depth</span>
                  <select
                    value={bitDepth}
                    onChange={(event) =>
                      onSettingsChange({
                        ...settings,
                        wavBitDepth: Number(event.target.value) as WavBitDepth,
                      })
                    }
                    disabled={busy}
                    className={inputClass}
                  >
                    <option value={16}>16-bit</option>
                    <option value={24}>24-bit</option>
                  </select>
                </label>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              LUFS controls perceived loudness. Use a recommended setup unless your destination
              requires a specific target.
            </p>
          </details>
        </div>

        {/* Bottom · Actions */}
        <div className="space-y-3 p-4 sm:p-5">
          {batchSummary ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-emerald-400/20 bg-emerald-950/25 p-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">
                    {batchSummary.status === "completed"
                      ? "Batch complete"
                      : batchSummary.status === "canceled"
                        ? "Batch canceled"
                        : "Batch finished with errors"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-emerald-100/80">
                    {batchSummary.completed}/{batchSummary.completed + batchSummary.failed}{" "}
                    completed
                    {batchSummary.failed ? ` · ${batchSummary.failed} not completed` : ""} ·{" "}
                    {batchSummary.creditsUsed} Credits used · {batchSummary.format.toUpperCase()}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {batchSummary.status === "partial" &&
                    queue.some((item) => item.status === "failed") ? (
                      <button
                        type="button"
                        onClick={retryFailed}
                        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-400/25 px-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                      >
                        <RotateCcw className="h-4 w-4" aria-hidden />
                        Retry failed
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={resetSelection}
                      className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      Process another batch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {isSignedIn ? (
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={processFiles}
                disabled={!canProcess}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-violet-600 px-4 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              >
                {busy ? (
                  <Loader2
                    className="h-4 w-4 animate-spin motion-reduce:animate-none"
                    aria-hidden
                  />
                ) : (
                  <FileAudio className="h-4 w-4" aria-hidden />
                )}
                {busy
                  ? "Processing locally…"
                  : credits && estimatedCredits > credits.total
                    ? "Not enough Credits"
                    : files.length === 0
                      ? "Select files to continue"
                      : !totalDurationSeconds
                        ? "Waiting for duration…"
                        : `Process for ${estimatedCredits} Credits`}
              </button>
              {busy ? (
                <button
                  type="button"
                  onClick={cancel}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-5 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 motion-reduce:transition-none sm:min-w-[8.5rem]"
                >
                  <Square className="h-4 w-4" aria-hidden />
                  Cancel
                </button>
              ) : null}
            </div>
          ) : null}

          {credits?.zipExport ? (
            <p className="flex items-start gap-2 text-sm leading-6 text-violet-100/80">
              <Archive className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Multiple files download as one ZIP when processing succeeds.
            </p>
          ) : null}

          {isSignedIn &&
          !credits?.paidAccess &&
          (Boolean(batchSummary) ||
            Boolean(files.length && credits && estimatedCredits > credits.total)) ? (
            <div className="rounded-lg border border-violet-500/20 bg-violet-950/25 p-3">
              <div className="flex items-start gap-2.5">
                <Crown className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Need more Credits?</p>
                  <p className="mt-0.5 text-sm leading-6 text-slate-300">
                    Buy 480 once or subscribe for 2,800 monthly. Paid plans unlock 50-file batches.
                  </p>
                  <Link
                    href={`${locale === "en" ? "" : `/${locale}`}/pricing/`}
                    className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-violet-300 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  >
                    Compare plans
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
