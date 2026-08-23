import { PACKAGE_CATALOG } from "./catalog"

export type PackageTier = "free" | "basic" | "pro"
export type CheckoutTier = Extract<PackageTier, "basic" | "pro">
export type BillingInterval = "monthly" | "annual"
export type CheckoutSelection = { tier: CheckoutTier; interval: BillingInterval }
export type AccessAction = "grant" | "retain" | "revoke" | "none"

export type EntitlementSet = {
  audioBatchFileLimit: number
  zipExport: boolean
}

export type BillingPlanEnvironment = {
  PAYPAL_BASIC_MONTHLY_PLAN_ID?: string
  PAYPAL_BASIC_ANNUAL_PLAN_ID?: string
  PAYPAL_PRO_MONTHLY_PLAN_ID?: string
  PAYPAL_PRO_ANNUAL_PLAN_ID?: string
}

const PLAN_ENV_KEYS: Record<`${CheckoutTier}_${BillingInterval}`, keyof BillingPlanEnvironment> = {
  basic_monthly: "PAYPAL_BASIC_MONTHLY_PLAN_ID",
  basic_annual: "PAYPAL_BASIC_ANNUAL_PLAN_ID",
  pro_monthly: "PAYPAL_PRO_MONTHLY_PLAN_ID",
  pro_annual: "PAYPAL_PRO_ANNUAL_PLAN_ID",
}

export function isPackageTier(value: unknown): value is PackageTier {
  return value === "free" || value === "basic" || value === "pro"
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
  }
}

export function getBillingPlanId(selection: CheckoutSelection, env: BillingPlanEnvironment) {
  const key = `${selection.tier}_${selection.interval}` as const
  const planId = env[PLAN_ENV_KEYS[key]]
  if (!planId?.trim()) {
    throw new Error(`PayPal ${selection.tier} ${selection.interval} plan is not configured.`)
  }
  return planId.trim()
}

export function getBillingPlanSelection(
  planId: string | null | undefined,
  env: BillingPlanEnvironment
): CheckoutSelection | null {
  const normalized = planId?.trim()
  if (!normalized) return null

  for (const [key, envKey] of Object.entries(PLAN_ENV_KEYS)) {
    if (env[envKey]?.trim() === normalized) {
      const [tier, interval] = key.split("_") as [CheckoutTier, BillingInterval]
      return { tier, interval }
    }
  }
  return null
}

export function getAccessAction(
  eventType: string,
  options: {
    refundType?: "full" | "partial"
    subscriptionStatus?: string | null
  } = {}
): AccessAction {
  if (options.subscriptionStatus?.toUpperCase() === "SUSPENDED") return "revoke"
  if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") return "grant"
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
    eventType === "CUSTOMER.DISPUTE.CREATED"
  ) {
    return "revoke"
  }
  if (eventType === "PAYMENT.SALE.REFUNDED" && options.refundType === "full") return "revoke"
  return "none"
}
