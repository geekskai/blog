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

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    console.log("Get info request received for URL:", url)

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const resolvedUrl = await resolveSoundCloudUrl(url)
    console.log("Resolved SoundCloud URL:", resolvedUrl)

    const info = await scdl.getInfo(resolvedUrl)

    return NextResponse.json({
      success: true,
      info,
    })
  } catch (error) {
    console.error("Get info error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to get info"
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    )
  }
}
