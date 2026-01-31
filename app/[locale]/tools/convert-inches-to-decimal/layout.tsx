import type { Metadata } from "next"
import { supportedLocales } from "app/i18n/routing"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "ConvertInchesToDecimal" })
  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": isDefaultLocale
      ? "https://geekskai.com/tools/convert-inches-to-decimal"
      : `https://geekskai.com/${locale}/tools/convert-inches-to-decimal`,
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/convert-inches-to-decimal`
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
          url: "/static/images/inches-to-decimal-converter-og.jpg",
          width: 1200,
          height: 630,
          alt: t("structured_data.app_name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/static/images/inches-to-decimal-converter-twitter.jpg"],
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/convert-inches-to-decimal"
        : `https://geekskai.com/${locale}/tools/convert-inches-to-decimal`,
      languages,
    },
  }
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "ConvertInchesToDecimal" })

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: t("structured_data.app_name"),
            description: t("structured_data.app_description"),
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            audience: {
              "@type": "Audience",
              audienceType: [
                t("structured_data.audience_type_1"),
                t("structured_data.audience_type_2"),
                t("structured_data.audience_type_3"),
                t("structured_data.audience_type_4"),
              ],
            },
            featureList: [
              t("structured_data.feature_1"),
              t("structured_data.feature_2"),
              t("structured_data.feature_3"),
              t("structured_data.feature_4"),
              t("structured_data.feature_5"),
              t("structured_data.feature_6"),
              t("structured_data.feature_7"),
              t("structured_data.feature_8"),
            ].join(", "),
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            provider: {
              "@type": "Organization",
              name: "GeeksKai",
              url: "https://geekskai.com",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "1250",
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />
      {children}
    </>
  )
}
