"use client"

import { useTranslations } from "next-intl"
import React from "react"

// Core Facts Section Component
export function CoreFactsSection() {
  const t = useTranslations("PrintTestPage")
  return (
    <section className="mb-6 md:mb-8 lg:mb-12" itemScope itemType="https://schema.org/Product">
      <meta itemProp="name" content={t("metadata_title")} />
      <meta itemProp="description" content={t("metadata_description")} />
      <link itemProp="image" href="https://geekskai.com/static/images/print-test-page.png" />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md md:rounded-3xl md:p-5 lg:p-6">
        <h2 className="mb-4 text-lg font-bold leading-tight text-white md:mb-6 md:text-2xl lg:mb-8 lg:text-3xl">
          {t("section_core_facts_title")}
        </h2>
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-5 lg:p-6"
          >
            <dt className="mb-1.5 text-xs font-semibold leading-tight text-emerald-300 md:mb-2 md:text-sm">
              {t("section_core_facts_pricing")}
            </dt>
            <dd className="text-sm leading-relaxed text-white md:text-base lg:text-lg">
              {t("section_core_facts_pricing_value")}
            </dd>
            <meta itemProp="price" content="0" />
            <meta itemProp="priceCurrency" content="USD" />
            <link itemProp="availability" href="https://schema.org/InStock" />
          </div>

          <div
            itemProp="featureList"
            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-5 lg:p-6"
          >
            <dt className="mb-1.5 text-xs font-semibold leading-tight text-purple-300 md:mb-2 md:text-sm">
              {t("section_core_facts_test_types")}
            </dt>
            <dd className="text-sm leading-relaxed text-white md:text-base lg:text-lg">
              {t("section_core_facts_test_types_value")}
            </dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-5 lg:p-6">
            <dt className="mb-1.5 text-xs font-semibold leading-tight text-blue-300 md:mb-2 md:text-sm">
              {t("section_core_facts_speed")}
            </dt>
            <dd className="text-sm leading-relaxed text-white md:text-base lg:text-lg">{t("section_core_facts_speed_value")}</dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-5 lg:p-6">
            <dt className="mb-1.5 text-xs font-semibold leading-tight text-cyan-300 md:mb-2 md:text-sm">
              {t("section_core_facts_users")}
            </dt>
            <dd className="text-sm leading-relaxed text-white md:text-base lg:text-lg">
              {t.rich("section_core_facts_users_value", {
                home_users: (chunks) => <strong className="text-cyan-400">{chunks}</strong>,
                office_workers: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
                students: (chunks) => <strong className="text-pink-400">{chunks}</strong>,
                technicians: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              })}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

// Features Section Component
export function FeaturesSection() {
  const t = useTranslations("PrintTestPage")
  const features = [
    {
      icon: "🎨",
      title: t("features_color_test_title"),
      description: t("features_color_test_description"),
    },
    {
      icon: "⚫",
      title: t("features_bw_test_title"),
      description: t("features_bw_test_description"),
    },
    {
      icon: "🌈",
      title: t("features_cmyk_test_title"),
      description: t("features_cmyk_test_description"),
    },
    {
      icon: "⚡",
      title: t("features_instant_title"),
      description: t("features_instant_description"),
    },
    {
      icon: "🌍",
      title: t("features_universal_title"),
      description: t("features_universal_description"),
    },
    {
      icon: "🔒",
      title: t("features_free_title"),
      description: t("features_free_description"),
    },
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md md:rounded-3xl md:p-5 lg:p-6">
      <div className="mb-4 text-center md:mb-6 lg:mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-3 py-1.5 md:mb-4 md:gap-2 md:px-5 md:py-2 lg:px-6">
          <span className="text-base md:text-lg lg:text-xl">✨</span>
          <span className="text-xs font-semibold leading-tight text-purple-300 md:text-sm">
            {t("features_badge")}
          </span>
        </div>
        <h2 className="text-lg font-bold leading-tight text-white md:text-2xl lg:text-3xl">{t("features_title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300 md:mt-3 md:text-base lg:mt-4">
          {t("features_description")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4 transition-all duration-300 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/25 md:rounded-2xl md:p-5 lg:p-6"
          >
            <div className="mb-2.5 text-2xl md:mb-3 md:text-3xl lg:mb-4 lg:text-4xl">{feature.icon}</div>
            <h3 className="mb-1.5 text-sm font-bold leading-snug text-white md:text-base lg:mb-2 lg:text-xl">
              {feature.title}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300 md:text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// How-to Guide Section Component
export function HowToSection() {
  const t = useTranslations("PrintTestPage")
  const steps = [
    {
      number: "1",
      title: t("how_to_step_1_title"),
      description: t("how_to_step_1_description"),
    },
    {
      number: "2",
      title: t("how_to_step_2_title"),
      description: t("how_to_step_2_description"),
    },
    {
      number: "3",
      title: t("how_to_step_3_title"),
      description: t("how_to_step_3_description"),
    },
    {
      number: "4",
      title: t("how_to_step_4_title"),
      description: t("how_to_step_4_description"),
    },
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md md:rounded-3xl md:p-5 lg:p-6">
      <div className="mb-4 text-center md:mb-6 lg:mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-3 py-1.5 md:mb-4 md:gap-2 md:px-5 md:py-2 lg:px-6">
          <span className="text-base md:text-lg lg:text-xl">📖</span>
          <span className="text-xs font-semibold leading-tight text-blue-300 md:text-sm">
            {t("how_to_badge")}
          </span>
        </div>
        <h2 className="text-lg font-bold leading-tight text-white md:text-2xl lg:text-3xl">{t("how_to_title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300 md:mt-3 md:text-base lg:mt-4">
          {t("how_to_description")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 transition-all duration-300 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/25 md:rounded-2xl md:p-5 lg:p-6"
          >
            <div className="mb-2.5 flex items-center gap-3 md:mb-3 md:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-bold text-white md:h-10 md:w-10 md:text-base lg:h-12 lg:w-12 lg:text-xl">
                {step.number}
              </div>
              <h3 className="text-sm font-bold leading-snug text-white md:text-base lg:text-xl">{step.title}</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 md:text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Use Cases Section Component
export function UseCasesSection() {
  const t = useTranslations("PrintTestPage")
  const useCases = [
    {
      icon: "🏠",
      title: t("use_cases_home_title"),
      description: t("use_cases_home_description"),
    },
    {
      icon: "🏢",
      title: t("use_cases_office_title"),
      description: t("use_cases_office_description"),
    },
    {
      icon: "🎓",
      title: t("use_cases_students_title"),
      description: t("use_cases_students_description"),
    },
    {
      icon: "🔧",
      title: t("use_cases_technicians_title"),
      description: t("use_cases_technicians_description"),
    },
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md md:rounded-3xl md:p-5 lg:p-6">
      <div className="mb-4 text-center md:mb-6 lg:mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-3 py-1.5 md:mb-4 md:gap-2 md:px-5 md:py-2 lg:px-6">
          <span className="text-base md:text-lg lg:text-xl">🎯</span>
          <span className="text-xs font-semibold leading-tight text-emerald-300 md:text-sm">
            {t("use_cases_badge")}
          </span>
        </div>
        <h2 className="text-lg font-bold leading-tight text-white md:text-2xl lg:text-3xl">{t("use_cases_title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300 md:mt-3 md:text-base lg:mt-4">
          {t("use_cases_description")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
        {useCases.map((useCase, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-4 transition-all duration-300 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-500/25 md:rounded-2xl md:p-5 lg:p-6"
          >
            <div className="mb-2.5 flex items-center gap-3 md:mb-3 md:gap-4">
              <div className="text-2xl md:text-3xl lg:text-4xl">{useCase.icon}</div>
              <h3 className="text-sm font-bold leading-snug text-white md:text-base lg:text-xl">{useCase.title}</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 md:text-sm">{useCase.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// FAQ Section Component
export function FAQSection() {
  const t = useTranslations("PrintTestPage")
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
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md md:rounded-3xl md:p-5 lg:p-6">
      <div className="mb-4 text-center md:mb-6 lg:mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-3 py-1.5 md:mb-4 md:gap-2 md:px-5 md:py-2 lg:px-6">
          <span className="text-base md:text-lg lg:text-xl">❓</span>
          <span className="text-xs font-semibold leading-tight text-orange-300 md:text-sm">{t("faq_badge")}</span>
        </div>
        <h2 className="text-lg font-bold leading-tight text-white md:text-2xl lg:text-3xl">{t("faq_title")}</h2>
      </div>
      <div className="space-y-3 md:space-y-4 lg:space-y-5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-orange-400/30 hover:shadow-lg hover:shadow-orange-500/25 md:p-5 lg:p-6"
            itemScope
            itemType="https://schema.org/Question"
          >
            <h3 className="mb-1.5 text-sm font-bold leading-snug text-white md:mb-2 md:text-base lg:mb-3 lg:text-lg" itemProp="name">
              {faq.question}
            </h3>
            <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
              <p className="text-xs leading-relaxed text-slate-300 md:text-sm" itemProp="text">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
