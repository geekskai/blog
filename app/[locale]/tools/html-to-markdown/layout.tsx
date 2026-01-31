import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

// Content freshness - Update this monthly
const lastModified = new Date("2026-01-14") // Update current date

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "HtmlToMarkdown" })
  const tStructured = await getTranslations({
    locale,
    namespace: "HtmlToMarkdown.structured_data",
  })

  const isDefaultLocale = locale === "en"

  const languages: Record<string, string> = {
    "x-default": "https://geekskai.com/tools/html-to-markdown/",
  }

  supportedLocales.forEach((loc: string) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/html-to-markdown/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      images: [
        {
          url: "/static/images/html-to-markdown-converter.png",
          width: 1200,
          height: 630,
          alt: tStructured("name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/html-to-markdown/"
        : `https://geekskai.com/${locale}/tools/html-to-markdown/`,
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

// JSON-LD Structured Data - Enhanced for AI search optimization
async function getJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: "HtmlToMarkdown.structured_data" })

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("name"),
    description: t("description"),
    url: `https://geekskai.com/${locale === "en" ? "" : `${locale}/`}tools/html-to-markdown`,
    applicationCategory: t("application_category"),
    operatingSystem: t("operating_system"),
    permissions: t("permissions"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: t("price_currency"),
      availability: "https://schema.org/InStock",
    },
    featureList: [
      t("feature_html_to_markdown"),
      t("feature_batch_url"),
      t("feature_raw_html"),
      t("feature_advanced_customization"),
      t("feature_table_conversion"),
      t("feature_code_block"),
      t("feature_image_link"),
      t("feature_custom_heading"),
      t("feature_list_marker"),
      t("feature_real_time_preview"),
      t("feature_download"),
      t("feature_copy_clipboard"),
      t("feature_conversion_history"),
      t("feature_mobile_responsive"),
      t("feature_no_registration"),
      t("feature_privacy_focused"),
      t("feature_lightning_fast"),
      t("feature_seo_friendly"),
      t("feature_developer_friendly"),
      t("feature_content_extraction"),
    ].join(", "),
    softwareRequirements: "Modern web browser with JavaScript enabled",
    provider: {
      "@type": "Organization",
      name: t("organization_name"),
      url: "https://geekskai.com",
      sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
    },
  }
}

async function getFaqSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "HtmlToMarkdown.structured_data" })

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq_free_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_free_a"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_elements_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_elements_a"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_multiple_urls_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_multiple_urls_a"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_customize_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_customize_a"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_security_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_security_a"),
        },
      },
    ],
  }
}

async function getBreadcrumbSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "HtmlToMarkdown.structured_data" })

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb_home"),
        item: "https://geekskai.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb_tools"),
        item: "https://geekskai.com/tools/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb_html_to_markdown"),
        item: `https://geekskai.com/${locale === "en" ? "" : `${locale}/`}tools/html-to-markdown/`,
      },
    ],
  }
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const [jsonLd, faqSchema, breadcrumbSchema] = await Promise.all([
    getJsonLd(locale),
    getFaqSchema(locale),
    getBreadcrumbSchema(locale),
  ])

  return (
    <div className="min-h-screen">
      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </div>
  )
}
