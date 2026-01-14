"use client"

import React, { useState } from "react"
import {
  FileText,
  Globe,
  Code,
  Zap,
  Shield,
  Download,
  Settings,
  History,
  Home,
  ChevronRight,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useHtmlConverter } from "./hooks/useHtmlConverter"
import { useConversionHistory } from "./hooks/useConversionHistory"
import InputPanel from "./components/InputPanel"
import PreviewPanel from "./components/PreviewPanel"
import ConversionHistory from "./components/ConversionHistory"

export default function HtmlToMarkdownConverter() {
  const t = useTranslations("HtmlToMarkdown")
  const [activeTab, setActiveTab] = useState<"url" | "html">("url")
  const [showHistory, setShowHistory] = useState(false)
  const [showFeatures, setShowFeatures] = useState(true)

  const {
    convert,
    convertMultiple,
    isConverting,
    result,
    batchProgress,
    options,
    updateOptions,
    error,
    resetConverter,
  } = useHtmlConverter()

  const { history, addToHistory, addMultipleToHistory, clearHistory, downloadHistory, hasHistory } =
    useConversionHistory()

  const handleSingleConversion = async (input: string) => {
    const conversionResult = await convert(input, activeTab)
    if (conversionResult) {
      addToHistory(conversionResult)
    }
  }

  const handleBatchConversion = async (inputs: string[]) => {
    const results = await convertMultiple(inputs, activeTab)
    addMultipleToHistory(results)
  }

  const handleHistoryItemSelect = (item: any) => {
    // This could be used to load a previous conversion into the preview
    console.log("Selected history item:", item)
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
            <a href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="hover:text-slate-200">
              {t("breadcrumb.tools")}
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">
            {t("breadcrumb.html_to_markdown_converter")}
          </li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <FileText className="mr-2 h-4 w-4" />
            {t("header.badge")}
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
            {t("header.main_title")}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">{t("header.description")}</p>

          {/* Core Facts Section - Optimized for AI Retrieval */}
          <section className="mx-auto mb-8 max-w-4xl rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-center text-xl font-semibold text-white">
              {t("core_facts.title")}
            </h2>
            <dl className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="mb-1 font-semibold text-slate-300">
                  {t("core_facts.pricing_label")}
                </dt>
                <dd className="text-white">
                  {t.rich("core_facts.pricing_value", {
                    strong: (chunks) => <strong className="text-green-400">{chunks}</strong>,
                  })}
                </dd>
              </div>
              <div>
                <dt className="mb-1 font-semibold text-slate-300">
                  {t("core_facts.main_features_label")}
                </dt>
                <dd className="text-white">
                  {t.rich("core_facts.main_features_value", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </dd>
              </div>
              <div>
                <dt className="mb-1 font-semibold text-slate-300">
                  {t("core_facts.positioning_label")}
                </dt>
                <dd className="text-white">
                  {t.rich("core_facts.positioning_value", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </dd>
              </div>
              <div>
                <dt className="mb-1 font-semibold text-slate-300">
                  {t("core_facts.target_users_label")}
                </dt>
                <dd className="text-white">
                  {t.rich("core_facts.target_users_value", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </dd>
              </div>
            </dl>
          </section>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="font-medium">
                {t.rich("quick_stats.lightning_fast", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {t.rich("quick_stats.privacy_focused", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Download className="h-4 w-4 text-purple-500" />
              <span className="font-medium">
                {t.rich("quick_stats.no_registration", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-900/20 p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <p className="text-red-300">{error}</p>
              <button
                onClick={resetConverter}
                className="ml-auto text-sm text-red-400 hover:text-red-300"
              >
                {t("errors.dismiss")}
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <InputPanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSingleConversion={handleSingleConversion}
              onBatchConversion={handleBatchConversion}
              isConverting={isConverting}
              batchProgress={batchProgress}
            />

            {/* History Toggle */}
            {hasHistory && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex w-full items-center justify-between rounded-lg bg-slate-800/80 p-4 ring-1 ring-slate-700 backdrop-blur-sm hover:bg-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <History className="h-5 w-5 text-slate-400" />
                    <span className="text-white">{t("history.title")}</span>
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                      {t("history.count", { count: history.length })}
                    </span>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 text-slate-400 transition-transform ${showHistory ? "rotate-90" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7">
            <PreviewPanel result={result} options={options} onOptionsChange={updateOptions} />
          </div>
        </div>

        {/* History Section */}
        {showHistory && hasHistory && (
          <div className="mt-8">
            <ConversionHistory
              history={history}
              onClear={clearHistory}
              onDownload={downloadHistory}
              onItemSelect={handleHistoryItemSelect}
            />
          </div>
        )}

        {/* Features Section */}
        {showFeatures && (
          <div className="mt-20">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">{t("features.title")}</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                {t("features.description")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("features.url_processing.title")}
                </h3>
                <p className="mb-4 text-slate-400">
                  {t.rich("features.url_processing.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.url_processing.batch_processing", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.url_processing.smart_extraction", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.url_processing.url_validation", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Code className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("features.html_processing.title")}
                </h3>
                <p className="mb-4 text-slate-400">
                  {t.rich("features.html_processing.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.html_processing.table_conversion", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.html_processing.code_block_detection", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.html_processing.image_preservation", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <Settings className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("features.customizable_output.title")}
                </h3>
                <p className="mb-4 text-slate-400">
                  {t.rich("features.customizable_output.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.customizable_output.heading_style_options", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.customizable_output.list_marker_choices", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {t.rich("features.customizable_output.format_preferences", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="mt-20">
          <div className="rounded-xl bg-gradient-to-r from-blue-800 to-purple-700 p-8">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              {t("how_it_works.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("how_it_works.step_1.title")}
                </h3>
                <p className="text-blue-100">
                  {t.rich("how_it_works.step_1.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("how_it_works.step_2.title")}
                </h3>
                <p className="text-blue-100">
                  {t.rich("how_it_works.step_2.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-600 text-white">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("how_it_works.step_3.title")}
                </h3>
                <p className="text-blue-100">
                  {t.rich("how_it_works.step_3.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section - Enhanced for SEO */}
        <section className="mt-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{t("use_cases.title")}</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">{t("use_cases.description")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("use_cases.web_development.title")}
              </h3>
              <p className="text-slate-400">
                {t.rich("use_cases.web_development.description", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("use_cases.content_migration.title")}
              </h3>
              <p className="text-slate-400">
                {t.rich("use_cases.content_migration.description", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("use_cases.blog_publishing.title")}
              </h3>
              <p className="text-slate-400">
                {t.rich("use_cases.blog_publishing.description", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("use_cases.documentation_sites.title")}
              </h3>
              <p className="text-slate-400">
                {t.rich("use_cases.documentation_sites.description", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("use_cases.email_to_markdown.title")}
              </h3>
              <p className="text-slate-400">
                {t.rich("use_cases.email_to_markdown.description", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-rose-500/10 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("use_cases.api_documentation.title")}
              </h3>
              <p className="text-slate-400">
                {t.rich("use_cases.api_documentation.description", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="mt-20 space-y-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">{t("faq.title")}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">{t("faq.is_free.question")}</h3>
              <p className="text-slate-400">
                {t.rich("faq.is_free.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("faq.html_elements.question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("faq.html_elements.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("faq.multiple_urls.question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("faq.multiple_urls.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("faq.customize_output.question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("faq.customize_output.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("faq.data_security.question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("faq.data_security.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("faq.conversion_speed.question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("faq.conversion_speed.answer", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
