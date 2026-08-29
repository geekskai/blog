import "css/tailwind.css"
import "remark-github-blockquote-alert/alert.css"
import { Analytics, AnalyticsConfig } from "pliny/analytics"
import Header from "@/components/Header"
import SectionContainer from "@/components/SectionContainer"
import siteMetadata from "@/data/siteMetadata"
import { Metadata } from "next"
import SiteFooter from "@/components/SiteFooter"
import { NextIntlClientProvider } from "next-intl"
import ClerkAppProvider from "@/components/auth/ClerkAppProvider"
import { buildSiteSchema, serializeJsonLd } from "@/lib/seo"

export const revalidate = 604800 // 7 days

const blogTitle = "Geekskai Blog | Practical Technology and Tool Guides"
const blogDescription =
  "Read practical Geekskai guides on web development, online tools, audio workflows, software, and production-focused engineering."
const blogCanonical = `${siteMetadata.siteUrl}/blog/`

export const generateMetadata = async (): Promise<Metadata> => {
  // const { locale } = await params
  // const t = await getTranslations("BlogPage")

  const metadata: Metadata = {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: blogTitle,
      template: `%s`,
    },
    description: blogDescription,
    openGraph: {
      title: blogTitle,
      description: blogDescription,
      url: blogCanonical,
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: blogCanonical,
      languages: {
        "x-default": blogCanonical,
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
      title: blogTitle,
      description: blogDescription,
      card: "summary_large_image",
      images: [siteMetadata.socialBanner],
    },
  }
  return metadata
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ""
  const siteSchema = buildSiteSchema({
    description: siteMetadata.description,
    inLanguage: "en-US",
    searchUrl: `${siteMetadata.siteUrl}/tools/`,
  })
  return (
    <html lang="en" className={`scroll-smooth`} suppressHydrationWarning>
      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/logos.png`} />
      <link rel="icon" type="image/png" sizes="48x48" href={`${basePath}/static/logos.png`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/static/logos.png`} />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <meta name="msvalidate.01" content="58567D271AD7C1B504E10F5DC587BD0B" />
      <meta name="google-adsense-account" content="ca-pub-2108246014001009"></meta>
      <meta name="google-site-verification" content="QBYZptmNADcvd2h8ZZVSZIJUlv5RnI8yYmHtEld1mKk" />
      <meta name="msapplication-TileColor" content="#000000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 pl-[calc(100vw-100%)] text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteSchema) }}
        />
        <ClerkAppProvider>
          <NextIntlClientProvider>
            <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
            <SectionContainer>
              <Header />
              <main className="mx-auto min-h-[54vh] max-w-7xl px-4 sm:px-6 xl:px-0">{children}</main>
              <SiteFooter />
            </SectionContainer>
          </NextIntlClientProvider>
        </ClerkAppProvider>
      </body>
    </html>
  )
}
