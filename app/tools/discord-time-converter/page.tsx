"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  Clock,
  Calendar,
  Copy,
  RotateCcw,
  CheckCircle,
  Sparkles,
  Monitor,
  Home,
  ChevronRight,
  ArrowLeftRight,
  Timer,
  CalendarDays,
  Settings,
  Globe,
  Zap,
  RefreshCw,
  History,
  Share2,
  BookOpen,
  TrendingUp,
  MapPin,
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

const TIMESTAMP_FORMATS: TimestampFormat[] = [
  {
    id: "relative",
    label: "Relative Time",
    description: "Time ago/from now",
    suffix: "R",
    example: "in 2 hours",
  },
  {
    id: "short-time",
    label: "Short Time",
    description: "Time only",
    suffix: "t",
    example: "16:20",
  },
  {
    id: "long-time",
    label: "Long Time",
    description: "Time with seconds",
    suffix: "T",
    example: "16:20:30",
  },
  {
    id: "short-date",
    label: "Short Date",
    description: "Date only",
    suffix: "d",
    example: "20/04/2021",
  },
  {
    id: "long-date",
    label: "Long Date",
    description: "Full date",
    suffix: "D",
    example: "20 April 2021",
  },
  {
    id: "short-full",
    label: "Short Date/Time",
    description: "Date and time",
    suffix: "f",
    example: "20 April 2021 16:20",
  },
  {
    id: "long-full",
    label: "Long Date/Time",
    description: "Full date and time",
    suffix: "F",
    example: "Tuesday, 20 April 2021 16:20",
  },
]

// Common timezones for quick selection
const COMMON_TIMEZONES = [
  {
    value: "UTC",
    label: "UTC",
    description: "Coordinated Universal Time (+00:00)",
    group: "UTC",
  },
  {
    value: "America/New_York",
    label: "Eastern Time",
    description: "New York, Toronto (-05:00)",
    group: "Americas",
  },
  {
    value: "America/Chicago",
    label: "Central Time",
    description: "Chicago, Mexico City (-06:00)",
    group: "Americas",
  },
  {
    value: "America/Denver",
    label: "Mountain Time",
    description: "Denver, Phoenix (-07:00)",
    group: "Americas",
  },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time",
    description: "Los Angeles, Vancouver (-08:00)",
    group: "Americas",
  },
  {
    value: "America/Sao_Paulo",
    label: "Brazil Time",
    description: "São Paulo, Rio de Janeiro (-03:00)",
    group: "Americas",
  },
  {
    value: "Europe/London",
    label: "British Time",
    description: "London, Dublin (+00:00)",
    group: "Europe",
  },
  {
    value: "Europe/Paris",
    label: "Central European Time",
    description: "Paris, Berlin, Rome (+01:00)",
    group: "Europe",
  },
  {
    value: "Europe/Moscow",
    label: "Moscow Time",
    description: "Moscow, Istanbul (+03:00)",
    group: "Europe",
  },
  {
    value: "Asia/Tokyo",
    label: "Japan Standard Time",
    description: "Tokyo, Seoul (+09:00)",
    group: "Asia",
  },
  {
    value: "Asia/Shanghai",
    label: "China Standard Time",
    description: "Beijing, Shanghai (+08:00)",
    group: "Asia",
  },
  {
    value: "Asia/Kolkata",
    label: "India Standard Time",
    description: "Mumbai, Delhi (+05:30)",
    group: "Asia",
  },
  {
    value: "Asia/Dubai",
    label: "Gulf Standard Time",
    description: "Dubai, Abu Dhabi (+04:00)",
    group: "Asia",
  },
  {
    value: "Australia/Sydney",
    label: "Australian Eastern Time",
    description: "Sydney, Melbourne (+11:00)",
    group: "Oceania",
  },
  {
    value: "Pacific/Auckland",
    label: "New Zealand Time",
    description: "Auckland, Wellington (+13:00)",
    group: "Oceania",
  },
]

export default function DiscordTimeConverter() {
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

  // Refs for smooth interactions
  const copyTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-detect user's timezone on mount
  useEffect(() => {
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
  const formatTimestampForDisplay = (unixTime: number, suffix: string): string => {
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
        return formatDistance(date, new Date(), { addSuffix: true })
      default:
        return "Invalid format type"
    }
  }

  // Handle conversion
  const handleConversion = useCallback(() => {
    if (conversionMode === "toTimestamp") {
      // Convert datetime to Discord timestamps using timezone-adjusted time
      const results: Record<string, string> = {}
      TIMESTAMP_FORMATS.forEach((format) => {
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

        TIMESTAMP_FORMATS.forEach((format) => {
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
  }, [conversionMode, adjustedDateTime, inputTimestamp])

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
          results.push(`${trimmedLine} → Invalid date format`)
        }
      } else {
        // Try to parse as Discord timestamp
        const parsed = parseDiscordTimestamp(trimmedLine)
        if (parsed) {
          const date = new Date(parsed.unixTime * 1000)
          results.push(`${trimmedLine} → ${date.toLocaleString()}`)
        } else {
          results.push(`${trimmedLine} → Invalid timestamp format`)
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
  }, [handleConversion])

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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-80"></div>

      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">Home</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="transition-colors hover:text-slate-200">
              Tools
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">Discord Time Converter</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
            <ArrowLeftRight className="mr-2 h-4 w-4 text-blue-400" />
            Professional Discord Time Converter
            <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
          </div>

          <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            <span className="block">Discord</span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Time Converter
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
            Convert between Discord timestamps and regular time formats with full timezone support.
            Perfect for scheduling events, coordinating across time zones, and managing global
            communities.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">Dual Direction</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="font-medium">All Timezones</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Batch Processing</span>
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
                  Conversion Mode
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
                    <div className="text-sm font-medium">Time → Discord Timestamp</div>
                    <div className="text-xs opacity-75">Convert regular time to Discord format</div>
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
                    <div className="text-sm font-medium">Discord Timestamp → Time</div>
                    <div className="text-xs opacity-75">Convert Discord format to regular time</div>
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
                      Time Input
                    </>
                  ) : (
                    <>
                      <Monitor className="mr-3 h-5 w-5 text-purple-400" />
                      Discord Timestamp Input
                    </>
                  )}
                </h3>
              </div>
              <div className="p-6">
                {conversionMode === "toTimestamp" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Select Date & Time
                      </label>
                      <CustomDateTimePicker
                        value={inputDateTime}
                        onChange={setInputDateTime}
                        placeholder="Select date and time"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => applyQuickPreset(1)}
                          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/10"
                        >
                          +1 Hour
                        </button>
                        <button
                          onClick={() => applyQuickPreset(24)}
                          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/10"
                        >
                          +1 Day
                        </button>
                        <button
                          onClick={() => applyQuickPreset(168)}
                          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/10"
                        >
                          +1 Week
                        </button>
                      </div>

                      {/* Time of day presets (from reference project) */}
                      <div>
                        <p className="mb-2 text-xs font-medium text-slate-400">Set Time</p>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => applyTimePreset(9, 0)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            9am
                          </button>
                          <button
                            onClick={() => applyTimePreset(12, 0)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            Noon
                          </button>
                          <button
                            onClick={() => applyTimePreset(18, 0)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            6pm
                          </button>
                          <button
                            onClick={() => applyTimePreset(21, 0)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            9pm
                          </button>
                        </div>
                      </div>

                      {/* Next week presets (from reference project) */}
                      <div>
                        <p className="mb-2 text-xs font-medium text-slate-400">Next Week</p>
                        <div className="grid grid-cols-5 gap-1">
                          <button
                            onClick={() => applyWeekdayPreset(1)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            Mon
                          </button>
                          <button
                            onClick={() => applyWeekdayPreset(2)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            Tue
                          </button>
                          <button
                            onClick={() => applyWeekdayPreset(3)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            Wed
                          </button>
                          <button
                            onClick={() => applyWeekdayPreset(4)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            Thu
                          </button>
                          <button
                            onClick={() => applyWeekdayPreset(5)}
                            className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-300 transition-all hover:bg-white/10"
                          >
                            Fri
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Discord Timestamp
                      </label>
                      <input
                        type="text"
                        value={inputTimestamp}
                        onChange={(e) => setInputTimestamp(e.target.value)}
                        placeholder="<t:1640995200:f>"
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-3">
                      <p className="text-xs text-blue-300">
                        Format: &lt;t:timestamp:format&gt; (e.g., &lt;t:1640995200:f&gt;)
                      </p>
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
                  Timezone
                </h3>
              </div>
              <div className="p-6">
                <CustomSelector
                  options={COMMON_TIMEZONES}
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                  placeholder="Select your timezone"
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
                    Conversion Results
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                    <span className="font-mono">Live Preview</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Full date combinations (from reference project) */}
                  {conversionMode === "toTimestamp" && (
                    <div className="space-y-3 rounded-lg bg-slate-800/50 p-4">
                      <p className="text-sm font-medium text-slate-300">Quick Copy Combinations</p>
                      {(() => {
                        const unixTime = Math.floor(adjustedDateTime.getTime() / 1000)
                        const combinations = [
                          {
                            label: "Date, Time & Relative",
                            code: `<t:${unixTime}:d> <t:${unixTime}:t>, <t:${unixTime}:R>`,
                            preview: `${formatTimestampForDisplay(unixTime, "d")} ${formatTimestampForDisplay(unixTime, "t")}, ${formatTimestampForDisplay(unixTime, "R")}`,
                          },
                          {
                            label: "Full Date & Relative",
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
                    {TIMESTAMP_FORMATS.map((format) => {
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
                {showBatch ? "Hide" : "Show"} Batch Converter
              </button>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm text-slate-300 transition-all hover:bg-white/10"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Features
              </button>
            </div>

            {/* Batch converter */}
            {showBatch && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <div className="border-b border-white/10 px-6 py-4">
                  <h3 className="flex items-center text-lg font-semibold text-white">
                    <Zap className="mr-3 h-5 w-5 text-yellow-400" />
                    Batch Converter
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Input (one per line)
                      </label>
                      <textarea
                        value={batchInput}
                        onChange={(e) => setBatchInput(e.target.value)}
                        placeholder={
                          conversionMode === "toTimestamp"
                            ? "2024-01-01 12:00:00\n2024-02-01 15:30:00"
                            : "<t:1640995200:f>\n<t:1640995500:R>"
                        }
                        className="h-32 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <button
                      onClick={handleBatchConversion}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02]"
                    >
                      Convert All
                    </button>
                    {batchResults.length > 0 && (
                      <div className="rounded-lg bg-slate-800/50 p-4">
                        <h4 className="mb-2 font-medium text-white">Results:</h4>
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
                    Conversion History
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
                            {item.type === "toTimestamp" ? "Time → Timestamp" : "Timestamp → Time"}
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

        {/* Features section */}
        <div className="mt-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Professional Features</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Everything you need for Discord time conversion and coordination
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <ArrowLeftRight className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">Bidirectional Conversion</h3>
              <p className="text-lg leading-relaxed text-slate-400">
                Convert from time to Discord timestamps and vice versa with full format support.
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <Globe className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">Global Timezone Support</h3>
              <p className="text-lg leading-relaxed text-slate-400">
                Handle all major timezones with automatic conversion and offset calculations.
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <Zap className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">Batch Processing</h3>
              <p className="text-lg leading-relaxed text-slate-400">
                Convert multiple timestamps at once for efficient bulk operations and data
                migration.
              </p>
            </div>
          </div>
        </div>

        {/* Usage guide */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use Discord Time Converter
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Master time conversion for your Discord community in simple steps
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Choose Direction</h3>
              <p className="text-slate-400">
                Select whether you want to convert time to Discord timestamp or the reverse.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Input Your Data</h3>
              <p className="text-slate-400">
                Enter your time or Discord timestamp. The converter accepts multiple formats.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Set Timezone</h3>
              <p className="text-slate-400">
                Choose your timezone for accurate conversion and display in all Discord formats.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Copy & Use</h3>
              <p className="text-slate-400">
                Copy the generated Discord timestamp and paste it into your Discord messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
