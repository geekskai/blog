import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
const mocks = vi.hoisted(() => ({ auth: vi.fn(), claim: vi.fn(), get: vi.fn(), release: vi.fn() }))
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }))
vi.mock("@/lib/download-quota/repository", () => ({
  claimRegisteredDownloadOperation: mocks.claim,
  claimVisitorDownloadOperation: mocks.claim,
  getRegisteredDownloadOperation: mocks.get,
  getVisitorDownloadOperation: mocks.get,
  releaseRegisteredDownload: mocks.release,
  releaseVisitorDownload: mocks.release,
}))
import { POST } from "@/app/api/download-soundcloud/route"
import { updateDownloadJob } from "./jobs"
import { signJobToken } from "./job-token"
const id = "d2aa1ead-21d6-4eb6-b6ad-5af1b15a8fb4"
const operationId = "019fd1e2-9b00-79f1-8b03-f09507529a0b"
function request(body: unknown, cookie?: string) {
  return new NextRequest("https://geekskai.com/api/download-soundcloud", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-download-operation-id": operationId,
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  })
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("SOUNDCLOUD_SERVICE_KEY", "test-key")
  vi.stubEnv("DOWNLOAD_QUOTA_SERVER_ENABLED", "true")
  vi.stubEnv("DOWNLOAD_QUOTA_SCHEMA_READY", "true")
  vi.stubEnv("DOWNLOAD_QUOTA_ENABLED_TOOLS", "soundcloud-track")
  mocks.auth.mockResolvedValue({ userId: "a" })
  const operation = {
    status: "processing",
    toolId: "soundcloud-track",
    expiresAt: new Date(Date.now() + 60000),
  }
  mocks.claim.mockResolvedValue(operation)
  mocks.get.mockResolvedValue(operation)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})
describe("SoundCloud task ownership and quotas", () => {
  it("releases a claimed reservation if the service cannot create a job", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network secret")))
    const response = await POST(request({ url: "https://soundcloud.com/a/b", format: "wav" }))
    expect(response.status).toBe(503)
    expect(mocks.release).toHaveBeenCalledWith("a", operationId)
    expect(await response.text()).not.toContain("network secret")
  })
  it("returns a bound capability, never the service key, and rejects another user", async () => {
    const upstream = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ id, status: "queued" })))
    vi.stubGlobal("fetch", upstream)
    const response = await POST(request({ url: "https://soundcloud.com/a/b", format: "mp3" }))
    const payload = await response.json()
    expect(response.status).toBe(202)
    expect(JSON.stringify(payload)).not.toContain("test-key")
    mocks.auth.mockResolvedValue({ userId: "b" })
    const denied = await updateDownloadJob(request({ token: payload.token, action: "status" }))
    expect(denied.status).toBe(403)
    expect(upstream).toHaveBeenCalledOnce()
  })
  it("releases the reservation on terminal upstream failure", async () => {
    const token = signJobToken({ id, owner: "user:a", tool: "soundcloud-track", operationId })
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id,
            status: "failed",
            error: { code: "upstream_error", message: "Unavailable" },
          })
        )
      )
    )
    const response = await updateDownloadJob(request({ token, action: "status" }))
    expect(response.status).toBe(200)
    expect(mocks.release).toHaveBeenCalledWith("a", operationId)
  })
  it("blocks ticket issuance after a reservation has been released", async () => {
    const token = signJobToken({ id, owner: "user:a", tool: "soundcloud-track", operationId })
    mocks.get.mockResolvedValue({
      status: "released",
      toolId: "soundcloud-track",
      expiresAt: new Date(Date.now() + 60000),
    })
    const upstream = vi.fn()
    vi.stubGlobal("fetch", upstream)
    const response = await updateDownloadJob(request({ token, action: "ticket" }))
    expect(response.status).toBe(409)
    expect(upstream).not.toHaveBeenCalled()
  })
  it("rejects a malicious file redirect returned by the service", async () => {
    const token = signJobToken({ id, owner: "user:a", tool: "soundcloud-track", operationId })
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            path: "//evil.example/file",
            expiresAt: Date.now() + 60000,
            file: { fileName: "a.mp3", format: "mp3", contentType: "audio/mpeg", size: 12 },
          })
        )
      )
    )
    const response = await updateDownloadJob(request({ token, action: "ticket" }))
    expect(response.status).toBe(502)
  })
})

it("binds anonymous jobs to an HttpOnly session even when server quotas are off", async () => {
  vi.stubEnv("DOWNLOAD_QUOTA_SERVER_ENABLED", "false")
  mocks.auth.mockResolvedValue({ userId: null })
  const upstream = vi
    .fn()
    .mockImplementation(async () => new Response(JSON.stringify({ id, status: "queued" })))
  vi.stubGlobal("fetch", upstream)
  const response = await POST(request({ url: "https://soundcloud.com/a/b", format: "mp3" }))
  const payload = await response.json()
  const cookie = response.headers.get("set-cookie")!
  expect(cookie).toContain("HttpOnly")
  const denied = await updateDownloadJob(request({ token: payload.token, action: "status" }))
  expect(denied.status).toBe(403)
  const allowed = await updateDownloadJob(
    request({ token: payload.token, action: "status" }, cookie.split(";")[0])
  )
  expect(allowed.status).toBe(200)
})

it.each([
  [429, "service_rate_limited", true],
  [503, "upstream_rate_limited", true],
  [429, "service_rate_limited", false],
  [503, "upstream_rate_limited", false],
])(
  "releases quota and preserves cooldown on status %s (registered=%s)",
  async (status, code, isRegistered) => {
    const { VISITOR_QUOTA_COOKIE } = await import("@/lib/download-quota/config")
    const visitorId = "84aa5ee4-12a4-48ad-b547-bffb32fe0123"
    mocks.auth.mockResolvedValue({ userId: isRegistered ? "a" : null })
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ code, error: "Rate limit" }), {
          status: Number(status),
          headers: { "Retry-After": "90" },
        })
      )
    )
    const response = await POST(
      request(
        { url: "https://soundcloud.com/a/b", format: "mp3" },
        `${VISITOR_QUOTA_COOKIE}=${visitorId}`
      )
    )
    expect(response.status).toBe(status)
    expect(response.headers.get("Retry-After")).toBe("90")
    expect(mocks.release).toHaveBeenCalledExactlyOnceWith(
      isRegistered ? "a" : visitorId,
      operationId
    )
  }
)
