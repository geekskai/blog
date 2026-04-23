import { supportedLocales } from "app/i18n/routing"
import type { Metadata } from "next"
import React from "react"
import { getTranslations } from "next-intl/server"

const TOOL_SLUG = "soundcloud-downloader"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "SoundCloudDownloader" })
  const isDefaultLocale = locale === "en"
  const canonical = isDefaultLocale
    ? `https://geekskai.com/tools/${TOOL_SLUG}/`
    : `https://geekskai.com/${locale}/tools/${TOOL_SLUG}/`

  const languages: Record<string, string> = {
    "x-default": `https://geekskai.com/tools/${TOOL_SLUG}/`,
  }
  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/${TOOL_SLUG}/`
  })

  const lastModified = new Date("2026-04-23")

  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
    keywords: t("metadata_keywords").split(", "),
    alternates: {
      canonical,
      languages,
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
  const t = await getTranslations({ locale, namespace: "SoundCloudDownloader" })
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale
    ? `https://geekskai.com/tools/${TOOL_SLUG}`
    : `https://geekskai.com/${locale}/tools/${TOOL_SLUG}`

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
      {children}
    </div>
  )
}
