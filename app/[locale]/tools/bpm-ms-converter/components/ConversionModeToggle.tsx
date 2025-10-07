"use client"

import { useTranslations } from "next-intl"
import { ConversionMode } from "../types"
import { CONVERSION_MODES } from "../utils"

interface ConversionModeToggleProps {
  currentMode: ConversionMode["id"]
  onModeChange: (mode: ConversionMode["id"]) => void
}

export default function ConversionModeToggle({
  currentMode,
  onModeChange,
}: ConversionModeToggleProps) {
  const t = useTranslations("BpmMsConverter")

  return (
    <div className="mb-8">
      {/* Mode Toggle Header */}
      <div className="mb-6 text-center">
        <h2 className="mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent">
          {t("conversion_modes.bpm_to_ms")} / {t("conversion_modes.ms_to_bpm")}
        </h2>
        <p className="text-slate-400">{t("conversion_modes.bpm_to_ms_description")}</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {CONVERSION_MODES.map((mode) => {
          const isActive = currentMode === mode.id
          const gradientClass = isActive
            ? "from-blue-600 via-purple-600 to-pink-600"
            : "from-slate-700/50 to-slate-800/50"
          const borderClass = isActive
            ? "border-blue-500/50"
            : "border-slate-600/30 hover:border-slate-500/50"

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`group relative flex-1 overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg ${borderClass} ${gradientClass}`}
            >
              {/* Shine effect for active mode */}
              {isActive && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              )}

              <div className="relative">
                {/* Mode Icon */}
                <div className="mb-3 text-center">
                  <span className="text-3xl">{mode.icon}</span>
                </div>

                {/* Mode Title */}
                <h3
                  className={`mb-2 text-xl font-bold ${isActive ? "text-white" : "text-slate-300"}`}
                >
                  {mode.label}
                </h3>

                {/* Mode Description */}
                <p className={`text-sm ${isActive ? "text-slate-200" : "text-slate-400"}`}>
                  {mode.description}
                </p>

                {/* Input/Output Labels */}
                <div className="mt-4 space-y-2 text-xs">
                  <div
                    className={`flex items-center justify-between ${
                      isActive ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    <span>Input:</span>
                    <span className="font-medium">{mode.inputLabel}</span>
                  </div>
                  <div
                    className={`flex items-center justify-between ${
                      isActive ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    <span>Output:</span>
                    <span className="font-medium">{mode.outputLabel}</span>
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-white shadow-lg">
                    ✓
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Mode Switch Indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/30 bg-slate-800/50 px-4 py-2 text-sm text-slate-400 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
          <span>
            {currentMode === "bpm-to-ms"
              ? t("conversion_modes.converting_bpm_to_ms")
              : t("conversion_modes.converting_ms_to_bpm")}
          </span>
        </div>
      </div>
    </div>
  )
}
