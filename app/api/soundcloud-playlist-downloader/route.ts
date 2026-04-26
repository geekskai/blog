import scdl from "soundcloud-downloader"

import { NextRequest, NextResponse } from "next/server"

const { getSetInfo, getInfoBase } = require("soundcloud-downloader/dist/info")

export async function POST(request: NextRequest) {
  try {
    const { playlistUrl } = await request.json()

    if (!playlistUrl) {
      return NextResponse.json({ error: "playlistUrl is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(playlistUrl)
    } catch {
      return NextResponse.json({ error: "Invalid playlist URL format" }, { status: 400 })
    }

    // Validate whether it is a SoundCloud playlist URL
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
      // First try using getSetInfo (standard method)
      info = await getSetInfo(playlistUrl, clientId, scdl.axios)
    } catch (error) {
      console.error(`🚀 getSetInfo error==>`, error.message)

      // Check if it is an error caused by empty IDs (400 Bad Request with empty ids parameter)
      const errorStr = error instanceof Error ? error.message : String(error)
      const isAxiosError = (error as { isAxiosError?: boolean; response?: { status?: number } })
        ?.isAxiosError
      const statusCode = (error as { response?: { status?: number } })?.response?.status

      // If it is a 400 error and may be an empty IDs issue, try using getInfoBase as a fallback method
      if (
        (statusCode === 400 || errorStr.includes("400")) &&
        (errorStr.includes("Bad Request") ||
          errorStr.includes("ids=") ||
          (isAxiosError && statusCode === 400))
      ) {
        console.log("⚠️ Detected empty IDs error, trying fallback method with getInfoBase...")
        try {
          // Fallback method: directly use getInfoBase to get playlist information
          // This can avoid the bug when the library handles empty IDs
          const baseInfo = await getInfoBase(playlistUrl, clientId, scdl.axios)
          console.log(`🚀 ~ baseInfo:`, baseInfo)

          // Verify that it is a playlist (set)
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

          // Use base information (some track information may be incomplete, but at least some tracks are available)
          info = baseInfo
          console.log(
            `⚠️ Using fallback method, found ${info.tracks.length} tracks (some may be incomplete)`
          )
        } catch (fallbackError) {
          console.error(`🚀 Fallback method also failed==>`, fallbackError.message)
          return NextResponse.json(
            {
              error: "Failed to fetch playlist tracks. The playlist may be empty or inaccessible.",
              details: "Some tracks in the playlist may not have valid IDs.",
            },
            { status: 400 }
          )
        }
      } else {
        // Other types of errors, throw directly
        throw error
      }
    }

    // Verify the returned data structure
    if (!info || !info.tracks || !Array.isArray(info.tracks)) {
      return NextResponse.json(
        { error: "Invalid playlist data received from SoundCloud" },
        { status: 500 }
      )
    }

    const totalTracks = info.tracks.length
    console.log(`🚀 ~ Total tracks in playlist: ${totalTracks}`)

    // Classify tracks: complete information vs only basic information
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

    // If all tracks are private, return error directly
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

    // If there are incomplete tracks (private tracks), log a warning but do not attempt to retrieve them (since they are private)
    if (incompleteTracks.length > 0) {
      console.warn(`⚠️ Found ${incompleteTracks.length} private tracks that cannot be accessed`)
    }

    // Merge all valid tracks (only containing public tracks)
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

    // Return track information, not stream (stream cannot be serialized to JSON)
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
      {
        status: 200,
        headers: {
          // Cache playlist information to reduce repeated requests
          // Playlist information is relatively stable, can be cached for 1 hour
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      }
    )
  } catch (error) {
    console.error(`🚀 route.ts ~ error==>`, error.message)

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Download failed"

    // Check if it is a 404 error
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
