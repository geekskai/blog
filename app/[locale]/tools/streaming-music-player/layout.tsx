import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import React from "react"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "HLSMusicPlayer" })
  const isDefaultLocale = locale === "en"

  const languages: Record<string, string> = {
    "x-default": "https://geekskai.com/tools/streaming-music-player/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/streaming-music-player/`
  })

  const lastModified = new Date("2026-02-17")

  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
    keywords: t("metadata_keywords").split(", "),
    openGraph: {
      title: t("metadata_og_title"),
      description: t("metadata_og_description"),
      type: "website",
      url: isDefaultLocale
        ? "https://geekskai.com/tools/streaming-music-player/"
        : `https://geekskai.com/${locale}/tools/streaming-music-player/`,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/tools/streaming-music-player/streaming-music-player.png",
          width: 1200,
          height: 630,
          alt: t("metadata_og_image_alt"),
        },
      ],
      locale: isDefaultLocale ? "en_US" : "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata_twitter_title"),
      description: t("metadata_twitter_description"),
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/streaming-music-player/"
        : `https://geekskai.com/${locale}/tools/streaming-music-player/`,
      languages: {
        ...languages,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "last-modified": lastModified.toISOString(),
      "update-frequency": "monthly",
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
  const t = await getTranslations({ locale, namespace: "HLSMusicPlayer" })
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale
    ? "https://geekskai.com/tools/streaming-music-player"
    : `https://geekskai.com/${locale}/tools/streaming-music-player`

  // 1. WebApplication Schema linked to Organization
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("schema_name"),
    description: t("schema_description"),
    url: baseUrl,
    applicationCategory: "MultimediaApplication",
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
  }

  // 2. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
      "@type": "Question",
      name: t(`faq_question_${i}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq_answer_${i}`),
      },
    })),
  }

  // 3. HowTo Schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("section_how_to_title"),
    step: [1, 2, 3].map((i, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: t(`section_how_to_step_${i}_title`),
      text: t(`section_how_to_step_${i}`),
    })),
  }

  // 4. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "GeeksKai",
        item: "https://geekskai.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://geekskai.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("page_title"),
        item: baseUrl,
      },
    ],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema]),
        }}
      />
      {children}
    </div>
  )
}
