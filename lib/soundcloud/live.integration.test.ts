import { expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
// Opt-in: real hosted service, simulated Clerk identity, no production quota/database writes.
vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: "local-integration-test" }),
}))
import { POST as info } from "@/app/api/soundcloud-info/route"
import { POST as create } from "@/app/api/download-soundcloud/route"
import { updateDownloadJob } from "./jobs"
function request(body: unknown) {
  return new NextRequest("http://localhost/api/soundcloud", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}
it.skipIf(process.env.SOUNDCLOUD_LIVE_TEST !== "true")(
  "calls the real hosted service through Geekskai route handlers",
  async () => {
    vi.stubEnv("DOWNLOAD_QUOTA_SERVER_ENABLED", "false")
    const url =
      "https://soundcloud.com/user-969338664-644013176/khap-troi-sao-chang-bang-anh-yccc-ycccc"
    const details = await info(request({ url }))
    expect(details.status).toBe(200)
    expect((await details.json()).info.id).toBe(1320501391)
    const created = await create(request({ url, format: "mp3" }))
    expect(created.status).toBe(202)
    const { token } = await created.json()
    try {
      let status = "queued"
      for (let attempt = 0; attempt < 120 && status !== "ready"; attempt++) {
        const response = await updateDownloadJob(request({ token, action: "status" }))
        expect(response.status).toBe(200)
        const job = await response.json()
        status = job.status
        expect(["queued", "preparing", "ready"]).toContain(status)
        if (status !== "ready") {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
      expect(status).toBe("ready")
      const ticketResponse = await updateDownloadJob(request({ token, action: "ticket" }))
      expect(ticketResponse.status).toBe(200)
      const ticket = await ticketResponse.json()
      expect(new URL(ticket.url).origin).toBe("https://soundcloud.geekskai.com")
      const download = await fetch(ticket.url)
      expect(download.status).toBe(200)
      const bytes = await download.arrayBuffer()
      expect(bytes.byteLength).toBe(ticket.file.size)
      expect(download.headers.get("content-type")).toBe("audio/mpeg")
    } finally {
      const cancelled = await updateDownloadJob(request({ token, action: "cancel" }))
      expect(cancelled.status).toBe(200)
      vi.unstubAllEnvs()
    }
  },
  180000
)
