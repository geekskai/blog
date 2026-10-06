import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { serviceRequest } from "./service"
import { signJobToken, verifyJobToken } from "./job-token"
beforeEach(() => {
  vi.stubEnv("SOUNDCLOUD_SERVICE_KEY", "test-service-secret")
  vi.stubEnv("SOUNDCLOUD_SERVICE_URL", "https://soundcloud.geekskai.com")
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})
describe("hosted SoundCloud boundary", () => {
  it("sends server-only credentials, disables redirects and validates unknown responses", async () => {
    const upstream = vi.fn().mockResolvedValue(new Response('{"id":42}'))
    vi.stubGlobal("fetch", upstream)
    expect(
      await serviceRequest({
        path: "/v1/soundcloud/info",
        body: { url: "track" },
        schema: z.object({ id: z.number() }),
      })
    ).toEqual({ id: 42 })
    expect(upstream.mock.calls[0][1]).toMatchObject({
      redirect: "error",
      cache: "no-store",
      headers: { Authorization: "Bearer test-service-secret" },
    })
  })
  it("maps service credential rejection to 502 without exposing upstream details", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response('{"code":"unauthorized","error":"secret details"}', { status: 401 })
        )
    )
    await expect(
      serviceRequest({ path: "/v1/downloads", schema: z.unknown() })
    ).rejects.toMatchObject({ status: 502, code: "unauthorized" })
  })
  it("rejects malformed upstream success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"id":"42"}')))
    await expect(
      serviceRequest({ path: "/v1/soundcloud/info", schema: z.object({ id: z.number() }) })
    ).rejects.toMatchObject({ code: "invalid_service_response" })
  })
  it("binds job capabilities to owners and rejects tampering and expiry", () => {
    const token = signJobToken({
      id: "d2aa1ead-21d6-4eb6-b6ad-5af1b15a8fb4",
      owner: "user:a",
      tool: "soundcloud-track",
    })
    expect(verifyJobToken(token, "user:a").id).toBe("d2aa1ead-21d6-4eb6-b6ad-5af1b15a8fb4")
    expect(() => verifyJobToken(token, "user:b")).toThrow()
    expect(() => verifyJobToken(token + "x", "user:a")).toThrow()
    const now = Date.now()
    const clock = vi.spyOn(Date, "now").mockReturnValue(now + 15 * 60_000)
    expect(() => verifyJobToken(token, "user:a")).toThrow()
    clock.mockRestore()
  })
})

it.each([
  [429, "service_rate_limited", "120", 120],
  [503, "upstream_rate_limited", "invalid", 60],
  [503, "upstream_rate_limited", "Tue, 06 Oct 2026 00:02:00 GMT", 120],
])(
  "preserves rate-limit status %s and normalized Retry-After",
  async (status, code, header, seconds) => {
    const { serviceErrorResponse } = await import("./service")
    const clock = vi.spyOn(Date, "now").mockReturnValue(Date.parse("2026-10-06T00:00:00Z"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ code, error: "private details" }), {
          status: Number(status),
          headers: { "Retry-After": String(header) },
        })
      )
    )
    try {
      await serviceRequest({ path: "/v1/downloads", schema: z.unknown() })
      expect.fail("Expected a rate-limit failure")
    } catch (error: unknown) {
      const response = serviceErrorResponse(error)
      expect(response.status).toBe(status)
      expect(response.headers.get("Retry-After")).toBe(String(seconds))
      expect(await response.json()).toMatchObject({ code })
    } finally {
      clock.mockRestore()
    }
  }
)
