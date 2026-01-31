import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import React from "react"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "PrintTestPage" })
  const isDefaultLocale = locale === "en"

  const languages: Record<string, string> = {
    "x-default": "https://geekskai.com/tools/print-test-page/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/print-test-page/`
  })

  // Update this monthly
  const lastModified = new Date("2026-01-28") // Update current date

  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
    keywords: t("metadata_keywords").split(", "),
    openGraph: {
      title: t("metadata_og_title"),
      description: t("metadata_og_description"),
      type: "website",
      url: isDefaultLocale
        ? "https://geekskai.com/tools/print-test-page/"
        : `https://geekskai.com/${locale}/tools/print-test-page/`,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/print-test-page.png",
          width: 1200,
          height: 630,
          alt: t("metadata_og_image_alt"),
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata_twitter_title"),
      description: t("metadata_twitter_description"),
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/print-test-page/"
        : `https://geekskai.com/${locale}/tools/print-test-page/`,
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

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "PrintTestPage" })
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale
    ? "https://geekskai.com/tools/print-test-page"
    : `https://geekskai.com/${locale}/tools/print-test-page`

  // WebApplication Schema
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("schema_name"),
    description: t("schema_description"),
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
      name: t("schema_provider_name"),
      url: t("schema_provider_url"),
    },
    featureList: [
      t("schema_feature_1"),
      t("schema_feature_2"),
      t("schema_feature_3"),
      t("schema_feature_4"),
      t("schema_feature_5"),
      t("schema_feature_6"),
    ].join(", "),
    browserRequirements: t("schema_browser_requirements"),
    softwareVersion: t("schema_software_version"),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq_question_1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_answer_1"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_answer_2"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_answer_3"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_4"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_answer_4"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_5"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_answer_5"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_6"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_answer_6"),
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
        name: t("breadcrumb_home"),
        item: "https://geekskai.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb_tools"),
        item: "https://geekskai.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb_title"),
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
