import type { QuotaToolId } from "@/lib/download-quota/config"
import { TOOL_SHARE_DETAILS, type ShareChannel } from "./sharing"

export type AiShareCopyConfig =
  | { enabled: false }
  | { enabled: true; model: string; variant: "ai-challenger-v1" }

export function getAiShareCopyConfig(env: NodeJS.ProcessEnv = process.env): AiShareCopyConfig {
  const model = env.GROWTH_SHARE_AI_MODEL?.trim()
  if (
    env.GROWTH_SHARE_AI_ENABLED !== "true" ||
    !env.AI_GATEWAY_API_KEY ||
    !model ||
    !model.endsWith("-free")
  ) {
    return { enabled: false }
  }
  return { enabled: true, model, variant: "ai-challenger-v1" }
}

export function isAiChallengerJourney(journeyId: string) {
  const compact = journeyId.replace(/-/g, "")
  const first = Number.parseInt(compact.slice(0, 2), 16)
  const last = Number.parseInt(compact.slice(-2), 16)
  return Number.isFinite(first) && Number.isFinite(last) && (first ^ last) % 2 === 1
}

export function buildAiShareCopyPrompt({
  toolId,
  locale,
  channel,
}: {
  toolId: QuotaToolId
  locale: "en"
  channel: ShareChannel
}) {
  const approvedBenefit = TOOL_SHARE_DETAILS[toolId].approvedBenefit
  return [
    `Tool ID: ${toolId}`,
    `Locale: ${locale}`,
    `Channel: ${channel}`,
    `Approved benefit: ${approvedBenefit}`,
    "Write one concise, editable share message using only that approved benefit.",
  ].join("\n")
}
