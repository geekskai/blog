import { describe, expect, it } from "vitest"
import {
  getCanonicalToolRedirectPath,
  getIndexedToolLocales,
  getToolLinkLocale,
  isToolLocaleIndexed,
} from "./sitemap-config"

describe("tool locale indexing policy", () => {
  it("keeps PDF and Morse multilingual", () => {
    expect(getIndexedToolLocales("/tools/pdf-to-markdown/")).toEqual([
      "en",
      "ar",
      "de",
      "fr",
      "es",
      "ja",
      "ko",
      "no",
      "zh-cn",
      "da",
    ])
    expect(getIndexedToolLocales("tools/morse-code-translator")).toHaveLength(10)
    expect(isToolLocaleIndexed("/tools/pdf-to-markdown/", "de")).toBe(true)
  })

  it("indexes SoundCloud pages in every supported locale", () => {
    expect(getIndexedToolLocales("/tools/soundcloud-to-mp3/")).toEqual([
      "en",
      "ar",
      "de",
      "fr",
      "es",
      "ja",
      "ko",
      "no",
      "zh-cn",
      "da",
    ])
    expect(getIndexedToolLocales("/tools/soundcloud/")).toHaveLength(10)
  })

  it("redirects unsupported localized tool paths to the English canonical", () => {
    expect(getCanonicalToolRedirectPath("/de/tools/pdf-to-markdown/")).toBeNull()
    expect(getCanonicalToolRedirectPath("/ar/tools/soundcloud-to-wav/")).toBeNull()
    expect(getCanonicalToolRedirectPath("/fr/tools/soundcloud-to-wav/")).toBeNull()
    expect(getCanonicalToolRedirectPath("/de/tools/html-to-markdown/")).toBeNull()
  })

  it("points unsupported localized catalog links directly at English", () => {
    expect(getToolLinkLocale("/tools/morse-code-translator/", "ko")).toBeUndefined()
    expect(getToolLinkLocale("/tools/morse-code-translator/", "en")).toBeUndefined()
    expect(getToolLinkLocale("/tools/html-to-markdown/", "ko")).toBeUndefined()
  })

  it("keeps the newly enumerated VIN and pixels routes in all supported locales", () => {
    expect(getIndexedToolLocales("/tools/pixels-to-inches/")).toHaveLength(10)
    expect(getIndexedToolLocales("/tools/vin-decoder/bmw/")).toHaveLength(10)
    expect(getIndexedToolLocales("/tools/vin-decoder/vehicle-types/rv/")).toHaveLength(10)
  })
})
