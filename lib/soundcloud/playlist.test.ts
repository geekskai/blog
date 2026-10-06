import { afterEach, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/soundcloud-playlist-downloader/route"
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})
it("preserves accessible playlist order and unavailable counts in Geekskai's response", async () => {
  vi.stubEnv("SOUNDCLOUD_SERVICE_KEY", "test-key")
  const track = {
    id: 1,
    title: "Track",
    duration: 2000,
    permalink_url: "https://soundcloud.com/a/b",
  }
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          totalTracks: 3,
          entries: [
            { status: "available", track },
            { status: "unavailable" },
            { status: "available", track },
          ],
        })
      )
    )
  )
  const request = new NextRequest("https://geekskai.com/api/soundcloud-playlist-downloader", {
    method: "POST",
    body: JSON.stringify({ playlistUrl: "https://soundcloud.com/a/sets/b" }),
  })
  const response = await POST(request)
  expect(response.status).toBe(200)
  const playlist = await response.json()
  expect(playlist).toMatchObject({
    success: true,
    totalTracks: 3,
    trackCount: 2,
    restrictedTracks: 1,
  })
  expect(playlist.tracks.map((track: { id: number }) => track.id)).toEqual([1, 1])
})
