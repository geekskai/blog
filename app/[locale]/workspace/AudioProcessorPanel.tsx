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

const fieldLabelClass = "text-xs font-medium text-slate-400"

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

  const canProcess =
    !busy &&
    files.length > 0 &&
    !selectionIssue &&
    Boolean(totalDurationSeconds) &&
    !(isSignedIn && credits && estimatedCredits > credits.total)

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
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Two-pass LUFS in-browser · Chrome & Edge · Safari beta
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 text-xs font-semibold text-violet-100">
              <Coins className="h-3.5 w-3.5" aria-hidden />
              {isSignedIn ? `${credits?.total ?? 0} Credits` : "Sign in required"}
            </span>
            <span className="inline-flex min-h-8 items-center rounded-lg border border-slate-700/80 bg-slate-900/60 px-2.5 text-xs font-medium text-slate-300">
              {isMobile ? "1 file · mobile" : `${effectiveBatchFileLimit} files · batch`}
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

          <label className="group flex min-h-[7.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600/70 bg-slate-900/35 px-4 py-4 text-center transition-[border-color,background-color] duration-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 hover:border-sky-500/45 hover:bg-slate-900/55 motion-reduce:transition-none sm:min-h-[8rem]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-500/25 bg-sky-500/10 text-sky-300">
              <Upload className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-medium text-slate-200">
              {files.length
                ? `${files.length} file${files.length === 1 ? "" : "s"} selected`
                : "Choose MP3, WAV, FLAC, or M4A"}
            </span>
            <span className="text-xs text-slate-500">Tap to browse · files stay on device</span>
            <input
              type="file"
              accept=".mp3,.wav,.flac,.m4a,audio/*"
              multiple={!isMobile}
              className="sr-only"
              onChange={chooseFiles}
              disabled={busy}
            />
          </label>

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
            <p className="text-xs text-slate-500">Reading duration for credit estimate…</p>
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
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Queue ({queue.length})
              </p>
              <div className="max-h-40 space-y-1.5 overflow-y-auto pr-0.5 sm:max-h-48">
                {queue.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-lg border border-slate-800/70 bg-slate-900/35 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2 text-slate-200">
                        <FileAudio className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden />
                        <span className="truncate text-xs sm:text-sm">{item.name}</span>
                      </span>
                      <span
                        className={`shrink-0 text-[11px] font-medium sm:text-xs ${
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
                    {item.error ? (
                      <p className="mt-1 text-[11px] text-rose-300">{item.error}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Middle · Options */}
        <div className="border-b border-slate-800/80 p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Output settings
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className={fieldLabelClass}>Format</span>
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
            <label className="block">
              <span className={fieldLabelClass}>Target loudness (LUFS)</span>
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
            {format === "wav" ? (
              <label className="block sm:col-span-2 lg:col-span-1">
                <span className={fieldLabelClass}>WAV bit depth</span>
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
            ) : null}
          </div>
        </div>

        {/* Bottom · Actions */}
        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={processFiles}
              disabled={!canProcess}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-violet-600 px-4 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
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

          {credits?.zipExport ? (
            <p className="flex items-start gap-2 text-xs leading-5 text-violet-200/80">
              <Archive className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Multiple files download as one ZIP when processing succeeds.
            </p>
          ) : null}

          {!credits?.paidAccess ? (
            <div className="rounded-lg border border-violet-500/20 bg-violet-950/25 p-3">
              <div className="flex items-start gap-2.5">
                <Crown className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Need more Credits?</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-400">
                    Buy 480 once or subscribe for 2,800 monthly. Paid plans unlock 50-file batches.
                  </p>
                  <Link
                    href={`${locale === "en" ? "" : `/${locale}`}/pricing/`}
                    className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200"
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
