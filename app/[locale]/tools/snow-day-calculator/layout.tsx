import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import React from "react"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: "SnowDayCalculator" })
  const isDefaultLocale = locale === "en"
  const lastModified = new Date("2026-05-26")

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
      "last-modified": lastModified.toISOString(),
      "update-frequency": "monthly",
      "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export default async function SnowDayCalculatorLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

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
      logo: "https://www.geekskai.com/static/logos.png",
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
    logo: "https://www.geekskai.com/static/logos.png",
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
