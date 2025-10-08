import React from "react"
import { useTranslations } from "next-intl"

const FAQSection = () => {
  const t = useTranslations("RandomVinGenerator.faq")

  const faqs = [
    {
      question: t("q1"),
      answer: t("a1"),
    },
    {
      question: t("q2"),
      answer: t("a2"),
    },
    {
      question: t("q3"),
      answer: t("a3"),
    },
    {
      question: t("q4"),
      answer: t("a4"),
    },
    {
      question: t("q5"),
      answer: t("a5"),
    },
    {
      question: t("q6"),
      answer: t("a6"),
    },
    {
      question: t("q7"),
      answer: t("a7"),
    },
    {
      question: t("q8"),
      answer: t("a8"),
    },
    {
      question: t("q9"),
      answer: t("a9"),
    },
    {
      question: t("q10"),
      answer: t("a10"),
    },
  ]

  return (
    <section className="mt-20 rounded-xl bg-slate-800 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">{t("title")}</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-slate-700 pb-4 last:border-b-0">
            <h3 className="mb-2 text-lg font-semibold text-white">{faq.question}</h3>
            <p className="leading-relaxed text-slate-400">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQSection
