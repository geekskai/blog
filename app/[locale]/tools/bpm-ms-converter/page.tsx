"use client"

import { useState, useCallback, useEffect } from "react"
import { Music, Clock, Copy, Check, Zap, Headphones } from "lucide-react"
import { useTranslations } from "next-intl"
import ConversionResults from "./components/ConversionResults"
import { ConversionState, ConversionMode } from "./types"
import { performConversion, copyToClipboard } from "./utils"

export default function BPMMSConverter() {
  const t = useTranslations("BpmMsConverter")

  const [state, setState] = useState<ConversionState>({
    mode: "bpm-to-ms",
    inputValue: "",
    result: null,
    isValid: false,
  })
  const [copyState, setCopyState] = useState({ copied: false, item: "" })

  // Smart detection of input type
  const detectMode = (value: string): ConversionMode["id"] => {
    const num = parseFloat(value)
    if (isNaN(num)) return state.mode
    return num > 50 ? "bpm-to-ms" : "ms-to-bpm"
  }

  // Handle input change with smart detection
  const handleInputChange = (value: string) => {
    const detectedMode = detectMode(value)
    setState((prev) => ({
      ...prev,
      inputValue: value,
      mode: detectedMode,
      isValid: !isNaN(parseFloat(value)) && parseFloat(value) > 0,
    }))
  }

  // Perform conversion
  useEffect(() => {
    if (state.isValid && state.inputValue.trim()) {
      const result = performConversion(state.inputValue, state.mode)
      setState((prev) => ({ ...prev, result }))
    } else {
      setState((prev) => ({ ...prev, result: null }))
    }
  }, [state.inputValue, state.mode, state.isValid])

  // Handle preset selection
  const handlePresetSelect = (bpm: number) => {
    handleInputChange(bpm.toString())
  }

  // Handle copy
  const handleCopy = async (value: string, item: string) => {
    const success = await copyToClipboard(value)
    if (success) {
      setCopyState({ copied: true, item })
      setTimeout(() => setCopyState({ copied: false, item: "" }), 2000)
    }
  }

  const commonBPMs = [
    { bpm: 60, genre: t("common_bpm_presets.genres.ballad"), color: "emerald" },
    { bpm: 80, genre: t("common_bpm_presets.genres.hip_hop"), color: "blue" },
    { bpm: 100, genre: t("common_bpm_presets.genres.pop"), color: "purple" },
    { bpm: 120, genre: t("common_bpm_presets.genres.house"), color: "cyan" },
    { bpm: 128, genre: t("common_bpm_presets.genres.trance"), color: "indigo" },
    { bpm: 140, genre: t("common_bpm_presets.genres.techno"), color: "violet" },
    { bpm: 160, genre: t("common_bpm_presets.genres.hardstyle"), color: "pink" },
    { bpm: 174, genre: t("common_bpm_presets.genres.dnb"), color: "orange" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-purple-500/5 to-pink-500/5 blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Hero Section - SEO Optimized */}
        <div className="border-b border-white/5 bg-gradient-to-b from-slate-900/50 to-transparent">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* SEO-Optimized Title */}
              <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
                {t("page_title")}
              </h1>

              <p className="mb-2 text-xl font-semibold text-white sm:text-2xl">
                {t("page_subtitle")}
              </p>

              <p className="mb-8 text-lg text-slate-300">{t("page_description")}</p>

              {/* Value Props */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Zap className="h-4 w-4" />
                  <span>{t("value_props.instant_conversion")}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Music className="h-4 w-4" />
                  <span>{t("value_props.daw_ready")}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Headphones className="h-4 w-4" />
                  <span>{t("value_props.studio_grade")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Quick Converter Section */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold text-white">
              {t("quick_converter.title")}
            </h2>

            <div className="mx-auto max-w-2xl">
              {/* Smart Input */}
              <div className="relative mb-8">
                <input
                  type="number"
                  value={state.inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={t("quick_converter.input_placeholder")}
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-6 py-6 text-center text-3xl font-bold text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-400/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                />

                {/* Auto-detect indicator */}
                {state.inputValue && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-300">
                    {t("quick_converter.auto_prefix")}{" "}
                    {state.mode === "bpm-to-ms"
                      ? t("quick_converter.auto_detect_bpm_to_ms")
                      : t("quick_converter.auto_detect_ms_to_bpm")}
                  </div>
                )}
              </div>

              {/* Instant Results */}
              {state.result && (
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 text-center backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <Music className="h-5 w-5 text-blue-400" />
                      <span className="text-sm font-semibold text-blue-300">
                        {t("quick_converter.bpm_label")}
                      </span>
                    </div>
                    <div className="mb-2 text-3xl font-bold text-white">{state.result.bpm}</div>
                    <button
                      onClick={() => handleCopy(state.result!.bpm!.toString(), "bpm")}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copyState.copied && copyState.item === "bpm"
                        ? t("quick_converter.copied")
                        : t("quick_converter.click_to_copy")}
                    </button>
                  </div>

                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6 text-center backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-sm font-semibold text-purple-300">
                        {t("quick_converter.milliseconds_label")}
                      </span>
                    </div>
                    <div className="mb-2 text-3xl font-bold text-white">{state.result.ms}</div>
                    <button
                      onClick={() => handleCopy(state.result!.ms!.toString(), "ms")}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copyState.copied && copyState.item === "ms"
                        ? t("quick_converter.copied")
                        : t("quick_converter.click_to_copy")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Common BPM Presets */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              {t("common_bpm_presets.title")}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {commonBPMs.map((preset) => (
                <button
                  key={preset.bpm}
                  onClick={() => handlePresetSelect(preset.bpm)}
                  className={`group rounded-xl border p-4 text-left transition-all duration-200 hover:scale-105 ${
                    parseFloat(state.inputValue) === preset.bpm
                      ? `border-${preset.color}-500/50 bg-${preset.color}-500/20`
                      : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-white">{preset.bpm}</div>
                      <div className="text-sm text-slate-400">{preset.genre}</div>
                    </div>
                    <div className="text-xs text-slate-500">{Math.round(60000 / preset.bpm)}ms</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Results */}
          {state.result && (
            <div className="mb-16">
              <ConversionResults result={state.result} mode={state.mode} />
            </div>
          )}

          {/* Professional Tips - SEO Content */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              {t("professional_tips.title")}
            </h2>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-semibold text-emerald-400">
                  {t("professional_tips.delay_reverb_timing.title")}
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• {t("professional_tips.delay_reverb_timing.quarter_notes")}</li>
                  <li>• {t("professional_tips.delay_reverb_timing.eighth_notes")}</li>
                  <li>• {t("professional_tips.delay_reverb_timing.dotted_notes")}</li>
                  <li>• {t("professional_tips.delay_reverb_timing.sixteenth_notes")}</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-semibold text-blue-400">
                  {t("professional_tips.lfo_modulation.title")}
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• {t("professional_tips.lfo_modulation.whole_notes")}</li>
                  <li>• {t("professional_tips.lfo_modulation.half_notes")}</li>
                  <li>• {t("professional_tips.lfo_modulation.quarter_notes")}</li>
                  <li>• {t("professional_tips.lfo_modulation.triplets")}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Works - SEO Content */}
          <div className="rounded-2xl border border-white/10 bg-slate-800/20 p-8 backdrop-blur-sm">
            <h2 className="mb-6 text-center text-2xl font-bold text-white">
              {t("how_it_works.title")}
            </h2>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-purple-400">
                  {t("how_it_works.formula_title")}
                </h3>
                <div className="rounded-lg bg-slate-900/50 p-4 font-mono">
                  <div className="text-emerald-400">{t("how_it_works.bpm_to_ms_formula")}</div>
                  <div className="text-slate-300">{t("how_it_works.bpm_to_ms_calculation")}</div>
                  <div className="mt-2 text-purple-400">{t("how_it_works.ms_to_bpm_formula")}</div>
                  <div className="text-slate-300">{t("how_it_works.ms_to_bpm_calculation")}</div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-blue-400">
                  {t("how_it_works.common_applications_title")}
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• {t("how_it_works.applications.daw_delay_times")}</li>
                  <li>• {t("how_it_works.applications.lfo_sync")}</li>
                  <li>• {t("how_it_works.applications.step_sequencers")}</li>
                  <li>• {t("how_it_works.applications.modular_timing")}</li>
                  <li>• {t("how_it_works.applications.lighting_sync")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
