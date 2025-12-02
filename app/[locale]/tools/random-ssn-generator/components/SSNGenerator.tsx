"use client"

import React, { useState, useCallback } from "react"
import { Shuffle, Copy, Download, Check, RotateCcw, Eye, EyeOff, Info } from "lucide-react"
import { useTranslations } from "next-intl"
import { SSNGeneratorState } from "../types"
import { SSNGenerator, SSNExporter } from "../utils/ssnGenerator"

const SSNGeneratorComponent = () => {
  const t = useTranslations("RandomSSNGenerator")
  const [state, setState] = useState<SSNGeneratorState>({
    generatedSSN: "",
    isGenerating: false,
    batchCount: 10,
    generatedBatch: [],
    exportFormat: "txt",
    includeValidation: true,
    showStructure: false,
  })

  const [copiedSSN, setCopiedSSN] = useState<string | null>(null)
  const [showBatch, setShowBatch] = useState(false)

  // Generate single SSN
  const generateSingle = useCallback(() => {
    setState((prev) => ({ ...prev, isGenerating: true }))

    // Simulate slight delay for better UX
    setTimeout(() => {
      const newSSN = SSNGenerator.generate()
      setState((prev) => ({
        ...prev,
        generatedSSN: newSSN,
        isGenerating: false,
      }))
    }, 150)
  }, [])

  // Generate batch of SSNs
  const generateBatch = useCallback(() => {
    setState((prev) => ({ ...prev, isGenerating: true }))

    setTimeout(() => {
      const batch = SSNGenerator.generateBatch({ count: state.batchCount })
      setState((prev) => ({
        ...prev,
        generatedBatch: batch,
        isGenerating: false,
      }))
      setShowBatch(true)
    }, 300)
  }, [state.batchCount])

  // Copy single SSN to clipboard
  const copySSN = useCallback(async (ssn: string) => {
    try {
      await navigator.clipboard.writeText(ssn)
      setCopiedSSN(ssn)
      setTimeout(() => setCopiedSSN(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])

  // Export batch data
  const exportData = useCallback(() => {
    if (state.generatedBatch.length === 0) return

    let content = ""
    let filename = ""

    switch (state.exportFormat) {
      case "txt":
        content = SSNExporter.toTXT(state.generatedBatch)
        filename = `ssn-batch-${Date.now()}.txt`
        break
      case "csv":
        content = SSNExporter.toCSV(state.generatedBatch, state.includeValidation)
        filename = `ssn-batch-${Date.now()}.csv`
        break
      case "json":
        content = SSNExporter.toJSON(state.generatedBatch, state.includeValidation)
        filename = `ssn-batch-${Date.now()}.json`
        break
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [state.generatedBatch, state.exportFormat, state.includeValidation])

  // Reset all data
  const resetAll = useCallback(() => {
    setState({
      generatedSSN: "",
      isGenerating: false,
      batchCount: 10,
      generatedBatch: [],
      exportFormat: "txt",
      includeValidation: true,
      showStructure: false,
    })
    setShowBatch(false)
    setCopiedSSN(null)
  }, [])

  // Get SSN structure breakdown
  const getSSNStructure = useCallback((ssn: string) => {
    if (!ssn) return null
    const validation = SSNGenerator.validate(ssn)
    return validation.structure
  }, [])

  return (
    <div className="space-y-6">
      {/* Single SSN Generator */}
      <div className="rounded-xl bg-slate-800 p-6 shadow-xl ring-1 ring-slate-700">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{t("generator_single_title")}</h3>
          <button
            onClick={() => setState((prev) => ({ ...prev, showStructure: !prev.showStructure }))}
            className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-600"
          >
            {state.showStructure ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {state.showStructure ? t("generator_hide_structure") : t("generator_show_structure")}
          </button>
        </div>

        {/* Generated SSN Display */}
        <div className="mb-6">
          <div className="relative">
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 p-8">
              {state.generatedSSN ? (
                <div className="text-center">
                  <div className="mb-2 font-mono text-3xl font-bold text-blue-300">
                    {state.generatedSSN}
                  </div>
                  {state.showStructure && (
                    <div className="text-sm text-slate-400">
                      <div className="flex items-center justify-center gap-4">
                        <span>
                          {t("generator_area")}:{" "}
                          <strong>{getSSNStructure(state.generatedSSN)?.area}</strong>
                        </span>
                        <span>
                          {t("generator_group")}:{" "}
                          <strong>{getSSNStructure(state.generatedSSN)?.group}</strong>
                        </span>
                        <span>
                          {t("generator_serial")}:{" "}
                          <strong>{getSSNStructure(state.generatedSSN)?.serial}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <div className="mb-2 text-lg">{t("generator_placeholder")}</div>
                  <div className="text-sm">{t("generator_format_hint")}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Single SSN Controls */}
        <div className="flex gap-3">
          <button
            onClick={generateSingle}
            disabled={state.isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50"
          >
            <Shuffle className={`h-4 w-4 ${state.isGenerating ? "animate-spin" : ""}`} />
            {state.isGenerating ? t("generator_generating") : t("generator_generate_button")}
          </button>

          {state.generatedSSN && (
            <button
              onClick={() => copySSN(state.generatedSSN)}
              className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600"
            >
              {copiedSSN === state.generatedSSN ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copiedSSN === state.generatedSSN ? t("generator_copied") : t("generator_copy")}
            </button>
          )}
        </div>
      </div>

      {/* Batch Generator */}
      <div className="rounded-xl bg-slate-800 p-6 shadow-xl ring-1 ring-slate-700">
        <h3 className="mb-4 text-lg font-semibold text-white">{t("generator_batch_title")}</h3>

        {/* Batch Settings */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              {t("generator_batch_count_label")}
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={state.batchCount}
              onChange={(e) =>
                setState((prev) => ({ ...prev, batchCount: parseInt(e.target.value) || 10 }))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              {t("generator_export_format_label")}
            </label>
            <select
              value={state.exportFormat}
              onChange={(e) =>
                setState((prev) => ({ ...prev, exportFormat: e.target.value as any }))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="txt">{t("generator_export_format_txt")}</option>
              <option value="csv">{t("generator_export_format_csv")}</option>
              <option value="json">{t("generator_export_format_json")}</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={state.includeValidation}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, includeValidation: e.target.checked }))
                }
                className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">{t("generator_include_metadata")}</span>
            </label>
          </div>
        </div>

        {/* Batch Controls */}
        <div className="flex gap-3">
          <button
            onClick={generateBatch}
            disabled={state.isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
          >
            <Shuffle className={`h-4 w-4 ${state.isGenerating ? "animate-spin" : ""}`} />
            {state.isGenerating
              ? t("generator_batch_generating")
              : t("generator_batch_generate", { count: state.batchCount })}
          </button>

          {state.generatedBatch.length > 0 && (
            <>
              <button
                onClick={exportData}
                className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600"
              >
                <Download className="h-4 w-4" />
                {t("generator_export")}
              </button>

              <button
                onClick={() => setShowBatch(!showBatch)}
                className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600"
              >
                {showBatch ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showBatch ? t("generator_hide") : t("generator_show")}
              </button>
            </>
          )}
        </div>

        {/* Batch Results */}
        {showBatch && state.generatedBatch.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">
                {t("generator_generated_ssns", { count: state.generatedBatch.length })}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="h-3 w-3" />
                {t("generator_click_to_copy")}
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-lg bg-slate-900 p-4">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {state.generatedBatch.map((ssn, index) => (
                  <button
                    key={index}
                    onClick={() => copySSN(ssn)}
                    className="rounded-lg bg-slate-800 p-3 text-left font-mono text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <span>{ssn}</span>
                      {copiedSSN === ssn && <Check className="h-3 w-3 text-green-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {(state.generatedSSN || state.generatedBatch.length > 0) && (
        <div className="text-center">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-6 py-3 text-slate-300 hover:bg-slate-600"
          >
            <RotateCcw className="h-4 w-4" />
            {t("generator_reset_all")}
          </button>
        </div>
      )}
    </div>
  )
}

export default SSNGeneratorComponent
