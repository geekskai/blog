import VideoDownloader from "./VideoDownloader"
import React, { Suspense } from "react"
import {
  VIDEO_FAQ_COUNT,
  VIDEO_LAST_MODIFIED,
  buildDownloaderFaqItemsWithIds,
} from "@/app/[locale]/tools/youtube-video-downloader/video-faq"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Check, Gauge, MonitorPlay, Shield, Sparkles } from "lucide-react"

const FEATURE_KEYS = [
  "feature_hd",
  "feature_safe",
  "feature_fast",
  "feature_browser",
  "feature_no_signup",
  "feature_cross_device",
  "feature_online_free",
] as const

const WHY_ITEMS = [
  { icon: MonitorPlay, titleKey: "why_hd_title" as const, bodyKey: "why_hd_body" as const },
  { icon: Shield, titleKey: "why_safe_title" as const, bodyKey: "why_safe_body" as const },
  { icon: Gauge, titleKey: "why_fast_title" as const, bodyKey: "why_fast_body" as const },
  { icon: Sparkles, titleKey: "why_compat_title" as const, bodyKey: "why_compat_body" as const },
] as const

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-shots-downloader",
    titleKey: "related_shorts_title" as const,
    descKey: "related_shorts_desc" as const,
  },
  {
    href: "/tools/youtube-audio-downloader",
    titleKey: "related_audio_title" as const,
    descKey: "related_audio_desc" as const,
  },
] as const

const HOW_TO_STEPS = ["howto_step_1", "howto_step_2", "howto_step_3"] as const

const SECTION = "mx-auto w-full max-w-7xl px-4 sm:px-6"
const SECTION_PY = "py-8 md:py-11 lg:py-14"

const TYPE = {
  badge: "text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200",
  h1: "text-[1.75rem] font-bold leading-[1.2] tracking-tight text-transparent md:text-4xl md:leading-tight lg:text-5xl",
  h2: "text-xl font-semibold leading-snug text-white md:text-2xl lg:text-[1.75rem] lg:leading-snug",
  sectionIntro: "text-sm leading-7 text-slate-300 md:text-base md:leading-7 lg:max-w-3xl",
  body: "text-sm leading-7 text-slate-300 md:text-base md:leading-7",
  bodyMuted: "text-sm leading-7 text-slate-400 md:text-base md:leading-7",
  meta: "text-xs leading-6 text-slate-500 md:text-sm md:leading-6",
  factLabel: "text-xs font-semibold uppercase tracking-[0.12em]",
  factDetail: "text-sm leading-6 text-slate-300 md:leading-7",
  stepNum:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-200 md:h-11 md:w-11 md:text-base",
  stepTitle: "text-sm font-semibold leading-snug text-slate-100 md:text-base",
  stepBody: "text-sm leading-7 text-slate-400 md:text-[15px] md:leading-7",
  faqQuestion: "text-sm font-semibold leading-snug text-slate-100 md:text-base",
  faqAnswer: "text-sm leading-7 text-slate-400 md:text-base md:leading-7",
  link: "text-sm font-medium text-cyan-300 transition hover:text-cyan-200 md:text-base",
} as const

const sectionHeaderCenter = "text-center md:text-left"
const sectionHeaderStack = "text-center"

export default function VideoMain() {
  const t = useTranslations("VideoPage")
  const faqItems = buildDownloaderFaqItemsWithIds(VIDEO_FAQ_COUNT, (key) => t(key))

  return (
    <main className="overflow-x-hidden bg-slate-950 text-slate-100">
      <section
        id="downloader"
        aria-labelledby="hero-title"
        className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      >
        <div className={`${SECTION} py-7 md:py-12 lg:py-16`}>
          <div className="flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-6">
            <header className="text-center">
              <p
                className={`inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 ${TYPE.badge}`}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden />
                <span className="truncate">{t("hero_badge")}</span>
              </p>
              <h1
                id="hero-title"
                className={`mt-3 bg-gradient-to-r from-cyan-200 via-slate-100 to-blue-300 bg-clip-text md:mt-4 lg:mt-5 ${TYPE.h1}`}
              >
                {t("hero_title")}
              </h1>
              <p className={`mx-auto mt-3 max-w-2xl md:mt-4 lg:max-w-6xl ${TYPE.sectionIntro}`}>
                {t("hero_subtitle")}
              </p>

              <aside
                className="fact-chunk mx-auto mt-4 w-full max-w-6xl rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-left md:mt-5 md:max-w-none md:p-5 lg:mx-0"
                aria-label={t("quick_answer_aria_label")}
              >
                <p className={TYPE.body}>
                  <strong className="font-semibold text-cyan-200">{t("quick_answer_label")}</strong>{" "}
                  {t("quick_answer_text")}
                </p>
                <ul className={`mt-3 space-y-2.5 md:space-y-2 ${TYPE.bodyMuted}`}>
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
                <p className={`mt-3 md:mt-4 ${TYPE.meta}`}>
                  <time dateTime={VIDEO_LAST_MODIFIED}>
                    {t("content_updated")}: {VIDEO_LAST_MODIFIED}
                  </time>
                </p>
              </aside>
            </header>

            <div className="mt-6 w-full min-w-0 md:mt-0">
              <Suspense
                fallback={
                  <div className="h-48 w-full rounded-2xl border border-white/10 bg-slate-900/45" />
                }
              >
                <VideoDownloader variant="hero" autoFocus />
              </Suspense>
            </div>
          </div>

          <p className={`mx-auto mt-6 max-w-xl text-center ${TYPE.meta}`}>
            {t("shorts_crosslink_prefix")}{" "}
            <Link href="/tools/youtube-shots-downloader" className={TYPE.link}>
              {t("shorts_crosslink_link")}
            </Link>
          </p>
        </div>
      </section>

      <section
        id="features"
        aria-labelledby="features-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} ${SECTION_PY}`}>
          <h2 id="features-title" className={`${sectionHeaderCenter} ${TYPE.h2}`}>
            {t("features_title")}
          </h2>
          <p className={`mt-2 md:mt-3 ${sectionHeaderCenter} ${TYPE.sectionIntro} lg:max-w-4xl`}>
            {t("features_intro")}
          </p>
          <ul className="mx-auto mt-5 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 md:mt-7 lg:mt-8 lg:max-w-5xl lg:grid-cols-2 lg:gap-4">
            {FEATURE_KEYS.map((key) => (
              <li
                key={key}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-3.5 md:px-5 md:py-4"
              >
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span className={TYPE.body}>{t(key)}</span>
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
          <h2 id="why-use-title" className={`${sectionHeaderCenter} ${TYPE.h2}`}>
            {t("why_title")}
          </h2>
          <p className={`mt-2 md:mt-3 ${sectionHeaderCenter} ${TYPE.sectionIntro} lg:max-w-4xl`}>
            {t("why_intro")}
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 md:mt-7 md:grid-cols-2 md:gap-4 lg:mt-8 lg:gap-5">
            {WHY_ITEMS.map(({ icon: Icon, titleKey, bodyKey }) => (
              <article
                key={titleKey}
                className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-slate-900/50 p-4 md:p-5"
              >
                <Icon className="mb-3 h-6 w-6 text-cyan-300" strokeWidth={2} aria-hidden />
                <h3 className={TYPE.stepTitle}>{t(titleKey)}</h3>
                <p className={`mt-2 ${TYPE.stepBody}`}>{t(bodyKey)}</p>
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
          <h2 id="how-to-title" className={`${sectionHeaderStack} ${TYPE.h2}`}>
            {t("how_to_title")}
          </h2>
          <p
            className={`mx-auto mt-2 max-w-xl md:mt-3 md:max-w-2xl lg:max-w-4xl ${sectionHeaderStack} ${TYPE.sectionIntro}`}
          >
            <strong className="font-semibold text-slate-100">{t("how_to_answer")}</strong>
          </p>
          <ol className="mx-auto mt-5 max-w-xl space-y-3 md:mt-7 md:max-w-2xl md:space-y-4 lg:mt-8 lg:grid lg:max-w-none lg:grid-cols-3 lg:gap-5 lg:space-y-0">
            {HOW_TO_STEPS.map((key, i) => (
              <li
                key={key}
                className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/45 p-4 md:gap-4 md:p-5 lg:flex-col lg:items-start lg:gap-4"
              >
                <span className={TYPE.stepNum}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <h3 className={TYPE.stepTitle}>{t(`${key}_title`)}</h3>
                  <p className={`mt-1.5 md:mt-2 ${TYPE.stepBody}`}>{t(`${key}_body`)}</p>
                </div>
              </li>
            ))}
          </ol>
          <p
            className={`mx-auto mt-5 max-w-xl text-center md:mt-6 md:max-w-2xl lg:max-w-4xl ${TYPE.meta}`}
          >
            <strong className="font-medium text-slate-400">{t("how_to_takeaway_label")}</strong>{" "}
            {t("how_to_takeaway")}
          </p>
        </div>
      </section>

      <section
        id="related-tools"
        aria-labelledby="related-tools-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} ${SECTION_PY}`}>
          <h2 id="related-tools-title" className={`${sectionHeaderStack} ${TYPE.h2}`}>
            {t("related_tools_title")}
          </h2>
          <p
            className={`mx-auto mt-2 max-w-xl md:mt-3 md:max-w-2xl lg:max-w-4xl ${sectionHeaderStack} ${TYPE.sectionIntro}`}
          >
            {t("related_tools_intro")}
          </p>
          <div className="mx-auto mt-5 grid max-w-xl grid-cols-1 gap-3 md:mt-7 md:max-w-3xl md:grid-cols-2 md:gap-4 lg:mt-8 lg:max-w-7xl">
            {RELATED_TOOLS.map(({ href, titleKey, descKey }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-white/10 bg-slate-900/45 p-4 transition hover:border-cyan-500/40 hover:bg-cyan-500/5 md:p-5"
              >
                <h3 className={`${TYPE.stepTitle} group-hover:text-cyan-200`}>{t(titleKey)} →</h3>
                <p className={`mt-2 ${TYPE.stepBody}`}>{t(descKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="bg-slate-950">
        <div className={`${SECTION} ${SECTION_PY}`}>
          <h2 id="faq-title" className={`${sectionHeaderStack} ${TYPE.h2}`}>
            {t("faq_title")}
          </h2>
          <p
            className={`mx-auto mt-2 max-w-xl md:mt-3 md:max-w-2xl lg:max-w-4xl ${sectionHeaderStack} ${TYPE.sectionIntro}`}
          >
            {t("faq_intro")}
          </p>
          <dl className="mx-auto mt-5 max-w-xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-900/45 md:mt-7 md:max-w-3xl lg:mt-8 lg:max-w-7xl">
            {faqItems.map((item) => (
              <div key={item.id} className="px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
                <dt className={TYPE.faqQuestion}>{item.question}</dt>
                <dd className={`mt-2 md:mt-2.5 ${TYPE.faqAnswer}`}>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  )
}
