import { CREDIT_CATALOG } from "./catalog"

export type PackageTier = "free" | "regular"
export type CheckoutTier = "regular"
export type BillingInterval = "monthly"
export type CheckoutSelection = { tier: CheckoutTier; interval: BillingInterval }
export type AccessAction = "grant" | "retain" | "revoke" | "none"

export type BillingPlanEnvironment = {
  PAYPAL_REGULAR_MONTHLY_PLAN_ID?: string
}

export function isCheckoutSelection(value: unknown): value is CheckoutSelection {
  if (!value || typeof value !== "object") return false
  const candidate = value as Record<string, unknown>
  return candidate.tier === "regular" && candidate.interval === "monthly"
}

export function getBillingPlanId(_selection: CheckoutSelection, env: BillingPlanEnvironment) {
  const planId = env.PAYPAL_REGULAR_MONTHLY_PLAN_ID
  if (!planId?.trim()) throw new Error("PayPal regular monthly plan is not configured.")
  return planId.trim()
}

export function getBillingPlanSelection(
  planId: string | null | undefined,
  env: BillingPlanEnvironment
): CheckoutSelection | null {
  const configured = env.PAYPAL_REGULAR_MONTHLY_PLAN_ID?.trim()
  return configured && planId?.trim() === configured
    ? { tier: "regular", interval: "monthly" }
    : null
}

export function creditsForDuration(totalDurationSeconds: number) {
  if (!Number.isFinite(totalDurationSeconds) || totalDurationSeconds <= 0) return 0
  return Math.ceil(totalDurationSeconds / 60)
}

export function getDailyCreditWindow(now = new Date()) {
  const startsAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const expiresAt = new Date(startsAt.getTime() + 24 * 60 * 60 * 1000)
  return {
    sourceRef: startsAt.toISOString().slice(0, 10),
    startsAt,
    expiresAt,
    credits: CREDIT_CATALOG.freeDaily.credits,
  }
}

export function getPaygExpiry(capturedAt: Date) {
  return new Date(capturedAt.getTime() + CREDIT_CATALOG.payg480.validityDays * 24 * 60 * 60 * 1000)
}

export function getBillingDisplayName(credits: { subscription: number; payg: number }) {
  if (credits.subscription > 0 && credits.payg > 0) return "Paid Audio Credits"
  if (credits.subscription > 0) return "Regular"
  if (credits.payg > 0) return "Pay As You Go"
  return "Free"
}

export function getAccessAction(
  eventType: string,
  options: { refundType?: "full" | "partial"; subscriptionStatus?: string | null } = {}
): AccessAction {
  if (options.subscriptionStatus?.toUpperCase() === "SUSPENDED") return "revoke"
  if (eventType === "PAYMENT.SALE.COMPLETED") return "grant"
  if (
    eventType === "BILLING.SUBSCRIPTION.PAYMENT.FAILED" ||
    eventType === "BILLING.SUBSCRIPTION.CANCELLED"
  ) {
    return "retain"
  }
  if (
    eventType === "BILLING.SUBSCRIPTION.EXPIRED" ||
    eventType === "BILLING.SUBSCRIPTION.SUSPENDED" ||
    eventType === "PAYMENT.SALE.REVERSED" ||
    eventType === "CUSTOMER.DISPUTE.CREATED" ||
    eventType === "PAYMENT.CAPTURE.REVERSED"
  ) {
    return "revoke"
  }
  if (
    (eventType === "PAYMENT.SALE.REFUNDED" || eventType === "PAYMENT.CAPTURE.REFUNDED") &&
    options.refundType === "full"
  ) {
    return "revoke"
  }
  return "none"
}
