import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { getBillingPlanId, isCheckoutSelection } from "@/lib/billing/domain"
import { getPayPalClient, isPayPalCheckoutConfigured } from "@/lib/billing/paypal"
import {
  audioCreditsEnabled,
  billingCheckoutEnabled,
  billingSchemaV2Enabled,
} from "@/lib/billing/policy"
import {
  createPayPalCheckoutCorrelation,
  hasManagedPayPalSubscription,
} from "@/lib/billing/repository"
import { recordGrowthEventForUserSafely } from "@/lib/growth/events"

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  if (!billingCheckoutEnabled(userId) || !audioCreditsEnabled() || !billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Checkout is currently unavailable." }, { status: 503 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const selection = { tier: body?.tier, interval: body?.interval }
  if (!isCheckoutSelection(selection)) {
    return NextResponse.json({ error: "Unknown billing plan." }, { status: 400 })
  }
  if (!isPayPalCheckoutConfigured()) {
    console.error("PayPal checkout preparation failed: server configuration is incomplete.")
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 })
  }
  if (await hasManagedPayPalSubscription(userId)) {
    return NextResponse.json(
      { error: "Manage an existing subscription from your billing account." },
      { status: 409 }
    )
  }

  try {
    const planId = getBillingPlanId(selection, {
      PAYPAL_REGULAR_MONTHLY_PLAN_ID: process.env.PAYPAL_REGULAR_MONTHLY_PLAN_ID,
    })
    const correlation = await createPayPalCheckoutCorrelation(userId, selection)
    const origin = request.nextUrl.origin
    const subscription = await getPayPalClient().createSubscription({
      requestId: correlation.id,
      planId,
      customId: correlation.id,
      returnUrl: `${origin}/audio-toolkit/?checkout=success`,
      cancelUrl: `${origin}/pricing/?checkout=cancelled`,
    })
    const subscriptionId = typeof subscription.id === "string" ? subscription.id : null
    if (!subscriptionId) throw new Error("PayPal did not return a subscription ID.")
    await recordGrowthEventForUserSafely(userId, "billing_checkout_started_subscription")
    return NextResponse.json({
      subscriptionId,
    })
  } catch (error) {
    console.error("PayPal checkout preparation failed", error)
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 502 })
  }
}
