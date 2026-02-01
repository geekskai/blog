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
  const t = useTranslations("VinDecoder.input")
  const [isFocused, setIsFocused] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const inputPlaceholder = placeholder || t("placeholder")

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
        className={`group relative overflow-hidden rounded-xl border-2 bg-gradient-to-br backdrop-blur-xl transition-all duration-500 md:rounded-3xl ${
          error
            ? "border-red-500/50 from-red-900/25 via-red-800/20 to-red-900/25 shadow-xl shadow-red-500/20"
            : isFocused
              ? "border-blue-500/60 from-blue-900/30 via-indigo-900/25 to-purple-900/30 shadow-2xl shadow-blue-500/25 ring-2 ring-blue-500/30 md:ring-4"
              : "border-slate-600/30 from-slate-800/40 via-slate-800/30 to-slate-900/40 hover:border-slate-500/40"
        }`}
      >
        {/* Enhanced Decorative background elements */}
        {mounted && (
          <div className="absolute inset-0 -z-10">
            {isFocused && !error && (
              <>
                <div className="absolute -right-8 -top-8 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/15 blur-3xl md:-right-12 md:-top-12 md:h-36 md:w-36" />
                <div className="absolute -bottom-8 -left-8 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl md:-bottom-12 md:-left-12 md:h-32 md:w-32" />
                <div className="absolute right-1/4 top-1/3 h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-2xl md:h-20 md:w-20" />
              </>
            )}
            {error && (
              <>
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl md:-right-12 md:-top-12 md:h-36 md:w-36" />
                <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 blur-3xl md:-bottom-12 md:-left-12 md:h-32 md:w-32" />
              </>
            )}
          </div>
        )}

        <div className="relative flex items-center">
          {/* Enhanced Icon */}
          <div className="absolute left-2 flex items-center sm:left-4 md:left-6">
            <div
              className={`rounded-lg p-1.5 backdrop-blur-sm transition-all duration-500 sm:p-2.5 md:rounded-2xl md:p-4 ${
                error
                  ? "bg-gradient-to-br from-red-500/25 to-pink-500/20 shadow-lg shadow-red-500/20"
                  : isFocused
                    ? "bg-gradient-to-br from-blue-500/25 to-cyan-500/20 shadow-lg shadow-blue-500/20"
                    : "bg-gradient-to-br from-slate-600/30 to-slate-700/30 group-hover:from-slate-600/40 group-hover:to-slate-700/40"
              }`}
            >
              <Car
                className={`h-3 w-3 transition-all duration-300 sm:h-4 sm:w-4 md:h-6 md:w-6 ${
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
            placeholder={inputPlaceholder}
            className="w-full bg-transparent py-2.5 pl-10 pr-20 text-sm font-bold tracking-wide text-white placeholder-slate-400 outline-none transition-all duration-300 focus:placeholder-slate-500 sm:pl-12 sm:pr-24 sm:text-base md:py-4 md:pl-24 md:pr-28 md:tracking-wider lg:py-6 lg:pr-36 lg:text-xl xl:text-2xl"
            spellCheck={false}
            autoComplete="off"
            disabled={isLoading}
          />

          {/* Enhanced Character Counter */}
          <div className="absolute right-2 flex items-center gap-1 sm:right-3 sm:gap-2 md:right-6 md:gap-3">
            {value && (
              <div
                className={`rounded-lg px-1.5 py-0.5 backdrop-blur-sm transition-all duration-300 md:rounded-xl md:px-3 md:py-2 ${
                  value.length === 17
                    ? "bg-green-500/20 shadow-lg shadow-green-500/20"
                    : value.length > 0
                      ? "bg-yellow-500/20 shadow-lg shadow-yellow-500/20"
                      : "bg-slate-600/20"
                }`}
              >
                <span
                  className={`text-xs font-bold sm:text-sm md:text-sm lg:text-base ${
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
            <div className="flex items-center gap-1 md:gap-2">
              {value && !isLoading && (
                <button
                  onClick={handleClear}
                  className="group min-h-[40px] min-w-[40px] rounded-lg border border-slate-600/30 bg-slate-700/30 p-1.5 text-slate-400 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20 sm:rounded-xl sm:p-2 md:min-h-[44px] md:min-w-[44px] md:p-3"
                  title={t("clear")}
                >
                  <X className="h-3 w-3 transition-transform duration-300 group-hover:scale-110 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </button>
              )}

              {mounted && !value && typeof navigator !== "undefined" && navigator.clipboard && (
                <button
                  onClick={handlePaste}
                  className="group min-h-[40px] min-w-[40px] rounded-lg border border-slate-600/30 bg-slate-700/30 p-1.5 text-slate-400 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20 sm:rounded-xl sm:p-2 md:min-h-[44px] md:min-w-[44px] md:p-3"
                  title={t("paste")}
                >
                  <Clipboard className="h-3 w-3 transition-transform duration-300 group-hover:scale-110 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </button>
              )}

              {isLoading && (
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/20 p-1.5 shadow-lg shadow-blue-500/20 sm:rounded-xl sm:p-2 md:p-3">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-400 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Submit Button */}
        <div className="border-t border-white/10 bg-gradient-to-r from-slate-800/40 via-slate-800/30 to-slate-900/40 p-2.5 sm:p-3 md:p-4">
          <button
            onClick={onSubmit}
            disabled={!isValid || isLoading}
            className={`group relative w-full overflow-hidden rounded-xl px-3 py-2.5 text-sm font-bold text-white shadow-2xl transition-all duration-500 sm:min-h-[44px] sm:py-3 sm:text-base md:rounded-3xl md:px-6 md:py-4 md:text-lg lg:px-8 lg:py-5 ${
              isValid && !isLoading
                ? "hover:shadow-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]"
                : "cursor-not-allowed bg-gradient-to-r from-slate-700/60 to-slate-800/60 opacity-50"
            }`}
          >
            {isValid && !isLoading && (
              <>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-1000 group-hover:translate-x-full" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:rounded-3xl" />
              </>
            )}
            <div className="relative flex items-center justify-center gap-1.5 md:gap-3">
              {isLoading ? (
                <>
                  <div className="rounded-full bg-white/20 p-1 md:p-2">
                    <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                  </div>
                  <span className="text-xs md:text-base">{t("decoding")}</span>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-white/20 p-1 transition-transform duration-300 group-hover:scale-110 md:p-2">
                    <Search className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                  </div>
                  <span className="text-xs md:text-base">{t("decode_button")}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Error Message */}
      {error && (
        <div className="relative mt-2 overflow-hidden rounded-lg border border-red-500/30 bg-gradient-to-br from-red-500/15 to-pink-500/10 p-2.5 backdrop-blur-xl sm:mt-3 sm:p-3 md:mt-4 md:rounded-2xl md:p-6">
          <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 blur-2xl md:-right-8 md:-top-8 md:h-16 md:w-16" />
          <div className="relative flex items-start gap-2 sm:gap-3 md:gap-4">
            <div className="rounded-lg bg-red-500/20 p-1.5 sm:p-2 md:rounded-xl md:p-3">
              <AlertCircle className="h-3 w-3 text-red-400 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold leading-relaxed text-red-300 sm:text-sm md:text-base">
                {error}
              </p>
              {getValidationHint(error) && (
                <p className="mt-1 text-xs leading-relaxed text-red-200/80 sm:mt-1.5 md:mt-2 md:text-sm">
                  {getValidationHint(error)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Example VINs */}
      <div className="mt-2 sm:mt-3 md:mt-6">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="group inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-600/30 bg-slate-700/30 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all duration-300 hover:border-slate-500/50 hover:bg-slate-600/40 hover:text-white sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm md:min-h-[44px] md:px-4 md:text-base"
        >
          <span>{showExamples ? t("hide_examples") : t("show_examples")}</span>
          <div className={`transition-transform duration-300 ${showExamples ? "rotate-180" : ""}`}>
            <svg
              className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
          <div className="mt-2 grid grid-cols-1 gap-2 sm:mt-3 sm:gap-2.5 md:mt-4 md:grid-cols-2 md:gap-3">
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
                  className={`group relative overflow-hidden rounded-lg border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-2.5 text-left backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-lg sm:min-h-[44px] sm:p-3 md:rounded-2xl md:p-4 ${colorScheme.glow}`}
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                  <div className="relative">
                    <div className="break-all font-mono text-xs font-bold text-white sm:text-sm md:text-base">
                      {example.vin}
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-300 sm:mt-1 sm:text-sm md:mt-2">
                      {example.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Enhanced VIN Location Hints */}
      <div className="relative mt-3 overflow-hidden rounded-lg border border-slate-600/30 bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 p-2.5 backdrop-blur-xl sm:mt-4 sm:p-3 md:mt-8 md:rounded-2xl md:p-6">
        <div className="absolute -bottom-4 -right-4 h-10 w-10 rounded-full bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-2xl md:-bottom-8 md:-right-8 md:h-16 md:w-16" />
        <div className="relative">
          <h4 className="mb-1.5 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-xs font-bold text-transparent sm:mb-2 sm:text-sm md:mb-4 md:text-lg">
            {t("where_to_find_title")}
          </h4>
          <ul className="space-y-1.5 text-xs leading-relaxed text-slate-300 sm:space-y-2 sm:text-sm md:space-y-3 md:text-base">
            <li className="flex items-start gap-2 md:items-center md:gap-3">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 md:mt-0 md:h-2 md:w-2" />
              <span className="leading-relaxed">{t("where_to_find_1")}</span>
            </li>
            <li className="flex items-start gap-2 md:items-center md:gap-3">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 md:mt-0 md:h-2 md:w-2" />
              <span className="leading-relaxed">{t("where_to_find_2")}</span>
            </li>
            <li className="flex items-start gap-2 md:items-center md:gap-3">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 md:mt-0 md:h-2 md:w-2" />
              <span className="leading-relaxed">{t("where_to_find_3")}</span>
            </li>
            <li className="flex items-start gap-2 md:items-center md:gap-3">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-orange-400 to-red-400 md:mt-0 md:h-2 md:w-2" />
              <span className="leading-relaxed">{t("where_to_find_4")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
