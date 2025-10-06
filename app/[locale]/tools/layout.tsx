import { Metadata } from "next"
import { hasLocale } from "next-intl"
import { routing } from "../../i18n/routing"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
// import { supportedLocales as supportedLocalesList } from "@/components/LanguageSelect"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}
// const supportedLocales = supportedLocalesList
const supportedLocales = ["en", "ja", "ko", "no", "zh-cn"] // Add more as you implement them

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations("ToolsPage")
  const isDefaultLocale = locale === "en"
  const title = t("tools_seo_title")
  const description = t("tools_seo_description")

  const languages = {
    "x-default": "https://geekskai.com/tools/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/`
  })

  return {
    title: title + " | " + t("tools_free_tools"),
    description: description,
    keywords: [t("tools_free_tools")],
    openGraph: {
      title: title + " | " + t("tools_free_tools"),
      description: description,
      type: "website",
      url: "https://geekskai.com/tools/",
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/og-images/tools.jpg",
          width: 1200,
          height: 630,
          alt: "GeeksKai Tools",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      title: title + " | " + t("tools_free_tools"),
      description: description,
      card: "summary_large_image",
      images: ["/og-images/tools.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/"
        : `https://geekskai.com/${locale}/tools/`,
      languages: {
        ...languages,
      },
    },
    category: "Tools",
    classification: "Tools",
    other: {
      "application-name": "GeeksKai Tools",
      "apple-mobile-web-app-title": "GeeksKai Tools",
    },
  }
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return <div className="min-h-screen">{children}</div>
}
