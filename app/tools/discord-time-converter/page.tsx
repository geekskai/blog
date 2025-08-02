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
          <li className="font-medium text-slate-100">Discord Timestamp Converter</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
            <ArrowLeftRight className="mr-2 h-4 w-4 text-blue-400" />
            Free Discord Timestamp Generator & Converter Tool
            <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
          </div>

          <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            <span className="block">Discord Timestamp</span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Converter & Generator
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
            Free Discord timestamp converter and generator tool. Convert Unix timestamps to Discord
            format, convert Discord timestamps to regular time, and generate all Discord timestamp
            formats with timezone support. Perfect for Discord bot developers, server
            administrators, and community managers scheduling events across global time zones.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">Discord Timestamp Generator</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Global Timezone Support</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Discord Bot Integration</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Free Discord Tool</span>
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

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Discord Timestamp Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              What are Discord Timestamps? Understanding Discord Time Formatting
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  Discord timestamps are special text formats that automatically display time and
                  date information in each user's local timezone. Using the format
                  &lt;t:UNIX_TIMESTAMP:FORMAT&gt;, Discord converts Unix epoch timestamps into
                  human-readable time that adapts to every user's location and language preferences.
                </p>
                <p className="text-slate-200">
                  This Discord timestamp converter helps you generate these special timestamps for
                  scheduling events, coordinating across time zones, and creating dynamic time
                  displays that work perfectly for global Discord communities and servers.
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Discord Timestamp Benefits
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• Automatic timezone conversion for all users</li>
                  <li>• No manual timezone calculations needed</li>
                  <li>• Perfect for global Discord servers</li>
                  <li>• Multiple display formats available</li>
                  <li>• Works in Discord messages and embeds</li>
                  <li>• Compatible with Discord bots and webhooks</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Discord Timestamp Format Types Section */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Discord Timestamp Format Types Explained
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🕐 Time Formats</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:t</code> - Short time
                    (16:20)
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:T</code> - Long time
                    (16:20:30)
                  </p>
                  <p>
                    Perfect for displaying specific times in Discord messages and bot responses.
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">📅 Date Formats</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:d</code> - Short date
                    (20/04/2021)
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:D</code> - Long date
                    (20 April 2021)
                  </p>
                  <p>Ideal for event announcements and date-specific information.</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">📆 Combined Formats</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:f</code> - Short
                    date/time
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:F</code> - Long
                    date/time
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">:R</code> - Relative
                    time (2 hours ago)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Timezone Conversion Guide Section */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Discord Timezone Conversion Guide
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🌍 Global Communities</h3>
                <p className="text-slate-400">
                  Discord timestamps automatically handle timezone conversion for global
                  communities. Users in New York, London, Tokyo, and Sydney all see the same event
                  time in their local timezone without any manual conversion needed.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🤖 Bot Integration</h3>
                <p className="text-slate-400">
                  Discord bots can use our timestamp converter to generate properly formatted
                  timestamps for scheduling commands, reminder systems, and event management
                  features that work across all timezones.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">⚡ Real-time Updates</h3>
                <p className="text-slate-400">
                  Relative timestamps (:R format) update automatically in Discord, showing "in 2
                  hours", "tomorrow", or "3 days ago" and refreshing in real-time as time passes.
                </p>
              </div>
            </div>
          </section>

          {/* Common Use Cases Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Common Discord Timestamp Use Cases
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Gaming Events & Raids</h3>
                    <p className="text-slate-400">
                      Schedule gaming sessions, raids, and tournaments with timestamps that
                      automatically show in each player's local time zone.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Community Meetings</h3>
                    <p className="text-slate-400">
                      Organize community calls, staff meetings, and announcements with precise
                      timing for global Discord communities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Live Streams & Events</h3>
                    <p className="text-slate-400">
                      Announce streaming schedules, live events, and premieres with timestamps that
                      work perfectly for international audiences.
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
                    <h3 className="font-semibold text-white">Bot Commands & Automation</h3>
                    <p className="text-slate-400">
                      Integrate with Discord bots for reminder systems, scheduled messages, and
                      automated event announcements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    5
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Educational Content</h3>
                    <p className="text-slate-400">
                      Schedule online classes, study sessions, and educational events with accurate
                      timing for students in different time zones.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    6
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Business & Professional</h3>
                    <p className="text-slate-400">
                      Coordinate professional meetings, deadlines, and project milestones across
                      distributed teams using Discord for communication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Discord Tools Integration Section */}
          <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Discord Bot Development & Community Tools Integration
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Discord Bot Timestamp Integration
                </h3>
                <p className="mb-4 text-slate-200">
                  Our Discord time converter is the perfect companion for Discord bot developers.
                  Generate timestamps for bot commands, scheduled messages, reminder systems, and
                  automated event announcements. The converter handles all Discord timestamp formats
                  and Unix epoch conversions that Discord bots require.
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• Bot command timestamp generation</li>
                  <li>• Automated scheduling systems</li>
                  <li>• Event reminder notifications</li>
                  <li>• Cross-timezone coordination</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Discord Community Management Tools
                </h3>
                <p className="mb-4 text-slate-200">
                  Essential for Discord server administrators and community managers. Create
                  synchronized events, coordinate global communities, and manage server activities
                  across multiple time zones. Our tool integrates seamlessly with Discord's native
                  timestamp system.
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• Server event coordination</li>
                  <li>• Global community scheduling</li>
                  <li>• Multi-timezone announcements</li>
                  <li>• Discord webhook integration</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Discord Tools Ecosystem & Related Solutions */}
          <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Complete Discord Time Tools Ecosystem
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🆕 Discord Timestamp Generator
                </h3>
                <p className="mb-4 text-slate-200">
                  Need to create new Discord timestamps for events? Use our timestamp generator to
                  build dynamic countdowns, event reminders, and timezone-aware timestamps from
                  scratch.
                </p>
                <a
                  href="/tools/discord-timestamp-generator"
                  className="inline-flex items-center text-orange-300 transition-colors hover:text-orange-200"
                >
                  Try Discord Timestamp Generator →
                </a>
              </div>
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🤖 Discord Bot Integration
                </h3>
                <p className="text-slate-200">
                  Perfect for Discord bot development with timestamp conversion capabilities. Handle
                  scheduling, reminders, and event management across global Discord communities with
                  precise time handling.
                </p>
              </div>
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">⚡ Discord API Tools</h3>
                <p className="text-slate-200">
                  Complete timestamp solution for Discord webhook integrations, custom Discord
                  applications, and third-party tools that interact with Discord's timestamp and
                  time conversion systems.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Frequently Asked Questions About Discord Timestamps
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How do I convert a Discord timestamp back to regular time?
                </h3>
                <p className="text-slate-400">
                  Use our Discord timestamp converter tool in "Discord Timestamp → Time" mode.
                  Simply paste any Discord timestamp (like &lt;t:1640995200:f&gt;) and our tool will
                  convert it back to readable date and time in your timezone, showing all format
                  variations.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What is Unix timestamp and how does it relate to Discord timestamps?
                </h3>
                <p className="text-slate-400">
                  Unix timestamp (also called epoch time) is the number of seconds since January 1,
                  1970 UTC. Discord timestamps use Unix timestamps as their core value, which our
                  converter automatically calculates from your selected date and time, handling all
                  timezone conversions accurately.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I use Discord timestamps in Discord bot development?
                </h3>
                <p className="text-slate-400">
                  Yes! Discord timestamps are perfect for bot development. Use our converter to
                  generate timestamps for bot responses, scheduled messages, reminder systems, and
                  event announcements. The timestamps work in embed fields, descriptions, and
                  regular message content.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Which Discord timestamp format is best for events?
                </h3>
                <p className="text-slate-400">
                  For events, we recommend using the long date/time format (:F) for initial
                  announcements and relative format (:R) for reminders. This combination provides
                  complete information upfront and dynamic countdowns as the event approaches.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How accurate are Discord timestamp timezone conversions?
                </h3>
                <p className="text-slate-400">
                  Discord timestamps are extremely accurate, automatically handling daylight saving
                  time changes, timezone differences, and regional variations. Our converter
                  respects your selected timezone and generates timestamps that work perfectly
                  across all global regions.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I convert multiple timestamps at once?
                </h3>
                <p className="text-slate-400">
                  Yes! Our Discord timestamp converter includes a batch processing feature. You can
                  convert multiple dates or timestamps simultaneously, making it perfect for
                  scheduling multiple events or converting historical data efficiently.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Do Discord timestamps work in all Discord channels?
                </h3>
                <p className="text-slate-400">
                  Discord timestamps work in all text channels, DMs, threads, forum posts, and embed
                  content. They're supported across Discord's web, desktop, and mobile applications,
                  ensuring consistent time display for all users regardless of their platform.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is this Discord timestamp converter free to use?
                </h3>
                <p className="text-slate-400">
                  Yes! Our Discord timestamp converter is completely free with no registration
                  required. Generate unlimited timestamps, convert between formats, use batch
                  processing, and access all timezone conversion features without any restrictions
                  or hidden costs.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How does this Discord time converter compare to Discord alternatives?
                </h3>
                <p className="text-slate-400">
                  Our Discord timestamp converter is specifically designed for Discord's native
                  timestamp system, unlike generic time converters. It supports all Discord
                  timestamp formats, integrates with Discord bot development, and provides
                  Discord-specific features that generic timezone converters don't offer.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I integrate this Discord timestamp generator with Discord bots?
                </h3>
                <p className="text-slate-400">
                  Absolutely! Our Discord timestamp generator is perfect for Discord bot
                  development. Use it to generate timestamps for bot commands, scheduled messages,
                  event reminders, and automated announcements. The generated timestamps work
                  seamlessly with Discord's API and webhook systems.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What Discord community tools work best with timestamp conversion?
                </h3>
                <p className="text-slate-400">
                  Our Discord timestamp converter integrates excellently with Discord server
                  management tools, community scheduling bots, event planning tools, and Discord
                  webhook integrations. It's essential for Discord server administrators managing
                  global communities and coordinating events across multiple time zones.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Features section */}
        <div className="mt-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Professional Discord Timestamp Features
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Everything you need for Discord timestamp conversion and coordination
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <ArrowLeftRight className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">
                Bidirectional Discord Timestamp Conversion
              </h3>
              <p className="text-lg leading-relaxed text-slate-400">
                Convert from regular time to Discord timestamps and convert Discord timestamps back
                to readable time with full format support for all Discord timestamp types.
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <Globe className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">Complete Timezone Support</h3>
              <p className="text-lg leading-relaxed text-slate-400">
                Handle all global timezones with automatic conversion and offset calculations.
                Perfect for international Discord communities and worldwide event coordination.
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <Zap className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">
                Batch Discord Timestamp Processing
              </h3>
              <p className="text-lg leading-relaxed text-slate-400">
                Convert multiple timestamps simultaneously for efficient bulk operations, Discord
                bot development, and large-scale event scheduling across time zones.
              </p>
            </div>
          </div>
        </div>

        {/* Usage guide */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use Discord Timestamp Converter - Complete Guide
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Master Discord timestamp conversion for your server, bot development, and global
              community coordination
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Choose Conversion Direction</h3>
              <p className="text-slate-400">
                Select between converting regular time to Discord timestamp format or converting
                Discord timestamps back to readable time for analysis and debugging.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Input Time Data</h3>
              <p className="text-slate-400">
                Enter your date and time or paste a Discord timestamp. Our converter accepts all
                Discord timestamp formats and handles Unix epoch time conversion automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Configure Timezone</h3>
              <p className="text-slate-400">
                Select your timezone from our comprehensive list for accurate Discord timestamp
                generation. Essential for global Discord communities and international event
                planning.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Copy & Implement</h3>
              <p className="text-slate-400">
                Copy the generated Discord timestamp in your preferred format and paste it into
                Discord messages, bot code, or webhook content for automatic timezone display.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
