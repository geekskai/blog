import { buildLanguageAlternates, getLocalizedUrl } from "@/app/i18n/urls"
import { soundCloudHubPath, soundCloudToolLinks } from "@/data/soundCloudGrowth"
import { getIndexedToolLocales, isToolLocaleIndexed } from "@/app/sitemap-config"
import type { Metadata } from "next"
import React from "react"

const siteUrl = "https://geekskai.com"

const copyByLocale = {
  en: {
    title: "SoundCloud Tools - MP3, M4A & WAV Downloads, Playlists & Artwork",
    description:
      "Download accessible SoundCloud tracks as MP3, M4A, or converted PCM WAV. Browse playlist and artwork tools, with source and access limits explained.",
  },
  fr: {
    title: "Outils SoundCloud - téléchargements MP3, M4A et WAV, playlists et pochettes",
    description:
      "Téléchargez les pistes SoundCloud accessibles en MP3, M4A ou WAV PCM converti. Retrouvez aussi les outils pour playlists et pochettes, avec les limites de source et d'accès expliquées.",
  },
  es: {
    title: "Herramientas SoundCloud - descargas MP3, M4A y WAV, playlists y carátulas",
    description:
      "Descarga pistas accesibles de SoundCloud en MP3, M4A o WAV PCM convertido. También hay herramientas para playlists y carátulas, con límites de origen y acceso explicados.",
  },
  de: {
    title: "SoundCloud Tools - MP3-, M4A- und WAV-Downloads, Playlists und Artwork",
    description:
      "Lade zugängliche SoundCloud-Tracks als MP3, M4A oder konvertierte PCM-WAV-Datei herunter. Dazu gibt es Playlist- und Artwork-Tools mit klaren Quellen- und Zugriffshinweisen.",
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
  const lastModified = new Date("2026-10-06")

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
