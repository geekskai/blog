"use client"

import { useState, useCallback, useEffect } from "react"
import type { ConversionResult } from "./types"
import ConverterInterface from "./components/ConverterInterface"
import VisualRuler, { CompactRuler } from "./components/VisualRuler"
import QuickReference from "./components/QuickReference"
import ConversionHistory from "./components/ConversionHistory"

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
  const [currentResult, setCurrentResult] = useState<ConversionResult | null>(null)
  const [showRuler, setShowRuler] = useState(true)
  const [activeSection, setActiveSection] = useState<"converter" | "reference" | "history">(
    "converter"
  )
  const { history, addConversion, clearHistory } = useConversionHistory()

  // Handle new conversion
  const handleConversion = useCallback(
    (result: ConversionResult) => {
      setCurrentResult(result)
      addConversion(result)
    },
    [addConversion]
  )

  // Handle selecting a conversion from history
  const handleSelectConversion = useCallback((result: ConversionResult) => {
    setCurrentResult(result)
    setActiveSection("converter")
  }, [])

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
                Convert{" "}
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
                  Inches to Decimal
                </span>{" "}
                Instantly
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300 sm:text-2xl">
                Professional-grade fraction to decimal converter designed for construction,
                woodworking, and manufacturing. Mobile-optimized for job site use.
              </p>

              {/* Key features */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-300">
                  <span>✓</span>
                  <span>Mobile Optimized</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                  <span>✓</span>
                  <span>Offline Capable</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                  <span>✓</span>
                  <span>Professional Grade</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                  <span>✓</span>
                  <span>Free Forever</span>
                </div>
              </div>
            </div>

            {/* Navigation tabs for mobile */}
            <div className="mb-8 flex justify-center lg:hidden">
              <div className="flex rounded-2xl border border-slate-500/30 bg-slate-500/10 p-1">
                {[
                  { id: "converter", label: "Convert", icon: "🔧" },
                  { id: "reference", label: "Reference", icon: "📚" },
                  { id: "history", label: "History", icon: "📊" },
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
                    <h2 className="text-xl font-semibold text-white">Visual Ruler</h2>
                    <button
                      onClick={() => setShowRuler(!showRuler)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        showRuler
                          ? "border border-blue-500/50 bg-blue-500/20 text-blue-300"
                          : "border border-slate-500/30 bg-slate-500/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {showRuler ? "Hide Ruler" : "Show Ruler"}
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

                {/* Conversion History */}
                <div className={activeSection !== "history" ? "hidden lg:block" : ""}>
                  <ConversionHistory
                    history={history}
                    onClearHistory={clearHistory}
                    onSelectConversion={handleSelectConversion}
                  />
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
                  How to Convert Inches to Decimal
                </h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    Our professional{" "}
                    <strong className="text-white">convert inches to decimal</strong> tool uses
                    advanced parsing algorithms to understand various fraction formats commonly used
                    in{" "}
                    <strong className="text-white">
                      construction, woodworking, and manufacturing
                    </strong>
                    .
                  </p>
                  <p>
                    Perfect for{" "}
                    <strong className="text-white">contractors, carpenters, and engineers</strong>{" "}
                    who need to <strong className="text-white">convert inches to decimal</strong>{" "}
                    measurements like "5 3/4" to "5.75" quickly and accurately on job sites.
                  </p>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span>
                        Supports mixed numbers (5 3/4), simple fractions (3/4), and decimals
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span>Real-time conversion as you type</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span>Visual ruler for better understanding</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span>One-click copy for easy sharing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why use our tool */}
              <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-8 backdrop-blur-xl">
                <h2 className="mb-6 text-3xl font-bold text-white">
                  Best Inches to Decimal Converter Features
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                        <span className="text-2xl">📱</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Mobile Optimized</h3>
                      <p className="text-slate-300">
                        Large touch targets and high contrast display perfect for job site use, even
                        with work gloves.
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
                      <h3 className="text-lg font-semibold text-white">Lightning Fast</h3>
                      <p className="text-slate-300">
                        Instant conversions with no delays. Get your results in milliseconds, not
                        seconds.
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
                      <h3 className="text-lg font-semibold text-white">Professional Accuracy</h3>
                      <p className="text-slate-300">
                        Designed for professionals who need precise measurements for construction,
                        manufacturing, and woodworking projects.
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
              <h3 className="text-xl font-semibold text-white">
                Trusted by Construction Professionals Worldwide
              </h3>
            </div>

            <p className="mx-auto mt-4 max-w-3xl text-slate-300">
              Join thousands of contractors, woodworkers, and engineers who rely on our
              <strong className="text-green-300"> convert inches to decimal</strong> calculator for
              accurate measurements and professional results.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-300">
                ✓ 100% Free Forever
              </div>
              <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                ✓ No Registration Required
              </div>
              <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                ✓ Works Offline
              </div>
              <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                ✓ Mobile & Desktop
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
