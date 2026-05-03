"use client"

import { useState } from "react"
import type { AlbumSummary, AlbumTrack, DownloadLink, ProductSummary } from "../../../../utils/bandcamp"

type BandcampAction = "albumDownload"

type ApiResponse<T> = {
  ok?: boolean
  data?: T
  error?: string
}

export type BandcampAlbumDownloadResult = {
  sourceUrl: string
  summary: AlbumSummary | null
  products: ProductSummary[]
  tracks: AlbumTrack[]
  mediaLinks: DownloadLink[]
  mp3Links: DownloadLink[]
  raw: unknown
}

type BandcampAlbumDownloaderMessages = {
  requestFailed: string
  resolveAlbumUrlFailed: string
  invalidMediaUrl: string
  expiredMediaLink: string
}

export function useBandcampAlbumDownloader(messages: BandcampAlbumDownloaderMessages) {
  const [albumUrl, setAlbumUrl] = useState("https://russelbuck.bandcamp.com/album/ravepop-remixes")
  const [result, setResult] = useState<BandcampAlbumDownloadResult | null>(null)
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

  const inspectAlbumUrl = async (nextUrl?: string) => {
    const targetUrl = (nextUrl ?? albumUrl).trim()
    if (!targetUrl) return

    try {
      const nextResult = await postBandcamp<BandcampAlbumDownloadResult>("albumDownload", {
        url: targetUrl,
      })
      setAlbumUrl(targetUrl)
      setResult(nextResult)
      setDownloadError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : messages.resolveAlbumUrlFailed)
    }
  }

  const triggerDownload = (url: string, filename = "bandcamp-album-audio.mp3", referer?: string) => {
    const trimmed = url.trim()

    if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
      setDownloadError(messages.invalidMediaUrl)
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
    anchor.href = `/api/bandcamp/download?url=${encodeURIComponent(trimmed)}&filename=${encodeURIComponent(filename)}&referer=${encodeURIComponent(referer || albumUrl.trim() || "https://bandcamp.com/")}`
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return {
    albumUrl,
    result,
    loadingAction,
    error,
    downloadError,
    setAlbumUrl,
    inspectAlbumUrl,
    triggerDownload,
  }
}
