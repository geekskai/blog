import type { Metadata } from "next"
import React from "react"
import type { ReactNode } from "react"
import { supportedLocales } from "app/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import {
  AUDIO_LAST_MODIFIED,
  generateAudioFAQSchema,
  generateAudioHowToSchema,
} from "@/app/[locale]/tools/youtube-audio-downloader/audio-faq"

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const BASE_URL = "https://geekskai.com"
const TOOL_SLUG = "youtube-audio-downloader"

function buildUrl(locale: string) {
  return locale === "en"
    ? `${BASE_URL}/tools/${TOOL_SLUG}/`
    : `${BASE_URL}/${locale}/tools/${TOOL_SLUG}/`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("AudioPage")
  const metadataBase = new URL(BASE_URL)

  const title = t("seo_title")
  const description = t("seo_description")
  const keywords = t("seo_keywords")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)

  const canonical = buildUrl(locale)
  const languages: Record<string, string> = {
    "x-default": buildUrl("en"),
  }
  supportedLocales.forEach((loc) => {
    languages[loc] = buildUrl(loc)
  })

  return {
    metadataBase,
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/geekskai-blog.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
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
    alternates: { canonical, languages },
    other: {
      "last-modified": `${AUDIO_LAST_MODIFIED}T12:00:00.000Z`,
      "update-frequency": "monthly",
      "next-review": new Date(
        new Date(`${AUDIO_LAST_MODIFIED}T12:00:00.000Z`).getTime() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  }
}

export default async function YouTubeAudioDownloaderLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("AudioPage")
  const url = buildUrl(locale).replace(/\/$/, "")
  const title = t("seo_title")
  const description = t("seo_description")

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        dateModified: AUDIO_LAST_MODIFIED,
        inLanguage: "en-US",
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("breadcrumb_home"), item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: t("breadcrumb_title"), item: url },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: t("breadcrumb_title"),
        description,
        url,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
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
      generateAudioFAQSchema(url),
      generateAudioHowToSchema(url),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
