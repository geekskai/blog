import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "InvincibleTitleCardGenerator" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/invincible-title-card-generator/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/invincible-title-card-generator/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("page_title"),
      description: t("page_description"),
      type: "website",
      images: [
        {
          url: "/static/images/og/invincible-title-card-generator.png",
          width: 1200,
          height: 630,
          alt: t("page_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("page_title"),
      description: t("page_description"),
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/invincible-title-card-generator/"
        : `https://geekskai.com/${locale}/tools/invincible-title-card-generator/`,
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

// JSON-LD Structured Data
const getJsonLd = (t: any) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: t("page_title"),
  description: t("page_description"),
  url: "https://geekskai.com/tools/invincible-title-card-generator",
  applicationCategory: "Entertainment",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Custom text input",
    "Color customization",
    "Background selection",
    "Character presets",
    "Font size control",
    "Text outline effects",
    "Subtitle support",
    "High-quality download",
    "Mobile-friendly interface",
    "No registration required",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords: t("seo_keywords"),
  educationalUse: "Fan Content Creation, Graphic Design, Video Production, Creative Projects",
})

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "InvincibleTitleCardGenerator" })
  const jsonLd = getJsonLd(t)

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
