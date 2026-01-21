import { MetadataRoute } from "next"
import siteMetadata from "@/data/siteMetadata"
import { supportedLocales } from "./i18n/routing"

export default function robots(): MetadataRoute.Robots {
  const englishOnlySections = ["blog/", "tags/", "privacy/"]
  const localeDisallowPaths = supportedLocales.flatMap((locale) =>
    englishOnlySections.map((section) => `/${locale}/${section}`)
  )
  const commonDisallow = [
    "/*/feed.xml",
    "/api/",
    "/_next/",
    "/admin/",
    "/private/",
    ...localeDisallowPaths,
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: commonDisallow,
        crawlDelay: 0,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/*/feed.xml", "/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/*/feed.xml", "/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
