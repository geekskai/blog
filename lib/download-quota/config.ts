export const QUOTA_TOOL_IDS = [
  "bandcamp-album",
  "bandcamp-to-mp3",
  "bandcamp-track",
  "soundcloud-artwork",
  "soundcloud-playlist",
  "soundcloud-track",
  "youtube-audio",
  "youtube-video",
] as const

export type QuotaToolId = (typeof QUOTA_TOOL_IDS)[number]

export function isQuotaToolId(value: unknown): value is QuotaToolId {
  return typeof value === "string" && QUOTA_TOOL_IDS.includes(value as QuotaToolId)
}

export function isServerQuotaEnabled(toolId: QuotaToolId): boolean {
  if (process.env.DOWNLOAD_QUOTA_SERVER_ENABLED !== "true") return false

  const configured = process.env.DOWNLOAD_QUOTA_ENABLED_TOOLS?.trim()
  if (!configured || configured === "*") return true

  return configured
    .split(",")
    .map((value) => value.trim())
    .includes(toolId)
}
