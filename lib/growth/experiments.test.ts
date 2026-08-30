import { describe, expect, it } from "vitest"
import { getGrowthExperimentConfig } from "./experiments"

describe("growth experiment configuration", () => {
  it("keeps post-download sharing disabled by default", () => {
    expect(getGrowthExperimentConfig({})).toEqual({
      shareChannelsEnabled: false,
    })
  })

  it("requires an exact true value for the share switch", () => {
    expect(
      getGrowthExperimentConfig({
        GROWTH_SHARE_CHANNELS_ENABLED: "true",
      })
    ).toEqual({ shareChannelsEnabled: true })

    expect(getGrowthExperimentConfig({ GROWTH_SHARE_CHANNELS_ENABLED: "TRUE" })).toEqual({
      shareChannelsEnabled: false,
    })
  })
})
