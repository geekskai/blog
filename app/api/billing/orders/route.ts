import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { CREDIT_CATALOG } from "@/lib/billing/catalog"
import { attachPayPalOrder, createPendingPaygOrder } from "@/lib/billing/orders"
import { getPayPalClient, isPayPalCheckoutConfigured } from "@/lib/billing/paypal"
import { recordGrowthEventForUserSafely } from "@/lib/growth/events"
import {
  audioCreditsEnabled,
  billingCheckoutEnabled,
  billingSchemaV2Enabled,
} from "@/lib/billing/policy"

export const runtime = "nodejs"

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  if (!billingCheckoutEnabled(userId) || !audioCreditsEnabled() || !billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Checkout is currently unavailable." }, { status: 503 })
  }
  if (!isPayPalCheckoutConfigured()) {
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 })
  }
  try {
    const localOrderId = await createPendingPaygOrder(userId)
    const order = await getPayPalClient().createOrder({
      requestId: localOrderId,
      customId: localOrderId,
      amount: CREDIT_CATALOG.payg480.price.toFixed(2),
      currency: CREDIT_CATALOG.payg480.currency,
      productKey: CREDIT_CATALOG.payg480.key,
      description: `${CREDIT_CATALOG.payg480.credits} Geekskai Audio Credits`,
    })
    const orderId = typeof order.id === "string" ? order.id : null
    if (!orderId) throw new Error("PayPal did not return an order ID.")
    await attachPayPalOrder(localOrderId, orderId)
    await recordGrowthEventForUserSafely(userId, "billing_checkout_started_payg")
    return NextResponse.json({ orderId })
  } catch (error) {
    console.error("PayPal PAYG order creation failed", error)
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 502 })
  }
}
