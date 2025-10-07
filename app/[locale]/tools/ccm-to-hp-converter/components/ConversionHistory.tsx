"use client"

import React, { useState, useEffect } from "react"
import { History, X, RotateCcw } from "lucide-react"
import { getConversionHistory, clearConversionHistory } from "../utils/converter"
import type { ConversionResult } from "../types"
import { useTranslations } from "next-intl"

interface ConversionHistoryProps {
  onSelectConversion?: (result: ConversionResult) => void
}

export default function ConversionHistory({ onSelectConversion }: ConversionHistoryProps) {
  const [history, setHistory] = useState<ConversionResult[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const t = useTranslations("CcmToHpConverter")

  // Load history on component mount
  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = getConversionHistory()
      setHistory(savedHistory)
    }

    loadHistory()

    // Listen for storage changes (when new conversions are saved)
    const handleStorageChange = () => {
      loadHistory()
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for same-tab updates
    window.addEventListener("conversionSaved", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("conversionSaved", handleStorageChange)
    }
  }, [])

  // Handle clear history
  const handleClearHistory = () => {
    clearConversionHistory()
    setHistory([])
  }

  // Handle select conversion
  const handleSelectConversion = (result: ConversionResult) => {
    if (onSelectConversion) {
      onSelectConversion(result)
    }
    setIsOpen(false)
  }

  // Format conversion for display
  const formatConversion = (result: ConversionResult): string => {
    return `${result.input} ${result.inputUnit} → ${result.output} ${result.outputUnit}`
  }

  if (history.length === 0) {
    return null // Don't show if no history
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-300 transition-all duration-300 hover:border-blue-400 hover:bg-blue-500/20"
      >
        <History className="h-4 w-4" />
        <span>
          {t("history.title")} ({history.length})
        </span>
      </button>

      {/* History Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{t("history.title")}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
                title={t("history.clear_history")}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-slate-700/50 p-2 text-slate-400 transition-colors hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* History List */}
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {history.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelectConversion(result)}
                className="group w-full rounded-lg bg-slate-800/30 p-3 text-left transition-all duration-300 hover:bg-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{formatConversion(result)}</div>
                    <div className="text-xs text-slate-400">{result.engineConfig.description}</div>
                  </div>
                  <div className="text-xs text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                    {t("history.click_to_use")}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 border-t border-white/10 pt-3 text-center">
            <p className="text-xs text-slate-500">{t("history.recent_conversions_saved")}</p>
          </div>
        </div>
      )}
    </div>
  )
}
