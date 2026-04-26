import { supportedLocales } from "app/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import React from "react"

const TOOL_SLUG = "upside-down-text-generator"
const LAST_MODIFIED = new Date("2026-04-26")

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: "UpsideDownTextGenerator" })
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

  const title = t("seo_title")
  const description = t("seo_description")

  return {
    title,
    description,
    keywords: t("seo_keywords").split(", "),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/og/upside-down-text-generator.png",
          width: 1200,
          height: 630,
          alt: "Upside down text generator interface preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@geekskai",
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
      "last-modified": LAST_MODIFIED.toISOString(),
      "update-frequency": "monthly",
      "next-review": new Date(LAST_MODIFIED.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export default async function UpsideDownTextGeneratorLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const t = await getTranslations({ locale, namespace: "UpsideDownTextGenerator" })
  const isDefaultLocale = locale === "en"
  const url = isDefaultLocale
    ? `https://geekskai.com/tools/${TOOL_SLUG}`
    : `https://geekskai.com/${locale}/tools/${TOOL_SLUG}`

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    featureList: t.raw("feature_list_schemas"),
    dateModified: LAST_MODIFIED.toISOString().split("T")[0],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.raw("faq.items").map((item: { q: string; a: string }) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
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
        name: "Home",
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
        name: t("keyword_label"),
        item: url,
      },
    ],
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "geeks.kai@gmail.com",
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  )
}
