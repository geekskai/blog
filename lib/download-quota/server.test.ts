import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  getOperation: vi.fn(),
  claimOperation: vi.fn(),
  getVisitorOperation: vi.fn(),
  claimVisitorOperation: vi.fn(),
  complete: vi.fn(),
  release: vi.fn(),
  releaseVisitor: vi.fn(),
  recordEvent: vi.fn(),
}))

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }))
vi.mock("./repository", () => ({
  getRegisteredDownloadOperation: mocks.getOperation,
  claimRegisteredDownloadOperation: mocks.claimOperation,
  getVisitorDownloadOperation: mocks.getVisitorOperation,
  claimVisitorDownloadOperation: mocks.claimVisitorOperation,
  completeRegisteredDownload: mocks.complete,
  releaseRegisteredDownload: mocks.release,
  releaseVisitorDownload: mocks.releaseVisitor,
}))
vi.mock("@/lib/growth/events", () => ({ recordGrowthEvent: mocks.recordEvent }))

import { withDownloadReservation } from "./server"

const operationId = "019fd1e2-9b00-79f1-8b03-f09507529a0b"

function request(query = `operation_id=${operationId}`, visitorId?: string) {
  return new Request(`https://geekskai.com/api/download?${query}`, {
    headers: visitorId ? { cookie: `geekskai_visitor_quota=${visitorId}` } : undefined,
  })
}

describe("Registered User download endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.DOWNLOAD_QUOTA_SERVER_ENABLED = "true"
    process.env.DOWNLOAD_QUOTA_SCHEMA_READY = "true"
    process.env.DOWNLOAD_QUOTA_ENABLED_TOOLS = "soundcloud-track"
  })

  it("requires and claims the Visitor's server-issued reservation", async () => {
    mocks.auth.mockResolvedValue({ userId: null })
    const visitorId = "019fd1e2-9b00-79f1-8b03-f09507529a0c"
    mocks.claimVisitorOperation.mockResolvedValue({
      status: "processing",
      toolId: "soundcloud-track",
      expiresAt: new Date(Date.now() + 60_000),
    })
    const response = await withDownloadReservation(
      request(undefined, visitorId),
      ["soundcloud-track"],
      () => Promise.resolve(new Response("ok"))
    )

    expect(response.status).toBe(200)
    expect(mocks.claimVisitorOperation).toHaveBeenCalledWith(visitorId, operationId, [
      "soundcloud-track",
    ])
  })

  it("rejects a Visitor request without its server-issued identity", async () => {
    mocks.auth.mockResolvedValue({ userId: null })
    const response = await withDownloadReservation(request(), ["soundcloud-track"], () =>
      Promise.resolve(new Response("ok"))
    )
    expect(response.status).toBe(409)
  })

  it("keeps a successful response reserved until the client confirms the completed transfer", async () => {
    mocks.auth.mockResolvedValue({ userId: "user_123" })
    mocks.claimOperation.mockResolvedValue({
      status: "processing",
      toolId: "soundcloud-track",
      expiresAt: new Date(Date.now() + 60_000),
    })

    const response = await withDownloadReservation(request(), ["soundcloud-track"], () =>
      Promise.resolve(new Response("ok"))
    )

    expect(response.status).toBe(200)
    expect(mocks.complete).not.toHaveBeenCalled()
    expect(mocks.release).not.toHaveBeenCalled()
  })

  it("releases an active reservation after a failed response", async () => {
    mocks.auth.mockResolvedValue({ userId: "user_123" })
    mocks.claimOperation.mockResolvedValue({
      status: "processing",
      toolId: "soundcloud-track",
      expiresAt: new Date(Date.now() + 60_000),
    })

    const response = await withDownloadReservation(request(), ["soundcloud-track"], () =>
      Promise.resolve(new Response("failed", { status: 502 }))
    )

    expect(response.status).toBe(502)
    expect(mocks.release).toHaveBeenCalledWith("user_123", operationId)
    expect(mocks.complete).not.toHaveBeenCalled()
  })

  it("rejects a missing, consumed, or mismatched reservation", async () => {
    mocks.auth.mockResolvedValue({ userId: "user_123" })
    mocks.claimOperation.mockResolvedValue(null)
    mocks.getOperation.mockResolvedValue({
      status: "consumed",
      toolId: "soundcloud-track",
      expiresAt: new Date(Date.now() + 60_000),
    })

    const response = await withDownloadReservation(request(), ["soundcloud-track"], () =>
      Promise.resolve(new Response("ok"))
    )

    expect(response.status).toBe(409)
    expect(mocks.complete).not.toHaveBeenCalled()
  })

  it("does not trust a client-declared disabled sibling on a partially enabled shared endpoint", async () => {
    mocks.auth.mockResolvedValue({ userId: "user_123" })
    process.env.DOWNLOAD_QUOTA_ENABLED_TOOLS = "soundcloud-playlist"

    const response = await withDownloadReservation(
      request(`operation_id=${operationId}&quota_tool=soundcloud-track`),
      ["soundcloud-track", "soundcloud-playlist"],
      () => Promise.resolve(new Response("ok"))
    )

    expect(response.status).toBe(409)
    expect(mocks.claimOperation).toHaveBeenCalledWith("user_123", operationId, [
      "soundcloud-track",
      "soundcloud-playlist",
    ])
  })
})
