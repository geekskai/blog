import { NextRequest, NextResponse } from "next/server"
import {
  classifyPayPalRefund,
  normalizePayPalEvent,
  type PayPalWebhookEvent,
} from "@/lib/billing/paypal-event"
import { getPayPalClient, type PayPalTransmission } from "@/lib/billing/paypal"
import { processPayPalWebhook } from "@/lib/billing/repository"

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

    const result = await processPayPalWebhook(payload, rawPayload, { refundType })
    return NextResponse.json({ ok: true, duplicate: result.duplicate })
  } catch (error) {
    console.error("PayPal webhook processing failed", error)
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 })
  }
}
