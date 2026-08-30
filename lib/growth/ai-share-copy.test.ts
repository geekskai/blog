import { describe, expect, it } from "vitest"
import {
  buildAiShareCopyPrompt,
  getAiShareCopyConfig,
  isAiChallengerJourney,
} from "./ai-share-copy"

describe("AI share copy challenger", () => {
  it("stays disabled without an explicitly selected free model and gateway key", () => {
    expect(getAiShareCopyConfig({ GROWTH_SHARE_AI_ENABLED: "true" })).toEqual({ enabled: false })
    expect(
      getAiShareCopyConfig({
        GROWTH_SHARE_AI_ENABLED: "true",
        AI_GATEWAY_API_KEY: "configured",
        GROWTH_SHARE_AI_MODEL: "provider/paid-model",
      })
    ).toEqual({ enabled: false })
  })

  it("accepts only an explicitly enabled free model", () => {
    expect(
      getAiShareCopyConfig({
        GROWTH_SHARE_AI_ENABLED: "true",
        AI_GATEWAY_API_KEY: "configured",
        GROWTH_SHARE_AI_MODEL: "minimax/minimax-m2.7-free",
      })
    ).toEqual({
      enabled: true,
      model: "minimax/minimax-m2.7-free",
      variant: "ai-challenger-v1",
    })
  })

  it("builds input from only the approved dimensions and benefit", () => {
    const prompt = buildAiShareCopyPrompt({
      toolId: "youtube-shorts",
      locale: "en",
      channel: "reddit",
    })
    expect(prompt).toContain("Tool ID: youtube-shorts")
    expect(prompt).toContain("Locale: en")
    expect(prompt).toContain("Channel: reddit")
    expect(prompt).not.toMatch(/https?:\/\//)
    expect(prompt).not.toContain("user")
  })

  it("assigns journeys deterministically", () => {
    const journey = "019fd1e2-9b00-79f1-8b03-f09507529a0b"
    expect(isAiChallengerJourney(journey)).toBe(isAiChallengerJourney(journey))
  })
})
