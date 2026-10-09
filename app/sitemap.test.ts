import { describe, expect, it } from "vitest"
import { supportedLocales } from "./i18n/routing"
import { buildLanguageAlternates, getLocalizedUrl } from "./i18n/urls"
import { SUPPORTED_BRAND_SLUGS } from "./[locale]/tools/vin-decoder/types"
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

  it("includes the current localized pixels and VIN routes plus the English comparison page", () => {
    const siteUrl = "https://geekskai.com"
    const pixelsPath = "/tools/pixels-to-inches/"
    const brandUrls = SUPPORTED_BRAND_SLUGS.flatMap((brand) =>
      supportedLocales.map((locale) => getLocalizedUrl(siteUrl, locale, `/tools/vin-decoder/${brand}/`))
    )
    const typeUrls = ["motorcycle", "rv", "trailer", "classic-car"].flatMap((type) =>
      supportedLocales.map((locale) => getLocalizedUrl(siteUrl, locale, `/tools/vin-decoder/vehicle-types/${type}/`))
    )
    const urls = [
      ...supportedLocales.map((locale) => getLocalizedUrl(siteUrl, locale, pixelsPath)),
      ...brandUrls,
      ...typeUrls,
      getLocalizedUrl(siteUrl, "en", "/tools/vin-decoder/vin-decoder-vs-vin-check/"),
    ]
    expect(new Set(urls).size).toBe(151)
    expect(urls).toContain("https://geekskai.com/tools/pixels-to-inches/")
    expect(urls).toContain("https://geekskai.com/ja/tools/pixels-to-inches/")
    expect(urls).toContain("https://geekskai.com/tools/vin-decoder/bmw/")
    expect(urls).toContain("https://geekskai.com/de/tools/vin-decoder/vehicle-types/rv/")
    expect(urls).toContain("https://geekskai.com/tools/vin-decoder/vin-decoder-vs-vin-check/")
    expect(urls).not.toContain("https://geekskai.com/ar/tools/vin-decoder/vin-decoder-vs-vin-check/")
    expect(buildLanguageAlternates(siteUrl, pixelsPath)).toHaveProperty("x-default", "https://geekskai.com/tools/pixels-to-inches/")
    expect(getIndexedToolLocales("/tools/pdf-to-markdown/")).toEqual(["en"])
  })
})
