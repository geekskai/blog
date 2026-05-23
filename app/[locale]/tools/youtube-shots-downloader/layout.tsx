import type { Metadata } from "next"
import React from "react"
import type { ReactNode } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { supportedLocales } from "app/i18n/routing"
import {
  SHOTS_LAST_MODIFIED_ISO,
  generateShotsFAQSchema,
  generateShotsHowToSchema,
} from "@/app/[locale]/tools/youtube-shots-downloader/shots-faq"

const BASE_URL = "https://geekskai.com"
const TOOL_SLUG = "youtube-shots-downloader"

function buildToolUrl(locale: string): string {
  return locale === "en"
    ? `${BASE_URL}/tools/${TOOL_SLUG}/`
    : `${BASE_URL}/${locale}/tools/${TOOL_SLUG}/`
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations("ShortsPage")
  const metadataBase = new URL(BASE_URL)
  const canonical = buildToolUrl(locale)

  const languages: Record<string, string> = {
    "x-default": buildToolUrl("en"),
  }
  supportedLocales.forEach((loc) => {
    languages[loc] = buildToolUrl(loc)
  })

  return {
    metadataBase,
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      url: canonical,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/geekskai-blog.png",
          width: 1200,
          height: 630,
          alt: t("hero_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/static/images/geekskai-blog.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "last-modified": SHOTS_LAST_MODIFIED_ISO,
      "update-frequency": "monthly",
      "next-review": new Date(
        new Date(SHOTS_LAST_MODIFIED_ISO).getTime() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  }
}

export default async function YouTubeShortsDownloaderLayout(props: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations("ShortsPage")
  const baseUrl = buildToolUrl(locale).replace(/\/$/, "")
  const title = t("seo_title")
  const description = t("seo_description")
  const schemaFeatureList = [
    t("schema_feature_1"),
    t("schema_feature_2"),
    t("schema_feature_3"),
    t("schema_feature_4"),
  ]

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("breadcrumb_title"),
    description,
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
    },
    featureList: schemaFeatureList,
  }

  const faqSchema = {
    "@context": "https://schema.org",
    ...generateShotsFAQSchema(baseUrl),
  }

  const howToSchema = {
    "@context": "https://schema.org",
    ...generateShotsHowToSchema(baseUrl),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}#webpage`,
        url: baseUrl,
        name: title,
        description,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        dateModified: SHOTS_LAST_MODIFIED_ISO,
        inLanguage: "en-US",
        breadcrumb: { "@id": `${baseUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("breadcrumb_home"), item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: t("breadcrumb_title"), item: baseUrl },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "GeeksKai",
        url: `${BASE_URL}/`,
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "GeeksKai",
        url: `${BASE_URL}/`,
        logo: `${BASE_URL}/static/logos.png`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {props.children}
    </>
  )
}
