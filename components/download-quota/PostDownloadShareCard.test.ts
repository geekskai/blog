import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import PostDownloadShareCard from "./PostDownloadShareCard"

function renderCard(isOpen: boolean) {
  return renderToStaticMarkup(
    createElement(PostDownloadShareCard, {
      isOpen,
      toolId: "soundcloud-track",
      onClose: () => undefined,
    })
  )
}

describe("PostDownloadShareCard", () => {
  it("renders a quiet optional-share toast after a download", () => {
    const markup = renderCard(true)

    expect(markup).toContain("Download complete")
    expect(markup).toContain("Sharing is optional and does not change your allowance.")
    expect(markup).toContain("Dismiss share options")
    expect(markup).toContain("Share via X")
    expect(markup).toContain("Share via WhatsApp")
    expect(markup).toContain("Share via Telegram")
    expect(markup).toContain("Share via Reddit")
    expect(markup).toContain("Copy link")
    expect(markup).toContain('role="region"')
    expect(markup).not.toContain("Share this tool")
  })

  it("renders nothing when dismissed", () => {
    expect(renderCard(false)).toBe("")
  })
})
