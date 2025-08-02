"use client"

import { useState, useEffect, useRef } from "react"
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

export default function TimestampGenerator() {
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

  // Refs for smooth interactions
  const copyTimeoutRef = useRef<NodeJS.Timeout>()

  // Get current timezone offset for display
  const timezoneOffset = new Date().getTimezoneOffset()
  const timezoneString =
    timezoneOffset <= 0 ? `+${Math.abs(timezoneOffset / 60)}` : `-${timezoneOffset / 60}`

  // Generate timestamp based on current mode
  const generateTimestamp = () => {
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
  }

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

  // Update timestamp when dependencies change
  useEffect(() => {
    generateTimestamp()
  }, [mode, format, timeAdjustment, dateInput])

  // Update timestamp every second for timeframe mode
  useEffect(() => {
    if (mode === "timeframe") {
      const interval = setInterval(generateTimestamp, 1000)
      return () => clearInterval(interval)
    }
  }, [mode, timeAdjustment, format])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="rounded-3xl bg-white/50 p-8 shadow-xl ring-1 ring-slate-200 backdrop-blur-xl dark:bg-slate-800/50 dark:ring-slate-700">
      {/* Mode Selection */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
          Select Input Mode
        </h2>
        <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-700">
          <button
            onClick={() => setMode("timeframe")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              mode === "timeframe"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Timeframe (Relative)
            </div>
          </button>
          <button
            onClick={() => setMode("date")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              mode === "date"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Specific Date
            </div>
          </button>
        </div>
      </div>

      {/* Timeframe Mode */}
      {mode === "timeframe" && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
            Adjust Time Offset
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["weeks", "days", "hours", "minutes"] as const).map((unit) => (
              <div key={unit} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                <div className="mb-3 text-center">
                  <span className="text-sm font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
                    {unit}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => adjustTime(unit, -1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all duration-200 hover:scale-110 hover:bg-red-500 hover:text-white dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-red-500"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      {timeAdjustment[unit]}
                    </span>
                  </div>
                  <button
                    onClick={() => adjustTime(unit, 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all duration-200 hover:scale-110 hover:bg-blue-500 hover:text-white dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date Mode */}
      {mode === "date" && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
            Set Specific Date & Time
            <span className="ml-2 text-sm font-normal text-slate-500">(UTC{timezoneString})</span>
          </h3>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Year
              </label>
              <input
                type="number"
                value={dateInput.year}
                onChange={(e) =>
                  setDateInput((prev) => ({ ...prev, year: parseInt(e.target.value) || 0 }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Month
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={dateInput.month}
                onChange={(e) =>
                  setDateInput((prev) => ({ ...prev, month: parseInt(e.target.value) || 1 }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Day
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={dateInput.day}
                onChange={(e) =>
                  setDateInput((prev) => ({ ...prev, day: parseInt(e.target.value) || 1 }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Hour
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={dateInput.hour}
                onChange={(e) =>
                  setDateInput((prev) => ({ ...prev, hour: parseInt(e.target.value) || 0 }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Minute
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={dateInput.minute}
                onChange={(e) =>
                  setDateInput((prev) => ({ ...prev, minute: parseInt(e.target.value) || 0 }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Format Selection */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
          Choose Display Format
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TIMESTAMP_FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setFormat(fmt.id)}
              className={`rounded-xl p-4 text-left transition-all duration-300 ${
                format === fmt.id
                  ? "scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-slate-50 text-slate-900 hover:scale-105 hover:bg-slate-100 dark:bg-slate-700/50 dark:text-white dark:hover:bg-slate-700"
              }`}
            >
              <div className="font-medium">{fmt.label}</div>
              <div
                className={`text-sm ${
                  format === fmt.id ? "text-blue-100" : "text-slate-600 dark:text-slate-300"
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

      {/* Generated Timestamp */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Generated Timestamp
          </h3>
          <button
            onClick={resetValues}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-slate-600 transition-all duration-200 hover:scale-105 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Discord timestamp code:</span>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  copySuccess
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-white hover:scale-105 hover:bg-blue-700"
                }`}
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="mt-2 rounded-lg bg-slate-800 p-3 font-mono text-green-400">
              {generatedTimestamp}
            </div>
          </div>

          <div>
            <span className="text-sm text-slate-400">Preview in Discord:</span>
            <div className="mt-2 rounded-lg bg-slate-800 p-3 text-slate-200">{previewText}</div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">How to Use</h4>
            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>1. Select your preferred input mode (timeframe or specific date)</li>
              <li>2. Adjust the time values or set your target date</li>
              <li>3. Choose how you want the timestamp to be displayed</li>
              <li>4. Copy the generated code and paste it into any Discord message</li>
              <li>
                5. The timestamp will automatically display correctly for all users in their
                timezone!
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
