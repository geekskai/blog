import { MetadataRoute } from "next"
import { allBlogs } from "contentlayer/generated"
import siteMetadata from "@/data/siteMetadata"
import { toolsData } from "@/data/toolsData"
import { supportedLocales } from "./i18n/routing"
import { buildLanguageAlternates, getLocalizedUrl } from "./i18n/urls"
import {
  isSoundCloudToolPath,
  soundCloudGrowthLocales,
  soundCloudHubPath,
} from "@/data/soundCloudGrowth"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  // const VIN_VEHICLE_TYPES = ["motorcycle", "rv", "trailer", "classic-car"] as const

  // Generate blog routes for all locales
  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}/`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ["", "blog/", "projects/", "tags/", "about/"].map((route) => ({
    url: `${siteUrl}/${route}`,
    // lastModified: new Date().toISOString().split("T")[0],
  }))

  // Generate static routes for all locales
  // const staticRoutes = ["", "blog/", "projects/", "tools/", "tags/", "about/"]
  const staticRoutes = ["tools/"].flatMap((route) => {
    return supportedLocales.map((locale) => ({
      url: getLocalizedUrl(siteUrl, locale, route),
      // lastModified: new Date().toISOString().split("T")[0],
      // priority: route === "" ? 1.0 : route === "tools/" ? 0.9 : 0.8,
      // changeFrequency: "weekly" as const,
      // Add alternates for SEO
      alternates: {
        languages: buildLanguageAlternates(siteUrl, route),
      },
    }))
  })

  const soundCloudHubRoutes = soundCloudGrowthLocales.map((locale) => ({
    url: getLocalizedUrl(siteUrl, locale, soundCloudHubPath),
    alternates: {
      languages: buildLanguageAlternates(siteUrl, soundCloudHubPath, [...soundCloudGrowthLocales]),
    },
  }))

  // Generate tool routes for all locales
  const toolRoutes = toolsData.flatMap((tool) => {
    const locales = isSoundCloudToolPath(tool.href) ? soundCloudGrowthLocales : supportedLocales

    return locales.map((locale) => {
      // Extract the tool path from href (remove leading slash)
      const toolPath = tool.href.startsWith("/") ? tool.href.slice(1) : tool.href

      return {
        url: getLocalizedUrl(siteUrl, locale, toolPath),
        // lastModified: new Date().toISOString().split("T")[0],
        alternates: {
          languages: buildLanguageAlternates(siteUrl, toolPath, [...locales]),
        },
      }
    })
  })

  // Generate robots.txt friendly sitemap
  const allRoutes = [
    ...routes,
    ...blogRoutes,
    ...toolRoutes,
    ...staticRoutes,
    ...soundCloudHubRoutes,
  ]

  // Remove duplicates and sort by priority
  const uniqueRoutes = allRoutes.filter(
    (route, index, self) => index === self.findIndex(({ url }) => url === route.url)
  )

  return uniqueRoutes
}
