"use client"

import { Link } from "@/app/i18n/navigation"
import {
  soundCloudHubPath,
  soundCloudToolLinks,
  type SoundCloudToolKey,
} from "@/data/soundCloudGrowth"
import { Download, FileAudio, ImageIcon, Layers3, ListMusic, Music2 } from "lucide-react"
import { useLocale } from "next-intl"
import type { ElementType } from "react"

type SoundCloudToolSwitcherProps = {
  current: SoundCloudToolKey
}

type ToolCopy = {
  label: string
  intent: string
  cta: string
}

type SwitcherCopy = {
  eyebrow: string
  title: string
  description: string
  hubLabel: string
  tools: Record<SoundCloudToolKey, ToolCopy>
}

const iconMap: Record<SoundCloudToolKey, ElementType> = {
  hub: Layers3,
  downloader: Download,
  mp3: Music2,
  wav: FileAudio,
  playlist: ListMusic,
  artwork: ImageIcon,
}

const copyByLocale: Record<string, SwitcherCopy> = {
  en: {
    eyebrow: "SoundCloud toolkit",
    title: "Choose the right SoundCloud workflow",
    description:
      "Move between track downloads, MP3 conversion, WAV conversion, playlists, and artwork without starting a new search.",
    hubLabel: "View all SoundCloud tools",
    tools: {
      hub: {
        label: "SoundCloud tools",
        intent: "All SoundCloud download and conversion workflows in one place.",
        cta: "Open hub",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Best for one input that may be a single track or playlist.",
        cta: "Use downloader",
      },
      mp3: {
        label: "SoundCloud to MP3",
        intent: "Best for smaller audio files, phones, and broad player compatibility.",
        cta: "Convert to MP3",
      },
      wav: {
        label: "SoundCloud to WAV",
        intent: "Best for editing, production, and higher quality audio workflows.",
        cta: "Convert to WAV",
      },
      playlist: {
        label: "Playlist Downloader",
        intent: "Best for full sets, albums, and multi-track SoundCloud URLs.",
        cta: "Download playlist",
      },
      artwork: {
        label: "Artwork Downloader",
        intent: "Best when you only need the track or playlist cover image.",
        cta: "Get artwork",
      },
    },
  },
  fr: {
    eyebrow: "Outils SoundCloud",
    title: "Choisissez le bon flux SoundCloud",
    description:
      "Passez du telechargement de pistes a MP3, WAV, playlists et pochettes sans refaire une recherche.",
    hubLabel: "Voir tous les outils SoundCloud",
    tools: {
      hub: {
        label: "Outils SoundCloud",
        intent: "Tous les flux de telechargement et conversion SoundCloud au meme endroit.",
        cta: "Ouvrir le hub",
      },
      downloader: {
        label: "Telechargeur SoundCloud",
        intent: "Ideal pour une URL qui peut etre une piste ou une playlist.",
        cta: "Utiliser",
      },
      mp3: {
        label: "SoundCloud vers MP3",
        intent: "Ideal pour des fichiers legers, mobiles et lecteurs courants.",
        cta: "Convertir en MP3",
      },
      wav: {
        label: "SoundCloud vers WAV",
        intent: "Ideal pour montage, production et qualite audio plus elevee.",
        cta: "Convertir en WAV",
      },
      playlist: {
        label: "Telechargeur de playlists",
        intent: "Ideal pour sets, albums et URL SoundCloud multi-pistes.",
        cta: "Telecharger",
      },
      artwork: {
        label: "Telechargeur de pochettes",
        intent: "Ideal si vous avez seulement besoin de l'image de couverture.",
        cta: "Obtenir l'image",
      },
    },
  },
  es: {
    eyebrow: "Herramientas SoundCloud",
    title: "Elige el flujo correcto de SoundCloud",
    description:
      "Cambia entre descarga, MP3, WAV, playlists y caratulas sin empezar otra busqueda.",
    hubLabel: "Ver todas las herramientas SoundCloud",
    tools: {
      hub: {
        label: "Herramientas SoundCloud",
        intent: "Descarga y conversion de SoundCloud en un solo lugar.",
        cta: "Abrir hub",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Para una URL que puede ser pista individual o playlist.",
        cta: "Usar",
      },
      mp3: {
        label: "SoundCloud a MP3",
        intent: "Para archivos ligeros, moviles y compatibilidad amplia.",
        cta: "Convertir a MP3",
      },
      wav: {
        label: "SoundCloud a WAV",
        intent: "Para edicion, produccion y audio de mayor calidad.",
        cta: "Convertir a WAV",
      },
      playlist: {
        label: "Playlist Downloader",
        intent: "Para sets, albumes y URLs de varias pistas.",
        cta: "Descargar playlist",
      },
      artwork: {
        label: "Artwork Downloader",
        intent: "Para descargar solo la imagen de portada.",
        cta: "Obtener portada",
      },
    },
  },
  de: {
    eyebrow: "SoundCloud Werkzeuge",
    title: "Wahle den passenden SoundCloud Workflow",
    description: "Wechsle zwischen Download, MP3, WAV, Playlists und Coverbildern ohne neue Suche.",
    hubLabel: "Alle SoundCloud Tools anzeigen",
    tools: {
      hub: {
        label: "SoundCloud Tools",
        intent: "Alle SoundCloud Download- und Konvertierungsablaufe an einem Ort.",
        cta: "Hub offnen",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Fur eine URL, die Track oder Playlist sein kann.",
        cta: "Downloader nutzen",
      },
      mp3: {
        label: "SoundCloud zu MP3",
        intent: "Fur kleine Dateien, Smartphones und breite Kompatibilitat.",
        cta: "Zu MP3",
      },
      wav: {
        label: "SoundCloud zu WAV",
        intent: "Fur Schnitt, Produktion und hohere Audioqualitat.",
        cta: "Zu WAV",
      },
      playlist: {
        label: "Playlist Downloader",
        intent: "Fur Sets, Alben und SoundCloud URLs mit mehreren Tracks.",
        cta: "Playlist laden",
      },
      artwork: {
        label: "Artwork Downloader",
        intent: "Fur Coverbilder von Tracks oder Playlists.",
        cta: "Artwork laden",
      },
    },
  },
}

export default function SoundCloudToolSwitcher({ current }: SoundCloudToolSwitcherProps) {
  const locale = useLocale()
  const copy = copyByLocale[locale] || copyByLocale.en

  return (
    <section className="mx-auto max-w-7xl rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4 shadow-lg shadow-cyan-950/20 md:p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {copy.eyebrow}
          </div>
          <h2 className="mt-2 text-xl font-bold text-white md:text-2xl">{copy.title}</h2>
        </div>
        <Link
          href={soundCloudHubPath}
          prefetch={false}
          className="text-sm font-semibold text-cyan-300 underline-offset-4 hover:text-cyan-200 hover:underline"
        >
          {copy.hubLabel}
        </Link>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-300 md:text-base">{copy.description}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {soundCloudToolLinks.map((tool) => {
          const toolCopy = copy.tools[tool.key]
          const Icon = iconMap[tool.key]
          const isCurrent = current === tool.key

          return (
            <Link
              key={tool.key}
              href={tool.href}
              prefetch={false}
              aria-current={isCurrent ? "page" : undefined}
              className={`group flex min-h-[132px] flex-col rounded-xl border p-4 transition-colors ${
                isCurrent
                  ? "border-cyan-300/70 bg-cyan-400/15"
                  : "border-white/10 bg-white/5 hover:border-cyan-300/50 hover:bg-cyan-400/10"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950/70 text-cyan-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-white">{toolCopy.label}</span>
              </div>
              <span className="flex-1 text-xs leading-5 text-slate-300">{toolCopy.intent}</span>
              <span className="mt-3 text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                {toolCopy.cta}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
