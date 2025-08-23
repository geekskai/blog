import { MetadataRoute } from "next"
import { allBlogs } from "contentlayer/generated"
import siteMetadata from "@/data/siteMetadata"
import { toolsData } from "@/data/toolsData"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}/`,
      lastModified: post.lastmod || post.date,
    }))

  // Static routes
  const routes = ["", "blog/", "projects/", "tools/", "tags/", "about/"].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  // Dynamic tool routes
  const toolRoutes = toolsData.map((tool) => ({
    url: `${siteUrl}${tool.href}`,
    lastModified: new Date().toISOString().split("T")[0],
    // Set higher priority for tools since they're important pages
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }))

  return [...routes, ...blogRoutes, ...toolRoutes]
}
