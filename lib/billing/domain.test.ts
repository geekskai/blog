import { describe, expect, it } from "vitest"
import { ANNUAL_SAVINGS, PACKAGE_CATALOG } from "./catalog"
import {
  classifyRefund,
  getAccessAction,
  getBillingProductId,
  getBillingProductSelection,
  getEntitlementSet,
  isCheckoutSelection,
  verifyCreemSignature,
} from "./domain"

describe("Geekskai package catalog", () => {
  it("keeps the approved prices and exact twenty-percent annual savings", () => {
    expect(PACKAGE_CATALOG.basic).toMatchObject({ monthlyPrice: 10, annualPrice: 96 })
    expect(PACKAGE_CATALOG.pro).toMatchObject({ monthlyPrice: 25, annualPrice: 240 })
    expect(ANNUAL_SAVINGS).toEqual({ basic: 24, pro: 60 })
  })

  it("maps the four public tiers to stable account entitlements", () => {
    expect(getEntitlementSet("free")).toMatchObject({
      audioBatchFileLimit: 1,
      zipExport: false,
      downloadDailyLimit: 10,
      downloadConcurrency: 1,
      shareUnlockAvailable: true,
    })
    expect(getEntitlementSet("basic")).toMatchObject({
      audioBatchFileLimit: 20,
      zipExport: true,
      downloadDailyLimit: 50,
      downloadConcurrency: 2,
      shareUnlockAvailable: false,
    })
    expect(getEntitlementSet("pro")).toMatchObject({
      audioBatchFileLimit: 50,
      zipExport: true,
      downloadDailyLimit: 200,
      downloadConcurrency: 4,
      shareUnlockAvailable: false,
    })
    expect(getEntitlementSet("enterprise")).toMatchObject({
      audioBatchFileLimit: 50,
      zipExport: true,
      downloadDailyLimit: 200,
      downloadConcurrency: 4,
      shareUnlockAvailable: false,
    })
  })

  it("accepts only Basic and Pro checkout selections", () => {
    expect(isCheckoutSelection({ tier: "basic", interval: "monthly" })).toBe(true)
    expect(isCheckoutSelection({ tier: "pro", interval: "annual" })).toBe(true)
    expect(isCheckoutSelection({ tier: "free", interval: "annual" })).toBe(false)
    expect(isCheckoutSelection({ tier: "enterprise", interval: "monthly" })).toBe(false)
    expect(isCheckoutSelection({ tier: "pro", interval: "prod_attacker_supplied" })).toBe(false)
  })

  it("maps checkout selections and provider product IDs only on the server", () => {
    const env = {
      CREEM_BASIC_MONTHLY_PRODUCT_ID: "prod_basic_monthly",
      CREEM_BASIC_ANNUAL_PRODUCT_ID: "prod_basic_annual",
      CREEM_PRO_MONTHLY_PRODUCT_ID: "prod_pro_monthly",
      CREEM_PRO_ANNUAL_PRODUCT_ID: "prod_pro_annual",
    }
    expect(getBillingProductId({ tier: "pro", interval: "annual" }, env)).toBe("prod_pro_annual")
    expect(getBillingProductSelection("prod_basic_monthly", env)).toEqual({
      tier: "basic",
      interval: "monthly",
    })
    expect(getBillingProductSelection("prod_unknown", env)).toBeNull()
  })
})

describe("Creem subscription access", () => {
  it("grants only from verified subscription lifecycle events", () => {
    expect(getAccessAction("checkout.completed")).toBe("none")
    expect(getAccessAction("subscription.active")).toBe("grant")
    expect(getAccessAction("subscription.paid")).toBe("grant")
    expect(getAccessAction("subscription.past_due")).toBe("retain")
    expect(getAccessAction("subscription.scheduled_cancel")).toBe("retain")
    expect(getAccessAction("subscription.expired")).toBe("revoke")
    expect(getAccessAction("subscription.paused")).toBe("revoke")
    expect(getAccessAction("dispute.created")).toBe("revoke")
  })

  it("revokes only full refunds", () => {
    expect(getAccessAction("refund.created", { refundType: "full" })).toBe("revoke")
    expect(getAccessAction("refund.created", { refundType: "partial" })).toBe("none")
  })

  it("classifies refunds from Creem totals without revoking on ambiguous data", () => {
    expect(classifyRefund({ refundAmount: 500, transactionAmountPaid: 1210 })).toBe("partial")
    expect(classifyRefund({ refundAmount: 1210, transactionAmountPaid: 1210 })).toBe("full")
    expect(classifyRefund({ transactionRefundedAmount: 1210, transactionAmountPaid: 1210 })).toBe(
      "full"
    )
    expect(classifyRefund({ subscriptionStatus: "canceled" })).toBe("full")
    expect(classifyRefund({})).toBe("partial")
  })
})

describe("Creem webhook signatures", () => {
  it("compares the HMAC-SHA256 signature without trusting malformed input", () => {
    const payload = '{"id":"evt_test"}'
    const secret = "test_secret"
    expect(
      verifyCreemSignature(
        payload,
        "2565b148f2f43bfe9e1c294b482a5f8f4bdb6071c09c154f8333f7f7eaa85cbb",
        secret
      )
    ).toBe(true)
    expect(verifyCreemSignature(payload, "not-a-signature", secret)).toBe(false)
  })
})
