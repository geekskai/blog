"use client"

import React, { type CSSProperties } from "react"
import { useTranslations } from "next-intl"

const seoContentVisibilityStyle: CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "auto 2200px",
}

export function BandcampSeoSections() {
  const t = useTranslations("BandcampToolsHub")
  const coreFacts = t.raw("seo.coreFacts") as Array<{ label: string; value: string }>
  const useCases = t.raw("seo.useCases") as Array<{ title: string; description: string }>
  const workflowSteps = t.raw("seo.workflowSteps") as string[]
  const faqItems = t.raw("seo.faqItems") as Array<{ question: string; answer: string }>

  return (
    <article className="space-y-6" style={seoContentVisibilityStyle}>
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              {t("seo.title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              {t("seo.body1")}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              {t("seo.body2")}
            </p>
          </div>

          <div className="rounded-[24px] border border-cyan-400/15 bg-cyan-400/5 p-5">
            <h3 className="text-lg font-semibold text-white">{t("seo.coreFactsTitle")}</h3>
            <dl className="mt-4 space-y-4 text-sm text-slate-300">
              {coreFacts.map((item) => (
                <div key={item.label}>
                  <dt className="font-semibold text-white">{item.label}</dt>
                  <dd className="mt-1">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{t("seo.useCasesTitle")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          {t("seo.workflowTitle")}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {workflowSteps.map((item, index) => (
            <div key={item} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                {t("seo.stepLabel", { index: index + 1 })}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{t("seo.faqTitle")}</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4"
            >
              <h3 className="text-lg font-semibold text-white">{item.question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-amber-400/15 bg-amber-400/5 p-5 shadow-xl backdrop-blur-sm sm:p-7">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{t("seo.usageTitle")}</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          {t("seo.usageBody")}
        </p>
      </section>
    </article>
  )
}
