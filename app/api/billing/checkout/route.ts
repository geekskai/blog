import { auth, currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { defaultLocale, locales } from "@/app/i18n/routing"
import { getCreemClient } from "@/lib/billing/creem"
import { getBillingProductId, isBillingPlan } from "@/lib/billing/domain"

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!isBillingPlan(body?.plan)) {
    return NextResponse.json({ error: "Unknown billing plan." }, { status: 400 })
  }
  const locale = typeof body?.locale === "string" && locales.includes(body.locale) ? body.locale : defaultLocale
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress
  if (!email) return NextResponse.json({ error: "A verified account email is required." }, { status: 400 })

  try {
    const requestWindow = Math.floor(Date.now() / (5 * 60 * 1000))
    const checkout = await getCreemClient().checkouts.create({
      productId: getBillingProductId(body.plan, {
        CREEM_MONTHLY_PRODUCT_ID: process.env.CREEM_MONTHLY_PRODUCT_ID,
        CREEM_ANNUAL_PRODUCT_ID: process.env.CREEM_ANNUAL_PRODUCT_ID,
      }),
      requestId: `workspace:${userId}:${body.plan}:${requestWindow}`,
      customer: { email },
      successUrl: `${request.nextUrl.origin}${localePrefix}/workspace/?checkout=success`,
      metadata: { referenceId: userId, plan: body.plan, source: "workspace_pricing" },
    })
    if (!checkout.checkoutUrl) throw new Error("Creem did not return a checkout URL.")
    return NextResponse.json({ url: checkout.checkoutUrl })
  } catch (error) {
    console.error("Creem checkout creation failed", error)
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 502 })
  }
}
