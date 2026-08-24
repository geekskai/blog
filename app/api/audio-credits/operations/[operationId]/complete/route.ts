import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { completeAudioCreditOperation } from "@/lib/audio-credits/repository"
import { billingSchemaV2Enabled } from "@/lib/billing/policy"

export const runtime = "nodejs"
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ operationId: string }> }
) {
  const [{ userId }, { operationId }, body] = await Promise.all([
    auth(),
    params,
    request.json().catch(() => null) as Promise<Record<string, unknown> | null>,
  ])
  if (!userId) return NextResponse.json({ error: "Sign in to process audio." }, { status: 401 })
  if (!billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Audio Credits are temporarily unavailable." }, { status: 503 })
  }
  if (!UUID_PATTERN.test(operationId)) {
    return NextResponse.json({ error: "Invalid Audio Credit operation." }, { status: 400 })
  }
  const completedDurationSeconds = Number(body?.completedDurationSeconds)
  const completedFileCount = Number(body?.completedFileCount)
  if (
    !Number.isFinite(completedDurationSeconds) ||
    completedDurationSeconds < 0 ||
    !Number.isInteger(completedFileCount) ||
    completedFileCount < 0
  ) {
    return NextResponse.json({ error: "Invalid Audio Credit completion." }, { status: 400 })
  }
  try {
    const result = await completeAudioCreditOperation({
      clerkUserId: userId,
      operationId,
      completedDurationSeconds,
      completedFileCount,
    })
    return result
      ? NextResponse.json(result)
      : NextResponse.json({ error: "Audio Credit operation was not found." }, { status: 404 })
  } catch (error) {
    console.error("Failed to complete Audio Credit operation", error)
    return NextResponse.json({ error: "Audio Credits could not be completed." }, { status: 409 })
  }
}
