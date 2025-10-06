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
    }))

  // Generate static routes for all locales
  const staticRoutes = ["", "projects/", "tools/", "about/"]
  const routes = staticRoutes.flatMap((route) => {
    return supportedLocales.map((locale) => ({
      url: `${siteUrl}${locale === defaultLocale ? "" : `/${locale}`}/${route}`,
      lastModified: new Date().toISOString().split("T")[0],
      priority: route === "" ? 1.0 : route === "tools/" ? 0.9 : 0.8,
      changeFrequency: "weekly" as const,
      // Add alternates for SEO
      alternates: {
        languages: supportedLocales.reduce(
          (acc, lang) => {
            acc[lang] = `${siteUrl}${lang === defaultLocale ? "" : `/${lang}`}/${route}`
            return acc
          },
          {} as Record<string, string>
        ),
      },
    }))
  })

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

  // Generate language-specific routes for special tools
  const specialToolRoutes: MetadataRoute.Sitemap = []

  // // Add Danish/Norwegian specific tool
  // const cmTilTommerTool = toolsData.find((tool) => tool.id === "cm-til-tommer")
  // if (cmTilTommerTool) {
  //   // This tool is specifically for Danish/Norwegian users
  //   const danishNorwegianLocales = ["da", "no"]
  //   danishNorwegianLocales.forEach((locale) => {
  //     const toolPath = cmTilTommerTool.href.startsWith("/")
  //       ? cmTilTommerTool.href.slice(1)
  //       : cmTilTommerTool.href
  //     specialToolRoutes.push({
  //       url: `${siteUrl}/${locale}/${toolPath}`,
  //       lastModified: new Date().toISOString().split("T")[0],
  //       priority: 0.9, // Higher priority for locale-specific tools
  //       changeFrequency: "weekly" as const,
  //     })
  //   })
  // }

  // // Add Norwegian specific tool
  // const pundTilNokTool = toolsData.find((tool) => tool.id === "pund-til-nok-kalkulator")
  // if (pundTilNokTool) {
  //   // This tool is specifically for Norwegian users
  //   const toolPath = pundTilNokTool.href.startsWith("/")
  //     ? pundTilNokTool.href.slice(1)
  //     : pundTilNokTool.href
  //   specialToolRoutes.push({
  //     url: `${siteUrl}/no/${toolPath}`,
  //     lastModified: new Date().toISOString().split("T")[0],
  //     priority: 0.9, // Higher priority for locale-specific tools
  //     changeFrequency: "weekly" as const,
  //   })
  // }

  // Generate robots.txt friendly sitemap
  const allRoutes = [...routes, ...blogRoutes, ...toolRoutes, ...specialToolRoutes]

  // Remove duplicates and sort by priority
  const uniqueRoutes = allRoutes.filter(
    (route, index, self) => index === self.findIndex((r) => r.url === route.url)
  )
  // .sort((a, b) => (b.priority || 0.5) - (a.priority || 0.5))

  return uniqueRoutes
}
