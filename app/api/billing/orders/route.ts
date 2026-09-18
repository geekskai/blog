import { auth } from "@clerk/nextjs/server"
import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { CREDIT_CATALOG } from "@/lib/billing/catalog"
import { attachPayPalOrder, createPendingPaygOrder } from "@/lib/billing/orders"
import {
  getPayPalClient,
  getPayPalErrorLogFields,
  isPayPalCheckoutConfigured,
} from "@/lib/billing/paypal"
import { getPayPalOrderReturnUrls } from "@/lib/billing/return-urls"
import { recordGrowthEventForUserSafely } from "@/lib/growth/events"
import {
  audioCreditsEnabled,
  billingCheckoutEnabled,
  billingSchemaV2Enabled,
} from "@/lib/billing/policy"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  if (!billingCheckoutEnabled(userId) || !audioCreditsEnabled() || !billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Checkout is currently unavailable." }, { status: 503 })
  }
  if (!isPayPalCheckoutConfigured()) {
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 })
  }
  const requestId = request.headers.get("x-request-id") ?? randomUUID()
  let localOrderId: string | null = null
  let providerOrderId: string | null = null
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
    const urls = getPayPalOrderReturnUrls(body?.locale)
    localOrderId = await createPendingPaygOrder(userId)
    console.info("PayPal PAYG order creation started", { localOrderId, requestId })
    const order = await getPayPalClient().createOrder({
      requestId: localOrderId,
      customId: localOrderId,
      amount: CREDIT_CATALOG.payg480.price.toFixed(2),
      currency: CREDIT_CATALOG.payg480.currency,
      productKey: CREDIT_CATALOG.payg480.key,
      description: `${CREDIT_CATALOG.payg480.credits} Geekskai Audio Credits`,
      ...urls,
    })
    const orderId = typeof order.id === "string" ? order.id : null
    if (!orderId) throw new Error("PayPal did not return an order ID.")
    providerOrderId = orderId
    await attachPayPalOrder(localOrderId, orderId)
    await recordGrowthEventForUserSafely(userId, "billing_checkout_started_payg")
    console.info("PayPal PAYG order created", { localOrderId, providerOrderId, requestId })
    return NextResponse.json({ orderId })
  } catch (error) {
    console.error("PayPal PAYG order creation failed", {
      localOrderId,
      providerOrderId,
      requestId,
      ...getPayPalErrorLogFields(error),
      error,
    })
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 502 })
  }
}
