import { generateText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { isQuotaToolId, isServerQuotaEnabled } from "@/lib/download-quota/config"
import {
  hasRecentAiCopyAttempt,
  isActiveGrowthJourney,
  recordGrowthEvent,
} from "@/lib/growth/events"
import {
  buildAiShareCopyPrompt,
  getAiShareCopyConfig,
  isAiChallengerJourney,
} from "@/lib/growth/ai-share-copy"
import { getGrowthExperimentConfig } from "@/lib/growth/experiments"
import { isShareChannel, validateAiShareCopy } from "@/lib/growth/sharing"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const JOURNEY_COOKIE = "geekskai_growth_journey"
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  const config = getAiShareCopyConfig()
  const growthExperiments = getGrowthExperimentConfig()
  if (!config.enabled || !growthExperiments.shareChannelsEnabled) {
    return new NextResponse(null, { status: 204 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const { toolId, locale, channel } = body as Record<string, unknown>
  if (!isQuotaToolId(toolId) || !isServerQuotaEnabled(toolId)) {
    return new NextResponse(null, { status: 204 })
  }
  if (locale !== "en" || !isShareChannel(channel)) {
    return NextResponse.json({ error: "Unsupported share copy request" }, { status: 400 })
  }

  const journeyId = request.cookies.get(JOURNEY_COOKIE)?.value
  if (!journeyId || !UUID_PATTERN.test(journeyId)) return new NextResponse(null, { status: 204 })
  if (!(await isActiveGrowthJourney(journeyId))) return new NextResponse(null, { status: 204 })
  if (!isAiChallengerJourney(journeyId)) {
    return NextResponse.json({ mode: "template", variant: "ai-control-v1" })
  }
  if (await hasRecentAiCopyAttempt({ journeyId, toolId, channel })) {
    return new NextResponse(null, { status: 204 })
  }

  try {
    const { text } = await generateText({
      model: config.model,
      instructions:
        "Write truthful product-sharing copy. Never invent personal experience, verification, outcomes, urgency, endorsements, or unsupported benefits. Do not include a URL or hashtags. Return only the message text.",
      prompt: buildAiShareCopyPrompt({ toolId, locale, channel }),
      maxRetries: 0,
      timeout: 2_500,
    })
    const copy = validateAiShareCopy(channel, text)
    if (!copy) throw new Error("AI share copy failed validation")

    await recordGrowthEvent({
      journeyId,
      eventName: "ai_copy_generated",
      toolId,
      channel,
      surface: "post_download",
      copyMode: "ai",
      copyVariant: config.variant,
    })
    return NextResponse.json({ copy, mode: "ai", variant: config.variant })
  } catch (error) {
    console.warn("AI share copy generation failed", {
      toolId,
      channel,
      error: error instanceof Error ? error.name : "unknown",
    })
    await recordGrowthEvent({
      journeyId,
      eventName: "ai_copy_failed",
      toolId,
      channel,
      surface: "post_download",
      copyMode: "ai",
      copyVariant: config.variant,
    }).catch(() => undefined)
    return NextResponse.json({ mode: "template", variant: config.variant })
  }
}
