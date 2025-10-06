"use client"

import React, { useState, useEffect } from "react"
import { BookOpen, TrendingUp, RefreshCw } from "lucide-react"
import { getCommonConversions, formatCurrency, getCurrencyFlag } from "../utils/currency"
import type { CurrencyCode, ExchangeRateData } from "../types"

export default function QuickReference() {
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRateData | null>(null)
  const [loading, setLoading] = useState(false)
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>("GBP")

  // Fetch exchange rate
  const fetchExchangeRate = async (base: CurrencyCode) => {
    setLoading(true)
    const target: CurrencyCode = base === "GBP" ? "NOK" : "GBP"

    try {
      const response = await fetch(`/api/exchange-rate?base=${base}&target=${target}&amount=1`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setExchangeRateData({
            base,
            target,
            rate: data.rate,
            lastUpdated: data.lastUpdated,
            timestamp: data.timestamp,
            source: data.source,
            method: data.method,
            usdRates: data.usdRates,
            apiBase: data.apiBase,
            warning: data.warning,
          })
        }
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch initial rate
  useEffect(() => {
    fetchExchangeRate(baseCurrency)
  }, [baseCurrency])

  // Generate common conversions
  const commonConversions = exchangeRateData
    ? getCommonConversions(exchangeRateData.rate, baseCurrency)
    : []

  const targetCurrency: CurrencyCode = baseCurrency === "GBP" ? "NOK" : "GBP"

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-900/25 via-teal-900/20 to-cyan-900/25 p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-cyan-500/15 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <h3 className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
              Quick Reference
            </h3>
          </div>
          <p className="text-slate-300">Common currency conversions at current exchange rates</p>
        </div>

        {/* Currency selector */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setBaseCurrency("GBP")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              baseCurrency === "GBP"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{getCurrencyFlag("GBP")}</span>
              <span>GBP → NOK</span>
            </div>
          </button>
          <button
            onClick={() => setBaseCurrency("NOK")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              baseCurrency === "NOK"
                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{getCurrencyFlag("NOK")}</span>
              <span>NOK → GBP</span>
            </div>
          </button>
        </div>

        {/* Exchange rate info */}
        {exchangeRateData && (
          <div className="mb-6 rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Current Rate:{" "}
                <span className="font-mono text-white">
                  1 {baseCurrency} = {exchangeRateData.rate.toFixed(4)} {targetCurrency}
                </span>
              </div>
              <button
                onClick={() => fetchExchangeRate(baseCurrency)}
                disabled={loading}
                className="flex items-center gap-1 rounded-lg bg-slate-700/50 px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-600/50 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
            {/* USD rates info */}
            {exchangeRateData.usdRates && (
              <div className="mt-2 text-xs text-slate-500">
                Via USD: {exchangeRateData.usdRates[targetCurrency]?.toFixed(4)} ÷{" "}
                {exchangeRateData.usdRates[baseCurrency]?.toFixed(6)}
              </div>
            )}
            {exchangeRateData.warning && (
              <div className="mt-2 text-xs text-yellow-400">⚠️ {exchangeRateData.warning}</div>
            )}
          </div>
        )}

        {/* Conversion table */}
        <div className="space-y-4">
          {/* Table header */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-400">
                <span>{getCurrencyFlag(baseCurrency)}</span>
                <span>{baseCurrency}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-teal-400">
                <span>{getCurrencyFlag(targetCurrency)}</span>
                <span>{targetCurrency}</span>
              </div>
            </div>
          </div>

          {/* Conversion rows */}
          <div className="space-y-2">
            {commonConversions.length > 0 ? (
              commonConversions.map(({ base, converted }, index) => (
                <div
                  key={base}
                  className="group grid grid-cols-2 gap-4 rounded-lg bg-slate-800/20 p-3 transition-all duration-300 hover:bg-slate-700/30"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="text-center">
                    <span className="text-lg font-semibold text-white">
                      {formatCurrency(base, baseCurrency)}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-white">
                      {formatCurrency(converted, targetCurrency)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400">
                {loading ? "Loading exchange rates..." : "Unable to load conversion rates"}
              </div>
            )}
          </div>
        </div>

        {/* Pro tip */}
        <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
            <div>
              <h4 className="font-semibold text-emerald-300">Exchange Rate Tip</h4>
              <p className="text-sm text-slate-300">
                Exchange rates fluctuate throughout the day. For large transactions, consider
                monitoring rates over time to get the best conversion value.
              </p>
            </div>
          </div>
        </div>

        {/* Last updated info */}
        {exchangeRateData && (
          <div className="mt-4 text-center text-xs text-slate-500">
            Last updated: {exchangeRateData.lastUpdated}
            {exchangeRateData.source && (
              <span className="ml-2">• Source: {exchangeRateData.source}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
