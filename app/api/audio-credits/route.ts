import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getAudioCreditBalance } from "@/lib/audio-credits/repository"
import { audioCreditsEnabled, billingSchemaV2Enabled } from "@/lib/billing/policy"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Sign in to use Audio Credits." }, { status: 401 })
  if (!audioCreditsEnabled() || !billingSchemaV2Enabled()) {
    return NextResponse.json(
      { error: "Audio Credits are temporarily unavailable." },
      { status: 503 }
    )
  }
  try {
    return NextResponse.json(await getAudioCreditBalance(userId))
  } catch (error) {
    console.error("Failed to load Audio Credits", error)
    return NextResponse.json(
      { error: "Audio Credits are temporarily unavailable." },
      { status: 503 }
    )
  }
}
