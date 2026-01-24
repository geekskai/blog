"use client"

import { useState } from "react"
import {
  FileText,
  Clock,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Home,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import { usePERMTracker } from "./hooks/usePERMTracker"
import CurrentDataPanel from "./components/CurrentDataPanel"
import CaseTracker from "./components/CaseTracker"
import HistoricalChart from "./components/HistoricalChart"
import ShareButtons from "@/components/ShareButtons"
import { Link } from "@/app/i18n/navigation"
import { useTranslations } from "./hooks/useTranslations"

export default function PERMProcessingTimeTracker() {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<"overview" | "cases" | "trends">("overview")

  const {
    currentData,
    userCases,
    historicalData,
    trendAnalysis,
    isLoading,
    lastFetched,
    error,
    hasUserCases,
    totalCases,
    fetchLatestData,
    addCase,
    removeCase,
    updateCase,
    clearAllData,
  } = usePERMTracker()

  const handleTabChange = (tab: "overview" | "cases" | "trends") => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute left-1/2 top-40 h-80 w-80 rounded-full bg-green-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb_home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="hover:text-slate-200">
              {t("breadcrumb_tools")}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb_title")}</li>
        </ol>
      </nav>
      {/* Social Share */}
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <ShareButtons />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <Clock className="mr-2 h-4 w-4" />
            {t("badge_text")}
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
            {t("title")}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            {t.rich("description", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="font-medium">
                {t.rich("quick_stats.realtime_dol_data", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {t.rich("quick_stats.privacy_first", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="font-medium">
                {t.rich("quick_stats.trend_analysis", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-lg bg-slate-800/80 p-1 backdrop-blur-sm">
            <button
              onClick={() => handleTabChange("overview")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>{t("tabs.overview")}</span>
            </button>
            <button
              onClick={() => handleTabChange("cases")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "cases"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{t("tabs.my_cases")}</span>
              {totalCases > 0 && (
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs">
                  {totalCases}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange("trends")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "trends"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>{t("tabs.historical_trends")}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 p-4">
            <div className="flex items-center">
              <AlertCircle className="mr-3 h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-100">{t("errors.data_fetch_error")}</h3>
                <p className="mt-1 text-sm text-red-200">{error}</p>
                <button
                  onClick={fetchLatestData}
                  disabled={isLoading}
                  className="mt-2 text-sm text-red-100 underline hover:text-white disabled:opacity-50"
                >
                  {t("errors.try_again")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <CurrentDataPanel
              data={currentData}
              trendAnalysis={trendAnalysis}
              isLoading={isLoading}
              lastFetched={lastFetched}
              onRefresh={fetchLatestData}
            />
          )}

          {activeTab === "cases" && (
            <CaseTracker
              cases={userCases}
              currentData={currentData}
              onAddCase={addCase}
              onRemoveCase={removeCase}
              onUpdateCase={updateCase}
            />
          )}

          {activeTab === "trends" && <HistoricalChart data={historicalData} />}
        </div>

        {/* Data Source Attribution - SEO Optimized */}
        <section
          className="mt-12 rounded-lg bg-slate-800/50 p-4 text-center"
          aria-label="Data Source"
        >
          <p className="text-sm text-slate-400">
            📊{" "}
            {t.rich("data_source.label", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
            :{" "}
            <a
              href="https://flag.dol.gov/processingtimes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              {t.rich("data_source.dol_link", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </a>
          </p>
          {lastFetched && (
            <p className="mt-1 text-xs text-slate-500">
              {t.rich("data_source.last_updated", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
              :{" "}
              <time dateTime={lastFetched.toISOString()}>
                {lastFetched.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </p>
          )}
        </section>

        {/* Core Facts Section - SEO Optimized */}
        {activeTab === "overview" && (
          <section className="mt-20" aria-label="Core Information">
            <div className="mb-8 rounded-xl bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-pink-500/25 p-8 ring-1 ring-white/10 backdrop-blur-xl">
              <h2 className="mb-6 text-center text-2xl font-bold text-white">
                {t("core_facts.title")}
              </h2>
              <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <dt className="mb-2 text-sm font-semibold text-slate-300">
                    {t("core_facts.pricing.label")}
                  </dt>
                  <dd className="text-xl font-bold text-green-400">
                    {t.rich("core_facts.pricing.value", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </dd>
                  <dd className="mt-1 text-xs text-slate-400">
                    {t("core_facts.pricing.description")}
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="mb-2 text-sm font-semibold text-slate-300">
                    {t("core_facts.features.label")}
                  </dt>
                  <dd className="text-sm font-medium text-white">
                    {t.rich("core_facts.features.value", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="mb-2 text-sm font-semibold text-slate-300">
                    {t("core_facts.positioning.label")}
                  </dt>
                  <dd className="text-sm font-medium text-white">
                    {t.rich("core_facts.positioning.value", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="mb-2 text-sm font-semibold text-slate-300">
                    {t("core_facts.target_users.label")}
                  </dt>
                  <dd className="text-sm font-medium text-white">
                    {t.rich("core_facts.target_users.value", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        )}

        {/* Features Section */}
        {activeTab === "overview" && (
          <div className="mt-20">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">{t("features.title")}</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">{t("features.subtitle")}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("features.realtime_data.title")}
                </h3>
                <p className="mb-4 text-slate-400">
                  {t.rich("features.realtime_data.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.realtime_data.live_dol", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.realtime_data.priority_date", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.realtime_data.queue_position", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("features.personal_tracking.title")}
                </h3>
                <p className="mb-4 text-slate-400">
                  {t.rich("features.personal_tracking.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.personal_tracking.multi_case", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.personal_tracking.oews_classification", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.personal_tracking.processing_estimates", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("features.trend_analysis.title")}
                </h3>
                <p className="mb-4 text-slate-400">
                  {t.rich("features.trend_analysis.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>{t("features.trend_analysis.interactive_charts")}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>{t("features.trend_analysis.pattern_recognition")}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>{t("features.trend_analysis.future_predictions")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section - SEO Optimized with Semantic Structure */}
        <section className="mt-20" aria-label="How It Works">
          <div className="rounded-xl bg-gradient-to-r from-blue-800 to-purple-700 p-8">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              {t("how_it_works.title")}
            </h2>
            <ol className="grid gap-6 md:grid-cols-3">
              <li className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("how_it_works.step1.title")}
                </h3>
                <p className="text-blue-100">
                  {t.rich("how_it_works.step1.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </li>
              <li className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("how_it_works.step2.title")}
                </h3>
                <p className="text-blue-100">
                  {t.rich("how_it_works.step2.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </li>
              <li className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-600 text-white">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("how_it_works.step3.title")}
                </h3>
                <p className="text-blue-100">
                  {t.rich("how_it_works.step3.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* FAQ Section - SEO Optimized with Semantic Structure */}
        <section className="mt-20 space-y-8" aria-label="Frequently Asked Questions">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">{t("faq.title")}</h2>
          </div>

          <dl className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-6">
              <dt className="mb-3 text-lg font-semibold text-white">
                {t("faq.accuracy.question")}
              </dt>
              <dd className="text-slate-400">
                {t.rich("faq.accuracy.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <dt className="mb-3 text-lg font-semibold text-white">
                {t("faq.security.question")}
              </dt>
              <dd className="text-slate-400">
                {t.rich("faq.security.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <dt className="mb-3 text-lg font-semibold text-white">
                {t("faq.oews_difference.question")}
              </dt>
              <dd className="text-slate-400">
                {t.rich("faq.oews_difference.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <dt className="mb-3 text-lg font-semibold text-white">
                {t("faq.update_frequency.question")}
              </dt>
              <dd className="text-slate-400">
                {t.rich("faq.update_frequency.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </dd>
            </div>
          </dl>
        </section>

        {/* Data Management */}
        {hasUserCases && (
          <div className="mt-12 rounded-xl bg-slate-800/50 p-6 ring-1 ring-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">{t("data_management.title")}</h3>
                <p className="text-sm text-slate-400">{t("data_management.description")}</p>
              </div>
              <button
                onClick={clearAllData}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {t("data_management.clear_all")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
