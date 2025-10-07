"use client"

import { useState, useCallback, useEffect } from "react"
import { ArrowUpDown, Copy, Check, AlertCircle, Zap, Share2, Info, Sliders } from "lucide-react"
import { useTranslations } from "next-intl"
import ShareButtons from "@/components/ShareButtons"
import ConversionHistory from "./ConversionHistory"
import type {
  EngineType,
  FuelSystem,
  ConversionDirection,
  ConversionResult,
  CopyStatus,
  PrecisionOption,
} from "../types"
import {
  convert,
  validateInput,
  formatNumber,
  parseUrlParameters,
  generateUrlWithParameters,
  saveConversionToHistory,
  hpToKw,
  ccmToLiters,
} from "../utils/converter"
import { copyConversionResult, shareConversionResult } from "../utils/clipboard"

interface ConverterCardProps {
  className?: string
}

export default function ConverterCard({ className = "" }: ConverterCardProps) {
  const t = useTranslations("CcmToHpConverter")

  // State management with URL parameter support
  const [inputValue, setInputValue] = useState<string>("125")
  const [engineType, setEngineType] = useState<EngineType>("4-stroke")
  const [fuelSystem, setFuelSystem] = useState<FuelSystem>("naturally-aspirated")
  const [direction, setDirection] = useState<ConversionDirection>("ccm-to-hp")
  const [precision, setPrecision] = useState<PrecisionOption>(2)
  const [useSlider, setUseSlider] = useState<boolean>(false)
  const [showShareButtons, setShowShareButtons] = useState<boolean>(false)
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  const [shareStatus, setShareStatus] = useState<CopyStatus>("idle")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string>("")
  const [warning, setWarning] = useState<string>("")

  // Initialize from URL parameters on component mount
  useEffect(() => {
    const urlParams = parseUrlParameters()
    if (urlParams.input) setInputValue(urlParams.input.toString())
    if (urlParams.engineType) setEngineType(urlParams.engineType)
    if (urlParams.fuelSystem) setFuelSystem(urlParams.fuelSystem)
    if (urlParams.direction) setDirection(urlParams.direction)
  }, [])

  // Calculate conversion result
  const calculateResult = useCallback(() => {
    // Helper function to get translated error messages
    const getErrorMessage = (errorCode: string): string => {
      switch (errorCode) {
        case "INVALID_NUMBER":
          return t("converter_card.invalid_number")
        case "MIN_CCM_ERROR":
          return t("converter_card.min_ccm_error")
        case "LARGE_CCM_WARNING":
          return t("converter_card.large_ccm_warning")
        case "MIN_HP_ERROR":
          return t("converter_card.min_hp_error")
        case "HIGH_HP_WARNING":
          return t("converter_card.high_hp_warning")
        default:
          return errorCode
      }
    }

    const numValue = parseFloat(inputValue)

    // Validate input
    const validation = validateInput(numValue, direction)
    if (!validation.isValid) {
      const errorMessage = validation.error
        ? getErrorMessage(validation.error)
        : t("converter_card.enter_value_to_calculate")
      setError(errorMessage)
      setWarning("")
      setResult(null)
      return
    }

    setError("")
    setWarning(validation.warning ? getErrorMessage(validation.warning) : "")

    // Perform conversion with precision
    const conversionResult = convert(numValue, direction, engineType, fuelSystem, precision)
    setResult(conversionResult)

    // Save to history and dispatch event for real-time updates
    saveConversionToHistory(conversionResult)
    window.dispatchEvent(new CustomEvent("conversionSaved"))
  }, [inputValue, direction, engineType, fuelSystem, precision, t])

  // Recalculate when inputs change
  useEffect(() => {
    if (inputValue.trim()) {
      calculateResult()
    } else {
      setResult(null)
      setError("")
      setWarning("")
    }
  }, [calculateResult, inputValue])

  // Handle input change
  const handleInputChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, "")
    setInputValue(sanitized)
  }

  // Handle slider change
  const handleSliderChange = (value: number) => {
    setInputValue(value.toString())
  }

  // Get slider range based on direction
  const getSliderRange = () => {
    if (direction === "ccm-to-hp") {
      return { min: 50, max: 5000, step: 25 }
    } else {
      return { min: 1, max: 500, step: 1 }
    }
  }

  // Toggle conversion direction
  const toggleDirection = () => {
    const newDirection: ConversionDirection = direction === "ccm-to-hp" ? "hp-to-ccm" : "ccm-to-hp"
    setDirection(newDirection)

    // Swap input value with result if available
    if (result) {
      setInputValue(result.output.toString())
    }
  }

  // Copy result to clipboard
  const handleCopy = async () => {
    if (!result) return

    setCopyStatus("copying")
    const success = await copyConversionResult(result)
    setCopyStatus(success ? "copied" : "error")

    setTimeout(() => setCopyStatus("idle"), 2000)
  }

  // Share result
  const handleShare = async () => {
    if (!result) return

    setShareStatus("copying")
    const success = await shareConversionResult(result)
    setShareStatus(success ? "copied" : "error")

    setTimeout(() => setShareStatus("idle"), 2000)
  }

  // Copy shareable URL
  const handleCopyUrl = async () => {
    if (!result) return

    const url = generateUrlWithParameters(parseFloat(inputValue), engineType, fuelSystem, direction)

    try {
      await navigator.clipboard.writeText(url)
      setCopyStatus("copied")
      setTimeout(() => setCopyStatus("idle"), 2000)
    } catch (error) {
      setCopyStatus("error")
      setTimeout(() => setCopyStatus("idle"), 2000)
    }
  }

  // Handle history selection
  const handleHistorySelection = (historicalResult: ConversionResult) => {
    setInputValue(historicalResult.input.toString())
    setEngineType(historicalResult.engineConfig.type)
    setFuelSystem(historicalResult.engineConfig.fuelSystem)
    setDirection(historicalResult.inputUnit === "ccm" ? "ccm-to-hp" : "hp-to-ccm")
  }

  // Get input/output labels
  const inputLabel =
    direction === "ccm-to-hp"
      ? t("converter_card.engine_displacement_label")
      : t("converter_card.horsepower_label")
  const inputUnit = direction === "ccm-to-hp" ? "ccm" : "hp"
  const outputLabel =
    direction === "ccm-to-hp"
      ? t("converter_card.estimated_horsepower_label")
      : t("converter_card.estimated_displacement_label")
  const outputUnit = direction === "ccm-to-hp" ? "hp" : "ccm"

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-900/25 via-red-900/20 to-pink-900/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-orange-400" />
              <h2 className="bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
                {t("converter_card.title")}
              </h2>
            </div>
            <ConversionHistory onSelectConversion={handleHistorySelection} />
          </div>
          <p className="text-center text-slate-300">{t("converter_card.description")}</p>
        </div>

        {/* Engine Configuration */}
        <div className="mb-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Engine Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {t("converter_card.engine_type_label")}
              </label>
              <select
                value={engineType}
                onChange={(e) => setEngineType(e.target.value as EngineType)}
                className="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-white backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
              >
                <option value="2-stroke" className="bg-slate-800">
                  {t("engine_types.2_stroke")}
                </option>
                <option value="4-stroke" className="bg-slate-800">
                  {t("engine_types.4_stroke")}
                </option>
              </select>
            </div>

            {/* Fuel System Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {t("converter_card.fuel_system_label")}
              </label>
              <select
                value={fuelSystem}
                onChange={(e) => setFuelSystem(e.target.value as FuelSystem)}
                className="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-white backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
              >
                <option value="naturally-aspirated" className="bg-slate-800">
                  {t("fuel_systems.naturally_aspirated")}
                </option>
                <option value="turbocharged" className="bg-slate-800">
                  {t("fuel_systems.turbocharged")}
                </option>
              </select>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Precision Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {t("converter_card.precision_label")}
              </label>
              <select
                value={precision}
                onChange={(e) => setPrecision(parseInt(e.target.value) as PrecisionOption)}
                className="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-white backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
              >
                <option value={0} className="bg-slate-800">
                  0 {t("converter_card.decimals")}
                </option>
                <option value={1} className="bg-slate-800">
                  1 {t("converter_card.decimal")}
                </option>
                <option value={2} className="bg-slate-800">
                  2 {t("converter_card.decimals")}
                </option>
                <option value={3} className="bg-slate-800">
                  3 {t("converter_card.decimals")}
                </option>
              </select>
            </div>

            {/* Input Method Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {t("converter_card.input_method_label")}
              </label>
              <button
                onClick={() => setUseSlider(!useSlider)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-all duration-300 ${
                  useSlider
                    ? "border-orange-400 bg-orange-500/20 text-orange-300"
                    : "border-orange-500/30 bg-orange-500/10 text-slate-300 hover:border-orange-400"
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {useSlider ? t("converter_card.slider_mode") : t("converter_card.text_input")}
                </span>
              </button>
            </div>

            {/* Share Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {t("converter_card.share_results_label")}
              </label>
              <button
                onClick={() => setShowShareButtons(!showShareButtons)}
                disabled={!result}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                  showShareButtons && result
                    ? "border-blue-400 bg-blue-500/20 text-blue-300"
                    : "border-orange-500/30 bg-orange-500/10 text-slate-300 hover:border-orange-400"
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {showShareButtons
                    ? t("converter_card.hide_share")
                    : t("converter_card.show_share")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">{inputLabel}</label>

            {/* Text Input */}
            {!useSlider && (
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    direction === "ccm-to-hp"
                      ? t("converter_card.enter_ccm_placeholder")
                      : t("converter_card.enter_hp_placeholder")
                  }
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full rounded-2xl border border-orange-500/30 bg-orange-500/10 py-4 pl-6 pr-20 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-orange-500/20 px-3 py-1 text-sm font-medium text-orange-300 backdrop-blur-sm">
                  {inputUnit}
                </div>
              </div>
            )}

            {/* Slider Input */}
            {useSlider && (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min={getSliderRange().min}
                    max={getSliderRange().max}
                    step={getSliderRange().step}
                    value={parseFloat(inputValue) || getSliderRange().min}
                    onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-orange-500/20"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)",
                    }}
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>
                      {getSliderRange().min} {inputUnit}
                    </span>
                    <span className="font-medium text-orange-300">
                      {inputValue} {inputUnit}
                    </span>
                    <span>
                      {getSliderRange().max} {inputUnit}
                    </span>
                  </div>
                </div>

                {/* Manual input for slider mode */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      direction === "ccm-to-hp"
                        ? t("converter_card.enter_ccm_placeholder")
                        : t("converter_card.enter_hp_placeholder")
                    }
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 py-3 pl-4 pr-16 text-sm text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-300 backdrop-blur-sm">
                    {inputUnit}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error/Warning Messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {warning && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-yellow-400">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{warning}</span>
            </div>
          )}

          {/* Direction Toggle */}
          <div className="flex justify-center">
            <button
              onClick={toggleDirection}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/25"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <ArrowUpDown className="relative h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">{outputLabel}</label>
            <div className="relative">
              <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-4 pl-6 pr-20 text-lg text-white backdrop-blur-sm">
                {result ? (
                  <div className="space-y-2">
                    <span className="text-2xl font-bold">{formatNumber(result.output)}</span>
                    <div className="text-sm text-slate-400">
                      {t("converter_card.range_prefix")} {formatNumber(result.outputRange.min)} -{" "}
                      {formatNumber(result.outputRange.max)} {outputUnit}
                    </div>
                    {/* Additional unit conversions */}
                    <div className="space-y-1 text-xs text-slate-500">
                      {direction === "ccm-to-hp" ? (
                        <>
                          <div>≈ {formatNumber(hpToKw(result.output), 1)} kW</div>
                          <div>Input: {formatNumber(ccmToLiters(result.input), 2)} L</div>
                        </>
                      ) : (
                        <>
                          <div>≈ {formatNumber(hpToKw(result.input), 1)} kW input</div>
                          <div>Output: {formatNumber(ccmToLiters(result.output), 2)} L</div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400">
                    {t("converter_card.enter_value_to_calculate")}
                  </span>
                )}
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-red-500/20 px-3 py-1 text-sm font-medium text-red-300 backdrop-blur-sm">
                {outputUnit}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 md:grid-cols-3">
            <button
              onClick={handleCopy}
              disabled={!result || copyStatus === "copying"}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center justify-center gap-2">
                {copyStatus === "copying" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : copyStatus === "copied" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {copyStatus === "copying"
                    ? t("converter_card.copying")
                    : copyStatus === "copied"
                      ? t("converter_card.copied")
                      : t("converter_card.copy_result")}
                </span>
              </div>
            </button>

            <button
              onClick={handleShare}
              disabled={!result || shareStatus === "copying"}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center justify-center gap-2">
                {shareStatus === "copying" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : shareStatus === "copied" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {shareStatus === "copying"
                    ? t("converter_card.sharing")
                    : shareStatus === "copied"
                      ? t("converter_card.shared")
                      : t("converter_card.share_result")}
                </span>
              </div>
            </button>

            <button
              onClick={handleCopyUrl}
              disabled={!result}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center justify-center gap-2">
                <Share2 className="h-4 w-4" />
                <span className="text-sm">{t("converter_card.copy_url")}</span>
              </div>
            </button>
          </div>

          {/* Formula Display */}
          {result && (
            <div className="rounded-xl bg-slate-800/50 p-4 text-center backdrop-blur-sm">
              <p className="text-sm text-slate-400">
                {t("converter_card.formula_prefix")}{" "}
                <span className="font-mono text-slate-300">{result.formula}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">{t("converter_card.disclaimer")}</p>
            </div>
          )}

          {/* Share Buttons */}
          {showShareButtons && result && (
            <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
              <div className="mb-4 text-center">
                <h4 className="text-lg font-semibold text-white">
                  {t("converter_card.share_your_results")}
                </h4>
                <p className="text-sm text-slate-300">
                  {result.input} {result.inputUnit} = {formatNumber(result.output, precision)}{" "}
                  {result.outputUnit} ({result.engineConfig.description})
                </p>
              </div>
              <ShareButtons />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
