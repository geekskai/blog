const SOUNDCLOUD_TRACK_URL_REGEX =
  /^https?:\/\/(www\.)?soundcloud\.com\/[^/?#]+\/[^/?#]+(?:\/s-[A-Za-z0-9]+)?\/?(?:[?#].*)?$/
const SOUNDCLOUD_SHORT_URL_REGEX = /^https?:\/\/on\.soundcloud\.com\/[A-Za-z0-9]+(?:[?#].*)?$/

export type SoundCloudUrlKind = "track" | "playlist" | "invalid"

export const normalizeSoundCloudUrl = (inputUrl: string): string => {
  try {
    const parsedUrl = new URL(inputUrl)
    if (parsedUrl.hostname === "m.soundcloud.com") {
      parsedUrl.hostname = "soundcloud.com"
    }
    return parsedUrl.toString()
  } catch {
    return inputUrl
  }
}

export const isValidSoundCloudPlaylistUrl = (url: string): boolean => {
  try {
    return new URL(url.trim()).pathname.includes("/sets/")
  } catch {
    return false
  }
}

export const isShortSoundCloudUrl = (url: string): boolean => {
  return SOUNDCLOUD_SHORT_URL_REGEX.test(url.trim())
}

export const isValidSoundCloudTrackUrl = (url: string): boolean => {
  const trimmedUrl = url.trim()
  const normalizedUrl = normalizeSoundCloudUrl(trimmedUrl)

  if (isValidSoundCloudPlaylistUrl(normalizedUrl)) {
    return false
  }

  if (isShortSoundCloudUrl(normalizedUrl)) {
    return true
  }

  return SOUNDCLOUD_TRACK_URL_REGEX.test(normalizedUrl)
}

export const detectSoundCloudUrlKind = (url: string): SoundCloudUrlKind => {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) {
    return "invalid"
  }

  const normalizedUrl = normalizeSoundCloudUrl(trimmedUrl)

  if (isValidSoundCloudPlaylistUrl(normalizedUrl)) {
    return "playlist"
  }

  if (isValidSoundCloudTrackUrl(normalizedUrl)) {
    return "track"
  }

  return "invalid"
}
