import { describe, expect, it } from "vitest"
import { ANNUAL_SAVINGS, PACKAGE_CATALOG } from "./catalog"
import {
  getAccessAction,
  getBillingPlanId,
  getBillingPlanSelection,
  getEntitlementSet,
  isCheckoutSelection,
  isPackageTier,
} from "./domain"

describe("Geekskai package catalog", () => {
  it("keeps the approved prices and exact twenty-percent annual savings", () => {
    expect(PACKAGE_CATALOG.basic).toMatchObject({ monthlyPrice: 10, annualPrice: 96 })
    expect(PACKAGE_CATALOG.pro).toMatchObject({ monthlyPrice: 25, annualPrice: 240 })
    expect(ANNUAL_SAVINGS).toEqual({ basic: 24, pro: 60 })
  })

  it("maps only Audio Toolkit capabilities to the three public tiers", () => {
    expect(getEntitlementSet("free")).toEqual({
      audioBatchFileLimit: 1,
      zipExport: false,
    })
    expect(getEntitlementSet("basic")).toEqual({
      audioBatchFileLimit: 20,
      zipExport: true,
    })
    expect(getEntitlementSet("pro")).toEqual({
      audioBatchFileLimit: 50,
      zipExport: true,
    })
    expect(Object.keys(PACKAGE_CATALOG)).toEqual(["free", "basic", "pro"])
    expect(isPackageTier("enterprise")).toBe(false)
  })

  it("accepts only Basic and Pro checkout selections", () => {
    expect(isCheckoutSelection({ tier: "basic", interval: "monthly" })).toBe(true)
    expect(isCheckoutSelection({ tier: "pro", interval: "annual" })).toBe(true)
    expect(isCheckoutSelection({ tier: "free", interval: "annual" })).toBe(false)
    expect(isCheckoutSelection({ tier: "enterprise", interval: "monthly" })).toBe(false)
    expect(isCheckoutSelection({ tier: "pro", interval: "prod_attacker_supplied" })).toBe(false)
  })

  it("maps checkout selections and PayPal plan IDs only on the server", () => {
    const env = {
      PAYPAL_BASIC_MONTHLY_PLAN_ID: "P-basic-monthly",
      PAYPAL_BASIC_ANNUAL_PLAN_ID: "P-basic-annual",
      PAYPAL_PRO_MONTHLY_PLAN_ID: "P-pro-monthly",
      PAYPAL_PRO_ANNUAL_PLAN_ID: "P-pro-annual",
    }
    expect(getBillingPlanId({ tier: "pro", interval: "annual" }, env)).toBe("P-pro-annual")
    expect(getBillingPlanSelection("P-basic-monthly", env)).toEqual({
      tier: "basic",
      interval: "monthly",
    })
    expect(getBillingPlanSelection("P-unknown", env)).toBeNull()
  })
})

describe("PayPal subscription access", () => {
  it("does not grant from checkout approval and normalizes subscription states", () => {
    expect(getAccessAction("BILLING.SUBSCRIPTION.CREATED")).toBe("none")
    expect(getAccessAction("BILLING.SUBSCRIPTION.ACTIVATED")).toBe("grant")
    expect(getAccessAction("BILLING.SUBSCRIPTION.PAYMENT.FAILED")).toBe("retain")
    expect(
      getAccessAction("BILLING.SUBSCRIPTION.PAYMENT.FAILED", {
        subscriptionStatus: "SUSPENDED",
      })
    ).toBe("revoke")
    expect(getAccessAction("BILLING.SUBSCRIPTION.CANCELLED")).toBe("retain")
    expect(getAccessAction("BILLING.SUBSCRIPTION.SUSPENDED")).toBe("revoke")
    expect(getAccessAction("BILLING.SUBSCRIPTION.EXPIRED")).toBe("revoke")
    expect(getAccessAction("CUSTOMER.DISPUTE.CREATED")).toBe("revoke")
  })

  it("revokes full refunds and reversals but retains partial refunds for review", () => {
    expect(getAccessAction("PAYMENT.SALE.REFUNDED", { refundType: "full" })).toBe("revoke")
    expect(getAccessAction("PAYMENT.SALE.REFUNDED", { refundType: "partial" })).toBe("none")
    expect(getAccessAction("PAYMENT.SALE.REVERSED")).toBe("revoke")
  })
})
