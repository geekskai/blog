import { lastModifiedToIso } from "@/lib/youtube-downloader-schema"

export {
  type DownloaderFaqItem as VideoFaqItem,
  type DownloaderHowToSchemaInput as VideoHowToSchemaInput,
  buildDownloaderFaqItems,
  buildDownloaderFaqItemsWithIds,
  buildDownloaderHowToInput,
  generateDownloaderHowToSchema as generateVideoHowToSchema,
  lastModifiedToIso,
} from "@/lib/youtube-downloader-schema"

export const VIDEO_FAQ_COUNT = 8
export const VIDEO_LAST_MODIFIED = "2026-05-26"
export const VIDEO_LAST_MODIFIED_ISO = lastModifiedToIso(VIDEO_LAST_MODIFIED)
