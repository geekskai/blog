import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "../../../i18n/routing"

// 动态生成多语言 metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "PixelsToInchesConverter" })

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
  const path = `/tools/pixels-to-inches/`
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  const isDefaultLocale = locale === "en"
  const languages: Record<string, string> = {
    "x-default": "https://geekskai.com/tools/pixels-to-inches/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/pixels-to-inches/`
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
          url: "/static/tools/pixels-to-inches-og.jpg",
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
      images: ["/static/tools/pixels-to-inches-twitter.jpg"],
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
        ? "https://geekskai.com/tools/pixels-to-inches/"
        : `https://geekskai.com/${locale}/tools/pixels-to-inches/`,
      languages: {
        ...languages,
      },
    },

    // Additional metadata
    category: "Tools",
    classification: "Pixel Converter",

    // Verification and other meta tags
    other: {
      "application-name": t("page_title"),
      "apple-mobile-web-app-title": t("page_title"),
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "geo.region": "GLOBAL",
      "geo.placename": "Global",
      "DC.language": ogLocale.replace("_", "-"),
    },
  }
}

export default async function PixelsToInchesLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "PixelsToInchesConverter" })

  const baseUrl = "https://geekskai.com"
  const path = `/tools/pixels-to-inches/`
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
      priceCurrency: "USD",
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
      t("features_section.two_way_conversion"),
      t("features_section.customizable_ppi"),
    ].join(", "),
    screenshot: {
      "@type": "ImageObject",
      url: "/static/tools/pixels-to-inches-screenshot.jpg",
      caption: t("seo_title"),
    },
    softwareVersion: "1.0",
    datePublished: "2024-01-24",
    dateModified: new Date().toISOString().split("T")[0],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  }

  // 动态生成 FAQ 结构化数据
  const dynamicFaqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq_section.q1_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_section.q1_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_section.q2_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_section.q2_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_section.q3_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_section.q3_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_section.q4_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_section.q4_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_section.q5_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_section.q5_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_section.q6_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_section.q6_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_section.q7_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_section.q7_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_section.q8_question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_section.q8_answer"),
        },
      },
    ],
  }

  // 动态生成 HowTo 结构化数据
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("usage_guide.title"),
    description: t("usage_guide.description"),
    step: [
      {
        "@type": "HowToStep",
        name: t("usage_guide.step_1_title"),
        text: t("usage_guide.step_1_description"),
      },
      {
        "@type": "HowToStep",
        name: t("usage_guide.step_2_title"),
        text: t("usage_guide.step_2_description"),
      },
      {
        "@type": "HowToStep",
        name: t("usage_guide.step_3_title"),
        text: t("usage_guide.step_3_description"),
      },
      {
        "@type": "HowToStep",
        name: t("usage_guide.step_4_title"),
        text: t("usage_guide.step_4_description"),
      },
    ],
  }

  // 动态生成 ConverterTool 结构化数据
  const converterToolStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("page_title"),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      t("features_section.two_way_conversion"),
      t("features_section.customizable_ppi"),
      t("features_section.precision_control"),
    ].join(", "),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
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
        name: t("breadcrumb.pixels_to_inches_converter"),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(converterToolStructuredData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
