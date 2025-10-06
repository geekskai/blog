import { Metadata } from "next"
import { hasLocale } from "next-intl"
import { routing, supportedLocales } from "../../i18n/routing"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
// import { supportedLocales as supportedLocalesList } from "@/components/LanguageSelect"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}
// const supportedLocales = supportedLocalesList
// const supportedLocales = ["en", "ja", "ko", "no", "zh-cn"] // Add more as you implement them

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "ToolsPage" })

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
  const path = "/tools/"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/`
  })

  const title = t("tools_seo_title")
  const description = t("tools_seo_description")
  const keywords = t("tools_seo_keywords")

  return {
    title: `${title} | ${t("tools_free_tools")}`,
    description,
    keywords: keywords.split(", "),
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",

    // Open Graph
    openGraph: {
      title: `${title} | ${t("tools_free_tools")}`,
      description,
      type: "website",
      url,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/static/og-images/tools.jpg",
          width: 1200,
          height: 630,
          alt: "GeeksKai Tools - Free Online Tools",
        },
      ],
      locale: ogLocale,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${t("tools_free_tools")}`,
      description,
      images: ["/static/og-images/tools.jpg"],
      creator: "@geekskai",
    },

    // SEO Settings
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

    // Canonical and Language Alternates
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/"
        : `https://geekskai.com/${locale}/tools/`,
      languages: {
        ...languages,
      },
    },

    // Additional metadata
    category: locale === "da" ? "Værktøjer" : locale === "no" ? "Verktøy" : "Tools",
    classification:
      locale === "da" ? "Online Værktøjer" : locale === "no" ? "Online Verktøy" : "Online Tools",

    // App metadata
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

export default async function Layout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "ToolsPage" })
  const baseUrl = "https://geekskai.com"
  const path = "/tools/"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  // 动态生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("tools_seo_title"),
    description: t("tools_seo_description"),
    url,
    mainEntity: {
      "@type": "ItemList",
      name: t("tools_professional_tools"),
      description: t(
        "tools_hand_picked_tools_designed_to_streamline_your_workflow_and_boost_productivity"
      ),
      numberOfItems: "50+",
      itemListElement: [
        {
          "@type": "SoftwareApplication",
          name: "Board Foot Calculator",
          description: "Professional lumber calculator for construction and woodworking projects",
          url: `${baseUrl}${locale === "en" ? "" : `/${locale}`}/tools/board-foot-calculator/`,
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
        {
          "@type": "SoftwareApplication",
          name: "CM to Inches Converter",
          description: "Convert between centimeters and inches with Nordic measurement support",
          url: `${baseUrl}${locale === "en" ? "" : `/${locale}`}/tools/cm-til-tommer/`,
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      ],
    },
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://geekskai.com/static/logo.png",
      },
    },
    isAccessibleForFree: true,
    inLanguage: locale === "da" ? "da-DK" : locale === "no" ? "nb-NO" : "en-US",
  }

  // 面包屑结构化数据
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("tools_free_tools"),
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("tools_professional_tools"),
        item: url,
      },
    ],
  }

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className="min-h-screen">{children}</div>
    </>
  )
}
