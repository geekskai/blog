"use client"

import { useState } from "react"
import type {
  AlbumSummary,
  ArtistSummary,
  DiscoveryItem,
  DownloadLink,
  ProductSummary,
  SearchItem,
  TrackSummary,
} from "../../../../utils/bandcamp"

export type BandcampSurface = "inspector" | "discover"
export type BandcampDiscoverTab = "search" | "tag"

type BandcampAction = "inspectUrl" | "search" | "discoverByTag"

export type InspectResult =
  | {
      kind: "track"
      sourceUrl: string
      summary: TrackSummary | null
      downloadLinks: DownloadLink[]
      filename: string
      raw: unknown
    }
  | {
      kind: "album"
      sourceUrl: string
      summary: AlbumSummary | null
      products: ProductSummary[]
      raw: unknown
    }
  | {
      kind: "artist"
      sourceUrl: string
      summary: ArtistSummary | null
      albumUrls: string[]
      artistUrls: string[]
      raw: unknown
    }

export type SearchResultData = {
  query: string
  page: number
  items: SearchItem[]
  raw: unknown
}

export type DiscoverResultData = {
  tag: string
  page: number
  items: DiscoveryItem[]
  raw: unknown
}

type ApiResponse<T> = {
  ok?: boolean
  data?: T
  error?: string
}

export function useBandcampDownloader() {
  const [activeSurface, setActiveSurface] = useState<BandcampSurface>("inspector")
  const [activeDiscoverTab, setActiveDiscoverTab] = useState<BandcampDiscoverTab>("search")

  const [urlInput, setUrlInput] = useState("https://gmcfosho.bandcamp.com/track/happy-bursday")
  const [searchQuery, setSearchQuery] = useState("dream pop")
  const [searchPage, setSearchPage] = useState(1)
  const [tag, setTag] = useState("ambient")
  const [tagPage, setTagPage] = useState(1)

  const [inspectResult, setInspectResult] = useState<InspectResult | null>(null)
  const [searchResult, setSearchResult] = useState<SearchResultData | null>(null)
  const [discoverResult, setDiscoverResult] = useState<DiscoverResultData | null>(null)

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
        throw new Error(data.error || "Bandcamp request failed")
      }

      return data.data
    } finally {
      setLoadingAction(null)
    }
  }

  const inspectSpecificUrl = async (nextUrl: string) => {
    if (!nextUrl.trim()) return
    try {
      const result = await postBandcamp<InspectResult>("inspectUrl", {
        url: nextUrl.trim(),
      })
      setUrlInput(nextUrl)
      setInspectResult(result)
      setActiveSurface("inspector")
      setDownloadError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not inspect this Bandcamp URL")
    }
  }

  const inspectUrl = async () => {
    await inspectSpecificUrl(urlInput)
  }

  const searchBandcamp = async () => {
    if (!searchQuery.trim()) return

    try {
      const result = await postBandcamp<SearchResultData>("search", {
        query: searchQuery.trim(),
        page: searchPage,
      })
      setSearchResult(result)
      setActiveSurface("discover")
      setActiveDiscoverTab("search")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    }
  }

  const discoverByTag = async () => {
    if (!tag.trim()) return

    try {
      const result = await postBandcamp<DiscoverResultData>("discoverByTag", {
        tag: tag.trim(),
        page: tagPage,
      })
      setDiscoverResult(result)
      setActiveSurface("discover")
      setActiveDiscoverTab("tag")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tag discovery failed")
    }
  }

  const triggerDownload = (url: string, filename = "bandcamp-track.mp3", referer?: string) => {
    const trimmed = url.trim()

    if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
      setDownloadError("Enter a valid Bandcamp media URL that starts with http or https.")
      return
    }

    try {
      const ts = new URL(trimmed).searchParams.get("ts")
      if (ts && Number(ts) * 1000 < Date.now()) {
        setDownloadError("This media link has expired. Run the URL inspection again to refresh it.")
        return
      }
    } catch {
      // Let the backend do the final validation.
    }

    setDownloadError(null)
    const anchor = document.createElement("a")
    anchor.href = `/api/bandcamp/download?url=${encodeURIComponent(trimmed)}&filename=${encodeURIComponent(filename)}&referer=${encodeURIComponent(referer || urlInput.trim() || "https://bandcamp.com/")}`
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return {
    activeSurface,
    activeDiscoverTab,
    urlInput,
    searchQuery,
    searchPage,
    tag,
    tagPage,
    inspectResult,
    searchResult,
    discoverResult,
    loadingAction,
    error,
    downloadError,
    setActiveSurface,
    setActiveDiscoverTab,
    setUrlInput,
    setSearchQuery,
    setSearchPage,
    setTag,
    setTagPage,
    setError,
    inspectUrl,
    inspectSpecificUrl,
    searchBandcamp,
    discoverByTag,
    triggerDownload,
  }
}
