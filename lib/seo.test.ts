import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { CREDIT_CATALOG } from "./billing/catalog"
import { buildPageSchema, buildSiteSchema, serializeJsonLd } from "./seo"

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("commercial SEO content", () => {
  it("keeps machine-readable pricing aligned with PayPal and the package catalog", () => {
    const pricing = readProjectFile("public/pricing.txt")
    const llms = readProjectFile("public/llms.txt")
    const combined = `${pricing}\n${llms}`

    expect(combined).toContain("PayPal Business")
    expect(combined).not.toMatch(/checkout is (currently )?unavailable/i)
    expect(combined).not.toContain("payment onboarding and testing")
    expect(pricing).toContain(`Price: $${CREDIT_CATALOG.payg480.price} one-time`)
    expect(pricing).toContain(`Monthly: $${CREDIT_CATALOG.regularMonthly.price} per month`)
    expect(pricing).toContain(`Credits: ${CREDIT_CATALOG.payg480.credits}`)
    expect(pricing).toContain(`Credits: ${CREDIT_CATALOG.regularMonthly.credits.toLocaleString()}`)
  })

  it("keeps the LUFS guide aligned with the live PayPal offer boundary", () => {
    const article = readProjectFile("data/blog/audio/how-to-normalize-audio-loudness-lufs.mdx")

    expect(article).toContain('lastmod: "2026-08-24"')
    expect(article).toContain("available through secure PayPal checkout")
    expect(article).toContain("public third-party downloader allowances remain separate")
    expect(article).not.toContain("paid batch checkout remains unavailable")
  })
})

describe("structured data ownership", () => {
  it("keeps site-level schema limited to Organization and WebSite", () => {
    const schema = buildSiteSchema({
      description: "Test description",
      inLanguage: "en-US",
      searchUrl: "https://geekskai.com/tools/",
    })

    expect(schema["@graph"].map((entry) => entry["@type"])).toEqual(["Organization", "WebSite"])
  })

  it("builds page-specific IDs and breadcrumbs from the canonical URL", () => {
    const url = "https://geekskai.com/pricing/"
    const schema = buildPageSchema({
      url,
      name: "Pricing",
      description: "Pricing description",
      breadcrumbs: [
        { name: "Home", url: "https://geekskai.com/" },
        { name: "Pricing", url },
      ],
    })

    expect(schema["@graph"][0]).toMatchObject({
      "@id": `${url}#webpage`,
      url,
      breadcrumb: { "@id": `${url}#breadcrumb` },
    })
    expect(schema["@graph"][1]).toMatchObject({
      "@id": `${url}#breadcrumb`,
      itemListElement: expect.arrayContaining([
        expect.objectContaining({ position: 2, name: "Pricing", item: url }),
      ]),
    })
  })

  it("escapes markup before embedding JSON-LD", () => {
    expect(serializeJsonLd({ value: "</script>" })).toContain("\\u003c/script>")
  })
})

describe("commercial metadata regressions", () => {
  it("owns social metadata and hreflang for English-only product routes", () => {
    const pricing = readProjectFile("app/[locale]/pricing/page.tsx")
    const audioToolkit = readProjectFile("app/[locale]/audio-toolkit/page.tsx")
    const proxy = readProjectFile("proxy.ts")

    expect(pricing).toContain("twitter: {")
    expect(pricing).toContain("/pricing/opengraph-image")
    expect(audioToolkit).toContain("openGraph: {")
    expect(audioToolkit).toContain("twitter: {")
    expect(audioToolkit).toContain("/audio-toolkit/opengraph-image")
    expect(proxy).toContain('new Set(["pricing", "audio-toolkit", "about"])')
    expect(proxy).toContain('response.headers.delete("Link")')
  })

  it("links article authors to the About profile instead of an avatar", () => {
    const articlePage = readProjectFile("app/blog/[...slug]/page.tsx")

    expect(articlePage).toContain("url: `${siteMetadata.siteUrl}/about/`")
    expect(articlePage).not.toContain("siteMetadata.siteUrl + author.avatar")
  })

  it("keeps CollectionPage schema on the tools index instead of every tool detail", () => {
    const toolsLayout = readProjectFile("app/[locale]/tools/layout.tsx")
    const toolsIndex = readProjectFile("app/[locale]/tools/page.tsx")

    expect(toolsLayout).not.toContain('"@type": "CollectionPage"')
    expect(toolsIndex).toContain('"@type": "CollectionPage"')
    expect(toolsIndex).toContain("serializeJsonLd(structuredData)")
  })

  it("does not publish repeated placeholder descriptions in the tool catalog", () => {
    const tools = readProjectFile("data/toolsData.ts")

    expect(tools).not.toMatch(/([^.!?]+[.!?]) \1 \1/)
    expect(tools).not.toContain("for your SoundCloud. SoundCloud")
  })
})
