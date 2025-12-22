"use client"

import { formatDistanceToNow } from "date-fns"
import React from "react"
import { useTranslations } from "next-intl"

// Content Freshness Badge Component
export function ContentFreshnessBadge({ lastModified }: { lastModified: Date }) {
  const t = useTranslations("SoundCloudToWAV")
  const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24))
  const isFresh = daysSinceUpdate < 90

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm ${
        isFresh ? "text-emerald-300" : "text-orange-300"
      }`}
    >
      <span className="text-lg">{isFresh ? "✓" : "⚠"}</span>
      <span className="text-sm font-semibold">
        {isFresh
          ? `${t("content_freshness_updated")} ${formatDistanceToNow(lastModified, { addSuffix: true })}`
          : `${t("content_freshness_last_updated")} ${formatDistanceToNow(lastModified, { addSuffix: true })}`}
      </span>
    </div>
  )
}

// Core Facts Section Component
export function CoreFactsSection() {
  const t = useTranslations("SoundCloudToWAV")
  return (
    <section className="mb-12" itemScope itemType="https://schema.org/Product">
      <meta itemProp="name" content={t("metadata_title")} />
      <meta itemProp="description" content={t("metadata_description")} />
      <link itemProp="image" href="https://geekskai.com/static/images/soundcloud-to-wav.png" />
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <h2 className="mb-8 text-3xl font-bold text-white">{t("section_core_facts_title")}</h2>
        <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <meta itemProp="price" content="0" />
            <meta itemProp="priceCurrency" content="USD" />
            <link itemProp="availability" href="https://schema.org/InStock" />
            <dt className="mb-3 text-sm font-semibold text-emerald-300">
              {t("section_core_facts_pricing")}
            </dt>
            <dd className="text-lg text-white">{t("section_core_facts_pricing_value")}</dd>
          </div>

          <div
            itemProp="featureList"
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <dt className="mb-3 text-sm font-semibold text-purple-300">
              {t("section_core_facts_formats")}
            </dt>
            <dd className="text-lg text-white">{t("section_core_facts_formats_value")}</dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-3 text-sm font-semibold text-blue-300">
              {t("section_core_facts_speed")}
            </dt>
            <dd className="text-lg text-white">{t("section_core_facts_speed_value")}</dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-3 text-sm font-semibold text-cyan-300">
              {t("section_core_facts_users")}
            </dt>
            <dd className="text-lg text-white">
              {t.rich("section_core_facts_users_value", {
                musicians: (chunks) => <strong className="text-cyan-400">{chunks}</strong>,
                djs: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
                creators: (chunks) => <strong className="text-pink-400">{chunks}</strong>,
                enthusiasts: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              })}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

// FAQ Section Component
export function FAQSection() {
  const t = useTranslations("SoundCloudToWAV")
  const faqs = [
    {
      question: t("faq_question_1"),
      answer: t("faq_answer_1"),
    },
    {
      question: t("faq_question_2"),
      answer: t("faq_answer_2"),
    },
    {
      question: t("faq_question_3"),
      answer: t("faq_answer_3"),
    },
    {
      question: t("faq_question_4"),
      answer: t("faq_answer_4"),
    },
    {
      question: t("faq_question_6"),
      answer: t("faq_answer_6"),
    },
    {
      question: t("faq_question_7"),
      answer: t("faq_answer_7"),
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">{t("section_faq_title")}</h2>
      <div className="mx-auto max-w-4xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            <h3 className="mb-3 text-xl font-semibold text-white">{faq.question}</h3>
            <p className="prose prose-sm max-w-none text-slate-300 prose-strong:text-purple-300">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// How-to Guide Section
export function HowToSection() {
  const t = useTranslations("SoundCloudToWAV")
  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">{t("section_how_to_title")}</h2>
      <div className="mx-auto max-w-4xl">
        <ol className="list-inside list-decimal space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          <li className="text-lg text-slate-300">
            {t.rich("section_how_to_step_1", {
              strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
            })}
          </li>
          <li className="text-lg text-slate-300">
            {t.rich("section_how_to_step_2", {
              strong: (chunks) => <strong className="text-pink-300">{chunks}</strong>,
            })}
          </li>
          <li className="text-lg text-slate-300">
            {t.rich("section_how_to_step_3", {
              strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
            })}
          </li>
          <li className="text-lg text-slate-300">
            {t.rich("section_how_to_step_4", {
              strong: (chunks) => <strong className="text-cyan-300">{chunks}</strong>,
            })}
          </li>
          <li className="text-lg text-slate-300">
            {t.rich("section_how_to_step_5", {
              strong: (chunks) => <strong className="text-emerald-300">{chunks}</strong>,
            })}
          </li>
        </ol>
      </div>
    </section>
  )
}

// Format Comparison Section
export function FormatComparisonSection() {
  const t = useTranslations("SoundCloudToWAV")
  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">{t("section_format_comparison_title")}</h2>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 text-2xl font-bold text-white">
              {t("section_format_comparison_wav_title")}
            </h3>
            <ul className="list-inside list-disc space-y-3 text-slate-300">
              <li>
                {t.rich("section_format_comparison_wav_1", {
                  strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("section_format_comparison_wav_2", {
                  strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("section_format_comparison_wav_3", {
                  strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("section_format_comparison_wav_4", {
                  strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                })}
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 text-2xl font-bold text-white">
              {t("section_format_comparison_mp3_title")}
            </h3>
            <ul className="list-inside list-disc space-y-3 text-slate-300">
              <li>
                {t.rich("section_format_comparison_mp3_1", {
                  strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("section_format_comparison_mp3_2", {
                  strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("section_format_comparison_mp3_3", {
                  strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("section_format_comparison_mp3_4", {
                  strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                })}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Use Cases Section
export function UseCasesSection() {
  const t = useTranslations("SoundCloudToWAV")
  const useCases = [
    {
      title: "section_use_cases_1_title",
      description: "section_use_cases_1_description",
    },
    {
      title: "section_use_cases_2_title",
      description: "section_use_cases_2_description",
    },
    {
      title: "section_use_cases_3_title",
      description: "section_use_cases_3_description",
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">{t("section_use_cases_title")}</h2>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              <h3 className="mb-3 text-xl font-bold text-white">{t(useCase.title)}</h3>
              <p className="prose prose-sm max-w-none text-slate-300 prose-strong:text-purple-300">
                {t.rich(useCase.description, {
                  strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Key Features Section
export function KeyFeaturesSection() {
  const t = useTranslations("SoundCloudToWAV")
  const features = [
    {
      title: "section_features_1_title",
      description: "section_features_1_description",
    },
    {
      title: "section_features_2_title",
      description: "section_features_2_description",
    },
    {
      title: "section_features_3_title",
      description: "section_features_3_description",
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">{t("section_features_title")}</h2>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              <h3 className="mb-3 text-xl font-bold text-white">
                <strong>{t(feature.title)}</strong>
              </h3>
              <p className="prose prose-sm max-w-none text-slate-300 prose-strong:text-purple-300">
                {t.rich(feature.description, {
                  strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
