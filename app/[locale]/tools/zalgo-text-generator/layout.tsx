import React from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import {
  buildUnicodeToolMetadata,
  buildUnicodeToolSchemas,
} from "../upside-down-text-generator/lib/seo"

const LAST_MODIFIED = new Date("2026-04-21")
const SLUG = "zalgo-text-generator"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "ZalgoTextGenerator" })

  const faqItems = [
    {
      question: t("faq.items.0.q"),
      answer: t("faq.items.0.a"),
    },
    {
      question: t("faq.items.1.q"),
      answer: t("faq.items.1.a"),
    },
    {
      question: t("faq.items.2.q"),
      answer: t("faq.items.2.a"),
    },
  ]

  return buildUnicodeToolMetadata({
    slug: SLUG,
    locale,
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    lastModified: LAST_MODIFIED,
    featureList: [
      t("feature_list.0"),
      t("feature_list.1"),
      t("feature_list.2"),
      t("feature_list.3"),
    ],
    faqItems,
  })
}

export default async function ZalgoTextGeneratorLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "ZalgoTextGenerator" })

  const faqItems = [
    {
      question: t("faq.items.0.q"),
      answer: t("faq.items.0.a"),
    },
    {
      question: t("faq.items.1.q"),
      answer: t("faq.items.1.a"),
    },
    {
      question: t("faq.items.2.q"),
      answer: t("faq.items.2.a"),
    },
  ]

  const schemas = buildUnicodeToolSchemas({
    slug: SLUG,
    locale,
    title: t("page_title"),
    description: t("page_subtitle"),
    keywords: [t("keyword_label")],
    lastModified: LAST_MODIFIED,
    featureList: [
      t("feature_list_schemas.0"),
      t("feature_list_schemas.1"),
      t("feature_list_schemas.2"),
      t("feature_list_schemas.3"),
    ],
    faqItems,
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
