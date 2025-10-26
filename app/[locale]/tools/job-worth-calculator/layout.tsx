/**
 * Job Worth Calculator - Layout Component
 *
 * Based on the original work by Zippland (https://github.com/Zippland/worth-calculator)
 * Licensed under MIT License
 *
 * @copyright 2024 Zippland (Original), GeeksKai (Modifications)
 * @license MIT
 */

import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "JobWorthCalculator" })
  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/job-worth-calculator/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/job-worth-calculator/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords"),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      locale: locale,
      images: [
        {
          url: "/static/images/job-worth-calculator-og.png",
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
      images: ["/static/images/job-worth-calculator-twitter.png"],
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/job-worth-calculator/"
        : `https://geekskai.com/${locale}/tools/job-worth-calculator/`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
