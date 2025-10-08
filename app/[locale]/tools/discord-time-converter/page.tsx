"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useTranslations } from "next-intl"
import {
  Clock,
  Copy,
  CheckCircle,
  Sparkles,
  Monitor,
  Home,
  ChevronRight,
  ArrowLeftRight,
  Timer,
  CalendarDays,
  Globe,
  Zap,
  RefreshCw,
  History,
  BookOpen,
  TrendingUp,
} from "lucide-react"
import { format, formatDistance } from "date-fns"
import CustomDateTimePicker from "@/components/ui/CustomDateTimePicker"
import CustomSelector from "@/components/ui/CustomSelector"

// Type definitions
interface TimestampFormat {
  id: string
  label: string
  description: string
  suffix: string
  example: string
}

interface ConversionHistory {
  id: string
  input: string
  output: string
  type: "toTimestamp" | "fromTimestamp"
  timestamp: number
}

// Removed redundant TIMESTAMP_FORMATS - using TIMESTAMP_FORMATS_I18N instead

// Removed redundant COMMON_TIMEZONES - using COMMON_TIMEZONES_I18N instead

export default function DiscordTimeConverter() {
  // Translations
  const t = useTranslations("DiscordTimeConverter")

  // Dynamic timestamp formats with translations
  const TIMESTAMP_FORMATS_I18N: TimestampFormat[] = useMemo(
    () => [
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
    ],
    [t]
  )

  // Dynamic timezone options with translations
  const COMMON_TIMEZONES_I18N = useMemo(
    () => [
      {
        value: "UTC",
        label: t("common_timezones.utc.label"),
        description: t("common_timezones.utc.description"),
        group: t("timezone_groups.utc"),
      },
      {
        value: "America/New_York",
        label: t("common_timezones.america_new_york.label"),
        description: t("common_timezones.america_new_york.description"),
        group: t("timezone_groups.americas"),
      },
      {
        value: "America/Chicago",
        label: t("common_timezones.america_chicago.label"),
        description: t("common_timezones.america_chicago.description"),
        group: t("timezone_groups.americas"),
      },
      {
        value: "America/Denver",
        label: t("common_timezones.america_denver.label"),
        description: t("common_timezones.america_denver.description"),
        group: t("timezone_groups.americas"),
      },
      {
        value: "America/Los_Angeles",
        label: t("common_timezones.america_los_angeles.label"),
        description: t("common_timezones.america_los_angeles.description"),
        group: t("timezone_groups.americas"),
      },
      {
        value: "America/Sao_Paulo",
        label: t("common_timezones.america_sao_paulo.label"),
        description: t("common_timezones.america_sao_paulo.description"),
        group: t("timezone_groups.americas"),
      },
      {
        value: "Europe/London",
        label: t("common_timezones.europe_london.label"),
        description: t("common_timezones.europe_london.description"),
        group: t("timezone_groups.europe"),
      },
      {
        value: "Europe/Paris",
        label: t("common_timezones.europe_paris.label"),
        description: t("common_timezones.europe_paris.description"),
        group: t("timezone_groups.europe"),
      },
      {
        value: "Europe/Moscow",
        label: t("common_timezones.europe_moscow.label"),
        description: t("common_timezones.europe_moscow.description"),
        group: t("timezone_groups.europe"),
      },
      {
        value: "Asia/Tokyo",
        label: t("common_timezones.asia_tokyo.label"),
        description: t("common_timezones.asia_tokyo.description"),
        group: t("timezone_groups.asia"),
      },
      {
        value: "Asia/Shanghai",
        label: t("common_timezones.asia_shanghai.label"),
        description: t("common_timezones.asia_shanghai.description"),
        group: t("timezone_groups.asia"),
      },
      {
        value: "Asia/Kolkata",
        label: t("common_timezones.asia_kolkata.label"),
        description: t("common_timezones.asia_kolkata.description"),
        group: t("timezone_groups.asia"),
      },
      {
        value: "Asia/Dubai",
        label: t("common_timezones.asia_dubai.label"),
        description: t("common_timezones.asia_dubai.description"),
        group: t("timezone_groups.asia"),
      },
      {
        value: "Australia/Sydney",
        label: t("common_timezones.australia_sydney.label"),
        description: t("common_timezones.australia_sydney.description"),
        group: t("timezone_groups.oceania"),
      },
      {
        value: "Pacific/Auckland",
        label: t("common_timezones.pacific_auckland.label"),
        description: t("common_timezones.pacific_auckland.description"),
        group: t("timezone_groups.oceania"),
      },
    ],
    [t]
  )

  // State management
  const [conversionMode, setConversionMode] = useState<"toTimestamp" | "fromTimestamp">(
    "toTimestamp"
  )
  const [inputDateTime, setInputDateTime] = useState<Date>(new Date())
  const [inputTimestamp, setInputTimestamp] = useState<string>("")
  const [selectedTimezone, setSelectedTimezone] = useState<string>("")
  const [generatedResults, setGeneratedResults] = useState<Record<string, string>>({})
  const [copySuccess, setCopySuccess] = useState<string>("")
  const [conversionHistory, setConversionHistory] = useState<ConversionHistory[]>([])
  const [batchInput, setBatchInput] = useState<string>("")
  const [batchResults, setBatchResults] = useState<string[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Refs for smooth interactions
  const copyTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-detect user's timezone on mount and set client flag
  useEffect(() => {
    setIsClient(true)
    const dateTimeFormat = new Intl.DateTimeFormat(navigator.language)
    const { timeZone } = dateTimeFormat.resolvedOptions()
    setSelectedTimezone(timeZone)
  }, [])

  // Timezone conversion helper (from reference project)
  const getOffsetBetweenTimezones = (timezone1: string, timezone2: string) => {
    const date1 = new Date().toLocaleString("en-US", { timeZone: timezone1 })
    const date2 = new Date().toLocaleString("en-US", { timeZone: timezone2 })
    return (new Date(date1).getTime() - new Date(date2).getTime()) / 3600000
  }

  // Calculate adjusted datetime based on timezone
  const adjustedDateTime = useMemo(() => {
    if (!selectedTimezone || selectedTimezone === "UTC") return inputDateTime

    const finalDate = new Date(inputDateTime)
    const dateTimeFormat = new Intl.DateTimeFormat(navigator.language)
    const { timeZone: localTz } = dateTimeFormat.resolvedOptions()
    const offset = getOffsetBetweenTimezones(localTz, selectedTimezone)
    finalDate.setMinutes(finalDate.getMinutes() + 60 * offset)
    return finalDate
  }, [inputDateTime, selectedTimezone])

  // Parse Discord timestamp
  const parseDiscordTimestamp = (
    timestamp: string
  ): { unixTime: number; format: string } | null => {
    const match = timestamp.match(/^<t:(\d+)(?::([tTdDfFR]))?>$/)
    if (!match) return null

    const unixTime = parseInt(match[1])
    const format = match[2] || "f" // Default format
    return { unixTime, format }
  }

  // Generate Discord timestamp
  const generateDiscordTimestamp = (date: Date, format: string): string => {
    const unixTime = Math.floor(date.getTime() / 1000)
    return `<t:${unixTime}:${format}>`
  }

  // Format timestamp for display using date-fns (like reference project)
  const formatTimestampForDisplay = useCallback(
    (unixTime: number, suffix: string): string => {
      const date = new Date(unixTime * 1000)

      switch (suffix) {
        case "t":
          return format(date, "h:mm a")
        case "T":
          return format(date, "h:mm:ss a")
        case "d":
          return format(date, "MM/dd/yyyy")
        case "D":
          return format(date, "MMMM d, yyyy")
        case "f":
          return format(date, "MMMM d, yyyy h:mm a")
        case "F":
          return format(date, "EEEE, MMMM d, yyyy h:mm a")
        case "R":
          // Only show relative time on client to avoid hydration issues
          if (!isClient) return "relative time"
          return formatDistance(date, new Date(), { addSuffix: true })
        default:
          return t("info_messages.invalid_format_type")
      }
    },
    [t, isClient]
  )

  // Handle conversion
  const handleConversion = useCallback(() => {
    if (conversionMode === "toTimestamp") {
      // Convert datetime to Discord timestamps using timezone-adjusted time
      const results: Record<string, string> = {}
      TIMESTAMP_FORMATS_I18N.forEach((format) => {
        const timestamp = generateDiscordTimestamp(adjustedDateTime, format.suffix)
        results[format.id] = timestamp
      })
      setGeneratedResults(results)

      // Add to history
      const historyItem: ConversionHistory = {
        id: Date.now().toString(),
        input: inputDateTime.toLocaleString(),
        output: results.relative,
        type: "toTimestamp",
        timestamp: Date.now(),
      }
      setConversionHistory((prev) => [historyItem, ...prev.slice(0, 9)]) // Keep last 10
    } else {
      // Convert Discord timestamp to datetime
      const parsed = parseDiscordTimestamp(inputTimestamp.trim())
      if (parsed) {
        const date = new Date(parsed.unixTime * 1000)
        const results: Record<string, string> = {}

        TIMESTAMP_FORMATS_I18N.forEach((format) => {
          const timestamp = generateDiscordTimestamp(date, format.suffix)
          const display = formatTimestampForDisplay(parsed.unixTime, format.suffix)
          results[format.id] = `${timestamp} → ${display}`
        })

        setGeneratedResults(results)
        setInputDateTime(date) // Update datetime input

        // Add to history
        const historyItem: ConversionHistory = {
          id: Date.now().toString(),
          input: inputTimestamp,
          output: date.toLocaleString(),
          type: "fromTimestamp",
          timestamp: Date.now(),
        }
        setConversionHistory((prev) => [historyItem, ...prev.slice(0, 9)])
      }
    }
  }, [
    conversionMode,
    adjustedDateTime,
    inputDateTime,
    inputTimestamp,
    TIMESTAMP_FORMATS_I18N,
    formatTimestampForDisplay,
  ])

  // Handle batch conversion
  const handleBatchConversion = () => {
    const lines = batchInput.split("\n").filter((line) => line.trim())
    const results: string[] = []

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (conversionMode === "toTimestamp") {
        // Try to parse as date
        const date = new Date(trimmedLine)
        if (!isNaN(date.getTime())) {
          const timestamp = generateDiscordTimestamp(date, "f")
          results.push(`${trimmedLine} → ${timestamp}`)
        } else {
          results.push(`${trimmedLine} → ${t("info_messages.invalid_format_type")}`)
        }
      } else {
        // Try to parse as Discord timestamp
        const parsed = parseDiscordTimestamp(trimmedLine)
        if (parsed) {
          const date = new Date(parsed.unixTime * 1000)
          results.push(`${trimmedLine} → ${date.toLocaleString()}`)
        } else {
          results.push(`${trimmedLine} → ${t("info_messages.invalid_format_type")}`)
        }
      }
    })

    setBatchResults(results)
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string, id: string = "default") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(id)

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopySuccess("")
      }, 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Quick time presets from reference project
  const applyQuickPreset = (hours: number) => {
    const now = new Date()
    now.setHours(now.getHours() + hours)
    setInputDateTime(now)
  }

  // Time of day presets (like reference project)
  const applyTimePreset = (hour: number, minute: number = 0) => {
    const newDate = new Date(inputDateTime)
    newDate.setHours(hour, minute, 0, 0)
    setInputDateTime(newDate)
  }

  // Next weekday presets (from reference project logic)
  const applyWeekdayPreset = (targetDay: number) => {
    const now = new Date()
    const currentDay = now.getDay()
    const daysToAdd = ((targetDay - currentDay) % 7) + 7 // Next occurrence
    const newDate = new Date(now)
    newDate.setDate(now.getDate() + daysToAdd)
    newDate.setMonth(now.getMonth())
    newDate.setFullYear(now.getFullYear())
    setInputDateTime(newDate)
  }

  // Effect to trigger conversion when inputs change
  useEffect(() => {
    if (
      conversionMode === "toTimestamp" ||
      (conversionMode === "fromTimestamp" && inputTimestamp)
    ) {
      handleConversion()
    }
  }, [handleConversion, conversionMode, inputTimestamp])

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
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="transition-colors hover:text-slate-200">
              {t("breadcrumb.tools")}
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb.discord_time_converter")}</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
            <ArrowLeftRight className="mr-2 h-4 w-4 text-blue-400" />
            {t("header.badge_text")}
            <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
          </div>

          <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            <span className="block">{t("header.main_title_line1")}</span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              {t("header.main_title_line2")}
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
            {t("header.description")}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">{t("header.stats.timezone_converter")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{t("header.stats.global_timezone")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{t("header.stats.bot_integration")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{t("header.stats.free_tool")}</span>
            </div>
          </div>
        </div>

        {/* Main conversion area */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left panel - Input controls */}
          <div className="space-y-6 lg:col-span-1">
            {/* Conversion mode toggle */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="flex items-center text-lg font-semibold text-white">
                  <ArrowLeftRight className="mr-3 h-5 w-5 text-blue-400" />
                  {t("input_sections.conversion_mode")}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setConversionMode("toTimestamp")}
                    className={`rounded-xl p-4 text-center transition-all duration-300 ${
                      conversionMode === "toTimestamp"
                        ? "scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "border border-white/20 bg-white/5 text-slate-300 hover:scale-105 hover:bg-white/10"
                    }`}
                  >
                    <Timer className="mx-auto mb-2 h-6 w-6" />
                    <div className="text-sm font-medium">
                      {t("conversion_modes.to_timestamp.title")}
                    </div>
                    <div className="text-xs opacity-75">
                      {t("conversion_modes.to_timestamp.description")}
                    </div>
                  </button>
                  <button
                    onClick={() => setConversionMode("fromTimestamp")}
                    className={`rounded-xl p-4 text-center transition-all duration-300 ${
                      conversionMode === "fromTimestamp"
                        ? "scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "border border-white/20 bg-white/5 text-slate-300 hover:scale-105 hover:bg-white/10"
                    }`}
                  >
                    <CalendarDays className="mx-auto mb-2 h-6 w-6" />
                    <div className="text-sm font-medium">
                      {t("conversion_modes.from_timestamp.title")}
                    </div>
                    <div className="text-xs opacity-75">
                      {t("conversion_modes.from_timestamp.description")}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Input section */}
            <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  {conversionMode === "toTimestamp" ? (
                    <>
                      <Clock className="mr-3 h-5 w-5 text-green-400" />
                      {t("input_sections.time_input")}
                    </>
                  ) : (
                    <>
                      <Monitor className="mr-3 h-5 w-5 text-purple-400" />
                      {t("input_sections.discord_timestamp_input")}
                    </>
                  )}
                </h3>
              </div>
              <div className="p-6">
                {conversionMode === "toTimestamp" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        {t("form_labels.select_date_time")}
                      </label>
                      <CustomDateTimePicker
                        value={inputDateTime}
                        onChange={setInputDateTime}
                        placeholder={t("placeholders.select_date_time")}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => applyQuickPreset(1)}
                          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/10"
                        >
                          {t("buttons.plus_1_hour")}
                        </button>
                        <button
                          onClick={() => applyQuickPreset(24)}
                          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/10"
                        >
                          {t("buttons.plus_1_day")}
                        </button>
                        <button
                          onClick={() => applyQuickPreset(168)}
                          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/10"
                        >
                          {t("buttons.plus_1_week")}
                        </button>
                      </div>

                      {/* Time of day presets (from reference project) */}
                      <div>
                        <p className="mb-2 text-xs font-medium text-slate-400">
                          {t("buttons.set_time")}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => applyTimePreset(9, 0)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.9am")}
                          </button>
                          <button
                            onClick={() => applyTimePreset(12, 0)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.noon")}
                          </button>
                          <button
                            onClick={() => applyTimePreset(18, 0)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.6pm")}
                          </button>
                          <button
                            onClick={() => applyTimePreset(21, 0)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.9pm")}
                          </button>
                        </div>
                      </div>

                      {/* Next week presets (from reference project) */}
                      <div>
                        <p className="mb-2 text-xs font-medium text-slate-400">
                          {t("buttons.next_week")}
                        </p>
                        <div className="grid grid-cols-5 gap-1">
                          <button
                            onClick={() => applyWeekdayPreset(1)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.mon")}
                          </button>
                          <button
                            onClick={() => applyWeekdayPreset(2)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.tue")}
                          </button>
                          <button
                            onClick={() => applyWeekdayPreset(3)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.wed")}
                          </button>
                          <button
                            onClick={() => applyWeekdayPreset(4)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.thu")}
                          </button>
                          <button
                            onClick={() => applyWeekdayPreset(5)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            {t("buttons.fri")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        {t("form_labels.discord_timestamp")}
                      </label>
                      <input
                        type="text"
                        value={inputTimestamp}
                        onChange={(e) => setInputTimestamp(e.target.value)}
                        placeholder={t("placeholders.discord_timestamp")}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-3">
                      <p className="text-xs text-blue-300">{t("info_messages.format_info")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timezone selector */}
            <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  <Globe className="mr-3 h-5 w-5 text-cyan-400" />
                  {t("input_sections.timezone")}
                </h3>
              </div>
              <div className="p-6">
                <CustomSelector
                  options={COMMON_TIMEZONES_I18N}
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                  placeholder={t("form_labels.select_timezone")}
                  searchable={true}
                  clearable={false}
                  icon={<Globe className="h-4 w-4" />}
                  maxHeight="max-h-80"
                />
              </div>
            </div>
          </div>

          {/* Center panel - Results */}
          <div className="space-y-6 lg:col-span-2">
            {/* Main results */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-lg font-semibold text-white">
                    <RefreshCw className="mr-3 h-5 w-5 text-green-400" />
                    {t("results.conversion_results")}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                    <span className="font-mono">{t("results.live_preview")}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Full date combinations (from reference project) */}
                  {conversionMode === "toTimestamp" && isClient && (
                    <div className="space-y-3 rounded-lg bg-slate-800/50 p-4">
                      <p className="text-sm font-medium text-slate-300">
                        {t("results.quick_copy_combinations")}
                      </p>
                      {(() => {
                        const unixTime = Math.floor(adjustedDateTime.getTime() / 1000)
                        const combinations = [
                          {
                            label: t("results.date_time_relative"),
                            code: `<t:${unixTime}:d> <t:${unixTime}:t>, <t:${unixTime}:R>`,
                            preview: `${formatTimestampForDisplay(unixTime, "d")} ${formatTimestampForDisplay(unixTime, "t")}, ${formatTimestampForDisplay(unixTime, "R")}`,
                          },
                          {
                            label: t("results.full_date_relative"),
                            code: `<t:${unixTime}:f>, <t:${unixTime}:R>`,
                            preview: `${formatTimestampForDisplay(unixTime, "f")}, ${formatTimestampForDisplay(unixTime, "R")}`,
                          },
                        ]

                        return combinations.map((combo, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-white/20 bg-white/5 p-3"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="text-sm font-medium text-white">{combo.label}</h4>
                              <button
                                onClick={() => copyToClipboard(combo.code, `combo-${index}`)}
                                className={`rounded-lg p-2 transition-all ${
                                  copySuccess === `combo-${index}`
                                    ? "bg-green-500 text-white"
                                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                                }`}
                              >
                                {copySuccess === `combo-${index}` ? (
                                  <CheckCircle className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <div className="mb-1 font-mono text-xs text-green-400">
                              {combo.code}
                            </div>
                            <div className="text-xs text-slate-400">{combo.preview}</div>
                          </div>
                        ))
                      })()}
                    </div>
                  )}

                  {/* Individual format results */}
                  <div className="grid gap-4">
                    {TIMESTAMP_FORMATS_I18N.map((format) => {
                      const result = generatedResults[format.id]
                      if (!result) return null

                      return (
                        <div
                          key={format.id}
                          className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium text-white">{format.label}</h3>
                            <button
                              onClick={() => copyToClipboard(result.split(" → ")[0], format.id)}
                              className={`rounded-lg p-2 transition-all ${
                                copySuccess === format.id
                                  ? "bg-green-500 text-white"
                                  : "bg-white/10 text-slate-300 hover:bg-white/20"
                              }`}
                            >
                              {copySuccess === format.id ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <div className="mb-2 text-xs text-slate-400">{format.description}</div>
                          <div className="break-all font-mono text-sm text-green-400">{result}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced features toggle */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowBatch(!showBatch)}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm text-slate-300 transition-all hover:bg-white/10"
              >
                {showBatch ? t("buttons.hide_batch") : t("buttons.show_batch")}
              </button>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm text-slate-300 transition-all hover:bg-white/10"
              >
                {showAdvanced ? t("buttons.hide_advanced") : t("buttons.show_advanced")}
              </button>
            </div>

            {/* Batch converter */}
            {showBatch && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <div className="border-b border-white/10 px-6 py-4">
                  <h3 className="flex items-center text-lg font-semibold text-white">
                    <Zap className="mr-3 h-5 w-5 text-yellow-400" />
                    {t("advanced_features.batch_converter")}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        {t("form_labels.input_one_per_line")}
                      </label>
                      <textarea
                        value={batchInput}
                        onChange={(e) => setBatchInput(e.target.value)}
                        placeholder={
                          conversionMode === "toTimestamp"
                            ? t("placeholders.batch_to_timestamp")
                            : t("placeholders.batch_from_timestamp")
                        }
                        className="h-32 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <button
                      onClick={handleBatchConversion}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02]"
                    >
                      {t("buttons.convert_all")}
                    </button>
                    {batchResults.length > 0 && (
                      <div className="rounded-lg bg-slate-800/50 p-4">
                        <h4 className="mb-2 font-medium text-white">
                          {t("advanced_features.results_label")}
                        </h4>
                        <div className="space-y-1 text-sm">
                          {batchResults.map((result, index) => (
                            <div key={index} className="font-mono text-green-400">
                              {result}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {showAdvanced && conversionHistory.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <div className="border-b border-white/10 px-6 py-4">
                  <h3 className="flex items-center text-lg font-semibold text-white">
                    <History className="mr-3 h-5 w-5 text-orange-400" />
                    {t("advanced_features.conversion_history")}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {conversionHistory.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            {item.type === "toTimestamp"
                              ? t("conversion_modes.to_timestamp.title")
                              : t("conversion_modes.from_timestamp.title")}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="mt-1 font-mono text-sm text-slate-300">
                          {item.input} → {item.output}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Usage guide */}
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
                {t("usage_guide.step_1_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_1_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_2_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_2_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_3_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_3_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_4_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_4_description")}</p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Discord Timestamp Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.what_are_discord_timestamps.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.what_are_discord_timestamps.description_1")}
                </p>
                <p className="text-slate-200">
                  {t("content_sections.what_are_discord_timestamps.description_2")}
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.what_are_discord_timestamps.benefits_title")}
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• {t("content_sections.what_are_discord_timestamps.benefit_1")}</li>
                  <li>• {t("content_sections.what_are_discord_timestamps.benefit_2")}</li>
                  <li>• {t("content_sections.what_are_discord_timestamps.benefit_3")}</li>
                  <li>• {t("content_sections.what_are_discord_timestamps.benefit_4")}</li>
                  <li>• {t("content_sections.what_are_discord_timestamps.benefit_5")}</li>
                  <li>• {t("content_sections.what_are_discord_timestamps.benefit_6")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Discord Timestamp Format Types Section */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.timestamp_format_types.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.timestamp_format_types.time_formats_title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:t</code> -{" "}
                    {t("timestamp_formats.short_time.label")}(
                    {t("timestamp_formats.short_time.example")})
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:T</code> -{" "}
                    {t("timestamp_formats.long_time.label")}(
                    {t("timestamp_formats.long_time.example")})
                  </p>
                  <p>{t("content_sections.timestamp_format_types.time_formats_description")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.timestamp_format_types.date_formats_title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:d</code> -{" "}
                    {t("timestamp_formats.short_date.label")}(
                    {t("timestamp_formats.short_date.example")})
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:D</code> -{" "}
                    {t("timestamp_formats.long_date.label")}(
                    {t("timestamp_formats.long_date.example")})
                  </p>
                  <p>{t("content_sections.timestamp_format_types.date_formats_description")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.timestamp_format_types.combined_formats_title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:f</code> -{" "}
                    {t("timestamp_formats.short_full.label")}
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:F</code> -{" "}
                    {t("timestamp_formats.long_full.label")}
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:R</code> -{" "}
                    {t("timestamp_formats.relative.label")} (
                    {t("timestamp_formats.relative.example")})
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Timezone Conversion Guide Section */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.timezone_converter_guide.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.timezone_converter_guide.global_communities_title")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.timezone_converter_guide.global_communities_description")}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.timezone_converter_guide.bot_integration_title")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.timezone_converter_guide.bot_integration_description")}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.timezone_converter_guide.realtime_updates_title")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.timezone_converter_guide.realtime_updates_description")}
                </p>
              </div>
            </div>
          </section>

          {/* Common Use Cases Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.common_use_cases.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.common_use_cases.gaming_events.title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.common_use_cases.gaming_events.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.common_use_cases.community_meetings.title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.common_use_cases.community_meetings.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.common_use_cases.live_streams.title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.common_use_cases.live_streams.description")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.common_use_cases.bot_commands.title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.common_use_cases.bot_commands.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    5
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.common_use_cases.educational_content.title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.common_use_cases.educational_content.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    6
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.common_use_cases.business_professional.title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.common_use_cases.business_professional.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Discord Tools Integration Section */}
          <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.bot_development.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {t("content_sections.bot_development.bot_timestamp_integration_title")}
                </h3>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.bot_development.bot_timestamp_integration_description")}
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• {t("content_sections.bot_development.bot_features_1")}</li>
                  <li>• {t("content_sections.bot_development.bot_features_2")}</li>
                  <li>• {t("content_sections.bot_development.bot_features_3")}</li>
                  <li>• {t("content_sections.bot_development.bot_features_4")}</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {t("content_sections.bot_development.community_management_title")}
                </h3>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.bot_development.community_management_description")}
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• {t("content_sections.bot_development.community_features_1")}</li>
                  <li>• {t("content_sections.bot_development.community_features_2")}</li>
                  <li>• {t("content_sections.bot_development.community_features_3")}</li>
                  <li>• {t("content_sections.bot_development.community_features_4")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Discord Tools Ecosystem & Related Solutions */}
          <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.tools_ecosystem.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.tools_ecosystem.timestamp_generator_title")}
                </h3>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.tools_ecosystem.timestamp_generator_description")}
                </p>
                <a
                  href="/tools/discord-timestamp-generator"
                  className="inline-flex items-center text-orange-300 transition-colors hover:text-orange-200"
                >
                  {t("content_sections.tools_ecosystem.timestamp_generator_link")}
                </a>
              </div>
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.tools_ecosystem.bot_integration_title")}
                </h3>
                <p className="text-slate-200">
                  {t("content_sections.tools_ecosystem.bot_integration_description")}
                </p>
              </div>
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.tools_ecosystem.api_tools_title")}
                </h3>
                <p className="text-slate-200">
                  {t("content_sections.tools_ecosystem.api_tools_description")}
                </p>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                {t("content_sections.features.title")}
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                {t("content_sections.features.description")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <ArrowLeftRight className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.features.bidirectional_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.features.bidirectional_description")}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Globe className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.features.global_timezone_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.features.global_timezone_description")}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Zap className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.features.batch_processing_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.features.batch_processing_description")}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.faq.title")}
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q1")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a1")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q2")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a2")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q3")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a3")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q4")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a4")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q5")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a5")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q6")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a6")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q7")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a7")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q8")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a8")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q9")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a9")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q10")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a10")}</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q11")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a11")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
