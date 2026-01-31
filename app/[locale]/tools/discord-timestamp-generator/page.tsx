"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useTranslations } from "next-intl"
import {
  Clock,
  Calendar,
  Copy,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle,
  Sparkles,
  Monitor,
  Home,
  ChevronRight,
  Zap,
  Star,
  Timer,
  CalendarDays,
  MessageSquare,
  BookmarkPlus,
  RotateCw,
  ArrowUpDown,
} from "lucide-react"
import { Link } from "@/app/i18n/navigation"

// Type definitions
interface TimestampFormat {
  id: string
  label: string
  description: string
  suffix: string
  example: string
}

interface TimeAdjustment {
  weeks: number
  days: number
  hours: number
  minutes: number
}

interface DateInput {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

// 将 TIMESTAMP_FORMATS 移到组件内部，以便使用翻译

export default function DiscordTimestampGenerator() {
  // Translations
  const t = useTranslations("DiscordTimestampGenerator")

  // TIMESTAMP_FORMATS with translations
  const TIMESTAMP_FORMATS: TimestampFormat[] = [
    {
      id: "relative",
      label: t("timestamp_formats.relative.label"),
      description: t("timestamp_formats.relative.description"),
      suffix: "R",
      example: t("timestamp_formats.relative.example"),
    },
    {
      id: "short-time",
      label: t("timestamp_formats.short_time.label"),
      description: t("timestamp_formats.short_time.description"),
      suffix: "t",
      example: t("timestamp_formats.short_time.example"),
    },
    {
      id: "long-time",
      label: t("timestamp_formats.long_time.label"),
      description: t("timestamp_formats.long_time.description"),
      suffix: "T",
      example: t("timestamp_formats.long_time.example"),
    },
    {
      id: "short-date",
      label: t("timestamp_formats.short_date.label"),
      description: t("timestamp_formats.short_date.description"),
      suffix: "d",
      example: t("timestamp_formats.short_date.example"),
    },
    {
      id: "long-date",
      label: t("timestamp_formats.long_date.label"),
      description: t("timestamp_formats.long_date.description"),
      suffix: "D",
      example: t("timestamp_formats.long_date.example"),
    },
    {
      id: "short-full",
      label: t("timestamp_formats.short_full.label"),
      description: t("timestamp_formats.short_full.description"),
      suffix: "f",
      example: t("timestamp_formats.short_full.example"),
    },
    {
      id: "long-full",
      label: t("timestamp_formats.long_full.label"),
      description: t("timestamp_formats.long_full.description"),
      suffix: "F",
      example: t("timestamp_formats.long_full.example"),
    },
  ]

  // State management
  const [mode, setMode] = useState<"timeframe" | "date">("timeframe")
  const [format, setFormat] = useState<string>("relative")
  const [timeAdjustment, setTimeAdjustment] = useState<TimeAdjustment>({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
  })
  const [dateInput, setDateInput] = useState<DateInput>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  })
  const [generatedTimestamp, setGeneratedTimestamp] = useState<string>("")
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [previewText, setPreviewText] = useState<string>("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [favorites, setFavorites] = useState<
    Array<{ name: string; timestamp: string; config: any }>
  >([])
  const [quickPresets] = useState([
    { label: t("quick_presets.in_1_hour"), hours: 1 },
    { label: t("quick_presets.tomorrow"), days: 1 },
    { label: t("quick_presets.next_week"), weeks: 1 },
    { label: t("quick_presets.in_1_month"), days: 30 },
  ])

  // Refs for smooth interactions
  const copyTimeoutRef = useRef<NodeJS.Timeout>()

  // Get current timezone offset for display
  const timezoneOffset = new Date().getTimezoneOffset()
  const timezoneString =
    timezoneOffset <= 0 ? `+${Math.abs(timezoneOffset / 60)}` : `-${timezoneOffset / 60}`

  // Generate timestamp based on current mode
  const generateTimestamp = useCallback(() => {
    let targetDate: Date

    if (mode === "timeframe") {
      // Calculate target date from current time + adjustments
      const now = new Date()
      targetDate = new Date(
        now.getTime() +
          timeAdjustment.weeks * 7 * 24 * 60 * 60 * 1000 +
          timeAdjustment.days * 24 * 60 * 60 * 1000 +
          timeAdjustment.hours * 60 * 60 * 1000 +
          timeAdjustment.minutes * 60 * 1000
      )
    } else {
      // Use absolute date input (converted to UTC)
      targetDate = new Date(
        Date.UTC(
          dateInput.year,
          dateInput.month - 1, // Month is 0-indexed
          dateInput.day,
          dateInput.hour,
          dateInput.minute,
          0
        )
      )
    }

    const unixTimestamp = Math.floor(targetDate.getTime() / 1000)
    const selectedFormat = TIMESTAMP_FORMATS.find((f) => f.id === format)
    const suffix = selectedFormat?.suffix || "R"

    const timestamp = `<t:${unixTimestamp}:${suffix}>`
    setGeneratedTimestamp(timestamp)

    // Generate preview text
    generatePreview(targetDate, suffix)
  }, [mode, format, timeAdjustment, dateInput])

  // Generate preview text for the timestamp
  const generatePreview = (date: Date, suffix: string) => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.ceil(diffMs / (1000 * 60))

    switch (suffix) {
      case "R":
        if (diffMs > 0) {
          if (diffDays > 1) setPreviewText(t("preview_text.in_days", { days: diffDays }))
          else if (diffHours > 1) setPreviewText(t("preview_text.in_hours", { hours: diffHours }))
          else if (diffMinutes > 1)
            setPreviewText(t("preview_text.in_minutes", { minutes: diffMinutes }))
          else setPreviewText(t("preview_text.in_few_seconds"))
        } else {
          const absDays = Math.abs(diffDays)
          const absHours = Math.abs(diffHours)
          const absMinutes = Math.abs(diffMinutes)
          if (absDays > 1) setPreviewText(t("preview_text.days_ago", { days: absDays }))
          else if (absHours > 1) setPreviewText(t("preview_text.hours_ago", { hours: absHours }))
          else if (absMinutes > 1)
            setPreviewText(t("preview_text.minutes_ago", { minutes: absMinutes }))
          else setPreviewText(t("preview_text.few_seconds_ago"))
        }
        break
      case "t":
        setPreviewText(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        break
      case "T":
        setPreviewText(date.toLocaleTimeString())
        break
      case "d":
        setPreviewText(date.toLocaleDateString())
        break
      case "D":
        setPreviewText(
          date.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        )
        break
      case "f":
        setPreviewText(
          date.toLocaleString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        )
        break
      case "F":
        setPreviewText(
          date.toLocaleString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        )
        break
      default:
        setPreviewText("")
    }
  }

  // Adjust time values for timeframe mode
  const adjustTime = (type: keyof TimeAdjustment, amount: number) => {
    setTimeAdjustment((prev) => ({
      ...prev,
      [type]: prev[type] + amount,
    }))
  }

  // Reset all values
  const resetValues = () => {
    setTimeAdjustment({ weeks: 0, days: 0, hours: 0, minutes: 0 })
    const now = new Date()
    setDateInput({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    })
  }

  // Copy timestamp to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTimestamp)
      setCopySuccess(true)

      // Clear existing timeout
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }

      // Set new timeout
      copyTimeoutRef.current = setTimeout(() => {
        setCopySuccess(false)
      }, 2000)
    } catch (err) {
      console.error(t("generated_result.failed_to_copy"), err)
    }
  }

  // Apply quick preset
  const applyQuickPreset = (preset: any) => {
    setMode("timeframe")
    setTimeAdjustment({
      weeks: preset.weeks || 0,
      days: preset.days || 0,
      hours: preset.hours || 0,
      minutes: preset.minutes || 0,
    })
  }

  // Add to favorites
  const addToFavorites = () => {
    const config = { mode, format, timeAdjustment, dateInput }
    const name = `${mode === "timeframe" ? t("saved_configurations.relative_mode") : t("saved_configurations.date_mode")} - ${format}`
    const newFavorite = { name, timestamp: generatedTimestamp, config }

    if (!favorites.find((f) => f.timestamp === generatedTimestamp)) {
      setFavorites((prev) => [...prev, newFavorite])
    }
  }

  // Update timestamp when dependencies change
  useEffect(() => {
    generateTimestamp()
  }, [generateTimestamp])

  // Update timestamp every second for timeframe mode
  useEffect(() => {
    if (mode === "timeframe") {
      const interval = setInterval(generateTimestamp, 1000)
      return () => clearInterval(interval)
    }
  }, [mode, generateTimestamp])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="transition-colors hover:text-slate-200">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">
            {t("breadcrumb.discord_timestamp_generator")}
          </li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Clean Header with Professional Design */}
        <div className="relative mb-16 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
            <Clock className="mr-2 h-4 w-4 text-blue-400" />
            {t("header.professional_badge")}
            <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
          </div>

          <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            <span className="block">{t("header.main_title")}</span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              {t("header.subtitle")}
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
            {t("header.description")}
          </p>
          {/* Quick Stats */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="font-medium">{t("header.stats.real_time_generation")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{t("header.stats.dynamic_timestamps")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{t("header.stats.event_creation")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{t("header.stats.free_generator")}</span>
            </div>
          </div>
        </div>

        {/* Main content area with responsive dual-column layout */}
        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Left control panel - 40% */}
          <div className="space-y-6 lg:col-span-2">
            {/* Mode selection card */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="flex items-center text-lg font-semibold text-white">
                  <ArrowUpDown className="mr-3 h-5 w-5 text-blue-400" />
                  {t("modes.input_mode")}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode("timeframe")}
                    className={`rounded-xl p-4 text-center transition-all duration-300 ${
                      mode === "timeframe"
                        ? "scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "border border-white/20 bg-white/5 text-slate-300 hover:scale-105 hover:bg-white/10"
                    }`}
                  >
                    <Timer className="mx-auto mb-2 h-6 w-6" />
                    <div className="text-sm font-medium">{t("modes.relative_time")}</div>
                    <div className="text-xs opacity-75">{t("modes.relative_time_description")}</div>
                  </button>
                  <button
                    onClick={() => setMode("date")}
                    className={`rounded-xl p-4 text-center transition-all duration-300 ${
                      mode === "date"
                        ? "scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "border border-white/20 bg-white/5 text-slate-300 hover:scale-105 hover:bg-white/10"
                    }`}
                  >
                    <CalendarDays className="mx-auto mb-2 h-6 w-6" />
                    <div className="text-sm font-medium">{t("modes.absolute_time")}</div>
                    <div className="text-xs opacity-75">{t("modes.absolute_time_description")}</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick presets */}
            {mode === "timeframe" && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <div className="border-b border-white/10 px-6 py-4">
                  <h3 className="flex items-center text-lg font-semibold text-white">
                    <Zap className="mr-3 h-5 w-5 text-yellow-400" />
                    {t("quick_presets.title")}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {quickPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyQuickPreset(preset)}
                        className="rounded-lg border border-white/20 bg-white/5 p-3 text-sm font-medium text-slate-300 transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Time adjustment section */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  {mode === "timeframe" ? (
                    <>
                      <Clock className="mr-3 h-5 w-5 text-green-400" />
                      {t("time_adjustment.title")}
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-3 h-5 w-5 text-purple-400" />
                      {t("date_time_settings.title")}
                    </>
                  )}
                </h3>
              </div>
              <div className="p-6">
                {mode === "timeframe" ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {(["weeks", "days", "hours", "minutes"] as const).map((unit) => (
                      <div
                        key={unit}
                        className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm"
                      >
                        <div className="mb-3 text-center">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-300">
                            {unit === "weeks"
                              ? t("time_adjustment.weeks")
                              : unit === "days"
                                ? t("time_adjustment.days")
                                : unit === "hours"
                                  ? t("time_adjustment.hours")
                                  : t("time_adjustment.minutes")}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => adjustTime(unit, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-all duration-200 hover:scale-110 hover:bg-red-500 hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <div className="flex-1 text-center">
                            <span className="text-lg font-semibold text-white">
                              {timeAdjustment[unit]}
                            </span>
                          </div>
                          <button
                            onClick={() => adjustTime(unit, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-all duration-200 hover:scale-110 hover:bg-blue-500 hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                          {t("date_time_settings.year")}
                        </label>
                        <input
                          type="number"
                          value={dateInput.year}
                          onChange={(e) =>
                            setDateInput((prev) => ({
                              ...prev,
                              year: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                          {t("date_time_settings.month")}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={dateInput.month}
                          onChange={(e) =>
                            setDateInput((prev) => ({
                              ...prev,
                              month: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                          {t("date_time_settings.day")}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={dateInput.day}
                          onChange={(e) =>
                            setDateInput((prev) => ({
                              ...prev,
                              day: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                          {t("date_time_settings.hour")}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={dateInput.hour}
                          onChange={(e) =>
                            setDateInput((prev) => ({
                              ...prev,
                              hour: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-3 text-center">
                      <span className="text-xs text-blue-300">
                        {t("date_time_settings.timezone")}
                        {timezoneString}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Format selection - always visible */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  <MessageSquare className="mr-3 h-5 w-5 text-pink-400" />
                  {t("display_format.title")}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {TIMESTAMP_FORMATS.slice(0, 4).map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id)}
                      className={`w-full rounded-xl p-3 text-left transition-all duration-300 ${
                        format === fmt.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "border border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <div className="font-medium">{fmt.label}</div>
                      <div className="text-xs opacity-75">{fmt.description}</div>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full rounded-xl border border-white/20 bg-white/5 p-3 text-center text-sm text-slate-300 transition-all hover:bg-white/10"
                  >
                    {showAdvanced
                      ? t("format_toggle.show_common_formats")
                      : t("format_toggle.show_more_formats")}
                  </button>
                  {showAdvanced && (
                    <div className="space-y-3">
                      {TIMESTAMP_FORMATS.slice(4).map((fmt) => (
                        <button
                          key={fmt.id}
                          onClick={() => setFormat(fmt.id)}
                          className={`w-full rounded-xl p-3 text-left transition-all duration-300 ${
                            format === fmt.id
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                              : "border border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          <div className="font-medium">{fmt.label}</div>
                          <div className="text-xs opacity-75">{fmt.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right preview and output area - 60% */}
          <div className="space-y-6 lg:col-span-3">
            {/* Discord preview */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-lg font-semibold text-white">
                    <Monitor className="mr-3 h-5 w-5 text-blue-400" />
                    {t("preview.discord_preview")}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                    <span className="font-mono">{t("preview.real_time")}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div
                  className="rounded-xl p-6 shadow-inner"
                  style={{
                    background: "linear-gradient(135deg, #36393f, #2f3136)",
                    minHeight: "200px",
                  }}
                >
                  {/* Discord 消息 */}
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-medium text-white">{t("preview.geekskai_bot")}</span>
                        <span className="rounded bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
                          {t("preview.bot_label")}
                        </span>
                        <span className="text-xs text-slate-400">
                          {t("preview.today")}{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-700/50 p-3">
                        <div className="mb-2 text-white">{t("preview.event_reminder")}</div>
                        <div className="text-slate-300">
                          {t("preview.event_starts")}{" "}
                          <span className="rounded bg-blue-600/20 px-2 py-1 font-mono text-sm text-blue-300">
                            {previewText || t("timestamp_formats.relative.example")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated result and actions */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  <RotateCw className="mr-3 h-5 w-5 text-green-400" />
                  {t("generated_result.title")}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Generated code */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      {t("generated_result.discord_timestamp_code")}
                    </label>
                    <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 p-4">
                      <div className="break-all font-mono text-lg text-green-400">
                        {generatedTimestamp}
                      </div>
                    </div>
                  </div>

                  {/* Preview effect */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      {t("generated_result.display_effect")}
                    </label>
                    <div className="rounded-lg bg-blue-500/10 p-4 text-lg text-blue-300">
                      {previewText || t("generated_result.preview_placeholder")}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className={`flex-1 rounded-xl px-6 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                        copySuccess
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      }`}
                    >
                      {copySuccess ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>{t("generated_result.copied")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Copy className="h-5 w-5" />
                          <span>{t("generated_result.copy_code")}</span>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={addToFavorites}
                      className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-slate-300 transition-all hover:bg-white/10"
                    >
                      <BookmarkPlus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={resetValues}
                      className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-slate-300 transition-all hover:bg-white/10"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved configurations */}
            {favorites.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <div className="border-b border-white/10 px-6 py-4">
                  <h3 className="flex items-center text-lg font-semibold text-white">
                    <Star className="mr-3 h-5 w-5 text-yellow-400" />
                    {t("saved_configurations.title")} ({favorites.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-3">
                    {favorites.map((favorite, index) => (
                      <button
                        key={index}
                        className="group rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:bg-white/10"
                        onClick={() => {
                          const config = favorite.config
                          setMode(config.mode)
                          setFormat(config.format)
                          setTimeAdjustment(config.timeAdjustment)
                          setDateInput(config.dateInput)
                        }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-white">{favorite.name}</span>
                          <span className="text-xs text-slate-400">
                            {t("saved_configurations.click_to_apply")}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-slate-300">{favorite.timestamp}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GEO TL;DR Block (Answer Seed) */}
      <div className="mx-auto mb-6 max-w-7xl rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 p-8 shadow-2xl backdrop-blur-sm">
        <h2 className="mb-4 text-2xl font-bold text-white">{t("geo_tldr.title")}</h2>
        <p className="text-lg leading-relaxed text-slate-200">{t("geo_tldr.content")}</p>
      </div>

      {/* Core Facts Section (GEO requirement: Extractable facts) */}
      <div className="mx-auto mb-6 max-w-7xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("core_facts.title")}</h2>
        <dl className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white/5 p-4">
            <dt className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {t("core_facts.pricing_label")}
            </dt>
            <dd className="text-lg font-bold text-green-400">
              <strong>{t("core_facts.pricing_value")}</strong>
            </dd>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <dt className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {t("core_facts.formats_label")}
            </dt>
            <dd className="text-lg font-bold text-blue-400">
              <strong>{t("core_facts.formats_value")}</strong>
            </dd>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <dt className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {t("core_facts.speed_label")}
            </dt>
            <dd className="text-lg font-bold text-purple-400">
              <strong>{t("core_facts.speed_value")}</strong>
            </dd>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <dt className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {t("core_facts.target_users_label")}
            </dt>
            <dd className="text-lg font-bold text-yellow-400">
              <strong>{t("core_facts.target_users_value")}</strong>
            </dd>
          </div>
        </dl>
      </div>

      {/* Modern Features Section */}
      <div className="mt-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">{t("features.title")}</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">{t("features.description")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Clock className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">
              {t("features.real_time_updates.title")}
            </h3>
            <p className="text-lg leading-relaxed text-slate-400">
              {t("features.real_time_updates.description")}
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Zap className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">
              {t("features.multiple_formats.title")}
            </h3>
            <p className="text-lg leading-relaxed text-slate-400">
              {t("features.multiple_formats.description")}
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Star className="h-12 w-12 text-yellow-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">
              {t("features.save_manage.title")}
            </h3>
            <p className="text-lg leading-relaxed text-slate-400">
              {t("features.save_manage.description")}
            </p>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{t("usage_guide.title")}</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {t("usage_guide.description")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_1.title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_1.description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_2.title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_2.description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_3.title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_3.description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_4.title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_4.description")}</p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Discord Timestamp Generation Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.what_is_generation.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  {t.rich("content_sections.what_is_generation.description_2", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.what_is_generation.benefits_title")}
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>
                    •{" "}
                    {t.rich("content_sections.what_is_generation.benefit_1", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("content_sections.what_is_generation.benefit_2", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("content_sections.what_is_generation.benefit_3", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("content_sections.what_is_generation.benefit_4", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("content_sections.what_is_generation.benefit_5", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t.rich("content_sections.what_is_generation.benefit_6", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Discord Timestamp Creation Best Practices */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.best_practices.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.best_practices.event_scheduling.title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    {t("content_sections.best_practices.event_scheduling.format_f_description")}
                  </p>
                  <p>
                    {t("content_sections.best_practices.event_scheduling.format_r_description")}
                  </p>
                  <p>{t("content_sections.best_practices.event_scheduling.use_cases")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.best_practices.countdown_creation.title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>{t("content_sections.best_practices.countdown_creation.auto_update")}</p>
                  <p>{t("content_sections.best_practices.countdown_creation.dynamic_display")}</p>
                  <p>{t("content_sections.best_practices.countdown_creation.ideal_for")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.best_practices.bot_integration.title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>{t("content_sections.best_practices.bot_integration.generate_for_bots")}</p>
                  <p>{t("content_sections.best_practices.bot_integration.scheduled_commands")}</p>
                  <p>{t("content_sections.best_practices.bot_integration.api_compatible")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Discord Timestamp Generator vs Converter */}
          <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.generator_vs_converter.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-green-900/30 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {t("content_sections.generator_vs_converter.generator_section.title")}
                </h3>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.generator_vs_converter.generator_section.description")}
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>
                    • {t("content_sections.generator_vs_converter.generator_section.feature_1")}
                  </li>
                  <li>
                    • {t("content_sections.generator_vs_converter.generator_section.feature_2")}
                  </li>
                  <li>
                    • {t("content_sections.generator_vs_converter.generator_section.feature_3")}
                  </li>
                  <li>
                    • {t("content_sections.generator_vs_converter.generator_section.feature_4")}
                  </li>
                  <li>
                    • {t("content_sections.generator_vs_converter.generator_section.feature_5")}
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-green-900/30 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {t("content_sections.generator_vs_converter.converter_section.title")}
                </h3>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.generator_vs_converter.converter_section.description")}
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>
                    • {t("content_sections.generator_vs_converter.converter_section.feature_1")}
                  </li>
                  <li>
                    • {t("content_sections.generator_vs_converter.converter_section.feature_2")}
                  </li>
                  <li>
                    • {t("content_sections.generator_vs_converter.converter_section.feature_3")}
                  </li>
                  <li>
                    • {t("content_sections.generator_vs_converter.converter_section.feature_4")}
                  </li>
                  <li>
                    • {t("content_sections.generator_vs_converter.converter_section.feature_5")}
                  </li>
                </ul>
                <div className="mt-4">
                  <a
                    href="/tools/discord-time-converter"
                    className="inline-flex items-center text-green-300 transition-colors hover:text-green-200"
                  >
                    {t("content_sections.generator_vs_converter.converter_section.link_text")}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("faq.title")}</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q1.question")}</h3>
                <p className="text-slate-400">{t("faq.q1.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q2.question")}</h3>
                <p className="text-slate-400">{t("faq.q2.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q3.question")}</h3>
                <p className="text-slate-400">{t("faq.q3.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q4.question")}</h3>
                <p className="text-slate-400">{t("faq.q4.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q5.question")}</h3>
                <p className="text-slate-400">{t("faq.q5.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q6.question")}</h3>
                <p className="text-slate-400">{t("faq.q6.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q7.question")}</h3>
                <p className="text-slate-400">{t("faq.q7.answer")}</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q8.question")}</h3>
                <p className="text-slate-400">{t("faq.q8.answer")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
