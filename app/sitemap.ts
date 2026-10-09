import { MetadataRoute } from "next"
import { allBlogs } from "contentlayer/generated"
import siteMetadata from "@/data/siteMetadata"
import { toolsData } from "@/data/toolsData"
import { supportedLocales } from "./i18n/routing"
import { buildLanguageAlternates, getLocalizedUrl } from "./i18n/urls"
import { soundCloudHubPath } from "@/data/soundCloudGrowth"
import { canonicalStaticRoutes, getIndexedToolLocales } from "./sitemap-config"
import { SUPPORTED_BRAND_SLUGS } from "./[locale]/tools/vin-decoder/types"

const VIN_VEHICLE_TYPE_SLUGS = ["motorcycle", "rv", "trailer", "classic-car"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  // Generate blog routes for all locales
  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}/`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = canonicalStaticRoutes.map((route) => ({
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

  const soundCloudHubLocales = getIndexedToolLocales(soundCloudHubPath)
  const soundCloudHubRoutes = soundCloudHubLocales.map((locale) => ({
    url: getLocalizedUrl(siteUrl, locale, soundCloudHubPath),
    alternates: {
      languages: buildLanguageAlternates(siteUrl, soundCloudHubPath, [...soundCloudHubLocales]),
    },
  }))

  const pixelsToInchesPath = "/tools/pixels-to-inches/"
  const pixelsToInchesRoutes = supportedLocales.map((locale) => ({
    url: getLocalizedUrl(siteUrl, locale, pixelsToInchesPath),
    alternates: { languages: buildLanguageAlternates(siteUrl, pixelsToInchesPath) },
  }))

  const vinBrandRoutes = SUPPORTED_BRAND_SLUGS.flatMap((brand) => {
    const path = `/tools/vin-decoder/${brand}/`
    return supportedLocales.map((locale) => ({
      url: getLocalizedUrl(siteUrl, locale, path),
      alternates: { languages: buildLanguageAlternates(siteUrl, path) },
    }))
  })

  const vinVehicleTypeRoutes = VIN_VEHICLE_TYPE_SLUGS.flatMap((type) => {
    const path = `/tools/vin-decoder/vehicle-types/${type}/`
    return supportedLocales.map((locale) => ({
      url: getLocalizedUrl(siteUrl, locale, path),
      alternates: { languages: buildLanguageAlternates(siteUrl, path) },
    }))
  })

  const vinComparePath = "/tools/vin-decoder/vin-decoder-vs-vin-check/"
  const vinCompareRoutes = supportedLocales.map((locale) => ({
    url: getLocalizedUrl(siteUrl, locale, vinComparePath),
    alternates: { languages: buildLanguageAlternates(siteUrl, vinComparePath, [...supportedLocales]) },
  }))

  // Generate tool routes for all locales
  const toolRoutes = toolsData.flatMap((tool) => {
    const locales = getIndexedToolLocales(tool.href)

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
    ...pixelsToInchesRoutes,
    ...vinBrandRoutes,
    ...vinVehicleTypeRoutes,
    ...vinCompareRoutes,
  ]

  // Remove duplicates and sort by priority
  const uniqueRoutes = allRoutes.filter(
    (route, index, self) => index === self.findIndex(({ url }) => url === route.url)
  )

  return uniqueRoutes
}
