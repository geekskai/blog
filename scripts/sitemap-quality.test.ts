import { afterEach, describe, expect, it, vi } from "vitest"
import { auditUrl } from "./sitemap-quality.mjs"
import {
  assessRoute,
  classifyUrl,
  compareAlternateChannels,
  isBlockedResponse,
  noindexHreflangStatus,
  normalizeUrl,
  parseHttpLinkAlternates,
  parseRobotsTxt,
  parseSitemapEntries,
} from "./sitemap-quality-utils.mjs"

describe("sitemap quality audit helpers", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("classifies by the first route segment after a supported locale", () => {
    expect(classifyUrl("https://geekskai.com/blog/tools/seo-guide/")).toBe("blog")
    expect(classifyUrl("https://geekskai.com/fr/tools/vin-decoder/")).toBe("tool")
    expect(classifyUrl("https://geekskai.com/projects/tools/")).toBe("site-page")
  })

  it("keeps functional parameters and removes tracking parameters only", () => {
    expect(normalizeUrl("https://example.com/share/?id=42&utm_source=test#card")).toBe(
      "https://example.com/share/?id=42"
    )
    expect(normalizeUrl("https://example.com/share/?id=42")).not.toBe(
      normalizeUrl("https://example.com/share/?id=43")
    )
  })

  it("accepts an explicitly expected 308 fallback and blocks network-limited responses", () => {
    expect(
      assessRoute({
        firstStatus: 308,
        finalStatus: 200,
        finalUrl: "https://geekskai.com/tools/example/",
        expected: { redirectTo: "https://geekskai.com/tools/example/" },
      })
    ).toBe("PASS")
    expect(isBlockedResponse(403)).toBe(true)
    expect(isBlockedResponse(429)).toBe(true)
    expect(isBlockedResponse(503)).toBe(true)
    expect(assessRoute({ firstStatus: 403, finalStatus: 403 })).toBe("BLOCKED")
  })

  it("detects inconsistent HTML, HTTP, and sitemap hreflang channels", () => {
    const html = [{ language: "en", url: "https://example.com/page/" }]
    const http = [{ language: "en", url: "https://example.com/page/" }]
    expect(compareAlternateChannels({ html, http, sitemap: [] })).toBe("consistent")
    expect(
      compareAlternateChannels({
        html,
        http,
        sitemap: [{ language: "fr", url: "https://example.com/fr/page/" }],
      })
    ).toBe("inconsistent")
  })

  it("parses HTTP Link and sitemap hreflang declarations", () => {
    expect(
      parseHttpLinkAlternates(
        '<https://example.com/page/>; rel="alternate"; hreflang="en", <https://example.com/fr/page/>; rel="alternate"; hreflang="fr"',
        "https://example.com/page/"
      )
    ).toEqual([
      { language: "en", url: "https://example.com/page/" },
      { language: "fr", url: "https://example.com/fr/page/" },
    ])
    expect(
      parseSitemapEntries(
        '<url><loc>https://example.com/page/</loc><xhtml:link rel="alternate" hreflang="en" href="https://example.com/page/" /></url>',
        "https://example.com/sitemap.xml"
      )[0].alternates
    ).toEqual([{ language: "en", url: "https://example.com/page/" }])
  })

  it("flags hreflang targets that are noindex or blocked", () => {
    const alternates = [{ language: "fr", url: "https://example.com/fr/page/" }]
    expect(
      noindexHreflangStatus(
        alternates,
        new Map([[normalizeUrl(alternates[0].url), { status: 200, noindex: true }]])
      )
    ).toBe("yes")
    expect(noindexHreflangStatus(alternates, new Map())).toBe("BLOCKED")
  })

  it("honors specific crawler rules and falls back to wildcard rules", () => {
    const robots = "User-agent: *\nDisallow: /private/\nUser-agent: GPTBot\nAllow: /private/public/"
    expect(parseRobotsTxt(robots, "/private/data/", "Googlebot")).toBe(false)
    expect(parseRobotsTxt(robots, "/private/public/info/", "GPTBot")).toBe(true)
    expect(parseRobotsTxt(robots, "/open/", "PerplexityBot")).toBe(true)
  })

  it("passes an expected redirect after recording the first hop and final response", async () => {
    const source = "https://geekskai.com/fr/tools/example/"
    const target = "https://geekskai.com/tools/example/"
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL) => {
        const url = String(input)
        if (url.endsWith("/robots.txt"))
          return new Response("User-agent: *\nAllow: /", { status: 200 })
        if (url === source)
          return new Response(null, { status: 308, headers: { location: target } })
        return new Response(
          `<html lang="en"><head><link rel="canonical" href="${target}"></head><body><main>Example tool</main></body></html>`,
          {
            status: 200,
            headers: { "content-type": "text/html" },
          }
        )
      })
    )

    const result = await auditUrl(
      { url: source, expected: { redirectTo: target } },
      { entries: new Map(), status: "PASS" }
    )
    expect(result.first_status).toBe(308)
    expect(result.status).toBe(200)
    expect(result.redirect_chain).toContain("308")
    expect(result.verdict).toBe("PASS")
  })

  it("fails when final HTML, HTTP, and sitemap language declarations disagree", async () => {
    const page = "https://geekskai.com/tools/example/"
    const french = "https://geekskai.com/fr/tools/example/"
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL) => {
        const url = String(input)
        if (url.endsWith("/robots.txt"))
          return new Response("User-agent: *\nAllow: /", { status: 200 })
        return new Response(
          `<html lang="en"><head><link rel="canonical" href="${page}"><link rel="alternate" hreflang="en" href="${page}"><link rel="alternate" hreflang="fr" href="${french}"></head><body><main>Example tool</main></body></html>`,
          {
            status: 200,
            headers: {
              "content-type": "text/html",
              link: `<${page}>; rel="alternate"; hreflang="en"`,
            },
          }
        )
      })
    )
    const result = await auditUrl(
      { url: page, expected: {} },
      {
        status: "PASS",
        entries: new Map([
          [normalizeUrl(page), { url: page, alternates: [{ language: "en", url: page }] }],
        ]),
      }
    )
    expect(result.hreflang_channels_consistent).toBe("inconsistent")
    expect(result.verdict).toBe("FAIL")
  })

  it("accepts an expected noindex page outside the sitemap and blocks 403 responses", async () => {
    const page = "https://geekskai.com/tools/share/"
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input)
      if (url.endsWith("/robots.txt"))
        return new Response("User-agent: *\nAllow: /", { status: 200 })
      if (url.endsWith("/tools/share/"))
        return new Response(
          `<html><head><meta name="robots" content="noindex,follow"><link rel="canonical" href="${page}"></head><body><main>Share result</main></body></html>`,
          { status: 200, headers: { "content-type": "text/html" } }
        )
      return new Response("Forbidden", { status: 403 })
    })
    vi.stubGlobal("fetch", fetchMock)
    const data = { entries: new Map(), status: "PASS" }
    const noindexResult = await auditUrl(
      { url: page, expected: { indexable: false, hreflang: false, sitemap: false } },
      data
    )
    const forbiddenResult = await auditUrl(
      { url: "https://geekskai.com/tools/limited/", expected: {} },
      data
    )
    expect(noindexResult.in_sitemap).toBe("no")
    expect(noindexResult.verdict).toBe("PASS")
    expect(forbiddenResult.verdict).toBe("BLOCKED")
  })

  it("reports network errors as BLOCKED instead of SEO failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("fetch failed")
      })
    )
    const result = await auditUrl(
      { url: "https://geekskai.com/tools/unreachable/", expected: {} },
      { entries: new Map(), status: "PASS" }
    )
    expect(result.verdict).toBe("BLOCKED")
    expect(result.error).toBe("fetch failed")
  })
})
