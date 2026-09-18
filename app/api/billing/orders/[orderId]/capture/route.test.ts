import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  getPaygOrderForCapture: vi.fn(),
  isExpectedPayPalOrder: vi.fn(),
  isExpectedPaygOrder: vi.fn(),
  isPaygOrderCapturable: vi.fn(),
  readPayPalOrderStatus: vi.fn((resource: Record<string, unknown>) => resource.status ?? null),
  parseCompletedPayPalCapture: vi.fn(),
  completePaygOrder: vi.fn(),
  getOrder: vi.fn(),
  captureOrder: vi.fn(),
}))

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }))
vi.mock("@/lib/audio-credits/repository", () => ({ getAudioCreditBalance: vi.fn() }))
vi.mock("@/lib/billing/orders", () => ({
  getPaygOrderForCapture: mocks.getPaygOrderForCapture,
  isExpectedPayPalOrder: mocks.isExpectedPayPalOrder,
  isExpectedPaygOrder: mocks.isExpectedPaygOrder,
  isPaygOrderCapturable: mocks.isPaygOrderCapturable,
  readPayPalOrderStatus: mocks.readPayPalOrderStatus,
  parseCompletedPayPalCapture: mocks.parseCompletedPayPalCapture,
  completePaygOrder: mocks.completePaygOrder,
}))
vi.mock("@/lib/billing/paypal", () => ({
  getPayPalClient: () => ({ getOrder: mocks.getOrder, captureOrder: mocks.captureOrder }),
  getPayPalErrorLogFields: () => ({ errorCode: null, paypalDebugId: null }),
}))
vi.mock("@/lib/billing/policy", () => ({
  billingCheckoutEnabled: () => true,
  billingSchemaV2Enabled: () => true,
}))

import { POST } from "./route"

const localOrder = {
  id: "00000000-0000-4000-8000-000000000001",
  status: "CREATED",
  provider_capture_id: null,
  product_key: "audio_credits_payg_480",
  amount_minor: 1400,
  currency: "USD",
  expires_at: new Date(Date.now() + 60_000),
}
const completedCapture = {
  captureId: "CAPTURE-1",
  capturedAt: new Date("2026-09-18T00:00:00Z"),
}

async function capture() {
  return POST(new Request("https://geekskai.com/api/billing/orders/ORDER-1/capture/"), {
    params: Promise.resolve({ orderId: "ORDER-1" }),
  })
}

describe("PAYG capture state machine", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, "info").mockImplementation(() => undefined)
    vi.spyOn(console, "warn").mockImplementation(() => undefined)
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    mocks.auth.mockResolvedValue({ userId: "user_test" })
    mocks.getPaygOrderForCapture.mockResolvedValue({ ...localOrder })
    mocks.isExpectedPaygOrder.mockReturnValue(true)
    mocks.isExpectedPayPalOrder.mockReturnValue(true)
    mocks.isPaygOrderCapturable.mockReturnValue(true)
    mocks.parseCompletedPayPalCapture.mockReturnValue(completedCapture)
    mocks.completePaygOrder.mockResolvedValue({ payg: 480, total: 480 })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("captures only after PayPal reports that the buyer approved the order", async () => {
    mocks.getOrder.mockResolvedValue({ status: "APPROVED" })
    mocks.captureOrder.mockResolvedValue({ status: "COMPLETED" })

    const response = await capture()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      status: "COMPLETED",
      duplicate: false,
    })
    expect(mocks.captureOrder).toHaveBeenCalledWith(
      "ORDER-1",
      "00000000-0000-4000-8000-000000000001-capture"
    )
  })

  it("recovers a completed capture after the capture response is lost", async () => {
    mocks.getOrder
      .mockResolvedValueOnce({ status: "APPROVED" })
      .mockResolvedValueOnce({ status: "COMPLETED" })
    mocks.captureOrder.mockRejectedValue(new Error("connection closed"))

    const response = await capture()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      status: "COMPLETED",
      duplicate: true,
      recovered: true,
    })
    expect(mocks.completePaygOrder).toHaveBeenCalledTimes(1)
  })

  it("does not capture an order that PayPal has not approved", async () => {
    mocks.getOrder.mockResolvedValue({ status: "CREATED" })

    const response = await capture()

    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({
      status: "NOT_APPROVED",
      code: "not_approved",
    })
    expect(mocks.captureOrder).not.toHaveBeenCalled()
  })

  it("rejects a local amount or product mismatch before any PayPal write", async () => {
    mocks.isExpectedPaygOrder.mockReturnValue(false)

    const response = await capture()

    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({ code: "order_mismatch" })
    expect(mocks.getOrder).not.toHaveBeenCalled()
    expect(mocks.captureOrder).not.toHaveBeenCalled()
  })

  it("rejects a PayPal amount or correlation mismatch before capture", async () => {
    mocks.getOrder.mockResolvedValue({ status: "APPROVED" })
    mocks.isExpectedPayPalOrder.mockReturnValue(false)

    const response = await capture()

    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({ code: "order_mismatch" })
    expect(mocks.captureOrder).not.toHaveBeenCalled()
  })
})
