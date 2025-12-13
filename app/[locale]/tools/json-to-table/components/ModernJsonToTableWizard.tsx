"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import DataSourceSelector from "./DataSourceSelector"
import ConfigPanel from "./ConfigPanel"
import TableResultModal from "./TableResultModal"
import Tooltip from "./Tooltip"
import {
  type DataSource,
  type TableConfig,
  type TableData,
  type ProcessingError,
  DEFAULT_TABLE_CONFIG,
  JSONParseStatus,
} from "../types"
import { resolveDataSource } from "../lib/data-source"
import { jsonTryParse } from "../lib/json-parser"
import { jsonToTable } from "../lib/table-generator"

export default function ModernJsonToTableWizard() {
  const t = useTranslations("JsonToTable")
  const [dataSource, setDataSource] = useState<DataSource | null>(null)
  const [config, setConfig] = useState<TableConfig>(DEFAULT_TABLE_CONFIG)
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [showResultModal, setShowResultModal] = useState(false)

  // Process data
  const processData = useCallback(
    async (source: DataSource, tableConfig: TableConfig = config) => {
      if (!source.data.trim()) {
        setTableData(null)
        setError("")
        return
      }

      setLoading(true)
      setError("")

      try {
        const rawData = await resolveDataSource(source)
        const parseResult = jsonTryParse(rawData)

        if (parseResult.status === JSONParseStatus.Error) {
          throw parseResult.error
        }

        const table = jsonToTable(parseResult.data, tableConfig)
        setTableData(table)

        // Auto open result modal
        setTimeout(() => {
          setShowResultModal(true)
        }, 300)
      } catch (err) {
        console.error("Processing error:", err)
        if (err && typeof err === "object" && "message" in err) {
          const processingError = err as ProcessingError
          setError(
            `${processingError.message}${processingError.details ? `: ${processingError.details}` : ""}`
          )
        } else {
          setError(t("error_unexpected"))
        }
        setTableData(null)
      } finally {
        setLoading(false)
      }
    },
    [config]
  )

  // Handle data source changes - auto conversion
  const handleDataSourceChange = useCallback(
    (source: DataSource) => {
      setDataSource(source)
      setError("")

      if (source.data.trim()) {
        // Auto process data
        processData(source)
      } else {
        setTableData(null)
      }
    },
    [processData]
  )

  // Handle configuration changes
  const handleConfigChange = useCallback(
    (newConfig: TableConfig) => {
      setConfig(newConfig)
      // If there's data, regenerate table
      if (dataSource && dataSource.data.trim()) {
        processData(dataSource, newConfig)
      }
    },
    [dataSource, processData]
  )

  // Reset all states
  const handleReset = useCallback(() => {
    setDataSource(null)
    setTableData(null)
    setError("")
    setShowResultModal(false)
    setConfig(DEFAULT_TABLE_CONFIG)
  }, [])

  // Status indicator
  const StatusIndicator = () => {
    return (
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm">
          {/* Data source status */}
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                dataSource ? "bg-green-500" : "bg-slate-500"
              }`}
            />
            <span className="text-sm text-slate-300">{t("status_data_source")}</span>
          </div>

          {/* Configuration status */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-300">{t("status_configuration")}</span>
          </div>

          {/* Result status */}
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                tableData
                  ? "animate-pulse bg-emerald-500"
                  : loading
                    ? "animate-spin bg-yellow-500"
                    : "bg-slate-500"
              }`}
            />
            <span className="text-sm text-slate-300">
              {loading
                ? t("status_processing")
                : tableData
                  ? t("status_ready")
                  : t("status_waiting")}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Floating action buttons
  const FloatingActions = () => {
    return (
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3">
        {/* View result button */}
        {tableData && (
          <Tooltip content={t("floating_view_table")} position="left">
            <button
              onClick={() => setShowResultModal(true)}
              className="hover:shadow-3xl group relative overflow-hidden rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-4 text-white shadow-2xl shadow-green-500/25 transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/30 active:scale-95"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative text-2xl">📋</span>

              {/* Pulse animation */}
              <div className="absolute inset-0 animate-ping rounded-full bg-green-500/30"></div>
            </button>
          </Tooltip>
        )}

        {/* Reset button */}
        {(dataSource || tableData) && (
          <Tooltip content={t("floating_reset_all")} position="left">
            <button
              onClick={handleReset}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-slate-600 to-slate-700 p-4 text-white shadow-xl shadow-slate-500/25 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-slate-500/30 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span className="relative text-2xl">🔄</span>
            </button>
          </Tooltip>
        )}
      </div>
    )
  }

  // Status feedback area
  const StatusFeedback = () => {
    if (loading) {
      return (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-8 py-4 backdrop-blur-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500"></div>
            <span className="text-lg font-medium text-blue-300">{t("status_processing_data")}</span>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="mb-8 text-center">
          <div className="inline-flex items-start gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-4 backdrop-blur-sm">
            <span className="text-2xl">❌</span>
            <div className="text-left">
              <p className="font-medium text-red-300">{t("status_processing_failed")}</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )
    }

    if (tableData) {
      return (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-8 py-4 backdrop-blur-sm">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-green-300">{t("status_table_generated")}</p>
              <p className="text-sm text-green-400">
                {t("status_rows_columns", {
                  rows: tableData.metadata.totalRows,
                  columns: tableData.metadata.totalColumns,
                })}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  // SEO Content Sections Component
  const SEOContentSections = () => {
    return (
      <div className="mt-20 space-y-16">
        {/* Features Section */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              {t("feature_lightning_title")}
            </h3>
            <p className="text-slate-400">{t("feature_lightning_description")}</p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              {t("feature_structure_title")}
            </h3>
            <p className="text-slate-400">{t("feature_structure_description")}</p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{t("feature_privacy_title")}</h3>
            <p className="text-slate-400">{t("feature_privacy_description")}</p>
          </div>
        </div>

        {/* How to Use Section */}
        <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("how_to_use_title")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-white">{t("how_to_step1_title")}</h3>
                  <p className="text-slate-400">{t("how_to_step1_description")}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-white">{t("how_to_step2_title")}</h3>
                  <p className="text-slate-400">{t("how_to_step2_description")}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-white">{t("how_to_step3_title")}</h3>
                  <p className="text-slate-400">{t("how_to_step3_description")}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                  4
                </span>
                <div>
                  <h3 className="font-semibold text-white">{t("how_to_step4_title")}</h3>
                  <p className="text-slate-400">{t("how_to_step4_description")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="rounded-xl bg-slate-800 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("why_convert_title")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-slate-700 p-6">
              <h3 className="mb-3 font-semibold text-white">{t("why_convert_api_title")}</h3>
              <p className="text-slate-400">{t("why_convert_api_description")}</p>
            </div>
            <div className="rounded-lg bg-slate-700 p-6">
              <h3 className="mb-3 font-semibold text-white">{t("why_convert_database_title")}</h3>
              <p className="text-slate-400">{t("why_convert_database_description")}</p>
            </div>
            <div className="rounded-lg bg-slate-700 p-6">
              <h3 className="mb-3 font-semibold text-white">
                {t("why_convert_development_title")}
              </h3>
              <p className="text-slate-400">{t("why_convert_development_description")}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("faq_title")}</h2>
          <div className="space-y-6">
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">{t("faq_best_converter_q")}</h3>
              <p className="text-slate-400">{t("faq_best_converter_a")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">{t("faq_accuracy_q")}</h3>
              <p className="text-slate-400">{t("faq_accuracy_a")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">{t("faq_secure_q")}</h3>
              <p className="text-slate-400">{t("faq_secure_a")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">{t("faq_formats_q")}</h3>
              <p className="text-slate-400">{t("faq_formats_a")}</p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">{t("faq_large_files_q")}</h3>
              <p className="text-slate-400">{t("faq_large_files_a")}</p>
            </div>
          </div>
        </section>

        {/* Technical Benefits */}
        <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("advanced_features_title")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {t("advanced_features_detection_title")}
              </h3>
              <ul className="space-y-2 text-slate-400">
                <li>• {t("advanced_features_detection_1")}</li>
                <li>• {t("advanced_features_detection_2")}</li>
                <li>• {t("advanced_features_detection_3")}</li>
                <li>• {t("advanced_features_detection_4")}</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {t("advanced_features_output_title")}
              </h3>
              <ul className="space-y-2 text-slate-400">
                <li>• {t("advanced_features_output_1")}</li>
                <li>• {t("advanced_features_output_2")}</li>
                <li>• {t("advanced_features_output_3")}</li>
                <li>• {t("advanced_features_output_4")}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="text-center">
              <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-6xl font-bold text-transparent">
                {t("title")}
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">{t("subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Status Indicator */}
          <StatusIndicator />

          {/* Status Feedback */}
          <StatusFeedback />

          {/* Parallel Layout: Data Source + Configuration */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Data Source Module */}
            <div className="animate-in fade-in-50 slide-in-from-left-5 duration-500">
              <DataSourceSelector onDataChange={handleDataSourceChange} loading={loading} />
            </div>

            {/* Configuration Module */}
            <div className="animate-in fade-in-50 slide-in-from-right-5 duration-500">
              <ConfigPanel config={config} onConfigChange={handleConfigChange} />
            </div>
          </div>

          {/* Action Button Area */}
          {tableData && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setShowResultModal(true)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-green-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                <span className="relative flex items-center gap-2">
                  <span>👁️</span>
                  {t("button_view_table")}
                </span>
              </button>
            </div>
          )}

          {/* SEO Content Sections - Only show when no result */}
          {!tableData && !loading && <SEOContentSections />}
        </div>

        {/* Floating Action Buttons */}
        <FloatingActions />

        {/* Result Modal */}
        <TableResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          tableData={tableData}
          format={config.format}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
