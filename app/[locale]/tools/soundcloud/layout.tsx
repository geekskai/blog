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
  ar: {
    title: "أدوات SoundCloud - تنزيل MP3 وM4A وWAV وقوائم التشغيل والصور",
    description: "نزّل مقاطع SoundCloud المتاحة بصيغ MP3 أو M4A أو WAV بصيغة PCM محوّلة. استعرض أدوات قوائم التشغيل والصور مع توضيح قيود المصدر والوصول.",
  },
  ja: {
    title: "SoundCloud ツール - MP3、M4A、WAV、プレイリスト、アートワーク",
    description: "アクセス可能な SoundCloud トラックを MP3、M4A、変換した PCM WAV としてダウンロードします。プレイリストやアートワークのツールと、ソースおよびアクセスの制限を確認できます。",
  },
  ko: {
    title: "SoundCloud 도구 - MP3, M4A, WAV 다운로드와 플레이리스트·아트워크",
    description: "접근 가능한 SoundCloud 트랙을 MP3, M4A 또는 변환된 PCM WAV로 다운로드하세요. 플레이리스트와 아트워크 도구도 제공하며 소스와 접근 제한을 설명합니다.",
  },
  no: {
    title: "SoundCloud-verktøy – MP3-, M4A- og WAV-nedlasting, spillelister og artwork",
    description: "Last ned tilgjengelige SoundCloud-spor som MP3, M4A eller konvertert PCM WAV. Finn også verktøy for spillelister og artwork, med forklaringer på kilde- og tilgangsbegrensninger.",
  },
  "zh-cn": {
    title: "SoundCloud 工具 - MP3、M4A、WAV 下载、播放列表与封面",
    description: "将可访问的 SoundCloud 曲目下载为 MP3、M4A 或转换后的 PCM WAV。页面也提供播放列表和封面工具，并说明来源与访问限制。",
  },
  da: {
    title: "SoundCloud-værktøjer – MP3-, M4A- og WAV-downloads, playlister og artwork",
    description: "Download tilgængelige SoundCloud-numre som MP3, M4A eller konverteret PCM WAV. Find også værktøjer til playlister og artwork med forklaringer på kilde- og adgangsbegrænsninger.",
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
  const lastModified = new Date("2026-10-09")

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
