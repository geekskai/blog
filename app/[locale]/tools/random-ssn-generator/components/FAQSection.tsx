"use client"

import React from "react"
import { useTranslations } from "next-intl"

const FAQSection = () => {
  const t = useTranslations("RandomSSNGenerator")

  const faqs = [
    {
      question: t("faq_1_question"),
      answer: t("faq_1_answer"),
    },
    {
      question: t("faq_2_question"),
      answer: t("faq_2_answer"),
    },
    {
      question: t("faq_3_question"),
      answer: t("faq_3_answer"),
    },
    {
      question: t("faq_4_question"),
      answer: t("faq_4_answer"),
    },
    {
      question: t("faq_5_question"),
      answer: t("faq_5_answer"),
    },
    {
      question: t("faq_6_question"),
      answer: t("faq_6_answer"),
    },
    {
      question: t("faq_7_question"),
      answer: t("faq_7_answer"),
    },
    {
      question: t("faq_8_question"),
      answer: t("faq_8_answer"),
    },
    {
      question: t("faq_9_question"),
      answer: t("faq_9_answer"),
    },
    {
      question: t("faq_10_question"),
      answer: t("faq_10_answer"),
    },
  ]

  return (
    <section className="mt-20 rounded-xl bg-slate-800 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">{t("faq_title")}</h2>
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
