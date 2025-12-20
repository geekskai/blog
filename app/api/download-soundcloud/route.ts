import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import scdl from "soundcloud-downloader"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    console.log("Download request received for URL:", url)

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // const info = await scdl.getInfo(url);

    // 生成文件名
    const fileName = `audio-${Date.now()}.mp3`
    const filePath = path.join(process.cwd(), fileName)

    // 下载音频
    const stream = await scdl.download(url)

    const writeStream = fs.createWriteStream(filePath)

    // 等待流完成
    await new Promise<void>((resolve, reject) => {
      stream.pipe(writeStream)
      writeStream.on("finish", () => {
        writeStream.close()
        resolve()
      })
      stream.on("error", (error: Error) => {
        writeStream.destroy()
        reject(error)
      })
      writeStream.on("error", (error: Error) => {
        stream.destroy()
        reject(error)
      })
    })

    // 读取文件并返回
    const fileBuffer = fs.readFileSync(filePath)

    // 清理临时文件
    fs.unlinkSync(filePath)

    console.log(`Download completed. File size: ${fileBuffer.length} bytes`)

    // 将 Buffer 转换为 Uint8Array，NextResponse 可以接受
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": fileBuffer.length.toString(),
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
