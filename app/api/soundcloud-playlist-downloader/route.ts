import scdl from "soundcloud-downloader"

import { NextRequest, NextResponse } from "next/server"
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getSetInfo } = require("soundcloud-downloader/dist/info")

export async function POST(request: NextRequest) {
  try {
    const { playlistUrl } = await request.json()

    if (!playlistUrl) {
      return NextResponse.json({ error: "playlistUrl is required" }, { status: 400 })
    }

    console.log(`🚀 ~ playlistUrl==>`, playlistUrl)

    // const clientId = `dH1Xed1fpITYonugor6sw39jvdq58M3h`

    const axios = scdl.axios

    const info = await getSetInfo(playlistUrl, "", axios)
    console.log(
      `🚀 ~ info==>`,
      info.tracks.map((track: { title: string }) => track.title)
    )

    // 返回音轨信息，而不是流（流无法序列化为 JSON）
    const tracks = info.tracks.map(
      (track: {
        title: string
        permalink_url: string
        id?: number
        artwork_url?: string
        user?: { username?: string }
      }) => ({
        title: track.title,
        url: track.permalink_url,
        id: track.id,
        artworkUrl: track.artwork_url,
        artist: track.user?.username || "Unknown",
      })
    )

    return NextResponse.json<{
      success: boolean
      message: string
      trackCount: number
      tracks: Array<{
        title: string
        url: string
        id?: number
        artworkUrl?: string
        artist: string
      }>
    }>(
      {
        success: true,
        message: `Found ${tracks.length} tracks in playlist`,
        trackCount: tracks.length,
        tracks,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(`🚀 route.ts ~ error==>`, error)

    // 提供更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : "Download failed"

    // 检查是否是 404 错误
    if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
      return NextResponse.json(
        {
          error: "Playlist not found (404). Please check the playlist URL.",
          details: errorMessage,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        error: "Download failed",
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
