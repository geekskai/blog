import { buildLanguageAlternates, getLocalizedUrl } from "@/app/i18n/urls"
import { isSoundCloudGrowthLocale, soundCloudGrowthLocales } from "@/data/soundCloudGrowth"
import type { Metadata } from "next"
import React from "react"
import { getTranslations } from "next-intl/server"

const SITE_URL = "https://geekskai.com"
const TOOL_SLUG = "soundcloud-artwork-downloader"
const TOOL_PATH = `/tools/${TOOL_SLUG}/`

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  const t = await getTranslations({ locale, namespace: "SoundCloudArtworkDownloader" })
  const canonical = getLocalizedUrl(SITE_URL, locale, TOOL_PATH)
  const shouldIndex = isSoundCloudGrowthLocale(locale)

  const lastModified = new Date("2026-05-26")

  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
    keywords: t("metadata_keywords").split(", "),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(SITE_URL, TOOL_PATH, [...soundCloudGrowthLocales]),
    },
    openGraph: {
      title: t("metadata_og_title"),
      description: t("metadata_og_description"),
      type: "website",
      url: canonical,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/tools/soundcloud-playlist-downloader/soundcloud-playlist-downloader.png",
          width: 1200,
          height: 630,
          alt: t("metadata_og_image_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata_twitter_title"),
      description: t("metadata_twitter_description"),
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
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

  const t = await getTranslations({ locale, namespace: "SoundCloudArtworkDownloader" })
  const baseUrl = getLocalizedUrl(SITE_URL, locale, TOOL_PATH).replace(/\/$/, "")

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("schema_name"),
    description: t("schema_description"),
    url: baseUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: t("schema_price"), priceCurrency: "USD" },
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
    ],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      {children}
    </div>
  )
}
