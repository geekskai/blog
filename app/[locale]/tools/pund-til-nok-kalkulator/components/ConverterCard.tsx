"use client"

import { useState, useCallback, useEffect } from "react"
import { ArrowUpDown, Copy, Check, AlertCircle, TrendingUp, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"
import type { CurrencyCode, CopyStatus, ConversionResult, ExchangeRateData } from "../types"
import {
  convertCurrency,
  formatCurrency,
  getCurrencySymbol,
  getCurrencyFlag,
  parseAmountInput,
} from "../utils/currency"
import { copyToClipboard, formatCopyText } from "../utils/clipboard"

interface ConverterCardProps {
  className?: string
}

export default function ConverterCard({ className = "" }: ConverterCardProps) {
  const t = useTranslations("GbpNokConverter")
  // State management
  const [inputValue, setInputValue] = useState<string>("100")
  const [inputCurrency, setInputCurrency] = useState<CurrencyCode>("GBP")
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRateData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // Calculate output values
  const outputCurrency: CurrencyCode = inputCurrency === "GBP" ? "NOK" : "GBP"
  const numericInput = parseAmountInput(inputValue)

  const conversionResult: ConversionResult | null = exchangeRateData
    ? convertCurrency(
        numericInput,
        exchangeRateData.rate,
        inputCurrency,
        outputCurrency,
        exchangeRateData.lastUpdated
      )
    : null

  // Fetch exchange rate
  const fetchExchangeRate = useCallback(
    async (amount: string = "1") => {
      setLoading(true)
      setError("")

      try {
        const response = await fetch(
          `/api/exchange-rate?base=${inputCurrency}&target=${outputCurrency}&amount=${amount}`
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch exchange rate")
        }

        setExchangeRateData({
          base: inputCurrency,
          target: outputCurrency,
          rate: data.rate,
          lastUpdated: data.lastUpdated,
          timestamp: data.timestamp,
          convertedAmount: data.convertedAmount,
          originalAmount: data.originalAmount,
          source: data.source,
          method: data.method,
          usdRates: data.usdRates,
          apiBase: data.apiBase,
          warning: data.warning,
          fromCache: data.fromCache, // 添加缓存状态
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch exchange rate"
        setError(errorMessage)
        console.error("Exchange rate fetch error:", err)
      } finally {
        setLoading(false)
      }
    },
    [inputCurrency, outputCurrency]
  )

  // Fetch exchange rate on mount and currency change
  useEffect(() => {
    fetchExchangeRate()
  }, [fetchExchangeRate])

  // 优化：减少API调用，只在金额变化很大时才重新请求
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // 只有当金额变化超过10%或者是特殊金额时才重新请求
      const shouldRefetch =
        numericInput > 0 && numericInput !== 1 && (numericInput >= 1000 || numericInput % 100 === 0) // 只对大金额或整百数重新请求

      if (shouldRefetch && exchangeRateData) {
        // 检查当前汇率是否是今天的，如果是就不重新请求
        const today = new Date().toISOString().split("T")[0]
        if (exchangeRateData.lastUpdated !== today) {
          fetchExchangeRate(numericInput.toString())
        }
      }
    }, 2000) // 增加到2秒防抖，减少请求

    return () => clearTimeout(timeoutId)
  }, [numericInput, fetchExchangeRate, exchangeRateData])

  // Handle currency swap
  const handleCurrencySwap = useCallback(() => {
    setInputCurrency((prev) => (prev === "GBP" ? "NOK" : "GBP"))
  }, [])

  // Handle copy functionality
  const handleCopy = useCallback(async () => {
    if (!conversionResult) return

    setCopyStatus("copying")

    const copyText = formatCopyText(conversionResult)
    const success = await copyToClipboard(copyText)
    setCopyStatus(success ? "copied" : "error")

    // Reset status after 2 seconds
    setTimeout(() => setCopyStatus("idle"), 2000)
  }, [conversionResult])

  // Get copy button content
  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case "copying":
        return {
          icon: (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ),
          text: "Copying...",
          className: "bg-blue-500 hover:bg-blue-600",
        }
      case "copied":
        return {
          icon: <Check className="h-4 w-4" />,
          text: "Copied!",
          className: "bg-green-500 hover:bg-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Failed",
          className: "bg-red-500 hover:bg-red-600",
        }
      default:
        return {
          icon: <Copy className="h-4 w-4" />,
          text: "Copy Result",
          className:
            "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
        }
    }
  }

  const copyButtonContent = getCopyButtonContent()

  // Get theme colors based on input currency
  const getThemeColors = (currency: CurrencyCode) => {
    return currency === "GBP"
      ? {
          primary: "blue-500",
          secondary: "indigo-500",
          gradient: "from-blue-500/15 to-indigo-500/10",
          border: "border-blue-500/30",
          bg: "bg-blue-500/10",
          focus: "focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20",
          text: "text-blue-300",
        }
      : {
          primary: "red-500",
          secondary: "rose-500",
          gradient: "from-red-500/15 to-rose-500/10",
          border: "border-red-500/30",
          bg: "bg-red-500/10",
          focus: "focus:border-red-400 focus:ring-4 focus:ring-red-500/20",
          text: "text-red-300",
        }
  }

  const inputTheme = getThemeColors(inputCurrency)
  const outputTheme = getThemeColors(outputCurrency)

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/25 via-slate-800/20 to-slate-900/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-red-500/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-blue-500/15 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h2 className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
              {t("converter_title")}
            </h2>
          </div>
          <p className="text-slate-300">
            {t.rich("converter_description", {
              gbp: (chunks) => <strong className="text-white">{chunks}</strong>,
              rates: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
          </p>
        </div>

        {/* Exchange rate display */}
        {exchangeRateData && (
          <div className="mb-6 rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">
                  <strong className="text-slate-300">{t("converter_exchange_rate")}</strong>:
                </span>
                <span className="font-mono text-white">
                  <strong>
                    1 {inputCurrency} = {exchangeRateData.rate.toFixed(4)} {outputCurrency}
                  </strong>
                </span>
              </div>
              <button
                onClick={() => fetchExchangeRate(numericInput.toString())}
                disabled={loading}
                className="flex items-center gap-1 rounded-lg bg-slate-700/50 px-3 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-600/50 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                {t("converter_refresh")}
              </button>
            </div>
            {/* USD rates breakdown */}
            {exchangeRateData.usdRates && (
              <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                <div className="text-slate-400">
                  {t("converter_via_usd")}: {exchangeRateData.usdRates[inputCurrency]?.toFixed(6)}{" "}
                  {inputCurrency}
                </div>
                <div className="text-slate-400">
                  {t("converter_via_usd")}: {exchangeRateData.usdRates[outputCurrency]?.toFixed(4)}{" "}
                  {outputCurrency}
                </div>
              </div>
            )}
            <div className="mt-1 text-xs text-slate-500">
              Last updated: {exchangeRateData.lastUpdated}
              {exchangeRateData.source && (
                <span className="ml-2">• Source: {exchangeRateData.source}</span>
              )}
              {exchangeRateData.method && (
                <span className="ml-2">
                  • Method:{" "}
                  {exchangeRateData.method === "usd-cross-rate"
                    ? "USD Cross-Rate"
                    : exchangeRateData.method === "direct-fallback"
                      ? "Direct Fallback"
                      : "Fallback"}
                </span>
              )}
              {exchangeRateData.fromCache && (
                <span className="ml-2 text-green-400">• 📦 Cached (API-optimized)</span>
              )}
              {exchangeRateData.warning && (
                <div className="mt-1 text-yellow-400">⚠️ {exchangeRateData.warning}</div>
              )}
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Converter form */}
        <div className="space-y-6">
          {/* Input section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              {inputCurrency === "GBP"
                ? t.rich("converter_enter_amount_gbp", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })
                : t.rich("converter_enter_amount_nok", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
            </label>

            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t("converter_placeholder")}
                className={`w-full rounded-2xl border py-4 pl-16 pr-20 text-lg backdrop-blur-sm transition-all duration-300 focus:outline-none ${inputTheme.border} ${inputTheme.bg} ${inputTheme.focus} text-white placeholder-slate-400`}
              />

              {/* Currency flag and symbol */}
              <div
                className={`absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-lg px-2 py-1 backdrop-blur-sm ${inputTheme.bg}`}
              >
                <span className="text-lg">{getCurrencyFlag(inputCurrency)}</span>
                <span className={`text-sm font-medium ${inputTheme.text}`}>
                  {getCurrencySymbol(inputCurrency)}
                </span>
              </div>

              {/* Currency code */}
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-medium backdrop-blur-sm ${inputTheme.bg} ${inputTheme.text}`}
              >
                {inputCurrency}
              </div>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={handleCurrencySwap}
              disabled={loading}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <ArrowUpDown className="relative h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </div>

          {/* Output section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Result in{" "}
              <strong className="text-white">
                {outputCurrency === "GBP" ? "British Pounds (GBP)" : "Norwegian Krone (NOK)"}
              </strong>
            </label>

            <div className="relative">
              <div
                className={`w-full rounded-2xl border py-4 pl-16 pr-20 text-lg backdrop-blur-sm ${outputTheme.border} ${outputTheme.bg} text-white`}
              >
                <span className="text-2xl font-bold">
                  {conversionResult
                    ? formatCurrency(conversionResult.output, outputCurrency)
                    : "0.00"}
                </span>
              </div>

              {/* Currency flag and symbol */}
              <div
                className={`absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-lg px-2 py-1 backdrop-blur-sm ${outputTheme.bg}`}
              >
                <span className="text-lg">{getCurrencyFlag(outputCurrency)}</span>
                <span className={`text-sm font-medium ${outputTheme.text}`}>
                  {getCurrencySymbol(outputCurrency)}
                </span>
              </div>

              {/* Currency code */}
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-medium backdrop-blur-sm ${outputTheme.bg} ${outputTheme.text}`}
              >
                {outputCurrency}
              </div>
            </div>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            disabled={copyStatus === "copying" || !conversionResult}
            className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 ${copyButtonContent.className}`}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative flex items-center justify-center gap-2">
              {copyButtonContent.icon}
              <span>{copyButtonContent.text}</span>
            </div>
          </button>

          {/* Conversion info */}
          {conversionResult && (
            <div className="rounded-xl bg-slate-800/50 p-4 text-center backdrop-blur-sm">
              <p className="text-sm text-slate-400">
                <strong className="text-slate-300">{t("converter_conversion")}</strong>:{" "}
                <span className="font-mono text-slate-300">
                  <strong>
                    {formatCurrency(conversionResult.input, inputCurrency)} ={" "}
                    {formatCurrency(conversionResult.output, outputCurrency)}
                  </strong>
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                <strong className="text-slate-400">{t("converter_rate")}</strong>:{" "}
                <strong className="text-slate-300">
                  1 {inputCurrency} = {conversionResult.exchangeRate.toFixed(4)} {outputCurrency}
                </strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
