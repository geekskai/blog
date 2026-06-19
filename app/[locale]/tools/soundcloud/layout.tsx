import { buildLanguageAlternates, getLocalizedUrl } from "@/app/i18n/urls"
import {
  soundCloudGrowthLocales,
  soundCloudHubPath,
  soundCloudToolLinks,
} from "@/data/soundCloudGrowth"
import type { Metadata } from "next"
import React from "react"

const siteUrl = "https://geekskai.com"

const copyByLocale = {
  en: {
    title: "SoundCloud Tools - Downloader, MP3, WAV, Playlist & Artwork",
    description:
      "Choose the right SoundCloud workflow: download tracks, convert to MP3 or WAV, save playlists, or fetch artwork from one focused toolkit.",
  },
  fr: {
    title: "Outils SoundCloud - Downloader, MP3, WAV, playlists et pochettes",
    description:
      "Choisissez le bon flux SoundCloud: telecharger des pistes, convertir en MP3 ou WAV, sauvegarder des playlists ou recuperer les pochettes.",
  },
  es: {
    title: "Herramientas SoundCloud - Downloader, MP3, WAV, playlists y caratulas",
    description:
      "Elige el flujo correcto: descarga pistas, convierte a MP3 o WAV, guarda playlists o consigue caratulas de SoundCloud.",
  },
  de: {
    title: "SoundCloud Tools - Downloader, MP3, WAV, Playlists und Artwork",
    description:
      "Wahle den passenden SoundCloud Workflow: Tracks laden, zu MP3 oder WAV konvertieren, Playlists speichern oder Coverbilder abrufen.",
  },
} as const

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const copy = copyByLocale[locale as keyof typeof copyByLocale] || copyByLocale.en
  const canonical = getLocalizedUrl(siteUrl, locale, soundCloudHubPath)
  const shouldIndex = soundCloudGrowthLocales.includes(
    locale as (typeof soundCloudGrowthLocales)[number]
  )
  const lastModified = new Date("2026-06-19")

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(siteUrl, soundCloudHubPath, [...soundCloudGrowthLocales]),
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
