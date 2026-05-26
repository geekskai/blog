import { lastModifiedToIso } from "@/lib/youtube-downloader-schema"

export {
  type DownloaderFaqItem as ShotsFaqItem,
  type DownloaderHowToSchemaInput as ShotsHowToSchemaInput,
  buildDownloaderFaqItems,
  buildDownloaderFaqItemsWithIds,
  buildDownloaderHowToInput,
  generateDownloaderHowToSchema as generateShotsHowToSchema,
  lastModifiedToIso,
} from "@/lib/youtube-downloader-schema"

export const SHOTS_FAQ_COUNT = 8
export const SHOTS_LAST_MODIFIED = "2026-05-26"
export const SHOTS_LAST_MODIFIED_ISO = lastModifiedToIso(SHOTS_LAST_MODIFIED)
