import siteMetadata from "@/data/siteMetadata"

export const SEO_ENTITY_IDS = {
  organization: `${siteMetadata.siteUrl}/#organization`,
  website: `${siteMetadata.siteUrl}/#website`,
  author: `${siteMetadata.siteUrl}/about/#person`,
} as const

export type BreadcrumbItem = {
  name: string
  url: string
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

export function buildSiteSchema({
  description,
  inLanguage,
  searchUrl,
}: {
  description: string
  inLanguage: string
  searchUrl: string
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": SEO_ENTITY_IDS.organization,
        name: "GeeksKai",
        url: siteMetadata.siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteMetadata.siteUrl}/static/logos.png`,
          width: 512,
          height: 512,
        },
        sameAs: [siteMetadata.github, siteMetadata.x, siteMetadata.facebook, siteMetadata.linkedin],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          email: siteMetadata.email,
          availableLanguage: ["en", "ar", "de", "fr", "es", "ja", "ko", "nb", "zh-CN", "da"],
        },
      },
      {
        "@type": "WebSite",
        "@id": SEO_ENTITY_IDS.website,
        url: siteMetadata.siteUrl,
        name: "GeeksKai Tools",
        description,
        publisher: { "@id": SEO_ENTITY_IDS.organization },
        inLanguage,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${searchUrl}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }
}

export function buildPageSchema({
  url,
  name,
  description,
  inLanguage = "en-US",
  type = "WebPage",
  breadcrumbs,
}: {
  url: string
  name: string
  description: string
  inLanguage?: string
  type?: "WebPage" | "CollectionPage" | "ProfilePage"
  breadcrumbs: BreadcrumbItem[]
}) {
  const breadcrumbId = `${url}#breadcrumb`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { "@id": SEO_ENTITY_IDS.website },
        about: { "@id": SEO_ENTITY_IDS.organization },
        breadcrumb: { "@id": breadcrumbId },
        inLanguage,
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    ],
  }
}
