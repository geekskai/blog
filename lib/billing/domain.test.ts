import { describe, expect, it } from "vitest"
import {
  classifyRefund,
  getAccessAction,
  getBillingProductId,
  isBillingPlan,
  verifyCreemSignature,
} from "./domain"

describe("Creem billing plans", () => {
  it("accepts only the two public plans and maps products on the server", () => {
    expect(isBillingPlan("monthly")).toBe(true)
    expect(isBillingPlan("annual")).toBe(true)
    expect(isBillingPlan("prod_attacker_supplied")).toBe(false)
    expect(
      getBillingProductId("annual", {
        CREEM_MONTHLY_PRODUCT_ID: "prod_monthly",
        CREEM_ANNUAL_PRODUCT_ID: "prod_annual",
      })
    ).toBe("prod_annual")
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
    expect(classifyRefund({ transactionRefundedAmount: 1210, transactionAmountPaid: 1210 })).toBe("full")
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
