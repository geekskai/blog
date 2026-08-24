import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getPayPalClient } from "@/lib/billing/paypal"
import { billingSchemaV2Enabled } from "@/lib/billing/policy"
import { getManagedPayPalSubscription, recordPayPalCancellation } from "@/lib/billing/repository"

const readPeriodEnd = (resource: Record<string, unknown>) => {
  const billingInfo =
    resource.billing_info && typeof resource.billing_info === "object"
      ? (resource.billing_info as Record<string, unknown>)
      : null
  const value =
    typeof billingInfo?.next_billing_time === "string" ? billingInfo.next_billing_time : null
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  if (!billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Billing is temporarily unavailable." }, { status: 503 })
  }
  const managed = await getManagedPayPalSubscription(userId)
  if (!managed) {
    return NextResponse.json({ error: "No cancellable subscription was found." }, { status: 404 })
  }

  try {
    const client = getPayPalClient()
    const subscription = await client.getSubscription(managed.subscriptionId)
    const managedPeriodEnd = managed.currentPeriodEnd ? new Date(managed.currentPeriodEnd) : null
    const currentPeriodEnd =
      readPeriodEnd(subscription) ??
      (managedPeriodEnd && !Number.isNaN(managedPeriodEnd.getTime()) ? managedPeriodEnd : null)
    if (!currentPeriodEnd) {
      return NextResponse.json(
        { error: "The paid-through date could not be verified. Please contact support." },
        { status: 409 }
      )
    }
    await client.cancelSubscription(managed.subscriptionId, "Customer requested cancellation")
    await recordPayPalCancellation(userId, managed.subscriptionId, currentPeriodEnd)
    return NextResponse.json({
      ok: true,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
    })
  } catch (error) {
    console.error("PayPal subscription cancellation failed", error)
    return NextResponse.json({ error: "Cancellation is temporarily unavailable." }, { status: 502 })
  }
}
