import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { getPayPalClient } from "@/lib/billing/paypal"
import { billingCheckoutEnabled, billingSchemaV2Enabled } from "@/lib/billing/policy"
import { confirmPayPalSubscription } from "@/lib/billing/repository"

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  if (!billingCheckoutEnabled(userId) || !billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Checkout is currently unavailable." }, { status: 503 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const subscriptionId = typeof body?.subscriptionId === "string" ? body.subscriptionId.trim() : ""
  if (!/^[A-Z0-9-]{3,64}$/i.test(subscriptionId)) {
    return NextResponse.json({ error: "Invalid PayPal subscription." }, { status: 400 })
  }

  try {
    const subscription = await getPayPalClient().getSubscription(subscriptionId)
    const result = await confirmPayPalSubscription(userId, subscription)
    return NextResponse.json({ ok: true, status: result.status })
  } catch (error) {
    console.error("PayPal subscription confirmation failed", error)
    return NextResponse.json({ error: "Subscription confirmation failed." }, { status: 502 })
  }
}
