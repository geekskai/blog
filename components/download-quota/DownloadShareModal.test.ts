import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import DownloadShareModal from "./DownloadShareModal"

function renderModal(canPromiseRegistrationBonus: boolean) {
  return renderToStaticMarkup(
    createElement(DownloadShareModal, {
      toolId: "soundcloud-track",
      isOpen: true,
      shareLink: "https://geekskai.com/tools/soundcloud-downloader/?ref=quota_share",
      canPromiseRegistrationBonus,
      onClose: () => undefined,
      onUnlock: () => undefined,
      onCreateAccount: () => undefined,
    })
  )
}

describe("DownloadShareModal registration action", () => {
  it("uses one fixed +7 registration message in server quota mode", () => {
    const markup = renderModal(true)

    expect(markup).toContain("Sign up for free — unlock 7 more today")
    expect(markup).toContain("return to this tool to unlock seven more downloads today")
    expect(markup).not.toContain("keep your progress + 7 downloads today")
  })

  it("does not promise extra downloads when server quota is unavailable", () => {
    const markup = renderModal(false)

    expect(markup).toContain("Create a free account")
    expect(markup).not.toContain("unlock 7 more today")
  })
})
