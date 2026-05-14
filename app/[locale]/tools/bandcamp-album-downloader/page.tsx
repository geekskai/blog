import React from "react"
import { BandcampAlbumDownloaderSeoSections } from "./components/BandcampAlbumDownloaderSeoSections"
import { getTranslations } from "next-intl/server"
import { MainSection } from "./components/MainSection"

const lastUpdated = new Date("2026-05-14")

function formatLastUpdated(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

async function BandcampAlbumDownloaderPageContent({
  initialUrl,
  locale,
}: {
  initialUrl?: string
  locale: string
}) {
  const t = await getTranslations({ locale, namespace: "BandcampAlbumDownloader" })
  const facts = t.raw("facts") as Array<{ label: string; value: string; description: string }>

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6">
        <header className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 shadow-2xl shadow-cyan-950/30 sm:p-7 lg:p-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                {t("badge")}
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                {t("updated", { date: formatLastUpdated(lastUpdated, locale) })}
              </span>
            </div>

            <div>
              <h1 className="bg-gradient-to-r from-white via-cyan-100 to-fuchsia-200 bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-4xl lg:text-5xl">
                {t("hero.title")}
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                <strong className="font-semibold text-white">{t("hero.quickAnswerLabel")}</strong>{" "}
                {t("hero.quickAnswerBody")}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">{fact.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <MainSection initialUrl={initialUrl} />

        <BandcampAlbumDownloaderSeoSections />
      </div>
    </main>
  )
}

export default async function BandcampAlbumDownloaderPage({
  params,
}: {
  params: Promise<{ locale: string; url?: string }>
}) {
  const { locale, url } = await params
  return <BandcampAlbumDownloaderPageContent initialUrl={url} locale={locale} />
}
