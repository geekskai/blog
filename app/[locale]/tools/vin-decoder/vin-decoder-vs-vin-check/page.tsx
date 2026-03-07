import { Link } from "app/i18n/navigation"
import { getTranslations } from "next-intl/server"
import React from "react"
import { generateComparePageData, safeTranslate } from "./layout"

interface ComparePageProps {
  params: {
    locale: string
  }
}

export default async function VinDecoderVsVinCheckPage({ params }: ComparePageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: "VinDecoder.comparePage" })
  const pageData = await generateComparePageData(params.locale)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-xs text-slate-400 sm:text-sm" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            {pageData.breadcrumbItems.map((item, index) => {
              const isLast = index === pageData.breadcrumbItems.length - 1
              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  <li>
                    {item.href && !isLast ? (
                      <Link href={item.href} className="hover:text-slate-200">
                        {item.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "font-medium text-slate-100" : undefined}>
                        {item.label}
                      </span>
                    )}
                  </li>
                  {!isLast && <li>/</li>}
                </React.Fragment>
              )
            })}
          </ol>
        </nav>

        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 px-4 py-2 text-xs text-blue-200 sm:text-sm">
            {safeTranslate(t, "badge", "Buying Workflow Guide")}
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
            {pageData.title}
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
            <strong>{safeTranslate(t, "quick_answer_label", "Quick answer:")}</strong>{" "}
            {safeTranslate(
              t,
              "quick_answer_text",
              "VIN decoder tells you what the vehicle is. VIN check helps you understand what happened to that vehicle over time."
            )}
          </p>
          <p className="mt-3 text-xs text-slate-400 sm:text-sm">
            <strong>{safeTranslate(t, "last_updated_label", "Last updated:")}</strong>{" "}
            {pageData.lastModified.toISOString().split("T")[0]}
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-5 backdrop-blur-xl sm:mb-10 sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
            {safeTranslate(t, "core_facts_title", "Core facts")}
          </h2>
          <dl className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2 sm:text-base">
            <div className="rounded-xl border border-white/10 bg-slate-900/25 p-3">
              <dt className="font-semibold text-white">
                <strong>{safeTranslate(t, "core_facts.cost", "Cost baseline")}</strong>
              </dt>
              <dd>
                {safeTranslate(
                  t,
                  "core_facts.cost_value",
                  "Free VIN decoder + optional paid report"
                )}
              </dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/25 p-3">
              <dt className="font-semibold text-white">
                <strong>{safeTranslate(t, "core_facts.keyword", "Primary query")}</strong>
              </dt>
              <dd>{safeTranslate(t, "core_facts.keyword_value", "vin decoder vs vin check")}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/25 p-3">
              <dt className="font-semibold text-white">
                <strong>{safeTranslate(t, "core_facts.decoder", "VIN decoder output")}</strong>
              </dt>
              <dd>
                {safeTranslate(
                  t,
                  "core_facts.decoder_value",
                  "Make/model/year/engine specs from VIN number decoder logic"
                )}
              </dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/25 p-3">
              <dt className="font-semibold text-white">
                <strong>{safeTranslate(t, "core_facts.check", "VIN check output")}</strong>
              </dt>
              <dd>
                {safeTranslate(
                  t,
                  "core_facts.check_value",
                  "Ownership, title, accident, and risk history"
                )}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-slate-300 sm:text-sm">
            {t("decoder_card.source_label")}{" "}
            <a
              href="https://vpic.nhtsa.dot.gov/api/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-medium text-cyan-300 underline decoration-cyan-400/60 underline-offset-4 hover:text-cyan-200"
            >
              NHTSA vPIC API
            </a>
          </p>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            {safeTranslate(
              t,
              "source_boundary_note",
              "Boundary note: VIN decoder data supports specification verification. Ownership, title, and accident risk still require a dedicated VIN check report."
            )}
          </p>
        </section>

        <section className="mb-8 grid gap-4 sm:mb-10 sm:grid-cols-2">
          <article className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-5 backdrop-blur-xl">
            <h2 className="mb-3 text-xl font-bold text-white">
              {safeTranslate(t, "decoder_card.title", "VIN Decoder")}
            </h2>
            <ul className="space-y-2 text-sm text-slate-200 sm:text-base">
              <li>
                - <strong>{safeTranslate(t, "decoder_card.purpose_label", "Purpose:")}</strong>{" "}
                {safeTranslate(t, "decoder_card.purpose_value", "Identify vehicle specs")}
              </li>
              <li>
                - <strong>{safeTranslate(t, "decoder_card.includes_label", "Includes:")}</strong>{" "}
                {safeTranslate(
                  t,
                  "decoder_card.includes_value",
                  "Make, model, year, engine, body class"
                )}
              </li>
              <li>
                - <strong>{safeTranslate(t, "decoder_card.source_label", "Data Source:")}</strong>{" "}
                {safeTranslate(t, "decoder_card.source_value", "Official NHTSA/vPIC style records")}
              </li>
              <li>
                - <strong>{safeTranslate(t, "decoder_card.best_for_label", "Best For:")}</strong>{" "}
                {safeTranslate(t, "decoder_card.best_for_value", "Validating listing accuracy")}
              </li>
              <li>
                - <strong>{safeTranslate(t, "decoder_card.cost_label", "Cost:")}</strong>{" "}
                {safeTranslate(t, "decoder_card.cost_value", "Usually free")}
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-red-500/10 p-5 backdrop-blur-xl">
            <h2 className="mb-3 text-xl font-bold text-white">
              {safeTranslate(t, "check_card.title", "VIN Check Report")}
            </h2>
            <ul className="space-y-2 text-sm text-slate-200 sm:text-base">
              <li>
                - <strong>{safeTranslate(t, "check_card.purpose_label", "Purpose:")}</strong>{" "}
                {safeTranslate(t, "check_card.purpose_value", "Assess historical risk")}
              </li>
              <li>
                - <strong>{safeTranslate(t, "check_card.includes_label", "Includes:")}</strong>{" "}
                {safeTranslate(
                  t,
                  "check_card.includes_value",
                  "Title events, accident claims, salvage flags"
                )}
              </li>
              <li>
                - <strong>{safeTranslate(t, "check_card.source_label", "Data Source:")}</strong>{" "}
                {safeTranslate(t, "check_card.source_value", "Commercial/insurance records")}
              </li>
              <li>
                - <strong>{safeTranslate(t, "check_card.best_for_label", "Best For:")}</strong>{" "}
                {safeTranslate(t, "check_card.best_for_value", "Used-car purchase due diligence")}
              </li>
              <li>
                - <strong>{safeTranslate(t, "check_card.cost_label", "Cost:")}</strong>{" "}
                {safeTranslate(t, "check_card.cost_value", "Often paid")}
              </li>
            </ul>
          </article>
        </section>

        <section className="mb-8 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-5 backdrop-blur-xl sm:mb-10 sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
            {safeTranslate(t, "workflow_title", "Recommended workflow")}
          </h2>
          <ol className="space-y-2 text-sm text-slate-200 sm:text-base">
            <li>
              1.
              <strong> {safeTranslate(t, "workflow.step1.label", "Decode VIN first")}</strong>{" "}
              {safeTranslate(
                t,
                "workflow.step1.text",
                "to verify the vehicle identity and technical specs."
              )}
            </li>
            <li>
              2.
              <strong>
                {" "}
                {safeTranslate(t, "workflow.step2.label", "Compare listing details")}
              </strong>{" "}
              {safeTranslate(
                t,
                "workflow.step2.text",
                "with decoded output to catch mismatches early."
              )}
            </li>
            <li>
              3.
              <strong>
                {" "}
                {safeTranslate(t, "workflow.step3.label", "Run a VIN check report")}
              </strong>{" "}
              {safeTranslate(
                t,
                "workflow.step3.text",
                "before payment for ownership and accident history."
              )}
            </li>
          </ol>
        </section>

        <section className="mb-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-5 backdrop-blur-xl sm:mb-10 sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
            {safeTranslate(t, "boundaries_title", "Scope and boundaries")}
          </h2>
          <ul className="space-y-2 text-sm text-slate-200 sm:text-base">
            <li>
              - <strong>{safeTranslate(t, "boundaries.1.label", "VIN decoder can:")}</strong>{" "}
              {safeTranslate(
                t,
                "boundaries.1.text",
                "verify identity and decode vehicle specs from VIN structure."
              )}
            </li>
            <li>
              - <strong>{safeTranslate(t, "boundaries.2.label", "VIN decoder cannot:")}</strong>{" "}
              {safeTranslate(
                t,
                "boundaries.2.text",
                "confirm accident, title, theft, or ownership events on its own."
              )}
            </li>
            <li>
              - <strong>{safeTranslate(t, "boundaries.3.label", "VIN check can:")}</strong>{" "}
              {safeTranslate(
                t,
                "boundaries.3.text",
                "add historical risk context for purchase and insurance decisions."
              )}
            </li>
          </ul>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 backdrop-blur-xl sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
            {safeTranslate(t, "faq_title", "FAQ")}
          </h2>
          <div className="space-y-4">
            {pageData.faqItems.map((item) => (
              <article key={item.q}>
                <h3 className="mb-1 text-base font-semibold text-white sm:text-lg">{item.q}</h3>
                <p className="text-sm text-slate-200 sm:text-base">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/tools/vin-decoder"
            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30"
          >
            {safeTranslate(t, "cta_try", "Try VIN Decoder")}
          </Link>
          <Link
            href="/tools/vin-decoder/vehicle-types/motorcycle"
            className="inline-flex items-center rounded-2xl border border-slate-500/40 bg-slate-800/40 px-6 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-slate-400/60 hover:bg-slate-700/40"
          >
            {safeTranslate(t, "cta_explore_types", "Explore Vehicle Types")}
          </Link>
        </div>
      </div>
    </div>
  )
}
