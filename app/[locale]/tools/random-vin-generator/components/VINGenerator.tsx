"use client"

import React, { useState, useCallback } from "react"
import { Shuffle, Copy, Download, Check, RotateCcw, Eye, EyeOff, Info, Car } from "lucide-react"
import { useTranslations } from "next-intl"
import { VINGenerator, VINExporter } from "../utils/vinGenerator"
import { VINGeneratorState } from "../types"

const VINGeneratorComponent = () => {
  const t = useTranslations("RandomVinGenerator.vin_generator")
  const [state, setState] = useState<VINGeneratorState>({
    generatedVIN: "",
    isGenerating: false,
    batchCount: 10,
    generatedBatch: [],
    exportFormat: "txt",
    includeValidation: true,
    showStructure: false,
    selectedManufacturer: "",
    modelYear: "",
  })

  const [copiedVIN, setCopiedVIN] = useState<string | null>(null)
  const [showBatch, setShowBatch] = useState(false)

  // Get available manufacturers
  const manufacturers = VINGenerator.getManufacturers()

  // Generate single VIN
  const generateSingle = useCallback(() => {
    setState((prev) => ({ ...prev, isGenerating: true }))

    setTimeout(() => {
      const newVIN = VINGenerator.generate({
        manufacturer: state.selectedManufacturer || undefined,
        modelYear: state.modelYear || undefined,
      })
      setState((prev) => ({
        ...prev,
        generatedVIN: newVIN,
        isGenerating: false,
      }))
    }, 150)
  }, [state.selectedManufacturer, state.modelYear])

  // Generate batch of VINs
  const generateBatch = useCallback(() => {
    setState((prev) => ({ ...prev, isGenerating: true }))

    setTimeout(() => {
      const batch = VINGenerator.generateBatch({
        count: state.batchCount,
        manufacturer: state.selectedManufacturer || undefined,
        modelYear: state.modelYear || undefined,
      })
      setState((prev) => ({
        ...prev,
        generatedBatch: batch,
        isGenerating: false,
      }))
      setShowBatch(true)
    }, 300)
  }, [state.batchCount, state.selectedManufacturer, state.modelYear])

  // Copy single VIN to clipboard
  const copyVIN = useCallback(async (vin: string) => {
    try {
      await navigator.clipboard.writeText(vin)
      setCopiedVIN(vin)
      setTimeout(() => setCopiedVIN(null), 2000)
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
        content = VINExporter.toTXT(state.generatedBatch)
        filename = `vin-batch-${Date.now()}.txt`
        break
      case "csv":
        content = VINExporter.toCSV(state.generatedBatch, state.includeValidation)
        filename = `vin-batch-${Date.now()}.csv`
        break
      case "json":
        content = VINExporter.toJSON(state.generatedBatch, state.includeValidation)
        filename = `vin-batch-${Date.now()}.json`
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
      generatedVIN: "",
      isGenerating: false,
      batchCount: 10,
      generatedBatch: [],
      exportFormat: "txt",
      includeValidation: true,
      showStructure: false,
      selectedManufacturer: "",
      modelYear: "",
    })
    setShowBatch(false)
    setCopiedVIN(null)
  }, [])

  // Get VIN structure breakdown
  const getVINStructure = useCallback(
    (vin: string) => {
      if (!vin) return null
      const validation = VINGenerator.validate(vin)
      const manufacturer = VINGenerator.getManufacturerInfo(validation.structure.wmi)
      return {
        ...validation.structure,
        manufacturer: manufacturer?.name || t("unknown"),
      }
    },
    [t]
  )

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Single VIN Generator */}
      <div className="rounded-xl bg-slate-800 p-4 shadow-xl ring-1 ring-slate-700 md:p-6 lg:p-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
          <h3 className="text-base font-semibold text-white sm:text-lg md:text-xl">
            {t("single_generator_title")}
          </h3>
          <button
            onClick={() => setState((prev) => ({ ...prev, showStructure: !prev.showStructure }))}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 sm:px-4 md:text-base"
          >
            {state.showStructure ? (
              <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
            )}
            {state.showStructure ? t("hide_structure") : t("show_structure")}
          </button>
        </div>

        {/* Generator Options */}
        <div className="mb-4 grid gap-3 sm:gap-4 md:mb-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 md:text-base">
              {t("manufacturer_label")}
            </label>
            <select
              value={state.selectedManufacturer}
              onChange={(e) =>
                setState((prev) => ({ ...prev, selectedManufacturer: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-emerald-500 md:px-4 md:py-2.5 md:text-base"
            >
              <option value="">{t("manufacturer_random")}</option>
              {manufacturers.map((mfg) => (
                <option key={mfg.code} value={mfg.code}>
                  {mfg.name} ({mfg.code}) - {mfg.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 md:text-base">
              {t("model_year_label")}
            </label>
            <select
              value={state.modelYear}
              onChange={(e) => setState((prev) => ({ ...prev, modelYear: e.target.value }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-emerald-500 md:px-4 md:py-2.5 md:text-base"
            >
              <option value="">{t("model_year_random")}</option>
              {Array.from({ length: 21 }, (_, i) => 2010 + i).map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generated VIN Display */}
        <div className="mb-4 md:mb-6">
          <div className="relative">
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 p-4 sm:p-6 md:p-8">
              {state.generatedVIN ? (
                <div className="w-full text-center">
                  <div className="mb-2 break-all font-mono text-xl font-bold text-emerald-300 sm:text-2xl md:text-3xl lg:text-4xl">
                    {state.generatedVIN}
                  </div>
                  {state.showStructure && (
                    <div className="mt-3 text-xs text-slate-400 sm:text-sm md:mt-4">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        <span className="truncate">
                          {t("structure.wmi")}:{" "}
                          <strong>{getVINStructure(state.generatedVIN)?.wmi}</strong>
                        </span>
                        <span className="truncate">
                          {t("structure.vds")}:{" "}
                          <strong>{getVINStructure(state.generatedVIN)?.vds}</strong>
                        </span>
                        <span className="truncate">
                          {t("structure.check")}:{" "}
                          <strong>{getVINStructure(state.generatedVIN)?.checkDigit}</strong>
                        </span>
                        <span className="truncate">
                          {t("structure.year")}:{" "}
                          <strong>{getVINStructure(state.generatedVIN)?.modelYear}</strong>
                        </span>
                        <span className="truncate">
                          {t("structure.plant")}:{" "}
                          <strong>{getVINStructure(state.generatedVIN)?.plantCode}</strong>
                        </span>
                        <span className="truncate">
                          {t("structure.serial")}:{" "}
                          <strong>{getVINStructure(state.generatedVIN)?.sequentialNumber}</strong>
                        </span>
                      </div>
                      <div className="mt-2 truncate text-xs text-emerald-400 md:text-sm">
                        {t("structure.manufacturer")}:{" "}
                        {getVINStructure(state.generatedVIN)?.manufacturer}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <div className="mb-2 flex justify-center">
                    <Car className="h-6 w-6 text-slate-600 sm:h-8 sm:w-8" />
                  </div>
                  <div className="mb-2 text-sm sm:text-base md:text-lg">
                    {t("generate_instruction")}
                  </div>
                  <div className="text-xs sm:text-sm">{t("format_info")}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Single VIN Controls */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            onClick={generateSingle}
            disabled={state.isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 sm:text-base md:px-6 md:py-3.5"
          >
            <Shuffle
              className={`h-4 w-4 md:h-5 md:w-5 ${state.isGenerating ? "animate-spin" : ""}`}
            />
            <span className="truncate">
              {state.isGenerating ? t("generating") : t("generate_vin")}
            </span>
          </button>

          {state.generatedVIN && (
            <button
              onClick={() => copyVIN(state.generatedVIN)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-slate-300 hover:bg-slate-600 sm:text-base md:px-6 md:py-3.5"
            >
              {copiedVIN === state.generatedVIN ? (
                <Check className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              ) : (
                <Copy className="h-4 w-4 md:h-5 md:w-5" />
              )}
              <span className="truncate">
                {copiedVIN === state.generatedVIN ? t("copied") : t("copy")}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Batch Generator */}
      <div className="rounded-xl bg-slate-800 p-4 shadow-xl ring-1 ring-slate-700 md:p-6 lg:p-8">
        <h3 className="mb-4 text-base font-semibold text-white sm:text-lg md:mb-6 md:text-xl">
          {t("batch_generator_title")}
        </h3>

        {/* Batch Settings */}
        <div className="mb-4 grid gap-3 sm:gap-4 md:mb-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 md:text-base">
              {t("number_of_vins")}
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={state.batchCount}
              onChange={(e) =>
                setState((prev) => ({ ...prev, batchCount: parseInt(e.target.value) || 10 }))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-emerald-500 md:px-4 md:py-2.5 md:text-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 md:text-base">
              {t("export_format")}
            </label>
            <select
              value={state.exportFormat}
              onChange={(e) =>
                setState((prev) => ({ ...prev, exportFormat: e.target.value as any }))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-emerald-500 md:px-4 md:py-2.5 md:text-base"
            >
              <option value="txt">{t("export_txt")}</option>
              <option value="csv">{t("export_csv")}</option>
              <option value="json">{t("export_json")}</option>
            </select>
          </div>

          <div className="flex items-center md:items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={state.includeValidation}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, includeValidation: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 md:h-5 md:w-5"
              />
              <span className="text-sm text-slate-300 md:text-base">{t("include_metadata")}</span>
            </label>
          </div>
        </div>

        {/* Batch Controls */}
        <div className="flex gap-3">
          <button
            onClick={generateBatch}
            disabled={state.isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50"
          >
            <Shuffle className={`h-4 w-4 ${state.isGenerating ? "animate-spin" : ""}`} />
            {state.isGenerating
              ? t("generating")
              : t("generate_batch", { count: state.batchCount })}
          </button>

          {state.generatedBatch.length > 0 && (
            <>
              <button
                onClick={exportData}
                className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600"
              >
                <Download className="h-4 w-4" />
                {t("export")}
              </button>

              <button
                onClick={() => setShowBatch(!showBatch)}
                className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600"
              >
                {showBatch ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showBatch ? t("hide") : t("show")}
              </button>
            </>
          )}
        </div>

        {/* Batch Results */}
        {showBatch && state.generatedBatch.length > 0 && (
          <div className="mt-4 md:mt-6">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-sm font-medium text-slate-300 md:text-base">
                {t("generated_vins", { count: state.generatedBatch.length })}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 md:text-sm">
                <Info className="h-3 w-3 md:h-4 md:w-4" />
                <span>{t("click_to_copy")}</span>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto rounded-lg bg-slate-900 p-3 sm:p-4 md:max-h-80">
              <div className="grid gap-2 md:gap-3 lg:grid-cols-2">
                {state.generatedBatch.map((vin, index) => (
                  <button
                    key={index}
                    onClick={() => copyVIN(vin)}
                    className="min-w-0 rounded-lg bg-slate-800 p-2.5 text-left font-mono text-xs transition-colors hover:bg-slate-700 sm:p-3 sm:text-sm md:text-base"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-slate-300">{vin}</span>
                      {copiedVIN === vin && (
                        <Check className="h-3 w-3 flex-shrink-0 text-green-400 sm:h-4 sm:w-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {(state.generatedVIN || state.generatedBatch.length > 0) && (
        <div className="flex justify-center">
          <button
            onClick={resetAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-600 sm:px-6 sm:py-3 sm:text-base"
          >
            <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
            <span>{t("reset_all")}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default VINGeneratorComponent
