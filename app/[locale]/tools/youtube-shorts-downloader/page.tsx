import Link from "next/link"
import React, { Suspense } from "react"
import { useTranslations } from "next-intl"

import { Check, Gauge, Shield, Sparkles, Smartphone } from "lucide-react"
import ShortsDownloader from "./ShortsDownloader"
import { SHOTS_FAQ_COUNT, SHOTS_LAST_MODIFIED, buildDownloaderFaqItemsWithIds } from "./shots-faq"

const FEATURE_KEYS = [
  "feature_hd",
  "feature_no_watermark",
  "feature_fast",
  "feature_mobile",
  "feature_no_signup",
  "feature_compat",
  "feature_browser",
] as const

const WHY_ITEMS = [
  {
    icon: Gauge,
    titleKey: "why_speed_title",
    bodyKey: "why_speed_body",
  },
  {
    icon: Sparkles,
    titleKey: "why_simple_title",
    bodyKey: "why_simple_body",
  },
  {
    icon: Shield,
    titleKey: "why_safe_title",
    bodyKey: "why_safe_body",
  },
  {
    icon: Smartphone,
    titleKey: "why_compat_title",
    bodyKey: "why_compat_body",
  },
] as const

const HOW_TO_STEPS = [
  {
    titleKey: "howto_step_1_title",
    bodyKey: "howto_step_1_body",
  },
  {
    titleKey: "howto_step_2_title",
    bodyKey: "howto_step_2_body",
  },
  {
    titleKey: "howto_step_3_title",
    bodyKey: "howto_step_3_body",
  },
] as const

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-video-downloader",
    titleKey: "related_video_title",
    descKey: "related_video_desc",
  },
  {
    href: "/tools/youtube-audio-downloader",
    titleKey: "related_audio_title",
    descKey: "related_audio_desc",
  },
] as const

const SECTION = "mx-auto w-full max-w-7xl px-4 sm:px-6"
const SECTION_PY = "py-8 md:py-11 lg:py-14"

function SectionHeader({
  id,
  title,
  intro,
}: {
  id: string
  title: string
  intro?: string
}) {
  return (
    <>
      <h2 id={id} className="text-center text-xl font-semibold leading-snug text-white md:text-2xl">
        {title}
      </h2>
      {intro ? (
        <p className="mx-auto mt-2 max-w-4xl text-center text-sm leading-7 text-slate-300 md:mt-3 md:text-base">
          {intro}
        </p>
      ) : null}
    </>
  )
}

export default function YouTubeShortsDownloaderPage() {
  const t = useTranslations("ShortsPage")
  const faqItems = buildDownloaderFaqItemsWithIds(SHOTS_FAQ_COUNT, (key) => t(key))

  return (
    <main className="overflow-x-hidden bg-slate-950 text-slate-100">
      <section
        id="downloader"
        aria-labelledby="hero-title"
        className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      >
        <div className={`${SECTION} py-7 md:py-8`}>
          <header className="text-center">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-200 md:px-3.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
              {t("hero_badge")}
            </p>
            <h1
              id="hero-title"
              className="mt-3 bg-gradient-to-r from-primary-200 via-slate-100 to-primary-300 bg-clip-text text-2xl font-bold leading-[1.2] tracking-tight text-transparent md:mt-4 md:text-3xl lg:mt-5 lg:text-4xl"
            >
              {t("hero_title")}
            </h1>
            <p className="mx-auto mt-3 max-w-6xl text-sm leading-7 text-slate-300 md:mt-4 md:text-base">
              {t("hero_subtitle")}
            </p>
            <section
              className="fact-chunk mx-auto mt-4 w-full max-w-lg rounded-2xl border border-primary-500/20 bg-primary-500/5 p-4 text-left md:mt-5 md:max-w-none md:p-5"
              aria-label={t("quick_answer_aria_label")}
            >
              <p className="text-sm leading-7 text-slate-300 md:text-base">
                <strong className="font-semibold text-primary-200">
                  {t("quick_answer_label")}
                </strong>{" "}
                {t("quick_answer_text")}
              </p>
              <ul className="mt-3 space-y-2.5 text-sm leading-7 text-slate-400 md:space-y-2 md:text-base">
                <li>
                  <strong className="font-semibold text-slate-200">
                    {t("quick_answer_best_for_label")}
                  </strong>{" "}
                  {t("quick_answer_best_for")}
                </li>
                <li>
                  <strong className="font-semibold text-slate-200">
                    {t("quick_answer_cost_label")}
                  </strong>{" "}
                  {t("quick_answer_cost")}
                </li>
                <li>
                  <strong className="font-semibold text-slate-200">
                    {t("quick_answer_benefit_label")}
                  </strong>{" "}
                  {t("quick_answer_benefit")}
                </li>
              </ul>
              <p className="mt-3 text-xs leading-6 text-slate-500 md:mt-4 md:text-sm md:leading-6">
                <time dateTime={`${SHOTS_LAST_MODIFIED}T12:00:00.000Z`}>
                  {t("content_updated")}: {SHOTS_LAST_MODIFIED}
                </time>
              </p>
            </section>
          </header>

          <div className="mt-4 w-full min-w-0 md:mt-5">
            <Suspense
              fallback={
                <div className="h-48 w-full rounded-2xl border border-white/10 bg-slate-900/45" />
              }
            >
              <ShortsDownloader variant="hero" autoFocus />
            </Suspense>
          </div>
        </div>
      </section>

      <section
        id="features"
        aria-labelledby="features-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} ${SECTION_PY}`}>
          <SectionHeader
            id="features-title"
            title={t("features_title")}
            intro={t("features_intro")}
          />
          <ul className="mx-auto mt-5 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 md:mt-7 lg:mt-8 lg:gap-4">
            {FEATURE_KEYS.map((key) => (
              <li
                key={key}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-3.5 md:px-5 md:py-4"
              >
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary-300"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span className="text-sm leading-7 text-slate-300 md:text-base">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="why-use"
        aria-labelledby="why-use-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} ${SECTION_PY}`}>
          <SectionHeader id="why-use-title" title={t("why_title")} intro={t("why_intro")} />
          <div className="mt-5 grid grid-cols-1 gap-3 md:mt-7 md:grid-cols-2 md:gap-4 lg:mt-8 lg:gap-5">
            {WHY_ITEMS.map(({ icon: Icon, titleKey, bodyKey }) => (
              <article
                key={titleKey}
                className="rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 to-slate-900/50 p-4 md:p-5"
              >
                <Icon className="mb-3 h-6 w-6 text-primary-300" strokeWidth={2} aria-hidden />
                <h3 className="text-sm font-semibold leading-snug text-slate-100 md:text-base">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-400 md:text-[15px] md:leading-7">
                  {t(bodyKey)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-to"
        aria-labelledby="how-to-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} ${SECTION_PY}`}>
          <SectionHeader id="how-to-title" title={t("how_to_title")} />
          <ol className="mx-auto mt-5 max-w-xl space-y-3 md:mt-7 md:max-w-2xl md:space-y-4 lg:mt-8 lg:grid lg:max-w-none lg:grid-cols-3 lg:gap-5 lg:space-y-0">
            {HOW_TO_STEPS.map((step, i) => (
              <li
                key={step.titleKey}
                className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/45 p-4 md:gap-4 md:p-5 lg:flex-col lg:items-start lg:gap-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-sm font-bold text-primary-200 md:h-11 md:w-11 md:text-base">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold leading-snug text-slate-100 md:text-base">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-slate-400 md:mt-2 md:text-[15px] md:leading-7">
                    {t(step.bodyKey)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="related-tools"
        aria-labelledby="related-tools-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} ${SECTION_PY}`}>
          <SectionHeader
            id="related-tools-title"
            title={t("related_tools_title")}
            intro={t("related_tools_intro")}
          />
          <div className="mx-auto mt-5 grid max-w-xl grid-cols-1 gap-3 md:mt-7 md:max-w-3xl md:grid-cols-2 md:gap-4 lg:mt-8 lg:max-w-7xl">
            {RELATED_TOOLS.map(({ href, titleKey, descKey }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-white/10 bg-slate-900/45 p-4 transition hover:border-primary-500/40 hover:bg-primary-500/5 md:p-5"
              >
                <h3 className="text-sm font-semibold leading-snug text-slate-100 group-hover:text-primary-200 md:text-base">
                  {t(titleKey)} →
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-400 md:text-[15px] md:leading-7">
                  {t(descKey)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        aria-labelledby="faq-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} ${SECTION_PY}`}>
          <SectionHeader id="faq-title" title={t("faq_title")} intro={t("faq_intro")} />
          <dl className="mx-auto mt-5 max-w-xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-900/45 md:mt-7 md:max-w-3xl lg:mt-8 lg:max-w-7xl">
            {faqItems.map((item) => (
              <div key={item.id} className="px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
                <dt className="text-sm font-semibold leading-snug text-slate-100 md:text-base">
                  {item.question}
                </dt>
                <dd className="mt-2 text-sm leading-7 text-slate-400 md:mt-2.5 md:text-base md:leading-7">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="official-resource"
        aria-labelledby="official-resource-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} py-7 md:py-10`}>
          <div className="mx-auto max-w-7xl rounded-2xl border border-primary-500/20 bg-primary-500/5 p-4 text-center md:p-6">
            <h2
              id="official-resource-title"
              className="text-lg font-semibold text-slate-100 md:text-xl"
            >
              {t("official_resource_title")}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-300 md:text-base">
              {t("official_resource_body_before")}{" "}
              <a
                href="https://youtubeshortdownloader.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-300 underline decoration-primary-400/60 underline-offset-2 hover:text-primary-200"
              >
                {t("official_resource_link_label")}
              </a>
              {t("official_resource_body_after")}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
