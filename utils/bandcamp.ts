export type JsonObject = Record<string, unknown>

export type SearchItem = {
  type: string
  name: string
  url: string
  imageUrl?: string
}

export type DownloadLink = {
  label: string
  url: string
}

export type TrackSummary = {
  title: string
  artist?: string
  album?: string
  durationText?: string
  releaseDate?: string
  coverUrl?: string
  playableUrl?: string
  lyrics?: string
  tags: string[]
}

export type ArtistSummary = {
  name?: string
  location?: string
  bio?: string
  coverUrl?: string
}

export type AlbumSummary = {
  title?: string
  artist?: string
  releaseDate?: string
  about?: string
  coverUrl?: string
  tags: string[]
}

export type AlbumTrack = {
  id: string
  title: string
  durationText?: string
  trackNumber?: number
  playableUrl?: string
  lyrics?: string
}

export type ProductSummary = {
  name: string
  price?: string
  type?: string
}

export type DiscoveryItem = {
  title: string
  subtitle?: string
  url?: string
  imageUrl?: string
}

export type BandcampUrlType = "track" | "album" | "artist"

export function toPrettyJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return "Unable to serialize this response."
  }
}

export function isJsonObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

export function isBandcampUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.hostname === "bandcamp.com" || url.hostname.endsWith(".bandcamp.com")
  } catch {
    return false
  }
}

export function isBandcampMediaUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (
      url.hostname === "bandcamp.com" ||
      url.hostname.endsWith(".bandcamp.com") ||
      url.hostname.endsWith(".bcbits.com")
    )
  } catch {
    return false
  }
}

export function detectBandcampUrlType(value: string): BandcampUrlType {
  try {
    const url = new URL(value)
    if (url.pathname.includes("/track/")) return "track"
    if (url.pathname.includes("/album/")) return "album"
    return "artist"
  } catch {
    return "artist"
  }
}

export function isBandcampTrackUrl(value: string): boolean {
  return isBandcampUrl(value) && detectBandcampUrlType(value) === "track"
}

export function isBandcampAlbumUrl(value: string): boolean {
  return isBandcampUrl(value) && detectBandcampUrlType(value) === "album"
}

export function pickFirstString(...values: unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0)
}

export function extractStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  return input.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
}

export function formatDateLabel(value?: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDuration(seconds?: number): string | undefined {
  if (!seconds || Number.isNaN(seconds) || seconds <= 0) return undefined
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function looksLikeAudioUrl(value: string): boolean {
  const lower = value.toLowerCase()
  return (
    /\.(mp3|m4a|aac|wav|flac|ogg)(\?|$)/.test(lower) ||
    lower.includes("mp3-128") ||
    lower.includes("/stream/") ||
    lower.includes("download")
  )
}

export function findFirstMatchingUrl(
  input: unknown,
  matcher: (value: string) => boolean
): string | undefined {
  const visited = new WeakSet<object>()
  let found: string | undefined

  const visit = (value: unknown) => {
    if (found) return
    if (typeof value === "string") {
      if (isHttpUrl(value) && matcher(value)) {
        found = value
      }
      return
    }

    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }

    if (!isJsonObject(value) || visited.has(value)) return
    visited.add(value)
    Object.values(value).forEach(visit)
  }

  visit(input)
  return found
}

export function normalizeSearchResults(input: unknown): SearchItem[] {
  if (!Array.isArray(input)) return []

  return input
    .map((item): SearchItem | null => {
      if (!isJsonObject(item)) return null
      const url = pickFirstString(item.url)
      const name = pickFirstString(item.name, item.title)
      const type = pickFirstString(item.type) || "result"
      if (!url || !name) return null
      return {
        type,
        name,
        url,
        imageUrl: pickFirstString(item.image_url, item.imageUrl),
      }
    })
    .filter((item): item is SearchItem => Boolean(item))
}

export function extractDownloadLinks(input: unknown): DownloadLink[] {
  const links: DownloadLink[] = []
  const visited = new WeakSet<object>()

  const visit = (value: unknown, parentKey = "") => {
    if (typeof value === "string") {
      if (isHttpUrl(value) && looksLikeAudioUrl(value)) {
        links.push({
          label: parentKey ? `Audio link (${parentKey})` : "Audio link",
          url: value,
        })
      }
      return
    }

    if (Array.isArray(value)) {
      value.forEach((child, index) => visit(child, `${parentKey}[${index}]`))
      return
    }

    if (!isJsonObject(value) || visited.has(value)) return
    visited.add(value)

    Object.entries(value).forEach(([key, child]) => {
      const keyLower = key.toLowerCase()
      if (typeof child === "string" && isHttpUrl(child)) {
        const keyLooksLikeDownloadField =
          keyLower.includes("url") ||
          keyLower.includes("download") ||
          keyLower.includes("file") ||
          keyLower.includes("mp3") ||
          keyLower.includes("stream")
        if (keyLooksLikeDownloadField || looksLikeAudioUrl(child)) {
          links.push({
            label: `Audio link (${key})`,
            url: child,
          })
        }
      }
      visit(child, key)
    })
  }

  visit(input)

  const dedup = new Map<string, DownloadLink>()
  links.forEach((item) => {
    if (!dedup.has(item.url)) dedup.set(item.url, item)
  })
  return Array.from(dedup.values())
}

export function extractMp3DownloadLinks(input: DownloadLink[]): DownloadLink[] {
  const matches = input.filter((item) => {
    const lower = item.url.toLowerCase()
    return lower.includes("mp3-128") || /\.mp3(\?|$)/.test(lower)
  })

  const dedup = new Map<string, DownloadLink>()
  matches.forEach((item) => {
    if (!dedup.has(item.url)) dedup.set(item.url, item)
  })
  return Array.from(dedup.values())
}

export function extractTrackSummary(
  trackInfo: unknown,
  downloadLinks: DownloadLink[]
): TrackSummary | null {
  if (!isJsonObject(trackInfo)) return null

  const raw = isJsonObject(trackInfo.raw) ? trackInfo.raw : undefined
  const current = raw && isJsonObject(raw.current) ? raw.current : undefined
  const firstTrack =
    raw && Array.isArray(raw.trackinfo) && isJsonObject(raw.trackinfo[0]) ? raw.trackinfo[0] : undefined

  const title = pickFirstString(firstTrack?.title, trackInfo.title)
  if (!title) return null

  const artist = pickFirstString(raw?.artist, current?.artist, trackInfo.artist)
  const album = pickFirstString(current?.title, raw?.album_title, trackInfo.album)
  const durationText = formatDuration(
    typeof firstTrack?.duration === "number" ? firstTrack.duration : undefined
  )
  const releaseDate = formatDateLabel(
    pickFirstString(current?.publish_date, current?.release_date, trackInfo.release_date)
  )

  const fileObj = firstTrack && isJsonObject(firstTrack.file) ? firstTrack.file : undefined
  const playableFromRaw = fileObj
    ? Object.values(fileObj).find((value): value is string => typeof value === "string" && isHttpUrl(value))
    : undefined
  const playableUrl = playableFromRaw || downloadLinks[0]?.url

  const coverUrl =
    findFirstMatchingUrl(trackInfo, (value) => {
      const lower = value.toLowerCase()
      return (
        /\.(jpg|jpeg|png|webp)(\?|$)/.test(lower) ||
        lower.includes("/img/") ||
        lower.includes("f4.bcbits.com/img")
      )
    }) || undefined

  const lyrics = typeof firstTrack?.lyrics === "string" ? firstTrack.lyrics.trim() : undefined
  const tags = extractStringArray(raw?.tag_names)

  return {
    title,
    artist,
    album,
    durationText,
    releaseDate,
    coverUrl,
    playableUrl,
    lyrics: lyrics || undefined,
    tags,
  }
}

export function extractArtistSummary(artistInfo: unknown): ArtistSummary | null {
  if (!isJsonObject(artistInfo)) return null

  const raw = isJsonObject(artistInfo.raw) ? artistInfo.raw : undefined
  const summary: ArtistSummary = {
    name: pickFirstString(
      artistInfo.name,
      artistInfo.artist,
      artistInfo.band_name,
      raw?.band_name,
      raw?.artist
    ),
    location: pickFirstString(artistInfo.location, raw?.location),
    bio: pickFirstString(artistInfo.bio, raw?.bio, raw?.about),
    coverUrl:
      findFirstMatchingUrl(artistInfo, (value) => value.includes("bcbits.com/img")) || undefined,
  }

  return summary.name || summary.location || summary.bio || summary.coverUrl ? summary : null
}

export function extractAlbumSummary(albumInfo: unknown): AlbumSummary | null {
  if (!isJsonObject(albumInfo)) return null

  const raw = isJsonObject(albumInfo.raw) ? albumInfo.raw : undefined
  const current = raw && isJsonObject(raw.current) ? raw.current : undefined
  const summary: AlbumSummary = {
    title: pickFirstString(albumInfo.title, current?.title, raw?.album_title),
    artist: pickFirstString(albumInfo.artist, current?.artist, raw?.artist),
    releaseDate: formatDateLabel(
      pickFirstString(current?.release_date, current?.publish_date, albumInfo.release_date)
    ),
    about: pickFirstString(current?.about, raw?.about, albumInfo.about),
    coverUrl:
      findFirstMatchingUrl(albumInfo, (value) => {
        const lower = value.toLowerCase()
        return lower.includes("bcbits.com/img") || /\.(jpg|jpeg|png|webp)(\?|$)/.test(lower)
      }) || undefined,
    tags: extractStringArray(raw?.tag_names),
  }

  return summary.title || summary.artist || summary.releaseDate || summary.about || summary.coverUrl
    ? summary
    : null
}

export function extractAlbumTracks(albumInfo: unknown): AlbumTrack[] {
  if (!isJsonObject(albumInfo)) return []

  const raw = isJsonObject(albumInfo.raw) ? albumInfo.raw : undefined
  const trackInfo = raw && Array.isArray(raw.trackinfo) ? raw.trackinfo : []

  const tracks = trackInfo
    .map((item, index): AlbumTrack | null => {
      if (!isJsonObject(item)) return null

      const title = pickFirstString(item.title, item.name)
      if (!title) return null

      const fileObj = isJsonObject(item.file) ? item.file : undefined
      const playableUrl = fileObj
        ? Object.values(fileObj).find(
            (value): value is string => typeof value === "string" && isHttpUrl(value)
          )
        : undefined

      return {
        id: pickFirstString(item.id, item.track_id, item.title) || `${index}-${title}`,
        title,
        durationText: formatDuration(typeof item.duration === "number" ? item.duration : undefined),
        trackNumber:
          typeof item.track_num === "number"
            ? item.track_num
            : typeof item.trackNumber === "number"
              ? item.trackNumber
              : index + 1,
        playableUrl,
        lyrics: typeof item.lyrics === "string" && item.lyrics.trim() ? item.lyrics.trim() : undefined,
      }
    })
    .filter((item): item is AlbumTrack => Boolean(item))

  const dedup = new Map<string, AlbumTrack>()
  tracks.forEach((item) => {
    const key = `${item.trackNumber || ""}-${item.title}`
    if (!dedup.has(key)) dedup.set(key, item)
  })

  return Array.from(dedup.values())
}

export function extractProductSummaries(input: unknown): ProductSummary[] {
  if (!Array.isArray(input)) return []

  const results = input
    .map((item): ProductSummary | null => {
      if (!isJsonObject(item)) return null
      const name = pickFirstString(item.name, item.title, item.product_name, item.option_name, item.sku_name)
      if (!name) return null

      const priceValue = pickFirstString(item.price, item.display_price)
      const currency = pickFirstString(item.currency)
      const price =
        priceValue || typeof item.amount === "number"
          ? [priceValue || String(item.amount), currency].filter(Boolean).join(" ")
          : undefined

      return {
        name,
        price,
        type: pickFirstString(item.type, item.product_type, item.format),
      }
    })
    .filter((item): item is ProductSummary => Boolean(item))

  const dedup = new Map<string, ProductSummary>()
  results.forEach((item) => {
    if (!dedup.has(item.name)) dedup.set(item.name, item)
  })
  return Array.from(dedup.values())
}

function getFallbackTitleFromUrl(url: string): string | undefined {
  try {
    return new URL(url).pathname.replace(/\//g, " ").trim() || undefined
  } catch {
    return undefined
  }
}

export function normalizeDiscoveryResults(input: unknown): DiscoveryItem[] {
  if (!Array.isArray(input)) return []

  const results = input
    .map((item): DiscoveryItem | null => {
      if (!isJsonObject(item)) return null
      const url =
        pickFirstString(item.url, item.item_url, item.album_url, item.track_url) ||
        findFirstMatchingUrl(item, (value) => value.includes(".bandcamp.com/"))
      const title =
        pickFirstString(item.name, item.title, item.album_title, item.tralbum_title, item.band_name) ||
        (url ? getFallbackTitleFromUrl(url) : undefined)
      if (!title) return null

      return {
        title,
        subtitle: pickFirstString(item.artist, item.band_name, item.type, item.genre),
        url,
        imageUrl:
          pickFirstString(item.image_url, item.imageUrl) ||
          findFirstMatchingUrl(item, (value) => value.includes("bcbits.com/img")),
      }
    })
    .filter((item): item is DiscoveryItem => Boolean(item))

  const dedup = new Map<string, DiscoveryItem>()
  results.forEach((item) => {
    const key = item.url || item.title
    if (!dedup.has(key)) dedup.set(key, item)
  })
  return Array.from(dedup.values())
}

export function normalizeFilenamePart(value: string): string {
  return value
    .replace(/[/\\?%*:|"<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function guessTrackFilename(trackInfo: unknown): string {
  if (!isJsonObject(trackInfo)) return "bandcamp-track.mp3"

  const titleRaw = pickFirstString(
    trackInfo.title,
    trackInfo.track_title,
    trackInfo.name,
    isJsonObject(trackInfo.track) ? trackInfo.track.title : undefined
  )
  const artistRaw = pickFirstString(
    trackInfo.artist,
    trackInfo.artist_name,
    trackInfo.band_name,
    isJsonObject(trackInfo.artist) ? trackInfo.artist.name : undefined
  )

  const title = normalizeFilenamePart(titleRaw || "")
  const artist = normalizeFilenamePart(artistRaw || "")

  if (artist && title) return `${artist} - ${title}.mp3`
  if (title) return `${title}.mp3`
  if (artist) return `${artist}.mp3`
  return "bandcamp-track.mp3"
}
