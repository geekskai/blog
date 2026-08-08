import { NextResponse } from "next/server"
import { getCreemClient } from "@/lib/billing/creem"
import {
  listTrackedCreemSubscriptionIds,
  processCreemWebhook,
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
  for (const subscriptionId of await listTrackedCreemSubscriptionIds()) {
    try {
      const subscription = await getCreemClient().subscriptions.get(subscriptionId)
      const eventType = `subscription.${subscription.status}`
      const rawPayload = JSON.stringify({
        id: `reconcile:${subscription.id}:${subscription.updatedAt.toISOString()}`,
        eventType,
        createdAt: subscription.updatedAt.toISOString(),
        object: subscription,
      })
      await processCreemWebhook(
        {
          id: `reconcile:${subscription.id}:${subscription.updatedAt.toISOString()}`,
          eventType,
          createdAt: subscription.updatedAt,
          object: subscription as unknown as Record<string, unknown>,
        },
        rawPayload
      )
      reconciled += 1
    } catch {
      failures.push(subscriptionId)
    }
  }
  return NextResponse.json({ ok: failures.length === 0, reconciled, failures })
}
