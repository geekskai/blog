import { NextRequest } from "next/server"
import { z } from "zod"
import { playlistSchema } from "@/lib/soundcloud/contracts"
import { serviceRequest, serviceJson, serviceErrorResponse } from "@/lib/soundcloud/service"
export const runtime = "nodejs"
export async function POST(request: NextRequest) {
  try {
    const input = z.object({ playlistUrl: z.string().min(1) }).parse(await request.json())
    const playlist = await serviceRequest({
      path: "/v1/soundcloud/playlist",
      schema: playlistSchema,
      body: { url: input.playlistUrl },
    })
    const tracks = playlist.entries.flatMap((entry) => {
      const track = entry.track
      if (entry.status !== "available" || !track?.permalink_url) {
        return []
      }
      return [
        {
          id: track.id,
          title: track.title,
          url: track.permalink_url,
          artworkUrl: track.artwork_url,
          artist: track.user?.username || "Unknown",
        },
      ]
    })
    const restrictedTracks = playlist.totalTracks - tracks.length
    return serviceJson({
      success: true,
      tracks,
      trackCount: tracks.length,
      totalTracks: playlist.totalTracks,
      accessibleTracks: tracks.length,
      restrictedTracks,
      message: `Found ${tracks.length} accessible tracks`,
      ...(restrictedTracks ? { warning: `${restrictedTracks} tracks are unavailable.` } : {}),
    })
  } catch (error: unknown) {
    return serviceErrorResponse(error)
  }
}
