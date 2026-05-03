import { NextResponse } from "next/server"
import { isBandcampMediaUrl, isBandcampUrl } from "../../../../utils/bandcamp"

export const runtime = "nodejs"

function sanitizeFilename(input: string): string {
  const cleaned = input.replace(/[/\\?%*:|"<>]/g, "_").trim()
  return cleaned || "bandcamp-track.mp3"
}

function toAsciiFilename(input: string): string {
  const normalized = input
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/[/\\?%*:|"<>]/g, "_")
    .trim()
  return normalized || "bandcamp-track.mp3"
}

function getSafeReferer(value: string): string {
  return isBandcampUrl(value) ? value : "https://bandcamp.com/"
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")?.trim() || ""
  const filenameParam = searchParams.get("filename")?.trim() || "bandcamp-track.mp3"
  const refererParam = searchParams.get("referer")?.trim() || ""

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  if (!isBandcampMediaUrl(url)) {
    return NextResponse.json(
      { error: "Only Bandcamp or Bandcamp media URLs are allowed" },
      { status: 400 }
    )
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "*/*",
        Referer: getSafeReferer(refererParam),
        Origin: "https://bandcamp.com",
        Range: "bytes=0-",
      },
      cache: "no-store",
    })

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        {
          error: `Upstream download failed (${upstream.status})`,
          detail: await upstream.text().catch(() => ""),
        },
        { status: 502 }
      )
    }

    const filename = sanitizeFilename(filenameParam)
    const asciiFilename = toAsciiFilename(filename)
    const headers = new Headers()
    const contentType = upstream.headers.get("content-type") || "audio/mpeg"
    const contentLength = upstream.headers.get("content-length")

    headers.set("Content-Type", contentType)
    headers.set(
      "Content-Disposition",
      `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
    )
    headers.set("Cache-Control", "no-store")
    headers.set("X-Content-Type-Options", "nosniff")

    if (contentLength) {
      headers.set("Content-Length", contentLength)
    }

    return new Response(upstream.body, { headers })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Download failed" },
      { status: 500 }
    )
  }
}
