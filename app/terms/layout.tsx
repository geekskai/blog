import "css/tailwind.css"
import "pliny/search/algolia.css"
import "remark-github-blockquote-alert/alert.css"
import { Analytics, AnalyticsConfig } from "pliny/analytics"
import { SearchProvider, SearchConfig } from "pliny/search"
import Header from "@/components/Header"
import SectionContainer from "@/components/SectionContainer"
import siteMetadata from "@/data/siteMetadata"
import { Metadata } from "next"
import SiteFooter from "@/components/SiteFooter"
import { NextIntlClientProvider } from "next-intl"
import React from "react"

export const generateMetadata = async (): Promise<Metadata> => {
  const lastModified = new Date("2026-04-26")
  const title = "Geekskai Terms of Service | 100% Free Online Tools"
  const description =
    "Read the Geekskai Terms of Service. Discover our commitment to providing 100% free online tools, downloaders, and converters with no hidden fees or subscriptions."

  const metadata: Metadata = {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: title,
      template: `%s`,
    },
    description: description,
    other: {
      "last-modified": lastModified.toISOString(),
    },
    openGraph: {
      title: title,
      description: description,
      url: "https://geekskai.com/terms/",
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://geekskai.com/terms/",
      languages: {
        "x-default": "https://geekskai.com/terms/",
      },
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
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
    twitter: {
      title: title,
      description: description,
      card: "summary_large_image",
      images: [siteMetadata.socialBanner],
    },
  }
  return metadata
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ""
  return (
    <html lang="en" className={`scroll-smooth`} suppressHydrationWarning>
      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/logo.png`} />
      <link rel="icon" type="image/png" sizes="48x48" href={`${basePath}/static/logo.png`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/static/logo.png`} />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2108246014001009"
        crossOrigin="anonymous"
      ></script>
      <meta name="msvalidate.01" content="58567D271AD7C1B504E10F5DC587BD0B" />
      <meta name="google-adsense-account" content="ca-pub-2108246014001009"></meta>
      <meta name="google-site-verification" content="QBYZptmNADcvd2h8ZZVSZIJUlv5RnI8yYmHtEld1mKk" />
      <meta name="msapplication-TileColor" content="#000000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 pl-[calc(100vw-100%)] text-white antialiased">
        <NextIntlClientProvider>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mx-auto min-h-[54vh] max-w-7xl px-4 sm:px-6 xl:px-0">
                {children}
              </main>
            </SearchProvider>
            <SiteFooter />
          </SectionContainer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
