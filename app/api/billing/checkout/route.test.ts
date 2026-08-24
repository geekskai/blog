import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  billingCheckoutEnabled: vi.fn(),
  billingSchemaV2Enabled: vi.fn(),
  audioCreditsEnabled: vi.fn(),
  isPayPalCheckoutConfigured: vi.fn(),
  getPayPalClient: vi.fn(),
  createPayPalCheckoutCorrelation: vi.fn(),
  hasManagedPayPalSubscription: vi.fn(),
}))

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }))
vi.mock("@/lib/billing/policy", () => ({
  billingCheckoutEnabled: mocks.billingCheckoutEnabled,
  billingSchemaV2Enabled: mocks.billingSchemaV2Enabled,
  audioCreditsEnabled: mocks.audioCreditsEnabled,
}))
vi.mock("@/lib/billing/paypal", () => ({
  getPayPalClient: mocks.getPayPalClient,
  isPayPalCheckoutConfigured: mocks.isPayPalCheckoutConfigured,
}))
vi.mock("@/lib/billing/repository", () => ({
  createPayPalCheckoutCorrelation: mocks.createPayPalCheckoutCorrelation,
  hasManagedPayPalSubscription: mocks.hasManagedPayPalSubscription,
}))

import { POST } from "./route"

describe("PayPal checkout route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.billingCheckoutEnabled.mockReturnValue(true)
    mocks.billingSchemaV2Enabled.mockReturnValue(true)
    mocks.audioCreditsEnabled.mockReturnValue(true)
    mocks.auth.mockResolvedValue({ userId: "user_123" })
    mocks.hasManagedPayPalSubscription.mockResolvedValue(false)
  })

  it("returns a JSON 503 before database work when PayPal configuration is incomplete", async () => {
    mocks.isPayPalCheckoutConfigured.mockReturnValue(false)
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)

    const response = await POST(
      new NextRequest("https://geekskai.com/api/billing/checkout/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier: "regular", interval: "monthly" }),
      })
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: "Checkout is temporarily unavailable.",
    })
    expect(response.headers.get("content-type")).toContain("application/json")
    expect(mocks.createPayPalCheckoutCorrelation).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
