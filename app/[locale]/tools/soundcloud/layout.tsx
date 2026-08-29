import { buildLanguageAlternates, getLocalizedUrl } from "@/app/i18n/urls"
import { soundCloudHubPath, soundCloudToolLinks } from "@/data/soundCloudGrowth"
import { getIndexedToolLocales, isToolLocaleIndexed } from "@/app/sitemap-config"
import type { Metadata } from "next"
import React from "react"

const siteUrl = "https://geekskai.com"

const copyByLocale = {
  en: {
    title: "SoundCloud Tools - Track, MP3/M4A, Playlist & Artwork",
    description:
      "Choose a truthful SoundCloud workflow for available MP3/M4A streams, public playlists, or artwork, with format and access limits disclosed.",
  },
  fr: {
    title: "Outils SoundCloud - pistes MP3/M4A, playlists et pochettes",
    description:
      "Choisissez un flux SoundCloud clair pour les pistes MP3/M4A disponibles, les playlists publiques ou les pochettes, avec les limites indiquees.",
  },
  es: {
    title: "Herramientas SoundCloud - pistas MP3/M4A, playlists y caratulas",
    description:
      "Elige un flujo claro para pistas MP3/M4A disponibles, playlists publicas o caratulas, con limites de formato y acceso explicados.",
  },
  de: {
    title: "SoundCloud Tools - MP3/M4A Tracks, Playlists und Artwork",
    description:
      "Wahle einen klaren Workflow fur verfugbare MP3/M4A-Streams, offentliche Playlists oder Coverbilder mit offengelegten Grenzen.",
  },
} as const

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const copy = copyByLocale[locale as keyof typeof copyByLocale] || copyByLocale.en
  const canonical = getLocalizedUrl(siteUrl, locale, soundCloudHubPath)
  const indexedLocales = getIndexedToolLocales(soundCloudHubPath)
  const shouldIndex = isToolLocaleIndexed(soundCloudHubPath, locale)
  const lastModified = new Date("2026-08-29")

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(siteUrl, soundCloudHubPath, [...indexedLocales]),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "website",
      url: canonical,
      siteName: "GeeksKai",
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
    other: {
      "last-modified": lastModified.toISOString(),
      "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const { children } = props
  const copy = copyByLocale[locale as keyof typeof copyByLocale] || copyByLocale.en
  const url = getLocalizedUrl(siteUrl, locale, soundCloudHubPath)

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.title,
    description: copy.description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: soundCloudToolLinks.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: getLocalizedUrl(siteUrl, locale, tool.href),
      })),
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </div>
  )
}
