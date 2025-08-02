"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  Heart,
  Timer,
  CalendarDays,
  MessageSquare,
  BookmarkPlus,
  RotateCw,
  ArrowUpDown,
} from "lucide-react"

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

const TIMESTAMP_FORMATS: TimestampFormat[] = [
  {
    id: "relative",
    label: "Relative",
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

export default function DiscordTimestampGenerator() {
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
    { label: "In 1 hour", hours: 1 },
    { label: "Tomorrow", days: 1 },
    { label: "Next week", weeks: 1 },
    { label: "In 1 month", days: 30 },
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
          if (diffDays > 1) setPreviewText(`in ${diffDays} days`)
          else if (diffHours > 1) setPreviewText(`in ${diffHours} hours`)
          else if (diffMinutes > 1) setPreviewText(`in ${diffMinutes} minutes`)
          else setPreviewText("in a few seconds")
        } else {
          const absDays = Math.abs(diffDays)
          const absHours = Math.abs(diffHours)
          const absMinutes = Math.abs(diffMinutes)
          if (absDays > 1) setPreviewText(`${absDays} days ago`)
          else if (absHours > 1) setPreviewText(`${absHours} hours ago`)
          else if (absMinutes > 1) setPreviewText(`${absMinutes} minutes ago`)
          else setPreviewText("a few seconds ago")
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
      console.error("Failed to copy:", err)
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
    const name = `${mode === "timeframe" ? "Relative" : "Date"} - ${format}`
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
      {/* Subtle geometric background pattern */}
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

      {/* Subtle gradient overlay */}
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
          <li className="font-medium text-slate-100">Discord Timestamp Generator</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Clean Header with Professional Design */}
        <div className="relative mb-16 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
            <Clock className="mr-2 h-4 w-4 text-blue-400" />
            Professional Discord Timestamps
            <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
          </div>

          <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            <span className="block">Discord</span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Timestamp Generator
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
            Create dynamic timestamps that automatically update in Discord messages. Perfect for
            events, deadlines, and countdowns that work seamlessly across all timezones with
            professional precision.
          </p>
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
                  Input Mode
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
                    <div className="text-sm font-medium">Relative Time</div>
                    <div className="text-xs opacity-75">e.g., "in 2 hours"</div>
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
                    <div className="text-sm font-medium">Absolute Time</div>
                    <div className="text-xs opacity-75">Specific date & time</div>
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
                    Quick Presets
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
                      Time Adjustment
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-3 h-5 w-5 text-purple-400" />
                      Date & Time Settings
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
                              ? "Weeks"
                              : unit === "days"
                                ? "Days"
                                : unit === "hours"
                                  ? "Hours"
                                  : "Minutes"}
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
                          Year
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
                          Month
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
                        <label className="mb-2 block text-xs font-medium text-slate-400">Day</label>
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
                          Hour
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
                      <span className="text-xs text-blue-300">Timezone: UTC{timezoneString}</span>
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
                  Display Format
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
                    {showAdvanced ? "Show Common Formats" : "Show More Formats"}
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
                    Discord Preview
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                    <span className="font-mono">Real-time</span>
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
                        <span className="font-medium text-white">GeeksKai</span>
                        <span className="rounded bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
                          BOT
                        </span>
                        <span className="text-xs text-slate-400">
                          Today{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-700/50 p-3">
                        <div className="mb-2 text-white">🎉 Event Reminder</div>
                        <div className="text-slate-300">
                          The big event starts{" "}
                          <span className="rounded bg-blue-600/20 px-2 py-1 font-mono text-sm text-blue-300">
                            {previewText || "in 2 hours"}
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
                  Generated Result
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Generated code */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Discord Timestamp Code
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
                      Display Effect
                    </label>
                    <div className="rounded-lg bg-blue-500/10 p-4 text-lg text-blue-300">
                      {previewText || "Preview will appear here"}
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
                          <span>Copied!</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Copy className="h-5 w-5" />
                          <span>Copy Code</span>
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
                    Saved Configurations ({favorites.length})
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
                          <span className="text-xs text-slate-400">Click to apply</span>
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

      {/* Modern Features Section */}
      <div className="mt-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Professional-Grade Features</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">
            Everything you need to create perfect Discord timestamps with precision and style
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Clock className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">Real-time Updates</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              Live preview with automatic timezone conversion and instant format switching for
              precise timestamp generation.
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Zap className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">Multiple Formats</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              Seven different timestamp formats including relative time, date formats, and combined
              date-time displays.
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Star className="h-12 w-12 text-yellow-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">Save & Manage</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              Save favorite configurations and easily manage your timestamp settings for quick
              access and reuse across different projects.
            </p>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">How to Create Perfect Timestamps</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Follow these simple steps to generate professional Discord timestamps
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Choose Input Mode</h3>
              <p className="text-slate-400">
                Select between relative time adjustments or absolute date input based on your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Set Your Time</h3>
              <p className="text-slate-400">
                Adjust time values or enter specific dates. Watch the live preview update in
                real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Choose Format</h3>
              <p className="text-slate-400">
                Select from seven different display formats to match your message context perfectly.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Copy & Use</h3>
              <p className="text-slate-400">
                Copy the generated code and paste it into any Discord message for automatic timezone
                conversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
