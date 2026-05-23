/**
 * RapidAPI download endpoints with key rotation/fallback.
 */
const HOST =
  process.env.RAPIDAPI_YOUTUBE_HOST ?? "youtube-video-fast-downloader-24-7.p.rapidapi.com"
const RAPIDAPI_QUOTA_COOLDOWN_MS =
  Number(process.env.RAPIDAPI_QUOTA_COOLDOWN_MS ?? `${30 * 60 * 1000}`) || 30 * 60 * 1000
const RAPIDAPI_KEYS = [
  process.env.RAPIDAPI_KEY?.trim(),
  process.env.RAPIDAPI_KEY_BACKUP?.trim(),
  process.env.RAPIDAPI_KEY_BACKUP_666?.trim(),
].filter((key): key is string => Boolean(key))
const rapidApiQuotaBlockedUntilByKey = new Map<string, number>()

export type DownloadLink = {
  url: string
  fallbackUrl: string | null
  mimeType: string
}

export class ShortsApiError extends Error {
  constructor(
    message: string,
    readonly code: "not_configured" | "upstream" | "no_download_url" | "quota_exceeded"
  ) {
    super(message)
    this.name = "ShortsApiError"
  }
}

type RawDownload = {
  file?: string
  reserved_file?: string
  mime?: string
}

export function isApiConfigured(): boolean {
  return RAPIDAPI_KEYS.length > 0
}

function headers(key?: string): HeadersInit {
  const resolvedKey = key?.trim() || RAPIDAPI_KEYS[0]
  if (!resolvedKey) {
    throw new ShortsApiError(
      "Set RAPIDAPI_KEY (or RAPIDAPI_KEY_BACKUP / RAPIDAPI_KEY_BACKUP_666) in environment",
      "not_configured"
    )
  }
  return {
    "x-rapidapi-host": HOST,
    "x-rapidapi-key": resolvedKey,
  }
}

function isRapidApiQuotaMessage(message: string): boolean {
  return /(exceeded|over).*(quota|plan)|monthly quota|quota for requests/i.test(message)
}

function isRapidApiKeyScopedFailure(message: string): boolean {
  return /(not subscribed|invalid api key|unauthorized|forbidden|access denied)/i.test(message)
}

async function rapidGet<T>(path: string): Promise<T> {
  const now = Date.now()
  const availableKeys = RAPIDAPI_KEYS.filter(
    (key) => (rapidApiQuotaBlockedUntilByKey.get(key) ?? 0) <= now
  )

  if (!availableKeys.length) {
    throw new ShortsApiError(
      "RapidAPI quota is exhausted on all configured keys. Please wait for reset or upgrade your plan.",
      "quota_exceeded"
    )
  }

  let sawQuotaError = false
  let sawKeyFailure = false

  for (const key of availableKeys) {
    const res = await fetch(`https://${HOST}${path}`, {
      headers: headers(key),
      cache: "no-store",
    })

    const text = await res.text()
    let data: unknown = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      // Non-JSON body from upstream.
    }

    if (res.ok) {
      return data as T
    }

    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message: unknown }).message)
        : text || res.statusText

    if (isRapidApiQuotaMessage(message)) {
      sawQuotaError = true
      rapidApiQuotaBlockedUntilByKey.set(key, Date.now() + RAPIDAPI_QUOTA_COOLDOWN_MS)
      continue
    }

    if (isRapidApiKeyScopedFailure(message)) {
      sawKeyFailure = true
      rapidApiQuotaBlockedUntilByKey.set(key, Date.now() + RAPIDAPI_QUOTA_COOLDOWN_MS)
      continue
    }

    throw new ShortsApiError(message || `API error (${res.status})`, "upstream")
  }

  if (sawQuotaError) {
    throw new ShortsApiError(
      "RapidAPI quota is exhausted on all configured keys. Please wait for reset or upgrade your plan.",
      "quota_exceeded"
    )
  }

  if (sawKeyFailure) {
    throw new ShortsApiError(
      "No usable RapidAPI key is currently available. Check subscription/permissions for backup keys.",
      "upstream"
    )
  }

  throw new ShortsApiError("RapidAPI request failed", "upstream")
}

export async function getVideoDownloadLink(
  videoId: string,
  qualityId: string
): Promise<DownloadLink> {
  const data = await rapidGet<RawDownload>(
    `/download_video/${encodeURIComponent(videoId)}?quality=${encodeURIComponent(qualityId)}`
  )
  const url = data.file?.trim()
  if (!url) throw new ShortsApiError("No download URL returned", "no_download_url")
  return {
    url,
    fallbackUrl: data.reserved_file?.trim() || null,
    mimeType: (data.mime ?? "video/mp4").replace(/\\\//g, "/"),
  }
}

export async function getAudioDownloadLink(
  videoId: string,
  qualityId: string
): Promise<DownloadLink> {
  const data = await rapidGet<RawDownload>(
    `/download_audio/${encodeURIComponent(videoId)}?quality=${encodeURIComponent(qualityId)}`
  )
  const url = data.file?.trim()
  if (!url) throw new ShortsApiError("No download URL returned", "no_download_url")
  return {
    url,
    fallbackUrl: data.reserved_file?.trim() || null,
    mimeType: (data.mime ?? "audio/mp4").replace(/\\\//g, "/"),
  }
}

/** Poll CDN until HEAD succeeds (files can be prepared asynchronously). */
export async function resolveReadyUrl(link: DownloadLink, maxAttempts = 8): Promise<string> {
  const urls = [link.url, link.fallbackUrl].filter(Boolean) as string[]

  for (let i = 0; i < maxAttempts; i++) {
    for (const url of urls) {
      try {
        const head = await fetch(url, { method: "HEAD", cache: "no-store" })
        if (head.ok) return url
      } catch {
        // Retry below.
      }
    }
    if (i < maxAttempts - 1) {
      await new Promise((r) => setTimeout(r, 1500))
    }
  }

  return link.url
}
