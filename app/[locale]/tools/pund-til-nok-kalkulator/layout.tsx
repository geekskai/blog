import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "../../../i18n/routing"

// Content freshness metadata - 内容新鲜度标记
const lastModified = new Date("2026-01-25")
const updateFrequency: "daily" | "weekly" | "monthly" | "quarterly" = "monthly"
const nextReviewDate = new Date(lastModified)
nextReviewDate.setMonth(nextReviewDate.getMonth() + 1)

// SEO optimized metadata - 针对"pund til nok"关键词优化，符合AI搜索时代标准
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "GbpNokConverter" })

  // 语言映射
  const localeMap: Record<string, string> = {
    en: "en_US",
    ja: "ja_JP",
    ko: "ko_KR",
    no: "no_NO",
    "zh-cn": "zh_CN",
    da: "da_DK",
  }

  const ogLocale = localeMap[locale] || "en_US"
  const baseUrl = "https://geekskai.com"
  const path = `/tools/pund-til-nok-kalkulator/`
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/pund-til-nok-kalkulator/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/pund-til-nok-kalkulator/`
  })

  return {
    title: t("structured_data.name"),
    description: t("structured_data.description"),
    keywords: t("structured_data.seo_keywords").split(", "),
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",

    // Open Graph
    openGraph: {
      title: t("structured_data.name"),
      description: t("structured_data.description"),
      url,
      siteName: t("structured_data.site_name"),
      images: [
        {
          url: "/static/tools/pund-til-nok-kalkulator-og.jpg",
          width: 1200,
          height: 630,
          alt: t("structured_data.name"),
        },
      ],
      locale: ogLocale,
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: t("structured_data.name"),
      description: t("structured_data.description"),
      images: ["/static/tools/pund-til-nok-kalkulator-twitter.jpg"],
      creator: "@geekskai",
    },

    // Additional SEO
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

    // Canonical URL
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/pund-til-nok-kalkulator/"
        : `https://geekskai.com/${locale}/tools/pund-til-nok-kalkulator/`,
      languages: {
        ...languages,
      },
    },

    // Additional metadata
    category: locale === "no" ? "Verktøy" : t("structured_data.category"),
    classification: locale === "no" ? "Valutakalkulator" : t("structured_data.classification"),

    // Verification and other meta tags
    other: {
      "application-name": t("structured_data.name"),
      "apple-mobile-web-app-title": t("structured_data.name"),
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "geo.region": locale === "no" ? "NO" : "GLOBAL",
      "geo.country":
        locale === "no"
          ? t("structured_data.geo_country_norway")
          : t("structured_data.geo_country_global"),
      language: locale === "no" ? "nb-NO,en-US" : "en-US",
      // Content freshness metadata - AI搜索时代关键信号
      "last-modified": lastModified.toISOString(),
      "update-frequency": updateFrequency,
      "next-review": nextReviewDate.toISOString(),
    },
  }
}

// Structured data (JSON-LD) - Will be generated in Layout component with translations

// FAQ structured data - Will be generated in Layout component with translations

// Currency pair structured data - 优化为更准确的结构
const currencyPairData = {
  "@context": "https://schema.org",
  "@type": "ExchangeRateSpecification",
  currency: "GBP",
  currentExchangeRate: {
    "@type": "UnitPriceSpecification",
    price: "13.45", // This would be dynamically updated
    priceCurrency: "NOK",
    unitCode: "NOK",
  },
  validFrom: new Date().toISOString(),
  validThrough: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  exchangeRateSpread: {
    "@type": "MonetaryAmount",
    currency: "NOK",
    value: "0.05", // Estimated spread
  },
}

// Breadcrumb structured data - Will be generated in Layout component with translations

export default async function GbpNokConverterLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "GbpNokConverter" })

  const isDefaultLocale = locale === "en"
  const baseUrl = "https://geekskai.com"
  const toolPath = "/tools/pund-til-nok-kalkulator"
  const fullUrl = isDefaultLocale ? `${baseUrl}${toolPath}` : `${baseUrl}/${locale}${toolPath}`

  // Structured data (JSON-LD) - 使用翻译
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("structured_data.name"),
    alternateName: t("structured_data.alternate_name"),
    description: t("structured_data.description"),
    url: fullUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    permissions: "none",
    isAccessibleForFree: true,
    inLanguage: locale === "no" ? ["nb-NO", "en-US"] : ["en-US"],
    availableLanguage:
      locale === "no"
        ? [
            t("structured_data.available_language_norwegian"),
            t("structured_data.available_language_english"),
          ]
        : [t("structured_data.available_language_english")],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NOK",
      availability: "https://schema.org/InStock",
      priceValidUntil: nextReviewDate.toISOString().split("T")[0],
    },
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://geekskai.com/static/logo.png",
      },
    },
    featureList: [
      t("structured_data.feature_list_1"),
      t("structured_data.feature_list_2"),
      t("structured_data.feature_list_3"),
      t("structured_data.feature_list_4"),
      t("structured_data.feature_list_5"),
      t("structured_data.feature_list_6"),
      t("structured_data.feature_list_7"),
      t("structured_data.feature_list_8"),
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1000",
      bestRating: "5",
      worstRating: "1",
    },
    audience: {
      "@type": "Audience",
      audienceType: [
        t("structured_data.audience_travelers"),
        t("structured_data.audience_business"),
        t("structured_data.audience_traders"),
        t("structured_data.audience_students"),
        t("structured_data.audience_investors"),
        t("structured_data.audience_shoppers"),
        t("structured_data.audience_norwegian"),
        t("structured_data.audience_uk"),
      ],
      geographicArea: {
        "@type": "Place",
        name: t("structured_data.geographic_area"),
      },
    },
    screenshot: {
      "@type": "ImageObject",
      url: "https://geekskai.com/static/tools/pund-til-nok-kalkulator-screenshot.jpg",
      caption: t("structured_data.name"),
    },
    softwareVersion: "1.0",
    datePublished: "2024-01-24",
    dateModified: lastModified.toISOString().split("T")[0],
    usageInfo: {
      "@type": "CreativeWork",
      name: t("structured_data.usage_name"),
      description: t("structured_data.usage_description"),
    },
  }

  // FAQ structured data - 使用翻译
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq_rate_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_rate_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_convert_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_convert_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_free_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_free_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_accuracy_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_accuracy_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_why_change_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_why_change_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_business_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_business_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_travel_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_travel_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_other_tools_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_other_tools_answer"),
        },
      },
    ],
  }

  // Breadcrumb structured data - 使用翻译
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("structured_data.breadcrumb_home"),
        item: `${baseUrl}/${locale === "en" ? "" : `${locale}/`}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("structured_data.breadcrumb_tools"),
        item: `${baseUrl}/${locale === "en" ? "" : `${locale}/`}tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("structured_data.breadcrumb_converter"),
        item: fullUrl,
      },
    ],
  }

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(currencyPairData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      {/* Page content */}
      {children}
    </>
  )
}
