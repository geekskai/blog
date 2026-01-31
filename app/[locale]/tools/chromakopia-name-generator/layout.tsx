import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "ChromakopiaNamGenerator" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/chromakopia-name-generator/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/chromakopia-name-generator/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("page_title") + " - " + t("page_subtitle"),
      description: t("page_description"),
      type: "website",
      images: [
        {
          url: "/static/images/chromakopia-name-generator.png",
          width: 1200,
          height: 630,
          alt: t("page_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("page_title") + " - " + t("free_tool_badge"),
      description: t("page_description"),
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/chromakopia-name-generator/"
        : `https://geekskai.com/${locale}/tools/chromakopia-name-generator/`,
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
  const t = await getTranslations({ locale, namespace: "ChromakopiaNamGenerator" })

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("page_title"),
    description: t("page_description"),
    url: "https://geekskai.com/tools/chromakopia-name-generator",
    applicationCategory: "Entertainment",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Generate Chromakopia-inspired names",
      "Create colorful persona descriptions",
      "Multiple name generation styles",
      "Color-themed character traits",
      "St. Chroma alter ego inspiration",
      "Creative writing prompts",
      "Share generated names",
      "No registration required",
      "Mobile-friendly interface",
      "Instant name generation",
    ].join(", "),
    softwareRequirements: "Modern web browser with JavaScript enabled",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("seo_keywords"),
    educationalUse:
      "Creative Writing, Character Development, Artistic Expression, Music-Inspired Creativity",
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
