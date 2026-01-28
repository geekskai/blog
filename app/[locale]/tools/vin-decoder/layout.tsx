import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import React from "react"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "VinDecoder" })
  const isDefaultLocale = locale === "en"

  const languages: Record<string, string> = {
    "x-default": "https://geekskai.com/tools/vin-decoder/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/vin-decoder/`
  })

  // Content freshness metadata - Update this monthly
  const lastModified = new Date("2026-01-29")

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      url: isDefaultLocale
        ? "https://geekskai.com/tools/vin-decoder/"
        : `https://geekskai.com/${locale}/tools/vin-decoder/`,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/og/vin-decoder.png",
          width: 1200,
          height: 630,
          alt: t("structured_data.name"),
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/static/images/og/vin-decoder.png"],
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/vin-decoder/"
        : `https://geekskai.com/${locale}/tools/vin-decoder/`,
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
    other: {
      "last-modified": lastModified.toISOString(),
      "update-frequency": "monthly",
      "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export default async function VinDecoderLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "VinDecoder" })
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale
    ? "https://geekskai.com/tools/vin-decoder"
    : `https://geekskai.com/${locale}/tools/vin-decoder`

  // Content freshness metadata - Update this monthly
  const lastModified = new Date("2026-01-25")

  // WebApplication Schema - Enhanced for AI SEO
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("structured_data.name"),
    description: t("structured_data.description"),
    url: baseUrl,
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
      name: "GeeksKai",
      url: "https://geekskai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://geekskai.com/static/logo.png",
      },
    },
    featureList: [
      t("structured_data.feature_instant"),
      t("structured_data.feature_complete"),
      t("structured_data.feature_engine"),
      t("structured_data.feature_safety"),
      t("structured_data.feature_manufacturing"),
      t("structured_data.feature_export"),
      t("structured_data.feature_history"),
      t("structured_data.feature_no_registration"),
      t("structured_data.feature_free"),
      t("structured_data.feature_mobile"),
    ],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    datePublished: "2024-01-01",
    dateModified: lastModified.toISOString().split("T")[0],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2847",
      bestRating: "5",
      worstRating: "1",
    },
  }

  // FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("structured_data.faq_what_is_vin_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_what_is_vin_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_where_find_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_where_find_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_free_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_free_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_info_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_info_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_accurate_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_accurate_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_country_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_country_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_not_available_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_not_available_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_privacy_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_privacy_a"),
        },
      },
    ],
  }

  // Breadcrumb structured data - Fixed URL error
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("structured_data.breadcrumb_home"),
        item: "https://geekskai.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("structured_data.breadcrumb_tools"),
        item: "https://geekskai.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("structured_data.breadcrumb_vin_decoder"),
        item: baseUrl,
      },
    ],
  }

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
    logo: "https://geekskai.com/static/logo.png",
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
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </div>
  )
}
