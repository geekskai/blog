import { ReactNode } from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
// import { supportedLocales } from "@/components/LanguageSelect"

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

// export const metadata: Metadata = {
//   metadataBase: new URL(siteMetadata.siteUrl),
//   title: {
//     default: siteMetadata.title,
//     template: `%s`,
//   },
//   description: siteMetadata.description,
//   openGraph: {
//     title: siteMetadata.title,
//     description: siteMetadata.description,
//     url: "./",
//     siteName: siteMetadata.title,
//     images: [siteMetadata.socialBanner],
//     locale: "en_US",
//     type: "website",
//   },
//   alternates: {
//     canonical: "./",
//     types: {
//       "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
//     },
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   twitter: {
//     title: siteMetadata.title,
//     card: "summary_large_image",
//     images: [siteMetadata.socialBanner],
//   },
// }
const supportedLocales = ["en", "ja", "ko", "no", "zh-cn"] // Add more as you implement them

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations("HomePage")

  const isDefaultLocale = locale === "en"
  const title = t("home_seo_title")
  const description = t("home_seo_description") + " " + t("home_seo_keywords")

  const languages = {
    "x-default": "https://geekskai.com/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/`
  })

  return {
    title: title,
    description: description,
    keywords: [t("home_seo_keywords")],
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: "https://geekskai.com/",
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/og-images/home.jpg",
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
      images: ["/og-images/home.jpg"],
    },
    robots: {
      index: true,
      follow: true,
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
    },
  }
}

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children
}
