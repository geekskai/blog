import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { getAccountPlanStatus, recordWorkspaceActivation } from "@/lib/billing/repository"

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (body?.kind !== "single" && body?.kind !== "batch") {
    return NextResponse.json({ error: "Unknown activation kind." }, { status: 400 })
  }
  if (body.kind === "batch" && (await getAccountPlanStatus(userId)).batchFileLimit <= 1) {
    return NextResponse.json({ error: "A paid plan is required." }, { status: 403 })
  }
  await recordWorkspaceActivation(userId, body.kind)
  return NextResponse.json({ ok: true })
}
