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

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    const resolvedUrl = await resolveSoundCloudUrl(url)
    console.log("Resolved SoundCloud URL:", resolvedUrl)

    const info = await scdl.getInfo(resolvedUrl)
    const clientID = await scdl.getClientID()
    const axiosInstance = scdl.axios

    if (info.media?.transcodings && Array.isArray(info.media.transcodings)) {
      const progressive = info.media.transcodings.find(
        (t: any) =>
          t.format?.protocol === "progressive" ||
          t.url?.includes("/progressive") ||
          t.format?.mime_type?.includes("mp3")
      )

      if (progressive) {
        const mediaResponse = await axiosInstance.get(progressive.url, {
          params: { client_id: clientID },
        })
        const directMediaUrl = mediaResponse.data?.url

        if (directMediaUrl) {
          return NextResponse.json({
            success: true,
            directUrl: directMediaUrl,
            info: {
              title: info.title,
              duration: info.duration,
              id: info.id,
            },
          })
        }
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Could not resolve a direct download URL for this track.",
      },
      { status: 422 }
    )
  } catch (error) {
    console.error("Download error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to download audio"

    // Check error type and provide user-friendly English error messages
    let userFriendlyError = errorMessage
    let statusCode = 500

    // Check for private/restricted track errors
    if (
      errorMessage.includes("private") ||
      errorMessage.includes("not accessible") ||
      errorMessage.includes("not available for streaming") ||
      errorMessage.includes("restricted")
    ) {
      userFriendlyError =
        "This track is private or not accessible. Please ensure the track URL is public and accessible. Private tracks cannot be downloaded."
      statusCode = 403
    }
    // Check for 404/Not Found errors
    else if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
      userFriendlyError =
        "Track not found. The track may have been deleted, made private, or the URL is incorrect. Please verify the track URL is public and accessible."
      statusCode = 404
    }
    // Check for 403/Forbidden errors
    else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
      userFriendlyError =
        "Access forbidden. This track may be private or restricted. Please check if the track URL is public and try again."
      statusCode = 403
    }
    // Check for 401/Unauthorized errors
    else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      userFriendlyError =
        "Unauthorized access. The track may be private or require authentication. Please ensure the track URL is public."
      statusCode = 401
    }
    // Check for 405/Method Not Allowed errors
    else if (errorMessage.includes("405") || errorMessage.includes("Method Not Allowed")) {
      userFriendlyError =
        "Method not allowed. The track may be private or restricted. Please verify the track URL is public and accessible."
      statusCode = 405
    }
    // Check for stream URL expiration
    else if (
      errorMessage.includes("expired") ||
      errorMessage.includes("no longer available") ||
      errorMessage.includes("stream URL")
    ) {
      userFriendlyError =
        "The audio stream URL has expired or is no longer available. Please try fetching the track info again and download immediately."
      statusCode = 410
    }
    // Generic error - remind user to check if track is public
    else {
      userFriendlyError = `Failed to download audio. ${errorMessage}. Please verify the track URL is public and accessible. Private tracks cannot be downloaded.`
    }

    return NextResponse.json(
      {
        error: userFriendlyError,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: statusCode }
    )
  }
}
