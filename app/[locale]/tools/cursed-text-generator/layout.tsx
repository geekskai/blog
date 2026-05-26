import React from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import {
  buildUnicodeToolMetadata,
  buildUnicodeToolSchemas,
} from "../upside-down-text-generator/lib/seo"

const LAST_MODIFIED = new Date("2026-05-26")
const SLUG = "cursed-text-generator"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: "CursedTextGenerator" })

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
  })
}

export default async function CursedTextGeneratorLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const t = await getTranslations({ locale, namespace: "CursedTextGenerator" })

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
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webApplicationSchema) }}
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
