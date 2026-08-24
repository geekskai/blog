import { describe, expect, it } from "vitest"
import { CREDIT_CATALOG } from "./catalog"
import {
  creditsForDuration,
  getAccessAction,
  getBillingPlanId,
  getBillingPlanSelection,
  getBillingDisplayName,
  getDailyCreditWindow,
  getPaygExpiry,
  isCheckoutSelection,
} from "./domain"

describe("Geekskai Audio Credit catalog", () => {
  it("locks the approved daily, PAYG, and monthly products", () => {
    expect(CREDIT_CATALOG.freeDaily.credits).toBe(30)
    expect(CREDIT_CATALOG.payg480).toMatchObject({ credits: 480, price: 14, currency: "USD" })
    expect(CREDIT_CATALOG.regularMonthly).toMatchObject({
      credits: 2800,
      price: 29,
      currency: "USD",
    })
  })

  it("grants paid batch capability without changing the separate downloader contract", () => {
    expect(CREDIT_CATALOG.freeDaily).toMatchObject({ batchFileLimit: 1, zipExport: false })
    expect(CREDIT_CATALOG.regularMonthly).toMatchObject({
      batchFileLimit: 50,
      zipExport: true,
    })
  })

  it("accepts only the Regular monthly subscription", () => {
    expect(isCheckoutSelection({ tier: "regular", interval: "monthly" })).toBe(true)
    expect(isCheckoutSelection({ tier: "regular", interval: "annual" })).toBe(false)
    expect(isCheckoutSelection({ tier: "pro", interval: "monthly" })).toBe(false)
  })

  it("maps the Regular plan ID only on the server", () => {
    const env = { PAYPAL_REGULAR_MONTHLY_PLAN_ID: "P-regular-monthly" }
    expect(getBillingPlanId({ tier: "regular", interval: "monthly" }, env)).toBe(
      "P-regular-monthly"
    )
    expect(getBillingPlanSelection("P-regular-monthly", env)).toEqual({
      tier: "regular",
      interval: "monthly",
    })
    expect(getBillingPlanSelection("P-unknown", env)).toBeNull()
  })

  it("rounds the combined batch duration up once", () => {
    expect(creditsForDuration(0)).toBe(0)
    expect(creditsForDuration(30)).toBe(1)
    expect(creditsForDuration(60)).toBe(1)
    expect(creditsForDuration(61)).toBe(2)
  })

  it("uses UTC daily windows and one-year PAYG expiry", () => {
    const now = new Date("2026-08-24T23:30:00-07:00")
    expect(getDailyCreditWindow(now)).toMatchObject({
      sourceRef: "2026-08-25",
      startsAt: new Date("2026-08-25T00:00:00.000Z"),
      expiresAt: new Date("2026-08-26T00:00:00.000Z"),
      credits: 30,
    })
    expect(getPaygExpiry(new Date("2026-01-01T00:00:00.000Z"))).toEqual(
      new Date("2027-01-01T00:00:00.000Z")
    )
  })

  it("names the visible billing product from the actual Credit sources", () => {
    expect(getBillingDisplayName({ subscription: 0, payg: 0 })).toBe("Free")
    expect(getBillingDisplayName({ subscription: 0, payg: 480 })).toBe("Pay As You Go")
    expect(getBillingDisplayName({ subscription: 2800, payg: 0 })).toBe("Regular")
    expect(getBillingDisplayName({ subscription: 100, payg: 100 })).toBe("Paid Audio Credits")
  })
})

describe("PayPal credit lifecycle", () => {
  it("grants only from completed subscription payments", () => {
    expect(getAccessAction("BILLING.SUBSCRIPTION.ACTIVATED")).toBe("none")
    expect(getAccessAction("PAYMENT.SALE.COMPLETED")).toBe("grant")
    expect(getAccessAction("BILLING.SUBSCRIPTION.PAYMENT.FAILED")).toBe("retain")
    expect(getAccessAction("BILLING.SUBSCRIPTION.CANCELLED")).toBe("retain")
    expect(getAccessAction("BILLING.SUBSCRIPTION.SUSPENDED")).toBe("revoke")
  })

  it("revokes full refunds and reversals but flags partial refunds for review", () => {
    expect(getAccessAction("PAYMENT.SALE.REFUNDED", { refundType: "full" })).toBe("revoke")
    expect(getAccessAction("PAYMENT.SALE.REFUNDED", { refundType: "partial" })).toBe("none")
    expect(getAccessAction("PAYMENT.CAPTURE.REFUNDED", { refundType: "full" })).toBe("revoke")
    expect(getAccessAction("PAYMENT.CAPTURE.REVERSED")).toBe("revoke")
  })
})
