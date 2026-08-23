import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import React from "react"
import siteMetadata from "@/data/siteMetadata"
import { buildPageSchema, SEO_ENTITY_IDS, serializeJsonLd } from "@/lib/seo"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: "VinDecoder" })
  const isDefaultLocale = locale === "en"

  const languages: Record<string, string> = {
    "x-default": "https://geekskai.com/tools/vin-decoder/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] =
      loc === "en"
        ? `https://geekskai.com/tools/vin-decoder/`
        : `https://geekskai.com/${loc}/tools/vin-decoder/`
  })

  // Content freshness metadata - Update this monthly
  const lastModified = new Date("2026-05-26")

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      url: isDefaultLocale
        ? "https://geekskai.com/tools/vin-decoder/"
        : `https://geekskai.com/${locale}/tools/vin-decoder/`,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/og/vin-decoder.png",
          width: 1200,
          height: 630,
          alt: t("structured_data.name"),
        },
      ],
      locale: locale.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/static/images/og/vin-decoder.png"],
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/vin-decoder/"
        : `https://geekskai.com/${locale}/tools/vin-decoder/`,
      languages: {
        ...languages,
      },
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

export default async function VinDecoderLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const t = await getTranslations({ locale, namespace: "VinDecoder" })
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale
    ? `${siteMetadata.siteUrl}/tools/vin-decoder/`
    : `${siteMetadata.siteUrl}/${locale}/tools/vin-decoder/`

  // Content freshness metadata - Update this monthly
  const lastModified = new Date("2026-05-26")

  // WebApplication Schema - Enhanced for AI SEO
  const webApplicationSchema = {
    "@type": "WebApplication",
    name: t("structured_data.name"),
    description: t("structured_data.description"),
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
      "@id": SEO_ENTITY_IDS.organization,
    },
    featureList: [
      t("structured_data.feature_instant"),
      t("structured_data.feature_complete"),
      t("structured_data.feature_engine"),
      t("structured_data.feature_safety"),
      t("structured_data.feature_manufacturing"),
      t("structured_data.feature_export"),
      t("structured_data.feature_history"),
      t("structured_data.feature_no_registration"),
      t("structured_data.feature_free"),
      t("structured_data.feature_mobile"),
    ].join(", "),
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    datePublished: "2024-01-01",
    dateModified: lastModified.toISOString().split("T")[0],
  }

  const pageSchema = buildPageSchema({
    url: baseUrl,
    name: t("structured_data.name"),
    description: t("structured_data.description"),
    inLanguage: locale,
    breadcrumbs: [
      { name: t("structured_data.breadcrumb_home"), url: `${siteMetadata.siteUrl}/` },
      { name: t("structured_data.breadcrumb_tools"), url: `${siteMetadata.siteUrl}/tools/` },
      { name: t("structured_data.breadcrumb_vin_decoder"), url: baseUrl },
    ],
  })
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [...pageSchema["@graph"], webApplicationSchema],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      {children}
    </div>
  )
}
