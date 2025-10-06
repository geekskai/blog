"use client"

import { useState } from "react"
import type { ConversionResult } from "../types"
import {
  copyConversionResult,
  exportConversionHistory,
  downloadExportedData,
} from "../utils/clipboard"

interface ConversionHistoryProps {
  history: ConversionResult[]
  onClearHistory: () => void
  onSelectConversion?: (result: ConversionResult) => void
  className?: string
}

export default function ConversionHistory({
  history,
  onClearHistory,
  onSelectConversion,
  className = "",
}: ConversionHistoryProps) {
  const [copyMessage, setCopyMessage] = useState<string>("")
  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "txt">("csv")

  // Handle copy individual result
  const handleCopyResult = async (result: ConversionResult) => {
    const copyResult = await copyConversionResult(result, "both")
    setCopyMessage(copyResult.message)
    setTimeout(() => setCopyMessage(""), 2000)
  }

  // Handle export history
  const handleExport = () => {
    if (history.length === 0) {
      setCopyMessage("No conversions to export")
      setTimeout(() => setCopyMessage(""), 2000)
      return
    }

    try {
      const exportData = exportConversionHistory(history, exportFormat)
      downloadExportedData(exportData.content, exportData.filename, exportData.mimeType)
      setCopyMessage(`Exported ${history.length} conversions as ${exportFormat.toUpperCase()}`)
      setTimeout(() => setCopyMessage(""), 3000)
    } catch (error) {
      setCopyMessage("Export failed")
      setTimeout(() => setCopyMessage(""), 2000)
    }
  }

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (history.length === 0) {
    return (
      <div
        className={`relative overflow-hidden rounded-3xl border border-slate-500/30 bg-gradient-to-br from-slate-500/25 via-slate-500/20 to-slate-600/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
      >
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-slate-500/30 bg-gradient-to-r from-slate-500/10 to-slate-600/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">📊</span>
            <h2 className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-2xl font-bold text-transparent">
              Conversion History
            </h2>
          </div>
          <p className="text-slate-400">
            No conversions yet. Start converting to see your history here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/25 via-emerald-500/20 to-teal-500/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-emerald-500/15 blur-3xl"></div>

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">📊</span>
            <h2 className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-2xl font-bold text-transparent">
              Conversion History
            </h2>
            <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">
              {history.length}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Export format selector */}
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as "csv" | "json" | "txt")}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-white backdrop-blur-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="txt">TXT</option>
            </select>

            <button
              onClick={handleExport}
              className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition-all duration-300 hover:bg-blue-500/20 hover:text-white"
            >
              📥 Export
            </button>

            <button
              onClick={onClearHistory}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all duration-300 hover:bg-red-500/20 hover:text-white"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Copy message */}
        {copyMessage && (
          <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center text-green-300">
            <span className="text-sm">✅ {copyMessage}</span>
          </div>
        )}

        {/* History list */}
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {history
            .slice()
            .reverse()
            .map((result, index) => (
              <div
                key={`${result.timestamp.getTime()}-${index}`}
                className="group rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-emerald-500/10"
              >
                <div className="flex items-center justify-between">
                  {/* Conversion details */}
                  <div
                    className="flex-1 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSelectConversion?.(result)
                      }
                    }}
                    onClick={() => onSelectConversion?.(result)}
                    aria-label="Select conversion"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white">{result.input}</span>
                      <span className="text-slate-400">=</span>
                      <span className="font-mono text-emerald-300">{result.formatted}"</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {formatTimestamp(result.timestamp)}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={() => handleCopyResult(result)}
                      className="rounded-lg bg-blue-500/20 p-2 text-blue-300 transition-all duration-300 hover:bg-blue-500/30 hover:text-white"
                      title="Copy result"
                    >
                      📋
                    </button>

                    {onSelectConversion && (
                      <button
                        onClick={() => onSelectConversion(result)}
                        className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300 transition-all duration-300 hover:bg-emerald-500/30 hover:text-white"
                        title="Use this conversion"
                      >
                        ↩️
                      </button>
                    )}
                  </div>
                </div>

                {/* Show equivalents if available */}
                {result.commonEquivalents.length > 0 && (
                  <div className="mt-2 text-xs text-slate-400">
                    <span>Equivalents: </span>
                    {result.commonEquivalents.slice(0, 3).map((frac, i) => (
                      <span key={i}>
                        {i > 0 && ", "}
                        {frac.numerator}/{frac.denominator}
                      </span>
                    ))}
                    {result.commonEquivalents.length > 3 && "..."}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-white">{history.length}</div>
            <div className="text-xs text-slate-300">Total Conversions</div>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-white">
              {history.filter((h) => h.fraction !== null).length}
            </div>
            <div className="text-xs text-slate-300">Fraction Inputs</div>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-white">
              {new Set(history.map((h) => h.input)).size}
            </div>
            <div className="text-xs text-slate-300">Unique Values</div>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-white">
              {Math.max(...history.map((h) => h.decimal)).toFixed(2)}"
            </div>
            <div className="text-xs text-slate-300">Largest Value</div>
          </div>
        </div>

        {/* Usage tips */}
        <div className="mt-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <h4 className="mb-2 text-sm font-semibold text-emerald-300">💡 History Tips</h4>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Click on any conversion to reuse it</li>
            <li>• Export your history for project documentation</li>
            <li>• History is saved locally in your browser</li>
            <li>• Use the copy button to quickly share results</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
