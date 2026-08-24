import { describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

import {
  audioCreditsEnabled,
  billingCheckoutEnabled,
  billingPublicCheckoutEnabled,
  getBillingReleaseStage,
} from "./policy"

describe("Billing Release Control", () => {
  it("fails closed for an absent or unknown release stage", () => {
    expect(getBillingReleaseStage({})).toBe("off")
    expect(getBillingReleaseStage({ BILLING_RELEASE_STAGE: "unknown" })).toBe("off")
    expect(audioCreditsEnabled({ BILLING_RELEASE_STAGE: "unknown" })).toBe(false)
  })

  it("keeps existing Credits usable while new checkout is closed", () => {
    const env = { BILLING_RELEASE_STAGE: "credits" }

    expect(audioCreditsEnabled(env)).toBe(true)
    expect(billingCheckoutEnabled("user_123", env)).toBe(false)
    expect(billingPublicCheckoutEnabled(env)).toBe(false)
  })

  it("allows only explicitly listed Clerk users during internal Live verification", () => {
    const env = {
      BILLING_RELEASE_STAGE: "internal",
      BILLING_INTERNAL_TEST_USER_IDS: " user_allowed, user_second ",
    }

    expect(audioCreditsEnabled(env)).toBe(true)
    expect(billingCheckoutEnabled("user_allowed", env)).toBe(true)
    expect(billingCheckoutEnabled("user_other", env)).toBe(false)
    expect(billingCheckoutEnabled(null, env)).toBe(false)
    expect(billingPublicCheckoutEnabled(env)).toBe(false)
  })

  it("opens checkout publicly only in the public stage", () => {
    const env = { BILLING_RELEASE_STAGE: "public" }

    expect(audioCreditsEnabled(env)).toBe(true)
    expect(billingCheckoutEnabled("user_any", env)).toBe(true)
    expect(billingCheckoutEnabled(null, env)).toBe(true)
    expect(billingPublicCheckoutEnabled(env)).toBe(true)
  })
})
