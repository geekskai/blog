import { MetadataRoute } from "next"
import siteMetadata from "@/data/siteMetadata"
import { supportedLocales } from "./i18n/routing"

export default function robots(): MetadataRoute.Robots {
  const englishOnlySections = ["blog/", "tags/"]
  const localeDisallowPaths = supportedLocales.flatMap((locale) =>
    englishOnlySections.map((section) => `/${locale}/${section}`)
  )
  const commonDisallow = ["/api/", "/admin/", ...localeDisallowPaths]

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
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      // AI Crawlers - Critical for AI visibility
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/admin/", ...localeDisallowPaths],
        crawlDelay: 0,
      },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  }
}
