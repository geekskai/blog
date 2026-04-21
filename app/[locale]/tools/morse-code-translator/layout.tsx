import React from "react"
import { Metadata } from "next"
import { supportedLocales } from "app/i18n/routing"
import { getTranslations } from "next-intl/server"

const BASE_URL = "https://geekskai.com"
const TOOL_PATH = "/tools/morse-code-translator/"
const LAST_MODIFIED = new Date("2026-04-21")
const FAQ_ITEM_KEYS = [
  "faq_1",
  "faq_2",
  "faq_3",
  "faq_4",
  "faq_5",
  "faq_6",
  "faq_7",
  "faq_8",
  "faq_9",
  "faq_10",
  "faq_11",
  "faq_12",
] as const

function getCanonical(locale: string) {
  return locale === "en" ? `${BASE_URL}${TOOL_PATH}` : `${BASE_URL}/${locale}${TOOL_PATH}`
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "MorseCodeTranslator" })
  const canonical = getCanonical(locale)
  const title = t("seo.title")
  const description = t("seo.description")

  const languages: Record<string, string> = {
    "x-default": `${BASE_URL}${TOOL_PATH}`,
  }
  supportedLocales.forEach((loc) => {
    languages[loc] = loc === "en" ? `${BASE_URL}${TOOL_PATH}` : `${BASE_URL}/${loc}${TOOL_PATH}`
  })

  return {
    title,
    description,
    keywords: t("seo.keywords").split(", "),
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
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/static/og-images/tools.jpg",
          width: 1200,
          height: 630,
          alt: t("seo.og_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/static/og-images/tools.jpg"],
      creator: "@geekskai",
    },
    alternates: {
      canonical,
      languages,
    },
    other: {
      "last-modified": LAST_MODIFIED.toISOString(),
      "update-frequency": "monthly",
      "next-review": new Date(LAST_MODIFIED.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export default async function MorseCodeGeneratorLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "MorseCodeTranslator" })
  const canonical = getCanonical(locale)
  const faqItems = FAQ_ITEM_KEYS.map((key) => ({
    question: t(`${key}.question`),
    answer: t(`${key}.answer`),
  }))

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("schema.webapp_name"),
    alternateName: t("schema.alternate_names").split(", "),
    description: t("seo.description"),
    url: canonical,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      t("schema.feature_1"),
      t("schema.feature_2"),
      t("schema.feature_3"),
      t("schema.feature_4"),
      t("schema.feature_5"),
      t("schema.feature_6"),
      t("schema.feature_7"),
    ].join(", "),
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: BASE_URL,
    },
    dateModified: LAST_MODIFIED.toISOString().slice(0, 10),
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
        name: t("breadcrumb.home"),
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: `${BASE_URL}/tools/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb.current"),
        item: canonical,
      },
    ],
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("schema.howto_name"),
    description: t("schema.howto_description"),
    totalTime: "PT1M",
    tool: [
      {
        "@type": "HowToTool",
        name: t("schema.webapp_name"),
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: t("schema.howto_step_1_name"),
        text: t("schema.howto_step_1_text"),
      },
      {
        "@type": "HowToStep",
        name: t("schema.howto_step_2_name"),
        text: t("schema.howto_step_2_text"),
      },
      {
        "@type": "HowToStep",
        name: t("schema.howto_step_3_name"),
        text: t("schema.howto_step_3_text"),
      },
      {
        "@type": "HowToStep",
        name: t("schema.howto_step_4_name"),
        text: t("schema.howto_step_4_text"),
      },
    ],
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("schema.itemlist_name"),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: 8,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("schema.itemlist_1") },
      { "@type": "ListItem", position: 2, name: t("schema.itemlist_2") },
      { "@type": "ListItem", position: 3, name: t("schema.itemlist_3") },
      { "@type": "ListItem", position: 4, name: t("schema.itemlist_4") },
      { "@type": "ListItem", position: 5, name: t("schema.itemlist_5") },
      { "@type": "ListItem", position: 6, name: t("schema.itemlist_6") },
      { "@type": "ListItem", position: 7, name: t("schema.itemlist_7") },
      { "@type": "ListItem", position: 8, name: t("schema.itemlist_8") },
    ],
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GeeksKai",
    url: BASE_URL,
    sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {children}
    </>
  )
}
