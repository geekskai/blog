import { NextRequest, NextResponse } from "next/server"
import scdl from "soundcloud-downloader"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    console.log("Get info request received for URL:", url)

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const info = await scdl.getInfo(url)

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
