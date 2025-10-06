"use client"

import React, { useState, useCallback } from "react"
import { Shuffle, Copy, Download, Check, RotateCcw, Eye, EyeOff, Info, Car } from "lucide-react"
import { VINGenerator, VINExporter } from "../utils/vinGenerator"
import { VINGeneratorState } from "../types"

const VINGeneratorComponent = () => {
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
  const getVINStructure = useCallback((vin: string) => {
    if (!vin) return null
    const validation = VINGenerator.validate(vin)
    const manufacturer = VINGenerator.getManufacturerInfo(validation.structure.wmi)
    return {
      ...validation.structure,
      manufacturer: manufacturer?.name || "Unknown",
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Single VIN Generator */}
      <div className="rounded-xl bg-slate-800 p-6 shadow-xl ring-1 ring-slate-700">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Single VIN Generator</h3>
          <button
            onClick={() => setState((prev) => ({ ...prev, showStructure: !prev.showStructure }))}
            className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-600"
          >
            {state.showStructure ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {state.showStructure ? "Hide" : "Show"} Structure
          </button>
        </div>

        {/* Generator Options */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Manufacturer (Optional)
            </label>
            <select
              value={state.selectedManufacturer}
              onChange={(e) =>
                setState((prev) => ({ ...prev, selectedManufacturer: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">Random Manufacturer</option>
              {manufacturers.map((mfg) => (
                <option key={mfg.code} value={mfg.code}>
                  {mfg.name} ({mfg.code}) - {mfg.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Model Year (Optional)
            </label>
            <select
              value={state.modelYear}
              onChange={(e) => setState((prev) => ({ ...prev, modelYear: e.target.value }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">Random Year</option>
              {Array.from({ length: 21 }, (_, i) => 2010 + i).map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generated VIN Display */}
        <div className="mb-6">
          <div className="relative">
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 p-8">
              {state.generatedVIN ? (
                <div className="text-center">
                  <div className="mb-2 font-mono text-3xl font-bold text-emerald-300">
                    {state.generatedVIN}
                  </div>
                  {state.showStructure && (
                    <div className="text-sm text-slate-400">
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        <span>
                          WMI: <strong>{getVINStructure(state.generatedVIN)?.wmi}</strong>
                        </span>
                        <span>
                          VDS: <strong>{getVINStructure(state.generatedVIN)?.vds}</strong>
                        </span>
                        <span>
                          Check: <strong>{getVINStructure(state.generatedVIN)?.checkDigit}</strong>
                        </span>
                        <span>
                          Year: <strong>{getVINStructure(state.generatedVIN)?.modelYear}</strong>
                        </span>
                        <span>
                          Plant: <strong>{getVINStructure(state.generatedVIN)?.plantCode}</strong>
                        </span>
                        <span>
                          Serial:{" "}
                          <strong>{getVINStructure(state.generatedVIN)?.sequentialNumber}</strong>
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-emerald-400">
                        Manufacturer: {getVINStructure(state.generatedVIN)?.manufacturer}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <div className="mb-2 flex justify-center">
                    <Car className="h-8 w-8 text-slate-600" />
                  </div>
                  <div className="mb-2 text-lg">Click "Generate VIN" to create a random VIN</div>
                  <div className="text-sm">Format: 17 characters, ISO 3779 compliant</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Single VIN Controls */}
        <div className="flex gap-3">
          <button
            onClick={generateSingle}
            disabled={state.isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
          >
            <Shuffle className={`h-4 w-4 ${state.isGenerating ? "animate-spin" : ""}`} />
            {state.isGenerating ? "Generating..." : "Generate VIN"}
          </button>

          {state.generatedVIN && (
            <button
              onClick={() => copyVIN(state.generatedVIN)}
              className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600"
            >
              {copiedVIN === state.generatedVIN ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copiedVIN === state.generatedVIN ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Batch Generator */}
      <div className="rounded-xl bg-slate-800 p-6 shadow-xl ring-1 ring-slate-700">
        <h3 className="mb-4 text-lg font-semibold text-white">Batch VIN Generator</h3>

        {/* Batch Settings */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Number of VINs</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={state.batchCount}
              onChange={(e) =>
                setState((prev) => ({ ...prev, batchCount: parseInt(e.target.value) || 10 }))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Export Format</label>
            <select
              value={state.exportFormat}
              onChange={(e) =>
                setState((prev) => ({ ...prev, exportFormat: e.target.value as any }))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="txt">Plain Text (.txt)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="json">JSON (.json)</option>
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
                className="rounded border-slate-600 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-300">Include metadata</span>
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
            {state.isGenerating ? "Generating..." : `Generate ${state.batchCount} VINs`}
          </button>

          {state.generatedBatch.length > 0 && (
            <>
              <button
                onClick={exportData}
                className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600"
              >
                <Download className="h-4 w-4" />
                Export
              </button>

              <button
                onClick={() => setShowBatch(!showBatch)}
                className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600"
              >
                {showBatch ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showBatch ? "Hide" : "Show"}
              </button>
            </>
          )}
        </div>

        {/* Batch Results */}
        {showBatch && state.generatedBatch.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">
                Generated VINs ({state.generatedBatch.length})
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="h-3 w-3" />
                Click any VIN to copy
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-lg bg-slate-900 p-4">
              <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-2">
                {state.generatedBatch.map((vin, index) => (
                  <button
                    key={index}
                    onClick={() => copyVIN(vin)}
                    className="rounded-lg bg-slate-800 p-3 text-left font-mono text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <span>{vin}</span>
                      {copiedVIN === vin && <Check className="h-3 w-3 text-green-400" />}
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
        <div className="text-center">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-6 py-3 text-slate-300 hover:bg-slate-600"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </button>
        </div>
      )}
    </div>
  )
}

export default VINGeneratorComponent
