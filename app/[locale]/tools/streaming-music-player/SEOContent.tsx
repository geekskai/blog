"use client"

import React from "react"
import { useTranslations } from "next-intl"

export function TLDRSection() {
  const t = useTranslations("HLSMusicPlayer")
  return (
    <section
      id="overview"
      className="mb-12 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 backdrop-blur-sm md:p-10"
    >
      <h2 className="mb-4 text-center text-xl font-bold text-white md:text-2xl">
        {t("section_tldr_title")}
      </h2>
      <p className="text-base leading-relaxed text-slate-300 md:text-lg">
        {t.rich("section_tldr_content", {
          strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
        })}
      </p>
    </section>
  )
}

export function IntroSection() {
  const t = useTranslations("HLSMusicPlayer")
  return (
    <section id="what-is-hls" className="mb-12">
      <h2 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
        {t("section_intro_title")}
      </h2>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-slate-300">
          {t.rich("section_intro_content", {
            strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
          })}
        </p>
      </div>
    </section>
  )
}

export function WhyUseSection() {
  const t = useTranslations("HLSMusicPlayer")
  const reasons = [
    { title: t("section_why_1_title"), desc: t("section_why_1_description"), icon: "🔒" },
    { title: t("section_why_2_title"), desc: t("section_why_2_description"), icon: "🚫" },
    { title: t("section_why_3_title"), desc: t("section_why_3_description"), icon: "🛠️" },
  ]
  return (
    <section id="why-use" className="mb-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
        {t("section_why_title")}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-purple-500/30"
          >
            <div className="mb-4 text-4xl">{r.icon}</div>
            <h3 className="mb-3 text-xl font-bold text-white">{r.title}</h3>
            <p className="text-slate-400">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ComparisonSection() {
  const t = useTranslations("HLSMusicPlayer")
  return (
    <section id="comparison" className="mb-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
        {t("section_comparison_title")}
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="mb-4 text-xl font-bold text-slate-300">
            {t("section_comparison_native_title")}
          </h3>
          <p className="text-slate-400">
            {t.rich("section_comparison_native_desc", {
              code: (chunks) => <code className="text-blue-300">{chunks}</code>,
            })}
          </p>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-8 shadow-lg shadow-purple-500/5">
          <h3 className="mb-4 text-xl font-bold text-purple-300">
            {t("section_comparison_hlsjs_title")}
          </h3>
          <p className="text-slate-300">
            {t.rich("section_comparison_hlsjs_desc", {
              strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
            })}
          </p>
        </div>
      </div>
    </section>
  )
}

export function AdvancedTechSection() {
  const t = useTranslations("HLSMusicPlayer")
  return (
    <section id="advanced-tech" className="mb-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
        {t("section_advanced_title")}
      </h2>
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="mb-3 text-xl font-bold text-white">{t("section_advanced_abr_title")}</h3>
          <p className="leading-relaxed text-slate-300">{t("section_advanced_abr_desc")}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="mb-3 text-xl font-bold text-white">
            {t("section_advanced_latency_title")}
          </h3>
          <p className="leading-relaxed text-slate-300">{t("section_advanced_latency_desc")}</p>
        </div>
      </div>
    </section>
  )
}

export function PrivacySection() {
  const t = useTranslations("HLSMusicPlayer")
  return (
    <section
      id="privacy-policy"
      className="mb-12 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 md:p-12"
    >
      <div className="mb-6 flex items-center gap-4">
        <span className="text-4xl text-emerald-500">🛡️</span>
        <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
          {t("section_privacy_full_title")}
        </h2>
      </div>
      <p className="text-lg leading-relaxed text-slate-300">
        {t.rich("section_privacy_full_content", {
          strong: (chunks) => <strong className="text-green-300">{chunks}</strong>,
        })}
      </p>
    </section>
  )
}

export function CoreFactsSection() {
  const t = useTranslations("HLSMusicPlayer")
  return (
    <section id="core-facts" className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
        <h2 className="mb-5 text-center text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
          {t("section_core_facts_title")}
        </h2>
        <dl className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5 md:p-6 lg:p-7">
            <dt className="mb-2 text-xs font-semibold leading-snug text-emerald-300 sm:mb-3 sm:text-sm md:mb-4 lg:text-base">
              {t("section_core_facts_pricing")}
            </dt>
            <dd className="text-base leading-relaxed text-white sm:text-lg lg:text-xl lg:leading-relaxed">
              {t("section_core_facts_pricing_value")}
            </dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5 md:p-6 lg:p-7">
            <dt className="mb-2 text-xs font-semibold leading-snug text-purple-300 sm:mb-3 sm:text-sm md:mb-4 lg:text-base">
              {t("section_core_facts_support")}
            </dt>
            <dd className="text-base leading-relaxed text-white sm:text-lg lg:text-xl lg:leading-relaxed">
              {t("section_core_facts_support_value")}
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
              {t("section_core_facts_privacy")}
            </dt>
            <dd className="text-base leading-relaxed text-white sm:text-lg lg:text-xl lg:leading-relaxed">
              {t("section_core_facts_privacy_value")}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export function TechnicalSpecsSection() {
  const t = useTranslations("HLSMusicPlayer")
  const specs = [
    { title: t("spec_library_title"), value: t("spec_library_value") },
    { title: t("spec_version_title"), value: t("spec_version_value") },
    { title: t("spec_latency_title"), value: t("spec_latency_value") },
  ]
  return (
    <section id="technical-specs" className="mb-12">
      <h2 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
        {t("section_specs_title")}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-left">
          <tbody className="divide-y divide-white/10">
            {specs.map((spec, i) => (
              <tr key={i} className="transition-colors hover:bg-white/5">
                <td className="px-6 py-4 text-sm font-semibold text-slate-400">{spec.title}</td>
                <td className="px-6 py-4 text-sm text-white">
                  <strong className="text-blue-300">{spec.value}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function UseCaseSection() {
  const t = useTranslations("HLSMusicPlayer")
  const cases = [
    { title: t("section_use_cases_1_title"), desc: t("section_use_cases_1_description") },
    { title: t("section_use_cases_2_title"), desc: t("section_use_cases_2_description") },
    { title: t("section_use_cases_3_title"), desc: t("section_use_cases_3_description") },
  ]
  return (
    <section id="use-cases" className="mb-12">
      <h2 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
        {t("section_use_cases_title")}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {cases.map((c, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-lg font-bold text-purple-300">{c.title}</h3>
            <p className="text-sm text-slate-300">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function BoundarySection() {
  const t = useTranslations("HLSMusicPlayer")
  return (
    <section id="capabilities" className="mb-12">
      <h2 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
        {t("section_boundaries_title")}
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8">
          <h3 className="mb-4 text-xl font-bold text-emerald-300">
            {t("section_boundaries_can_do_title")}
          </h3>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <span className="mt-1 text-emerald-500">✓</span>
                <span>{t(`section_boundaries_can_do_${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
          <h3 className="mb-4 text-xl font-bold text-red-300">
            {t("section_boundaries_cannot_do_title")}
          </h3>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <span className="mt-1 text-red-500">✕</span>
                <span>{t(`section_boundaries_cannot_do_${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const t = useTranslations("HLSMusicPlayer")
  const faqs = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    question: t(`faq_question_${i}`),
    answer: t(`faq_answer_${i}`),
  }))

  return (
    <section id="faq" className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-center text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl md:mb-10 lg:text-4xl lg:leading-snug">
        {t("section_faq_title")}
      </h2>
      <div className="mx-auto max-w-6xl space-y-4 md:space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-6 lg:p-8"
          >
            <h3 className="mb-2 text-lg font-semibold text-white sm:text-xl">{faq.question}</h3>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HowToSection() {
  const t = useTranslations("HLSMusicPlayer")
  const steps = [
    { title: t("section_how_to_step_1_title"), desc: t("section_how_to_step_1") },
    { title: t("section_how_to_step_2_title"), desc: t("section_how_to_step_2") },
    { title: t("section_how_to_step_3_title"), desc: t("section_how_to_step_3") },
  ]

  return (
    <section id="how-to-use" className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-center text-2xl font-bold text-white sm:text-3xl md:text-4xl">
        {t("section_how_to_title")}
      </h2>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10">
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div key={idx}>
              <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">{step.title}</h3>
              <p className="text-base text-slate-300 sm:text-lg">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function KeyFeaturesSection() {
  const t = useTranslations("HLSMusicPlayer")
  const features = [
    { title: t("section_features_1_title"), desc: t("section_features_1_description") },
    { title: t("section_features_2_title"), desc: t("section_features_2_description") },
    { title: t("section_features_3_title"), desc: t("section_features_3_description") },
  ]

  return (
    <section id="features" className="mb-8 px-4 sm:mb-10 sm:px-0 md:mb-12 lg:mb-16">
      <h2 className="mb-5 text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
        {t("section_features_title")}
      </h2>
      <div className="grid gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10"
          >
            <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">{feature.title}</h3>
            <p className="text-sm text-slate-300 sm:text-base">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
