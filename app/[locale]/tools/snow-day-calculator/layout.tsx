import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "SnowDayCalculator" })
  const isDefaultLocale = locale === "en"

  const baseUrl = "https://geekskai.com"
  const toolPath = "/tools/snow-day-calculator/"
  const canonicalUrl = isDefaultLocale ? `${baseUrl}${toolPath}` : `${baseUrl}/${locale}${toolPath}`

  const title = t("seo_title")
  const description = t("seo_description")
  const keywords = t("seo_keywords")

  return {
    title,
    description,
    keywords: keywords.split(", "),
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",
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
    openGraph: {
      type: "website",
      locale: locale === "zh-cn" ? "zh_CN" : locale.replace("-", "_"),
      url: canonicalUrl,
      title: t("seo_title"),
      description: description,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/tools/snow-day-calculator-og.jpg",
          width: 1200,
          height: 630,
          alt: t("og_image_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: description,
      images: ["/tools/snow-day-calculator-og.jpg"],
      creator: "@geekskai",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      "application-name": t("application_name"),
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": t("application_name"),
      "format-detection": "telephone=no",
      "last-modified": "2025-01-24T00:00:00Z",
      "update-frequency": "monthly",
      "next-review": "2025-02-24T00:00:00Z",
    },
  }
}

export default async function SnowDayCalculatorLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "SnowDayCalculator" })
  const isDefaultLocale = locale === "en"

  const baseUrl = "https://geekskai.com"
  const toolPath = "/tools/snow-day-calculator"
  const fullUrl = isDefaultLocale ? `${baseUrl}${toolPath}` : `${baseUrl}/${locale}${toolPath}`

  // Structured Data for SEO - WebApplication Schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("json_ld.name"),
    description: t("json_ld.description"),
    url: fullUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    permissions: "location",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
    },
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://www.geekskai.com",
      logo: "https://www.geekskai.com/static/logo.png",
    },
    featureList: [
      t("json_ld.feature_list.realtime_api"),
      t("json_ld.feature_list.probability_calculation"),
      t("json_ld.feature_list.location_based"),
      t("json_ld.feature_list.weather_factors"),
      t("json_ld.feature_list.mobile_design"),
      t("json_ld.feature_list.instant_results"),
      t("json_ld.feature_list.multiple_search"),
      t("json_ld.feature_list.search_history"),
    ].join(", "),
    screenshot: "https://www.geekskai.com/tools/snow-day-calculator-screenshot.jpg",
    softwareVersion: "1.0",
    datePublished: "2024-01-20",
    dateModified: "2025-01-24",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://www.geekskai.com",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    audience: {
      "@type": "Audience",
      audienceType: t("json_ld.audience_type"),
    },
    usageInfo: t("json_ld.usage_info"),
  }

  // FAQ Schema - matches page.tsx FAQ data for consistency
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.items.accuracy.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.accuracy.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.factors.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.factors.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.worldwide.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.worldwide.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.best_time.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.best_time.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.free.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.free.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.update_frequency.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.update_frequency.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.different_results.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.different_results.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.save_locations.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.save_locations.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.search_difference.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.search_difference.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.algorithm_comparison.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.algorithm_comparison.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.planning.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.planning.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.private_schools.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.private_schools.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.daylight_saving.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.daylight_saving.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.error_handling.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.error_handling.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.other_weather.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.other_weather.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.comparison.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.comparison.answer"),
        },
      },
    ],
  }

  // Breadcrumb Schema
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: "https://geekskai.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: "https://geekskai.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb.snow_day_calculator"),
        item: fullUrl,
      },
    ],
  }

  // Organization Schema for brand signals
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://www.geekskai.com",
    logo: "https://www.geekskai.com/static/logo.png",
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

  return (
    <>
      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      {children}
    </>
  )
}
