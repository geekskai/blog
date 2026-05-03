"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { Link, useRouter } from "@/app/i18n/navigation"
import { detectBandcampUrlType, isBandcampUrl } from "../../../../utils/bandcamp"

const lastUpdated = new Date("2026-05-03")
const deferredSectionStyle = {
  contentVisibility: "auto" as const,
  containIntrinsicSize: "auto 1000px",
}

function formatLastUpdated(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export default function BandcampDownloaderPage() {
  const t = useTranslations("BandcampToolsHub")
  const locale = useLocale()
  const router = useRouter()
  const facts = t.raw("facts") as Array<{ label: string; value: string; description: string }>
  const toolCards = t.raw("toolCards") as Array<{
    title: string
    href: string
    status: string
    description: string
  }>
  const reasons = t.raw("content.reasons") as string[]
  const faqItems = t.raw("content.faqItems") as Array<{ question: string; answer: string }>
  const [urlInput, setUrlInput] = React.useState("")
  const [routeError, setRouteError] = React.useState<string | null>(null)
  const [isPasting, setIsPasting] = React.useState(false)

  const normalizedUrl = urlInput.trim()
  const detectedKind = React.useMemo(() => {
    if (!normalizedUrl || !isBandcampUrl(normalizedUrl)) return null
    return detectBandcampUrlType(normalizedUrl)
  }, [normalizedUrl])

  const ctaLabel =
    detectedKind === "track"
      ? t("router.cta.track")
      : detectedKind === "album"
        ? t("router.cta.album")
        : t("router.cta.default")

  const ctaHint =
    detectedKind === "track"
      ? t("router.hint.track")
      : detectedKind === "album"
        ? t("router.hint.album")
        : normalizedUrl
          ? t("router.hint.invalid")
          : t("router.hint.empty")
  const ctaDisabled = !detectedKind

  const routeBandcampUrl = () => {
    if (!normalizedUrl) {
      setRouteError(t("router.errors.empty"))
      return
    }

    if (!isBandcampUrl(normalizedUrl)) {
      setRouteError(t("router.errors.invalid"))
      return
    }

    const kind = detectBandcampUrlType(normalizedUrl)

    if (kind === "track") {
      setRouteError(null)
      router.push(`/tools/bandcamp-to-mp3?url=${encodeURIComponent(normalizedUrl)}`)
      return
    }

    if (kind === "album") {
      setRouteError(null)
      router.push(`/tools/bandcamp-album-downloader?url=${encodeURIComponent(normalizedUrl)}`)
      return
    }

    setRouteError(
      t("router.errors.unsupported")
    )
  }

  const pasteFromClipboard = async () => {
    if (!navigator.clipboard?.readText) {
      setRouteError(t("router.errors.clipboardUnavailable"))
      return
    }

    try {
      setIsPasting(true)
      const clipboardText = (await navigator.clipboard.readText()).trim()
      setUrlInput(clipboardText)
      setRouteError(null)
    } catch {
      setRouteError(t("router.errors.clipboardFailed"))
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
              {/* <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                <strong className="font-semibold text-white">{t("hero.quickAnswerLabel")}</strong>{" "}
                {t("hero.quickAnswerBody")}
              </p> */}
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

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">{t("router.eyebrow")}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              {t("router.title")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              {t("router.description")}
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-3">
              <label className="text-sm font-medium text-slate-200" htmlFor="bandcamp-hub-url">
                {t("router.inputLabel")}
              </label>
              <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-3 sm:p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="bandcamp-hub-url"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                      value={urlInput}
                      onChange={(event) => setUrlInput(event.target.value)}
                      onPaste={(event) => {
                        const pastedText = event.clipboardData.getData("text").trim()
                        if (!pastedText) return

                        event.preventDefault()
                        setUrlInput(pastedText)
                        setRouteError(null)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") routeBandcampUrl()
                      }}
                      placeholder={t("router.inputPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={() => void pasteFromClipboard()}
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[120px]"
                      disabled={isPasting}
                    >
                      {isPasting ? t("actions.pasting") : t("actions.paste")}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={routeBandcampUrl}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/50"
                    disabled={ctaDisabled}
                  >
                    {ctaLabel}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: t("actions.tryTrackExample"),
                    value: "https://gmcfosho.bandcamp.com/track/happy-bursday",
                  },
                  {
                    label: t("actions.tryAlbumExample"),
                    value: "https://russelbuck.bandcamp.com/album/ravepop-remixes",
                  },
                ].map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => {
                      setUrlInput(example.value)
                      setRouteError(null)
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-100"
                  >
                    {example.label}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {t("router.detectionLabel")}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      detectedKind === "track"
                        ? "border border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
                        : detectedKind === "album"
                          ? "border border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200"
                          : "border border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    {detectedKind === "track"
                      ? t("router.detection.track")
                      : detectedKind === "album"
                        ? t("router.detection.album")
                        : t("router.detection.waiting")}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{ctaHint}</p>
              </div>

              <p className="text-xs leading-6 text-slate-400">
                {t("router.boundaryNote")}
              </p>

              <p className="text-xs leading-6 text-slate-400">
                {t("router.pasteHint")}
              </p>
            </div>
          </div>

          {routeError ? (
            <div className="mt-4 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {routeError}
            </div>
          ) : null}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">{t("toolMap.eyebrow")}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              {t("toolMap.title")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              {t("toolMap.description")}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {toolCards.map((item) => {
              const card = (
                <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5 transition hover:border-cyan-400/30 hover:bg-cyan-400/5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                  <p className="mt-4 text-sm font-medium text-cyan-200">{t("toolMap.openTool")}</p>
                </div>
              )

              return (
                <Link key={item.title} href={item.href} className="block">
                  {card}
                </Link>
              )
            })}
          </div>
        </section>

        <article
          className="space-y-6"
          style={deferredSectionStyle}
        >
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              {t("content.whyTitle")}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {reasons.map((item, index) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    {t("content.reasonLabel", { index: index + 1 })}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{t("content.faqTitle")}</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                  <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  )
}
