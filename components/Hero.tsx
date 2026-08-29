"use client"

import Link from "./Link"
import { TOOL_COUNT } from "@/data/toolNavigation"
import {
  ArrowRight,
  AudioLines,
  FileAudio,
  Gauge,
  Layers3,
  ListMusic,
  Music2,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useTranslations } from "next-intl"

const featuredTasks = [
  {
    href: "/tools/soundcloud-to-mp3/",
    icon: Music2,
    titleKey: "home_soundcloud_mp3_title",
    descriptionKey: "home_soundcloud_mp3_description",
  },
  {
    href: "/tools/soundcloud-playlist-downloader/",
    icon: ListMusic,
    titleKey: "home_soundcloud_playlist_title",
    descriptionKey: "home_soundcloud_playlist_description",
  },
  {
    href: "/tools/soundcloud-to-wav/",
    icon: FileAudio,
    titleKey: "home_soundcloud_source_title",
    descriptionKey: "home_soundcloud_source_description",
  },
] as const

const accentGradient =
  "bg-gradient-to-r from-sky-300 via-sky-400 to-violet-400 bg-clip-text text-transparent"

export default function Hero() {
  const t = useTranslations("HomePage")
  const titleLead = t.has("home_product_title_lead")
    ? t("home_product_title_lead")
    : t("home_product_title")
  const titleAccent = t.has("home_product_title_accent") ? t("home_product_title_accent") : null
  const tasksTitle = t("home_tasks_title")
  const tasksAccent = t.has("home_tasks_title_accent") ? t("home_tasks_title_accent") : null
  const tasksTitleLead =
    tasksAccent && tasksTitle.includes(tasksAccent)
      ? tasksTitle.slice(0, tasksTitle.indexOf(tasksAccent)).replace(/,\s*$/, "")
      : tasksTitle

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-800/80">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(14,165,233,0.18),transparent)]" />
          <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_55%_45%_at_85%_5%,rgba(124,58,237,0.14),transparent)]" />
          <div className="absolute left-[58%] top-[-16rem] h-[32rem] w-[32rem] rounded-full bg-sky-500/10 blur-[120px]" />
          <div className="absolute bottom-[-18rem] left-[72%] h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.04fr)_minmax(29rem,0.96fr)] lg:items-center lg:gap-14 lg:py-24 2xl:px-0">
          <div className="max-w-2xl">
            {t.has("home_product_eyebrow") ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200 sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
                {t("home_product_eyebrow")}
              </p>
            ) : null}

            <h1 className="mt-5 text-balance text-[clamp(2rem,5.2vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              <span className="block text-white">{titleLead}</span>
              {titleAccent ? (
                <span className={`mt-1 block ${accentGradient}`}>{titleAccent}</span>
              ) : null}
            </h1>

            <p className="mt-6 max-w-[56ch] text-pretty text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              {t("home_product_description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/audio-toolkit/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white no-underline shadow-[0_12px_40px_-16px_rgba(14,165,233,0.75)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-sky-400 hover:text-white hover:no-underline hover:shadow-[0_16px_48px_-14px_rgba(14,165,233,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
              >
                <AudioLines className="h-4 w-4" aria-hidden="true" />
                {t("home_open_audio_toolkit")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/tools/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-600/80 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-100 no-underline transition-colors duration-200 hover:border-sky-500/40 hover:bg-slate-800 hover:text-white hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
              >
                {t("footer_view_all_tools")}
              </Link>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-3 sm:p-4">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[0.68rem]">
                  {t("home_proof_tools")}
                </dt>
                <dd className="mt-2 text-xl font-bold tabular-nums text-sky-300 sm:text-2xl">
                  {TOOL_COUNT}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-3 sm:p-4">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[0.68rem]">
                  {t("home_proof_access")}
                </dt>
                <dd className="mt-2 text-sm font-semibold text-violet-200 sm:text-base">
                  {t("home_proof_no_signup")}
                </dd>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 sm:p-4">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-emerald-300/80 sm:text-[0.68rem]">
                  {t("home_proof_audio")}
                </dt>
                <dd className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-300 sm:text-base">
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("home_audio_local_status")}
                </dd>
              </div>
            </dl>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-sky-400/25 bg-slate-950/80 shadow-[0_28px_80px_-40px_rgba(14,165,233,0.55)]"
            aria-label={t("home_audio_example_label")}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-sky-300/80 to-transparent" />
            <div className="flex flex-col gap-4 border-b border-slate-800/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-500/15 text-sky-300">
                  <AudioLines className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Geekskai Audio Toolkit</p>
                  <p className="mt-1 text-xs text-slate-400">{t("home_audio_example_label")}</p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
                {t("home_audio_local_status")}
              </span>
            </div>

            <div className="px-5 py-6 sm:px-6 sm:py-7">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">podcast-intro.wav</p>
                  <p className="mt-1 text-xs text-slate-400">48 kHz · Stereo · WAV</p>
                </div>
                <span className="shrink-0 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300">
                  {t("home_audio_example_file")}
                </span>
              </div>

              <dl className="grid gap-px overflow-hidden rounded-xl border border-slate-800 bg-slate-800 sm:grid-cols-3">
                <div className="bg-slate-950/95 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                    {t("home_audio_input")}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-sky-100">WAV · 48 kHz</dd>
                </div>
                <div className="bg-slate-950/95 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-violet-300">
                    {t("home_audio_target")}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-violet-100">MP3 · 192 kbps</dd>
                </div>
                <div className="bg-slate-950/95 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-violet-300">
                    {t("home_audio_normalize")}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-violet-100">−14 LUFS</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-violet-500/15 bg-violet-950/20 p-4">
                <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" aria-hidden="true" />
                <p className="text-sm leading-6 text-slate-200">{t("home_audio_local_note")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 2xl:px-0">
        <div className="flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {t.has("home_tasks_eyebrow") ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300 sm:text-xs">
                {t("home_tasks_eyebrow")}
              </p>
            ) : null}
            <h2 className="mt-2 text-[clamp(1.625rem,3.5vw,2.25rem)] font-bold leading-tight tracking-[-0.03em]">
              {tasksAccent ? (
                <>
                  <span className="text-white">{tasksTitleLead}</span>
                  {tasksTitleLead ? ", " : null}
                  <span className={accentGradient}>{tasksAccent}</span>
                </>
              ) : (
                <span className="text-white">{tasksTitle}</span>
              )}
            </h2>
            <p className="mt-4 max-w-[65ch] text-base leading-7 text-slate-300">
              {t("home_tasks_description")}
            </p>
          </div>
          <Link
            href="/tools/"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 text-sm font-semibold text-sky-200 no-underline transition-colors hover:border-sky-400/40 hover:bg-sky-500/15 hover:text-sky-100 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none"
          >
            {t("footer_view_all_tools")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 lg:grid-cols-[minmax(17rem,0.78fr)_minmax(0,1.22fr)]">
          <Link
            href="/tools/soundcloud/"
            className="group relative flex min-h-72 flex-col justify-between overflow-hidden border-b border-slate-800 bg-sky-500/[0.08] p-6 no-underline transition-colors hover:bg-sky-500/[0.12] hover:text-white hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-300 sm:p-8 lg:border-b-0 lg:border-r"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" aria-hidden />
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-300">
              <Layers3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="mt-12 block">
              <span className="block text-2xl font-bold tracking-[-0.025em] text-white sm:text-3xl">
                {t("home_soundcloud_hub_title")}
              </span>
              <span className="mt-3 block max-w-[38ch] text-sm leading-6 text-slate-300 sm:text-base">
                {t("home_soundcloud_hub_description")}
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                {t("home_soundcloud_hub_cta")}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </span>
            </span>
          </Link>

          <div className="divide-y divide-slate-800">
            {featuredTasks.map(({ href, icon: Icon, titleKey, descriptionKey }) => (
              <Link
                key={href}
                href={href}
                className="group grid min-h-32 gap-5 p-6 no-underline transition-colors hover:bg-slate-900/65 hover:text-white hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-300 sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-center sm:gap-6 sm:px-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900 text-slate-300 transition-colors group-hover:border-sky-400/30 group-hover:text-sky-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-3 text-lg font-semibold text-white">
                    {t(titleKey)}
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-slate-600 transition-[color,transform] group-hover:translate-x-1 group-hover:text-sky-300 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-2 block max-w-[58ch] text-sm leading-6 text-slate-400 sm:text-base">
                    {t(descriptionKey)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
