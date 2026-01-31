import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "BpmMsConverter" })
  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/bpm-ms-converter",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/bpm-ms-converter`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      url: isDefaultLocale
        ? "https://geekskai.com/tools/bpm-ms-converter"
        : `https://geekskai.com/${locale}/tools/bpm-ms-converter`,
      images: [
        {
          url: "/static/images/tools/bpm-ms-converter-og.png",
          width: 1200,
          height: 630,
          alt: t("page_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("page_description"),
      images: ["/static/images/tools/bpm-ms-converter-twitter.png"],
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/bpm-ms-converter"
        : `https://geekskai.com/${locale}/tools/bpm-ms-converter`,
      languages: {
        ...languages,
      },
    },
    other: {
      "application-name": "GeeksKai BPM MS Converter",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
    },
  }
}

// Structured data for SEO
const getJsonLd = (t: any) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: t("page_title"),
  description: t("seo_description"),
  url: "https://geekskai.com/tools/bpm-ms-converter",
  applicationCategory: "MusicApplication",
  operatingSystem: "Any",
  permissions: "browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    t("conversion_modes.bpm_to_ms_description"),
    t("conversion_modes.ms_to_bpm_description"),
    t("note_values.quarter_note"),
    t("note_values.eighth_note"),
    t("note_values.sixteenth_note"),
    t("note_values.dotted_quarter"),
    t("note_values.eighth_triplet"),
    t("conversion_results.copy_result"),
    t("value_props.instant_conversion"),
  ].join(", "),
  creator: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
})

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "BpmMsConverter" })
  const jsonLd = getJsonLd(t)

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
