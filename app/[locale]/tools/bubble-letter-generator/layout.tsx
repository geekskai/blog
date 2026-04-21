import React from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import {
  buildUnicodeToolMetadata,
  buildUnicodeToolSchemas,
} from "../upside-down-text-generator/lib/seo"

const LAST_MODIFIED = new Date("2026-04-21")
const SLUG = "bubble-letter-generator"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "BubbleTextGenerator" })
  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>

  return buildUnicodeToolMetadata({
    slug: SLUG,
    locale,
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords")
      .split(",")
      .map((k: string) => k.trim()),
    lastModified: LAST_MODIFIED,
    featureList: t.raw("feature_list"),
    faqItems: faqItems.map((item) => ({ question: item.q, answer: item.a })),
  })
}

export default async function BubbleTextGeneratorLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "BubbleTextGenerator" })
  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>

  const schemas = buildUnicodeToolSchemas({
    slug: SLUG,
    locale,
    title: t("page_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords")
      .split(",")
      .map((k: string) => k.trim()),
    lastModified: LAST_MODIFIED,
    featureList: t.raw("feature_list_schemas"),
    faqItems: faqItems.map((item) => ({ question: item.q, answer: item.a })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organizationSchema) }}
      />
      {children}
    </>
  )
}
