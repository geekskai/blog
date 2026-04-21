import { Link } from "app/i18n/navigation"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import React from "react"
import { SUPPORTED_BRANDS } from "../../types"
import {
  generateVehicleTypePageData,
  getTypeConfig,
  safeTranslate,
  VEHICLE_TYPE_CONFIG,
} from "./vehicle-type-seo"

interface VehicleTypePageProps {
  params: {
    locale: string
    type: string
  }
}

export async function generateStaticParams() {
  return Object.keys(VEHICLE_TYPE_CONFIG).map((type) => ({ type }))
}

export default async function VehicleTypeVinDecoderPage({ params }: VehicleTypePageProps) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "VinDecoder.vehicleTypePage",
  })
  const config = getTypeConfig(params.type)

  if (!config) {
    notFound()
  }

  const pageData = await generateVehicleTypePageData(params.locale, config)

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
            <strong>{pageData.localized.name}</strong>&nbsp;
            {safeTranslate(t, "badge_suffix", "VIN Search Intent Page")}
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
            {pageData.localized.h1}
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-300 sm:text-base md:text-lg">
            {pageData.localized.description}
          </p>
          <p className="mt-3 text-xs text-slate-400 sm:text-sm">
            <strong>{safeTranslate(t, "last_updated_label", "Last updated:")}</strong>{" "}
            {pageData.lastModified.toISOString().split("T")[0]}
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-5 backdrop-blur-xl sm:mb-10 sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
            {safeTranslate(t, "core_facts_title", "Core facts at a glance")}
          </h2>
          <dl className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2 sm:text-base">
            <div className="rounded-xl border border-white/10 bg-slate-900/25 p-3">
              <dt className="font-semibold text-white">
                <strong>{safeTranslate(t, "core_fact.primary_keyword", "Primary keyword")}</strong>
              </dt>
              <dd>{config.primaryKeyword}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/25 p-3">
              <dt className="font-semibold text-white">
                <strong>{safeTranslate(t, "core_fact.cost", "Cost")}</strong>
              </dt>
              <dd>{safeTranslate(t, "core_fact.cost_value", "Free VIN decoder")}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/25 p-3">
              <dt className="font-semibold text-white">
                <strong>{safeTranslate(t, "core_fact.source", "Data source")}</strong>
              </dt>
              <dd>{safeTranslate(t, "core_fact.source_value", "NHTSA vPIC reference data")}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/25 p-3">
              <dt className="font-semibold text-white">
                <strong>{safeTranslate(t, "core_fact.intent", "Intent type")}</strong>
              </dt>
              <dd>
                {safeTranslate(
                  t,
                  "core_fact.intent_value",
                  "Informational + commercial VIN lookup intent"
                )}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-slate-300 sm:text-sm">
            {safeTranslate(t, "core_fact.source", "Data source")}:{` `}
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
              "Boundary note: VIN decoding validates technical identity fields. It does not replace paid vehicle history datasets."
            )}
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 backdrop-blur-xl sm:mb-10 sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
            {safeTranslate(t, "best_use_cases_title", "Best use cases")}
          </h2>
          <ul className="space-y-2 text-sm text-slate-200 sm:text-base">
            {pageData.localized.useCases.map((item) => (
              <li key={item}>
                - <strong>{item}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-5 backdrop-blur-xl sm:mb-10 sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
            {safeTranslate(t, "quick_answer_title", "Quick answer")}
          </h2>
          <p className="text-sm text-slate-200 sm:text-base">
            <strong>{safeTranslate(t, "direct_answer_label", "Direct answer:")}</strong>{" "}
            {safeTranslate(
              t,
              "quick_answer_text",
              `You can use this ${pageData.localized.name.toLowerCase()} VIN decoder page to match high-intent queries and then decode VINs instantly via the`
            )}{" "}
            <Link
              href="/tools/vin-decoder"
              className="text-emerald-300 underline underline-offset-4"
            >
              {safeTranslate(t, "main_tool_link", "main VIN tool")}
            </Link>
            .{" "}
            {safeTranslate(
              t,
              "quick_answer_suffix",
              "It is free, no registration, and backed by official NHTSA data."
            )}
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-5 backdrop-blur-xl sm:mb-10 sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
            {safeTranslate(t, "faq_title", "FAQ")}
          </h2>
          <div className="space-y-4">
            {pageData.allFaqItems.map((item) => (
              <article
                key={item.q}
                className="rounded-xl border border-white/10 bg-slate-900/25 p-4"
              >
                <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">{item.q}</h3>
                <p className="text-sm text-slate-200 sm:text-base">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-8 sm:mb-10">
          <div className="mb-4 text-center sm:mb-6">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {safeTranslate(t, "related_brand_title", "Related Brand Decoders")}
            </h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              {safeTranslate(
                t,
                "related_brand_description",
                "Jump into popular brand-specific VIN pages for faster lookup workflows."
              )}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            {SUPPORTED_BRANDS.slice(0, 10).map((brand, index) => {
              const styles = [
                {
                  border: "border-blue-500/30",
                  bg: "from-blue-500/15 to-cyan-500/10",
                  glow: "hover:shadow-blue-500/25",
                },
                {
                  border: "border-emerald-500/30",
                  bg: "from-emerald-500/15 to-teal-500/10",
                  glow: "hover:shadow-emerald-500/25",
                },
                {
                  border: "border-purple-500/30",
                  bg: "from-purple-500/15 to-pink-500/10",
                  glow: "hover:shadow-purple-500/25",
                },
                {
                  border: "border-orange-500/30",
                  bg: "from-orange-500/15 to-red-500/10",
                  glow: "hover:shadow-orange-500/25",
                },
              ]
              const scheme = styles[index % styles.length]

              return (
                <Link
                  key={brand.slug}
                  href={`/tools/vin-decoder/${brand.slug}`}
                  className={`group overflow-hidden rounded-xl border ${scheme.border} bg-gradient-to-br ${scheme.bg} p-3 text-center backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${scheme.glow}`}
                >
                  <div className="relative">
                    <h3 className="truncate text-sm font-semibold text-white">{brand.name}</h3>
                    <p className="mt-1 text-xs text-slate-300">
                      {safeTranslate(t, "brand_decoder_suffix", "VIN Decoder")}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-3 text-center">
          <Link
            href="/tools/vin-decoder"
            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 sm:px-8 sm:py-4 sm:text-base"
          >
            {safeTranslate(t, "cta_decode_now", "Decode a VIN Now")}
          </Link>
          <Link
            href="/tools/vin-decoder/vin-decoder-vs-vin-check"
            className="inline-flex items-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 px-6 py-3 text-sm font-semibold text-cyan-200 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 sm:px-8 sm:py-4 sm:text-base"
          >
            {safeTranslate(t, "cta_compare", "Compare VIN Decoder vs VIN Check")}
          </Link>
        </div>
      </div>
    </div>
  )
}
