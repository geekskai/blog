import { supportedLocales } from "app/i18n/routing"
import type { Metadata } from "next"

export interface UnicodeToolSeoConfig {
  slug: string
  locale: string
  title: string
  description: string
  keywords: string[]
  lastModified: Date
  featureList: string[]
  faqItems: Array<{ question: string; answer: string }>
}

export function buildUnicodeToolMetadata(config: UnicodeToolSeoConfig): Metadata {
  const { slug, locale, title, description, keywords, lastModified } = config
  const isDefaultLocale = locale === "en"
  const canonical = isDefaultLocale
    ? `https://geekskai.com/tools/${slug}/`
    : `https://geekskai.com/${locale}/tools/${slug}/`

  const languages: Record<string, string> = {
    "x-default": `https://geekskai.com/tools/${slug}/`,
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/${slug}/`
  })

  return {
    title,
    description,
    keywords,
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
      "last-modified": lastModified.toISOString(),
      "update-frequency": "monthly",
      "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export function buildUnicodeToolSchemas(config: UnicodeToolSeoConfig) {
  const { slug, locale, title, description, featureList, faqItems, lastModified } = config
  const isDefaultLocale = locale === "en"
  const url = isDefaultLocale
    ? `https://geekskai.com/tools/${slug}`
    : `https://geekskai.com/${locale}/tools/${slug}`

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
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
    featureList,
    dateModified: lastModified.toISOString().split("T")[0],
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://geekskai.com" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "https://geekskai.com/tools" },
      { "@type": "ListItem", position: 3, name: title, item: url },
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

  return {
    webApplicationSchema,
    faqSchema,
    breadcrumbSchema,
    organizationSchema,
  }
}
