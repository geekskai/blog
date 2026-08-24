import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { heartbeatAudioCreditOperation } from "@/lib/audio-credits/repository"
import { billingSchemaV2Enabled } from "@/lib/billing/policy"

export const runtime = "nodejs"
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ operationId: string }> }
) {
  const [{ userId }, { operationId }] = await Promise.all([auth(), params])
  if (!userId) return NextResponse.json({ error: "Sign in to process audio." }, { status: 401 })
  if (!billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Audio Credits are temporarily unavailable." }, { status: 503 })
  }
  if (!UUID_PATTERN.test(operationId)) {
    return NextResponse.json({ error: "Invalid Audio Credit operation." }, { status: 400 })
  }
  try {
    const result = await heartbeatAudioCreditOperation(userId, operationId)
    return result
      ? NextResponse.json(result)
      : NextResponse.json({ error: "Audio Credit reservation expired." }, { status: 409 })
  } catch (error) {
    console.error("Failed to renew Audio Credit reservation", error)
    return NextResponse.json(
      { error: "Audio Credit reservation could not be renewed." },
      { status: 503 }
    )
  }
}
