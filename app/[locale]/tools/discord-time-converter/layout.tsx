import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "DiscordTimeConverter" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/discord-time-converter/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/discord-time-converter/`
  })
  // Content freshness metadata (updated within 30-90 days for best AI ranking)
  const lastModified = new Date("2026-02-10")
  const updateFrequency = "monthly"
  const nextReview = new Date("2026-05-10")

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      images: [
        {
          url: "/static/images/discord-time-converter.png",
          width: 1200,
          height: 630,
          alt: t("seo_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/discord-time-converter/"
        : `https://geekskai.com/${locale}/tools/discord-time-converter/`,
      languages: {
        ...languages,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // Content freshness signals for AI search engines
    other: {
      "last-modified": lastModified.toISOString(),
      "update-frequency": updateFrequency,
      "next-review": nextReview.toISOString(),
    },
  }
}

// JSON-LD Structured Data for SEO
async function generateJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: "DiscordTimeConverter" })

  // FAQ Schema for better AI extraction
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("content_sections.faq.q1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq.a1"),
        },
      },
      {
        "@type": "Question",
        name: t("content_sections.faq.q2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq.a2"),
        },
      },
      {
        "@type": "Question",
        name: t("content_sections.faq.q3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq.a3"),
        },
      },
      {
        "@type": "Question",
        name: t("content_sections.faq.q4"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq.a4"),
        },
      },
      {
        "@type": "Question",
        name: t("content_sections.faq.q5"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq.a5"),
        },
      },
    ],
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: `https://geekskai.com/${locale === "en" ? "" : locale + "/"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: `https://geekskai.com/${locale === "en" ? "" : locale + "/"}tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb.discord_time_converter"),
        item: `https://geekskai.com/${locale === "en" ? "" : locale + "/"}tools/discord-time-converter`,
      },
    ],
  }

  // WebApplication Schema with core facts highlighted
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url: `https://geekskai.com/${locale === "en" ? "" : locale + "/"}tools/discord-time-converter`,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Any",
    permissions: "none",
    // Core facts: Pricing (free)
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
    },
    // Core facts: Features
    featureList: [
      t("schema.feature_list_1"),
      t("schema.feature_list_2"),
      t("schema.feature_list_3"),
      t("schema.feature_list_4"),
      t("schema.feature_list_5"),
      t("schema.feature_list_6"),
      t("schema.feature_list_7"),
      t("schema.feature_list_8"),
      t("schema.feature_list_9"),
      t("schema.feature_list_10"),
      t("schema.feature_list_11"),
      t("schema.feature_list_12"),
      t("schema.feature_list_13"),
      t("schema.feature_list_14"),
      t("schema.feature_list_15"),
      t("schema.feature_list_16"),
      t("schema.feature_list_17"),
      t("schema.feature_list_18"),
      t("schema.feature_list_19"),
    ].join(","),
    // Core facts: Target Users (Positioning)
    audience: {
      "@type": "Audience",
      audienceType: t("schema.audienceType"),
    },
    softwareRequirements: t("schema.softwareRequirements"),
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1650",
      bestRating: "5",
      worstRating: "1",
    },
    datePublished: "2024-01-01",
    dateModified: "2026-01-31",
  }

  return {
    webApp: webAppSchema,
    faq: faqSchema,
    breadcrumb: breadcrumbSchema,
  }
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const schemas = await generateJsonLd(locale)

  return (
    <div className="min-h-screen">
      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webApp) }}
      />
      {/* FAQ Schema for better AI extraction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />
      {children}
    </div>
  )
}
