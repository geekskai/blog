import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Random4DigitNumberGenerator" })
  const isDefaultLocale = locale === "en"

  const title = t("seo_title")
  const description = t("seo_description")

  const baseUrl = "https://geekskai.com"
  const toolPath = "/tools/random-4-digit-number-generator/"
  const canonicalUrl = isDefaultLocale ? `${baseUrl}${toolPath}` : `${baseUrl}/${locale}${toolPath}`

  // Generate language alternates for better international SEO
  const languages: Record<string, string> = {
    "x-default": `${baseUrl}${toolPath}`,
    en: `${baseUrl}${toolPath}`,
    ja: `${baseUrl}/ja${toolPath}`,
    ko: `${baseUrl}/ko${toolPath}`,
    no: `${baseUrl}/no${toolPath}`,
    da: `${baseUrl}/da${toolPath}`,
    "zh-CN": `${baseUrl}/zh-cn${toolPath}`,
  }

  return {
    title,
    description,
    keywords: [],
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
          url: `${baseUrl}/static/images/og/random-4-digit-number-generator.png`,
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
      images: [`${baseUrl}/static/images/og/random-4-digit-number-generator.png`],
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
    category: "Technology",
  }
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "Random4DigitNumberGenerator" })
  const isDefaultLocale = locale === "en"

  // Enhanced JSON-LD Structured Data for better SEO
  const baseUrl = "https://geekskai.com"
  const toolPath = "/tools/random-4-digit-number-generator"
  const fullUrl = isDefaultLocale ? `${baseUrl}${toolPath}` : `${baseUrl}/${locale}${toolPath}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("json_ld.name"),
    alternateName: t("json_ld.alternate_names")
      .split(", ")
      .filter((name: string) => name.trim()),
    description: t("json_ld.description"),
    url: fullUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    permissions: "none",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    datePublished: "2024-10-26",
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: locale,
    availableLanguage: ["en", "ja", "ko", "no", "da", "zh-CN"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2099-12-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      t("json_ld.feature_list.crypto_secure"),
      t("json_ld.feature_list.single_bulk"),
      t("json_ld.feature_list.custom_range"),
      t("json_ld.feature_list.multiple_formats"),
      t("json_ld.feature_list.exclusion_rules"),
      t("json_ld.feature_list.export_formats"),
      t("json_ld.feature_list.no_duplicates"),
      t("json_ld.feature_list.history"),
      t("json_ld.feature_list.statistics"),
      t("json_ld.feature_list.mobile_friendly"),
      t("json_ld.feature_list.no_registration"),
      t("json_ld.feature_list.free"),
      t("json_ld.feature_list.privacy"),
      t("json_ld.feature_list.instant"),
    ],
    softwareRequirements: "Modern web browser with JavaScript enabled",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("json_ld.keywords"),
    educationalUse: t("json_ld.educational_use"),
    audience: {
      "@type": "Audience",
      audienceType: t("json_ld.audience_type"),
    },
    isAccessibleForFree: true,
    accessMode: ["textual", "visual"],
    accessibilityFeature: ["alternativeText", "readingOrder", "structuralNavigation"],
    usageInfo: t("json_ld.usage_info"),
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.items.how_random.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.how_random.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.no_duplicates.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.no_duplicates.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.is_free.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.is_free.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.store_numbers.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.store_numbers.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.items.browsers_supported.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.items.browsers_supported.answer"),
        },
      },
    ],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </div>
  )
}
