import { NextResponse } from "next/server"
import { getPayPalClient } from "@/lib/billing/paypal"
import {
  deleteExpiredPayPalCheckoutCorrelations,
  listTrackedPayPalSubscriptionIds,
  processPayPalWebhook,
} from "@/lib/billing/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let reconciled = 0
  const failures: string[] = []
  const expiredCorrelationsDeleted = await deleteExpiredPayPalCheckoutCorrelations()
  const client = getPayPalClient()
  for (const subscriptionId of await listTrackedPayPalSubscriptionIds()) {
    try {
      const subscription = await client.getSubscription(subscriptionId)
      const status =
        typeof subscription.status === "string" ? subscription.status.toUpperCase() : "UNKNOWN"
      const eventTypes: Record<string, string> = {
        ACTIVE: "BILLING.SUBSCRIPTION.ACTIVATED",
        SUSPENDED: "BILLING.SUBSCRIPTION.SUSPENDED",
        CANCELLED: "BILLING.SUBSCRIPTION.CANCELLED",
        EXPIRED: "BILLING.SUBSCRIPTION.EXPIRED",
      }
      const eventType = eventTypes[status] ?? "BILLING.SUBSCRIPTION.CREATED"
      const occurredAt =
        typeof subscription.status_update_time === "string"
          ? subscription.status_update_time
          : new Date().toISOString()
      const payload = {
        id: `reconcile:${subscriptionId}:${occurredAt}`,
        event_type: eventType,
        create_time: occurredAt,
        resource: subscription,
      }
      await processPayPalWebhook(payload, JSON.stringify(payload))
      reconciled += 1
    } catch {
      failures.push(subscriptionId)
    }
  }
  return NextResponse.json({
    ok: failures.length === 0,
    reconciled,
    failures,
    expiredCorrelationsDeleted,
  })
}
