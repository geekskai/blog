import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "app/i18n/routing"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "RandomSSNGenerator" })
  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/random-ssn-generator/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/random-ssn-generator/`
  })

  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
    keywords: t("metadata_keywords").split(", "),
    openGraph: {
      title: t("metadata_og_title"),
      description: t("metadata_og_description"),
      type: "website",
      images: [
        {
          url: "/static/images/og/random-ssn-generator.png",
          width: 1200,
          height: 630,
          alt: t("metadata_og_image_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata_twitter_title"),
      description: t("metadata_twitter_description"),
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/random-ssn-generator/"
        : `https://geekskai.com/${locale}/tools/random-ssn-generator/`,
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
  }
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "RandomSSNGenerator" })

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("schema_name"),
    description: t("schema_description"),
    url: `https://geekskai.com/${locale}/tools/random-ssn-generator`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      t("schema_feature_1"),
      t("schema_feature_2"),
      t("schema_feature_3"),
      t("schema_feature_4"),
      t("schema_feature_5"),
      t("schema_feature_6"),
      t("schema_feature_7"),
      t("schema_feature_8"),
      t("schema_feature_9"),
      t("schema_feature_10"),
      t("schema_feature_11"),
      t("schema_feature_12"),
    ].join(", "),
    softwareRequirements: t("schema_software_requirements"),
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("schema_keywords"),
    educationalUse: t("schema_educational_use"),
    audience: {
      "@type": "Audience",
      audienceType: t("schema_audience_type"),
    },
    isAccessibleForFree: true,
    accessMode: ["textual", "visual"],
    accessibilityFeature: ["alternativeText", "readingOrder", "structuralNavigation"],
    usageInfo: t("schema_usage_info"),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  )
}
