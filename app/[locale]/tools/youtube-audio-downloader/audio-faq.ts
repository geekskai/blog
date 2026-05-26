import { lastModifiedToIso } from "@/lib/youtube-downloader-schema"

export {
  type DownloaderFaqItem as AudioFaqItem,
  type DownloaderHowToSchemaInput as AudioHowToSchemaInput,
  buildDownloaderFaqItems,
  buildDownloaderFaqItemsWithIds,
  buildDownloaderHowToInput,
  generateDownloaderHowToSchema as generateAudioHowToSchema,
  lastModifiedToIso,
} from "@/lib/youtube-downloader-schema"

export const AUDIO_FAQ_COUNT = 4
export const AUDIO_LAST_MODIFIED = "2026-05-26"
export const AUDIO_LAST_MODIFIED_ISO = lastModifiedToIso(AUDIO_LAST_MODIFIED)
