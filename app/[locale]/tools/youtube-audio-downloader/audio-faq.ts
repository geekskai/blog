import { lastModifiedToIso } from "@/lib/youtube-downloader-schema"

export {
  type DownloaderFaqItem as AudioFaqItem,
  buildDownloaderFaqItems,
  buildDownloaderFaqItemsWithIds,
  lastModifiedToIso,
} from "@/lib/youtube-downloader-schema"

export const AUDIO_FAQ_COUNT = 4
export const AUDIO_LAST_MODIFIED = "2026-06-19"
export const AUDIO_LAST_MODIFIED_ISO = lastModifiedToIso(AUDIO_LAST_MODIFIED)
