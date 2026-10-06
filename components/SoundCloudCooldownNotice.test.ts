// @vitest-environment jsdom
import React, { act } from "react"
import { createRoot } from "react-dom/client"
import { expect, it, vi } from "vitest"
import { NextIntlClientProvider } from "next-intl"
import SoundCloudCooldownNotice from "./SoundCloudCooldownNotice"
import { soundCloudFailure } from "@/lib/soundcloud/client-errors"

it("renders a localized countdown and removes it when retry becomes available", async () => {
  vi.useFakeTimers()
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
  const container = document.createElement("div")
  const root = createRoot(container)
  try {
    await act(async () =>
      root.render(
        React.createElement(NextIntlClientProvider, {
          locale: "zh-cn",
          timeZone: "Asia/Singapore",
          messages: { SoundCloudService: { retry_after: "{seconds} 秒后可以重试" } },
          children: React.createElement(SoundCloudCooldownNotice),
        })
      )
    )
    expect(container.textContent).toBe("")
    await act(async () => {
      soundCloudFailure({ code: "service_rate_limited", message: "Busy", retryAfterSeconds: 2 })
    })
    expect(container.querySelector('[role="status"]')?.textContent).toBe("2 秒后可以重试")
    await act(async () => vi.advanceTimersByTimeAsync(1000))
    expect(container.textContent).toBe("1 秒后可以重试")
    await act(async () => vi.advanceTimersByTimeAsync(1000))
    expect(container.textContent).toBe("")
  } finally {
    await act(async () => root.unmount())
    vi.useRealTimers()
    vi.unstubAllGlobals()
  }
})
