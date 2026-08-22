import { afterEach, describe, expect, it, vi } from "vitest"

import { trackToolEvent } from "./tool-events"

describe("trackToolEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("uses gtag without duplicating the event in dataLayer", () => {
    const dataLayer: Array<Record<string, unknown>> = []
    const gtag = vi.fn()
    const umamiTrack = vi.fn()

    vi.stubGlobal("window", {
      dataLayer,
      gtag,
      umami: { track: umamiTrack },
    })

    const properties = {
      tool_id: "discord-time-converter",
      action: "batch_conversion",
      format: "F",
      result_count: 7,
    }

    trackToolEvent("tool_succeeded", properties)

    expect(gtag).toHaveBeenCalledWith("event", "tool_succeeded", properties)
    expect(dataLayer).toEqual([])
    expect(umamiTrack).toHaveBeenCalledWith("tool_succeeded", properties)
  })

  it("falls back to dataLayer when gtag is unavailable", () => {
    const dataLayer: Array<Record<string, unknown>> = []

    vi.stubGlobal("window", { dataLayer })

    trackToolEvent("tool_result_copied", {
      tool_id: "discord-timestamp-generator",
      action: "copy_timestamp",
      format: "R",
    })

    expect(dataLayer).toEqual([
      {
        event: "tool_result_copied",
        tool_id: "discord-timestamp-generator",
        action: "copy_timestamp",
        format: "R",
      },
    ])
  })

  it("does nothing during server rendering", () => {
    vi.stubGlobal("window", undefined)

    expect(() =>
      trackToolEvent("tool_started", {
        tool_id: "discord-time-converter",
        action: "convert",
      })
    ).not.toThrow()
  })
})
