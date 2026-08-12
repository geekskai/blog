import { createHmac, timingSafeEqual } from "node:crypto"
import { PACKAGE_CATALOG } from "./catalog"

export type PackageTier = "free" | "basic" | "pro" | "enterprise"
export type CheckoutTier = Extract<PackageTier, "basic" | "pro">
export type BillingInterval = "monthly" | "annual"
export type CheckoutSelection = { tier: CheckoutTier; interval: BillingInterval }
export type AccessAction = "grant" | "retain" | "revoke" | "none"

export type EntitlementSet = {
  audioBatchFileLimit: number
  zipExport: boolean
  downloadDailyLimit: number
  downloadConcurrency: number
  shareUnlockAvailable: boolean
}

export type BillingProductEnvironment = {
  CREEM_BASIC_MONTHLY_PRODUCT_ID?: string
  CREEM_BASIC_ANNUAL_PRODUCT_ID?: string
  CREEM_PRO_MONTHLY_PRODUCT_ID?: string
  CREEM_PRO_ANNUAL_PRODUCT_ID?: string
}

const PRODUCT_ENV_KEYS: Record<
  `${CheckoutTier}_${BillingInterval}`,
  keyof BillingProductEnvironment
> = {
  basic_monthly: "CREEM_BASIC_MONTHLY_PRODUCT_ID",
  basic_annual: "CREEM_BASIC_ANNUAL_PRODUCT_ID",
  pro_monthly: "CREEM_PRO_MONTHLY_PRODUCT_ID",
  pro_annual: "CREEM_PRO_ANNUAL_PRODUCT_ID",
}

export function classifyRefund(input: {
  refundAmount?: number | null
  transactionAmountPaid?: number | null
  transactionRefundedAmount?: number | null
  subscriptionStatus?: string | null
}): "full" | "partial" {
  if (input.subscriptionStatus === "canceled") return "full"
  const total = input.transactionAmountPaid
  const refunded = input.transactionRefundedAmount ?? input.refundAmount
  return typeof total === "number" && total > 0 && typeof refunded === "number" && refunded >= total
    ? "full"
    : "partial"
}

export function isPackageTier(value: unknown): value is PackageTier {
  return value === "free" || value === "basic" || value === "pro" || value === "enterprise"
}

export function isCheckoutSelection(value: unknown): value is CheckoutSelection {
  if (!value || typeof value !== "object") return false
  const candidate = value as Record<string, unknown>
  return (
    (candidate.tier === "basic" || candidate.tier === "pro") &&
    (candidate.interval === "monthly" || candidate.interval === "annual")
  )
}

export function getEntitlementSet(tier: PackageTier): EntitlementSet {
  const entry = PACKAGE_CATALOG[tier]
  return {
    audioBatchFileLimit: entry.audioBatchFileLimit,
    zipExport: entry.zipExport,
    downloadDailyLimit: entry.downloadDailyLimit,
    downloadConcurrency: entry.downloadConcurrency,
    shareUnlockAvailable: entry.shareUnlockAvailable,
  }
}

export function getBillingProductId(selection: CheckoutSelection, env: BillingProductEnvironment) {
  const key = `${selection.tier}_${selection.interval}` as const
  const productId = env[PRODUCT_ENV_KEYS[key]]
  if (!productId?.trim()) {
    throw new Error(`Creem ${selection.tier} ${selection.interval} product is not configured.`)
  }
  return productId.trim()
}

export function getBillingProductSelection(
  productId: string | null | undefined,
  env: BillingProductEnvironment
): CheckoutSelection | null {
  const normalized = productId?.trim()
  if (!normalized) return null

  for (const [key, envKey] of Object.entries(PRODUCT_ENV_KEYS)) {
    if (env[envKey]?.trim() === normalized) {
      const [tier, interval] = key.split("_") as [CheckoutTier, BillingInterval]
      return { tier, interval }
    }
  }
  return null
}

export function getAccessAction(
  eventType: string,
  options: { refundType?: "full" | "partial" } = {}
): AccessAction {
  if (eventType === "subscription.active" || eventType === "subscription.paid") return "grant"
  if (eventType === "subscription.past_due" || eventType === "subscription.scheduled_cancel") {
    return "retain"
  }
  if (
    eventType === "subscription.expired" ||
    eventType === "subscription.paused" ||
    eventType === "subscription.canceled" ||
    eventType === "dispute.created"
  ) {
    return "revoke"
  }
  if (eventType === "refund.created" && options.refundType === "full") return "revoke"
  return "none"
}

export function verifyCreemSignature(payload: string, signature: string, secret: string) {
  if (!/^[a-f\d]{64}$/i.test(signature)) return false
  const expected = createHmac("sha256", secret).update(payload).digest("hex")
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))
}
