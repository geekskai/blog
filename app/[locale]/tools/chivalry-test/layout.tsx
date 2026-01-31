import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const revalidate = 86400 // 24 hours

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "ChivalryTest" })
  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/chivalry-test/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/chivalry-test/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
})

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "ChivalryTest" })
  const jsonLd = getJsonLd(t)

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq_what_is_chivalry"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_what_is_chivalry_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_still_relevant"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_still_relevant_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_test_accurate"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_test_accurate_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_women_take"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_women_take_answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq_help_improve"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_help_improve_answer"),
        },
      },
    ],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      {children}
    </div>
  )
}
