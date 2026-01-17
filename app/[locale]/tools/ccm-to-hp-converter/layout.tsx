import { supportedLocales } from "app/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

// Generate metadata with i18n support
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "CcmToHpConverter" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/ccm-to-hp-converter/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/ccm-to-hp-converter/`
  })
  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords"),
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",
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
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      url: isDefaultLocale
        ? "https://geekskai.com/tools/ccm-to-hp-converter"
        : `https://geekskai.com/${locale}/tools/ccm-to-hp-converter/`,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/og-images/ccm-to-hp-converter.jpg",
          width: 1200,
          height: 630,
          alt: t("page_title") + " - " + t("page_subtitle"),
        },
      ],
      locale: locale === "en" ? "en_US" : locale === "zh-cn" ? "zh_CN" : locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/og-images/ccm-to-hp-converter.jpg"],
      creator: "@geekskai",
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/ccm-to-hp-converter/"
        : `https://geekskai.com/${locale}/tools/ccm-to-hp-converter/`,
      languages: {
        ...languages,
      },
    },
    other: {
      "application-name": t("page_title"),
      "apple-mobile-web-app-title": t("page_title"),
      "format-detection": "telephone=no",
    },
  }
}

// Generate structured data with i18n support
const getJsonLd = (t: any, locale: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `https://geekskai.com/${locale}/tools/ccm-to-hp-converter#webapp`,
      name: t("page_title"),
      description: t("page_description"),
      url: `https://geekskai.com/${locale}/tools/ccm-to-hp-converter/`,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      permissions: "browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        t("feature_badges.bidirectional_conversion"),
        t("feature_badges.engine_support"),
        t("feature_badges.turbo_support"),
        t("feature_badges.multi_application"),
      ],
    },
    {
      "@type": "HowTo",
      "@id": `https://geekskai.com/${locale}/tools/ccm-to-hp-converter/#howto`,
      name: t("usage_guide.title"),
      description: t("usage_guide.description"),
      image: "https://geekskai.com/og-images/ccm-to-hp-converter.jpg",
      totalTime: "PT2M",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: "0",
      },
      supply: [
        {
          "@type": "HowToSupply",
          name: t("converter_card.engine_displacement_label"),
        },
        {
          "@type": "HowToSupply",
          name: t("converter_card.engine_type_label"),
        },
        {
          "@type": "HowToSupply",
          name: t("converter_card.fuel_system_label"),
        },
      ],
      step: [
        {
          "@type": "HowToStep",
          name: t("usage_guide.step_1_title"),
          text: t("usage_guide.step_1_description"),
          image: "https://geekskai.com/images/ccm-input-step.jpg",
        },
        {
          "@type": "HowToStep",
          name: t("usage_guide.step_2_title"),
          text: t("usage_guide.step_2_description"),
          image: "https://geekskai.com/images/engine-type-step.jpg",
        },
        {
          "@type": "HowToStep",
          name: t("usage_guide.step_3_title"),
          text: t("usage_guide.step_3_description"),
          image: "https://geekskai.com/images/fuel-system-step.jpg",
        },
        {
          "@type": "HowToStep",
          name: t("usage_guide.step_4_title"),
          text: t("usage_guide.step_4_description"),
          image: "https://geekskai.com/images/results-step.jpg",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `https://geekskai.com/${locale}/tools/ccm-to-hp-converter/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: t("faq.q1"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a1"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q2"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a2"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q3"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a3"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q4"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a4"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q5"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a5"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q6"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a6"),
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `https://geekskai.com/${locale}/tools/ccm-to-hp-converter/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("breadcrumb.home"),
          item: `https://geekskai.com/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("breadcrumb.tools"),
          item: `https://geekskai.com/${locale}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: t("breadcrumb.ccm_to_hp_converter"),
          item: `https://geekskai.com/${locale}/tools/ccm-to-hp-converter/`,
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://geekskai.com/#organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://geekskai.com/static/logo.png",
      },
      sameAs: ["https://twitter.com/geekskai", "https://github.com/geekskai"],
    },
    {
      "@type": "WebSite",
      "@id": "https://geekskai.com/#website",
      url: "https://geekskai.com",
      name: "GeeksKai",
      description:
        "Free online tools and calculators for developers, designers, and digital professionals.",
      publisher: {
        "@id": "https://geekskai.com/#organization",
      },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `https://geekskai.com/${locale}/#search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
    },
  ],
})

export default async function CcmToHpConverterLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "CcmToHpConverter" })
  const jsonLd = getJsonLd(t, locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
