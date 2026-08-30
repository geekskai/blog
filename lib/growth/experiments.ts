export type GrowthExperimentConfig = {
  registrationCopyEnabled: boolean
  shareChannelsEnabled: boolean
}

export function getGrowthExperimentConfig(
  env: NodeJS.ProcessEnv = process.env
): GrowthExperimentConfig {
  return {
    registrationCopyEnabled: env.GROWTH_REGISTRATION_EXPERIMENT_ENABLED === "true",
    shareChannelsEnabled: env.GROWTH_SHARE_CHANNELS_ENABLED === "true",
  }
}
