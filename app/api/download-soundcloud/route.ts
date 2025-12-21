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
  const info = await scdl.getInfo(url)
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

    // 生成文件名
    const fileName = `audio-${Date.now()}.mp3`

    // 使用统一的下载函数，优先使用 progressive 流以避免 HLS 流 URL 过期问题
    const nodeStream = await downloadAudioStream(url)

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

    // 提供更友好的错误信息
    let userFriendlyError = errorMessage
    if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
      userFriendlyError =
        "The audio stream URL has expired or is no longer available. Please try fetching the track info again and download immediately."
    }

    return NextResponse.json(
      {
        error: userFriendlyError,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    )
  }
}
