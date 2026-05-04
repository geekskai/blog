import { NextRequest, NextResponse } from "next/server"
import scdl from "soundcloud-downloader"

export const runtime = "nodejs"

const SOUNDCLOUD_SHORT_URL_REGEX = /^https?:\/\/on\.soundcloud\.com\/[A-Za-z0-9]+(?:[?#].*)?$/

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
      throw new Error(`Failed to resolve short URL. HTTP ${response.status}`)
    }
    return normalizeSoundCloudUrl(response.url || normalizedUrl)
  }
  return normalizedUrl
}

const replaceArtworkSize = (artworkUrl: string, size: string): string => {
  return artworkUrl.replace(
    /-(?:original|t500x500|crop|large|t300x300|badge|tiny|small)(\.[a-z0-9]+)(?:\?.*)?$/i,
    `-${size}$1`
  )
}

const getArtworkCandidates = (artworkUrl: string): string[] => {
  const httpsUrl = artworkUrl.replace(/^http:\/\//i, "https://")
  return Array.from(
    new Set([
      replaceArtworkSize(httpsUrl, "original"),
      replaceArtworkSize(httpsUrl, "t500x500"),
      replaceArtworkSize(httpsUrl, "crop"),
      replaceArtworkSize(httpsUrl, "large"),
      httpsUrl,
    ])
  )
}

const getExtensionFromContentType = (contentType: string | null): string => {
  const normalizedType = contentType?.split(";")[0].trim().toLowerCase()
  switch (normalizedType) {
    case "image/png":
      return "png"
    case "image/webp":
      return "webp"
    case "image/gif":
      return "gif"
    case "image/jpeg":
    default:
      return "jpg"
  }
}

const sanitizeFileSegment = (value: string): string => {
  return value
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100)
}

const getAsciiFileSegment = (value: string): string => {
  return (
    value
      .normalize("NFKD")
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/[<>:"/\\|?*]/g, " ")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100) || "soundcloud-artwork"
  )
}

const fetchArtworkResponse = async (artworkUrl: string): Promise<Response> => {
  const candidates = getArtworkCandidates(artworkUrl)

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        redirect: "follow",
        cache: "no-store",
      })

      const contentType = response.headers.get("Content-Type") || ""
      if (response.ok && response.body && contentType.toLowerCase().startsWith("image/")) {
        return response
      }
    } catch (error) {
      console.warn("Failed artwork candidate:", candidate, error)
    }
  }

  throw new Error("Failed to fetch track artwork")
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    const resolvedUrl = await resolveSoundCloudUrl(url)
    const info = await scdl.getInfo(resolvedUrl)

    if (!info.artwork_url) {
      return NextResponse.json({ error: "No artwork available for this track" }, { status: 404 })
    }

    const artworkResponse = await fetchArtworkResponse(info.artwork_url)
    const contentType = artworkResponse.headers.get("Content-Type") || "image/jpeg"
    const extension = getExtensionFromContentType(contentType)
    const readableBaseName =
      sanitizeFileSegment(info.title || "soundcloud-artwork") || "soundcloud-artwork"
    const asciiBaseName = getAsciiFileSegment(info.title || "soundcloud-artwork")
    const fileName = `${readableBaseName}-artwork.${extension}`
    const asciiFileName = `${asciiBaseName}-artwork.${extension}`

    return new NextResponse(artworkResponse.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        ...(artworkResponse.headers.get("Content-Length")
          ? { "Content-Length": artworkResponse.headers.get("Content-Length") as string }
          : {}),
      },
    })
  } catch (error) {
    console.error("SoundCloud artwork download error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Failed to download SoundCloud artwork"
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
