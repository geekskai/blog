import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "../../../i18n/routing"
import React from "react"
// 动态生成多语言 metadata
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: "BoardFootCalculator" })

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
  const path = `/tools/board-foot-calculator/`
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/board-foot-calculator/",
  }
  const lastModified = new Date("2026-05-26")

  supportedLocales.forEach((locale) => {
    languages[locale] =
      locale === "en"
        ? `https://geekskai.com/tools/board-foot-calculator/`
        : `https://geekskai.com/${locale}/tools/board-foot-calculator/`
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
          url: "/static/tools/board-foot-calculator-og.jpg",
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
      images: ["/static/tools/board-foot-calculator-twitter.jpg"],
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

    // Canonical URL and alternates
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/board-foot-calculator/"
        : `https://geekskai.com/${locale}/tools/board-foot-calculator/`,
      languages: {
        ...languages,
      },
    },

    // Additional metadata
    category: "Tools",
    classification: "Construction Calculator",

    // Verification and other meta tags
    other: {
      "application-name": t("page_title"),
      "apple-mobile-web-app-title": t("page_title"),
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "last-modified": lastModified.toISOString(),
    },
  }
}

// FAQ 结构化数据

// 工具特定的结构化数据
const toolStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Professional Board Foot Calculator",
  description: "Calculate lumber board feet and estimate wood project costs",
  applicationCategory: "CalculatorApplication",
  operatingSystem: "Web Browser",
  url: "https://geekskai.com/tools/board-foot-calculator/",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Board foot calculation",
    "Lumber cost estimation",
    "Project management",
    "Multiple unit support",
    "Export capabilities",
  ].join(", "),
  screenshot: "https://geekskai.com/static/tools/board-foot-calculator-screenshot.jpg",
}

// 教育内容结构化数据
const educationalStructuredData = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Board Foot Calculation Guide",
  description: "Comprehensive guide to understanding and calculating lumber board feet",
  educationalLevel: "Beginner to Professional",
  learningResourceType: "Tutorial",
  teaches: [
    "Board foot calculation formula",
    "Lumber measurement techniques",
    "Cost estimation methods",
    "Wood species selection",
    "Project planning strategies",
  ],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: [
      "Construction workers",
      "Woodworkers",
      "Students",
      "DIY enthusiasts",
      "Professional contractors",
    ],
  },
}

export default async function BoardFootCalculatorLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const t = await getTranslations({ locale, namespace: "BoardFootCalculator" })

  const baseUrl = "https://geekskai.com"
  const path = `/tools/board-foot-calculator/`
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
      logo: {
        "@type": "ImageObject",
        url: "https://geekskai.com/static/logos.png",
      },
    },
    featureList: [
      "Board foot calculation (Length × Width × Thickness ÷ 144)",
      "Imperial and metric unit support",
      "Lumber cost estimation",
      "Multi-piece project management",
      "Precision control (0-3 decimal places)",
      "Wood species pricing database",
      "Waste factor calculations",
      "Project export (CSV, PDF)",
      "Copy results to clipboard",
      "Common lumber dimensions reference",
      "Educational content and tutorials",
      "Mobile-friendly interface",
      "No registration required",
      "Professional-grade accuracy",
    ].join(", "),
    screenshot: {
      "@type": "ImageObject",
      url: "https://geekskai.com/static/tools/board-foot-calculator-screenshot.jpg",
      caption: "Board Foot Calculator interface showing lumber calculation and cost estimation",
    },
    softwareVersion: "1.0",
    datePublished: "2024-01-24",
    dateModified: "2024-01-24",
    inLanguage: locale,
    audience: {
      "@type": "Audience",
      audienceType: [
        "Woodworkers",
        "Construction contractors",
        "Furniture makers",
        "Cabinet makers",
        "Architects",
        "Engineers",
        "Lumber dealers",
        "DIY enthusiasts",
        "Construction students",
        "Home builders",
        "Carpenters",
        "Project managers",
      ],
    },
  }

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dynamicStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toolStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalStructuredData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
