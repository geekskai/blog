import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  billingCheckoutEnabled: vi.fn(),
  isPayPalCheckoutConfigured: vi.fn(),
  getPayPalConfig: vi.fn(),
  createPayPalCheckoutCorrelation: vi.fn(),
  getAccountPlanStatus: vi.fn(),
  getManagedPayPalSubscription: vi.fn(),
}))

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }))
vi.mock("@/lib/billing/policy", () => ({
  billingCheckoutEnabled: mocks.billingCheckoutEnabled,
}))
vi.mock("@/lib/billing/paypal", () => ({
  getPayPalConfig: mocks.getPayPalConfig,
  isPayPalCheckoutConfigured: mocks.isPayPalCheckoutConfigured,
}))
vi.mock("@/lib/billing/repository", () => ({
  createPayPalCheckoutCorrelation: mocks.createPayPalCheckoutCorrelation,
  getAccountPlanStatus: mocks.getAccountPlanStatus,
  getManagedPayPalSubscription: mocks.getManagedPayPalSubscription,
}))

import { POST } from "./route"

describe("PayPal checkout route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.billingCheckoutEnabled.mockReturnValue(true)
    mocks.auth.mockResolvedValue({ userId: "user_123" })
  })

  it("returns a JSON 503 before database work when PayPal configuration is incomplete", async () => {
    mocks.isPayPalCheckoutConfigured.mockReturnValue(false)
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)

    const response = await POST(
      new NextRequest("https://geekskai.com/api/billing/checkout/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier: "basic", interval: "annual" }),
      })
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: "Checkout is temporarily unavailable.",
    })
    expect(response.headers.get("content-type")).toContain("application/json")
    expect(mocks.getAccountPlanStatus).not.toHaveBeenCalled()
    expect(mocks.createPayPalCheckoutCorrelation).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
