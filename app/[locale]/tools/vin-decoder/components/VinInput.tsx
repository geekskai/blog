"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, AlertCircle, Loader2, X, Clipboard, Car } from "lucide-react"
import { useTranslations } from "next-intl"
import { VinInputProps } from "../types"
import { formatVIN, getValidationHint, EXAMPLE_VINS } from "../lib/validation"

/**
 * Example VINs for testing and demonstration
 */
/**
 * 1HGBH41JXMN109186 - Honda Accord
 * 5YJSA1DN5CFP01657 - Tesla Model S
 * WBA3B5C50EJ845971 - BMW 3 Series
 * 1FTFW1ET5DFC10312 - Ford F-150
 * JTDKARFU5J3068263 - Toyota Prius
 * VinInput component
 * @param value - The current value of the input
 * @param onChange - The function to call when the input value changes
 * @param onSubmit - The function to call when the form is submitted
 * @param isValid - Whether the input is valid
 * @param error - The error message to display
 * @param isLoading - Whether the input is loading
 * @param placeholder - The placeholder text to display
 * @param autoFocus - Whether the input should be focused automatically
 */
export default function VinInput({
  value,
  onChange,
  onSubmit,
  isValid,
  error,
  isLoading = false,
  placeholder,
  autoFocus = true,
}: VinInputProps) {
  const t = useTranslations("VinDecoder")
  const [isFocused, setIsFocused] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const defaultPlaceholder = placeholder || t("input.placeholder")

  useEffect(() => {
    setMounted(true)
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatVIN(e.target.value)
    if (formatted.length <= 17) {
      onChange(formatted)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const formatted = formatVIN(text)
      if (formatted.length <= 17) {
        onChange(formatted)
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err)
    }
  }

  const handleClear = () => {
    onChange("")
    inputRef.current?.focus()
  }

  const handleExampleClick = (vin: string) => {
    onChange(vin)
    setShowExamples(false)
    setTimeout(() => onSubmit(), 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && !isLoading) {
      onSubmit()
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Enhanced Input Container */}
      <div
        className={`group relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br backdrop-blur-xl transition-all duration-500 ${
          error
            ? "border-red-500/50 from-red-900/25 via-red-800/20 to-red-900/25 shadow-xl shadow-red-500/20"
            : isFocused
              ? "border-blue-500/60 from-blue-900/30 via-indigo-900/25 to-purple-900/30 shadow-2xl shadow-blue-500/25 ring-4 ring-blue-500/30"
              : "border-slate-600/30 from-slate-800/40 via-slate-800/30 to-slate-900/40 hover:border-slate-500/40"
        }`}
      >
        {/* Enhanced Decorative background elements */}
        {mounted && (
          <div className="absolute inset-0 -z-10">
            {isFocused && !error && (
              <>
                <div className="absolute -right-12 -top-12 h-36 w-36 animate-pulse rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/15 blur-3xl" />
                <div className="absolute -bottom-12 -left-12 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />
                <div className="absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-2xl" />
              </>
            )}
            {error && (
              <>
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl" />
                <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 blur-3xl" />
              </>
            )}
          </div>
        )}

        <div className="relative flex items-center">
          {/* Enhanced Icon */}
          <div className="absolute left-6 flex items-center">
            <div
              className={`rounded-2xl p-4 backdrop-blur-sm transition-all duration-500 ${
                error
                  ? "bg-gradient-to-br from-red-500/25 to-pink-500/20 shadow-lg shadow-red-500/20"
                  : isFocused
                    ? "bg-gradient-to-br from-blue-500/25 to-cyan-500/20 shadow-lg shadow-blue-500/20"
                    : "bg-gradient-to-br from-slate-600/30 to-slate-700/30 group-hover:from-slate-600/40 group-hover:to-slate-700/40"
              }`}
            >
              <Car
                className={`h-6 w-6 transition-all duration-300 ${
                  error
                    ? "text-red-400"
                    : isFocused
                      ? "text-blue-400"
                      : "text-slate-300 group-hover:text-white"
                }`}
              />
            </div>
          </div>

          {/* Enhanced Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={defaultPlaceholder}
            className="w-full bg-transparent py-8 pl-24 pr-36 text-2xl font-bold tracking-wider text-white placeholder-slate-400 outline-none transition-all duration-300 focus:placeholder-slate-500"
            spellCheck={false}
            autoComplete="off"
            disabled={isLoading}
          />

          {/* Enhanced Character Counter */}
          <div className="absolute right-6 flex items-center gap-3">
            {value && (
              <div
                className={`rounded-xl px-3 py-2 backdrop-blur-sm transition-all duration-300 ${
                  value.length === 17
                    ? "bg-green-500/20 shadow-lg shadow-green-500/20"
                    : value.length > 0
                      ? "bg-yellow-500/20 shadow-lg shadow-yellow-500/20"
                      : "bg-slate-600/20"
                }`}
              >
                <span
                  className={`text-base font-bold ${
                    value.length === 17
                      ? "text-green-400"
                      : value.length > 0
                        ? "text-yellow-400"
                        : "text-slate-400"
                  }`}
                >
                  {value.length}/17
                </span>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-2">
              {value && !isLoading && (
                <button
                  onClick={handleClear}
                  className="group rounded-xl border border-slate-600/30 bg-slate-700/30 p-3 text-slate-400 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20"
                  title={t("input.clear")}
                >
                  <X className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
              )}

              {mounted && !value && typeof navigator !== "undefined" && navigator.clipboard && (
                <button
                  onClick={handlePaste}
                  className="group rounded-xl border border-slate-600/30 bg-slate-700/30 p-3 text-slate-400 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
                  title={t("input.paste")}
                >
                  <Clipboard className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
              )}

              {isLoading && (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/20 p-3 shadow-lg shadow-blue-500/20">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Submit Button */}
        <div className="border-t border-white/10 bg-gradient-to-r from-slate-800/40 via-slate-800/30 to-slate-900/40 p-4">
          <button
            onClick={onSubmit}
            disabled={!isValid || isLoading}
            className={`group relative w-full overflow-hidden rounded-3xl px-8 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-500 ${
              isValid && !isLoading
                ? "hover:shadow-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]"
                : "cursor-not-allowed bg-gradient-to-r from-slate-700/60 to-slate-800/60 opacity-50"
            }`}
          >
            {isValid && !isLoading && (
              <>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-1000 group-hover:translate-x-full" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </>
            )}
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="rounded-full bg-white/20 p-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <span>{t("input.decoding")}</span>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-white/20 p-2 transition-transform duration-300 group-hover:scale-110">
                    <Search className="h-6 w-6" />
                  </div>
                  <span>{t("actions.decode_vin")}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Error Message */}
      {error && (
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-pink-500/10 p-6 backdrop-blur-xl">
          <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="rounded-xl bg-red-500/20 p-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-red-300">{error}</p>
              {getValidationHint(error, t) && (
                <p className="mt-2 text-sm text-red-200/80">{getValidationHint(error, t)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Example VINs */}
      <div className="mt-6">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-600/30 bg-slate-700/30 px-4 py-2 text-base font-medium text-slate-300 transition-all duration-300 hover:border-slate-500/50 hover:bg-slate-600/40 hover:text-white"
        >
          <span>{showExamples ? t("input.hide_examples") : t("input.show_examples")}</span>
          <div className={`transition-transform duration-300 ${showExamples ? "rotate-180" : ""}`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {showExamples && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {EXAMPLE_VINS.map((example, index) => {
              const colors = [
                {
                  border: "border-blue-500/30",
                  bg: "from-blue-500/15 to-cyan-500/10",
                  glow: "hover:shadow-blue-500/20",
                },
                {
                  border: "border-emerald-500/30",
                  bg: "from-emerald-500/15 to-teal-500/10",
                  glow: "hover:shadow-emerald-500/20",
                },
                {
                  border: "border-purple-500/30",
                  bg: "from-purple-500/15 to-pink-500/10",
                  glow: "hover:shadow-purple-500/20",
                },
                {
                  border: "border-orange-500/30",
                  bg: "from-orange-500/15 to-red-500/10",
                  glow: "hover:shadow-orange-500/20",
                },
              ]
              const colorScheme = colors[index % colors.length]

              return (
                <button
                  key={example.vin}
                  onClick={() => handleExampleClick(example.vin)}
                  className={`group relative overflow-hidden rounded-2xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-4 text-left backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${colorScheme.glow}`}
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                  <div className="relative">
                    <div className="font-mono text-base font-bold text-white">{example.vin}</div>
                    <div className="mt-2 text-sm text-slate-300">{example.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Enhanced VIN Location Hints */}
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-slate-600/30 bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 p-6 backdrop-blur-xl">
        <div className="absolute -bottom-8 -right-8 h-16 w-16 rounded-full bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-2xl" />
        <div className="relative">
          <h4 className="mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-lg font-bold text-transparent">
            {t("input.where_to_find_title")}
          </h4>
          <ul className="space-y-3 text-base text-slate-300">
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
              <span>{t("input.where_to_find_1")}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
              <span>{t("input.where_to_find_2")}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
              <span>{t("input.where_to_find_3")}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400" />
              <span>{t("input.where_to_find_4")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
