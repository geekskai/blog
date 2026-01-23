import { NextRequest, NextResponse } from "next/server"
import scdl from "soundcloud-downloader"
import { Readable } from "stream"
// Import internal functions from the library
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromMediaObj, fromDownloadLink } = require("soundcloud-downloader/dist/download")

export const runtime = "nodejs"

// 配置常量
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB 最大文件大小限制
const DOWNLOAD_TIMEOUT = 300000 // 5分钟超时（300秒）

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

/**
 * 将 Node.js Readable Stream 转换为 Web ReadableStream
 */
function nodeStreamToWebStream(nodeStream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      let totalSize = 0
      const timeoutId = setTimeout(() => {
        nodeStream.destroy()
        controller.error(new Error("Download timeout"))
      }, DOWNLOAD_TIMEOUT)

      nodeStream.on("data", (chunk: Buffer) => {
        totalSize += chunk.length

        if (totalSize > MAX_FILE_SIZE) {
          nodeStream.destroy()
          clearTimeout(timeoutId)
          controller.error(new Error(`File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`))
          return
        }

        try {
          controller.enqueue(new Uint8Array(chunk))
        } catch (error) {
          nodeStream.destroy()
          clearTimeout(timeoutId)
          controller.error(error)
        }
      })

      nodeStream.on("end", () => {
        clearTimeout(timeoutId)
        controller.close()
      })

      nodeStream.on("error", (error: Error) => {
        clearTimeout(timeoutId)
        controller.error(error)
      })
    },

    cancel() {
      nodeStream.destroy()
    },
  })
}

/**
 * Attempts to download audio stream, prioritizing progressive streams to avoid HLS stream expiration issues
 *
 * Download strategy (by priority):
 * 1. If downloadable, prioritize download link (most reliable)
 * 2. Prioritize progressive streams (avoid HLS stream URL expiration issues)
 * 3. If progressive streams fail, try HLS streams (as fallback)
 * 4. Finally use default download method (library will auto-select)
 */
async function downloadAudioStream(url: string): Promise<Readable> {
  // Get audio info first
  let info
  try {
    info = await scdl.getInfo(url)
  } catch (error) {
    const errorStr = error instanceof Error ? error.message : String(error)
    // Check if track is private or inaccessible
    if (
      errorStr.includes("404") ||
      errorStr.includes("Not Found") ||
      errorStr.includes("403") ||
      errorStr.includes("Forbidden") ||
      errorStr.includes("401") ||
      errorStr.includes("Unauthorized") ||
      errorStr.includes("405") ||
      errorStr.includes("Method Not Allowed")
    ) {
      throw new Error(
        "This track is private or not accessible. Please ensure the track URL is public and accessible. Private tracks cannot be downloaded."
      )
    }
    throw error
  }

  // Check if track is public
  if (!info.public && info.sharing !== "public") {
    throw new Error(
      "This track is private. Only public tracks can be downloaded. Please check if the track URL is public."
    )
  }

  // Check if track has media/streamable content
  if (!info.streamable && !info.downloadable) {
    throw new Error(
      "This track is not available for streaming or download. The track may be private or restricted. Please verify the track URL is public."
    )
  }

  const clientID = await scdl.getClientID()
  const axiosInstance = scdl.axios

  // Strategy 1: If downloadable, prioritize download link (most reliable method)
  if (info.downloadable && info.id) {
    try {
      console.log("Attempting download link method for track ID:", info.id)
      const stream = await fromDownloadLink(info.id, clientID, axiosInstance)
      if (stream) {
        console.log("Successfully obtained stream from download link")
        return stream
      }
    } catch (error) {
      console.warn("Download link method failed, trying other methods:", error)
    }
  }

  // Strategy 2: Find and prioritize progressive streams (avoid HLS stream URL expiration issues)
  if (info.media?.transcodings && Array.isArray(info.media.transcodings)) {
    // Find all progressive streams
    const progressiveStreams = info.media.transcodings.filter(
      (t: any) =>
        t.format?.protocol === "progressive" ||
        t.url?.includes("/progressive") ||
        t.format?.mime_type?.includes("mp3")
    )

    // Find all HLS streams
    const hlsStreams = info.media.transcodings.filter(
      (t: any) =>
        t.format?.protocol === "hls" ||
        t.url?.includes("/hls") ||
        t.format?.mime_type?.includes("mpegurl")
    )

    // Try progressive streams first
    for (const transcoding of progressiveStreams) {
      try {
        console.log("Attempting progressive stream:", transcoding.url)
        const stream = await fromMediaObj(transcoding, clientID, axiosInstance)
        if (stream) {
          console.log("Successfully obtained progressive stream")
          return stream
        }
      } catch (error) {
        console.warn("Progressive stream failed:", error)
        continue
      }
    }

    // If all progressive streams fail, try HLS streams (as fallback)
    for (const transcoding of hlsStreams) {
      try {
        console.log("Attempting HLS stream:", transcoding.url)
        const stream = await fromMediaObj(transcoding, clientID, axiosInstance)
        if (stream) {
          console.log("Successfully obtained HLS stream")
          return stream
        }
      } catch (error) {
        console.warn("HLS stream failed:", error)
        continue
      }
    }
  }

  // Strategy 3: Use default download method (library will auto-select best stream)
  try {
    console.log("Attempting default download method")
    return await scdl.download(url)
  } catch (error) {
    throw new Error(
      `Failed to download audio. All download methods failed. ` +
        `The track may not be downloadable, or stream URLs may have expired. ` +
        `Original error: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    console.log("Download request received for URL:", url)

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // 验证 URL 格式
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    const resolvedUrl = await resolveSoundCloudUrl(url)
    console.log("Resolved SoundCloud URL:", resolvedUrl)

    // 生成文件名
    const fileName = `audio-${Date.now()}.mp3`

    // 使用统一的下载函数，优先使用 progressive 流以避免 HLS 流 URL 过期问题
    const nodeStream = await downloadAudioStream(resolvedUrl)

    // 将 Node.js 流转换为 Web Stream
    const webStream = nodeStreamToWebStream(nodeStream)

    // 返回流式响应
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Accel-Buffering": "no",
      },
    })
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
