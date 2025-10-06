"use client"

import { useState, useCallback } from "react"
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
          setError("An unexpected error occurred while processing the data")
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
            <span className="text-sm text-slate-300">Data Source</span>
          </div>

          {/* Configuration status */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-300">Configuration</span>
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
              {loading ? "Processing..." : tableData ? "Ready" : "Waiting"}
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
          <Tooltip content="View Generated Table" position="left">
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
          <Tooltip content="Reset All Data" position="left">
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
            <span className="text-lg font-medium text-blue-300">Processing your data...</span>
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
              <p className="font-medium text-red-300">Processing Failed</p>
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
              <p className="font-medium text-green-300">Table Generated Successfully!</p>
              <p className="text-sm text-green-400">
                {tableData.metadata.totalRows} rows × {tableData.metadata.totalColumns} columns
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
              Lightning Fast JSON Conversion
            </h3>
            <p className="text-slate-400">
              Advanced JSON parsing algorithms ensure rapid conversion from JSON to table format
              without compromising quality or data structure.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Structure Preserved</h3>
            <p className="text-slate-400">
              Intelligent JSON parsing maintains nested object structure, arrays, and data
              relationships when converting JSON to HTML tables.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Privacy First</h3>
            <p className="text-slate-400">
              All JSON to table processing happens locally in your browser. Your JSON data never
              leaves your device during conversion.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-white">
            How to Use Our JSON to Table Converter: Complete Guide
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-white">Input Your JSON Data</h3>
                  <p className="text-slate-400">
                    Paste JSON text, upload JSON files, or fetch from URLs. Our JSON to table
                    converter supports nested objects, arrays, and complex JSON structures for table
                    conversion.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-white">Configure Table Settings</h3>
                  <p className="text-slate-400">
                    Choose output format (HTML, ASCII, JSON), customize table appearance, and set
                    conversion options for optimal JSON to table results.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-white">Automatic JSON Table Generation</h3>
                  <p className="text-slate-400">
                    Our JSON table generator automatically processes your data, converting JSON to
                    table format while preserving structure and relationships.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                  4
                </span>
                <div>
                  <h3 className="font-semibold text-white">Download or Copy Results</h3>
                  <p className="text-slate-400">
                    Download your converted table as HTML, Excel, or ASCII file, or copy the JSON
                    table data to clipboard for immediate use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="rounded-xl bg-slate-800 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Why Convert JSON to Table Format?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-slate-700 p-6">
              <h3 className="mb-3 font-semibold text-white">API Data Visualization</h3>
              <p className="text-slate-400">
                Convert JSON API responses to readable HTML tables for documentation, testing, and
                data analysis. Perfect for REST API data visualization.
              </p>
            </div>
            <div className="rounded-lg bg-slate-700 p-6">
              <h3 className="mb-3 font-semibold text-white">Database Export</h3>
              <p className="text-slate-400">
                Transform JSON database exports into Excel-compatible tables for reporting,
                analysis, and data migration tasks.
              </p>
            </div>
            <div className="rounded-lg bg-slate-700 p-6">
              <h3 className="mb-3 font-semibold text-white">Development & Testing</h3>
              <p className="text-slate-400">
                Convert JSON test data to table format for easier debugging, validation, and sharing
                with team members and stakeholders.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-white">JSON to Table Converter FAQ</h2>
          <div className="space-y-6">
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                What is the best free JSON to table converter?
              </h3>
              <p className="text-slate-400">
                Our JSON to table converter is the best free online tool for converting JSON to
                HTML, ASCII, and Excel table formats. This JSON table generator offers unlimited
                conversions with no registration requirements, subscription fees, or usage limits.
                Convert JSON data to tables as many times as you need.
              </p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                How accurate is JSON to table conversion with this tool?
              </h3>
              <p className="text-slate-400">
                Our JSON to table converter uses advanced parsing algorithms to maintain data
                structure when converting JSON to table format. The JSON table conversion preserves
                nested objects, arrays, and data relationships. Most JSON to table conversions
                achieve 99%+ accuracy in preserving the original data structure.
              </p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                Is this JSON to table converter secure?
              </h3>
              <p className="text-slate-400">
                Yes, our JSON to table converter is completely secure. All JSON table conversion
                happens locally in your browser using client-side JavaScript. When you convert JSON
                to table with our tool, your data never leaves your device, ensuring complete
                privacy and security during the JSON table conversion process.
              </p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                What JSON formats are supported for table conversion?
              </h3>
              <p className="text-slate-400">
                Our JSON table converter supports all valid JSON formats including nested objects,
                arrays, primitive values, and complex data structures. You can convert JSON files,
                JSON strings, or JSON from URLs to table format with full structure preservation.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Can I convert large JSON files to tables?
              </h3>
              <p className="text-slate-400">
                Yes, our JSON to table converter can handle large JSON files efficiently. The tool
                processes JSON data locally in your browser, so conversion speed depends on your
                device performance. For optimal results, we recommend JSON files under 10MB for JSON
                to table conversion.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Benefits */}
        <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Advanced JSON to Table Conversion Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Smart JSON Structure Detection</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  • Automatically detects nested JSON objects and converts to merged table cells
                </li>
                <li>• Preserves JSON array structures in table format</li>
                <li>• Maintains data type information during JSON to table conversion</li>
                <li>• Handles complex JSON hierarchies intelligently</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Multiple Output Formats</h3>
              <ul className="space-y-2 text-slate-400">
                <li>• HTML tables with modern styling and responsive design</li>
                <li>• ASCII tables for command-line and text-based environments</li>
                <li>• Excel-compatible formats for spreadsheet applications</li>
                <li>• JSON output with enhanced structure for further processing</li>
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
                JSON to Table Converter
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                Transform your JSON data into beautiful, readable tables with our modern
                step-by-step wizard.
              </p>
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
                  View Generated Table
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
