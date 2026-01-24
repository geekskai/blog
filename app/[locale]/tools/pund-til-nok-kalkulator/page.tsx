"use client"
import {
  TrendingUp,
  ArrowLeftRight,
  Globe,
  BookOpen,
  Home,
  ChevronRight,
  Sparkles,
  Zap,
  Calculator,
} from "lucide-react"
import { Link } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"
import { formatDistanceToNow } from "date-fns"
import ConverterCard from "./components/ConverterCard"
import QuickReference from "./components/QuickReference"
import EducationalContent from "./components/EducationalContent"
import React from "react"

// Content freshness metadata - 内容新鲜度
const lastModified = new Date("2025-01-24")

// Content Freshness Badge Component - 符合SEO标准
function ContentFreshnessBadge({ lastModified }: { lastModified: Date }) {
  const t = useTranslations("GbpNokConverter")
  const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24))
  const isFresh = daysSinceUpdate < 90

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
        isFresh
          ? "border border-green-500/30 bg-green-500/20 text-green-300"
          : "border border-orange-500/30 bg-orange-500/20 text-orange-300"
      }`}
    >
      <span>{isFresh ? "✓" : "⚠"}</span>
      <span>
        {isFresh
          ? `${t("content_freshness_updated")} ${formatDistanceToNow(lastModified, { addSuffix: true })}`
          : `${t("content_freshness_last_updated")} ${formatDistanceToNow(lastModified, { addSuffix: true })}`}
      </span>
    </div>
  )
}

// Core Facts Section - 核心事实提取优化
function CoreFactsSection() {
  const t = useTranslations("GbpNokConverter")
  const coreFacts = [
    { label: t("core_facts_pricing_label"), value: t("core_facts_pricing_value"), key: "pricing" },
    {
      label: t("core_facts_features_label"),
      value: t("core_facts_features_value"),
      key: "features",
    },
    {
      label: t("core_facts_positioning_label"),
      value: t("core_facts_positioning_value"),
      key: "positioning",
    },
    {
      label: t("core_facts_target_users_label"),
      value: t("core_facts_target_users_value"),
      key: "targetUsers",
    },
  ]

  return (
    <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-purple-900/20 to-pink-900/25 p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-bold text-white">{t("core_facts_title")}</h2>
      <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {coreFacts.map((fact) => (
          <div key={fact.key} className="rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
            <dt className="mb-2 text-sm font-semibold text-slate-400">{fact.label}</dt>
            <dd className="text-lg font-bold text-white">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default function GbpNokConverter() {
  const t = useTranslations("GbpNokConverter")

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav
        className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"
        aria-label={t("structured_data.aria_breadcrumb")}
      >
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb_home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="transition-colors hover:text-slate-200">
              {t("breadcrumb_tools")}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb_title")}</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <ArrowLeftRight className="mr-2 h-4 w-4 text-blue-400" />
              {t("header_badge")}
              <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
            </div>

            <h1 className="mb-6 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">{t("header_title_line1")}</span>
              <span className="block bg-gradient-to-r from-blue-500 via-red-500 to-emerald-500 bg-clip-text text-transparent">
                {t("header_title_line2")}
              </span>
            </h1>

            {/* Content Freshness Badge */}
            <div className="mb-6 flex justify-center">
              <ContentFreshnessBadge lastModified={lastModified} />
            </div>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              {t.rich("header_description", {
                free: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                gbp_nok: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                rates: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
              })}
            </p>

            {/* SEO-optimized feature badges - 使用翻译 */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  {t.rich("feature_live_rates", {
                    strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="font-medium">
                  {t.rich("feature_calculator", {
                    strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="font-medium">
                  {t.rich("feature_instant", {
                    strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span className="font-medium">
                  {t.rich("feature_free", {
                    strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </span>
              </div>
            </div>

            {/* Additional SEO keywords section - 使用翻译 */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("structured_data.seo_keyword_1")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("structured_data.seo_keyword_2")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("structured_data.seo_keyword_3")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("structured_data.seo_keyword_4")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("structured_data.seo_keyword_5")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("structured_data.seo_keyword_6")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("structured_data.seo_keyword_7")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("structured_data.seo_keyword_8")}
                </span>
              </p>
            </div>
          </div>

          {/* Main conversion area */}
          <div id="converter-section" className="grid gap-8 lg:grid-cols-3">
            {/* Left panel - Converter */}
            <div className="space-y-6 lg:col-span-2">
              <ConverterCard />
            </div>

            {/* Right panel - Quick Reference */}
            <div className="lg:col-span-1">
              <QuickReference />
            </div>
          </div>

          {/* Core Facts Section - 核心事实提取优化 */}
          <CoreFactsSection />

          {/* Educational Content */}
          <div className="mt-16">
            <EducationalContent />
          </div>
        </div>

        {/* Usage guide - SEO optimized */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{t("usage_guide_title")}</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {t.rich("usage_guide_description", {
                conversion: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                travel: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                business: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                forex: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                converter: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                accurate: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
              })}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t("usage_step1_title")}</h3>
              <p className="text-slate-400">
                {t.rich("usage_step1_description", {
                  gbp: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  nok: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  any: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  instant: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t("usage_step2_title")}</h3>
              <p className="text-slate-400">
                {t.rich("usage_step2_description", {
                  rate: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  hourly: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  accurate: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t("usage_step3_title")}</h3>
              <p className="text-slate-400">
                {t.rich("usage_step3_description", {
                  results: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  travel: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  business: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t("usage_step4_title")}</h3>
              <p className="text-slate-400">
                {t.rich("usage_step4_description", {
                  copy: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  budgets: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  invoices: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  documents: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO - 挪威语优化内容 */}
        <div className="mt-20 space-y-16">
          {/* 核心内容区域 - 使用翻译 */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("why_choose_title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  {t.rich("why_choose_description1", {
                    calculator: (chunks) => <strong className="text-white">{chunks}</strong>,
                    rates: (chunks) => <strong className="text-white">{chunks}</strong>,
                    gbp_nok: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
                <p className="text-slate-200">
                  {t.rich("why_choose_description2", {
                    calculator: (chunks) => <strong className="text-white">{chunks}</strong>,
                    results: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("why_choose_benefits_title")}
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>
                    •{" "}
                    {t.rich("why_choose_benefit1", {
                      rates: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("why_choose_benefit2", {
                      free: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("why_choose_benefit3", {
                      accurate: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("why_choose_benefit4", {
                      perfect: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("why_choose_benefit5", {
                      mobile: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("why_choose_benefit6", {
                      no_reg: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 常见问题 - 使用翻译 */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("faq_norwegian_title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-lg bg-purple-900/30 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {t("faq_norwegian_rate_question")}
                  </h3>
                  <p className="text-slate-200">
                    {t.rich("faq_norwegian_rate_answer", {
                      rate: (chunks) => <strong className="text-white">{chunks}</strong>,
                      current: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-900/30 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {t("faq_norwegian_free_question")}
                  </h3>
                  <p className="text-slate-200">
                    {t.rich("faq_norwegian_free_answer", {
                      calculator: (chunks) => <strong className="text-white">{chunks}</strong>,
                      free: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg bg-purple-900/30 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {t("faq_norwegian_update_question")}
                  </h3>
                  <p className="text-slate-200">
                    {t.rich("faq_norwegian_update_answer", {
                      rates: (chunks) => <strong className="text-white">{chunks}</strong>,
                      hourly: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-900/30 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {t("faq_norwegian_large_question")}
                  </h3>
                  <p className="text-slate-200">
                    {t.rich("faq_norwegian_large_answer", {
                      all: (chunks) => <strong className="text-white">{chunks}</strong>,
                      current: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="mt-20 space-y-16">
          {/* What affects GBP NOK rates */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("factors_title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  {t.rich("factors_description1", {
                    rate: (chunks) => <strong className="text-white">{chunks}</strong>,
                    oil: (chunks) => <strong className="text-white">{chunks}</strong>,
                    interest: (chunks) => <strong className="text-white">{chunks}</strong>,
                    brexit: (chunks) => <strong className="text-white">{chunks}</strong>,
                    economic: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
                <p className="text-slate-200">
                  {t.rich("factors_description2", {
                    converter: (chunks) => <strong className="text-white">{chunks}</strong>,
                    accurate: (chunks) => <strong className="text-white">{chunks}</strong>,
                    transactions: (chunks) => <strong className="text-white">{chunks}</strong>,
                    travel: (chunks) => <strong className="text-white">{chunks}</strong>,
                    business: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("factors_influencers_title")}
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>
                    •{" "}
                    {t.rich("factors_influencer_oil", {
                      oil: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("factors_influencer_interest", {
                      interest: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("factors_influencer_brexit", {
                      brexit: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("factors_influencer_economic", {
                      economic: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("factors_influencer_sentiment", {
                      sentiment: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("factors_influencer_trade", {
                      trade: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* GBP NOK Conversion Guide */}
          <section className="rounded-xl bg-gradient-to-r from-red-800 to-rose-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("guide_title")}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-red-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">{t("guide_live_title")}</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    {t.rich("guide_live_desc1", {
                      realtime: (chunks) => <strong className="text-white">{chunks}</strong>,
                      reliable: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <p>
                    {t.rich("guide_live_desc2", {
                      hourly: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <p>
                    {t.rich("guide_live_desc3", {
                      use: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-red-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">{t("guide_times_title")}</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    {t.rich("guide_times_desc1", {
                      hours: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <p>
                    {t.rich("guide_times_desc2", {
                      news: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <p>
                    {t.rich("guide_times_desc3", {
                      oil: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-red-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("guide_examples_title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    {t.rich("guide_example1", {
                      example: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <p>
                    {t.rich("guide_example2", {
                      example: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <p>
                    {t.rich("guide_example3", {
                      example: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <p>
                    {t.rich("guide_example_note", {
                      vary: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Travel and Business Usage */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("travel_business_title")}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("travel_uk_norway_title")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("travel_uk_norway_desc", {
                    travelers: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    convert: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    items: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("travel_norway_uk_title")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("travel_norway_uk_desc", {
                    visitors: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    convert: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    trips: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("travel_business_title2")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("travel_business_desc", {
                    transactions: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    pricing: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    negotiations: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    reporting: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* Common Use Cases Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("usecases_title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("usecase_travel_title")}</h3>
                    <p className="text-slate-400">{t("usecase_travel_desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("usecase_business_title")}</h3>
                    <p className="text-slate-400">{t("usecase_business_desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("usecase_shopping_title")}</h3>
                    <p className="text-slate-400">{t("usecase_shopping_desc")}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("usecase_education_title")}</h3>
                    <p className="text-slate-400">{t("usecase_education_desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    5
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("usecase_investment_title")}</h3>
                    <p className="text-slate-400">{t("usecase_investment_desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    6
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("usecase_remittances_title")}</h3>
                    <p className="text-slate-400">{t("usecase_remittances_desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">{t("features_title")}</h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">{t("features_subtitle")}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <TrendingUp className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("feature_realtime_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t.rich("feature_realtime_description", {
                    live: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    hourly: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    accurate: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <ArrowLeftRight className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("feature_bidirectional_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t.rich("feature_bidirectional_description", {
                    gbp_nok: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    nok_gbp: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    instant: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    flexibility: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Calculator className="h-12 w-12 text-emerald-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("feature_tools_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t.rich("feature_tools_description", {
                    copy: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    detailed: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    tables: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("faq_title")}</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq_rate_question")}</h3>
                <p className="text-slate-400">
                  {t.rich("faq_rate_answer", {
                    rate: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    realtime: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    typical: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq_convert_question")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("faq_convert_answer", {
                    enter: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    equivalent: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    current: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    nok_gbp: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq_why_change_question")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("faq_why_change_answer", {
                    oil: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    interest: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    brexit: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    economic: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    sentiment: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq_business_question")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("faq_business_answer", {
                    business: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    travel: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    personal: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    commercial: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    hedging: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq_accuracy_question")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("faq_accuracy_answer", {
                    reliable: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    regularly: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    cash: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq_travel_question")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("faq_travel_answer", {
                    converter: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    planning: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    items: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    expensive: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq_free_question")}</h3>
                <p className="text-slate-400">
                  {t.rich("faq_free_answer", {
                    converter: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    free: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    no_reg: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    unlimited: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    all: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq_other_tools_question")}
                </h3>
                <p className="text-slate-400">
                  {t.rich("faq_other_tools_answer", {
                    suite: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                    currencies: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/20 to-red-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">{t("cta_title")}</h2>
            <p className="mb-8 text-xl text-slate-300">
              {t.rich("cta_description", {
                converter: (chunks) => <strong className="text-white">{chunks}</strong>,
                needs: (chunks) => <strong className="text-white">{chunks}</strong>,
              })}
            </p>
            <button
              onClick={() => {
                document.querySelector("#converter-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Calculator className="h-5 w-5" />
              {t("cta_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
