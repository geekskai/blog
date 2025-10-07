import { supportedLocales } from "app/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

// SEO 优化的 metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "CmToTommerConverter" })

  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/cm-to-tommer-converter/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/cm-to-tommer-converter/`
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
      url: isDefaultLocale
        ? "https://geekskai.com/tools/cm-to-tommer-converter/"
        : `https://geekskai.com/${locale}/tools/cm-to-tommer-converter/`,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/og-images/cm-to-tommer-converter.jpg",
          width: 1200,
          height: 630,
          alt: "CM to Tommer Converter Tool - Convert centimeters to tommer instantly",
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
      images: ["/og-images/cm-to-tommer-converter.jpg"],
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
        ? "https://geekskai.com/tools/cm-to-tommer-converter/"
        : `https://geekskai.com/${locale}/tools/cm-to-tommer-converter/`,
      languages: {
        ...languages,
      },
    },

    // Additional metadata
    category: "Tools",
    classification: "Measurement Converter",

    // Verification and other meta tags
    other: {
      "application-name": t("structured_data.web_application.name"),
      "apple-mobile-web-app-title": "CM to Tommer",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
    },
  }
}

// 结构化数据 (JSON-LD)
function getStructuredData(locale: string, t: any) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("structured_data.web_application.name"),
    description: t("structured_data.web_application.description"),
    url: `https://geekskai.com/${locale}/tools/cm-to-tommer-converter/`,
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
      t("structured_data.web_application.feature_1"),
      t("structured_data.web_application.feature_2"),
      t("structured_data.web_application.feature_3"),
      t("structured_data.web_application.feature_4"),
      t("structured_data.web_application.feature_5"),
      t("structured_data.web_application.feature_6"),
      t("structured_data.web_application.feature_7"),
      t("structured_data.web_application.feature_8"),
    ],
    screenshot: {
      "@type": "ImageObject",
      url: "https://geekskai.com/static/tools/cm-to-tommer-converter-screenshot.jpg",
      caption: "CM to Tommer Converter interface showing conversion from centimeters to tommer",
    },
    softwareVersion: "1.0",
    datePublished: "2024-01-24",
    dateModified: "2024-01-24",
    inLanguage: "en-US",
    audience: {
      "@type": "Audience",
      audienceType: [
        t("structured_data.web_application.audience_type_1"),
        t("structured_data.web_application.audience_type_2"),
        t("structured_data.web_application.audience_type_3"),
        t("structured_data.web_application.audience_type_4"),
        t("structured_data.web_application.audience_type_5"),
        t("structured_data.web_application.audience_type_6"),
      ],
    },
    usageInfo: {
      "@type": "CreativeWork",
      name: t("structured_data.web_application.usage_info.name"),
      description: t("structured_data.web_application.usage_info.description"),
    },
  }
}

// FAQ 结构化数据
function getFaqStructuredData(t: any) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("structured_data.faq_page.question_1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_page.answer_1"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_page.question_2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_page.answer_2"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_page.question_3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_page.answer_3"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_page.question_4"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_page.answer_4"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_page.question_5"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_page.answer_5"),
        },
      },
    ],
  }
}

export default async function CmToTommerLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "CmToTommerConverter" })

  const structuredData = getStructuredData(locale, t)
  const faqStructuredData = getFaqStructuredData(t)

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
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
