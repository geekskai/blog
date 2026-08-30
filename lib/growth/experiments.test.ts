import { describe, expect, it } from "vitest"
import { getGrowthExperimentConfig } from "./experiments"

describe("growth experiment configuration", () => {
  it("keeps both experiments disabled by default", () => {
    expect(getGrowthExperimentConfig({})).toEqual({
      registrationCopyEnabled: false,
      shareChannelsEnabled: false,
    })
  })

  it("requires an exact true value for each independent switch", () => {
    expect(
      getGrowthExperimentConfig({
        GROWTH_REGISTRATION_EXPERIMENT_ENABLED: "true",
        GROWTH_SHARE_CHANNELS_ENABLED: "false",
      })
    ).toEqual({ registrationCopyEnabled: true, shareChannelsEnabled: false })

    expect(
      getGrowthExperimentConfig({
        GROWTH_REGISTRATION_EXPERIMENT_ENABLED: "TRUE",
        GROWTH_SHARE_CHANNELS_ENABLED: "true",
      })
    ).toEqual({ registrationCopyEnabled: false, shareChannelsEnabled: true })
  })
})
