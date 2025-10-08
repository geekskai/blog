import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "app/i18n/routing"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "RandomVinGenerator" })
  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/random-vin-generator/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/random-vin-generator/`
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
          url: "/static/images/random-vin-generator.png",
          width: 1200,
          height: 630,
          alt: "Random VIN Generator Tool",
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
        ? "https://geekskai.com/tools/random-vin-generator/"
        : `https://geekskai.com/${locale}/tools/random-vin-generator/`,
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
  const t = await getTranslations({ locale, namespace: "RandomVinGenerator" })

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url: `https://geekskai.com/${locale}/tools/random-vin-generator`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "ISO 3779 compliant VIN generation",
      "Valid check digit calculation",
      "Manufacturer code database",
      "Educational content about VIN structure",
      "Batch processing capabilities",
      "Export in multiple formats (TXT, CSV, JSON)",
      "Real-time validation feedback",
      "Automotive testing focused",
      "No registration required",
      "Browser-based processing",
      "Mobile-friendly interface",
      "Professional testing tool",
    ],
    softwareRequirements: "Modern web browser with JavaScript enabled",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("seo_keywords"),
    educationalUse:
      "Automotive Software Development, VIN Validation Learning, Testing Methodology, Data Structure Education",
    audience: {
      "@type": "Audience",
      audienceType: "Software Developers",
    },
    isAccessibleForFree: true,
    accessMode: ["textual", "visual"],
    accessibilityFeature: ["alternativeText", "readingOrder", "structuralNavigation"],
    usageInfo:
      "For testing and development purposes only. Generated VINs do not correspond to real vehicles.",
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
