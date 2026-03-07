import React from "react"
import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

interface VinCompareLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export const VIN_SEO_SHARED = {
  siteUrl: "https://geekskai.com",
  siteName: "GeeksKai",
  category: "Automotive Tools",
  ogImage: "/static/images/og/vin-decoder.png",
  publishedAt: "2026-03-07T00:00:00.000Z",
  lastModifiedAt: "2026-03-07T00:00:00.000Z",
}

export function buildLocalizedUrl(path: string, locale: string) {
  const normalizedPath = path.replace(/^\/+/, "")
  return `${VIN_SEO_SHARED.siteUrl}${locale === "en" ? "" : `/${locale}`}/${normalizedPath}`
}

export function buildLanguageAlternates(path: string) {
  const normalizedPath = path.replace(/^\/+/, "")
  const languages: Record<string, string> = {
    "x-default": `${VIN_SEO_SHARED.siteUrl}/${normalizedPath}`,
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = buildLocalizedUrl(normalizedPath, locale)
  })

  return languages
}

export function getVinSeoLocale(locale: string) {
  return locale === "en" ? "en_US" : locale.replace("-", "_")
}

export function getVinSeoIndexing(locale: string) {
  const shouldIndex = locale === "en"
  return {
    shouldIndex,
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  }
}

export function getVinSeoOther(locale: string, lastModified: Date) {
  return {
    "last-modified": lastModified.toISOString(),
    "update-frequency": "monthly",
    "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "content-language-status": locale === "en" ? "primary-en" : "fallback-en",
    "geo-compliance-version": "2026-03-v1",
  }
}

export function safeTranslate(
  t: (key: string, values?: Record<string, string | number>) => string,
  key: string,
  fallback: string,
  values?: Record<string, string | number>
) {
  try {
    return t(key, values)
  } catch {
    return fallback
  }
}

interface CompareMetadataInput {
  locale: string
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  ogImageAlt: string
  twitterTitle: string
  twitterDescription: string
}

export function generateComparePageMetadata({
  locale,
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImageAlt,
  twitterTitle,
  twitterDescription,
}: CompareMetadataInput): Metadata {
  const canonical = buildLocalizedUrl("tools/vin-decoder/vin-decoder-vs-vin-check/", locale)
  const languages = buildLanguageAlternates("tools/vin-decoder/vin-decoder-vs-vin-check/")
  const ogLocale = getVinSeoLocale(locale)
  const lastModified = new Date(VIN_SEO_SHARED.lastModifiedAt)
  const { robots } = getVinSeoIndexing(locale)

  return {
    metadataBase: new URL(VIN_SEO_SHARED.siteUrl),
    title,
    description,
    category: VIN_SEO_SHARED.category,
    keywords,
    alternates: {
      canonical,
      languages,
    },
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "article",
      url: canonical,
      siteName: VIN_SEO_SHARED.siteName,
      locale: ogLocale,
      publishedTime: VIN_SEO_SHARED.publishedAt,
      modifiedTime: lastModified.toISOString(),
      images: [
        {
          url: VIN_SEO_SHARED.ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [VIN_SEO_SHARED.ogImage],
    },
    other: getVinSeoOther(locale, lastModified),
  }
}

interface VehicleTypeMetadataInput {
  locale: string
  typeSlug: string
  title: string
  description: string
  keywords: string[]
  ogImageAlt: string
}

export function generateVehicleTypePageMetadata({
  locale,
  typeSlug,
  title,
  description,
  keywords,
  ogImageAlt,
}: VehicleTypeMetadataInput): Metadata {
  const canonical = buildLocalizedUrl(`tools/vin-decoder/vehicle-types/${typeSlug}/`, locale)
  const languages = buildLanguageAlternates(`tools/vin-decoder/vehicle-types/${typeSlug}/`)
  const ogLocale = getVinSeoLocale(locale)
  const lastModified = new Date(VIN_SEO_SHARED.lastModifiedAt)
  const { robots } = getVinSeoIndexing(locale)

  return {
    metadataBase: new URL(VIN_SEO_SHARED.siteUrl),
    title,
    description,
    category: VIN_SEO_SHARED.category,
    keywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: VIN_SEO_SHARED.siteName,
      locale: ogLocale,
      images: [
        {
          url: VIN_SEO_SHARED.ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [VIN_SEO_SHARED.ogImage],
    },
    robots,
    other: getVinSeoOther(locale, lastModified),
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "VinDecoder.comparePage" })

  return generateComparePageMetadata({
    locale: params.locale,
    title: safeTranslate(
      t,
      "seo_title",
      "VIN Decoder vs VIN Check - What's the Difference? | GeeksKai"
    ),
    description: safeTranslate(
      t,
      "seo_description",
      "Learn the difference between a VIN decoder and a VIN check report. Understand what data is included, what each tool is best for, and when to use both."
    ),
    keywords: [
      safeTranslate(t, "keywords.0", "vin decoder"),
      safeTranslate(t, "keywords.1", "vin decoder vs vin check"),
      safeTranslate(t, "keywords.2", "what is vin check"),
      safeTranslate(t, "keywords.3", "vin decoder meaning"),
      safeTranslate(t, "keywords.4", "vin lookup vs vin report"),
      safeTranslate(t, "keywords.5", "vehicle history report vs vin decode"),
      safeTranslate(t, "keywords.6", "free vin decoder"),
      safeTranslate(t, "keywords.7", "vin number decoder"),
      safeTranslate(t, "keywords.8", "nhtsa vin decoder"),
      safeTranslate(t, "keywords.9", "vin decoder free"),
      safeTranslate(t, "keywords.10", "best free vin decoder"),
      safeTranslate(t, "keywords.11", "vin decoder tool"),
    ],
    ogTitle: safeTranslate(t, "og_title", "VIN Decoder vs VIN Check - Which One Do You Need?"),
    ogDescription: safeTranslate(
      t,
      "og_description",
      "Compare VIN decode data and full VIN check reports to choose the right workflow before buying a used vehicle."
    ),
    ogImageAlt: safeTranslate(t, "og_image_alt", "VIN Decoder vs VIN Check"),
    twitterTitle: safeTranslate(t, "twitter_title", "VIN Decoder vs VIN Check"),
    twitterDescription: safeTranslate(
      t,
      "twitter_description",
      "Understand the difference between decoding a VIN and checking vehicle history."
    ),
  })
}

export function getVinWebApplicationSchema({
  name,
  description,
  url,
  dateModified,
  featureList,
}: {
  name: string
  description: string
  url: string
  dateModified: string
  featureList: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: VIN_SEO_SHARED.siteName,
      url: VIN_SEO_SHARED.siteUrl,
    },
    featureList: featureList.join(", "),
    datePublished: VIN_SEO_SHARED.publishedAt,
    dateModified,
  }
}

export function getVinOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: VIN_SEO_SHARED.siteName,
    url: VIN_SEO_SHARED.siteUrl,
    logo: `${VIN_SEO_SHARED.siteUrl}/static/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "geeks.kai@gmail.com",
    },
    sameAs: [
      "https://twitter.com/GeeksKai",
      "https://github.com/geekskai",
      "https://www.facebook.com/geekskai",
      "https://www.linkedin.com/in/geekskai",
    ],
  }
}

export async function generateComparePageData(locale: string) {
  const t = await getTranslations({ locale, namespace: "VinDecoder.comparePage" })
  const title = safeTranslate(t, "title", "VIN Decoder vs VIN Check")
  const lastModified = new Date(VIN_SEO_SHARED.lastModifiedAt)
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale ? VIN_SEO_SHARED.siteUrl : `${VIN_SEO_SHARED.siteUrl}/${locale}`
  const pageUrl = `${baseUrl}/tools/vin-decoder/vin-decoder-vs-vin-check`

  const faqItems = [
    {
      q: safeTranslate(t, "faq.1.q", "Is a VIN decoder the same as a VIN check?"),
      a: safeTranslate(
        t,
        "faq.1.a",
        "No. A VIN decoder identifies vehicle specifications like make, model, year, engine, and manufacturing data. A VIN check usually includes ownership, accident, title, salvage, and theft history from third-party databases."
      ),
    },
    {
      q: safeTranslate(t, "faq.2.q", "When should I use a VIN decoder first?"),
      a: safeTranslate(
        t,
        "faq.2.a",
        "Use a VIN decoder first to validate that the VIN format is correct and that the advertised vehicle specs match the seller information. Then use a VIN check if you need ownership and incident history."
      ),
    },
    {
      q: safeTranslate(t, "faq.3.q", "Can I buy a used car with only VIN decoder results?"),
      a: safeTranslate(
        t,
        "faq.3.a",
        "For important purchases, VIN decoder results alone are not enough. Decoder data confirms technical identity, while VIN check reports help reveal historical risks such as accidents or title issues."
      ),
    },
    {
      q: safeTranslate(t, "faq.4.q", "Is there a free VIN decoder option?"),
      a: safeTranslate(
        t,
        "faq.4.a",
        "Yes. A free VIN decoder can quickly identify make, model, year, and technical specs. This is often the fastest first step before paying for a full report."
      ),
    },
    {
      q: safeTranslate(t, "faq.5.q", "What does a VIN number decoder not include?"),
      a: safeTranslate(
        t,
        "faq.5.a",
        "VIN number decoder results usually do not include accident history, ownership events, liens, or salvage records. Those are typically covered by VIN check reports."
      ),
    },
    {
      q: safeTranslate(t, "faq.6.q", "Is NHTSA VIN decoder data enough for purchase decisions?"),
      a: safeTranslate(
        t,
        "faq.6.a",
        "NHTSA VIN decoder data is strong for identity and specification validation. For risk decisions, pair it with a vehicle history check."
      ),
    },
    {
      q: safeTranslate(t, "faq.7.q", "What is the best workflow for used car due diligence?"),
      a: safeTranslate(
        t,
        "faq.7.a",
        "First decode VIN number details to verify listing accuracy. Then run a VIN check report to evaluate ownership, damage, and title risks."
      ),
    },
    {
      q: safeTranslate(t, "faq.8.q", "Can I use both tools together?"),
      a: safeTranslate(
        t,
        "faq.8.a",
        "Yes. Combining free VIN decoder output with VIN check history gives the most complete picture for buying or selling decisions."
      ),
    },
    {
      q: safeTranslate(
        t,
        "faq.9.q",
        "Is a best free VIN decoder enough if I skip the VIN check report?"
      ),
      a: safeTranslate(
        t,
        "faq.9.a",
        "No. A free VIN decoder is excellent for identity and spec validation, but a VIN check report is still needed for title, accident, theft, and ownership risk signals."
      ),
    },
  ]

  const breadcrumbItems = [
    { label: safeTranslate(t, "breadcrumb.home", "Home"), href: "/" },
    { label: safeTranslate(t, "breadcrumb.tools", "Tools"), href: "/tools" },
    {
      label: safeTranslate(t, "breadcrumb.vin_decoder", "VIN Decoder"),
      href: "/tools/vin-decoder",
    },
    { label: title },
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: safeTranslate(t, "breadcrumb.home", "Home"),
        item: `${baseUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: safeTranslate(t, "breadcrumb.tools", "Tools"),
        item: `${baseUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: safeTranslate(t, "breadcrumb.vin_decoder", "VIN Decoder"),
        item: `${baseUrl}/tools/vin-decoder`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: title,
        item: pageUrl,
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: safeTranslate(
      t,
      "seo_description",
      "Learn the difference between a VIN decoder and a VIN check report. Understand what data is included, what each tool is best for, and when to use both."
    ),
    url: pageUrl,
    inLanguage: locale,
    datePublished: VIN_SEO_SHARED.publishedAt,
    dateModified: lastModified.toISOString(),
    isPartOf: {
      "@type": "WebSite",
      name: VIN_SEO_SHARED.siteName,
      url: VIN_SEO_SHARED.siteUrl,
    },
  }

  const webApplicationSchema = getVinWebApplicationSchema({
    name: title,
    description: safeTranslate(
      t,
      "seo_description",
      "Learn the difference between a VIN decoder and a VIN check report. Understand what data is included, what each tool is best for, and when to use both."
    ),
    url: pageUrl,
    dateModified: lastModified.toISOString(),
    featureList: [
      safeTranslate(t, "core_facts.decoder", "VIN decoder output"),
      safeTranslate(t, "core_facts.check", "VIN check output"),
      safeTranslate(t, "workflow.step1.label", "Decode VIN first"),
      safeTranslate(t, "workflow.step3.label", "Run a VIN check report"),
      safeTranslate(t, "core_facts.cost_value", "Free VIN decoder + optional paid report"),
    ],
  })

  const organizationSchema = getVinOrganizationSchema()

  return {
    title,
    lastModified,
    breadcrumbItems,
    faqItems,
    structuredDataSchemas: [
      breadcrumbSchema,
      faqSchema,
      webPageSchema,
      webApplicationSchema,
      organizationSchema,
    ],
  }
}

export default async function VinCompareLayout({ children, params }: VinCompareLayoutProps) {
  const pageData = await generateComparePageData(params.locale)

  return (
    <>
      {pageData.structuredDataSchemas.map((schema, index) => (
        <script
          key={`compare-ld-json-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  )
}
