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
  Settings,
  Info,
  ExternalLink,
  Sparkles,
  Monitor,
  Home,
  ChevronRight,
  Zap,
  Eye,
  EyeOff,
  Star,
  Heart,
  Type,
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
  const [showSettings, setShowSettings] = useState(true)
  const [activeTab, setActiveTab] = useState<"input" | "formats" | "preview">("input")
  const [favorites, setFavorites] = useState<
    Array<{ name: string; timestamp: string; config: any }>
  >([])

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

        {/* Main Content with Improved Layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Modern Preview Area */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-semibold text-white">
                    <Monitor className="mr-3 h-5 w-5 text-blue-400" />
                    Live Preview
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                      <span className="font-mono">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div
                  className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #36393f, #2f3136)",
                    minHeight: "300px",
                  }}
                >
                  {/* Discord Message Preview */}
                  <div className="flex h-full flex-col p-8">
                    {/* Discord Message Header */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">GeeksKai</span>
                          <span className="rounded bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
                            BOT
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Today at{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="rounded-lg bg-slate-700/50 p-4 backdrop-blur-sm">
                      <div className="mb-3 text-lg font-medium text-white">🎉 Event Reminder</div>
                      <div className="text-slate-300">
                        The big event starts{" "}
                        <span className="rounded bg-blue-600/20 px-2 py-1 font-mono text-sm text-blue-300 transition-all duration-300">
                          {previewText || "in 2 hours"}
                        </span>
                      </div>

                      {/* Generated Timestamp Display */}
                      <div className="mt-4 rounded border border-slate-600/50 bg-slate-800/50 p-3">
                        <div className="mb-2 text-xs text-slate-400">Generated timestamp code:</div>
                        <div className="break-all font-mono text-green-400">
                          {generatedTimestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Action Buttons */}

              <div className="flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:justify-center">
                <button
                  onClick={addToFavorites}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] sm:min-w-[140px]"
                >
                  <Heart className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Save</span>
                </button>

                <button
                  onClick={resetValues}
                  className="flex items-center justify-center space-x-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98] sm:min-w-[140px]"
                >
                  <RotateCcw className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Reset</span>
                </button>

                <button
                  onClick={copyToClipboard}
                  className={`w-full max-w-md rounded-2xl px-8 py-5 text-lg font-bold shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] ${
                    copySuccess
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  }`}
                >
                  {copySuccess ? (
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0" />
                      <span className="whitespace-nowrap">Copied!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Copy className="h-6 w-6 flex-shrink-0" />
                      <span className="whitespace-nowrap">Copy Code</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Modern Favorites Section */}
            {favorites.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <div className="border-b border-white/10 px-6 py-4">
                  <h3 className="flex items-center text-lg font-semibold text-white">
                    <Star className="mr-3 h-5 w-5 text-yellow-400" />
                    Saved Configurations ({favorites.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {favorites.map((favorite, index) => (
                      <button
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10"
                        onClick={() => {
                          const config = favorite.config
                          setMode(config.mode)
                          setFormat(config.format)
                          setTimeAdjustment(config.timeAdjustment)
                          setDateInput(config.dateInput)
                        }}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-medium text-white transition-colors group-hover:text-blue-300">
                            {favorite.name}
                          </h4>
                          <span className="text-xs text-slate-400">Click to apply</span>
                        </div>
                        <div className="break-all font-mono text-xs text-slate-300">
                          {favorite.timestamp}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modern Settings Panel */}
          <div className="space-y-6 lg:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-semibold text-white">
                    <Settings className="mr-3 h-5 w-5 text-slate-400" />
                    Customization
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="rounded-xl p-2 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
                    >
                      {showSettings ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {showSettings && (
                <div className="p-6">
                  {/* Modern Tab Navigation */}
                  <div className="mb-8 flex rounded-xl border border-white/10 bg-white/10 p-1.5 backdrop-blur-sm">
                    {(["input", "formats", "preview"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                          activeTab === tab
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="space-y-6">
                    {/* Input Tab */}
                    {activeTab === "input" && (
                      <div className="space-y-6">
                        <h3 className="flex items-center text-sm font-medium text-slate-300">
                          <Type className="mr-2 h-4 w-4" />
                          Input Configuration
                        </h3>

                        {/* Mode Selection */}
                        <div>
                          <label className="mb-3 block text-sm font-medium text-slate-300">
                            Input Mode
                          </label>
                          <div className="flex rounded-xl border border-white/20 bg-white/5 p-1 backdrop-blur-sm">
                            <button
                              onClick={() => setMode("timeframe")}
                              className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                mode === "timeframe"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Clock className="h-4 w-4" />
                                Relative
                              </div>
                            </button>
                            <button
                              onClick={() => setMode("date")}
                              className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                mode === "date"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Absolute
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Timeframe Mode */}
                        {mode === "timeframe" && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-300">Time Adjustment</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {(["weeks", "days", "hours", "minutes"] as const).map((unit) => (
                                <div
                                  key={unit}
                                  className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm"
                                >
                                  <div className="mb-3 text-center">
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-300">
                                      {unit}
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
                          </div>
                        )}

                        {/* Date Mode */}
                        {mode === "date" && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-300">
                              Specific Date & Time
                              <span className="ml-2 text-xs font-normal text-slate-500">
                                (UTC{timezoneString})
                              </span>
                            </h4>
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
                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                  Day
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
                          </div>
                        )}
                      </div>
                    )}

                    {/* Formats Tab */}
                    {activeTab === "formats" && (
                      <div className="space-y-6">
                        <h3 className="flex items-center text-sm font-medium text-slate-300">
                          <Zap className="mr-2 h-4 w-4" />
                          Display Formats
                        </h3>
                        <div className="grid gap-3">
                          {TIMESTAMP_FORMATS.map((fmt) => (
                            <button
                              key={fmt.id}
                              onClick={() => setFormat(fmt.id)}
                              className={`rounded-xl p-4 text-left transition-all duration-300 ${
                                format === fmt.id
                                  ? "scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                  : "border border-white/20 bg-white/5 text-slate-300 backdrop-blur-sm hover:scale-105 hover:bg-white/10"
                              }`}
                            >
                              <div className="font-medium">{fmt.label}</div>
                              <div
                                className={`text-xs ${
                                  format === fmt.id ? "text-blue-100" : "text-slate-400"
                                }`}
                              >
                                {fmt.description}
                              </div>
                              <div
                                className={`mt-1 font-mono text-xs ${
                                  format === fmt.id ? "text-blue-200" : "text-slate-500"
                                }`}
                              >
                                e.g., {fmt.example}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preview Tab */}
                    {activeTab === "preview" && (
                      <div className="space-y-6">
                        <h3 className="flex items-center text-sm font-medium text-slate-300">
                          <Monitor className="mr-2 h-4 w-4" />
                          Preview Options
                        </h3>

                        <div className="space-y-4">
                          <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                            <h4 className="mb-3 font-medium text-white">Current Configuration</h4>
                            <div className="space-y-2 text-sm text-slate-300">
                              <div>
                                Mode:{" "}
                                <span className="text-blue-300">
                                  {mode === "timeframe" ? "Relative" : "Absolute Date"}
                                </span>
                              </div>
                              <div>
                                Format:{" "}
                                <span className="text-purple-300">
                                  {TIMESTAMP_FORMATS.find((f) => f.id === format)?.label}
                                </span>
                              </div>
                              <div>
                                Timezone:{" "}
                                <span className="text-green-300">UTC{timezoneString}</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                            <h4 className="mb-3 font-medium text-white">Generated Code</h4>
                            <div className="break-all rounded-lg bg-slate-800/50 p-3 font-mono text-xs text-green-400">
                              {generatedTimestamp}
                            </div>
                          </div>

                          <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                            <h4 className="mb-3 font-medium text-white">Live Preview</h4>
                            <div className="rounded-lg bg-slate-800/50 p-3 text-sm text-blue-300">
                              {previewText || "Preview will appear here"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
