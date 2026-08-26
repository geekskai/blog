import { NextResponse } from "next/server"
import { purgeExpiredGrowthData } from "@/lib/growth/events"
import { reconcileRegisteredReservationCounters } from "@/lib/download-quota/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const reservations = await reconcileRegisteredReservationCounters()
  await purgeExpiredGrowthData()
  return NextResponse.json({ ok: true, reservations })
}
