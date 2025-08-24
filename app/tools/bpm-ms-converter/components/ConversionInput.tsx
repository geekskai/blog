"use client"

import { useState, useEffect } from "react"
import { Music, Timer, AlertCircle } from "lucide-react"
import { ConversionMode } from "../types"
import { CONVERSION_MODES, validateInput, getErrorMessage } from "../utils"

interface ConversionInputProps {
  mode: ConversionMode["id"]
  value: string
  onChange: (value: string) => void
  onValidationChange: (isValid: boolean, error?: string) => void
}

export default function ConversionInput({
  mode,
  value,
  onChange,
  onValidationChange,
}: ConversionInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string>("")

  const currentModeConfig = CONVERSION_MODES.find((m) => m.id === mode)!
  const isBPMMode = mode === "bpm-to-ms"

  // Validate input whenever value or mode changes
  useEffect(() => {
    if (!value.trim()) {
      setError("")
      onValidationChange(false)
      return
    }

    const isValid = validateInput(value, mode)
    if (isValid) {
      setError("")
      onValidationChange(true)
    } else {
      const errorMessage = getErrorMessage(value, mode)
      setError(errorMessage)
      onValidationChange(false, errorMessage)
    }
  }, [value, mode, onValidationChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Allow empty input, numbers, and decimal points
    if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue)
    }
  }

  const inputTheme = isBPMMode
    ? {
        gradient: "from-blue-500/15 to-purple-500/10",
        border: "border-blue-500/30",
        focusBorder: "focus:border-blue-400",
        focusRing: "focus:ring-blue-500/20",
        iconBg: "bg-blue-500/20",
        icon: Music,
      }
    : {
        gradient: "from-purple-500/15 to-pink-500/10",
        border: "border-purple-500/30",
        focusBorder: "focus:border-purple-400",
        focusRing: "focus:ring-purple-500/20",
        iconBg: "bg-purple-500/20",
        icon: Timer,
      }

  const IconComponent = inputTheme.icon

  return (
    <div className="mb-8">
      {/* Input Section Header */}
      <div className="mb-6 text-center">
        <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-700/50 px-6 py-3 backdrop-blur-sm">
          <IconComponent className="h-6 w-6 text-slate-300" />
          <h3 className="text-xl font-bold text-white">{currentModeConfig.inputLabel}</h3>
        </div>
        <p className="text-slate-400">{currentModeConfig.description}</p>
      </div>

      {/* Input Field Container */}
      <div className="relative">
        <div
          className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-300 ${
            error
              ? "border-red-500/50 bg-red-500/10"
              : isFocused
                ? `${inputTheme.focusBorder} ${inputTheme.gradient}`
                : `${inputTheme.border} ${inputTheme.gradient}`
          }`}
        >
          {/* Input Field */}
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={currentModeConfig.inputPlaceholder}
            className={`w-full bg-transparent py-6 pl-20 pr-24 text-2xl font-bold text-white placeholder-slate-400 outline-none transition-all duration-300 ${
              error ? "" : `focus:ring-4 ${inputTheme.focusRing}`
            }`}
          />

          {/* Input Icon */}
          <div
            className={`absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl backdrop-blur-sm ${
              error ? "bg-red-500/20" : inputTheme.iconBg
            }`}
          >
            <IconComponent className={`h-6 w-6 ${error ? "text-red-400" : "text-white"}`} />
          </div>

          {/* Unit Label */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span
              className={`rounded-lg px-3 py-2 text-lg font-bold backdrop-blur-sm ${
                error
                  ? "bg-red-500/20 text-red-300"
                  : isBPMMode
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-purple-500/20 text-purple-300"
              }`}
            >
              {isBPMMode ? "BPM" : "ms"}
            </span>
          </div>

          {/* Focus glow effect */}
          {isFocused && !error && (
            <div
              className={`absolute inset-0 -z-10 rounded-2xl blur-xl ${
                isBPMMode ? "bg-blue-500/20" : "bg-purple-500/20"
              }`}
            ></div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Input Hints */}
        {!error && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-4 text-sm text-slate-400">
              <span>Range: {isBPMMode ? "20-300 BPM" : "100-3000 ms"}</span>
              <span className="h-1 w-1 rounded-full bg-slate-500"></span>
              <span>Common: {isBPMMode ? "120-140 BPM" : "400-500 ms"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Preset Buttons */}
      {isBPMMode && !value && (
        <div className="mt-6">
          <p className="mb-3 text-center text-sm text-slate-400">Quick Presets:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[60, 80, 100, 120, 128, 140, 160, 174].map((bpm) => (
              <button
                key={bpm}
                onClick={() => onChange(bpm.toString())}
                className="group relative overflow-hidden rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-blue-500/5 px-4 py-2 text-sm font-medium text-blue-300 transition-all duration-300 hover:border-blue-400/50 hover:from-blue-500/20 hover:to-blue-500/10"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-500 group-hover:translate-x-full"></div>
                <span className="relative">{bpm} BPM</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
