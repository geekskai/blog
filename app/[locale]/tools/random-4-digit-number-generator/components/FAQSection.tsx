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
    <section className="mt-12 md:mt-20 lg:mt-24">
      {/* Section Header */}
      <div className="mb-8 text-center md:mb-12">
        <div className="to-white/2 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-white/5 px-3 py-1.5 backdrop-blur-sm sm:px-4 md:px-6 md:py-2">
          <span className="text-xl md:text-2xl">❓</span>
          <span className="text-xs font-medium text-slate-300 md:text-sm">{t("badge")}</span>
        </div>
        <h2 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
          {t("description")}
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="mx-auto max-w-4xl space-y-3 sm:space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-white/5 sm:p-4 md:p-6"
              >
                <h3 className="pr-6 text-base font-semibold leading-7 text-white sm:pr-8 sm:text-lg">
                  {faq.question}
                </h3>
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
                <div className="border-t border-white/10 p-3.5 pt-3.5 sm:p-4 sm:pt-4 md:p-6">
                  <p className="text-sm leading-7 text-slate-300 sm:text-base">{faq.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Help */}
      <div className="mt-12 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-5 text-center backdrop-blur-sm sm:p-6 md:p-8">
        <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl">
          {t("still_have_questions.title")}
        </h3>
        <p className="mb-6 text-sm leading-7 text-slate-300 sm:text-base">
          {t("still_have_questions.description")}
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href="https://geekskai.com/blog/"
            target="_blank"
            className="group relative overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-blue-500/10 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 sm:px-6 sm:text-base"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <span className="relative">{t("still_have_questions.view_docs")}</span>
          </a>
          <a
            href="mailto:geeks.kai@gmail.com"
            className="group relative overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-purple-500/10 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 sm:px-6 sm:text-base"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <span className="relative">{t("still_have_questions.contact_support")}</span>
          </a>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
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
            className="to-white/2 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 p-3.5 backdrop-blur-sm sm:p-4"
          >
            <div className="mb-2 text-xl sm:text-2xl">{tip.icon}</div>
            <h4 className="mb-1 text-sm font-semibold text-white sm:text-base">{tip.title}</h4>
            <p className="text-xs leading-6 text-slate-400 sm:text-sm">{tip.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQSection
