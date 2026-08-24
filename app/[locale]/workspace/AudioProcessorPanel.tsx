"use client"

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  Archive,
  ArrowRight,
  Coins,
  Crown,
  FileAudio,
  Loader2,
  Square,
  Upload,
  Waves,
} from "lucide-react"
import { saveAs } from "file-saver"
import JSZip from "jszip"
import Link from "next/link"
import { readBillingJson } from "@/lib/billing/client-response"
import type { AudioCreditBalance } from "@/lib/billing/types"
import { creditsForDuration } from "@/lib/billing/domain"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { getAudioSelectionIssue, readLocalAudioDuration } from "@/lib/workspace/audio"
import {
  cancelAudioProcessing,
  processAudioFile,
  type AudioOutputFormat,
  type WavBitDepth,
} from "@/lib/workspace/processor"

type QueueItem = {
  name: string
  durationSeconds: number
  status: "waiting" | "processing" | "done" | "failed"
  progress: number
  error?: string
}

const outputName = (name: string, extension: string) =>
  `${name.replace(/\.[^.]+$/, "").replace(/[/\\?%*:|"<>]/g, "_")}-normalized.${extension}`
const MOBILE_DEVICE_QUERY = "(max-width: 767px), (pointer: coarse) and (hover: none)"

const inputClass =
  "mt-2 min-h-11 w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 text-white outline-none transition-[border-color] duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"

export default function AudioProcessorPanel({
  initialCredits,
  locale,
  checkoutSuccess,
  isSignedIn,
}: {
  initialCredits: AudioCreditBalance | null
  locale: string
  checkoutSuccess: boolean
  isSignedIn: boolean
}) {
  const [credits, setCredits] = useState(initialCredits)
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState<AudioOutputFormat>("wav")
  const [bitDepth, setBitDepth] = useState<WavBitDepth>(24)
  const [loudness, setLoudness] = useState(-9)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(checkoutSuccess)
  const [confirmationTimedOut, setConfirmationTimedOut] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const canceledRef = useRef(false)
  const effectiveBatchFileLimit = isMobile ? 1 : (credits?.batchFileLimit ?? 1)
  const totalDurationSeconds = queue.reduce((total, item) => total + item.durationSeconds, 0)
  const estimatedCredits = creditsForDuration(totalDurationSeconds)
  const selectionIssue = useMemo(
    () => (files.length ? getAudioSelectionIssue(files, effectiveBatchFileLimit) : null),
    [effectiveBatchFileLimit, files]
  )

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

  const processFiles = async () => {
    const issue = getAudioSelectionIssue(files, effectiveBatchFileLimit)
    if (issue) return setError(issue)
    if (!isSignedIn) {
      window.location.assign(
        `${locale === "en" ? "" : `/${locale}`}/sign-in/?redirect_url=${encodeURIComponent(`${locale === "en" ? "" : `/${locale}`}/audio-toolkit/`)}`
      )
      return
    }
    if (!totalDurationSeconds || estimatedCredits < 1) {
      return setError("Wait until the selected audio duration is available.")
    }
    canceledRef.current = false
    trackClarityEvent(
      files.length > 1 ? "audio_processing_started_batch" : "audio_processing_started"
    )
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
          totalDurationSeconds,
          fileCount: files.length,
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
            ? `You need ${estimatedCredits} Credits for this batch.`
            : (reservation?.error ?? "Credits could not be reserved.")
        )
      }
      if (reservation.balance) setCredits(reservation.balance)
      heartbeat = window.setInterval(() => {
        void fetch(`/api/audio-credits/operations/${operationId}/heartbeat/`, { method: "POST" })
      }, 5 * 60_000)
      for (let index = 0; index < files.length; index += 1) {
        if (canceledRef.current) break
        const file = files[index]
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
          completedDurationSeconds += queue[index]?.durationSeconds ?? 0
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
      if (completed < files.length && !canceledRef.current) {
        trackClarityEvent("audio_processing_failed")
      }
    } catch (processingError) {
      if (heartbeat !== null) window.clearInterval(heartbeat)
      void fetch(`/api/audio-credits/operations/${operationId}/release/`, { method: "POST" })
      setError(processingError instanceof Error ? processingError.message : "Processing failed.")
    } finally {
      if (heartbeat !== null) window.clearInterval(heartbeat)
      setBusy(false)
    }
  }

  const cancel = () => {
    canceledRef.current = true
    trackClarityEvent("audio_processing_canceled")
    cancelAudioProcessing()
    setError("Processing canceled. Completed downloads remain on your device.")
  }

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-sky-500/25 bg-slate-950/60"
      aria-labelledby="audio-processor-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.08),transparent_50%)]"
        aria-hidden
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400 sm:text-xs">
              <Waves className="h-3.5 w-3.5" aria-hidden />
              Local audio processing
            </p>
            <h2
              id="audio-processor-title"
              className="mt-2 text-xl font-bold text-white sm:text-2xl"
            >
              Normalize and convert your own tracks
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Two-pass LUFS processing runs in this browser. Audio and filenames are never uploaded.
              Desktop Chrome and Edge are supported; Safari is beta.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-100 sm:text-sm">
            <Coins className="h-3.5 w-3.5" aria-hidden />
            {isSignedIn ? `${credits?.total ?? 0} Credits` : "Sign in required"} ·{" "}
            {isMobile ? "1 file on mobile" : `${effectiveBatchFileLimit} files per batch`}
          </span>
        </div>

        {confirming && (
          <div
            role="status"
            className="mt-5 flex items-start gap-3 rounded-xl border border-sky-400/25 bg-sky-950/40 p-4 text-sm text-sky-100"
          >
            <Loader2
              className="mt-0.5 h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none"
              aria-hidden
            />
            Confirming your PayPal payment and refreshing Audio Credits…
          </div>
        )}
        {confirmationTimedOut && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-amber-400/25 bg-amber-950/35 p-4 text-sm text-amber-100"
          >
            Subscription confirmation is taking longer than expected.{" "}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              Refresh status
            </button>{" "}
            or contact{" "}
            <a
              href="mailto:support@geekskai.com"
              className="font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              support@geekskai.com
            </a>
            . Credits remain locked until the verified payment event arrives.
          </div>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-4 md:gap-4">
          <label className="group flex min-h-[7.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600/80 bg-slate-900/40 px-4 py-6 text-center text-slate-300 transition-[border-color,background-color] duration-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 hover:border-sky-500/50 hover:bg-slate-900/60 motion-reduce:transition-none md:col-span-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 transition-colors duration-200 group-hover:border-sky-400/50 group-hover:bg-sky-500/15 motion-reduce:transition-none">
              <Upload className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm font-medium text-slate-200">
              {files.length
                ? `${files.length} file${files.length === 1 ? "" : "s"} selected`
                : "Choose MP3, WAV, FLAC, or M4A"}
            </span>
            <span className="text-xs text-slate-500">Tap to browse · stays on device</span>
            <input
              type="file"
              accept=".mp3,.wav,.flac,.m4a,audio/*"
              multiple={!isMobile}
              className="sr-only"
              onChange={chooseFiles}
              disabled={busy}
            />
          </label>
          <label className="text-sm text-slate-300">
            Output
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as AudioOutputFormat)}
              disabled={busy}
              className={inputClass}
            >
              <option value="wav">WAV</option>
              <option value="mp3">MP3 · 320 kbps</option>
            </select>
          </label>
          <label className="text-sm text-slate-300">
            Target loudness
            <input
              type="number"
              min={-24}
              max={-5}
              value={loudness}
              onChange={(event) => setLoudness(Number(event.target.value))}
              disabled={busy}
              className={inputClass}
            />
          </label>
        </div>
        {format === "wav" && (
          <label className="mt-4 block max-w-xs text-sm text-slate-300">
            WAV bit depth
            <select
              value={bitDepth}
              onChange={(event) => setBitDepth(Number(event.target.value) as WavBitDepth)}
              disabled={busy}
              className={inputClass}
            >
              <option value={16}>16-bit</option>
              <option value={24}>24-bit</option>
            </select>
          </label>
        )}

        {(selectionIssue || error) && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-amber-400/25 bg-amber-950/35 p-3 text-sm text-amber-100"
          >
            {error ?? selectionIssue}
          </p>
        )}

        {queue.length > 0 && (
          <div className="mt-5 space-y-2" aria-live="polite">
            {queue.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex min-w-0 items-center gap-2 text-slate-200">
                    <FileAudio className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span
                    className={`shrink-0 text-xs font-medium uppercase tracking-wide sm:text-sm sm:normal-case sm:tracking-normal ${
                      item.status === "failed"
                        ? "text-rose-300"
                        : item.status === "done"
                          ? "text-emerald-300"
                          : "text-slate-400"
                    }`}
                  >
                    {item.status === "processing" ? `${item.progress}%` : item.status}
                  </span>
                </div>
                {item.status === "processing" ? (
                  <div
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"
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
        )}

        {files.length > 0 && totalDurationSeconds > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/[0.08] px-4 py-3 text-sm text-violet-100">
            <Coins className="h-4 w-4" aria-hidden />
            Estimated cost: <strong>{estimatedCredits} Credits</strong>
            <span className="text-violet-200/70">
              ({Math.round(totalDurationSeconds)} seconds across {files.length} file
              {files.length === 1 ? "" : "s"})
            </span>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={processFiles}
            disabled={
              busy ||
              files.length === 0 ||
              Boolean(selectionIssue) ||
              !totalDurationSeconds ||
              Boolean(isSignedIn && credits && estimatedCredits > credits.total)
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-violet-600 px-5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <FileAudio className="h-4 w-4" aria-hidden />
            )}
            {busy
              ? "Processing locally…"
              : !isSignedIn
                ? "Sign in to process"
                : credits && estimatedCredits > credits.total
                  ? "Not enough Credits"
                  : `Process for ${estimatedCredits || "—"} Credits`}
          </button>
          {busy && (
            <button
              type="button"
              onClick={cancel}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 motion-reduce:transition-none"
            >
              <Square className="h-4 w-4" aria-hidden />
              Cancel
            </button>
          )}
        </div>

        {!credits?.paidAccess && (
          <div className="relative mt-6 overflow-hidden rounded-xl border border-violet-500/25 bg-violet-950/30 p-4 sm:p-5">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] to-transparent"
              aria-hidden
            />
            <div className="relative flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-500/10 text-violet-300">
                <Crown className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-white">Need more Audio Credits?</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Buy 480 Credits once or subscribe for 2,800 monthly Credits. Both paid options
                  unlock 50-file local batches and ZIP export.
                </p>
                <Link
                  href={`${locale === "en" ? "" : `/${locale}`}/pricing/`}
                  className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none"
                >
                  Compare plans
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        )}
        {credits?.zipExport && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-sm text-violet-200">
            <Archive className="h-4 w-4 shrink-0" aria-hidden />
            Multiple successful files are downloaded as one ZIP archive.
          </div>
        )}
      </div>
    </section>
  )
}
