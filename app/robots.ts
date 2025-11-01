import { MetadataRoute } from "next"
import siteMetadata from "@/data/siteMetadata"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/*/feed.xml", "/api/", "/_next/", "/admin/", "/private/"],
        crawlDelay: 0,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/*/feed.xml", "/api/", "/admin/"],
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/*/feed.xml", "/api/", "/admin/"],
        crawlDelay: 0,
      },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
