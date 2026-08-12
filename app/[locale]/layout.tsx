import "css/tailwind.css"
import "pliny/search/algolia.css"
import "remark-github-blockquote-alert/alert.css"
import React from "react"
import { Analytics, AnalyticsConfig } from "pliny/analytics"
import { SearchProvider, SearchConfig } from "pliny/search"
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
import { ClerkProvider } from "@clerk/nextjs"
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
  const description = t("home_seo_description") + " " + t("home_seo_keywords")

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

  // Generate JSON-LD Structured Data
  const t = await getTranslations({ locale, namespace: "HomePage" })
  const baseUrl = siteMetadata.siteUrl
  const url = getLocalizedUrl(baseUrl, locale, "/")

  const localeMap: Record<string, string> = {
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
    no: "nb-NO",
    "zh-cn": "zh-CN",
    da: "da-DK",
  }

  const inLanguage = localeMap[locale] || "en-US"

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "GeeksKai",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/static/logos.png`,
          width: 512,
          height: 512,
        },
        sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["en", "ja", "ko", "zh-cn", "no", "da"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "GeeksKai Tools",
        description: t("home_seo_description"),
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: inLanguage,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${getLocalizedUrl(baseUrl, locale, "/tools/")}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url: url,
        name: t("home_seo_title"),
        description: t("home_seo_description"),
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${baseUrl}/static/images/og/geekskai-home.png`,
        },
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
        inLanguage: inLanguage,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: url,
          },
        ],
      },
    ],
  }

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
        <ClerkProvider
          signInUrl="/sign-in/"
          signUpUrl="/sign-up/"
          appearance={{
            theme: "simple",
            variables: {
              colorPrimary: "#ec4899",
              colorPrimaryForeground: "#ffffff",
              colorNeutral: "#f8fafc",
              colorBackground: "#0b1224",
              colorForeground: "#f8fafc",
              colorMuted: "#111c33",
              colorMutedForeground: "#a7b2c8",
              colorInput: "#060c1a",
              colorInputForeground: "#f8fafc",
              colorBorder: "rgba(148, 163, 184, 0.22)",
              colorRing: "rgba(236, 72, 153, 0.48)",
              colorShadow: "#020617",
              borderRadius: "0.75rem",
            },
            elements: {
              cardBox: {
                boxShadow: "none",
              },
              card: {
                backgroundColor: "#0b1224",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                boxShadow: "0 26px 70px -28px rgba(2, 6, 23, 0.95)",
              },
              headerTitle: {
                color: "#f8fafc",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              },
              headerSubtitle: {
                color: "#a7b2c8",
              },
              socialButtonsBlockButton: {
                minHeight: "2.75rem",
                color: "#f8fafc",
                backgroundColor: "#111c33",
                border: "1px solid rgba(148, 163, 184, 0.24)",
                boxShadow: "none",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "#17223b",
                  borderColor: "rgba(236, 72, 153, 0.5)",
                  transform: "translateY(-1px)",
                },
                "&:focus-visible": {
                  outline: "2px solid rgba(236, 72, 153, 0.75)",
                  outlineOffset: "2px",
                },
              },
              socialButtonsBlockButtonText: {
                color: "#f8fafc",
                fontWeight: 600,
              },
              dividerLine: {
                backgroundColor: "rgba(148, 163, 184, 0.2)",
              },
              dividerText: {
                color: "#94a3b8",
              },
              formFieldLabel: {
                color: "#e2e8f0",
                fontWeight: 600,
              },
              formFieldInput: {
                minHeight: "2.75rem",
                color: "#f8fafc !important",
                caretColor: "#f472b6",
                backgroundColor: "#060c1a !important",
                border: "1px solid rgba(148, 163, 184, 0.34) !important",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.025)",
                "&::placeholder": {
                  color: "#64748b",
                  opacity: 1,
                },
                "&:hover": {
                  borderColor: "rgba(244, 114, 182, 0.58) !important",
                },
                "&:focus, &:focus-visible": {
                  borderColor: "#f472b6 !important",
                  boxShadow: "0 0 0 3px rgba(236, 72, 153, 0.18) !important",
                },
              },
              formFieldInputShowPasswordButton: {
                color: "#94a3b8",
                "&:hover": {
                  color: "#f8fafc",
                },
              },
              formButtonPrimary: {
                minHeight: "2.75rem",
                color: "#ffffff",
                fontWeight: 700,
                backgroundColor: "transparent",
                backgroundImage: "linear-gradient(90deg, #ec4899 0%, #d946ef 48%, #7c3aed 100%)",
                border: "1px solid rgba(244, 114, 182, 0.38)",
                boxShadow: "0 12px 28px -16px rgba(236, 72, 153, 0.95)",
                "&:hover": {
                  color: "#ffffff",
                  backgroundImage: "linear-gradient(90deg, #f472b6 0%, #e879f9 48%, #8b5cf6 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 15px 30px -16px rgba(236, 72, 153, 1)",
                },
                "&:focus-visible": {
                  outline: "2px solid rgba(244, 114, 182, 0.9)",
                  outlineOffset: "2px",
                },
              },
              footer: {
                backgroundColor: "transparent",
                backgroundImage: "none",
              },
              footerActionText: {
                color: "#94a3b8",
              },
              footerActionLink: {
                color: "#f472b6",
                fontWeight: 700,
                "&:hover": {
                  color: "#f9a8d4",
                },
              },
              formFieldErrorText: {
                color: "#fda4af",
              },
              alertText: {
                color: "#fda4af",
              },
            },
          }}
        >
          {/* JSON-LD Structured Data - Must be in body to avoid hydration error */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <NextIntlClientProvider>
            <ClarityTracker />
            <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
            <SectionContainer>
              <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                <a
                  href="#main-content"
                  className="fixed left-4 top-4 z-[1000] -translate-y-24 rounded-lg bg-white px-4 py-3 font-semibold text-slate-950 shadow-xl transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-pink-500 motion-reduce:transition-none"
                >
                  Skip to main content
                </a>
                <Header authEnabled />
                <main
                  id="main-content"
                  tabIndex={-1}
                  className="mx-auto min-h-[54vh] max-w-7xl px-4 outline-none sm:px-6 xl:px-0"
                >
                  {children}
                </main>
              </SearchProvider>
              <SiteFooter />
            </SectionContainer>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
