import { Link } from "@/app/i18n/navigation"
import SoundCloudToolSwitcher from "@/components/SoundCloudToolSwitcher"
import { soundCloudToolLinks, type SoundCloudToolLink } from "@/data/soundCloudGrowth"
import { Download, FileAudio, ImageIcon, ListMusic, Music2 } from "lucide-react"
import type { ElementType } from "react"

const copyByLocale = {
  en: {
    eyebrow: "SoundCloud toolkit",
    title: "SoundCloud downloader, converter, playlist, and artwork tools",
    intro:
      "Start from the workflow that matches your task. The downloader handles mixed URLs, MP3 is for compatibility, WAV is for editing, playlist is for batches, and artwork is for cover images.",
    quickTitle: "Which SoundCloud tool should I use?",
    quickItems: [
      "Use Downloader when you are not sure whether the URL is a track or playlist.",
      "Use MP3 for smaller files and mobile playback.",
      "Use WAV for editing, production, or higher-quality workflows.",
      "Use Playlist when the URL contains /sets/.",
      "Use Artwork when you only need the cover image.",
    ],
  },
  fr: {
    eyebrow: "Outils SoundCloud",
    title: "Telechargeur, convertisseur, playlist et pochettes SoundCloud",
    intro:
      "Choisissez le flux adapte a votre tache: Downloader pour les URL mixtes, MP3 pour la compatibilite, WAV pour l'edition, Playlist pour les lots et Artwork pour les pochettes.",
    quickTitle: "Quel outil SoundCloud utiliser ?",
    quickItems: [
      "Downloader convient si vous ne savez pas si l'URL est une piste ou une playlist.",
      "MP3 convient aux fichiers legers et a la lecture mobile.",
      "WAV convient au montage, a la production et a la qualite audio.",
      "Playlist convient aux URL qui contiennent /sets/.",
      "Artwork convient si vous avez seulement besoin de la pochette.",
    ],
  },
  es: {
    eyebrow: "Herramientas SoundCloud",
    title: "Downloader, convertidor, playlist y caratulas de SoundCloud",
    intro:
      "Elige el flujo correcto: Downloader para URLs mixtas, MP3 para compatibilidad, WAV para edicion, Playlist para lotes y Artwork para caratulas.",
    quickTitle: "Que herramienta SoundCloud usar?",
    quickItems: [
      "Downloader sirve cuando no sabes si la URL es una pista o playlist.",
      "MP3 sirve para archivos ligeros y reproduccion movil.",
      "WAV sirve para edicion, produccion y mejor calidad.",
      "Playlist sirve si la URL contiene /sets/.",
      "Artwork sirve si solo necesitas la caratula.",
    ],
  },
  de: {
    eyebrow: "SoundCloud Werkzeuge",
    title: "SoundCloud Downloader, Converter, Playlist und Artwork Tools",
    intro:
      "Starte mit dem passenden Workflow: Downloader fur gemischte URLs, MP3 fur Kompatibilitat, WAV fur Bearbeitung, Playlist fur Stapel und Artwork fur Coverbilder.",
    quickTitle: "Welches SoundCloud Tool passt?",
    quickItems: [
      "Downloader passt, wenn unklar ist, ob die URL ein Track oder eine Playlist ist.",
      "MP3 passt fur kleine Dateien und mobile Wiedergabe.",
      "WAV passt fur Schnitt, Produktion und hohere Qualitat.",
      "Playlist passt, wenn die URL /sets/ enthalt.",
      "Artwork passt, wenn nur das Coverbild benotigt wird.",
    ],
  },
} as const

const iconMap: Record<SoundCloudToolLink["key"], ElementType> = {
  downloader: Download,
  mp3: Music2,
  wav: FileAudio,
  playlist: ListMusic,
  artwork: ImageIcon,
}

const labelMap: Record<SoundCloudToolLink["key"], string> = {
  downloader: "SoundCloud Downloader",
  mp3: "SoundCloud to MP3",
  wav: "SoundCloud to WAV",
  playlist: "Playlist Downloader",
  artwork: "Artwork Downloader",
}

export default async function SoundCloudHubPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const copy = copyByLocale[locale as keyof typeof copyByLocale] || copyByLocale.en

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:py-10">
        <header className="text-center">
          <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            {copy.eyebrow}
          </div>
          <h1 className="mx-auto mt-4 max-w-5xl text-3xl font-bold leading-tight text-white md:text-5xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-slate-300 md:text-lg">
            {copy.intro}
          </p>
        </header>

        <SoundCloudToolSwitcher current="hub" />

        <section className="grid gap-4 md:grid-cols-5">
          {soundCloudToolLinks.map((tool) => {
            const Icon = iconMap[tool.key]
            return (
              <Link
                key={tool.key}
                href={tool.href}
                prefetch={false}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-cyan-300/40 hover:bg-cyan-400/10"
              >
                <Icon className="mb-4 h-6 w-6 text-cyan-200" />
                <h2 className="text-base font-bold text-white">{labelMap[tool.key]}</h2>
              </Link>
            )
          })}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-8">
          <h2 className="text-2xl font-bold text-white">{copy.quickTitle}</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300 md:text-base">
            {copy.quickItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-cyan-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
