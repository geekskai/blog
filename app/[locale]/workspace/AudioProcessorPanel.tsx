"use client"

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { Archive, Crown, FileAudio, Loader2, Square, Upload } from "lucide-react"
import { saveAs } from "file-saver"
import JSZip from "jszip"
import Link from "next/link"
import type { AccountPlanStatus } from "@/lib/billing/types"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { getAudioSelectionIssue } from "@/lib/workspace/audio"
import {
  cancelAudioProcessing,
  processAudioFile,
  type AudioOutputFormat,
  type WavBitDepth,
} from "@/lib/workspace/processor"

type QueueItem = {
  name: string
  status: "waiting" | "processing" | "done" | "failed"
  progress: number
  error?: string
}

const outputName = (name: string, extension: string) =>
  `${name.replace(/\.[^.]+$/, "").replace(/[/\\?%*:|"<>]/g, "_")}-normalized.${extension}`
const MOBILE_DEVICE_QUERY = "(max-width: 767px), (pointer: coarse) and (hover: none)"

export default function AudioProcessorPanel({
  initialBillingStatus,
  locale,
  checkoutSuccess,
  canRecordActivation,
}: {
  initialBillingStatus: AccountPlanStatus
  locale: string
  checkoutSuccess: boolean
  canRecordActivation: boolean
}) {
  const [billing, setBilling] = useState(initialBillingStatus)
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
  const effectiveBatchFileLimit = isMobile ? 1 : billing.batchFileLimit
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
      const response = await fetch("/api/billing/status/", { cache: "no-store" })
      if (response.ok) {
        const next = (await response.json()) as AccountPlanStatus
        setBilling(next)
        if (next.packageTier !== "free") {
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

  const chooseFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(event.target.files ?? [])
    setFiles(next)
    setQueue(next.map((file) => ({ name: file.name, status: "waiting", progress: 0 })))
    setError(getAudioSelectionIssue(next, effectiveBatchFileLimit))
    if (next.length > 0) {
      trackClarityEvent(next.length > 1 ? "audio_files_selected_batch" : "audio_file_selected")
    }
  }

  const processFiles = async () => {
    const issue = getAudioSelectionIssue(files, effectiveBatchFileLimit)
    if (issue) return setError(issue)
    canceledRef.current = false
    trackClarityEvent(
      files.length > 1 ? "audio_processing_started_batch" : "audio_processing_started"
    )
    setBusy(true)
    setError(null)
    const zip = new JSZip()
    let completed = 0
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
        if (files.length === 1) saveAs(blob, name)
        else zip.file(name, blob)
        completed += 1
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
            itemIndex === index ? { ...item, status: "failed", progress: 0, error: message } : item
          )
        )
      }
    }
    if (completed > 1 && billing.zipExport) {
      saveAs(await zip.generateAsync({ type: "blob" }), "geekskai-audio-toolkit.zip")
    }
    if (completed > 0 && canRecordActivation) {
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
    setBusy(false)
  }

  const cancel = () => {
    canceledRef.current = true
    trackClarityEvent("audio_processing_canceled")
    cancelAudioProcessing()
    setError("Processing canceled. Completed downloads remain on your device.")
  }

  return (
    <section
      className="rounded-2xl border border-blue-500/30 bg-slate-900/80 p-6"
      aria-labelledby="audio-processor-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Local audio processing
          </p>
          <h2 id="audio-processor-title" className="mt-2 text-2xl font-bold text-white">
            Normalize and convert your own tracks
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Two-pass LUFS processing runs in this browser. Audio and filenames are never uploaded.
            Desktop Chrome and Edge are supported; Safari is beta.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${billing.packageTier !== "free" ? "bg-purple-500/20 text-purple-200" : "bg-slate-800 text-slate-300"}`}
        >
          {billing.packageTier[0].toUpperCase() + billing.packageTier.slice(1)} ·{" "}
          {isMobile
            ? "1 file on mobile"
            : `${effectiveBatchFileLimit} file${effectiveBatchFileLimit === 1 ? "" : "s"}`}
        </span>
      </div>

      {confirming && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-blue-400/30 bg-blue-400/10 p-4 text-sm text-blue-100"
        >
          Confirming your subscription from the verified Creem webhook…
        </div>
      )}
      {confirmationTimedOut && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100"
        >
          Subscription confirmation is taking longer than expected.{" "}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-semibold underline"
          >
            Refresh status
          </button>{" "}
          or contact{" "}
          <a href="mailto:support@geekskai.com" className="font-semibold underline">
            support@geekskai.com
          </a>
          . Paid access stays locked until the verified payment event arrives.
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-slate-600 bg-slate-950/70 px-4 py-8 text-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/60 hover:border-blue-400 md:col-span-2">
          <Upload className="h-5 w-5" />
          <span>
            {files.length
              ? `${files.length} file${files.length === 1 ? "" : "s"} selected`
              : "Choose MP3, WAV, FLAC, or M4A"}
          </span>
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
            className="mt-2 w-full rounded-xl border-slate-700 bg-slate-950 text-white"
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
            className="mt-2 w-full rounded-xl border-slate-700 bg-slate-950 text-white"
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
            className="mt-2 w-full rounded-xl border-slate-700 bg-slate-950 text-white"
          >
            <option value={16}>16-bit</option>
            <option value={24}>24-bit</option>
          </select>
        </label>
      )}

      {(selectionIssue || error) && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100"
        >
          {error ?? selectionIssue}
        </p>
      )}

      {queue.length > 0 && (
        <div className="mt-5 space-y-2" aria-live="polite">
          {queue.map((item) => (
            <div key={item.name} className="rounded-xl bg-slate-950/70 p-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="flex min-w-0 items-center gap-2 text-slate-200">
                  <FileAudio className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className={item.status === "failed" ? "text-red-300" : "text-slate-400"}>
                  {item.status === "processing" ? `${item.progress}%` : item.status}
                </span>
              </div>
              {item.error && <p className="mt-1 text-xs text-red-300">{item.error}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={processFiles}
          disabled={busy || files.length === 0 || Boolean(selectionIssue)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileAudio className="h-4 w-4" />}
          {busy ? "Processing locally…" : "Process and download"}
        </button>
        {busy && (
          <button
            type="button"
            onClick={cancel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-slate-200"
          >
            <Square className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>

      {billing.packageTier === "free" && (
        <div className="mt-6 rounded-xl border border-purple-500/30 bg-purple-500/10 p-5">
          <div className="flex items-start gap-3">
            <Crown className="mt-0.5 h-5 w-5 text-purple-300" />
            <div>
              <h3 className="font-semibold text-white">
                Unlock larger local batches and ZIP export
              </h3>
              <p className="mt-1 text-sm text-purple-100/75">
                Basic supports 20 files per batch and Pro supports 50. Subscriptions cover only
                audio you import and have the right to use.
              </p>
              <Link
                href={`${locale === "en" ? "" : `/${locale}`}/pricing/`}
                className="mt-4 inline-flex rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white"
              >
                Compare plans
              </Link>
            </div>
          </div>
        </div>
      )}
      {billing.zipExport && (
        <div className="mt-5 flex items-center gap-2 text-sm text-purple-200">
          <Archive className="h-4 w-4" />
          Multiple successful files are downloaded as one ZIP archive.
        </div>
      )}
    </section>
  )
}
