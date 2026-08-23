import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { getBillingPlanId, isCheckoutSelection } from "@/lib/billing/domain"
import { getPayPalConfig } from "@/lib/billing/paypal"
import { billingCheckoutEnabled } from "@/lib/billing/policy"
import {
  createPayPalCheckoutCorrelation,
  getAccountPlanStatus,
  getManagedPayPalSubscription,
} from "@/lib/billing/repository"

export async function POST(request: NextRequest) {
  if (!billingCheckoutEnabled()) {
    return NextResponse.json({ error: "Checkout is currently unavailable." }, { status: 503 })
  }

  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const selection = { tier: body?.tier, interval: body?.interval }
  if (!isCheckoutSelection(selection)) {
    return NextResponse.json({ error: "Unknown billing plan." }, { status: 400 })
  }
  const [accountPlan, managedSubscription] = await Promise.all([
    getAccountPlanStatus(userId),
    getManagedPayPalSubscription(userId),
  ])
  if (accountPlan.packageTier !== "free" || managedSubscription) {
    return NextResponse.json(
      { error: "Manage an existing subscription from your billing account." },
      { status: 409 }
    )
  }

  try {
    const config = getPayPalConfig()
    const planId = getBillingPlanId(selection, {
      PAYPAL_BASIC_MONTHLY_PLAN_ID: process.env.PAYPAL_BASIC_MONTHLY_PLAN_ID,
      PAYPAL_BASIC_ANNUAL_PLAN_ID: process.env.PAYPAL_BASIC_ANNUAL_PLAN_ID,
      PAYPAL_PRO_MONTHLY_PLAN_ID: process.env.PAYPAL_PRO_MONTHLY_PLAN_ID,
      PAYPAL_PRO_ANNUAL_PLAN_ID: process.env.PAYPAL_PRO_ANNUAL_PLAN_ID,
    })
    const correlation = await createPayPalCheckoutCorrelation(userId, selection)
    return NextResponse.json({
      clientId: config.clientId,
      planId,
      customId: correlation.id,
    })
  } catch (error) {
    console.error("PayPal checkout preparation failed", error)
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 502 })
  }
}
