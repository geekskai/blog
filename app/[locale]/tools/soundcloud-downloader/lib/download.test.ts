import { afterEach, describe, expect, it, vi } from "vitest"
import { downloadSoundCloudTrack } from "./download"

const file = { fileName: "song.wav", contentType: "audio/wav", format: "wav", size: 1234 }
const response = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), { status })
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
describe("SoundCloud hosted file delivery", () => {
  it("polls JSON, forwards quota reservation, and launches a direct native WAV download", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response({ token: "signed" }))
      .mockResolvedValueOnce(
        response({ status: "ready", progress: { phase: "ready", percent: 100 } })
      )
      .mockResolvedValueOnce(
        response({ url: "https://soundcloud.geekskai.com/downloads/ticket", file })
      )
    vi.stubGlobal("fetch", fetchMock)
    const link = { href: "", rel: "", click: vi.fn(), remove: vi.fn() }
    vi.stubGlobal("document", { createElement: () => link, body: { appendChild: vi.fn() } })
    const onProgress = vi.fn()
    const result = await downloadSoundCloudTrack("https://soundcloud.com/a/b", "song.wav", {
      preferredFormat: "wav",
      operationId: "reservation",
      onProgress,
    })
    expect(result.selectedFormat.extension).toBe("wav")
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).format).toBe("wav")
    expect(fetchMock.mock.calls[0][1].headers["X-Download-Operation-Id"]).toBe("reservation")
    expect(link.href).toBe("https://soundcloud.geekskai.com/downloads/ticket")
    expect(link.click).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(onProgress).toHaveBeenCalledWith({ phase: "ready", percent: 100 })
  })
  it("cancels failed preparation and never launches a download", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response({ token: "signed" }))
      .mockResolvedValueOnce(
        response({ status: "failed", error: { message: "Upstream unavailable" } })
      )
      .mockResolvedValueOnce(response({ status: "cancelled" }))
    vi.stubGlobal("fetch", fetchMock)
    await expect(downloadSoundCloudTrack("https://soundcloud.com/a/b", "song.mp3")).rejects.toThrow(
      "Upstream unavailable"
    )
    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({
      token: "signed",
      action: "cancel",
    })
  })
})
