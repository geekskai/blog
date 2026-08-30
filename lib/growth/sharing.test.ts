import { describe, expect, it } from "vitest"
import { QUOTA_TOOL_IDS } from "@/lib/download-quota/config"
import {
  buildShareIntentUrl,
  cleanGrowthShareUrl,
  getTemplateShareCopy,
  isShareChannel,
} from "./sharing"

describe("growth sharing", () => {
  it("strips media input, arbitrary query parameters, and hashes from shared URLs", () => {
    expect(
      cleanGrowthShareUrl(
        "https://geekskai.com/tools/youtube-video-downloader/?url=https%3A%2F%2Fyoutu.be%2Fx&quality=1080p#result",
        "019fd1e2-9b00-79f1-8b03-f09507529a0b"
      )
    ).toBe(
      "https://geekskai.com/tools/youtube-video-downloader/?ref=quota_share&share_id=019fd1e2-9b00-79f1-8b03-f09507529a0b"
    )
  })

  it("provides honest, bounded templates for every tool and channel", () => {
    for (const toolId of QUOTA_TOOL_IDS) {
      for (const channel of ["x", "whatsapp", "telegram", "reddit", "copy"] as const) {
        const copy = getTemplateShareCopy(toolId, channel, "post_download")
        expect(copy.text.length).toBeGreaterThan(20)
        expect(copy.text.length).toBeLessThanOrEqual(channel === "x" ? 240 : 500)
        expect(copy.text).not.toMatch(/saved my day|I (used|tried|tested|verified|downloaded)/i)
        if (channel === "reddit") {
          expect(copy.title).toBeTruthy()
          expect(copy.title!.length).toBeLessThanOrEqual(180)
        }
      }
    }
  })

  it("recognizes only supported share channels", () => {
    expect(isShareChannel("reddit")).toBe(true)
    expect(isShareChannel("facebook")).toBe(false)
  })

  it("opens editable platform composers and never auto-selects a subreddit", () => {
    const target = buildShareIntentUrl(
      "reddit",
      "https://geekskai.com/tools/example/?ref=quota_share",
      { title: "Useful tool", text: "A concise description" }
    )
    const parsed = new URL(target)
    expect(parsed.origin + parsed.pathname).toBe("https://www.reddit.com/submit")
    expect(parsed.searchParams.get("title")).toBe("Useful tool")
    expect(parsed.searchParams.has("sr")).toBe(false)
  })

  it("builds editable X, WhatsApp, and Telegram share intents", () => {
    const shareUrl = "https://geekskai.com/tools/example/?ref=quota_share&share_id=share-123"
    const copy = { text: "A concise and useful tool description." }

    const x = new URL(buildShareIntentUrl("x", shareUrl, copy))
    expect(x.origin + x.pathname).toBe("https://twitter.com/intent/tweet")
    expect(x.searchParams.get("url")).toBe(shareUrl)
    expect(x.searchParams.get("text")).toBe(copy.text)

    const whatsapp = new URL(buildShareIntentUrl("whatsapp", shareUrl, copy))
    expect(whatsapp.origin).toBe("https://wa.me")
    expect(whatsapp.searchParams.get("text")).toBe(`${copy.text} ${shareUrl}`)

    const telegram = new URL(buildShareIntentUrl("telegram", shareUrl, copy))
    expect(telegram.origin + telegram.pathname).toBe("https://t.me/share/url")
    expect(telegram.searchParams.get("url")).toBe(shareUrl)
    expect(telegram.searchParams.get("text")).toBe(copy.text)
  })
})
