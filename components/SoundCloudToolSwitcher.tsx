"use client"

import { Link } from "@/app/i18n/navigation"
import {
  soundCloudHubPath,
  soundCloudToolLinks,
  type SoundCloudToolKey,
} from "@/data/soundCloudGrowth"
import {
  Download,
  FileAudio,
  ImageIcon,
  Layers3,
  ListMusic,
  Music2,
  ArrowRight,
} from "lucide-react"
import { useLocale } from "next-intl"
import type { ElementType } from "react"

type SoundCloudToolSwitcherProps = {
  current: SoundCloudToolKey
  showHeader?: boolean
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
      "Move between track downloads, source-format checks, playlists, and artwork without starting a new search.",
    hubLabel: "View all SoundCloud tools",
    tools: {
      hub: {
        label: "SoundCloud tools",
        intent: "All supported SoundCloud download workflows in one place.",
        cta: "Open hub",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Best for one input that may be a single track or playlist.",
        cta: "Use downloader",
      },
      mp3: {
        label: "SoundCloud to MP3",
        intent: "Prefers progressive MP3 and keeps M4A when that is the available stream.",
        cta: "Check MP3",
      },
      wav: {
        label: "SoundCloud to WAV",
        intent: "Checks the actual MP3 or M4A source without fake WAV upconversion.",
        cta: "Check source format",
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
      "Passez du telechargement aux formats source, playlists et pochettes sans refaire une recherche.",
    hubLabel: "Voir tous les outils SoundCloud",
    tools: {
      hub: {
        label: "Outils SoundCloud",
        intent: "Tous les flux de telechargement SoundCloud pris en charge au meme endroit.",
        cta: "Ouvrir le hub",
      },
      downloader: {
        label: "Telechargeur SoundCloud",
        intent: "Ideal pour une URL qui peut etre une piste ou une playlist.",
        cta: "Utiliser",
      },
      mp3: {
        label: "SoundCloud vers MP3",
        intent: "Priorise le MP3 progressif et conserve M4A lorsque c'est le flux disponible.",
        cta: "Verifier le MP3",
      },
      wav: {
        label: "SoundCloud vers WAV",
        intent: "Verifie le vrai flux MP3 ou M4A sans fausse conversion WAV.",
        cta: "Verifier le format",
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
      "Cambia entre descargas, formatos de origen, playlists y caratulas sin empezar otra busqueda.",
    hubLabel: "Ver todas las herramientas SoundCloud",
    tools: {
      hub: {
        label: "Herramientas SoundCloud",
        intent: "Flujos de descarga SoundCloud compatibles en un solo lugar.",
        cta: "Abrir hub",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Para una URL que puede ser pista individual o playlist.",
        cta: "Usar",
      },
      mp3: {
        label: "SoundCloud a MP3",
        intent: "Prioriza MP3 progresivo y conserva M4A cuando es el flujo disponible.",
        cta: "Comprobar MP3",
      },
      wav: {
        label: "SoundCloud a WAV",
        intent: "Comprueba el flujo MP3 o M4A real sin falsa conversion WAV.",
        cta: "Comprobar formato",
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
    description:
      "Wechsle zwischen Downloads, Quellformaten, Playlists und Coverbildern ohne neue Suche.",
    hubLabel: "Alle SoundCloud Tools anzeigen",
    tools: {
      hub: {
        label: "SoundCloud Tools",
        intent: "Alle unterstutzten SoundCloud Download-Ablaufe an einem Ort.",
        cta: "Hub offnen",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Fur eine URL, die Track oder Playlist sein kann.",
        cta: "Downloader nutzen",
      },
      mp3: {
        label: "SoundCloud zu MP3",
        intent: "Bevorzugt progressives MP3 und behalt M4A, wenn nur dieser Stream verfugbar ist.",
        cta: "MP3 prufen",
      },
      wav: {
        label: "SoundCloud zu WAV",
        intent: "Prüft den echten MP3- oder M4A-Stream ohne falsche WAV-Konvertierung.",
        cta: "Quellformat prufen",
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

export default function SoundCloudToolSwitcher({
  current,
  showHeader = true,
}: SoundCloudToolSwitcherProps) {
  const locale = useLocale()
  const copy = copyByLocale[locale] || copyByLocale.en

  return (
    <section
      className={`mx-auto max-w-7xl rounded-2xl border border-sky-500/20 bg-slate-950/55 p-4 shadow-[0_24px_80px_-48px_rgba(14,165,233,0.45)] md:p-5 ${
        showHeader ? "" : "border-slate-800/90"
      }`}
    >
      {showHeader ? (
        <>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300 sm:text-xs">
                {copy.eyebrow}
              </p>
              <h2 className="mt-2 text-[clamp(1.25rem,2.8vw,1.75rem)] font-bold leading-tight tracking-[-0.03em] text-white">
                {copy.title}
              </h2>
            </div>
            <Link
              href={soundCloudHubPath}
              prefetch={false}
              className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-sky-300 underline-offset-4 transition-colors hover:text-sky-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {copy.hubLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="mb-5 text-sm leading-6 text-slate-300 md:text-base">{copy.description}</p>
        </>
      ) : (
        <div
          className="pointer-events-none mb-4 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
          aria-hidden
        />
      )}
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
              className={`group relative flex min-h-[148px] flex-col overflow-hidden rounded-xl border p-4 transition-[border-color,background-color,box-shadow] duration-200 motion-reduce:transition-none ${
                isCurrent
                  ? "border-sky-400/55 bg-sky-500/15 shadow-[0_12px_40px_-24px_rgba(14,165,233,0.55)]"
                  : "border-slate-800/90 bg-slate-900/45 hover:border-sky-400/35 hover:bg-sky-500/10"
              }`}
            >
              {!isCurrent ? (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                  aria-hidden
                />
              ) : (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent"
                  aria-hidden
                />
              )}
              <div className="mb-3 flex items-start gap-2.5">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    isCurrent
                      ? "border-sky-400/30 bg-sky-500/15 text-sky-200"
                      : "border-slate-700/80 bg-slate-950/70 text-slate-300 group-hover:border-sky-400/25 group-hover:text-sky-300"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="pt-0.5 text-sm font-bold leading-snug text-white">
                  {toolCopy.label}
                </span>
              </div>
              <span className="flex-1 text-xs leading-5 text-slate-300 group-hover:text-slate-200">
                {toolCopy.intent}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 group-hover:text-sky-200">
                {toolCopy.cta}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                  aria-hidden
                />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
