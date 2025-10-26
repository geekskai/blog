"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

const FAQSection = () => {
  const t = useTranslations("Random4DigitNumberGenerator.faq")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: t("items.how_random.question"),
      answer: t("items.how_random.answer"),
    },
    {
      question: t("items.no_duplicates.question"),
      answer: t("items.no_duplicates.answer"),
    },
    {
      question: t("items.is_free.question"),
      answer: t("items.is_free.answer"),
    },
    {
      question: t("items.secure_passwords.question"),
      answer: t("items.secure_passwords.answer"),
    },
    {
      question: t("items.more_than_1000.question"),
      answer: t("items.more_than_1000.answer"),
    },
    {
      question: t("items.store_numbers.question"),
      answer: t("items.store_numbers.answer"),
    },
    {
      question: t("items.format_options.question"),
      answer: t("items.format_options.answer"),
    },
    {
      question: t("items.exclude_patterns.question"),
      answer: t("items.exclude_patterns.answer"),
    },
    {
      question: t("items.how_export.question"),
      answer: t("items.how_export.answer"),
    },
    {
      question: t("items.lottery_gambling.question"),
      answer: t("items.lottery_gambling.answer"),
    },
    {
      question: t("items.browsers_supported.question"),
      answer: t("items.browsers_supported.answer"),
    },
    {
      question: t("items.range_setting.question"),
      answer: t("items.range_setting.answer"),
    },
  ]

  return (
    <section className="mt-20">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <div className="to-white/2 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-white/5 px-6 py-2 backdrop-blur-sm">
          <span className="text-2xl">❓</span>
          <span className="text-sm font-medium text-slate-300">{t("badge")}</span>
        </div>
        <h2 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-400">{t("description")}</p>
      </div>

      {/* FAQ Accordion */}
      <div className="mx-auto max-w-4xl space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
              >
                <h3 className="pr-8 text-lg font-semibold text-white">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="border-t border-white/10 p-6 pt-4">
                  <p className="leading-relaxed text-slate-300">{faq.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Help */}
      <div className="mt-12 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 text-center backdrop-blur-sm">
        <h3 className="mb-3 text-2xl font-bold text-white">{t("still_have_questions.title")}</h3>
        <p className="mb-6 text-slate-300">{t("still_have_questions.description")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/docs"
            className="group relative overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-blue-500/10 px-6 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <span className="relative">{t("still_have_questions.view_docs")}</span>
          </a>
          <a
            href="/contact"
            className="group relative overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-purple-500/10 px-6 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <span className="relative">{t("still_have_questions.contact_support")}</span>
          </a>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: t("pro_tips.tip_1.icon"),
            title: t("pro_tips.tip_1.title"),
            text: t("pro_tips.tip_1.text"),
          },
          {
            icon: t("pro_tips.tip_2.icon"),
            title: t("pro_tips.tip_2.title"),
            text: t("pro_tips.tip_2.text"),
          },
          {
            icon: t("pro_tips.tip_3.icon"),
            title: t("pro_tips.tip_3.title"),
            text: t("pro_tips.tip_3.text"),
          },
        ].map((tip, index) => (
          <div
            key={index}
            className="to-white/2 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 p-4 backdrop-blur-sm"
          >
            <div className="mb-2 text-2xl">{tip.icon}</div>
            <h4 className="mb-1 font-semibold text-white">{tip.title}</h4>
            <p className="text-sm text-slate-400">{tip.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQSection
