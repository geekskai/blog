import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "DiscordTimestampGenerator" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/discord-timestamp-generator/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/discord-timestamp-generator/`
  })

  // Content freshness metadata (GEO requirement)
  const lastModified = new Date("2026-01-31")
  const nextReview = new Date("2026-04-30") // 90 days later

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
          url: "/static/images/og/discord-timestamp-generator-og.png",
          width: 1200,
          height: 630,
          alt: t("seo_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/static/images/og/discord-timestamp-generator-og.png"],
      title: t("seo_title"),
      description: t("seo_description"),
    },
    icons: {
      icon: "/static/favicons/favicon.ico",
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/discord-timestamp-generator/"
        : `https://geekskai.com/${locale}/tools/discord-timestamp-generator/`,
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
    // Content freshness metadata (GEO requirement)
    other: {
      "last-modified": lastModified.toISOString(),
      "update-frequency": "monthly",
      "next-review": nextReview.toISOString(),
    },
  }
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "DiscordTimestampGenerator" })
  const baseUrl = "https://geekskai.com"
  const isDefaultLocale = locale === "en"
  const fullUrl = `${baseUrl}${isDefaultLocale ? "" : `/${locale}`}/tools/discord-timestamp-generator/`

  // WebApplication Schema (Enhanced)
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url: fullUrl,
    image: `${baseUrl}/static/images/og/discord-timestamp-generator-og.png`,
    applicationCategory: "CommunicationApplication",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      t("structured_data.feature_1"),
      t("structured_data.feature_2"),
      t("structured_data.feature_3"),
      t("structured_data.feature_4"),
      t("structured_data.feature_5"),
      t("structured_data.feature_6"),
      t("structured_data.feature_7"),
      t("structured_data.feature_8"),
      t("structured_data.feature_9"),
      t("structured_data.feature_10"),
      t("structured_data.feature_11"),
      t("structured_data.feature_12"),
      t("structured_data.feature_13"),
      t("structured_data.feature_14"),
      t("structured_data.feature_15"),
    ].join(", "),
    softwareRequirements: t("structured_data.software_requirements"),
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: baseUrl,
    },
    keywords: t("seo_keywords"),
    educationalUse: t("structured_data.educational_use"),
    audience: {
      "@type": "Audience",
      audienceType: t("structured_data.audience_type"),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1420",
      bestRating: "5",
      worstRating: "1",
    },
    datePublished: "2025-01-15",
    dateModified: "2026-01-31",
  }

  // FAQ Schema (GEO requirement: ≥8 questions)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.q1.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q1.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q2.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q2.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q3.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q3.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q4.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q4.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q5.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q5.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q6.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q6.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q7.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q7.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q8.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q8.answer"),
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
        item: `${baseUrl}${isDefaultLocale ? "" : `/${locale}/`}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: `${baseUrl}${isDefaultLocale ? "" : `/${locale}/`}tools/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb.discord_timestamp_generator"),
        item: fullUrl,
      },
    ],
  }

  // Organization Schema (Brand signals)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GeeksKai",
    url: baseUrl,
    logo: `${baseUrl}/static/images/logo.png`,
    sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "geeks.kai@gmail.com",
    },
  }

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </div>
  )
}
