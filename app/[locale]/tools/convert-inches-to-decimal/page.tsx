"use client"

import { useState, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"
import type { ConversionResult } from "./types"
import ConverterInterface from "./components/ConverterInterface"
import VisualRuler, { CompactRuler } from "./components/VisualRuler"
import QuickReference from "./components/QuickReference"

// Custom hook for managing conversion history
function useConversionHistory() {
  const [history, setHistory] = useState<ConversionResult[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("inches-to-decimal-history")
      if (saved) {
        const parsed = JSON.parse(saved)
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setHistory(historyWithDates)
      }
    } catch (error) {
      console.warn("Failed to load conversion history:", error)
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("inches-to-decimal-history", JSON.stringify(history))
    } catch (error) {
      console.warn("Failed to save conversion history:", error)
    }
  }, [history])

  const addConversion = useCallback((result: ConversionResult) => {
    setHistory((prev) => {
      // Avoid duplicates of the same conversion
      const isDuplicate = prev.some(
        (item) =>
          item.input === result.input &&
          Math.abs(item.timestamp.getTime() - result.timestamp.getTime()) < 1000
      )

      if (isDuplicate) return prev

      // Keep only the last 50 conversions
      const newHistory = [result, ...prev].slice(0, 50)
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return { history, addConversion, clearHistory }
}

export default function InchesToDecimalConverter() {
  const t = useTranslations("ConvertInchesToDecimal")
  const [currentResult, setCurrentResult] = useState<ConversionResult | null>(null)
  const [showRuler, setShowRuler] = useState(true)
  const [activeSection, setActiveSection] = useState<"converter" | "reference" | "history">(
    "converter"
  )
  const { addConversion } = useConversionHistory()

  // Handle new conversion
  const handleConversion = useCallback(
    (result: ConversionResult) => {
      setCurrentResult(result)
      addConversion(result)
    },
    [addConversion]
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"></div>

      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Main heading */}
            <div className="mb-12 text-center">
              <h1 className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
                {t("page_title")}
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300 sm:text-2xl">
                {t("page_subtitle")}
              </p>

              {/* Key features */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-300">
                  <span>✓</span>
                  <span>{t("key_features.mobile_optimized")}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                  <span>✓</span>
                  <span>{t("key_features.offline_capable")}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                  <span>✓</span>
                  <span>{t("key_features.professional_grade")}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                  <span>✓</span>
                  <span>{t("key_features.free_forever")}</span>
                </div>
              </div>
            </div>

            {/* Navigation tabs for mobile */}
            <div className="mb-8 flex justify-center lg:hidden">
              <div className="flex rounded-2xl border border-slate-500/30 bg-slate-500/10 p-1">
                {[
                  { id: "converter", label: t("navigation_tabs.convert"), icon: "🔧" },
                  { id: "reference", label: t("navigation_tabs.reference"), icon: "📚" },
                  { id: "history", label: t("navigation_tabs.history"), icon: "📊" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      activeSection === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left column - Converter and Ruler */}
              <div
                className={`space-y-8 lg:col-span-2 ${activeSection !== "converter" ? "hidden lg:block" : ""}`}
              >
                {/* Main converter */}
                <ConverterInterface onConversion={handleConversion} />

                {/* Visual ruler */}
                <div className="space-y-4">
                  {/* Ruler toggle */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">{t("visual_ruler.title")}</h2>
                    <button
                      onClick={() => setShowRuler(!showRuler)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        showRuler
                          ? "border border-blue-500/50 bg-blue-500/20 text-blue-300"
                          : "border border-slate-500/30 bg-slate-500/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {showRuler ? t("visual_ruler.hide_ruler") : t("visual_ruler.show_ruler")}
                    </button>
                  </div>

                  {/* Ruler component */}
                  {showRuler && (
                    <>
                      {/* Full ruler for desktop */}
                      <div className="hidden sm:block">
                        <VisualRuler result={currentResult} />
                      </div>

                      {/* Compact ruler for mobile */}
                      <div className="sm:hidden">
                        <CompactRuler result={currentResult} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right column - Reference and History */}
              <div className="space-y-8">
                {/* Quick Reference */}
                <div className={activeSection !== "reference" ? "hidden lg:block" : ""}>
                  <QuickReference />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Content Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* How it works */}
              <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-8 backdrop-blur-xl">
                <h2 className="mb-6 text-3xl font-bold text-white">
                  {t("educational_content.how_it_works.title")}
                </h2>
                <div className="space-y-4 text-slate-300">
                  <p>{t("educational_content.how_it_works.description_1")}</p>
                  <p>{t("educational_content.how_it_works.description_2")}</p>
                  <div className="mt-6 space-y-2">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-green-400">✓</span>
                        <span>{t(`educational_content.how_it_works.feature_${index}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Why use our tool */}
              <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-8 backdrop-blur-xl">
                <h2 className="mb-6 text-3xl font-bold text-white">
                  {t("educational_content.best_features.title")}
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                        <span className="text-2xl">📱</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {t("educational_content.best_features.mobile_optimized.title")}
                      </h3>
                      <p className="text-slate-300">
                        {t("educational_content.best_features.mobile_optimized.description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                        <span className="text-2xl">⚡</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {t("educational_content.best_features.lightning_fast.title")}
                      </h3>
                      <p className="text-slate-300">
                        {t("educational_content.best_features.lightning_fast.description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                        <span className="text-2xl">🎯</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {t("educational_content.best_features.professional_accuracy.title")}
                      </h3>
                      <p className="text-slate-300">
                        {t("educational_content.best_features.professional_accuracy.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-2">
              <span className="text-2xl">🏆</span>
              <h3 className="text-xl font-semibold text-white">{t("trust_signals.title")}</h3>
            </div>

            <p className="mx-auto mt-4 max-w-3xl text-slate-300">
              {t("trust_signals.description")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    index === 1
                      ? "border-green-500/30 bg-green-500/10 text-green-300"
                      : index === 2
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                        : index === 3
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                          : "border-orange-500/30 bg-orange-500/10 text-orange-300"
                  }`}
                >
                  ✓ {t(`trust_signals.badge_${index}`)}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
