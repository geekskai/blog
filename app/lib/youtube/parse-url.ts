const VIDEO_ID_RE = /^[\w-]{11}$/

export type YouTubeUrlKind = "shorts" | "video"

export type ParsedYouTubeUrl = {
  kind: YouTubeUrlKind
  videoId: string
}

function extractVideoId(id: string | undefined | null): string | null {
  if (!id) return null
  return VIDEO_ID_RE.test(id) ? id : null
}

export function parseYouTubeUrl(input: string): ParsedYouTubeUrl | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (VIDEO_ID_RE.test(trimmed)) {
    return { kind: "shorts", videoId: trimmed }
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`)
    const host = url.hostname.replace(/^www\./, "").toLowerCase()

    if (host === "youtu.be") {
      const id = extractVideoId(url.pathname.split("/").filter(Boolean)[0])
      return id ? { kind: "video", videoId: id } : null
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (url.pathname.startsWith("/shorts/")) {
        const id = extractVideoId(url.pathname.split("/")[2])
        return id ? { kind: "shorts", videoId: id } : null
      }
      if (url.pathname === "/watch") {
        const id = extractVideoId(url.searchParams.get("v"))
        return id ? { kind: "video", videoId: id } : null
      }
      if (url.pathname.startsWith("/embed/")) {
        const id = extractVideoId(url.pathname.split("/")[2])
        return id ? { kind: "video", videoId: id } : null
      }
    }
  } catch {
    return null
  }

  return null
}

/** Accepts any supported YouTube URL (Shorts or regular video). */
export function parseYouTubeVideoId(input: string): string | null {
  return parseYouTubeUrl(input)?.videoId ?? null
}

/** Accepts only Shorts URLs (and bare 11-character video IDs). */
export function parseYouTubeShortsVideoId(input: string): string | null {
  const parsed = parseYouTubeUrl(input)
  return parsed?.kind === "shorts" ? parsed.videoId : null
}

export function isYouTubeUrl(input: string): boolean {
  return parseYouTubeUrl(input) !== null
}
