import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { reserveAudioCredits } from "@/lib/audio-credits/repository"
import { audioCreditsEnabled, billingSchemaV2Enabled } from "@/lib/billing/policy"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Sign in to process audio." }, { status: 401 })
  if (!audioCreditsEnabled() || !billingSchemaV2Enabled()) {
    return NextResponse.json(
      { error: "Audio Credits are temporarily unavailable." },
      { status: 503 }
    )
  }
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const operationId = body?.operationId
  const totalDurationSeconds = Number(body?.totalDurationSeconds)
  const fileCount = Number(body?.fileCount)
  if (
    typeof operationId !== "string" ||
    !UUID_PATTERN.test(operationId) ||
    !Number.isFinite(totalDurationSeconds) ||
    totalDurationSeconds <= 0 ||
    totalDurationSeconds > 1_440_000 ||
    !Number.isInteger(fileCount) ||
    fileCount < 1 ||
    fileCount > 50
  ) {
    return NextResponse.json({ error: "Invalid Audio Credit reservation." }, { status: 400 })
  }
  try {
    const result = await reserveAudioCredits({
      clerkUserId: userId,
      operationId,
      totalDurationSeconds,
      fileCount,
    })
    return NextResponse.json(result, {
      status: result.outcome === "insufficient_credits" ? 402 : 200,
    })
  } catch (error) {
    console.error("Failed to reserve Audio Credits", error)
    return NextResponse.json({ error: "Audio Credits could not be reserved." }, { status: 409 })
  }
}
