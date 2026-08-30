import type { QuotaToolId } from "@/lib/download-quota/config"

export const SHARE_CHANNELS = ["x", "whatsapp", "telegram", "reddit", "copy"] as const
export type ShareChannel = (typeof SHARE_CHANNELS)[number]
export type ShareSurface = "quota_gate" | "post_download"
export type ShareCopyMode = "template" | "ai"

export type ShareCopy = {
  title?: string
  text: string
}

type ToolShareDetails = {
  name: string
  approvedBenefit: string
}

export const TOOL_SHARE_DETAILS: Record<QuotaToolId, ToolShareDetails> = {
  "bandcamp-album": {
    name: "Bandcamp Album Downloader",
    approvedBenefit: "prepare available Bandcamp album tracks for download",
  },
  "bandcamp-to-mp3": {
    name: "Bandcamp to MP3",
    approvedBenefit: "prepare an available Bandcamp track as an MP3 download",
  },
  "bandcamp-track": {
    name: "Bandcamp Downloader",
    approvedBenefit: "prepare an available Bandcamp track for download",
  },
  "soundcloud-artwork": {
    name: "SoundCloud Artwork Downloader",
    approvedBenefit: "save the artwork available for a SoundCloud track",
  },
  "soundcloud-playlist": {
    name: "SoundCloud Playlist Downloader",
    approvedBenefit: "prepare available tracks from a SoundCloud playlist",
  },
  "soundcloud-track": {
    name: "SoundCloud Downloader",
    approvedBenefit: "prepare an available SoundCloud track for download",
  },
  "youtube-audio": {
    name: "YouTube Audio Downloader",
    approvedBenefit: "prepare available YouTube audio for download",
  },
  "youtube-shorts": {
    name: "YouTube Shorts Downloader",
    approvedBenefit: "prepare an available YouTube Short as a video download",
  },
  "youtube-video": {
    name: "YouTube Video Downloader",
    approvedBenefit: "prepare an available YouTube video for download",
  },
}

export function isShareChannel(value: unknown): value is ShareChannel {
  return typeof value === "string" && SHARE_CHANNELS.includes(value as ShareChannel)
}

export function isShareSurface(value: unknown): value is ShareSurface {
  return value === "quota_gate" || value === "post_download"
}

export function isShareCopyMode(value: unknown): value is ShareCopyMode {
  return value === "template" || value === "ai"
}

export function cleanGrowthShareUrl(value: string, shareId?: string) {
  const parsed = new URL(value, "https://geekskai.com")
  const result = new URL(parsed.pathname, parsed.origin)
  result.searchParams.set("ref", "quota_share")
  if (shareId) result.searchParams.set("share_id", shareId)
  return result.toString()
}

export function getTemplateShareCopy(
  toolId: QuotaToolId,
  channel: ShareChannel,
  surface: ShareSurface
): ShareCopy {
  const details = TOOL_SHARE_DETAILS[toolId]
  const context = surface === "quota_gate" ? "If you need it too," : "For a similar task,"
  const text = `${context} Geekskai's ${details.name} can ${details.approvedBenefit}. Review the source and usage rights before downloading.`

  if (channel === "reddit") {
    return {
      title: `A simple ${details.name} for ${details.approvedBenefit}`,
      text: `Geekskai provides a browser-based ${details.name} that can ${details.approvedBenefit}. Check the source's terms and make sure you have permission before downloading.`,
    }
  }

  return { text }
}

export function buildShareIntentUrl(
  channel: Exclude<ShareChannel, "copy">,
  url: string,
  copy: ShareCopy
) {
  const target =
    channel === "x"
      ? new URL("https://twitter.com/intent/tweet")
      : channel === "whatsapp"
        ? new URL("https://wa.me/")
        : channel === "telegram"
          ? new URL("https://t.me/share/url")
          : new URL("https://www.reddit.com/submit")

  if (channel === "x") {
    target.searchParams.set("text", copy.text)
    target.searchParams.set("url", url)
  } else if (channel === "whatsapp") {
    target.searchParams.set("text", `${copy.text} ${url}`)
  } else if (channel === "telegram") {
    target.searchParams.set("url", url)
    target.searchParams.set("text", copy.text)
  } else {
    target.searchParams.set("url", url)
    target.searchParams.set("title", copy.title ?? copy.text)
    target.searchParams.set("text", copy.text)
  }

  return target.toString()
}
