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
    <section className="mt-12 rounded-xl bg-slate-800 p-4 sm:p-6 md:mt-16 md:p-8 lg:mt-20">
      <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
        {t("title")}
      </h2>
      <div className="space-y-4 sm:space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-slate-700 pb-3 last:border-b-0 sm:pb-4">
            <h3 className="mb-1.5 text-sm font-semibold leading-snug text-white sm:mb-2 sm:text-base md:text-lg">
              {faq.question}
            </h3>
            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm md:text-base">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQSection
