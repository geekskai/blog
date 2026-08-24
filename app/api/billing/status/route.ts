import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getAccountPlanStatus } from "@/lib/billing/repository"
import { billingSchemaV2Enabled } from "@/lib/billing/policy"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  if (!billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Billing is temporarily unavailable." }, { status: 503 })
  }
  return NextResponse.json(await getAccountPlanStatus(userId))
}
