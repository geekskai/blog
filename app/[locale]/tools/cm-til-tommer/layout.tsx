import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "../../../i18n/routing"

// 动态生成多语言 metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "CmTilTommerConverter" })

  // 语言映射
  const localeMap: Record<string, string> = {
    en: "en_US",
    ja: "ja_JP",
    ko: "ko_KR",
    no: "no_NO",
    "zh-cn": "zh_CN",
    da: "da_DK",
  }

  const ogLocale = localeMap[locale] || "en_US"
  const baseUrl = "https://geekskai.com"
  const path = `/tools/cm-til-tommer/`
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/cm-til-tommer/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/cm-til-tommer/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",

    // Open Graph
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      url,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/static/tools/cm-til-tommer-og.jpg",
          width: 1200,
          height: 630,
          alt: t("seo_title"),
        },
      ],
      locale: ogLocale,
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/static/tools/cm-til-tommer-twitter.jpg"],
      creator: "@geekskai",
    },

    // Additional SEO
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

    // Canonical URL and language alternates
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/cm-til-tommer/"
        : `https://geekskai.com/${locale}/tools/cm-til-tommer/`,
      languages: {
        ...languages,
      },
    },

    // Additional metadata
    category: locale === "da" ? "Værktøjer" : locale === "no" ? "Verktøy" : "Tools",
    classification:
      locale === "da"
        ? "Målekonverter"
        : locale === "no"
          ? "Målekonverter"
          : "Measurement Converter",

    // Verification and other meta tags
    other: {
      "application-name": t("page_title"),
      "apple-mobile-web-app-title": t("page_title"),
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "geo.region": locale === "da" ? "DK" : locale === "no" ? "NO" : "GLOBAL",
      "geo.placename": locale === "da" ? "Denmark" : locale === "no" ? "Norway" : "Global",
      "DC.language": ogLocale.replace("_", "-"),
    },
  }
}

export default async function CmTilTommerLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "CmTilTommerConverter" })

  const baseUrl = "https://geekskai.com"
  const path = `/tools/cm-til-tommer/`
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  // 动态生成结构化数据
  const dynamicStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("page_title"),
    description: t("seo_description"),
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    permissions: "none",
    isAccessibleForFree: true,
    inLanguage: [locale === "da" ? "da-DK" : locale === "no" ? "nb-NO" : "en-US"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: locale === "da" ? "DKK" : locale === "no" ? "NOK" : "USD",
    },
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://geekskai.com/static/logo.png",
      },
    },
    featureList: [
      t("converter_card.title"),
      t("converter_card.description"),
      t("quick_reference.title"),
      t("educational_content.common_uses.title"),
    ].join(", "),
    screenshot: {
      "@type": "ImageObject",
      url: "/static/tools/cm-til-tommer-screenshot.jpg",
      caption: t("seo_title"),
    },
    softwareVersion: "1.0",
    datePublished: "2024-01-24",
    dateModified: new Date().toISOString().split("T")[0],
  }

  // 动态生成 FAQ 结构化数据
  const dynamicFaqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("content_sections.faq_how_convert"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq_how_convert_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("content_sections.faq_conversion_formula"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq_conversion_formula_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("content_sections.faq_inches_same_as_international"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq_inches_same_as_international_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("content_sections.faq_why_need_converter"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq_why_need_converter_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("content_sections.faq_is_free"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("content_sections.faq_is_free_answer"),
        },
      },
    ],
  }

  // 动态生成面包屑结构化数据
  const dynamicBreadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: `${baseUrl}${locale === "en" ? "" : `/${locale}`}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb.cm_to_inches_converter"),
        item: url,
      },
    ],
  }

  return (
    <>
      {/* 动态结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dynamicStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dynamicFaqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dynamicBreadcrumbStructuredData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
