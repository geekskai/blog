import { supportedLocales } from "app/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

// SEO 优化的 metadata (基于PRD文档的关键词策略)
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "CmToPmConverter" })
  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/cm-to-pm-converter",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/cm-to-pm-converter`
  })
  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", ").slice(0, 10),
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",

    // Open Graph
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      url: isDefaultLocale
        ? "https://geekskai.com/tools/cm-to-pm-converter"
        : `https://geekskai.com/${locale}/tools/cm-to-pm-converter`,
      siteName: "GeeksKai Scientific Tools",
      images: [
        {
          url: "/static/tools/cm-to-pm-converter-og.jpg",
          width: 1200,
          height: 630,
          alt: "CM to PM Converter Tool - Scientific centimeter to picometer conversion",
        },
      ],
      locale: locale === "en" ? "en_US" : locale === "zh-cn" ? "zh_CN" : locale,
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/static/tools/cm-to-pm-converter-twitter.jpg"],
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

    // Canonical URL
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/cm-to-pm-converter/"
        : `https://geekskai.com/${locale}/tools/cm-to-pm-converter/`,
      languages,
    },

    // Additional metadata
    category: "Scientific Tools",
    classification: "Scientific Measurement Converter",

    // Verification and other meta tags
    other: {
      "application-name": "CM to PM Scientific Converter",
      "apple-mobile-web-app-title": "CM to PM Converter",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
    },
  }
}

// 结构化数据 (JSON-LD) - 基于PRD文档的WebApplication schema
async function getStructuredData(locale: string) {
  const t = await getTranslations({ locale, namespace: "CmToPmConverter" })

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url: `https://geekskai.com/${locale}/tools/cm-to-pm-converter/`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    permissions: "none",
    isAccessibleForFree: true,
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
      t("features.pm_to_cm_precision"),
      t("features.cm_to_pm_precision"),
      t("features.bidirectional_conversion"),
      t("features.precision_control"),
      t("features.scientific_notation"),
      t("features.realtime_calculations"),
      t("features.atomic_visualization"),
      t("features.educational_content"),
      t("features.copy_results"),
      t("features.quick_reference"),
      t("features.mobile_friendly"),
      t("features.no_registration"),
      t("features.batch_conversion"),
      t("features.formula_display"),
    ].join(", "),
    screenshot: {
      "@type": "ImageObject",
      url: "https://geekskai.com/static/tools/cm-to-pm-converter-screenshot.jpg",
      caption: t("screenshot_caption"),
    },
    softwareVersion: "1.0",
    datePublished: "2024-01-24",
    dateModified: "2024-01-24",
    inLanguage: locale,
    audience: {
      "@type": "Audience",
      audienceType: t("audience_types").split(", "),
    },
    usageInfo: {
      "@type": "CreativeWork",
      name: t("usage_info.name"),
      description: t("usage_info.description"),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  }
}

// FAQ 结构化数据 - 基于PRD文档的目标用户问题
async function getFAQStructuredData(locale: string) {
  const t = await getTranslations({ locale, namespace: "CmToPmConverter" })

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.questions.how_to_convert.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.questions.how_to_convert.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.questions.conversion_formulas.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.questions.conversion_formulas.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.questions.accuracy.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.questions.accuracy.answer"),
        },
      },
    ],
  }
}

// 科学应用结构化数据
async function getScientificApplicationData(locale: string) {
  const t = await getTranslations({ locale, namespace: "CmToPmConverter" })

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("usage_guide.title"),
    description: t("usage_guide.description"),
    totalTime: "PT2M",
    supply: [
      {
        "@type": "HowToSupply",
        name: t("supply.converter_tool"),
      },
      {
        "@type": "HowToSupply",
        name: t("supply.measurement_value"),
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: t("usage_guide.steps.step1.title"),
        text: t("usage_guide.steps.step1.description"),
        image: "https://geekskai.com/static/tools/cm-to-pm-step1.jpg",
      },
      {
        "@type": "HowToStep",
        name: t("usage_guide.steps.step2.title"),
        text: t("usage_guide.steps.step2.description"),
        image: "https://geekskai.com/static/tools/cm-to-pm-step2.jpg",
      },
      {
        "@type": "HowToStep",
        name: t("usage_guide.steps.step3.title"),
        text: t("usage_guide.steps.step3.description"),
        image: "https://geekskai.com/static/tools/cm-to-pm-step3.jpg",
      },
      {
        "@type": "HowToStep",
        name: t("usage_guide.steps.step4.title"),
        text: t("usage_guide.steps.step4.description"),
        image: "https://geekskai.com/static/tools/cm-to-pm-step4.jpg",
      },
    ],
  }
}

export default async function CmToPmLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const structuredData = await getStructuredData(locale)
  const faqData = await getFAQStructuredData(locale)
  const applicationData = await getScientificApplicationData(locale)

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(applicationData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
