export const SOUNDCLOUD_SET_PREP_ENTRY = "soundcloud-set"
export const SOUNDCLOUD_SET_PREP_PATH = `/audio-toolkit/?entry=${SOUNDCLOUD_SET_PREP_ENTRY}`

export const isSoundCloudSetPrepEntry = (entry: string | undefined) =>
  entry === SOUNDCLOUD_SET_PREP_ENTRY
