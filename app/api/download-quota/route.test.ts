import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
  createShareAttribution: vi.fn(),
  getValidShareAttribution: vi.fn(),
  recordAccountCompletion: vi.fn(),
  recordGrowthEvent: vi.fn(),
}))

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth, currentUser: mocks.currentUser }))
vi.mock("@/lib/growth/events", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/growth/events")>()
  return {
    ...original,
    createShareAttribution: mocks.createShareAttribution,
    getValidShareAttribution: mocks.getValidShareAttribution,
    recordAccountCompletion: mocks.recordAccountCompletion,
    recordGrowthEvent: mocks.recordGrowthEvent,
  }
})
vi.mock("@/lib/download-quota/repository", () => ({
  completeVisitorDownload: vi.fn(),
  completeRegisteredDownload: vi.fn(),
  getRegisteredUsage: vi.fn(),
  getVisitorUsage: vi.fn(),
  grantRegisteredShareUnlock: vi.fn(),
  grantVisitorShareUnlock: vi.fn(),
  initializeRegisteredUsage: vi.fn(),
  initializeVisitorUsage: vi.fn(),
  releaseRegisteredDownload: vi.fn(),
  releaseVisitorDownload: vi.fn(),
  reserveRegisteredDownload: vi.fn(),
  reserveVisitorDownload: vi.fn(),
}))

import { POST } from "./route"

const shareId = "019fd1e2-9b00-79f1-8b03-f09507529a0b"

function request(body: Record<string, unknown>, cookie?: string) {
  return new NextRequest("https://geekskai.com/api/download-quota", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  })
}

describe("download quota growth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.DOWNLOAD_QUOTA_SERVER_ENABLED = "true"
    process.env.DOWNLOAD_QUOTA_SCHEMA_READY = "true"
    process.env.DOWNLOAD_QUOTA_ENABLED_TOOLS = "*"
    delete process.env.GROWTH_REGISTRATION_EXPERIMENT_ENABLED
    delete process.env.GROWTH_SHARE_CHANNELS_ENABLED
    mocks.auth.mockResolvedValue({ userId: null })
  })

  it("rejects post-download share creation while the channel experiment is off", async () => {
    const response = await POST(
      request({
        action: "create_share",
        toolId: "soundcloud-track",
        channel: "reddit",
        surface: "post_download",
        copyMode: "template",
        copyVariant: "baseline",
      })
    )

    expect(response.status).toBe(403)
    expect(mocks.createShareAttribution).not.toHaveBeenCalled()
  })

  it("keeps quota-gate X attribution available while channel sharing is off", async () => {
    const response = await POST(
      request({
        action: "create_share",
        toolId: "soundcloud-track",
        channel: "x",
        surface: "quota_gate",
        copyMode: "template",
        copyVariant: "baseline",
      })
    )

    expect(response.status).toBe(200)
    expect(mocks.createShareAttribution).toHaveBeenCalledWith(
      expect.objectContaining({ channel: "x", surface: "quota_gate" })
    )
  })

  it("rejects a random or expired share ID without recording a landing or cookie", async () => {
    mocks.getValidShareAttribution.mockResolvedValue(null)
    const response = await POST(
      request({ action: "share_landing", shareId, toolId: "soundcloud-track" })
    )

    expect(response.status).toBe(404)
    expect(mocks.recordGrowthEvent).not.toHaveBeenCalled()
    expect(response.cookies.get("geekskai_share_attribution")).toBeUndefined()
  })

  it("records and stores only a real unexpired first-touch attribution", async () => {
    mocks.getValidShareAttribution.mockResolvedValue({
      shareId,
      toolId: "soundcloud-track",
      channel: "reddit",
      surface: "post_download",
      copyMode: "template",
      copyVariant: "baseline",
    })
    const response = await POST(
      request({ action: "share_landing", shareId, toolId: "soundcloud-track" })
    )

    expect(response.status).toBe(200)
    expect(mocks.recordGrowthEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "share_landing",
        firstShareId: shareId,
        channel: "reddit",
        surface: "post_download",
      })
    )
    expect(response.cookies.get("geekskai_share_attribution")?.value).toBe(shareId)
  })

  it("creates an independent server-issued ID with restricted share dimensions", async () => {
    process.env.GROWTH_SHARE_CHANNELS_ENABLED = "true"
    const response = await POST(
      request({
        action: "create_share",
        shareId: "client-controlled",
        toolId: "youtube-shorts",
        channel: "telegram",
        surface: "post_download",
        copyMode: "template",
        copyVariant: "baseline",
      })
    )
    const data = (await response.json()) as { shareId: string }

    expect(data.shareId).toMatch(/^[0-9a-f-]{36}$/)
    expect(data.shareId).not.toBe("client-controlled")
    expect(mocks.createShareAttribution).toHaveBeenCalledWith(
      expect.objectContaining({
        shareId: data.shareId,
        toolId: "youtube-shorts",
        channel: "telegram",
        surface: "post_download",
        copyMode: "template",
        copyVariant: "baseline",
      })
    )
  })

  it("delegates quota-return classification to Clerk-backed server logic", async () => {
    mocks.auth.mockResolvedValue({ userId: "user_123" })
    mocks.currentUser.mockResolvedValue({ id: "user_123", createdAt: 1788084000000 })
    mocks.recordAccountCompletion.mockResolvedValue("new_account_completed")
    const journeyId = "019fd1e2-9b00-79f1-8b03-f09507529a0c"

    const response = await POST(
      request(
        { action: "registration_completed", toolId: "soundcloud-track" },
        `geekskai_growth_journey=${journeyId}`
      )
    )

    expect(response.status).toBe(200)
    expect(mocks.recordAccountCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        journeyId,
        clerkUserId: "user_123",
        userCreatedAt: new Date(1788084000000),
      })
    )
  })
})
