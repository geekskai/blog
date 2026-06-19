import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const revalidate = 604800 // 7 days

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: "ChivalryTest" })
  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/chivalry-test/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] =
      loc === "en"
        ? `https://geekskai.com/tools/chivalry-test/`
        : `https://geekskai.com/${loc}/tools/chivalry-test/`
  })
  const lastModified = new Date("2026-05-26")

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    other: {
      "last-modified": lastModified.toISOString(),
    },
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      locale: locale,
      images: [
        {
          url: "/static/images/chivalry-test-og.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/static/images/chivalry-test-twitter.png"],
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/chivalry-test/"
        : `https://geekskai.com/${locale}/tools/chivalry-test/`,
      languages,
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
  name: t("title"),
  description: t("seo_description"),
  url: "https://geekskai.com/tools/chivalry-test",
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
    "Modern chivalry assessment",
    "Knight mode evaluation",
    "Trait analysis",
    "Radar chart visualization",
    "Shareable results",
    "Mobile-friendly interface",
    "No registration required",
  ].join(", "),
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords: t("seo_keywords"),
  educationalUse: "Personality Assessment, Character Development, Self-Reflection, Personal Growth",
})

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const t = await getTranslations({ locale, namespace: "ChivalryTest" })
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
