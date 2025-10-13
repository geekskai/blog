import { MetadataRoute } from "next"
import { allBlogs } from "contentlayer/generated"
import siteMetadata from "@/data/siteMetadata"
import { toolsData } from "@/data/toolsData"
import { supportedLocales } from "./i18n/routing"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const defaultLocale = "en"

  // Generate blog routes for all locales
  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}/`,
      lastModified: post.lastmod || post.date,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    }))

  const routes = ["", "blog/", "projects/", "tools/", "tags/", "about/"].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  // Generate static routes for all locales
  // const staticRoutes = ["", "blog/", "projects/", "tools/", "tags/", "about/"]
  // const routes = staticRoutes.flatMap((route) => {
  //   return supportedLocales.map((locale) => ({
  //     url: `${siteUrl}${locale === defaultLocale ? "" : `/${locale}`}/${route}`,
  //     lastModified: new Date().toISOString().split("T")[0],
  //     priority: route === "" ? 1.0 : route === "tools/" ? 0.9 : 0.8,
  //     changeFrequency: "weekly" as const,
  //     // Add alternates for SEO
  //     alternates: {
  //       languages: supportedLocales.reduce(
  //         (acc, lang) => {
  //           acc[lang] = `${siteUrl}${lang === defaultLocale ? "" : `/${lang}`}/${route}`
  //           return acc
  //         },
  //         {} as Record<string, string>
  //       ),
  //     },
  //   }))
  // })

  // Generate tool routes for all locales
  const toolRoutes = toolsData.flatMap((tool) => {
    return supportedLocales.map((locale) => {
      // Extract the tool path from href (remove leading slash)
      const toolPath = tool.href.startsWith("/") ? tool.href.slice(1) : tool.href

      return {
        url: `${siteUrl}${locale === defaultLocale ? "" : `/${locale}`}/${toolPath}`,
        lastModified: new Date().toISOString().split("T")[0],
        // Set higher priority for tools since they're important pages
        priority: 0.8,
        changeFrequency: "weekly" as const,
        // Add alternates for SEO
        alternates: {
          languages: supportedLocales.reduce(
            (acc, lang) => {
              acc[lang] = `${siteUrl}${lang === defaultLocale ? "" : `/${lang}`}/${toolPath}`
              return acc
            },
            {} as Record<string, string>
          ),
        },
      }
    })
  })
  // Generate robots.txt friendly sitemap
  const allRoutes = [...routes, ...blogRoutes, ...toolRoutes]

  // Remove duplicates and sort by priority
  const uniqueRoutes = allRoutes
    .filter((route, index, self) => index === self.findIndex((r) => r.url === route.url))
    .sort((a, b) => (b.priority || 0.5) - (a.priority || 0.5))

  return uniqueRoutes
}
