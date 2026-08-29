import { describe, expect, it } from "vitest"
import { canonicalStaticRoutes, getIndexedToolLocales } from "./sitemap-config"

describe("product sitemap", () => {
  it("includes canonical commercial and legal pages", () => {
    expect(canonicalStaticRoutes).toEqual(
      expect.arrayContaining(["pricing/", "audio-toolkit/", "privacy/", "terms/"])
    )
  })

  it("only emits canonical locale variants for confirmed tool content", () => {
    expect(getIndexedToolLocales("/tools/pdf-to-markdown/")).toEqual(["en"])
    expect(getIndexedToolLocales("/tools/morse-code-translator/")).toEqual(["en"])
    expect(getIndexedToolLocales("/tools/soundcloud-to-wav/")).toEqual(["en", "fr", "es", "de"])
  })
})
