import { describe, expect, it, vi } from "vitest"
import { openTwitterComposer } from "./CopyAndTwitterShareButton"

describe("X share composer", () => {
  it("reports a blocked popup so quota reward is not granted", () => {
    const openWindow = vi.fn(() => null)
    expect(
      openTwitterComposer(
        "https://geekskai.com/tools/example/?ref=quota_share",
        "Useful tool",
        openWindow
      )
    ).toBe(false)
  })

  it("reports success only after the editable composer opens", () => {
    const popup = { opener: {} } as Window
    const openWindow = vi.fn(() => popup)
    expect(
      openTwitterComposer(
        "https://geekskai.com/tools/example/?ref=quota_share",
        "Useful tool",
        openWindow
      )
    ).toBe(true)
    expect(popup.opener).toBeNull()
  })
})
