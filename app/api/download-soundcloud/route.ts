import { NextRequest, NextResponse } from "next/server"
import scdl from "soundcloud-downloader"
import { Readable } from "stream"

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
 * 尝试下载音频流，优先使用 progressive 流
 */
async function downloadAudioStream(url: string): Promise<Readable> {
  // 先获取音频信息
  const info = await scdl.getInfo(url)

  // 策略1: 如果可下载，优先使用 download link
  if (info.downloadable) {
    try {
      console.log("Attempting download link method")
      // 使用库的内部方法，通过传递 useDownloadLink 参数
      // 注意：需要检查库是否支持此参数
      const stream = await (scdl as any).download(url, { useDownloadLink: true })
      if (stream) return stream
    } catch (error) {
      console.warn("Download link method failed:", error)
    }
  }

  // 策略2: 查找并优先使用 progressive 流
  if (info.media?.transcodings && Array.isArray(info.media.transcodings)) {
    // 找到所有 progressive 流
    const progressiveStreams = info.media.transcodings.filter(
      (t: any) =>
        t.format?.protocol === "progressive" ||
        t.url?.includes("/progressive") ||
        t.format?.mime_type?.includes("mp3")
    )

    // 找到所有 HLS 流
    const hlsStreams = info.media.transcodings.filter(
      (t: any) =>
        t.format?.protocol === "hls" ||
        t.url?.includes("/hls") ||
        t.format?.mime_type?.includes("mpegurl")
    )

    // 优先尝试 progressive 流
    for (const transcoding of progressiveStreams) {
      try {
        console.log("Attempting progressive stream:", transcoding.url)
        const stream = await (scdl as any).fromMediaObj(transcoding)
        if (stream) return stream
      } catch (error) {
        console.warn("Progressive stream failed:", error)
        continue
      }
    }

    // 如果 progressive 流都失败，尝试 HLS 流（作为后备）
    for (const transcoding of hlsStreams) {
      try {
        console.log("Attempting HLS stream:", transcoding.url)
        const stream = await (scdl as any).fromMediaObj(transcoding)
        if (stream) return stream
      } catch (error) {
        console.warn("HLS stream failed:", error)
        continue
      }
    }
  }

  // 策略3: 使用默认下载方法（库会自动选择）
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

    let nodeStream: Readable | null = null
    let lastError: Error | null = null

    // 策略1: 先获取信息，然后尝试不同的下载方法
    try {
      const info = await scdl.getInfo(url)

      // 如果可下载，优先尝试 download link
      if (info.downloadable && info.id) {
        try {
          console.log("Attempting download link for track ID:", info.id)
          // 使用库的内部方法
          const downloadLink = await (scdl as any).fromDownloadLink?.(info.id)
          if (downloadLink) {
            nodeStream = downloadLink
          }
        } catch (error) {
          console.warn("Download link failed, trying other methods:", error)
        }
      }
    } catch (error) {
      console.warn("Failed to get info, using default download:", error)
    }

    // 策略2: 使用默认下载方法（库会尝试所有可用流）
    if (!nodeStream) {
      try {
        console.log("Attempting default download method")
        nodeStream = await scdl.download(url)
      } catch (error) {
        lastError = error as Error
        console.error("Default download failed:", error)
      }
    }

    if (!nodeStream) {
      throw new Error(
        `Failed to download audio. ` +
          `The track may not be downloadable or stream URLs may have expired. ` +
          `Please try fetching the track info again and download immediately. ` +
          `Error: ${lastError?.message || "Unknown error"}`
      )
    }

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
