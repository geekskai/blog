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

async function tryGetDirectUrl(
  transcodings: any[],
  clientID: string,
  trackAuth: string,
  axiosInstance: any
) {
  // 优先级：非legacy progressive > 非legacy hls(明文) > legacy progressive > legacy hls(明文)
  // 完全跳过 encrypted-hls，因为无法在这套架构下解密播放
  const candidates = transcodings
    .filter((t: any) => t.format?.protocol === "progressive" || t.format?.protocol === "hls")
    .sort((a: any, b: any) => {
      // 非 legacy 优先（更可能是真正可用的新端点）
      if (a.is_legacy_transcoding === b.is_legacy_transcoding) return 0
      return a.is_legacy_transcoding ? 1 : -1
    })

  for (const candidate of candidates) {
    try {
      const mediaResponse = await axiosInstance.get(candidate.url, {
        params: { client_id: clientID, track_authorization: trackAuth },
      })
      const directMediaUrl = mediaResponse.data?.url
      if (directMediaUrl) {
        return { directUrl: directMediaUrl, protocol: candidate.format.protocol }
      }
    } catch {
      continue // 这条失效，试下一条
    }
  }

  return null // 全部失败，说明该曲目只剩加密流，确实不可下载
}

export async function POST(request: NextRequest) {
  const { url } = await request.json()
  try {
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
    const clientID = await scdl.getClientID()
    const axiosInstance = scdl.axios

    console.log(resolvedUrl, "resolvedUrl info===> ", JSON.stringify(info, null, 2))

    const result = await tryGetDirectUrl(
      info.media.transcodings,
      clientID,
      info.track_authorization,
      axiosInstance
    )

    if (result) {
      return NextResponse.json({
        success: true,
        directUrl: result.directUrl,
        info: {
          title: info.title,
          duration: info.duration,
          id: info.id,
        },
      })
    }

    // if (info.media?.transcodings && Array.isArray(info.media.transcodings)) {
    //   const progressive = info.media.transcodings.find(
    //     (t: any) =>
    //       t.format?.protocol === "progressive" ||
    //       t.url?.includes("/progressive") ||
    //       t.format?.mime_type?.includes("mp3")
    //   )

    //   if (progressive) {
    //     const mediaResponse = await axiosInstance.get(progressive.url, {
    //       params: { client_id: clientID, track_authorization: info.track_authorization },
    //     })
    //     const directMediaUrl = mediaResponse.data?.url

    //     if (directMediaUrl) {
    //       return NextResponse.json({
    //         success: true,
    //         directUrl: directMediaUrl,
    //         info: {
    //           title: info.title,
    //           duration: info.duration,
    //           id: info.id,
    //         },
    //       })
    //     }
    //   }
    // }

    return NextResponse.json(
      {
        success: false,
        error:
          "This track is subject to SoundCloud's copyright protection mechanism, and a download link is not available at this time.",
      },
      { status: 422 }
    )
  } catch (error) {
    console.error(`original url: ${url} error==> ${error}`)
    const errorMessage = error instanceof Error ? error.message : "Failed to download audio"

    let userFriendlyError = errorMessage
    let statusCode = 500

    if (
      errorMessage.includes("private") ||
      errorMessage.includes("not accessible") ||
      errorMessage.includes("not available for streaming") ||
      errorMessage.includes("restricted")
    ) {
      userFriendlyError =
        "This track is private or not accessible. Please ensure the track URL is public and accessible. Private tracks cannot be downloaded."
      statusCode = 403
    } else if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
      userFriendlyError =
        "The download link could not be generated. This track may have download restrictions enabled by the artist, or requires premium access."
      statusCode = 404
    } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
      userFriendlyError =
        "Access forbidden. This track may be private or restricted. Please check if the track URL is public and try again."
      statusCode = 403
    } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      userFriendlyError =
        "Unauthorized access. The track may be private or require authentication. Please ensure the track URL is public."
      statusCode = 401
    } else if (errorMessage.includes("405") || errorMessage.includes("Method Not Allowed")) {
      userFriendlyError =
        "Method not allowed. The track may be private or restricted. Please verify the track URL is public and accessible."
      statusCode = 405
    } else if (
      errorMessage.includes("expired") ||
      errorMessage.includes("no longer available") ||
      errorMessage.includes("stream URL")
    ) {
      userFriendlyError =
        "The audio stream URL has expired or is no longer available. Please try fetching the track info again and download immediately."
      statusCode = 410
    } else {
      userFriendlyError = `Failed to download audio. ${errorMessage}. Please verify the track URL is public and accessible. Private tracks cannot be downloaded.`
    }

    return NextResponse.json(
      {
        success: false,
        error: userFriendlyError,
      },
      { status: statusCode }
    )
  }
}
