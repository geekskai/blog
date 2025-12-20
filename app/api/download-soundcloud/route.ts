import { NextRequest, NextResponse } from "next/server"
import scdl from "soundcloud-downloader"
import { Readable } from "stream"

export const runtime = "nodejs"

// 配置常量
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB 最大文件大小限制
const DOWNLOAD_TIMEOUT = 300000 // 5分钟超时（300秒）

/**
 * 将 Node.js Readable Stream 转换为 Web ReadableStream
 *
 * 内存优化策略：
 * - 使用流式传输，数据不全部加载到内存
 * - 每个 chunk 立即传递给客户端，内存占用最小
 * - 支持大文件下载，不受内存限制
 * - 自动清理资源，防止内存泄漏
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

        // 检查文件大小限制
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

    // 下载音频流
    const nodeStream = await scdl.download(url)

    // 将 Node.js 流转换为 Web Stream（流式传输，不占用大量内存）
    // 优势：
    // 1. 内存占用最小：数据流式传输，不全部加载到内存
    // 2. 支持并发：多个请求可以同时处理，每个请求内存占用约几KB
    // 3. 快速响应：客户端可以立即开始接收数据，无需等待完整下载
    const webStream = nodeStreamToWebStream(nodeStream)

    // 返回流式响应
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Transfer-Encoding": "chunked", // 流式传输
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Accel-Buffering": "no", // 禁用 Nginx 缓冲（如果使用）
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to download audio"
    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    )
  }
}
