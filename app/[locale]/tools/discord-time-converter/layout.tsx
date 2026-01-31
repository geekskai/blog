import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "DiscordTimeConverter" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/discord-time-converter/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/discord-time-converter/`
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
          url: "/static/images/discord-time-converter.png",
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
        ? "https://geekskai.com/tools/discord-time-converter/"
        : `https://geekskai.com/${locale}/tools/discord-time-converter/`,
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
  const t = await getTranslations({ locale, namespace: "DiscordTimeConverter" })

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url: `https://geekskai.com/${locale}/tools/discord-time-converter`,
    applicationCategory: "Productivity",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Discord timezone converter for all global timezones",
      "Bidirectional Discord timestamp conversion",
      "Discord timestamp generator for all formats",
      "Full timezone support with auto-detection",
      "Global timezone synchronization",
      "International event scheduling",
      "Cross-timezone coordination tools",
      "Batch processing for multiple timestamps",
      "All Discord timestamp formats (:t, :T, :d, :D, :f, :F, :R)",
      "Real-time preview and validation",
      "Conversion history tracking",
      "One-click copy functionality",
      "Mobile-responsive design",
      "No registration required",
      "Discord bot development support",
      "Unix epoch time conversion",
      "Global community coordination tools",
      "Multi-timezone event planning",
      "Discord webhook timezone integration",
    ].join(", "),
    softwareRequirements: "Modern web browser with JavaScript enabled",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords:
      "discord timezone converter, discord time zone converter, discord timezone conversion, discord time converter, discord timestamp generator, discord timestamp converter, unix timestamp discord, discord bot timestamp, discord timezone tool, discord global timezone, discord international time, discord community tools, discord server management, discord event scheduling, discord coordination tool, discord timestamp formats, discord timezone synchronization, discord cross timezone scheduling",
    educationalUse:
      "Discord Community Management, Discord Bot Development, International Event Planning, Global Coordination, Cross-Timezone Team Collaboration, Discord Server Administration, Multi-Timezone Event Scheduling",
    audience: {
      "@type": "Audience",
      audienceType:
        "Discord Community Managers, Discord Bot Developers, International Event Organizers, Global Teams, Gaming Communities, Discord Server Administrators, Cross-Timezone Coordinators, International Discord Communities",
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Discord Timezone Converter & Timestamp Generator",
      applicationCategory: "Communication Tool",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1650",
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
