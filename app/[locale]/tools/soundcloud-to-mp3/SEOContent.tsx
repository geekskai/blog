"use client"

import React from "react"
import { useTranslations } from "next-intl"

// Core Facts Section Component
export function CoreFactsSection() {
  const t = useTranslations("SoundCloudToMP3")
  return (
    <section
      className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16"
      itemScope
      itemType="https://schema.org/Product"
    >
      <meta itemProp="name" content={t("metadata_title")} />
      <meta itemProp="description" content={t("metadata_description")} />
      <link
        itemProp="image"
        href="https://geekskai.com/static/images/tools/soundcloud-to-wav/soundcloud-to-wav.png"
      />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-8 md:p-10">
        <h2 className="mb-8 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl lg:leading-snug">
          {t("section_core_facts_title")}
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5 md:p-6 lg:p-7"
          >
            <meta itemProp="price" content="0" />
            <meta itemProp="priceCurrency" content="USD" />
            <link itemProp="availability" href="https://schema.org/InStock" />
            <dt className="mb-2 text-xs font-semibold leading-snug text-emerald-300 sm:mb-3 sm:text-sm md:mb-4 lg:text-base">
              {t("section_core_facts_pricing")}
            </dt>
            <dd className="text-base leading-relaxed text-white sm:text-lg lg:text-xl lg:leading-relaxed">
              {t("section_core_facts_pricing_value")}
            </dd>
          </div>

          <div
            itemProp="featureList"
            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5 md:p-6 lg:p-7"
          >
            <dt className="mb-2 text-xs font-semibold leading-snug text-purple-300 sm:mb-3 sm:text-sm md:mb-4 lg:text-base">
              {t("section_core_facts_formats")}
            </dt>
            <dd className="text-base leading-relaxed text-white sm:text-lg lg:text-xl lg:leading-relaxed">
              {t("section_core_facts_formats_value")}
            </dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5 md:p-6 lg:p-7">
            <dt className="mb-2 text-xs font-semibold leading-snug text-blue-300 sm:mb-3 sm:text-sm md:mb-4 lg:text-base">
              {t("section_core_facts_speed")}
            </dt>
            <dd className="text-base leading-relaxed text-white sm:text-lg lg:text-xl lg:leading-relaxed">
              {t("section_core_facts_speed_value")}
            </dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5 md:p-6 lg:p-7">
            <dt className="mb-2 text-xs font-semibold leading-snug text-cyan-300 sm:mb-3 sm:text-sm md:mb-4 lg:text-base">
              {t("section_core_facts_users")}
            </dt>
            <dd className="text-base leading-relaxed text-white sm:text-lg lg:text-xl lg:leading-relaxed">
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
  const t = useTranslations("SoundCloudToMP3")
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
      question: t("faq_question_5"),
      answer: t("faq_answer_5"),
    },
    {
      question: t("faq_question_6"),
      answer: t("faq_answer_6"),
    },
    {
      question: t("faq_question_7"),
      answer: t("faq_answer_7"),
    },
    {
      question: t("faq_question_8"),
      answer: t("faq_answer_8"),
    },
  ]

  return (
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-center text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_faq_title")}
      </h2>
      <div className="mx-auto max-w-6xl space-y-4 md:space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] sm:p-8"
          >
            <h3 className="mb-4 text-lg font-bold leading-snug text-white transition-colors group-hover:text-purple-300 sm:text-xl lg:text-2xl">
              {faq.question}
            </h3>
            <p className="prose prose-invert max-w-none text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg">
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
  const t = useTranslations("SoundCloudToMP3")
  return (
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_how_to_title")}
      </h2>
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-10 md:p-12">
          <div className="space-y-10 md:space-y-16">
            <div className="relative pl-12 md:pl-16">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-base font-black text-white md:h-12 md:w-12 md:text-lg">
                1
              </span>
              <h3 className="mb-4 text-xl font-extrabold leading-snug text-white sm:text-2xl">
                {t("section_how_to_step_1_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
                {t.rich("section_how_to_step_1", {
                  strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="relative pl-12 md:pl-16">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-base font-black text-white md:h-12 md:w-12 md:text-lg">
                2
              </span>
              <h3 className="mb-4 text-xl font-extrabold leading-snug text-white sm:text-2xl">
                {t("section_how_to_step_2_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
                {t.rich("section_how_to_step_2", {
                  strong: (chunks) => <strong className="text-pink-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="relative pl-12 md:pl-16">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-base font-black text-white md:h-12 md:w-12 md:text-lg">
                3
              </span>
              <h3 className="mb-4 text-xl font-extrabold leading-snug text-white sm:text-2xl">
                {t("section_how_to_step_3_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
                {t.rich("section_how_to_step_3", {
                  strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="relative pl-12 md:pl-16">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-base font-black text-white md:h-12 md:w-12 md:text-lg">
                4
              </span>
              <h3 className="mb-4 text-xl font-extrabold leading-snug text-white sm:text-2xl">
                {t("section_how_to_step_4_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
                {t.rich("section_how_to_step_4", {
                  strong: (chunks) => <strong className="text-cyan-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="relative pl-12 md:pl-16">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-base font-black text-white md:h-12 md:w-12 md:text-lg">
                5
              </span>
              <h3 className="mb-4 text-xl font-extrabold leading-snug text-white sm:text-2xl">
                {t("section_how_to_step_5_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
                {t.rich("section_how_to_step_5", {
                  strong: (chunks) => <strong className="text-emerald-300">{chunks}</strong>,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Format Comparison Section
export function FormatComparisonSection() {
  const t = useTranslations("SoundCloudToMP3")
  return (
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_format_comparison_title")}
      </h2>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md transition-all hover:bg-white/[0.08] sm:p-10">
            <h3 className="mb-6 text-2xl font-black leading-tight text-blue-400">
              {t("section_format_comparison_wav_title")}
            </h3>
            <ul className="space-y-6 text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
              <li className="flex gap-4">
                <span className="shrink-0 text-blue-500">💎</span>
                <p>
                  {t.rich("section_format_comparison_wav_1", {
                    strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                  })}
                </p>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 text-blue-500">📏</span>
                <p>
                  {t.rich("section_format_comparison_wav_2", {
                    strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                  })}
                </p>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 text-blue-500">🎚️</span>
                <p>
                  {t.rich("section_format_comparison_wav_3", {
                    strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                  })}
                </p>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 text-blue-500">🎞️</span>
                <p>
                  {t.rich("section_format_comparison_wav_4", {
                    strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                  })}
                </p>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md transition-all hover:bg-white/[0.08] sm:p-10">
            <h3 className="mb-6 text-2xl font-black leading-tight text-purple-400">
              {t("section_format_comparison_mp3_title")}
            </h3>
            <ul className="space-y-6 text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
              <li className="flex gap-4">
                <span className="shrink-0 text-purple-500">📦</span>
                <p>
                  {t.rich("section_format_comparison_mp3_1", {
                    strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                  })}
                </p>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 text-purple-500">📱</span>
                <p>
                  {t.rich("section_format_comparison_mp3_2", {
                    strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                  })}
                </p>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 text-purple-500">✉️</span>
                <p>
                  {t.rich("section_format_comparison_mp3_3", {
                    strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                  })}
                </p>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 text-purple-500">🎧</span>
                <p>
                  {t.rich("section_format_comparison_mp3_4", {
                    strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                  })}
                </p>
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
  const t = useTranslations("SoundCloudToMP3")
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
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_use_cases_title")}
      </h2>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.08] sm:p-8"
            >
              <h3 className="mb-4 text-xl font-black leading-tight text-white transition-colors group-hover:text-purple-400">
                {t(useCase.title)}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg">
                {t.rich(useCase.description, {
                  strong: (chunks) => <strong className="text-purple-300/80">{chunks}</strong>,
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Boundary Definition Section - GEO Requirement
export function BoundaryDefinitionSection() {
  const t = useTranslations("SoundCloudToMP3")
  return (
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_boundary_title")}
      </h2>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-8 shadow-2xl backdrop-blur-md sm:p-10">
            <h3 className="mb-6 text-2xl font-black leading-tight text-emerald-400">
              {t("section_boundary_can_title")}
            </h3>
            <ul className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
              {["1", "2", "3", "4", "5"].map((i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 text-emerald-500">✅</span>
                  <p>{t(`section_boundary_can_${i}`)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5 p-8 shadow-2xl backdrop-blur-md sm:p-10">
            <h3 className="mb-6 text-2xl font-black leading-tight text-red-400">
              {t("section_boundary_cannot_title")}
            </h3>
            <ul className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
              {["1", "2", "3", "4", "5"].map((i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 text-red-500">❌</span>
                  <p>{t(`section_boundary_cannot_${i}`)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Free vs Paid Comparison Section - GEO Requirement
export function FreeVsPaidSection() {
  const t = useTranslations("SoundCloudToMP3")
  return (
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_free_vs_paid_title")}
      </h2>
      <div className="mx-auto max-w-6xl">
        <p className="mb-10 text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl lg:leading-relaxed">
          {t("section_free_vs_paid_intro")}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-8 shadow-2xl backdrop-blur-md sm:p-10">
            <h3 className="mb-6 text-2xl font-black leading-tight text-emerald-400">
              {t("section_free_vs_paid_free_title")}
            </h3>
            <ul className="space-y-6 text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
              {["1", "2", "3", "4", "5"].map((i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 text-emerald-500">✨</span>
                  <p>
                    {t.rich(`section_free_vs_paid_free_${i}`, {
                      strong: (chunks) => <strong className="text-emerald-300">{chunks}</strong>,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-8 shadow-2xl backdrop-blur-md sm:p-10">
            <h3 className="mb-6 text-2xl font-black leading-tight text-purple-400">
              {t("section_free_vs_paid_paid_title")}
            </h3>
            <ul className="space-y-6 text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
              {["1", "2", "3", "4", "5"].map((i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 text-purple-500">🚀</span>
                  <p>
                    {t.rich(`section_free_vs_paid_paid_${i}`, {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 text-base italic leading-relaxed text-slate-400 sm:text-lg md:text-xl">
          {t("section_free_vs_paid_conclusion")}
        </p>
      </div>
    </section>
  )
}

// Key Features Section
export function KeyFeaturesSection() {
  const t = useTranslations("SoundCloudToMP3")
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
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_features_title")}
      </h2>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:bg-white/[0.08] sm:p-8"
            >
              <h3 className="mb-4 text-xl font-black leading-tight text-white transition-colors group-hover:text-purple-400">
                {t(feature.title)}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg">
                {t.rich(feature.description, {
                  strong: (chunks) => <strong className="text-purple-300/80">{chunks}</strong>,
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
