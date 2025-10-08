import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "DiscordTimestampGenerator" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/discord-timestamp-generator/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/discord-timestamp-generator/`
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
          url: "/static/images/og/discord-timestamp-generator-og.png",
          width: 1200,
          height: 630,
          alt: t("seo_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/static/images/og/discord-timestamp-generator-og.png"],
      title: t("seo_title"),
      description: t("seo_description"),
    },
    icons: {
      icon: "/static/images/favicon.ico",
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/discord-timestamp-generator/"
        : `https://geekskai.com/${locale}/tools/discord-timestamp-generator/`,
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
  const t = await getTranslations({ locale, namespace: "DiscordTimestampGenerator" })

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url: "https://geekskai.com/tools/discord-timestamp-generator",
    image: "https://geekskai.com/static/images/og/discord-timestamp-generator-og.png",
    applicationCategory: "Communication",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Dynamic Discord timestamp generation",
      "Real-time countdown creation",
      "Multiple Discord timestamp formats",
      "Event reminder generation",
      "Timezone-aware timestamp creation",
      "Live preview with Discord simulation",
      "Relative time calculations",
      "Absolute date input options",
      "Quick preset configurations",
      "One-click copy functionality",
      "Save favorite configurations",
      "Discord bot integration support",
      "Mobile-responsive interface",
      "No registration required",
      "Instant timestamp creation",
    ],
    softwareRequirements: "Modern web browser with JavaScript enabled",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("seo_keywords"),
    educationalUse:
      "Discord Event Planning, Discord Community Management, Discord Bot Development, Discord Event Coordination, Discord Reminder Systems, Discord Server Administration",
    audience: {
      "@type": "Audience",
      audienceType:
        "Discord Community Managers, Discord Bot Developers, Event Organizers, Discord Server Administrators, Gaming Communities, Content Creators",
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Discord Timestamp Generator",
      applicationCategory: "Communication Tool",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1420",
      },
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
