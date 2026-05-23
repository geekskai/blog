import { NextResponse } from "next/server"
import { z } from "zod"
import { fetchYouTubeMetadata, YouTubeMetadataError } from "@/app/lib/youtube/metadata"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const schema = z.object({
  videoId: z.string().trim().regex(/^[\w-]{11}$/),
})

function statusFromCode(code: "invalid_url" | "video_unavailable" | "upstream"): number {
  switch (code) {
    case "invalid_url":
      return 400
    case "video_unavailable":
      return 404
    default:
      return 502
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { videoId } = schema.parse({ videoId: searchParams.get("videoId") ?? "" })
    const data = await fetchYouTubeMetadata(videoId)
    return NextResponse.json({ data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "invalid_url" }, { status: 400 })
    }

    if (error instanceof YouTubeMetadataError) {
      return NextResponse.json({ error: error.code, message: error.message }, {
        status: statusFromCode(error.code),
      })
    }

    const message = error instanceof Error ? error.message : "unknown"
    return NextResponse.json({ error: "upstream", message }, { status: 502 })
  }
}
