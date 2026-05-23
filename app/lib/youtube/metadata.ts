import { z } from "zod"

const VIDEO_ID_RE = /^[\w-]{11}$/

const oembedSchema = z.object({
  title: z.string().min(1),
  author_name: z.string().optional(),
  thumbnail_url: z.string().url().optional(),
})

export type YouTubeMetadata = {
  videoId: string
  title: string
  thumbnail: string | null
  author: string | null
  durationSeconds: number | null
}

export class YouTubeMetadataError extends Error {
  constructor(
    message: string,
    readonly code: "invalid_url" | "video_unavailable" | "upstream"
  ) {
    super(message)
    this.name = "YouTubeMetadataError"
  }
}

export function assertYouTubeVideoId(videoId: string): string {
  const trimmed = videoId.trim()
  if (!VIDEO_ID_RE.test(trimmed)) {
    throw new YouTubeMetadataError("Invalid YouTube video id", "invalid_url")
  }
  return trimmed
}

export async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeMetadata> {
  const safeVideoId = assertYouTubeVideoId(videoId)
  const targetUrl = `https://www.youtube.com/watch?v=${safeVideoId}`
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`

  const response = await fetch(oembedUrl, { cache: "no-store" })
  if (!response.ok) {
    if (response.status === 400 || response.status === 401 || response.status === 404) {
      throw new YouTubeMetadataError("Video is unavailable", "video_unavailable")
    }
    throw new YouTubeMetadataError(`Upstream metadata request failed (${response.status})`, "upstream")
  }

  const raw = await response.json()
  const parsed = oembedSchema.safeParse(raw)
  if (!parsed.success) {
    throw new YouTubeMetadataError("Invalid metadata payload", "upstream")
  }

  return {
    videoId: safeVideoId,
    title: parsed.data.title,
    thumbnail: parsed.data.thumbnail_url ?? null,
    author: parsed.data.author_name ?? null,
    durationSeconds: null,
  }
}
