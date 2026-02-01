"use client"

import React from "react"
import { useTranslations } from "next-intl"

// Core Facts Section Component
export function CoreFactsSection() {
  const t = useTranslations("SoundCloudToWAV")
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
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
        <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
          {t("section_core_facts_title")}
        </h2>
        <dl className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
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
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-center text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_faq_title")}
      </h2>
      <div className="mx-auto max-w-6xl space-y-3 sm:space-y-4 md:space-y-5 lg:max-w-5xl lg:space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-5 md:p-6 lg:p-8"
          >
            <h3 className="mb-2 text-lg font-semibold leading-snug text-white sm:mb-3 sm:text-xl md:mb-4 lg:text-xl lg:leading-snug">
              {faq.question}
            </h3>
            <p className="prose prose-sm max-w-none text-sm leading-relaxed text-slate-300 lg:prose-base prose-strong:text-purple-300 sm:text-base md:text-base lg:leading-relaxed">
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
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_how_to_title")}
      </h2>
      <div className="mx-auto max-w-6xl md:px-0 lg:max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
          <div className="space-y-6 sm:space-y-7 md:space-y-8 lg:space-y-10">
            <div>
              <h3 className="mb-2 text-lg font-bold leading-snug text-white sm:mb-4 sm:text-xl md:mb-4 lg:text-xl">
                {t("section_how_to_step_1_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg lg:text-lg lg:leading-relaxed">
                {t.rich("section_how_to_step_1", {
                  strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold leading-snug text-white sm:mb-4 sm:text-xl md:mb-4 lg:text-xl">
                {t("section_how_to_step_2_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg lg:text-lg lg:leading-relaxed">
                {t.rich("section_how_to_step_2", {
                  strong: (chunks) => <strong className="text-pink-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold leading-snug text-white sm:mb-4 sm:text-xl md:mb-4 lg:text-xl">
                {t("section_how_to_step_3_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg lg:text-lg lg:leading-relaxed">
                {t.rich("section_how_to_step_3", {
                  strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold leading-snug text-white sm:mb-4 sm:text-xl md:mb-4 lg:text-xl">
                {t("section_how_to_step_4_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg lg:text-lg lg:leading-relaxed">
                {t.rich("section_how_to_step_4", {
                  strong: (chunks) => <strong className="text-cyan-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold leading-snug text-white sm:mb-4 sm:text-xl md:mb-4 lg:text-xl">
                {t("section_how_to_step_5_title")}
              </h3>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg lg:text-lg lg:leading-relaxed">
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
  const t = useTranslations("SoundCloudToWAV")
  return (
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_format_comparison_title")}
      </h2>
      <div className="mx-auto max-w-6xl lg:max-w-6xl">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
            <h3 className="mb-3 text-xl font-bold leading-snug text-white sm:mb-6 sm:text-2xl lg:mb-6 lg:text-2xl">
              {t("section_format_comparison_wav_title")}
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-300 sm:space-y-3 sm:text-base lg:space-y-4 lg:text-base lg:leading-relaxed">
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
            <h3 className="mb-3 text-xl font-bold leading-snug text-white sm:mb-6 sm:text-2xl lg:mb-6 lg:text-2xl">
              {t("section_format_comparison_mp3_title")}
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-300 sm:space-y-3 sm:text-base lg:space-y-4 lg:text-base lg:leading-relaxed">
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
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_use_cases_title")}
      </h2>
      <div className="mx-auto max-w-6xl lg:max-w-6xl">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8"
            >
              <h3 className="mb-2 text-lg font-bold leading-snug text-white sm:mb-3 sm:text-xl lg:mb-4 lg:text-xl">
                {t(useCase.title)}
              </h3>
              <p className="prose prose-sm max-w-none text-sm leading-relaxed text-slate-300 lg:prose-base prose-strong:text-purple-300 sm:text-base lg:leading-relaxed">
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
    <section className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_features_title")}
      </h2>
      <div className="mx-auto max-w-6xl lg:max-w-6xl">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8"
            >
              <h3 className="mb-2 text-lg font-bold leading-snug text-white sm:mb-3 sm:text-xl lg:mb-4 lg:text-xl">
                <strong>{t(feature.title)}</strong>
              </h3>
              <p className="prose prose-sm max-w-none text-sm leading-relaxed text-slate-300 lg:prose-base prose-strong:text-purple-300 sm:text-base lg:leading-relaxed">
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
