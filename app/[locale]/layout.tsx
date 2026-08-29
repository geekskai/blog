import "css/tailwind.css"
import "remark-github-blockquote-alert/alert.css"
import React from "react"
import { Analytics, AnalyticsConfig } from "pliny/analytics"
import Header from "@/components/Header"
import SectionContainer from "@/components/SectionContainer"
import siteMetadata from "@/data/siteMetadata"
import { Metadata } from "next"
import SiteFooter from "@/components/SiteFooter"
import { NextIntlClientProvider } from "next-intl"
import { hasLocale } from "next-intl"
import { routing } from "../i18n/routing"
import { buildLanguageAlternates, getLocalizedUrl } from "../i18n/urls"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import ClarityTracker from "@/components/ClarityTracker"
import ClerkAppProvider from "@/components/auth/ClerkAppProvider"
import { buildSiteSchema, serializeJsonLd } from "@/lib/seo"
export const revalidate = 604800 // 7 days — tools/content rarely change daily

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}
// const supportedLocales = ["en", "ja", "ko", "no", "zh-cn"] // Add more as you implement them

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale: requestedLocale } = await params
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : "en"
  const t = await getTranslations({ locale, namespace: "HomePage" })
  const lastModified = new Date("2026-06-16")
  const title = t("home_seo_title")
  const description = t("home_seo_description")

  const canonicalUrl = getLocalizedUrl(siteMetadata.siteUrl, locale, "/")

  return {
    title: title,
    description: description,
    keywords: [t("home_seo_keywords")],
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/static/images/og/geekskai-home.png",
          width: 1200,
          height: 630,
          alt: "GeeksKai Tools",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      title: title,
      description: description,
      card: "summary_large_image",
      images: ["/static/images/og/geekskai-home.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(siteMetadata.siteUrl, "/"),
    },
    category: "Tools",
    classification: "Tools",
    other: {
      "application-name": "GeeksKai Tools",
      "apple-mobile-web-app-title": "GeeksKai Tools",
      "last-modified": lastModified.toISOString(),
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const basePath = process.env.BASE_PATH || ""
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "HomePage" })
  const baseUrl = siteMetadata.siteUrl

  const localeMap: Record<string, string> = {
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
    no: "nb-NO",
    "zh-cn": "zh-CN",
    da: "da-DK",
  }

  const inLanguage = localeMap[locale] || "en-US"

  const jsonLd = buildSiteSchema({
    description: t("home_seo_description"),
    inLanguage,
    searchUrl: getLocalizedUrl(baseUrl, locale, "/tools/"),
  })

  return (
    <html lang={locale} className={`scroll-smooth`} suppressHydrationWarning>
      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/logos.png`} />
      <link rel="icon" type="image/png" sizes="48x48" href={`${basePath}/static/logos.png`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/static/logos.png`} />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <meta name="saashub-verification" content="e4h08bjpev5u" />
      <meta name="msvalidate.01" content="58567D271AD7C1B504E10F5DC587BD0B" />
      <meta name="google-adsense-account" content="ca-pub-2108246014001009"></meta>
      <meta name="google-site-verification" content="QBYZptmNADcvd2h8ZZVSZIJUlv5RnI8yYmHtEld1mKk" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="baidu-site-verification" content="codeva-vFn9EHfEM1" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 pl-[calc(100vw-100%)] text-white antialiased">
        <ClerkAppProvider>
          {/* JSON-LD Structured Data - Must be in body to avoid hydration error */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
          />
          <NextIntlClientProvider>
            <ClarityTracker />
            <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
            <SectionContainer>
              <a
                href="#main-content"
                className="fixed left-4 top-4 z-[1000] -translate-y-24 rounded-lg bg-white px-4 py-3 font-semibold text-slate-950 shadow-xl transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-pink-500 motion-reduce:transition-none"
              >
                Skip to main content
              </a>
              <Header />
              <main
                id="main-content"
                tabIndex={-1}
                className="mx-auto min-h-[54vh] max-w-7xl px-4 outline-none sm:px-6 xl:px-0"
              >
                {children}
              </main>
              <SiteFooter />
            </SectionContainer>
          </NextIntlClientProvider>
        </ClerkAppProvider>
      </body>
    </html>
  )
}
