import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const revalidate = 86400 // 24 hours
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "TipScreenGenerator" })
  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/tip-screen-generator/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/tip-screen-generator/`
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
          url: "/static/images/og/tip-screen-generator.png",
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
        ? "https://geekskai.com/tools/tip-screen-generator/"
        : `https://geekskai.com/${locale}/tools/tip-screen-generator/`,
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
  const t = await getTranslations({ locale, namespace: "TipScreenGenerator" })

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("header.main_title"),
    description: t("seo_description"),
    url: `https://geekskai.com/${locale}/tools/tip-screen-generator`,
    applicationCategory: "Entertainment",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Understand tip screen psychology",
      "Learn about tip screen design patterns",
      "Generate realistic tip screens",
      "Multiple device themes (iPhone, iPad, Android)",
      "Educational content about tipping culture",
      "Dark pattern examples and analysis",
      "Screenshot and share functionality",
      "Meme creation tools",
      "No registration required",
      "Browser-based processing",
      "Mobile-friendly interface",
    ].join(", "),
    softwareRequirements: "Modern web browser with JavaScript enabled",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("seo_keywords"),
    educationalUse:
      "UX Design Education, Tipping Culture Awareness, Social Commentary, Digital Psychology",
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
