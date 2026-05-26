import type { Metadata } from "next"

import React from "react"
import type { ReactNode } from "react"
import { supportedLocales } from "app/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import {
  VIDEO_LAST_MODIFIED_ISO,
  buildDownloaderHowToInput,
  generateVideoHowToSchema,
} from "@/app/[locale]/tools/youtube-video-downloader/video-faq"

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const BASE_URL = "https://geekskai.com"
const TOOL_SLUG = "youtube-video-downloader"

function buildUrl(locale: string) {
  return locale === "en"
    ? `${BASE_URL}/tools/${TOOL_SLUG}/`
    : `${BASE_URL}/${locale}/tools/${TOOL_SLUG}/`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("VideoPage")
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
      "last-modified": VIDEO_LAST_MODIFIED_ISO,
      "update-frequency": "monthly",
      "next-review": new Date(
        new Date(VIDEO_LAST_MODIFIED_ISO).getTime() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  }
}

export default async function YouTubeVideoDownloaderLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("VideoPage")
  const url = buildUrl(locale).replace(/\/$/, "")
  const title = t("seo_title")
  const description = t("seo_description")
  const howToInput = buildDownloaderHowToInput((key) => t(key))

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
        dateModified: VIDEO_LAST_MODIFIED_ISO,
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
      generateVideoHowToSchema(url, howToInput),
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
