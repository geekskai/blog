"use client"

import React, { useState, useCallback, useEffect } from "react"
import {
  Shuffle,
  Copy,
  Download,
  Check,
  RotateCcw,
  Eye,
  EyeOff,
  Hash,
  Settings,
  TrendingUp,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { NumberGenerator, NumberExporter, NumberStats } from "../utils/numberGenerator"
import { NumberGeneratorState, NumberFormat, ExclusionRules } from "../types"

const NumberGeneratorComponent = () => {
  const t = useTranslations("Random4DigitNumberGenerator.generator")
  const [state, setState] = useState<NumberGeneratorState>({
    generatedNumber: "",
    isGenerating: false,
    batchCount: 10,
    generatedBatch: [],
    exportFormat: "txt",
    allowDuplicates: true,
    showHistory: false,
    rangeStart: 0,
    rangeEnd: 9999,
    format: "plain",
    exclusionRules: {
      excludeSequential: false,
      excludeRepeated: false,
      excludeSpecific: [],
    },
  })

  const [copiedNumber, setCopiedNumber] = useState<string | null>(null)
  const [showBatch, setShowBatch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("number-generator-history")
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory))
        } catch (e) {
          console.error("Failed to load history:", e)
        }
      }
    }
  }, [])

  // Save to history
  const addToHistory = useCallback((number: string) => {
    setHistory((prev) => {
      const newHistory = [number, ...prev.filter((n) => n !== number)].slice(0, 10)
      if (typeof window !== "undefined") {
        localStorage.setItem("number-generator-history", JSON.stringify(newHistory))
      }
      return newHistory
    })
  }, [])

  // Generate single number
  const generateSingle = useCallback(() => {
    setState((prev) => ({ ...prev, isGenerating: true }))

    setTimeout(() => {
      const number = NumberGenerator.generate({
        rangeStart: state.rangeStart,
        rangeEnd: state.rangeEnd,
        exclusionRules: state.exclusionRules,
        format: {
          type: state.format,
          prefix: state.format === "prefix" ? "#" : undefined,
        },
      })

      const formatted = NumberGenerator.formatNumber(number, {
        type: state.format,
        prefix: "#",
      })

      setState((prev) => ({
        ...prev,
        generatedNumber: formatted,
        isGenerating: false,
      }))

      addToHistory(number)
    }, 150)
  }, [state.rangeStart, state.rangeEnd, state.exclusionRules, state.format, addToHistory])

  // Generate batch
  const generateBatch = useCallback(() => {
    setState((prev) => ({ ...prev, isGenerating: true }))

    setTimeout(() => {
      const batch = NumberGenerator.generateBatch({
        count: state.batchCount,
        rangeStart: state.rangeStart,
        rangeEnd: state.rangeEnd,
        allowDuplicates: state.allowDuplicates,
        exclusionRules: state.exclusionRules,
      })

      const formattedBatch = batch.map((num) =>
        NumberGenerator.formatNumber(num, {
          type: state.format,
          prefix: "#",
        })
      )

      setState((prev) => ({
        ...prev,
        generatedBatch: formattedBatch,
        isGenerating: false,
      }))
      setShowBatch(true)
      setShowStats(true)
    }, 300)
  }, [
    state.batchCount,
    state.rangeStart,
    state.rangeEnd,
    state.allowDuplicates,
    state.exclusionRules,
    state.format,
  ])

  // Copy to clipboard
  const copyNumber = useCallback(async (number: string) => {
    try {
      await navigator.clipboard.writeText(number)
      setCopiedNumber(number)
      setTimeout(() => setCopiedNumber(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])

  // Export data
  const exportData = useCallback(() => {
    if (state.generatedBatch.length === 0) return

    const plainNumbers = state.generatedBatch.map((num) => NumberGenerator.parseFormatted(num))

    let content = ""
    let filename = ""

    switch (state.exportFormat) {
      case "txt":
        content = NumberExporter.toTXT(plainNumbers)
        filename = `4-digit-numbers-${Date.now()}.txt`
        break
      case "csv":
        content = NumberExporter.toCSV(plainNumbers, true)
        filename = `4-digit-numbers-${Date.now()}.csv`
        break
      case "json":
        content = NumberExporter.toJSON(plainNumbers, true)
        filename = `4-digit-numbers-${Date.now()}.json`
        break
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [state.generatedBatch, state.exportFormat])

  // Reset all
  const resetAll = useCallback(() => {
    setState({
      generatedNumber: "",
      isGenerating: false,
      batchCount: 10,
      generatedBatch: [],
      exportFormat: "txt",
      allowDuplicates: true,
      showHistory: false,
      rangeStart: 0,
      rangeEnd: 9999,
      format: "plain",
      exclusionRules: {
        excludeSequential: false,
        excludeRepeated: false,
        excludeSpecific: [],
      },
    })
    setShowBatch(false)
    setShowStats(false)
    setCopiedNumber(null)
  }, [])

  // Calculate statistics
  const stats =
    state.generatedBatch.length > 0
      ? NumberStats.calculateStats(
          state.generatedBatch.map((num) => NumberGenerator.parseFormatted(num))
        )
      : null

  return (
    <div className="space-y-6">
      {/* === Single Number Generator === */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-purple-900/20 to-indigo-900/25 p-4 shadow-2xl backdrop-blur-xl sm:p-6 md:p-8">
        {/* Decorative background elements */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl"></div>

        <div className="relative">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 backdrop-blur-sm md:gap-3 md:px-6 md:py-3">
              <Hash className="h-5 w-5 text-blue-400 md:h-6 md:w-6" />
              <h3 className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
                {t("single_title")}
              </h3>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="to-white/2 group relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-white/5 px-4 py-2 transition-all duration-300 hover:border-white/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center gap-2">
                <Settings className="h-4 w-4 text-slate-300" />
                <span className="text-sm text-slate-300">
                  {showSettings ? t("settings_hide") : t("settings_show")}
                </span>
              </div>
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 backdrop-blur-sm md:p-6">
              <h4 className="mb-4 text-lg font-semibold text-white">{t("settings_panel.title")}</h4>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Range Settings */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t("settings_panel.range_label")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="9999"
                      value={state.rangeStart}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          rangeStart: Math.max(0, Math.min(9999, parseInt(e.target.value) || 0)),
                        }))
                      }
                      className="w-full rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-white backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    />
                    <span className="flex items-center text-slate-400">-</span>
                    <input
                      type="number"
                      min="0"
                      max="9999"
                      value={state.rangeEnd}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          rangeEnd: Math.max(0, Math.min(9999, parseInt(e.target.value) || 9999)),
                        }))
                      }
                      className="w-full rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-white backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t("settings_panel.format_label")}
                  </label>
                  <select
                    value={state.format}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, format: e.target.value as NumberFormat }))
                    }
                    className="w-full rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-white backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    <option value="plain">{t("settings_panel.format_plain")}</option>
                    <option value="hyphen">{t("settings_panel.format_hyphen")}</option>
                    <option value="dot">{t("settings_panel.format_dot")}</option>
                    <option value="prefix">{t("settings_panel.format_prefix")}</option>
                  </select>
                </div>

                {/* Exclusion Rules */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    {t("settings_panel.exclusion_rules_label")}
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={state.exclusionRules.excludeSequential}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            exclusionRules: {
                              ...prev.exclusionRules,
                              excludeSequential: e.target.checked,
                            },
                          }))
                        }
                        className="rounded border-blue-500/30 bg-blue-500/10 text-blue-500 focus:ring-blue-500/20"
                      />
                      <span className="text-sm text-slate-300">
                        {t("settings_panel.exclude_sequential")}
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={state.exclusionRules.excludeRepeated}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            exclusionRules: {
                              ...prev.exclusionRules,
                              excludeRepeated: e.target.checked,
                            },
                          }))
                        }
                        className="rounded border-blue-500/30 bg-blue-500/10 text-blue-500 focus:ring-blue-500/20"
                      />
                      <span className="text-sm text-slate-300">
                        {t("settings_panel.exclude_repeated")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Number Display */}
          <div className="mb-6">
            <div className="relative">
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border-2 border-dashed border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/5 p-4 backdrop-blur-sm md:min-h-[200px] md:p-8">
                {state.generatedNumber ? (
                  <div className="text-center">
                    <div className="mb-2 font-mono text-4xl font-bold text-transparent sm:text-5xl md:mb-4 md:text-6xl">
                      <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                        {state.generatedNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 md:text-sm">
                      {t("display.crypto_secure")}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Hash className="mx-auto mb-3 h-12 w-12 text-slate-600 md:mb-4 md:h-16 md:w-16" />
                    <div className="mb-2 text-xl font-medium">{t("display.click_generate")}</div>
                    <div className="text-sm">{t("display.features")}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Single Number Controls */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={generateSingle}
              disabled={state.isGenerating}
              className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-3 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 disabled:opacity-50 md:px-8 md:py-4 md:text-lg"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative flex items-center justify-center gap-2">
                <Shuffle
                  className={`h-4 w-4 md:h-5 md:w-5 ${state.isGenerating ? "animate-spin" : ""}`}
                />
                {state.isGenerating ? t("buttons.generating") : t("buttons.generate")}
              </span>
            </button>

            {state.generatedNumber && (
              <button
                onClick={() => copyNumber(state.generatedNumber)}
                className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-blue-500/10 px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 md:px-6 md:py-4"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center gap-2 text-white">
                  {copiedNumber === state.generatedNumber ? (
                    <>
                      <Check className="h-5 w-5 text-green-400" />
                      {t("buttons.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      {t("buttons.copy")}
                    </>
                  )}
                </span>
              </button>
            )}
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-300">{t("history.title")}</h4>
                <button
                  onClick={() => {
                    setHistory([])
                    localStorage.removeItem("number-generator-history")
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  {t("history.clear")}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.slice(0, 5).map((num, index) => (
                  <button
                    key={index}
                    onClick={() => copyNumber(num)}
                    className="rounded-lg bg-slate-800/50 px-3 py-1 font-mono text-sm text-slate-300 transition-colors hover:bg-slate-700/50"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === Batch Generator === */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-900/25 via-teal-900/20 to-cyan-900/25 p-4 shadow-2xl backdrop-blur-xl sm:p-6 md:p-8">
        {/* Decorative background */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl"></div>

        <div className="relative">
          {/* Header */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-2 backdrop-blur-sm md:gap-3 md:px-6 md:py-3">
            <TrendingUp className="h-5 w-5 text-emerald-400 md:h-6 md:w-6" />
            <h3 className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
              {t("bulk.title")}
            </h3>
          </div>

          {/* Batch Settings */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t("bulk.number_of_items")}
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={state.batchCount}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    batchCount: Math.max(1, Math.min(1000, parseInt(e.target.value) || 10)),
                  }))
                }
                className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-white backdrop-blur-sm transition-all duration-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t("bulk.export_format")}
              </label>
              <select
                value={state.exportFormat}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    exportFormat: e.target.value as "txt" | "csv" | "json",
                  }))
                }
                className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-white backdrop-blur-sm transition-all duration-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              >
                <option value="txt">{t("bulk.format_txt")}</option>
                <option value="csv">{t("bulk.format_csv")}</option>
                <option value="json">{t("bulk.format_json")}</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.allowDuplicates}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, allowDuplicates: e.target.checked }))
                  }
                  className="rounded border-emerald-500/30 bg-emerald-500/10 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="text-sm text-slate-300">{t("bulk.allow_duplicates")}</span>
              </label>
            </div>
          </div>

          {/* Batch Controls */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={generateBatch}
              disabled={state.isGenerating}
              className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-3 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/30 disabled:opacity-50 md:px-8 md:py-4 md:text-lg"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative flex items-center justify-center gap-2">
                <Shuffle
                  className={`h-4 w-4 md:h-5 md:w-5 ${state.isGenerating ? "animate-spin" : ""}`}
                />
                {state.isGenerating
                  ? t("buttons.generating")
                  : t("bulk.generate_button", { count: state.batchCount })}
              </span>
            </button>

            {state.generatedBatch.length > 0 && (
              <>
                <button
                  onClick={exportData}
                  className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-emerald-500/10 px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 md:px-6 md:py-4"
                >
                  <span className="relative flex items-center gap-2 text-white">
                    <Download className="h-5 w-5" />
                    {t("buttons.export")}
                  </span>
                </button>

                <button
                  onClick={() => setShowBatch(!showBatch)}
                  className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-emerald-500/10 px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 md:px-6 md:py-4"
                >
                  <span className="relative flex items-center gap-2 text-white">
                    {showBatch ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    {showBatch ? t("buttons.hide") : t("buttons.show")}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Statistics */}
          {showStats && stats && (
            <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-4 backdrop-blur-sm sm:grid-cols-3 md:p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{stats.totalGenerated}</div>
                <div className="text-sm text-slate-400">{t("stats.total_generated")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400">{stats.uniqueCount}</div>
                <div className="text-sm text-slate-400">{t("stats.unique_numbers")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">
                  {stats.averageValue.toFixed(0)}
                </div>
                <div className="text-sm text-slate-400">{t("stats.average_value")}</div>
              </div>
            </div>
          )}

          {/* Batch Results */}
          {showBatch && state.generatedBatch.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-300">
                  {t("bulk.results_title", { count: state.generatedBatch.length })}
                </h4>
                <div className="text-xs text-slate-500">{t("bulk.click_to_copy")}</div>
              </div>
              <div className="max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-4 backdrop-blur-sm">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {state.generatedBatch.map((number, index) => (
                    <button
                      key={index}
                      onClick={() => copyNumber(number)}
                      className="group relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-3 text-left font-mono text-lg transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative flex items-center justify-between">
                        <span className="text-slate-200">{number}</span>
                        {copiedNumber === number && <Check className="h-4 w-4 text-green-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      {(state.generatedNumber || state.generatedBatch.length > 0) && (
        <div className="text-center">
          <button
            onClick={resetAll}
            className="to-white/2 group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 px-6 py-3 transition-all duration-300 hover:border-white/40 md:px-8 md:py-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <RotateCcw className="relative h-5 w-5 text-slate-300" />
            <span className="relative text-slate-300">{t("buttons.reset_all")}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default NumberGeneratorComponent
