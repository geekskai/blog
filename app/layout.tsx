import { ReactNode } from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "./i18n/routing"
import { toolsData } from "@/data/toolsData"
// import { supportedLocales } from "@/components/LanguageSelect"

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({
    locale: locale,
  }))
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations("HomePage")

  const isDefaultLocale = locale === "en"
  const title = t("home_seo_title")
  const description = t("home_seo_description")
  const keywords = t("home_seo_keywords")

  // 语言映射
  const localeMap: Record<string, string> = {
    en: "en_US",
    ja: "ja_JP",
    ko: "ko_KR",
    no: "no_NO",
    "zh-cn": "zh_CN",
    da: "da_DK",
  }

  const ogLocale = localeMap[locale] || "en_US"
  const baseUrl = "https://geekskai.com"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}/`

  const languages = {
    "x-default": "https://geekskai.com/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/`
  })

  return {
    title: title,
    description: description,
    keywords: keywords.split(", ").length > 1 ? keywords.split(", ") : [keywords],
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: url,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/og-images/home.jpg",
          width: 1200,
          height: 630,
          alt: "GeeksKai Tools - Free AI-Powered Tools and Useful Online Utilities",
        },
      ],
      locale: ogLocale,
    },
    twitter: {
      title: title,
      description: description,
      card: "summary_large_image",
      images: ["/og-images/home.jpg"],
      creator: "@geekskai",
      site: "@geekskai",
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
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",
    alternates: {
      canonical: isDefaultLocale ? "https://geekskai.com/" : `https://geekskai.com/${locale}/`,
      languages: {
        ...languages,
      },
    },
    category: "Tools",
    classification: "Tools",
    other: {
      "application-name": "GeeksKai Tools",
      "apple-mobile-web-app-title": "GeeksKai Tools",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "theme-color": "#0f172a",
      "DC.language": ogLocale.replace("_", "-"),
    },
  }
}

// JSON-LD Structured Data for SEO
async function generateJsonLd(locale: string) {
  const t = await getTranslations("HomePage")
  const baseUrl = "https://geekskai.com"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}/`

  // 获取热门工具列表（前10个）
  const popularTools = toolsData.slice(0, 10).map((tool, index) => ({
    "@type": "SoftwareApplication",
    position: index + 1,
    name: tool.title,
    description: tool.description,
    url: `${baseUrl}${locale === "en" ? "" : `/${locale}`}${tool.href}`,
    applicationCategory: `${tool.category}Application`,
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1000+",
    },
  }))

  // 语言映射
  const localeMap: Record<string, string> = {
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
    no: "nb-NO",
    "zh-cn": "zh-CN",
    da: "da-DK",
  }

  const inLanguage = localeMap[locale] || "en-US"

  return {
    "@context": "https://schema.org",
    "@graph": [
      // Organization Schema
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "GeeksKai",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/static/logo.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://github.com/geekskai",
          "https://twitter.com/geekskai",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["en", "ja", "ko", "zh-cn", "no", "da"],
        },
      },
      // Website Schema
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
            urlTemplate: `${baseUrl}${locale === "en" ? "" : `/${locale}`}/tools/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      // WebPage Schema
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
          url: `${baseUrl}/og-images/home.jpg`,
        },
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
        inLanguage: inLanguage,
      },
      // BreadcrumbList Schema
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
      // ItemList Schema for Popular Tools
      {
        "@type": "ItemList",
        "@id": `${url}#tools`,
        name: t("footer_popular_tools"),
        description: t("footer_description"),
        numberOfItems: toolsData.length.toString(),
        itemListElement: popularTools,
      },
    ],
  }
}

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  const jsonLd = await generateJsonLd(locale)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
