import scdl from "soundcloud-downloader"

import { NextRequest, NextResponse } from "next/server"
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getSetInfo, getInfoBase } = require("soundcloud-downloader/dist/info")

export async function POST(request: NextRequest) {
  try {
    const { playlistUrl } = await request.json()

    if (!playlistUrl) {
      return NextResponse.json({ error: "playlistUrl is required" }, { status: 400 })
    }

    // 验证 URL 格式
    try {
      new URL(playlistUrl)
    } catch {
      return NextResponse.json({ error: "Invalid playlist URL format" }, { status: 400 })
    }

    // 验证是否为 SoundCloud 播放列表 URL
    if (!playlistUrl.includes("soundcloud.com") || !playlistUrl.includes("/sets/")) {
      return NextResponse.json(
        { error: "URL must be a SoundCloud playlist (sets) URL" },
        { status: 400 }
      )
    }

    console.log(`🚀 ~ playlistUrl==>`, playlistUrl)

    const clientId = (await scdl.getClientID()) || `dH1Xed1fpITYonugor6sw39jvdq58M3h`

    let info
    try {
      // 首先尝试使用 getSetInfo（标准方法）
      info = await getSetInfo(playlistUrl, clientId, scdl.axios)
    } catch (error) {
      console.error(`🚀 getSetInfo error==>`, error)

      // 检查是否是空 IDs 导致的错误（400 Bad Request with empty ids parameter）
      const errorStr = error instanceof Error ? error.message : String(error)
      const isAxiosError = (error as { isAxiosError?: boolean; response?: { status?: number } })
        ?.isAxiosError
      const statusCode = (error as { response?: { status?: number } })?.response?.status

      // 如果是 400 错误且可能是空 IDs 问题，尝试使用 getInfoBase 作为备选方案
      if (
        (statusCode === 400 || errorStr.includes("400")) &&
        (errorStr.includes("Bad Request") ||
          errorStr.includes("ids=") ||
          (isAxiosError && statusCode === 400))
      ) {
        console.log("⚠️ Detected empty IDs error, trying fallback method with getInfoBase...")
        try {
          // 备选方案：直接使用 getInfoBase 获取播放列表信息
          // 这样可以避免库在处理空 IDs 时的 bug
          const baseInfo = await getInfoBase(playlistUrl, clientId, scdl.axios)
          console.log(`🚀 ~ baseInfo:`, baseInfo)

          // 验证返回的是播放列表（set）
          if (!baseInfo.tracks || !Array.isArray(baseInfo.tracks)) {
            return NextResponse.json(
              {
                error:
                  "Failed to fetch playlist tracks. The playlist may be empty or inaccessible.",
                details: "Some tracks in the playlist may not have valid IDs.",
              },
              { status: 400 }
            )
          }

          // 使用基础信息（可能某些音轨信息不完整，但至少可以返回可用的音轨）
          info = baseInfo
          console.log(
            `⚠️ Using fallback method, found ${info.tracks.length} tracks (some may be incomplete)`
          )
        } catch (fallbackError) {
          console.error(`🚀 Fallback method also failed==>`, fallbackError)
          return NextResponse.json(
            {
              error: "Failed to fetch playlist tracks. The playlist may be empty or inaccessible.",
              details: "Some tracks in the playlist may not have valid IDs.",
            },
            { status: 400 }
          )
        }
      } else {
        // 其他类型的错误，直接抛出
        throw error
      }
    }

    // 验证返回的数据结构
    if (!info || !info.tracks || !Array.isArray(info.tracks)) {
      return NextResponse.json(
        { error: "Invalid playlist data received from SoundCloud" },
        { status: 500 }
      )
    }

    const totalTracks = info.tracks.length
    console.log(`🚀 ~ Total tracks in playlist: ${totalTracks}`)

    // 分类音轨：完整信息 vs 只有基本信息
    const completeTracks = info.tracks.filter(
      (track: { permalink_url?: string; title?: string }) => track.permalink_url && track.title
    )

    const incompleteTracks = info.tracks.filter(
      (track: { permalink_url?: string; title?: string; id?: number }) =>
        !track.permalink_url && track.id
    )

    console.log(
      `🚀 ~ Track breakdown: ${completeTracks.length} complete, ${incompleteTracks.length} incomplete (private tracks)`
    )

    // 如果所有音轨都是非公开的，直接返回错误
    if (completeTracks.length === 0 && incompleteTracks.length > 0) {
      return NextResponse.json(
        {
          error: "All tracks in this playlist are private",
          details: `This playlist contains ${totalTracks} tracks, but all of them are private and cannot be accessed. Private tracks are not available for download.`,
          totalTracks,
          accessibleTracks: 0,
          restrictedTracks: totalTracks,
        },
        { status: 403 }
      )
    }

    // 如果有不完整的音轨（非公开音轨），记录警告但不尝试获取（因为它们是非公开的）
    if (incompleteTracks.length > 0) {
      console.warn(`⚠️ Found ${incompleteTracks.length} private tracks that cannot be accessed`)
    }

    // 合并所有有效的音轨（只包含公开的音轨）
    const allValidTracks = [...completeTracks]

    if (allValidTracks.length === 0) {
      return NextResponse.json(
        {
          error: "No accessible tracks found in this playlist",
          details: `Found ${totalTracks} tracks total, but none are accessible. All tracks appear to be private.`,
          totalTracks,
          accessibleTracks: 0,
          restrictedTracks: totalTracks,
        },
        { status: 404 }
      )
    }

    console.log(`🚀 ~ Found ${allValidTracks.length} accessible tracks out of ${totalTracks} total`)

    // 返回音轨信息，而不是流（流无法序列化为 JSON）
    const tracks = allValidTracks.map(
      (track: {
        title: string
        permalink_url: string
        id?: number
        artwork_url?: string
        user?: { username?: string }
      }) => ({
        title: track.title || "Untitled",
        url: track.permalink_url,
        id: track.id,
        artworkUrl: track.artwork_url,
        artist: track.user?.username || "Unknown",
      })
    )

    const restrictedTracks = totalTracks - tracks.length
    const hasPrivateTracks = restrictedTracks > 0

    return NextResponse.json<{
      success: boolean
      message: string
      trackCount: number
      totalTracks: number
      accessibleTracks: number
      restrictedTracks: number
      warning?: string
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
        message: hasPrivateTracks
          ? `Found ${tracks.length} accessible tracks out of ${totalTracks} total. ${restrictedTracks} tracks are private and cannot be accessed.`
          : `Found ${tracks.length} accessible tracks in playlist`,
        trackCount: tracks.length,
        totalTracks,
        accessibleTracks: tracks.length,
        restrictedTracks,
        ...(hasPrivateTracks && {
          warning: `${restrictedTracks} track${restrictedTracks > 1 ? "s are" : " is"} private and cannot be accessed. Only public tracks are available for download.`,
        }),
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
