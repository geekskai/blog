export const soundCloudGrowthLocales = ["en", "fr", "es", "de"] as const

export type SoundCloudToolKey = "hub" | "downloader" | "mp3" | "wav" | "playlist" | "artwork"

export type SoundCloudToolLink = {
  key: Exclude<SoundCloudToolKey, "hub">
  href: string
}

export const soundCloudToolLinks: SoundCloudToolLink[] = [
  { key: "downloader", href: "/tools/soundcloud-downloader/" },
  { key: "mp3", href: "/tools/soundcloud-to-mp3/" },
  { key: "wav", href: "/tools/soundcloud-to-wav/" },
  { key: "playlist", href: "/tools/soundcloud-playlist-downloader/" },
  { key: "artwork", href: "/tools/soundcloud-artwork-downloader/" },
]

export const soundCloudHubPath = "/tools/soundcloud/"

export function isSoundCloudToolPath(path: string) {
  return soundCloudToolLinks.some((tool) => path.includes(tool.href))
}

export function isSoundCloudGrowthLocale(
  locale: string
): locale is (typeof soundCloudGrowthLocales)[number] {
  return soundCloudGrowthLocales.includes(locale as (typeof soundCloudGrowthLocales)[number])
}
