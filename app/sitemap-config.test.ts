import { describe, expect, it } from "vitest"
import {
  getCanonicalToolRedirectPath,
  getIndexedToolLocales,
  getToolLinkLocale,
  isToolLocaleIndexed,
} from "./sitemap-config"

describe("tool locale indexing policy", () => {
  it("keeps PDF and Morse canonical to English", () => {
    expect(getIndexedToolLocales("/tools/pdf-to-markdown/")).toEqual(["en"])
    expect(getIndexedToolLocales("tools/morse-code-translator")).toEqual(["en"])
    expect(isToolLocaleIndexed("/tools/pdf-to-markdown/", "de")).toBe(false)
  })

  it("keeps SoundCloud pages limited to the verified growth locales", () => {
    expect(getIndexedToolLocales("/tools/soundcloud-to-mp3/")).toEqual(["en", "fr", "es", "de"])
    expect(getIndexedToolLocales("/tools/soundcloud/")).toEqual(["en", "fr", "es", "de"])
  })

  it("redirects unsupported localized tool paths to the English canonical", () => {
    expect(getCanonicalToolRedirectPath("/de/tools/pdf-to-markdown/")).toBe(
      "/tools/pdf-to-markdown/"
    )
    expect(getCanonicalToolRedirectPath("/ar/tools/soundcloud-to-wav/")).toBe(
      "/tools/soundcloud-to-wav/"
    )
    expect(getCanonicalToolRedirectPath("/fr/tools/soundcloud-to-wav/")).toBeNull()
    expect(getCanonicalToolRedirectPath("/de/tools/html-to-markdown/")).toBeNull()
  })

  it("points unsupported localized catalog links directly at English", () => {
    expect(getToolLinkLocale("/tools/morse-code-translator/", "ko")).toBe("en")
    expect(getToolLinkLocale("/tools/morse-code-translator/", "en")).toBeUndefined()
    expect(getToolLinkLocale("/tools/html-to-markdown/", "ko")).toBeUndefined()
  })
})
