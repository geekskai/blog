import React from "react"
import { Metadata } from "next"
import { supportedLocales } from "app/i18n/routing"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "JsonToTable" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/json-to-table/",
  }

  supportedLocales.forEach((loc: string) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/json-to-table/`
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
          url: "/static/images/json-to-table-converter.png",
          width: 1200,
          height: 630,
          alt: t("seo_title"),
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
        ? "https://geekskai.com/tools/json-to-table/"
        : `https://geekskai.com/${locale}/tools/json-to-table/`,
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

// JSON-LD Structured Data for SEO
async function generateJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: "JsonToTable" })

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url: `https://geekskai.com/${locale === "en" ? "" : `${locale}/`}tools/json-to-table`,
    applicationCategory: "Utility",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Convert JSON to HTML table format instantly",
      "Convert JSON to ASCII table format",
      "Convert JSON to Excel (XLSX) format",
      "Transform nested JSON objects to tables",
      "Convert JSON arrays to structured tables",
      "Browser-based JSON to table conversion",
      "No file upload to servers required",
      "Free unlimited JSON table conversion",
      "Support for complex JSON structures",
      "Advanced table customization options",
      "Real-time JSON table preview",
      "Download converted tables in multiple formats",
      "Copy JSON tables to clipboard",
      "Professional JSON table generator",
      "Preserve JSON data structure in tables",
      "Mobile responsive JSON converter",
      "No registration required for conversion",
      "Privacy focused JSON processing",
      "Lightning fast JSON to table conversion",
      "Developer-friendly JSON table tool",
      "Multiple JSON input methods supported",
      "Customizable table output formats",
      "JSON file upload support",
      "JSON URL fetching capability",
      "Batch JSON processing",
    ],
    softwareRequirements: "Modern web browser with JavaScript enabled",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("seo_keywords"),
    educationalUse:
      "Data Analysis, Web Development, API Documentation, Database Design, Report Generation, Data Visualization, Technical Documentation, Software Development, JSON Data Processing",
    targetAudience: {
      "@type": "Audience",
      audienceType:
        "Web Developers, Data Analysts, Software Engineers, API Developers, Database Administrators, Technical Writers, Data Scientists, Backend Developers, Frontend Developers, JSON Developers",
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "JSON to Table Converter Tool",
      applicationCategory: "Productivity Software",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "2150",
      },
    },
    potentialAction: [
      {
        "@type": "ConvertAction",
        name: "Convert JSON to Table",
        description:
          "Convert JSON data to HTML, ASCII, or Excel table formats with preserved structure",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://geekskai.com/tools/json-to-table/",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
      },
    ],
    sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
  }
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const jsonLd = await generateJsonLd(locale)

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
