"use client"

import { useState, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"
import type { ConversionResult, CommonFraction } from "../types"
import {
  convertFractionToDecimal,
  convertDecimalToFractionResult,
  formatDecimal,
} from "../utils/converter"
import { copyConversionResult, shareConversionResult } from "../utils/clipboard"
import { validateInput } from "../utils/fractionParser"

// Common fractions for quick access
const COMMON_FRACTIONS: CommonFraction[] = [
  { display: "1/2", value: "1/2", decimal: 0.5 },
  { display: "1/4", value: "1/4", decimal: 0.25 },
  { display: "3/4", value: "3/4", decimal: 0.75 },
  { display: "1/8", value: "1/8", decimal: 0.125 },
  { display: "3/8", value: "3/8", decimal: 0.375 },
  { display: "5/8", value: "5/8", decimal: 0.625 },
  { display: "7/8", value: "7/8", decimal: 0.875 },
  { display: "1/16", value: "1/16", decimal: 0.0625 },
  { display: "3/16", value: "3/16", decimal: 0.1875 },
  { display: "5/16", value: "5/16", decimal: 0.3125 },
  { display: "7/16", value: "7/16", decimal: 0.4375 },
  { display: "9/16", value: "9/16", decimal: 0.5625 },
  { display: "11/16", value: "11/16", decimal: 0.6875 },
  { display: "13/16", value: "13/16", decimal: 0.8125 },
  { display: "15/16", value: "15/16", decimal: 0.9375 },
]

interface ConverterInterfaceProps {
  onConversion?: (result: ConversionResult) => void
}

export default function ConverterInterface({ onConversion }: ConverterInterfaceProps) {
  const t = useTranslations("ConvertInchesToDecimal")
  const [input, setInput] = useState("")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [precision, setPrecision] = useState(4)
  const [conversionMode, setConversionMode] = useState<
    "fraction-to-decimal" | "decimal-to-fraction"
  >("fraction-to-decimal")
  const [error, setError] = useState<string>("")
  const [copyMessage, setCopyMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Real-time conversion as user types
  const handleConversion = useCallback(async () => {
    if (!input.trim()) {
      setResult(null)
      setError("")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Validate input first
      const validation = validateInput(input)
      if (!validation.isValid) {
        setError(validation.errors[0] || "Invalid input")
        setResult(null)
        return
      }

      let conversionResult: ConversionResult

      if (conversionMode === "fraction-to-decimal") {
        conversionResult = convertFractionToDecimal(input, precision)
      } else {
        const decimal = parseFloat(input)
        if (isNaN(decimal)) {
          setError(t("validation_errors.invalid_decimal"))
          setResult(null)
          return
        }
        conversionResult = convertDecimalToFractionResult(decimal)
      }

      setResult(conversionResult)
      onConversion?.(conversionResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }, [input, precision, conversionMode, onConversion])

  // Trigger conversion when input changes
  useEffect(() => {
    const timeoutId = setTimeout(handleConversion, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [handleConversion])

  // Handle quick fraction selection
  const handleQuickFraction = (fraction: CommonFraction) => {
    setInput(fraction.value)
  }

  // Handle precision change
  const handlePrecisionChange = (newPrecision: number) => {
    setPrecision(newPrecision)
  }

  // Handle copy result
  const handleCopy = async (format: "decimal-only" | "fraction-only" | "both" = "both") => {
    if (!result) return

    const copyResult = await copyConversionResult(result, format)
    setCopyMessage(copyResult.message)
    setTimeout(() => setCopyMessage(""), 3000)
  }

  // Handle share result
  const handleShare = async () => {
    if (!result) return

    const shareResult = await shareConversionResult(result)
    setCopyMessage(shareResult.message)
    setTimeout(() => setCopyMessage(""), 3000)
  }

  // Swap conversion mode
  const handleSwapMode = () => {
    setConversionMode((prev) =>
      prev === "fraction-to-decimal" ? "decimal-to-fraction" : "fraction-to-decimal"
    )
    setInput("")
    setResult(null)
    setError("")
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/25 via-orange-500/20 to-red-500/25 p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-orange-500/15 blur-3xl"></div>

      <div className="relative">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">🔧</span>
            <h2 className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-2xl font-bold text-transparent">
              {t("converter_interface.title")}
            </h2>
          </div>
          <p className="text-slate-300">{t("converter_interface.description")}</p>
        </div>

        {/* Conversion Mode Toggle */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-1">
            <button
              onClick={() => setConversionMode("fraction-to-decimal")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                conversionMode === "fraction-to-decimal"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {t("converter_interface.conversion_modes.fraction_to_decimal")}
            </button>
            <button
              onClick={() => setConversionMode("decimal-to-fraction")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                conversionMode === "decimal-to-fraction"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {t("converter_interface.conversion_modes.decimal_to_fraction")}
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                conversionMode === "fraction-to-decimal"
                  ? t("converter_interface.placeholders.fraction_input")
                  : t("converter_interface.placeholders.decimal_input")
              }
              className="w-full rounded-2xl border border-orange-500/30 bg-orange-500/10 py-4 pl-16 pr-24 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
            />

            {/* Input icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-orange-500/20 p-2 backdrop-blur-sm">
              <span className="text-xl">📏</span>
            </div>

            {/* Swap button */}
            <button
              onClick={handleSwapMode}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-orange-500/20 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-orange-500/30"
              title={t("converter_interface.buttons.swap_mode")}
            >
              <span className="text-xl">↕️</span>
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300">
              <span className="text-sm">
                {t("converter_interface.error_prefix")} {error}
              </span>
            </div>
          )}
        </div>

        {/* Quick Fractions (only show in fraction-to-decimal mode) */}
        {conversionMode === "fraction-to-decimal" && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-300">
              {t("converter_interface.quick_fractions_label")}
            </h3>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
              {COMMON_FRACTIONS.map((fraction) => (
                <button
                  key={fraction.value}
                  onClick={() => handleQuickFraction(fraction)}
                  className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-xs font-medium text-slate-300 transition-all duration-300 hover:bg-orange-500/20 hover:text-white"
                >
                  {fraction.display}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Precision Control (only for fraction-to-decimal) */}
        {conversionMode === "fraction-to-decimal" && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-300">
              {t("converter_interface.precision_label")}
            </h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePrecisionChange(p)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    precision === p
                      ? "border border-orange-500/50 bg-orange-500/20 text-white"
                      : "border border-orange-500/30 bg-orange-500/10 text-slate-300 hover:bg-orange-500/15 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 backdrop-blur-sm">
            <div className="text-center">
              <div className="mb-2 text-sm text-slate-400">
                {t("converter_interface.result_label")}
              </div>
              <div className="mb-4 text-3xl font-bold text-white">
                {conversionMode === "fraction-to-decimal" ? (
                  <>
                    {result.formatted}
                    <span className="text-lg text-slate-400">
                      {" "}
                      {t("converter_interface.inches_unit")}
                    </span>
                  </>
                ) : (
                  result.formatted
                )}
              </div>

              {/* Show equivalents for fraction-to-decimal */}
              {conversionMode === "fraction-to-decimal" && result.commonEquivalents.length > 0 && (
                <div className="mb-4 text-sm text-slate-300">
                  <span className="text-slate-400">
                    {t("converter_interface.common_equivalents")}{" "}
                  </span>
                  {result.commonEquivalents.map((frac, index) => (
                    <span key={index}>
                      {index > 0 && ", "}
                      {frac.numerator}/{frac.denominator}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleCopy("both")}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/30"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                  <span className="relative">📋 {t("converter_interface.buttons.copy")}</span>
                </button>

                <button
                  onClick={() => handleCopy("decimal-only")}
                  className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition-all duration-300 hover:bg-blue-500/20 hover:text-white"
                >
                  {t("converter_interface.buttons.copy_decimal")}
                </button>

                <button
                  onClick={handleShare}
                  className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 transition-all duration-300 hover:bg-purple-500/20 hover:text-white"
                >
                  📤 {t("converter_interface.buttons.share")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Copy message */}
        {copyMessage && (
          <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center text-green-300">
            <span className="text-sm">✅ {copyMessage}</span>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-slate-300">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500"></div>
              <span className="text-sm">{t("converter_interface.converting")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
