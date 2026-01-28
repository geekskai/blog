import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "app/i18n/routing"

// Content freshness metadata - AI搜索时代关键信号
const lastModified = new Date("2026-01-25")
const updateFrequency = "monthly" as const
const nextReviewDate = new Date("2026-02-25")

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "InsideOut2GluedToPhoneTest" })
  const isDefaultLocale = locale === "en"

  const title = t("seo_title")
  const description = t("seo_description")
  const keywords = t("seo_keywords").split(", ")

  const baseUrl = "https://geekskai.com"
  const toolPath = "/tools/inside-out-2-glued-to-phone-test/"
  const canonicalUrl = isDefaultLocale ? `${baseUrl}${toolPath}` : `${baseUrl}/${locale}${toolPath}`

  // Generate language alternates for better international SEO
  const languages: Record<string, string> = {
    "x-default": `${baseUrl}${toolPath}`,
  }

  supportedLocales.forEach((loc: string) => {
    languages[loc] = `${baseUrl}/${loc}${toolPath}`
  })

  return {
    title,
    description,
    keywords,
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "GeeksKai",
      locale: locale === "zh-cn" ? "zh_CN" : locale.replace("-", "_"),
      images: [
        {
          url: `${baseUrl}/static/images/og/inside-out-2-glued-to-phone-test-og.png`,
          width: 1200,
          height: 630,
          alt: t("og_image_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@geekskai",
      creator: "@geekskai",
      images: [`${baseUrl}/static/images/og/inside-out-2-glued-to-phone-test-og.png`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "Tools",
    // Content freshness metadata - AI搜索时代关键信号
    other: {
      "last-modified": lastModified.toISOString(),
      "update-frequency": updateFrequency,
      "next-review": nextReviewDate.toISOString(),
    },
  }
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "InsideOut2GluedToPhoneTest" })
  const isDefaultLocale = locale === "en"

  const baseUrl = "https://geekskai.com"
  const toolPath = "/tools/inside-out-2-glued-to-phone-test/"
  const fullUrl = isDefaultLocale ? `${baseUrl}${toolPath}` : `${baseUrl}/${locale}${toolPath}`

  // Helper function to strip HTML tags for structured data
  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, "")
  }

  // FAQ 结构化数据 - 基于 SEO 指南最佳实践
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq_question_1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(t("faq_answer_1")),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(t("faq_answer_2")),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(t("faq_answer_3")),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_4"),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(t("faq_answer_4")),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_5"),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(t("faq_answer_5")),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_6"),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(t("faq_answer_6")),
        },
      },
      {
        "@type": "Question",
        name: t("faq_question_7"),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(t("faq_answer_7")),
        },
      },
    ],
  }

  // Breadcrumb 结构化数据
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb_home"),
        item: "https://geekskai.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb_tools"),
        item: "https://geekskai.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb_test"),
        item: fullUrl,
      },
    ],
  }

  // 增强的结构化数据 - WebApplication + Quiz Schema
  const quizStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("structured_data_name"),
    description: t("structured_data_description"),
    url: fullUrl,
    image: `${baseUrl}/static/images/og/inside-out-2-glued-to-phone-test-og.png`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    permissions: "none",
    datePublished: "2025-01-01",
    dateModified: lastModified.toISOString().split("T")[0],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      t("structured_data_feature_list_1"),
      t("structured_data_feature_list_2"),
      t("structured_data_feature_list_3"),
      t("structured_data_feature_list_4"),
      t("structured_data_feature_list_5"),
      t("structured_data_feature_list_6"),
      t("structured_data_feature_list_7"),
      t("structured_data_feature_list_8"),
      t("structured_data_feature_list_9"),
      t("structured_data_feature_list_10"),
      t("structured_data_feature_list_11"),
      t("structured_data_feature_list_12"),
      t("structured_data_feature_list_13"),
      t("structured_data_feature_list_14"),
      t("structured_data_feature_list_15"),
    ],
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://geekskai.com/static/logo.png",
      },
    },
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    publisher: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    about: [
      {
        "@type": "Thing",
        name: t("structured_data_about_phone_addiction"),
      },
      {
        "@type": "Thing",
        name: t("structured_data_about_inside_out_2"),
      },
      {
        "@type": "Thing",
        name: t("structured_data_about_digital_wellness"),
      },
      {
        "@type": "Thing",
        name: t("structured_data_about_emotion_analysis"),
      },
      {
        "@type": "Thing",
        name: t("structured_data_about_disney_pixar"),
      },
    ],
    keywords: t("structured_data_keywords"),
    inLanguage: locale === "zh-cn" ? "zh-CN" : locale,
    isAccessibleForFree: true,
    educationalUse: t("structured_data_educational_use"),
    targetAudience: {
      "@type": "Audience",
      audienceType: t("structured_data_audience_type"),
    },
  }

  return (
    <>
      {/* WebApplication 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quizStructuredData),
        }}
      />
      {/* FAQ 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      {/* Breadcrumb 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      {children}
    </>
  )
}
