import { NextResponse } from "next/server"
import bandcampScraper from "bandcamp-scraper"
import {
  detectBandcampUrlType,
  extractAlbumTracks,
  extractAlbumSummary,
  extractArtistSummary,
  extractDownloadLinks,
  extractMp3DownloadLinks,
  extractProductSummaries,
  extractTrackSummary,
  guessTrackFilename,
  isBandcampAlbumUrl,
  isBandcampUrl,
  isBandcampTrackUrl,
  normalizeDiscoveryResults,
} from "../../../utils/bandcamp"

export const runtime = "nodejs"

type JsonObject = Record<string, unknown>

type BandcampAction =
  | "inspectUrl"
  | "trackMp3"
  | "albumDownload"
  | "discoverByTag"
  | "albumsWithTag"
  | "albumUrls"
  | "albumInfo"
  | "albumProducts"
  | "artistInfo"
  | "artistUrls"
  | "trackInfo"

type BandcampScraper = {
  search: (
    params: { query: string; page?: number },
    cb: (error: unknown, result: unknown) => void
  ) => void
  getAlbumsWithTag: (
    params: { tag: string; page?: number },
    cb: (error: unknown, result: unknown) => void
  ) => void
  getAlbumUrls: (artistUrl: string, cb: (error: unknown, result: unknown) => void) => void
  getAlbumInfo: (albumUrl: string, cb: (error: unknown, result: unknown) => void) => void
  getAlbumProducts: (albumUrl: string, cb: (error: unknown, result: unknown) => void) => void
  getArtistInfo: (artistUrl: string, cb: (error: unknown, result: unknown) => void) => void
  getArtistUrls?: (labelUrl: string, cb: (error: unknown, result: unknown) => void) => void
  getTrackInfo: (trackUrl: string, cb: (error: unknown, result: unknown) => void) => void
}

class BadRequestError extends Error {}

const bandcamp = bandcampScraper as unknown as BandcampScraper

function toPositiveInt(value: unknown, fallback = 1): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.floor(parsed)
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function parseAction(value: unknown): BandcampAction {
  const action = toStringValue(value) as BandcampAction
  if (!action) {
    throw new BadRequestError("Missing action")
  }
  return action
}

function getRequiredString(body: JsonObject, key: string): string {
  const value = toStringValue(body[key])
  if (!value) {
    throw new BadRequestError(`Missing ${key}`)
  }
  return value
}

function getRequiredBandcampUrl(body: JsonObject, key: string): string {
  const value = getRequiredString(body, key)
  if (!isBandcampUrl(value)) {
    throw new BadRequestError(`${key} must be a valid Bandcamp URL`)
  }
  return value
}

function getPage(body: JsonObject): number {
  return toPositiveInt(body.page, 1)
}

function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  })
}

function runBandcampCall<T>(runner: (cb: (error: unknown, result: T) => void) => void): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    runner((error, result) => {
      if (error) {
        reject(error instanceof Error ? error : new Error(String(error)))
        return
      }
      resolve(result)
    })
  })
}

async function getArtistUrls(labelUrl: string): Promise<string[]> {
  if (!bandcamp.getArtistUrls) return []

  try {
    const result = await runBandcampCall<unknown>((cb) => bandcamp.getArtistUrls?.(labelUrl, cb))
    return Array.isArray(result)
      ? result.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : []
  } catch {
    return []
  }
}

async function inspectBandcampUrl(url: string) {
  const kind = detectBandcampUrlType(url)

  if (kind === "track") {
    const raw = await runBandcampCall<unknown>((cb) => bandcamp.getTrackInfo(url, cb))
    const downloadLinks = extractDownloadLinks(raw)
    return {
      kind,
      sourceUrl: url,
      summary: extractTrackSummary(raw, downloadLinks),
      downloadLinks,
      filename: guessTrackFilename(raw),
      raw,
    }
  }

  if (kind === "album") {
    const [rawInfo, rawProducts] = await Promise.all([
      runBandcampCall<unknown>((cb) => bandcamp.getAlbumInfo(url, cb)),
      runBandcampCall<unknown>((cb) => bandcamp.getAlbumProducts(url, cb)),
    ])

    return {
      kind,
      sourceUrl: url,
      summary: extractAlbumSummary(rawInfo),
      products: extractProductSummaries(rawProducts),
      raw: {
        info: rawInfo,
        products: rawProducts,
      },
    }
  }

  const [rawInfo, rawAlbumUrls, rawArtistUrls] = await Promise.all([
    runBandcampCall<unknown>((cb) => bandcamp.getArtistInfo(url, cb)),
    runBandcampCall<unknown>((cb) => bandcamp.getAlbumUrls(url, cb)),
    getArtistUrls(url),
  ])

  return {
    kind,
    sourceUrl: url,
    summary: extractArtistSummary(rawInfo),
    albumUrls: Array.isArray(rawAlbumUrls)
      ? rawAlbumUrls.filter(
          (item): item is string => typeof item === "string" && item.trim().length > 0
        )
      : [],
    artistUrls: rawArtistUrls,
    raw: {
      info: rawInfo,
      albumUrls: rawAlbumUrls,
      artistUrls: rawArtistUrls,
    },
  }
}

async function resolveBandcampTrackMp3(trackUrl: string) {
  if (!isBandcampTrackUrl(trackUrl)) {
    throw new BadRequestError("url must be a valid Bandcamp track URL")
  }

  const raw = await runBandcampCall<unknown>((cb) => bandcamp.getTrackInfo(trackUrl, cb))
  const downloadLinks = extractDownloadLinks(raw)
  const mp3Links = extractMp3DownloadLinks(downloadLinks)

  const summary = extractTrackSummary(raw, mp3Links.length ? mp3Links : downloadLinks)

  return {
    sourceUrl: trackUrl,
    summary,
    filename: guessTrackFilename(raw),
    mp3Links,
    primaryMp3Url: mp3Links[0]?.url,
    raw,
  }
}

async function resolveBandcampAlbumDownload(albumUrl: string) {
  if (!isBandcampAlbumUrl(albumUrl)) {
    throw new BadRequestError("url must be a valid Bandcamp album URL")
  }

  const [rawInfo, rawProducts] = await Promise.all([
    runBandcampCall<unknown>((cb) => bandcamp.getAlbumInfo(albumUrl, cb)),
    runBandcampCall<unknown>((cb) => bandcamp.getAlbumProducts(albumUrl, cb)),
  ])

  const downloadLinks = extractDownloadLinks(rawInfo)
  const mp3Links = extractMp3DownloadLinks(downloadLinks)
  const tracks = extractAlbumTracks(rawInfo)

  return {
    sourceUrl: albumUrl,
    summary: extractAlbumSummary(rawInfo),
    products: extractProductSummaries(rawProducts),
    tracks,
    mediaLinks: downloadLinks,
    mp3Links,
    raw: {
      info: rawInfo,
      products: rawProducts,
    },
  }
}

const handlers: Record<BandcampAction, (body: JsonObject) => Promise<unknown>> = {
  inspectUrl: async (body) => {
    const url = getRequiredBandcampUrl(body, "url")
    return inspectBandcampUrl(url)
  },
  trackMp3: async (body) => {
    const url = getRequiredString(body, "url")
    return resolveBandcampTrackMp3(url)
  },
  albumDownload: async (body) => {
    const url = getRequiredString(body, "url")
    return resolveBandcampAlbumDownload(url)
  },
  discoverByTag: async (body) => {
    const tag = getRequiredString(body, "tag")
    const page = getPage(body)
    const raw = await runBandcampCall<unknown>((cb) => bandcamp.getAlbumsWithTag({ tag, page }, cb))
    return {
      tag,
      page,
      items: normalizeDiscoveryResults(raw),
      raw,
    }
  },
  albumsWithTag: async (body) => {
    const tag = getRequiredString(body, "tag")
    const page = getPage(body)
    return runBandcampCall<unknown>((cb) => bandcamp.getAlbumsWithTag({ tag, page }, cb))
  },
  albumUrls: async (body) => {
    const artistUrl = getRequiredBandcampUrl(body, "artistUrl")
    return runBandcampCall<unknown>((cb) => bandcamp.getAlbumUrls(artistUrl, cb))
  },
  albumInfo: async (body) => {
    const albumUrl = getRequiredBandcampUrl(body, "albumUrl")
    return runBandcampCall<unknown>((cb) => bandcamp.getAlbumInfo(albumUrl, cb))
  },
  albumProducts: async (body) => {
    const albumUrl = getRequiredBandcampUrl(body, "albumUrl")
    return runBandcampCall<unknown>((cb) => bandcamp.getAlbumProducts(albumUrl, cb))
  },
  artistInfo: async (body) => {
    const artistUrl = getRequiredBandcampUrl(body, "artistUrl")
    return runBandcampCall<unknown>((cb) => bandcamp.getArtistInfo(artistUrl, cb))
  },
  artistUrls: async (body) => {
    const artistUrl = getRequiredBandcampUrl(body, "artistUrl")
    return getArtistUrls(artistUrl)
  },
  trackInfo: async (body) => {
    const trackUrl = getRequiredBandcampUrl(body, "trackUrl")
    return runBandcampCall<unknown>((cb) => bandcamp.getTrackInfo(trackUrl, cb))
  },
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as JsonObject
    const action = parseAction(body.action)
    const handler = handlers[action]

    if (!handler) {
      throw new BadRequestError("Unsupported action")
    }

    const data = await handler(body)
    return jsonResponse({ ok: true, action, data })
  } catch (error) {
    if (error instanceof BadRequestError) {
      return jsonResponse({ error: error.message }, 400)
    }

    return jsonResponse(
      { error: error instanceof Error ? error.message : "Bandcamp request failed" },
      500
    )
  }
}
