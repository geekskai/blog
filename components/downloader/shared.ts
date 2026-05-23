"use client"

export type DownloaderApiErrorCode =
  | "invalid_url"
  | "video_unavailable"
  | "api_not_configured"
  | "quota_exceeded"
  | "no_download_url"
  | "upstream"

export type ClientVideoMetadata = {
  videoId: string
  title: string
  thumbnail: string | null
  author: string | null
  durationSeconds: number | null
}

type YouTubeDataResponse = {
  items?: Array<{
    id?: string
    snippet?: {
      title?: string
      channelTitle?: string
      thumbnails?: Record<string, { url?: string; width?: number; height?: number }>
    }
    contentDetails?: {
      duration?: string
    }
  }>
}

function parseIsoDuration(value: string | undefined): number | null {
  if (!value) return null
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(value)
  if (!match) return null
  const [, days = "0", hours = "0", minutes = "0", seconds = "0"] = match
  return Number(days) * 86400 + Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
}

function pickThumbnail(
  thumbnails: Record<string, { url?: string; width?: number; height?: number }> | undefined
): string | null {
  if (!thumbnails) return null
  const best = Object.values(thumbnails)
    .filter((item) => Boolean(item?.url))
    .sort((a, b) => (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0))[0]
  return best?.url ?? null
}

export function buildYouTubeThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

async function parseJsonSafe(res: Response): Promise<Record<string, unknown>> {
  return res.json().catch(() => ({}))
}

export async function fetchYouTubeMetadataClient(
  videoId: string,
  defaultTitle = "YouTube Video"
): Promise<ClientVideoMetadata> {
  const key = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY?.trim()
  if (!key) {
    throw new Error("api_not_configured")
  }

  const query = new URLSearchParams({
    part: "snippet,contentDetails",
    id: videoId,
    key,
  })
  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${query}`, {
    cache: "no-store",
  })
  const data = (await parseJsonSafe(response)) as YouTubeDataResponse

  if (!response.ok) {
    throw new Error("upstream")
  }

  const item = data.items?.[0]
  if (!item?.id) {
    throw new Error("video_unavailable")
  }

  return {
    videoId,
    title: item.snippet?.title?.trim() || defaultTitle,
    author: item.snippet?.channelTitle ?? null,
    thumbnail: pickThumbnail(item.snippet?.thumbnails) || buildYouTubeThumbnailUrl(videoId),
    durationSeconds: parseIsoDuration(item.contentDetails?.duration),
  }
}

export function mapDownloaderApiError(message?: string): DownloaderApiErrorCode {
  if (!message) return "upstream"

  const normalized = message.toLowerCase()

  if (normalized.includes("invalid_url") || normalized.includes("invalid")) {
    return "invalid_url"
  }
  if (
    normalized.includes("video_unavailable") ||
    normalized.includes("not_found") ||
    normalized.includes("private")
  ) {
    return "video_unavailable"
  }
  if (normalized.includes("api_not_configured") || normalized.includes("not_configured")) {
    return "api_not_configured"
  }
  if (normalized.includes("quota_exceeded") || normalized.includes("quota")) {
    return "quota_exceeded"
  }
  if (normalized.includes("no_download_url")) {
    return "no_download_url"
  }

  return "upstream"
}

export function getDownloaderErrorMessage(
  t: (key: string, values?: Record<string, string | number>) => string,
  code: DownloaderApiErrorCode | null
): string | null {
  if (!code) return null

  switch (code) {
    case "invalid_url":
      return t("error_invalid_url")
    case "video_unavailable":
      return t("error_video_unavailable")
    case "api_not_configured":
      return t("error_api_not_configured")
    case "quota_exceeded":
      return t("error_quota_exceeded")
    case "no_download_url":
      return t("error_no_download_url")
    default:
      return t("error_upstream")
  }
}
