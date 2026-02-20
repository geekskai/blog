import React from "react"
import { useTranslations } from "next-intl"

export function CoreFactsSection() {
  const t = useTranslations("SoundCloudDownloader")
  const facts = [
    { label: t("core_facts_label_1"), value: t("core_facts_value_1") },
    { label: t("core_facts_label_2"), value: t("core_facts_value_2") },
    { label: t("core_facts_label_3"), value: t("core_facts_value_3") },
    { label: t("core_facts_label_4"), value: t("core_facts_value_4") },
  ]

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
      <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
        {t("section_core_facts_title")}
      </h2>
      <dl className="grid gap-4 md:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 p-4"
          >
            <dt className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {fact.label}
            </dt>
            <dd className="mt-2 text-base text-white">
              <strong>{fact.value}</strong>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function HowItWorksSection() {
  const t = useTranslations("SoundCloudDownloader")
  const steps = [
    t("how_it_works_step_1"),
    t("how_it_works_step_2"),
    t("how_it_works_step_3"),
    t("how_it_works_step_4"),
  ]

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
      <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
        {t("section_how_it_works_title")}
      </h2>
      <ol className="space-y-3 text-slate-200">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 text-sm font-semibold text-purple-300">
              {index + 1}
            </span>
            <span>
              <strong>{step}</strong>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function FAQSection() {
  const t = useTranslations("SoundCloudDownloader")
  const faqs = [
    {
      q: t("faq_question_1"),
      a: t("faq_answer_1"),
    },
    {
      q: t("faq_question_2"),
      a: t("faq_answer_2"),
    },
    {
      q: t("faq_question_3"),
      a: t("faq_answer_3"),
    },
    {
      q: t("faq_question_4"),
      a: t("faq_answer_4"),
    },
  ]

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
      <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">{t("section_faq_title")}</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
            <p className="mt-2 text-slate-300">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
