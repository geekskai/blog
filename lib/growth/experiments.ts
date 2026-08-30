export type GrowthExperimentConfig = {
  shareChannelsEnabled: boolean
}

export function getGrowthExperimentConfig(
  env: NodeJS.ProcessEnv = process.env
): GrowthExperimentConfig {
  return {
    shareChannelsEnabled: env.GROWTH_SHARE_CHANNELS_ENABLED === "true",
  }
}
