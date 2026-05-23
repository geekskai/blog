import { NextResponse } from "next/server"
import { z } from "zod"
import {
  isApiConfigured,
  resolveReadyUrl,
  ShortsApiError,
  type DownloadLink,
} from "@/app/lib/youtube/api"

export const downloadQuerySchema = z.object({
  videoId: z.string().regex(/^[\w-]{11}$/),
  quality: z.string().min(1).max(32),
})

export function errorStatus(code: string): number {
  switch (code) {
    case "invalid_params":
      return 400
    case "not_configured":
    case "api_not_configured":
      return 503
    case "no_download_url":
      return 502
    case "quota_exceeded":
      return 429
    default:
      return 502
  }
}

export function jsonError(code: string, message?: string) {
  return NextResponse.json(message ? { error: code, message } : { error: code }, {
    status: errorStatus(code),
  })
}

export function rapidApiConfigError() {
  if (isApiConfigured()) return null
  return jsonError(
    "api_not_configured",
    "Set RAPIDAPI_KEY (or RAPIDAPI_KEY_BACKUP / RAPIDAPI_KEY_BACKUP_666) in .env.local"
  )
}

export function handleApiError(
  logScope: string,
  error: unknown
) {
  if (error instanceof ShortsApiError) {
    console.error(`[${logScope}]`, error.code, error.message)
    return jsonError(error.code, error.message)
  }

  if (error instanceof z.ZodError) {
    return jsonError("invalid_params")
  }

  const message = error instanceof Error ? error.message : "unknown"
  console.error(`[${logScope}]`, message)
  return jsonError("upstream", message)
}

type DownloadLinkResolver = (videoId: string, quality: string) => Promise<DownloadLink>

export async function handleDownloadRoute(
  request: Request,
  logScope: string,
  getDownloadLink: DownloadLinkResolver
) {
  const configError = rapidApiConfigError()
  if (configError) return configError

  try {
    const { searchParams } = new URL(request.url)
    const { videoId, quality } = downloadQuerySchema.parse({
      videoId: searchParams.get("videoId"),
      quality: searchParams.get("quality"),
    })

    const link = await getDownloadLink(videoId, quality)
    const readyUrl = await resolveReadyUrl(link)
    return NextResponse.redirect(readyUrl, { status: 302 })
  } catch (error) {
    return handleApiError(logScope, error)
  }
}
