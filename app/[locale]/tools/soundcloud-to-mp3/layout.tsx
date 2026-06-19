import { buildLanguageAlternates, getLocalizedUrl } from "@/app/i18n/urls"
import { isSoundCloudGrowthLocale, soundCloudGrowthLocales } from "@/data/soundCloudGrowth"
import type { Metadata } from "next"
import React from "react"
import { getTranslations } from "next-intl/server"

const SITE_URL = "https://geekskai.com"
const TOOL_PATH = "/tools/soundcloud-to-mp3/"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: "SoundCloudToMP3" })
  const canonical = getLocalizedUrl(SITE_URL, locale, TOOL_PATH)
  const shouldIndex = isSoundCloudGrowthLocale(locale)

  // Update this monthly
  const lastModified = new Date("2026-06-16") // Update current date

  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
    keywords: t("metadata_keywords").split(", "),
    openGraph: {
      title: t("metadata_og_title"),
      description: t("metadata_og_description"),
      type: "website",
      url: canonical,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/tools/soundcloud-to-wav/soundcloud-to-wav.png", // Reusing image if MP3 specific one not found
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
      canonical,
      languages: buildLanguageAlternates(SITE_URL, TOOL_PATH, [...soundCloudGrowthLocales]),
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
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

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const t = await getTranslations({ locale, namespace: "SoundCloudToMP3" })
  const baseUrl = getLocalizedUrl(SITE_URL, locale, TOOL_PATH).replace(/\/$/, "")

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
      t("schema_feature_7"),
      t("schema_feature_8"),
    ].join(", "),
    browserRequirements: t("schema_browser_requirements"),
    softwareVersion: t("schema_software_version"),
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
    logo: "https://geekskai.com/static/logos.png",
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
