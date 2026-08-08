import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import {
  getWorkspaceBillingStatus,
  recordWorkspaceActivation,
} from "@/lib/billing/repository"

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (body?.kind !== "single" && body?.kind !== "batch") {
    return NextResponse.json({ error: "Unknown activation kind." }, { status: 400 })
  }
  if (body.kind === "batch" && !(await getWorkspaceBillingStatus(userId)).isPro) {
    return NextResponse.json({ error: "Pro access is required." }, { status: 403 })
  }
  await recordWorkspaceActivation(userId, body.kind)
  return NextResponse.json({ ok: true })
}
