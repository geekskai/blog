import { NextRequest, NextResponse } from "next/server"
import {
  classifyPayPalRefund,
  normalizePayPalEvent,
  type PayPalWebhookEvent,
} from "@/lib/billing/paypal-event"
import { getPayPalClient, type PayPalTransmission } from "@/lib/billing/paypal"
import { processPayPalWebhook } from "@/lib/billing/repository"
import { CREDIT_CATALOG } from "@/lib/billing/catalog"

const getTransmission = (request: NextRequest): PayPalTransmission | null => {
  const transmission = {
    authAlgo: request.headers.get("paypal-auth-algo") ?? "",
    certUrl: request.headers.get("paypal-cert-url") ?? "",
    transmissionId: request.headers.get("paypal-transmission-id") ?? "",
    transmissionSig: request.headers.get("paypal-transmission-sig") ?? "",
    transmissionTime: request.headers.get("paypal-transmission-time") ?? "",
  }
  return Object.values(transmission).every(Boolean) ? transmission : null
}

const readString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null
const readObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null

export async function POST(request: NextRequest) {
  const transmission = getTransmission(request)
  const rawPayload = await request.text()
  if (!transmission) {
    return NextResponse.json({ error: "Invalid PayPal transmission." }, { status: 401 })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(rawPayload || "null")
  } catch {
    return NextResponse.json({ error: "Invalid PayPal event." }, { status: 400 })
  }

  try {
    normalizePayPalEvent(parsed)
    const payload = parsed as PayPalWebhookEvent
    const client = getPayPalClient()
    if (!(await client.verifyWebhook(transmission, payload))) {
      return NextResponse.json({ error: "Invalid PayPal transmission." }, { status: 401 })
    }

    let refundType: "full" | "partial" | undefined
    let subscriptionPeriodEnd: Date | null | undefined
    const resource = payload.resource
    const normalized = normalizePayPalEvent(payload)
    const originalSaleId =
      readString(resource.sale_id) ??
      (payload.event_type === "CUSTOMER.DISPUTE.CREATED" ? normalized.saleId : null)
    if (
      originalSaleId &&
      (payload.event_type === "PAYMENT.SALE.REFUNDED" ||
        payload.event_type === "CUSTOMER.DISPUTE.CREATED")
    ) {
      const sale = await client.getSale(originalSaleId)
      const subscriptionId = readString(sale.billing_agreement_id)
      if (subscriptionId && !resource.billing_agreement_id) {
        payload.resource = { ...resource, billing_agreement_id: subscriptionId }
      }
      if (payload.event_type === "PAYMENT.SALE.REFUNDED") {
        refundType = classifyPayPalRefund(resource, sale)
      }
    }

    if (payload.event_type === "PAYMENT.CAPTURE.REFUNDED" && normalized.captureId) {
      const capture = await client.getCapture(normalized.captureId)
      const status = readString(capture.status)?.toUpperCase()
      const amount = readObject(capture.amount)
      const value = readString(amount?.value)
      const currency = readString(amount?.currency_code)?.toUpperCase()
      if (
        (status !== "REFUNDED" && status !== "PARTIALLY_REFUNDED") ||
        value !== CREDIT_CATALOG.payg480.price.toFixed(2) ||
        currency !== CREDIT_CATALOG.payg480.currency
      ) {
        throw new Error("PayPal capture refund state does not match the PAYG product.")
      }
      refundType = status === "REFUNDED" ? "full" : "partial"
    }

    if (payload.event_type === "PAYMENT.SALE.COMPLETED" && normalized.subscriptionId) {
      const subscription = await client.getSubscription(normalized.subscriptionId)
      const billingInfo = readObject(subscription.billing_info)
      const nextBillingTime = readString(billingInfo?.next_billing_time)
      const parsedPeriodEnd = nextBillingTime ? new Date(nextBillingTime) : null
      subscriptionPeriodEnd =
        parsedPeriodEnd && !Number.isNaN(parsedPeriodEnd.getTime()) ? parsedPeriodEnd : null
    }

    const result = await processPayPalWebhook(payload, rawPayload, {
      refundType,
      subscriptionPeriodEnd,
    })
    if (
      result.processingError === "unlinked_account" ||
      result.processingError === "unlinked_order" ||
      result.processingError === "unlinked_capture" ||
      result.processingError === "invalid_billing_period"
    ) {
      throw new Error(`Retryable PayPal event: ${result.processingError}`)
    }
    return NextResponse.json({ ok: true, duplicate: result.duplicate })
  } catch (error) {
    console.error("PayPal webhook processing failed", error)
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 })
  }
}
