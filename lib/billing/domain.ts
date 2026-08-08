import { createHmac, timingSafeEqual } from "node:crypto"

export type BillingPlan = "monthly" | "annual"
export type AccessAction = "grant" | "retain" | "revoke" | "none"

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

export function isBillingPlan(value: unknown): value is BillingPlan {
  return value === "monthly" || value === "annual"
}

export function getBillingProductId(
  plan: BillingPlan,
  env: {
    CREEM_MONTHLY_PRODUCT_ID?: string
    CREEM_ANNUAL_PRODUCT_ID?: string
  }
) {
  const productId =
    plan === "monthly" ? env.CREEM_MONTHLY_PRODUCT_ID : env.CREEM_ANNUAL_PRODUCT_ID
  if (!productId?.trim()) throw new Error(`Creem ${plan} product is not configured.`)
  return productId.trim()
}

export function getAccessAction(
  eventType: string,
  options: { refundType?: "full" | "partial" } = {}
): AccessAction {
  if (eventType === "subscription.active" || eventType === "subscription.paid") return "grant"
  if (
    eventType === "subscription.past_due" ||
    eventType === "subscription.scheduled_cancel"
  ) {
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
