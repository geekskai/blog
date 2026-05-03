"use client"

import React, { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"
import { isBandcampTrackUrl } from "../../../../utils/bandcamp"
import { BandcampToMp3SeoSections } from "./components/BandcampToMp3SeoSections"
import { useBandcampToMp3 } from "./useBandcampToMp3"

const lastUpdated = new Date("2026-05-03")
const deferredSectionStyle = {
  contentVisibility: "auto" as const,
  containIntrinsicSize: "auto 900px",
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/50"

const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"

function formatLastUpdated(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function BandcampToMp3PageContent() {
  const t = useTranslations("BandcampToMp3")
  const locale = useLocale()
  const searchParams = useSearchParams()
  const facts = t.raw("facts") as Array<{ label: string; value: string; description: string }>
  const practicalUseCases = t.raw("aside.useCases") as string[]
  const whyItems = t.raw("aside.whyItems") as string[]
  const expectItems = t.raw("aside.expectItems") as Array<{ title: string; body: string }>
  const {
    trackUrl,
    result,
    loadingAction,
    error,
    downloadError,
    setTrackUrl,
    inspectTrackUrl,
    quickDownloadTrack,
    triggerDownload,
  } = useBandcampToMp3({
    requestFailed: t("errors.requestFailed"),
    resolveTrackUrlFailed: t("errors.resolveTrackUrlFailed"),
    noMp3Link: t("errors.noMp3Link"),
    invalidMp3Url: t("errors.invalidMp3Url"),
    expiredMediaLink: t("errors.expiredMediaLink"),
  })
  const autoLoadedUrlRef = useRef<string | null>(null)
  const [isPasting, setIsPasting] = React.useState(false)

  useEffect(() => {
    const incomingUrl = searchParams.get("url")?.trim()
    if (!incomingUrl || autoLoadedUrlRef.current === incomingUrl) return

    autoLoadedUrlRef.current = incomingUrl
    setTrackUrl(incomingUrl)
    void inspectTrackUrl(incomingUrl)
  }, [inspectTrackUrl, searchParams, setTrackUrl])

  const normalizedUrl = trackUrl.trim()
  const hasValidTrackUrl = isBandcampTrackUrl(normalizedUrl)
  const actionHint = normalizedUrl
    ? hasValidTrackUrl
      ? t("workflow.actionHint.valid")
      : t("workflow.actionHint.invalid")
    : t("workflow.actionHint.empty")

  const pasteFromClipboard = async () => {
    if (!navigator.clipboard?.readText) return

    try {
      setIsPasting(true)
      const clipboardText = (await navigator.clipboard.readText()).trim()
      setTrackUrl(clipboardText)
      if (isBandcampTrackUrl(clipboardText)) {
        void inspectTrackUrl(clipboardText)
      }
    } finally {
      setIsPasting(false)
    }
  }

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
                <div key={fact.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{fact.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{fact.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {(error || downloadError) && (
          <div className="space-y-3">
            {error ? (
              <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}
            {downloadError ? (
              <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                {downloadError}
              </div>
            ) : null}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6">
          <section className="rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
            <div className="border-b border-white/10 px-5 py-4 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{t("workflow.eyebrow")}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{t("workflow.title")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("workflow.description")}
              </p>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
              <div className="rounded-[24px] border border-cyan-400/15 bg-slate-950/70 p-4 shadow-xl backdrop-blur-sm sm:p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      {t("workflow.quickInput")}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        normalizedUrl
                          ? "border border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
                          : "border border-white/10 bg-white/5 text-slate-400"
                      }`}
                    >
                      {normalizedUrl ? t("workflow.loadedState") : t("workflow.waitingState")}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <label className="text-sm font-medium text-slate-200" htmlFor="bandcamp-track-url">
                      {t("workflow.inputLabel")}
                    </label>
                    <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-3 sm:p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            id="bandcamp-track-url"
                            className={inputClass}
                            value={trackUrl}
                            onChange={(event) => setTrackUrl(event.target.value)}
                            onPaste={(event) => {
                              const pastedText = event.clipboardData.getData("text").trim()
                              if (!pastedText) return

                              event.preventDefault()
                              setTrackUrl(pastedText)
                              if (isBandcampTrackUrl(pastedText)) {
                                void inspectTrackUrl(pastedText)
                              }
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") void inspectTrackUrl()
                            }}
                            placeholder={t("workflow.inputPlaceholder")}
                          />
                          <button
                            type="button"
                            onClick={() => void pasteFromClipboard()}
                            className={`${secondaryButtonClass} sm:min-w-[120px]`}
                            disabled={isPasting}
                          >
                            {isPasting ? t("actions.pasting") : t("actions.paste")}
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => void inspectTrackUrl()}
                            className={`${primaryButtonClass} w-full`}
                            disabled={loadingAction === "trackMp3" || !hasValidTrackUrl}
                          >
                            {loadingAction === "trackMp3" ? t("actions.extractingMp3") : t("actions.getMp3Link")}
                          </button>
                          <button
                            type="button"
                            onClick={() => void quickDownloadTrack()}
                            className={`${secondaryButtonClass} min-h-11 w-full`}
                            disabled={loadingAction === "trackMp3" || !hasValidTrackUrl}
                          >
                            {loadingAction === "trackMp3"
                              ? t("actions.preparingDownload")
                              : t("actions.extractAndDownloadMp3")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const exampleUrl = "https://gmcfosho.bandcamp.com/track/happy-bursday"
                        setTrackUrl(exampleUrl)
                        void inspectTrackUrl(exampleUrl)
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-100"
                    >
                      {t("actions.tryExampleTrack")}
                    </button>
                  </div>

                  <p className="text-sm leading-6 text-slate-300">{actionHint}</p>
                  <p className="text-xs leading-6 text-slate-400">
                    {t("workflow.manualHint")}
                  </p>

                  <p className="text-xs leading-6 text-amber-100">
                    {t("workflow.scopeNotePrefix")}{" "}
                    <Link href="/tools/bandcamp-album-downloader" className="underline">
                      {t("workflow.scopeNoteLink")}
                    </Link>{" "}
                    {t("workflow.scopeNoteSuffix")}
                  </p>
                </div>
              </div>

              {!result ? (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
                  {t("workflow.emptyState")}
                </div>
              ) : null}

              {result ? (
                <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {result.summary?.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Bandcamp artwork URLs are dynamic remote assets
                      <img
                        src={result.summary.coverUrl}
                        alt={result.summary.title}
                        className="h-32 w-full rounded-2xl object-cover sm:h-36 sm:w-36"
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-xs text-slate-400 sm:h-36 sm:w-36">
                        {t("result.noCoverArt")}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xl font-semibold text-white">
                        {result.summary?.title || t("result.trackSummaryFallback")}
                      </p>
                      <dl className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                        {result.summary?.artist ? (
                          <div>
                            <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("result.artist")}</dt>
                            <dd className="mt-1">{result.summary.artist}</dd>
                          </div>
                        ) : null}
                        {result.summary?.album ? (
                          <div>
                            <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("result.album")}</dt>
                            <dd className="mt-1">{result.summary.album}</dd>
                          </div>
                        ) : null}
                        {result.summary?.durationText ? (
                          <div>
                            <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("result.duration")}</dt>
                            <dd className="mt-1">{result.summary.durationText}</dd>
                          </div>
                        ) : null}
                        {result.summary?.releaseDate ? (
                          <div>
                            <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("result.releaseDate")}</dt>
                            <dd className="mt-1">{result.summary.releaseDate}</dd>
                          </div>
                        ) : null}
                      </dl>

                      {result.primaryMp3Url ? (
                        <div className="mt-4 space-y-3">
                          <audio className="w-full" controls preload="none" src={result.primaryMp3Url}>
                            {t("result.audioUnsupported")}
                          </audio>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                triggerDownload(
                                  result.primaryMp3Url || "",
                                  result.filename,
                                  result.sourceUrl
                                )
                              }
                              className={primaryButtonClass}
                            >
                              {t("result.downloadMp3")}
                            </button>
                            <a
                              href={result.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={secondaryButtonClass}
                            >
                              {t("result.openBandcampTrack")}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-slate-400">
                          {t("result.noMp3Exposed")}
                        </p>
                      )}
                    </div>
                  </div>

                  {result.summary?.tags.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.summary.tags.slice(0, 8).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                        >
                          #{item}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {result.mp3Links.length > 1 ? (
                    <details className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-white">
                        {t("result.moreMp3SourceLinks")}
                      </summary>
                      <div className="mt-4 grid gap-3">
                        {result.mp3Links.slice(1).map((item) => (
                          <div
                            key={item.url}
                            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                              {item.label}
                            </p>
                            <p className="mt-2 break-all text-sm text-emerald-50">{item.url}</p>
                            <div className="mt-3 flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => triggerDownload(item.url, result.filename, result.sourceUrl)}
                                className={primaryButtonClass}
                              >
                                {t("result.downloadThisMp3")}
                              </button>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className={secondaryButtonClass}
                              >
                                {t("result.openRawMp3")}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : null}

                  {/* <details className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-white">Raw track payload</summary>
                    <pre className="mt-4 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">
                      {JSON.stringify(result.raw, null, 2)}
                    </pre>
                  </details> */}
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-4 xl:self-start" style={deferredSectionStyle}>
            <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm sm:p-5">
              <h2 className="text-xl font-semibold text-white">{t("aside.useCasesTitle")}</h2>
              <div className="mt-4 space-y-3">
                {practicalUseCases.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm sm:p-5">
              <h2 className="text-xl font-semibold text-white">{t("aside.whyTitle")}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {whyItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm sm:p-5">
              <h2 className="text-xl font-semibold text-white">{t("aside.expectTitle")}</h2>
              <div className="mt-4 grid gap-3">
                {expectItems.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <BandcampToMp3SeoSections />
      </div>
    </main>
  )
}

export default function BandcampToMp3Page() {
  return (
    <React.Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
              <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
              <div className="mt-4 h-10 w-full max-w-3xl animate-pulse rounded bg-white/10" />
              <div className="mt-6 h-40 animate-pulse rounded-[24px] bg-white/5" />
            </div>
          </div>
        </main>
      }
    >
      <BandcampToMp3PageContent />
    </React.Suspense>
  )
}
