"use client"

import { useState } from "react"
import type { DownloadLink, TrackSummary } from "../../../../utils/bandcamp"

type BandcampAction = "trackMp3"

type ApiResponse<T> = {
  ok?: boolean
  data?: T
  error?: string
}

export type BandcampTrackMp3Result = {
  sourceUrl: string
  summary: TrackSummary | null
  filename: string
  mp3Links: DownloadLink[]
  primaryMp3Url?: string
  raw: unknown
}

type BandcampToMp3Messages = {
  requestFailed: string
  resolveTrackUrlFailed: string
  noMp3Link: string
  invalidMp3Url: string
  expiredMediaLink: string
}

export function useBandcampToMp3(messages: BandcampToMp3Messages) {
  const [trackUrl, setTrackUrl] = useState("https://gmcfosho.bandcamp.com/track/happy-bursday")
  const [result, setResult] = useState<BandcampTrackMp3Result | null>(null)
  const [loadingAction, setLoadingAction] = useState<BandcampAction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const postBandcamp = async <T,>(action: BandcampAction, payload: Record<string, unknown>): Promise<T> => {
    setLoadingAction(action)
    setError(null)

    try {
      const response = await fetch("/api/bandcamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      })

      const data = (await response.json()) as ApiResponse<T>
      if (!response.ok || !data.data) {
        throw new Error(data.error || messages.requestFailed)
      }

      return data.data
    } finally {
      setLoadingAction(null)
    }
  }

  const inspectTrackUrl = async (nextUrl?: string) => {
    const targetUrl = (nextUrl ?? trackUrl).trim()
    if (!targetUrl) return

    try {
      const nextResult = await postBandcamp<BandcampTrackMp3Result>("trackMp3", { url: targetUrl })
      setTrackUrl(targetUrl)
      setResult(nextResult)
      setDownloadError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : messages.resolveTrackUrlFailed)
    }
  }

  const quickDownloadTrack = async (nextUrl?: string) => {
    const targetUrl = (nextUrl ?? trackUrl).trim()
    if (!targetUrl) return

    try {
      const nextResult = await postBandcamp<BandcampTrackMp3Result>("trackMp3", { url: targetUrl })
      setTrackUrl(targetUrl)
      setResult(nextResult)

      const primaryUrl = nextResult.primaryMp3Url || nextResult.mp3Links[0]?.url
      if (!primaryUrl) {
        setDownloadError(messages.noMp3Link)
        return
      }

      triggerDownload(primaryUrl, nextResult.filename, nextResult.sourceUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : messages.resolveTrackUrlFailed)
    }
  }

  const triggerDownload = (url: string, filename = "bandcamp-track.mp3", referer?: string) => {
    const trimmed = url.trim()

    if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
      setDownloadError(messages.invalidMp3Url)
      return
    }

    try {
      const ts = new URL(trimmed).searchParams.get("ts")
      if (ts && Number(ts) * 1000 < Date.now()) {
        setDownloadError(messages.expiredMediaLink)
        return
      }
    } catch {
      // Let the backend validate the final media URL.
    }

    setDownloadError(null)
    const anchor = document.createElement("a")
    anchor.href = `/api/bandcamp/download?url=${encodeURIComponent(trimmed)}&filename=${encodeURIComponent(filename)}&referer=${encodeURIComponent(referer || trackUrl.trim() || "https://bandcamp.com/")}`
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return {
    trackUrl,
    result,
    loadingAction,
    error,
    downloadError,
    setTrackUrl,
    inspectTrackUrl,
    quickDownloadTrack,
    triggerDownload,
  }
}
