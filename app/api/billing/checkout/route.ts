import { auth, currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { defaultLocale, locales } from "@/app/i18n/routing"
import { getCreemClient } from "@/lib/billing/creem"
import { getBillingProductId, isCheckoutSelection } from "@/lib/billing/domain"
import { billingCheckoutEnabled } from "@/lib/billing/policy"
import { getAccountPlanStatus } from "@/lib/billing/repository"

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
  const locale =
    typeof body?.locale === "string" && locales.includes(body.locale) ? body.locale : defaultLocale
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress
  if (!email)
    return NextResponse.json({ error: "A verified account email is required." }, { status: 400 })

  if ((await getAccountPlanStatus(userId)).packageTier !== "free") {
    return NextResponse.json(
      { error: "Manage an existing subscription from your billing account." },
      { status: 409 }
    )
  }

  try {
    const requestWindow = Math.floor(Date.now() / (5 * 60 * 1000))
    const checkout = await getCreemClient().checkouts.create({
      productId: getBillingProductId(selection, {
        CREEM_BASIC_MONTHLY_PRODUCT_ID: process.env.CREEM_BASIC_MONTHLY_PRODUCT_ID,
        CREEM_BASIC_ANNUAL_PRODUCT_ID: process.env.CREEM_BASIC_ANNUAL_PRODUCT_ID,
        CREEM_PRO_MONTHLY_PRODUCT_ID: process.env.CREEM_PRO_MONTHLY_PRODUCT_ID,
        CREEM_PRO_ANNUAL_PRODUCT_ID: process.env.CREEM_PRO_ANNUAL_PRODUCT_ID,
      }),
      requestId: `audio-toolkit:${userId}:${selection.tier}:${selection.interval}:${requestWindow}`,
      customer: { email },
      successUrl: `${request.nextUrl.origin}${localePrefix}/audio-toolkit/?checkout=success`,
      metadata: {
        referenceId: userId,
        source: typeof body?.source === "string" ? body.source.slice(0, 64) : "pricing",
      },
    })
    if (!checkout.checkoutUrl) throw new Error("Creem did not return a checkout URL.")
    return NextResponse.json({ url: checkout.checkoutUrl })
  } catch (error) {
    console.error("Creem checkout creation failed", error)
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 502 })
  }
}
