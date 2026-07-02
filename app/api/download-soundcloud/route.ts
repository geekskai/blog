import { NextRequest, NextResponse } from "next/server"
import scdl from "soundcloud-downloader"

export const runtime = "nodejs"

const SOUNDCLOUD_SHORT_URL_REGEX = /^https?:\/\/on\.soundcloud\.com\/[A-Za-z0-9]+(?:[?#].*)?$/
let cachedClientID: string | null = null

type SoundCloudTranscoding = {
  url?: string
  preset?: string
  is_legacy_transcoding?: boolean
  format?: {
    protocol?: string
    mime_type?: string
  }
}

type SoundCloudDownloadFormat = {
  kind: "progressive" | "hls"
  extension: "mp3" | "m4a"
  mimeType: "audio/mpeg" | "audio/mp4"
  sourceMimeType: string
  preset?: string
  isLegacy: boolean
  url: string
}

const normalizeSoundCloudUrl = (inputUrl: string): string => {
  try {
    const parsedUrl = new URL(inputUrl)
    if (parsedUrl.hostname === "m.soundcloud.com") {
      parsedUrl.hostname = "soundcloud.com"
    }
    return parsedUrl.toString()
  } catch {
    return inputUrl
  }
}

const resolveSoundCloudUrl = async (inputUrl: string): Promise<string> => {
  const normalizedUrl = normalizeSoundCloudUrl(inputUrl.trim())
  if (SOUNDCLOUD_SHORT_URL_REGEX.test(normalizedUrl)) {
    const response = await fetch(normalizedUrl, { redirect: "follow" })
    if (!response.ok) {
      throw Object.assign(new Error(`Failed to resolve short URL. HTTP ${response.status}`), {
        status: response.status,
      })
    }
    return normalizeSoundCloudUrl(response.url || normalizedUrl)
  }
  return normalizedUrl
}

const jsonError = (message: string, code: string, status: number) =>
  NextResponse.json(
    {
      success: false,
      code,
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )

const getSoundCloudClientID = async (): Promise<string> => {
  const configuredClientId = process.env.SOUNDCLOUD_CLIENT_ID?.trim()
  if (configuredClientId) {
    return configuredClientId
  }
  if (!cachedClientID) {
    cachedClientID = await scdl.getClientID()
  }
  return cachedClientID
}

const getCandidateOutput = (
  transcoding: SoundCloudTranscoding
): Pick<SoundCloudDownloadFormat, "kind" | "extension" | "mimeType"> | null => {
  const protocol = transcoding.format?.protocol
  const sourceMimeType = transcoding.format?.mime_type || ""

  if (protocol === "progressive" && sourceMimeType.includes("audio/mpeg")) {
    return {
      kind: "progressive",
      extension: "mp3",
      mimeType: "audio/mpeg",
    }
  }

  // SoundCloud's browser-readable HLS is normally fragmented MP4/AAC. Save it as M4A,
  // not WAV, because no server-side or browser-side PCM conversion happens here.
  if (protocol === "hls" && sourceMimeType.includes("audio/mp4")) {
    return {
      kind: "hls",
      extension: "m4a",
      mimeType: "audio/mp4",
    }
  }

  return null
}

const getCandidatePriority = (transcoding: SoundCloudTranscoding): number => {
  const output = getCandidateOutput(transcoding)
  if (!output) return 100

  if (output.kind === "progressive") return transcoding.is_legacy_transcoding ? 10 : 0
  if (transcoding.preset === "aac_160k") return 20
  if (transcoding.preset === "aac_96k") return 30
  return 40
}

const resolveFormatUrl = async (
  transcoding: SoundCloudTranscoding,
  clientID: string,
  trackAuthorization: string | undefined,
  axiosInstance: any
): Promise<string | null> => {
  if (!transcoding.url) return null

  try {
    const mediaResponse = await axiosInstance.get(transcoding.url, {
      params: {
        client_id: clientID,
        ...(trackAuthorization ? { track_authorization: trackAuthorization } : {}),
      },
      timeout: 10_000,
    })
    return typeof mediaResponse.data?.url === "string" ? mediaResponse.data.url : null
  } catch (error) {
    console.warn("SoundCloud transcoding URL resolve failed", {
      protocol: transcoding.format?.protocol,
      mimeType: transcoding.format?.mime_type,
      preset: transcoding.preset,
      status: (error as any)?.response?.status,
    })
    return null
  }
}

const resolveAvailableFormats = async (
  transcodings: SoundCloudTranscoding[],
  clientID: string,
  trackAuthorization: string | undefined,
  axiosInstance: any
): Promise<SoundCloudDownloadFormat[]> => {
  const candidates = transcodings
    .filter((transcoding) => Boolean(getCandidateOutput(transcoding)))
    .sort((a, b) => getCandidatePriority(a) - getCandidatePriority(b))

  const formats: SoundCloudDownloadFormat[] = []
  const seen = new Set<string>()

  for (const candidate of candidates) {
    const output = getCandidateOutput(candidate)
    if (!output) continue

    const directUrl = await resolveFormatUrl(candidate, clientID, trackAuthorization, axiosInstance)
    if (!directUrl || seen.has(directUrl)) continue

    seen.add(directUrl)
    formats.push({
      ...output,
      sourceMimeType: candidate.format?.mime_type || output.mimeType,
      preset: candidate.preset,
      isLegacy: Boolean(candidate.is_legacy_transcoding),
      url: directUrl,
    })
  }

  return formats
}

const getUpstreamStatus = (error: unknown): number | undefined => {
  const upstreamStatus = (error as any)?.response?.status ?? (error as any)?.status
  return typeof upstreamStatus === "number" ? upstreamStatus : undefined
}

const mapSoundCloudError = (error: unknown) => {
  const status = getUpstreamStatus(error)
  const message = error instanceof Error ? error.message : String(error)
  const normalizedMessage = message.toLowerCase()

  if (
    status === 404 ||
    normalizedMessage.includes("404") ||
    normalizedMessage.includes("not found")
  ) {
    return {
      status: 404,
      code: "soundcloud_resolve_not_found",
      message:
        "The SoundCloud URL could not be resolved. The track may have been removed, expired, or copied incorrectly.",
    }
  }

  if (
    status === 401 ||
    status === 403 ||
    normalizedMessage.includes("private") ||
    normalizedMessage.includes("restricted") ||
    normalizedMessage.includes("forbidden") ||
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("not accessible") ||
    normalizedMessage.includes("not available for streaming")
  ) {
    return {
      status: 403,
      code: "private_or_restricted",
      message:
        "This track is private, restricted, or not available for public streaming. Please try a public SoundCloud track.",
    }
  }

  return {
    status: 502,
    code: "soundcloud_upstream_error",
    message:
      "SoundCloud could not provide a usable stream right now. Please try again with a public track.",
  }
}

export async function POST(request: NextRequest) {
  let inputUrl = ""

  try {
    const body = await request.json().catch(() => ({}))
    inputUrl = typeof body.url === "string" ? body.url.trim() : ""

    if (!inputUrl) {
      return jsonError("URL is required", "invalid_url", 400)
    }

    try {
      new URL(inputUrl)
    } catch {
      return jsonError("Invalid URL format", "invalid_url", 400)
    }

    const resolvedUrl = await resolveSoundCloudUrl(inputUrl)
    const info = await scdl.getInfo(resolvedUrl)
    const transcodings = info?.media?.transcodings

    if (!Array.isArray(transcodings) || transcodings.length === 0) {
      return jsonError(
        "No usable SoundCloud audio stream was found for this track.",
        "no_usable_streams",
        422
      )
    }

    const clientID = await getSoundCloudClientID()
    const formats = await resolveAvailableFormats(
      transcodings,
      clientID,
      info.track_authorization,
      scdl.axios
    )

    if (formats.length === 0) {
      return jsonError(
        "This track does not expose a browser-downloadable MP3 or M4A stream.",
        "no_usable_streams",
        422
      )
    }

    const recommendedFormat = formats.find((format) => format.kind === "progressive") ?? formats[0]

    console.info("SoundCloud download formats resolved", {
      inputUrl,
      resolvedUrl,
      trackId: info.id,
      formatCount: formats.length,
      recommended: recommendedFormat.kind,
    })

    return NextResponse.json(
      {
        success: true,
        directUrl: recommendedFormat.url,
        directUrlType: recommendedFormat.kind,
        recommended: recommendedFormat.kind,
        formats,
        info: {
          title: info.title,
          duration: info.duration,
          id: info.id,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    console.error("SoundCloud download resolve failed", {
      inputUrl,
      status: getUpstreamStatus(error),
      message: error instanceof Error ? error.message : String(error),
    })

    const mappedError = mapSoundCloudError(error)
    return jsonError(mappedError.message, mappedError.code, mappedError.status)
  }
}
