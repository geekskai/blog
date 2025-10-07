"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { COMMON_FRACTIONS } from "../utils/fractionParser"

// Common construction measurements
const CONSTRUCTION_MEASUREMENTS = [
  { fraction: "1/2", decimal: "0.5", description: "Half inch - common lumber thickness" },
  { fraction: "3/4", decimal: "0.75", description: "Three-quarter inch - plywood thickness" },
  { fraction: "1 1/2", decimal: "1.5", description: "Standard 2x lumber actual thickness" },
  { fraction: "3 1/2", decimal: "3.5", description: "Standard 2x4 actual width" },
  { fraction: "5 1/2", decimal: "5.5", description: "Standard 2x6 actual width" },
  { fraction: "7 1/4", decimal: "7.25", description: "Standard 2x8 actual width" },
]

// Woodworking measurements
const WOODWORKING_MEASUREMENTS = [
  { fraction: "1/4", decimal: "0.25", description: "Quarter inch - thin plywood" },
  { fraction: "3/8", decimal: "0.375", description: "Common dowel diameter" },
  { fraction: "1/2", decimal: "0.5", description: "Standard cabinet door thickness" },
  { fraction: "5/8", decimal: "0.625", description: "Particle board thickness" },
  { fraction: "3/4", decimal: "0.75", description: "Standard cabinet box material" },
  { fraction: "1 3/4", decimal: "1.75", description: "Standard door thickness" },
]

// Manufacturing tolerances
const MANUFACTURING_TOLERANCES = [
  { fraction: "1/32", decimal: "0.03125", description: "Fine machining tolerance" },
  { fraction: "1/16", decimal: "0.0625", description: "Standard machining tolerance" },
  { fraction: "1/8", decimal: "0.125", description: "General fabrication tolerance" },
  { fraction: "1/4", decimal: "0.25", description: "Rough construction tolerance" },
]

interface QuickReferenceProps {
  className?: string
}

export default function QuickReference({ className = "" }: QuickReferenceProps) {
  const t = useTranslations("ConvertInchesToDecimal")
  const [activeTab, setActiveTab] = useState<
    "common" | "construction" | "woodworking" | "manufacturing"
  >("common")

  const tabs = [
    { id: "common", label: t("quick_reference.tabs.common"), icon: "📐" },
    { id: "construction", label: t("quick_reference.tabs.construction"), icon: "🏗️" },
    { id: "woodworking", label: t("quick_reference.tabs.woodworking"), icon: "🪵" },
    { id: "manufacturing", label: t("quick_reference.tabs.manufacturing"), icon: "⚙️" },
  ] as const

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/25 via-purple-500/20 to-pink-500/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-pink-500/15 to-purple-500/15 blur-3xl"></div>

      <div className="relative">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">📚</span>
            <h2 className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
              {t("quick_reference.title")}
            </h2>
          </div>
          <p className="text-slate-300">{t("quick_reference.description")}</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                  : "border border-purple-500/30 bg-purple-500/10 text-slate-300 hover:bg-purple-500/20 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 backdrop-blur-sm">
          {/* Common Fractions Tab */}
          {activeTab === "common" && (
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">Most Common Fractions</h3>

              {/* Organized by denominator groups */}
              <div className="space-y-6">
                {/* Halves and Quarters */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-purple-300">Halves & Quarters</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {Object.entries(COMMON_FRACTIONS)
                      .filter(([fraction]) => fraction.includes("/2") || fraction.includes("/4"))
                      .map(([fraction, decimal]) => (
                        <div
                          key={fraction}
                          className="group relative overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-4 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                          <div className="text-center">
                            <div className="mb-2 font-mono text-lg font-bold text-white">
                              {fraction}
                            </div>
                            <div className="mb-1 text-xs text-slate-400">=</div>
                            <div className="font-mono text-sm text-purple-300">{decimal}</div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Eighths */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-purple-300">Eighths</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {Object.entries(COMMON_FRACTIONS)
                      .filter(([fraction]) => fraction.includes("/8") && !fraction.includes("/32"))
                      .map(([fraction, decimal]) => (
                        <div
                          key={fraction}
                          className="group relative overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-4 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                          <div className="text-center">
                            <div className="mb-2 font-mono text-lg font-bold text-white">
                              {fraction}
                            </div>
                            <div className="mb-1 text-xs text-slate-400">=</div>
                            <div className="font-mono text-sm text-purple-300">{decimal}</div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Sixteenths */}
                <div>
                  <h4 className="mb-4 text-sm font-medium text-purple-300">Sixteenths</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {Object.entries(COMMON_FRACTIONS)
                      .filter(([fraction]) => fraction.includes("/16"))
                      .map(([fraction, decimal]) => (
                        <div
                          key={fraction}
                          className="group relative overflow-hidden rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-2.5 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                          <div className="text-center">
                            <div className="mb-1 font-mono text-xs font-bold leading-tight text-white">
                              {fraction}
                            </div>
                            <div className="font-mono text-[10px] leading-tight text-purple-300">
                              {decimal}
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Thirty-seconds (if any) */}
                {Object.entries(COMMON_FRACTIONS).some(([fraction]) =>
                  fraction.includes("/32")
                ) && (
                  <div>
                    <h4 className="mb-4 text-sm font-medium text-purple-300">Thirty-seconds</h4>

                    {/* Split into two rows for better mobile layout */}
                    <div className="space-y-3">
                      {/* First row: 1/32 to 15/32 */}
                      <div>
                        <div className="mb-2 text-xs text-purple-200/60">1/32 - 15/32</div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {Object.entries(COMMON_FRACTIONS)
                            .filter(([fraction]) => {
                              const match = fraction.match(/(\d+)\/32/)
                              return match && parseInt(match[1]) <= 15
                            })
                            .map(([fraction, decimal]) => (
                              <div
                                key={fraction}
                                className="group relative overflow-hidden rounded-md border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-1.5 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/50 hover:shadow-md hover:shadow-purple-500/25"
                              >
                                <div className="text-center">
                                  <div className="mb-0.5 font-mono text-[10px] font-bold leading-none text-white">
                                    {fraction}
                                  </div>
                                  <div className="font-mono text-[8px] leading-none text-purple-300">
                                    {decimal}
                                  </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Second row: 17/32 to 31/32 */}
                      <div>
                        <div className="mb-2 text-xs text-purple-200/60">17/32 - 31/32</div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {Object.entries(COMMON_FRACTIONS)
                            .filter(([fraction]) => {
                              const match = fraction.match(/(\d+)\/32/)
                              return match && parseInt(match[1]) >= 17
                            })
                            .map(([fraction, decimal]) => (
                              <div
                                key={fraction}
                                className="group relative overflow-hidden rounded-md border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-1.5 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/50 hover:shadow-md hover:shadow-purple-500/25"
                              >
                                <div className="text-center">
                                  <div className="mb-0.5 font-mono text-[10px] font-bold leading-none text-white">
                                    {fraction}
                                  </div>
                                  <div className="font-mono text-[8px] leading-none text-purple-300">
                                    {decimal}
                                  </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
