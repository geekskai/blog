import { buildLanguageAlternates, getLocalizedUrl } from "@/app/i18n/urls"
import { getIndexedToolLocales, isToolLocaleIndexed } from "@/app/sitemap-config"
import { getSoundCloudPageCopy, SOUNDCLOUD_SEO_UPDATED } from "@/data/soundCloudSeo"
import { SEO_ENTITY_IDS, serializeJsonLd } from "@/lib/seo"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"

const SITE_URL = "https://geekskai.com"
const TOOL_PATH = "/tools/soundcloud-to-wav/"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const copy = getSoundCloudPageCopy("wav", locale)
  const canonical = getLocalizedUrl(SITE_URL, locale, TOOL_PATH)
  const indexedLocales = getIndexedToolLocales(TOOL_PATH)
  const shouldIndex = isToolLocaleIndexed(TOOL_PATH, locale)

  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    openGraph: {
      title: copy.metadataTitle,
      description: copy.metadataDescription,
      type: "website",
      url: canonical,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/tools/soundcloud-to-wav/soundcloud-to-wav.png",
          width: 1200,
          height: 630,
          alt: copy.pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metadataTitle,
      description: copy.metadataDescription,
    },
    alternates: {
      canonical,
      languages: buildLanguageAlternates(SITE_URL, TOOL_PATH, [...indexedLocales]),
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: { "last-modified": new Date(SOUNDCLOUD_SEO_UPDATED).toISOString() },
  }
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const copy = getSoundCloudPageCopy("wav", locale)
  const t = await getTranslations({ locale, namespace: "SoundCloudToWAV" })
  const canonical = getLocalizedUrl(SITE_URL, locale, TOOL_PATH)
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${canonical}#web-application`,
      name: copy.pageTitle,
      description: copy.metadataDescription,
      url: canonical,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@id": SEO_ENTITY_IDS.organization },
      featureList: copy.facts,
      dateModified: SOUNDCLOUD_SEO_UPDATED,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("breadcrumb_home"), item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: t("breadcrumb_tools"),
          item: getLocalizedUrl(SITE_URL, locale, "/tools/"),
        },
        { "@type": "ListItem", position: 3, name: copy.pageTitle, item: canonical },
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
      {children}
    </div>
  )
}
