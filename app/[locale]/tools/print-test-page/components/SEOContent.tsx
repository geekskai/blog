"use client"

import { formatDistanceToNow } from "date-fns"
import React from "react"
import { useTranslations } from "next-intl"

// Content Freshness Badge Component
export function ContentFreshnessBadge({ lastModified }: { lastModified: Date }) {
  const t = useTranslations("PrintTestPage")
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
  const t = useTranslations("PrintTestPage")
  return (
    <section className="mb-12" itemScope itemType="https://schema.org/Product">
      <meta itemProp="name" content={t("metadata_title")} />
      <meta itemProp="description" content={t("metadata_description")} />
      <link itemProp="image" href="https://geekskai.com/static/images/print-test-page.png" />
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <h2 className="mb-8 text-3xl font-bold text-white">{t("section_core_facts_title")}</h2>
        <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <dt className="mb-3 text-sm font-semibold text-emerald-300">
              {t("section_core_facts_pricing")}
            </dt>
            <dd className="text-lg text-white">{t("section_core_facts_pricing_value")}</dd>
            <meta itemProp="price" content="0" />
            <meta itemProp="priceCurrency" content="USD" />
            <link itemProp="availability" href="https://schema.org/InStock" />
          </div>

          <div
            itemProp="featureList"
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <dt className="mb-3 text-sm font-semibold text-purple-300">
              {t("section_core_facts_test_types")}
            </dt>
            <dd className="text-lg text-white">{t("section_core_facts_test_types_value")}</dd>
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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-2">
          <span className="text-xl">✨</span>
          <span className="font-semibold text-purple-300">{t("features_badge")}</span>
        </div>
        <h2 className="text-3xl font-bold text-white">{t("features_title")}</h2>
        <p className="mt-4 text-slate-300">{t("features_description")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 transition-all duration-300 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <div className="mb-4 text-4xl">{feature.icon}</div>
            <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-slate-300">{feature.description}</p>
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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-6 py-2">
          <span className="text-xl">📖</span>
          <span className="font-semibold text-blue-300">{t("how_to_badge")}</span>
        </div>
        <h2 className="text-3xl font-bold text-white">{t("how_to_title")}</h2>
        <p className="mt-4 text-slate-300">{t("how_to_description")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 transition-all duration-300 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-bold text-white">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
            </div>
            <p className="text-slate-300">{step.description}</p>
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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-2">
          <span className="text-xl">🎯</span>
          <span className="font-semibold text-emerald-300">{t("use_cases_badge")}</span>
        </div>
        <h2 className="text-3xl font-bold text-white">{t("use_cases_title")}</h2>
        <p className="mt-4 text-slate-300">{t("use_cases_description")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {useCases.map((useCase, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-6 transition-all duration-300 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="text-4xl">{useCase.icon}</div>
              <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
            </div>
            <p className="text-slate-300">{useCase.description}</p>
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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-2">
          <span className="text-xl">❓</span>
          <span className="font-semibold text-orange-300">{t("faq_badge")}</span>
        </div>
        <h2 className="text-3xl font-bold text-white">{t("faq_title")}</h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-orange-400/30 hover:shadow-lg hover:shadow-orange-500/25"
            itemScope
            itemType="https://schema.org/Question"
          >
            <h3 className="mb-3 text-lg font-bold text-white" itemProp="name">
              {faq.question}
            </h3>
            <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
              <p className="text-slate-300" itemProp="text">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
