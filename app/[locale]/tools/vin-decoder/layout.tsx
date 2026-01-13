import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Script from "next/script"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "VinDecoder" })
  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/vin-decoder/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/vin-decoder/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      url: isDefaultLocale
        ? "https://geekskai.com/tools/vin-decoder"
        : `https://geekskai.com/${locale}/tools/vin-decoder`,
      images: [
        {
          url: "/og-vin-decoder.jpg",
          width: 1200,
          height: 630,
          alt: t("structured_data.name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/twitter-vin-decoder.jpg"],
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/vin-decoder"
        : `https://geekskai.com/${locale}/tools/vin-decoder`,
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

// Structured data for SEO - will be generated in component

// FAQ structured data - will be generated in component

// Breadcrumb structured data - will be generated in component

export default async function VinDecoderLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "VinDecoder" })
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale ? "https://geekskai.com" : `https://geekskai.com/${locale}`

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("structured_data.name"),
    description: t("structured_data.description"),
    url: `${baseUrl}/${locale}/tools/vin-decoder/`,
    applicationCategory: t("structured_data.application_category"),
    operatingSystem: t("structured_data.operating_system"),
    permissions: t("structured_data.permissions"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: t("structured_data.price_currency"),
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
    ],
    creator: {
      "@type": "Organization",
      name: t("structured_data.organization_name"),
      url: "https://geekskai.com",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2847",
      bestRating: "5",
      worstRating: "1",
    },
  }

  // FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("structured_data.faq_what_is_vin_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_what_is_vin_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_where_find_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_where_find_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_free_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_free_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_info_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_info_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_accurate_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_accurate_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_country_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_country_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_not_available_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_not_available_a"),
        },
      },
      {
        "@type": "Question",
        name: t("structured_data.faq_privacy_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("structured_data.faq_privacy_a"),
        },
      },
    ],
  }

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("structured_data.breadcrumb_home"),
        item: "https://geekskai.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("structured_data.breadcrumb_tools"),
        item: "https://geekskai.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("structured_data.breadcrumb_vin_decoder"),
        item: `${baseUrl}/tools/vin-decoder`,
      },
    ],
  }

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      {children}
    </>
  )
}
