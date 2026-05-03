import { supportedLocales } from "app/i18n/routing"
import type { Metadata } from "next"
import React from "react"
import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"

const slug = "bandcamp-to-mp3"
const lastModified = new Date("2026-05-04")

function buildUrl(locale: string): string {
  return locale === "en"
    ? `https://geekskai.com/tools/${slug}/`
    : `https://geekskai.com/${locale}/tools/${slug}/`
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: "BandcampToMp3" })
  const metadataKeywords = t.raw("metadata.keywords") as string[]

  const languages: Record<string, string> = {
    "x-default": buildUrl("en"),
  }

  supportedLocales.forEach((item) => {
    languages[item] = buildUrl(item)
  })

  const canonicalUrl = buildUrl(locale)

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    keywords: metadataKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
      type: "website",
      url: canonicalUrl,
      siteName: "GeeksKai",
      images: [
        {
          url: "https://geekskai.com/static/images/geekskai-blog.png",
          width: 1200,
          height: 630,
          alt: t("metadata.openGraphImageAlt"),
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.title"),
      description: t("metadata.description"),
      images: ["https://geekskai.com/static/images/geekskai-blog.png"],
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

export default async function Layout(props: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const baseUrl = buildUrl(locale)
  const t = await getTranslations({ locale, namespace: "BandcampToMp3" })
  const faqItems = t.raw("schema.faqItems") as Array<{ question: string; answer: string }>
  const featureList = t.raw("schema.featureList") as string[]

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("schema.name"),
    description: t("schema.description"),
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
    featureList,
    browserRequirements: t("schema.browserRequirements"),
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumbs.home"),
        item: "https://geekskai.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumbs.tools"),
        item:
          locale === "en" ? "https://geekskai.com/tools/" : `https://geekskai.com/${locale}/tools/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumbs.current"),
        item: baseUrl,
      },
    ],
  }

  return (
    <>
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
      {props.children}
    </>
  )
}
