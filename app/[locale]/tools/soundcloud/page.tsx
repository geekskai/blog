import { Link } from "@/app/i18n/navigation"
import SoundCloudToolSwitcher from "@/components/SoundCloudToolSwitcher"
import { ArrowRight, Sparkles } from "lucide-react"

const accentGradient =
  "bg-gradient-to-r from-sky-300 via-sky-400 to-cyan-400 bg-clip-text text-transparent"

const copyByLocale = {
  en: {
    eyebrow: "SoundCloud toolkit",
    titleLead: "SoundCloud tools for",
    titleAccent: "tracks, playlists, and artwork",
    intro:
      "Start from the workflow that matches your task. Track pages disclose the available MP3 or M4A stream, playlists run sequentially, and artwork is handled separately.",
    proofPublic: "Public tools",
    proofPublicValue: "No signup",
    proofFormats: "Formats",
    proofFormatsValue: "MP3 · M4A",
    quickEyebrow: "Quick guide",
    quickTitleLead: "Which SoundCloud tool",
    quickTitleAccent: "should I use?",
    quickItems: [
      "Use Downloader when you are not sure whether the URL is a track or playlist.",
      "Use MP3 to prefer a progressive MP3 while keeping a truthful M4A fallback.",
      "Use WAV to inspect the available source format; it does not upconvert lossy audio.",
      "Use Playlist when the URL contains /sets/.",
      "Use Artwork when you only need the cover image.",
    ],
    ctaPrimary: "Start with Downloader",
  },
  fr: {
    eyebrow: "Outils SoundCloud",
    titleLead: "Outils SoundCloud pour",
    titleAccent: "pistes, playlists et pochettes",
    intro:
      "Choisissez le flux adapte: les pages de pistes indiquent le vrai format MP3 ou M4A, les playlists sont traitees sequentiellement et les pochettes separent les images.",
    proofPublic: "Outils publics",
    proofPublicValue: "Sans inscription",
    proofFormats: "Formats",
    proofFormatsValue: "MP3 · M4A",
    quickEyebrow: "Guide rapide",
    quickTitleLead: "Quel outil SoundCloud",
    quickTitleAccent: "utiliser ?",
    quickItems: [
      "Downloader convient si vous ne savez pas si l'URL est une piste ou une playlist.",
      "MP3 priorise le flux MP3 progressif et conserve le vrai repli M4A.",
      "WAV verifie le format source disponible sans convertir artificiellement le son.",
      "Playlist convient aux URL qui contiennent /sets/.",
      "Artwork convient si vous avez seulement besoin de la pochette.",
    ],
    ctaPrimary: "Commencer avec Downloader",
  },
  es: {
    eyebrow: "Herramientas SoundCloud",
    titleLead: "Herramientas SoundCloud para",
    titleAccent: "pistas, playlists y caratulas",
    intro:
      "Elige el flujo correcto: las paginas de pistas muestran el formato MP3 o M4A real, las playlists se procesan en orden y Artwork gestiona las caratulas.",
    proofPublic: "Herramientas publicas",
    proofPublicValue: "Sin registro",
    proofFormats: "Formatos",
    proofFormatsValue: "MP3 · M4A",
    quickEyebrow: "Guia rapida",
    quickTitleLead: "Que herramienta SoundCloud",
    quickTitleAccent: "usar?",
    quickItems: [
      "Downloader sirve cuando no sabes si la URL es una pista o playlist.",
      "MP3 prioriza el flujo MP3 progresivo y conserva M4A como alternativa real.",
      "WAV comprueba el formato disponible sin reconvertir audio con perdida.",
      "Playlist sirve si la URL contiene /sets/.",
      "Artwork sirve si solo necesitas la caratula.",
    ],
    ctaPrimary: "Empezar con Downloader",
  },
  de: {
    eyebrow: "SoundCloud Werkzeuge",
    titleLead: "SoundCloud Tools fur",
    titleAccent: "Tracks, Playlists und Artwork",
    intro:
      "Starte mit dem passenden Workflow: Track-Seiten zeigen das echte MP3- oder M4A-Format, Playlists laufen nacheinander und Artwork behandelt Coverbilder separat.",
    proofPublic: "Offentliche Tools",
    proofPublicValue: "Ohne Anmeldung",
    proofFormats: "Formate",
    proofFormatsValue: "MP3 · M4A",
    quickEyebrow: "Kurzanleitung",
    quickTitleLead: "Welches SoundCloud Tool",
    quickTitleAccent: "passt?",
    quickItems: [
      "Downloader passt, wenn unklar ist, ob die URL ein Track oder eine Playlist ist.",
      "MP3 bevorzugt progressives MP3 und behalt den echten M4A-Fallback.",
      "WAV pruft das verfugbare Quellformat ohne verlustbehaftetes Audio hochzukonvertieren.",
      "Playlist passt, wenn die URL /sets/ enthalt.",
      "Artwork passt, wenn nur das Coverbild benotigt wird.",
    ],
    ctaPrimary: "Mit Downloader starten",
  },
} as const

export default async function SoundCloudHubPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const copy = copyByLocale[locale as keyof typeof copyByLocale] || copyByLocale.en

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(14,165,233,0.16),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_50%_45%_at_90%_0%,rgba(34,211,238,0.1),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_55%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:py-12 md:space-y-12 md:py-14">
        <header className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" aria-hidden />
            {copy.eyebrow}
          </p>
          <h1 className="mx-auto mt-5 max-w-7xl text-balance text-[clamp(1.875rem,4.8vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.035em]">
            <span className="text-white">{copy.titleLead} </span>
            <span className={accentGradient}>{copy.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-5xl text-pretty text-base leading-7 text-slate-200 sm:text-lg">
            {copy.intro}
          </p>

          <dl className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-2 sm:gap-3">
            <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 px-4 py-3 text-left">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[0.68rem]">
                {copy.proofPublic}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-violet-200 sm:text-base">
                {copy.proofPublicValue}
              </dd>
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-950/20 px-4 py-3 text-left">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sky-300/80 sm:text-[0.68rem]">
                {copy.proofFormats}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-sky-200 sm:text-base">
                {copy.proofFormatsValue}
              </dd>
            </div>
          </dl>
        </header>

        <SoundCloudToolSwitcher current="hub" showHeader={false} />

        <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/60 p-5 md:p-8">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/45 to-transparent"
            aria-hidden
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300 sm:text-xs">
            {copy.quickEyebrow}
          </p>
          <h2 className="mt-2 text-[clamp(1.375rem,3vw,1.875rem)] font-bold leading-tight tracking-[-0.03em]">
            <span className="text-white">{copy.quickTitleLead} </span>
            <span className={accentGradient}>{copy.quickTitleAccent}</span>
          </h2>
          <ul className="mt-6 space-y-3">
            {copy.quickItems.map((item, index) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-3.5 text-sm leading-6 text-slate-200 md:text-base"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-500/10 text-xs font-bold tabular-nums text-sky-300">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center sm:justify-start">
            <Link
              href="/tools/soundcloud-downloader/"
              prefetch={false}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-semibold text-white shadow-[0_12px_40px_-16px_rgba(14,165,233,0.75)] transition-[background-color,box-shadow] hover:bg-sky-400 hover:shadow-[0_16px_48px_-14px_rgba(14,165,233,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
            >
              {copy.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
