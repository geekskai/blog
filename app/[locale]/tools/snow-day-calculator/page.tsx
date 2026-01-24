"use client"

import React from "react"
import { useState, useCallback, useEffect } from "react"
import {
  Snowflake,
  MapPin,
  Thermometer,
  Wind,
  Eye,
  CloudSnow,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react"
import { Link } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"

interface WeatherData {
  location: {
    name: string
    country: string
    coordinates?: { lat: number; lon: number }
  }
  current: {
    temperature: number
    feelsLike: number
    humidity: number
    pressure: number
    description: string
    icon: string
    windSpeed: number
    windSpeedKmh: number
    visibility: number
    visibilityKm: number
    snowfall: number
    cloudCover: number
  }
  snowDay: {
    probability: number
    level: string
    color: string
    recommendation: string
    factors: {
      snowfall: { value: number; impact: number; description: string }
      temperature: { value: number; impact: number; description: string }
      windSpeed: { value: number; impact: number; description: string }
      visibility: { value: number; impact: number; description: string }
      baseScore: { value: number; impact: number; description: string }
    }
  }
  timestamp: string
}

export default function SnowDayCalculator() {
  const t = useTranslations("SnowDayCalculator")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [error, setError] = useState("")
  const [searchType, setSearchType] = useState<"zip" | "city" | "coords">("zip")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)

  // Load search history on client side only to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
    try {
      const saved = localStorage.getItem("snow-day-search-history")
      if (saved) {
        setSearchHistory(JSON.parse(saved))
      }
    } catch {
      // localStorage not available or invalid data
    }
  }, [])

  // Input validation functions
  const validateInput = (
    input: string,
    type: "zip" | "city" | "coords"
  ): { isValid: boolean; error?: string } => {
    const trimmedInput = input.trim()

    if (!trimmedInput) {
      return { isValid: false, error: t("search.errors.enter_location") }
    }

    switch (type) {
      case "zip": {
        const zipPatterns = [
          /^\d{5}$/, // US ZIP: 12345
          /^\d{5}-\d{4}$/, // US ZIP+4: 12345-6789
          /^[A-Za-z]\d[A-Za-z]\s*\d[A-Za-z]\d$/, // Canadian: K1A 0A6
          /^\d{4,6}$/, // International numeric: 1000-123456
          /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2}$/, // UK: SW1A 1AA
        ]
        const isValidZip = zipPatterns.some((pattern) => pattern.test(trimmedInput))
        if (!isValidZip) {
          return { isValid: false, error: t("search.errors.invalid_zip") }
        }
        break
      }

      case "coords": {
        const coordPattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/
        if (!coordPattern.test(trimmedInput)) {
          return {
            isValid: false,
            error: t("search.errors.invalid_coords_format"),
          }
        }
        const parts = trimmedInput.split(",").map((p) => p.trim())
        if (parts.length !== 2) {
          return { isValid: false, error: t("search.errors.missing_coords") }
        }
        const lat = parseFloat(parts[0])
        const lon = parseFloat(parts[1])
        if (isNaN(lat) || isNaN(lon)) {
          return { isValid: false, error: t("search.errors.invalid_coords_numbers") }
        }
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          return { isValid: false, error: t("search.errors.invalid_coords_range") }
        }
        break
      }

      case "city": {
        if (trimmedInput.length < 2) {
          return { isValid: false, error: t("search.errors.city_too_short") }
        }
        break
      }
    }

    return { isValid: true }
  }

  const searchWeather = useCallback(
    async (query: string, type?: "city" | "coords" | "zip") => {
      const searchWithType = type || searchType

      // Validate input based on selected type
      const validation = validateInput(query, searchWithType)
      if (!validation.isValid) {
        setError(validation.error!)
        return
      }

      setLoading(true)
      setError("")

      // Create an abort controller for this request
      const abortController = new AbortController()

      try {
        const params = new URLSearchParams({ type: searchWithType })

        if (searchWithType === "city") {
          params.append("q", query)
        } else if (searchWithType === "coords") {
          const coordParts = query.split(",")
          const lat = parseFloat(coordParts[0].trim())
          const lon = parseFloat(coordParts[1].trim())
          params.append("lat", lat.toString())
          params.append("lon", lon.toString())
        } else if (searchWithType === "zip") {
          params.append("zip", query)
        }

        const response = await fetch(`/api/weather?${params}`, {
          signal: abortController.signal,
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || t("search.errors.fetch_failed"))
        }

        setWeatherData(data)

        // Add to search history (avoid duplicates)
        const locationName = data.location.name
        setSearchHistory((prev) => {
          const filtered = prev.filter((item) => item !== locationName)
          const newHistory = [locationName, ...filtered].slice(0, 5)

          // Save to localStorage
          try {
            localStorage.setItem("snow-day-search-history", JSON.stringify(newHistory))
          } catch {
            // localStorage not available, continue without saving
          }

          return newHistory
        })
      } catch (err) {
        // Don't update state if request was aborted
        if (err instanceof Error && err.name === "AbortError") {
          return
        }
        setError(err instanceof Error ? err.message : t("search.errors.unknown_error"))
        setWeatherData(null)
      } finally {
        setLoading(false)
      }

      // Return cleanup function
      return () => abortController.abort()
    },
    [searchType]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchWeather(location, searchType)
  }

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setError(t("search.errors.geolocation_not_supported"))
      return
    }

    setLoading(true)
    setError("") // Clear any previous errors

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`
        setLocation(coords)
        setSearchType("coords")
        searchWeather(coords, "coords")
      },
      (error) => {
        setLoading(false)
        let errorMessage = t("search.errors.unable_to_get_location")

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += t("search.errors.location_denied")
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += t("search.errors.location_unavailable")
            break
          case error.TIMEOUT:
            errorMessage += t("search.errors.location_timeout")
            break
          default:
            errorMessage += t("search.errors.location_default")
            break
        }

        setError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds timeout
        maximumAge: 300000, // Cache for 5 minutes
      }
    )
  }

  const getProbabilityColor = (probability: number) => {
    if (probability <= 20) return "from-green-500 to-green-600"
    if (probability <= 40) return "from-yellow-400 to-yellow-500"
    if (probability <= 60) return "from-orange-400 to-orange-500"
    if (probability <= 80) return "from-red-400 to-red-500"
    return "from-red-600 to-red-700"
  }

  const getProbabilityTextColor = (probability: number) => {
    if (probability <= 20) return "text-green-600"
    if (probability <= 40) return "text-yellow-600"
    if (probability <= 60) return "text-orange-600"
    if (probability <= 80) return "text-red-600"
    return "text-red-700"
  }

  const getPlaceholderText = (type: "zip" | "city" | "coords") => {
    switch (type) {
      case "zip":
        return t("search.input.zip_placeholder")
      case "city":
        return t("search.input.city_placeholder")
      case "coords":
        return t("search.input.coords_placeholder")
      default:
        return t("search.input.zip_placeholder")
    }
  }

  const getExampleText = (type: "zip" | "city" | "coords") => {
    switch (type) {
      case "zip":
        return t("search.input.zip_examples").split(", ")
      case "city":
        return t("search.input.city_examples").split(", ")
      case "coords":
        return t("search.input.coords_examples").split(", ")
      default:
        return []
    }
  }

  // FAQ data with SEO-optimized questions and answers
  const faqData = [
    {
      question: t("faq.items.accuracy.question"),
      answer: t("faq.items.accuracy.answer"),
    },
    {
      question: t("faq.items.factors.question"),
      answer: t("faq.items.factors.answer"),
    },
    {
      question: t("faq.items.worldwide.question"),
      answer: t("faq.items.worldwide.answer"),
    },
    {
      question: t("faq.items.best_time.question"),
      answer: t("faq.items.best_time.answer"),
    },
    {
      question: t("faq.items.free.question"),
      answer: t("faq.items.free.answer"),
    },
    {
      question: t("faq.items.update_frequency.question"),
      answer: t("faq.items.update_frequency.answer"),
    },
    {
      question: t("faq.items.different_results.question"),
      answer: t("faq.items.different_results.answer"),
    },
    {
      question: t("faq.items.save_locations.question"),
      answer: t("faq.items.save_locations.answer"),
    },
    {
      question: t("faq.items.search_difference.question"),
      answer: t("faq.items.search_difference.answer"),
    },
    {
      question: t("faq.items.algorithm_comparison.question"),
      answer: t("faq.items.algorithm_comparison.answer"),
    },
    {
      question: t("faq.items.planning.question"),
      answer: t("faq.items.planning.answer"),
    },
    {
      question: t("faq.items.private_schools.question"),
      answer: t("faq.items.private_schools.answer"),
    },
    {
      question: t("faq.items.daylight_saving.question"),
      answer: t("faq.items.daylight_saving.answer"),
    },
    {
      question: t("faq.items.error_handling.question"),
      answer: t("faq.items.error_handling.answer"),
    },
    {
      question: t("faq.items.other_weather.question"),
      answer: t("faq.items.other_weather.answer"),
    },
    {
      question: t("faq.items.comparison.question"),
      answer: t("faq.items.comparison.answer"),
    },
  ]

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
            <Link href="/" className="flex items-center transition-colors hover:text-slate-200">
              <MapPin className="h-4 w-4" />
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
          <li className="font-medium text-slate-100">{t("breadcrumb.snow_day_calculator")}</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
            <Snowflake className="mr-2 h-4 w-4 text-blue-400" />
            {t.rich("header.badge", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
            <CloudSnow className="ml-2 h-4 w-4 text-purple-400" />
          </div>

          <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            <span className="block">{t("header.title_line1")}</span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              {t("header.title_line2")}
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
            {t.rich("header.description", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
          </p>

          {/* Core Facts Section - Optimized for AI Retrieval */}
          <div className="mx-auto mb-8 max-w-4xl">
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 via-purple-900/15 to-indigo-900/20 p-6 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-2xl font-bold text-white">
                  <strong className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {t("header.core_facts.free.label")}
                  </strong>
                </div>
                <div className="text-sm text-slate-400">
                  {t.rich("header.core_facts.free.description", {
                    strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-2xl font-bold text-white">
                  <strong className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {t("header.core_facts.realtime.label")}
                  </strong>
                </div>
                <div className="text-sm text-slate-400">
                  {t.rich("header.core_facts.realtime.description", {
                    strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-2xl font-bold text-white">
                  <strong className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {t("header.core_facts.global.label")}
                  </strong>
                </div>
                <div className="text-sm text-slate-400">
                  {t.rich("header.core_facts.global.description", {
                    strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-2xl font-bold text-white">
                  <strong className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    {t("header.core_facts.instant.label")}
                  </strong>
                </div>
                <div className="text-sm text-slate-400">
                  {t.rich("header.core_facts.instant.description", {
                    strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span className="font-medium">
                {t.rich("header.stats.realtime_api", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Wind className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {t.rich("header.stats.scientific_algorithm", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Eye className="h-4 w-4 text-purple-500" />
              <span className="font-medium">
                {t.rich("header.stats.worldwide_locations", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Info className="h-4 w-4 text-green-500" />
              <span className="font-medium">
                {t.rich("header.stats.free_forever", {
                  strong: (chunks) => <strong className="text-green-400">{chunks}</strong>,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mx-auto mb-16 max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-purple-900/20 to-indigo-900/25 p-8 shadow-2xl backdrop-blur-xl">
            {/* Animated background elements */}
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl"></div>
            <div className="absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-2xl"></div>

            <div className="relative">
              {/* Search Type Selector */}
              <div className="mb-10">
                <div className="mb-6 text-center">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-6 py-3 backdrop-blur-sm">
                    <span className="text-2xl">🔍</span>
                    <h2 className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-2xl font-bold text-transparent">
                      {t("search.type_selector.title")}
                    </h2>
                  </div>
                  <p className="mx-auto max-w-2xl text-slate-300">
                    {t.rich("search.type_selector.description", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {[
                    {
                      type: "zip" as const,
                      icon: "📮",
                      label: t("search.type_selector.zip.label"),
                      examples: getExampleText("zip"),
                      color: "blue",
                      gradient: "from-blue-500/15 to-cyan-500/10",
                      borderColor: "border-blue-500/30",
                      hoverBorder: "hover:border-blue-400/50",
                      iconBg: "bg-gradient-to-br from-blue-400 to-cyan-500",
                      textColor: "text-blue-300",
                    },
                    {
                      type: "city" as const,
                      icon: "📍",
                      label: t("search.type_selector.city.label"),
                      examples: getExampleText("city"),
                      color: "emerald",
                      gradient: "from-emerald-500/15 to-teal-500/10",
                      borderColor: "border-emerald-500/30",
                      hoverBorder: "hover:border-emerald-400/50",
                      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
                      textColor: "text-emerald-300",
                    },
                    {
                      type: "coords" as const,
                      icon: "🌐",
                      label: t("search.type_selector.coords.label"),
                      examples: getExampleText("coords"),
                      color: "purple",
                      gradient: "from-purple-500/15 to-pink-500/10",
                      borderColor: "border-purple-500/30",
                      hoverBorder: "hover:border-purple-400/50",
                      iconBg: "bg-gradient-to-br from-purple-400 to-pink-500",
                      textColor: "text-purple-300",
                    },
                  ].map(
                    ({
                      type,
                      icon,
                      label,
                      examples,
                      gradient,
                      borderColor,
                      hoverBorder,
                      iconBg,
                      textColor,
                    }) => (
                      <label
                        key={type}
                        className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 transition-all duration-500 ${
                          searchType === type
                            ? `${borderColor.replace("/30", "/50")} bg-gradient-to-br ${gradient.replace("/15", "/20").replace("/10", "/15")} shadow-xl shadow-${type === "zip" ? "blue" : type === "city" ? "emerald" : "purple"}-500/25`
                            : `to-white/2 border-white/20 bg-gradient-to-br from-white/5 ${hoverBorder} hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5`
                        }`}
                      >
                        <input
                          type="radio"
                          name="searchType"
                          value={type}
                          checked={searchType === type}
                          onChange={(e) => {
                            setSearchType(e.target.value as "zip" | "city" | "coords")
                            setLocation("") // Clear input when switching types
                            setError("") // Clear any errors
                          }}
                          className="sr-only"
                        />

                        {/* Animated background overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 ${searchType === type ? "opacity-100" : "group-hover:opacity-50"}`}
                        ></div>

                        <div className="relative flex flex-col items-center text-center">
                          <div
                            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${searchType === type ? iconBg : "bg-white/10"} shadow-lg transition-all duration-300`}
                          >
                            <span className="text-2xl">{icon}</span>
                          </div>
                          <div
                            className={`mb-3 text-lg font-bold transition-colors ${
                              searchType === type ? textColor : "text-white"
                            }`}
                          >
                            {label}
                          </div>
                          <div className="space-y-1 text-xs text-slate-400">
                            {examples.slice(0, 2).map((example, i) => (
                              <div key={i} className="rounded-md bg-black/20 px-2 py-1 font-mono">
                                {example}
                              </div>
                            ))}
                          </div>

                          {/* Selection indicator */}
                          {searchType === type && (
                            <div className="mt-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                              <div
                                className={`h-2 w-2 rounded-full bg-gradient-to-r ${iconBg.replace("bg-gradient-to-br", "")}`}
                              ></div>
                              <span className="text-xs font-medium text-white">
                                {t("search.type_selector.selected")}
                              </span>
                            </div>
                          )}
                        </div>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-6 text-center">
                  <h3 className="mb-3 text-2xl font-bold text-white">
                    {t("search.type_selector.enter_your")}{" "}
                    <span
                      className={`${searchType === "zip" ? "text-blue-300" : searchType === "city" ? "text-emerald-300" : "text-purple-300"}`}
                    >
                      {searchType === "zip"
                        ? t("search.type_selector.zip.label")
                        : searchType === "city"
                          ? t("search.type_selector.city.label")
                          : t("search.type_selector.coords.label")}
                    </span>
                  </h3>
                  <p className="mx-auto max-w-2xl text-slate-300">
                    {searchType === "zip" && t("search.type_selector.zip.description")}
                    {searchType === "city" && t("search.type_selector.city.description")}
                    {searchType === "coords" && t("search.type_selector.coords.description")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="relative flex-1">
                      {/* Enhanced input field with dynamic styling */}
                      <div className="absolute inset-y-0 left-4 flex items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            searchType === "zip"
                              ? "bg-blue-500/20"
                              : searchType === "city"
                                ? "bg-emerald-500/20"
                                : "bg-purple-500/20"
                          } backdrop-blur-sm`}
                        >
                          {searchType === "zip" && <span className="text-lg">📮</span>}
                          {searchType === "city" && (
                            <MapPin
                              className={`h-5 w-5 ${searchType === "city" ? "text-emerald-400" : "text-slate-400"}`}
                            />
                          )}
                          {searchType === "coords" && <span className="text-lg">🌐</span>}
                        </div>
                      </div>

                      <input
                        type="text"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value)
                          if (error) setError("") // Clear error on input change
                        }}
                        placeholder={getPlaceholderText(searchType)}
                        className={`w-full rounded-2xl border py-4 pl-16 pr-24 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                          searchType === "zip"
                            ? "border-blue-500/30 bg-blue-500/10 focus:border-blue-400 focus:bg-blue-500/15 focus:ring-4 focus:ring-blue-500/20"
                            : searchType === "city"
                              ? "border-emerald-500/30 bg-emerald-500/10 focus:border-emerald-400 focus:bg-emerald-500/15 focus:ring-4 focus:ring-emerald-500/20"
                              : "border-purple-500/30 bg-purple-500/10 focus:border-purple-400 focus:bg-purple-500/15 focus:ring-4 focus:ring-purple-500/20"
                        } focus:outline-none`}
                        disabled={loading}
                      />

                      {/* Enhanced search type indicator */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div
                          className={`rounded-xl px-3 py-2 text-xs font-medium backdrop-blur-sm ${
                            searchType === "zip"
                              ? "border border-blue-500/30 bg-blue-500/20 text-blue-300"
                              : searchType === "city"
                                ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                                : "border border-purple-500/30 bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {searchType === "city" && `📍 ${t("search.type_selector.city.label")}`}
                          {searchType === "coords" &&
                            `🌐 ${t("search.type_selector.coords.label")}`}
                          {searchType === "zip" && `📮 ${t("search.type_selector.zip.label")}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {/* Enhanced Calculate button */}
                      <button
                        type="submit"
                        disabled={loading || !location.trim()}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-2xl hover:shadow-purple-500/30 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:via-purple-600 disabled:hover:to-pink-600"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                        <span className="relative flex items-center gap-3">
                          {loading ? (
                            <>
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                              <span>{t("search.buttons.analyzing")}</span>
                            </>
                          ) : (
                            <>
                              <Snowflake className="h-6 w-6" />
                              <span>{t("search.buttons.calculate")}</span>
                            </>
                          )}
                        </span>
                      </button>

                      {/* Enhanced GPS button */}
                      <button
                        type="button"
                        onClick={handleGeoLocation}
                        disabled={loading}
                        className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 px-6 py-4 text-white backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/50 hover:from-emerald-500/20 hover:to-teal-500/15 hover:shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        title={t("search.buttons.gps_title")}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <MapPin className="relative h-6 w-6 text-emerald-300" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Enhanced Search History */}
              {isClient && searchHistory.length > 0 && (
                <div className="to-white/2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-purple-500">
                      <span className="text-sm">🕒</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">
                      {t("search.history.title")}
                    </h4>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setLocation(item)
                          // Try to auto-detect type for history items
                          if (/^\d+$/.test(item) || /^[A-Za-z]\d[A-Za-z]/.test(item)) {
                            setSearchType("zip")
                            searchWeather(item, "zip")
                          } else if (/^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/.test(item)) {
                            setSearchType("coords")
                            searchWeather(item, "coords")
                          } else {
                            setSearchType("city")
                            searchWeather(item, "city")
                          }
                        }}
                        className="to-white/2 group relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-white/5 p-3 text-left transition-all duration-300 hover:border-white/40 hover:from-white/10 hover:to-white/5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
                            <MapPin className="h-3 w-3 text-slate-400" />
                          </div>
                          <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                            {item}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Error Display */}
              {error && (
                <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-orange-500/10 p-6 shadow-lg shadow-red-500/25 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-transparent"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-orange-500 shadow-lg">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-bold text-red-200">
                        {t("search.errors.error_title")}
                      </h3>
                      <p className="text-red-100">{error}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setError("")}
                          className="rounded-lg bg-red-500/20 px-3 py-1 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/30"
                        >
                          {t("search.errors.dismiss")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {weatherData && (
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Main Probability Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/20">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-30">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getProbabilityColor(
                    weatherData.snowDay.probability
                  )}`}
                ></div>
              </div>

              {/* Floating particles effect - Only render on client to avoid hydration mismatch */}
              {isClient && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-pulse rounded-full bg-white/20"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        animationDelay: `${Math.random() * 3}s`,
                      }}
                    ></div>
                  ))}
                </div>
              )}

              <div className="relative p-12 text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {weatherData.location.name}, {weatherData.location.country}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="mb-4 text-8xl font-black text-white drop-shadow-2xl sm:text-9xl">
                    {weatherData.snowDay.probability}
                    <span className="text-5xl text-white/80 sm:text-6xl">%</span>
                  </div>

                  <div className="mb-4 text-3xl font-bold text-white drop-shadow-lg">
                    {t("results.chance_label", { level: weatherData.snowDay.level })}
                  </div>

                  <div className="mx-auto max-w-2xl text-lg font-medium text-white/90 drop-shadow-sm">
                    {weatherData.snowDay.recommendation}
                  </div>
                </div>

                {/* Probability Progress Bar */}
                <div className="mx-auto mb-8 max-w-md">
                  <div className="h-3 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                    <div
                      className="h-full bg-gradient-to-r from-white to-white/80 transition-all duration-1000 ease-out"
                      style={{ width: `${weatherData.snowDay.probability}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-medium text-white/70">
                    <span>{t("results.probability_labels.low")}</span>
                    <span>{t("results.probability_labels.moderate")}</span>
                    <span>{t("results.probability_labels.high")}</span>
                    <span>{t("results.probability_labels.very_high")}</span>
                  </div>
                </div>
              </div>

              {/* Current Weather Info */}
              <div className="relative border-t border-white/10 bg-black/20 p-8 backdrop-blur-sm">
                <h3 className="mb-6 text-center text-2xl font-bold text-white">
                  {t("results.weather_data.title")}
                </h3>
                <p className="mb-6 text-center text-slate-300">
                  {t("results.weather_data.description")}
                </p>
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative">
                      <Thermometer className="mx-auto mb-3 h-10 w-10 text-red-400" />
                      <div className="mb-2 text-3xl font-bold text-white">
                        {weatherData.current.temperature}°C
                      </div>
                      <div className="mb-1 text-sm font-medium text-slate-300">
                        {t("results.weather_data.temperature")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t("results.weather_data.feels_like", {
                          temp: weatherData.current.feelsLike,
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative">
                      <Wind className="mx-auto mb-3 h-10 w-10 text-blue-400" />
                      <div className="mb-2 text-3xl font-bold text-white">
                        {weatherData.current.windSpeedKmh.toFixed(1)}
                      </div>
                      <div className="mb-1 text-sm font-medium text-slate-300">
                        {t("results.weather_data.wind_speed")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t("results.weather_data.wind_speed_ms", {
                          speed: weatherData.current.windSpeed.toFixed(1),
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative">
                      <Eye className="mx-auto mb-3 h-10 w-10 text-purple-400" />
                      <div className="mb-2 text-3xl font-bold text-white">
                        {weatherData.current.visibilityKm.toFixed(1)}
                      </div>
                      <div className="mb-1 text-sm font-medium text-slate-300">
                        {t("results.weather_data.visibility")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t("results.weather_data.visibility_meters", {
                          distance: weatherData.current.visibility,
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative">
                      <CloudSnow className="mx-auto mb-3 h-10 w-10 text-indigo-400" />
                      <div className="mb-2 text-3xl font-bold text-white">
                        {weatherData.current.snowfall}
                      </div>
                      <div className="mb-1 text-sm font-medium text-slate-300">
                        {t("results.weather_data.snowfall")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t("results.weather_data.cloud_cover", {
                          percent: weatherData.current.cloudCover,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Factors Analysis */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
                <Info className="h-5 w-5" />
                {t("results.factors.title")}
              </h3>
              <div className="space-y-4">
                {Object.entries(weatherData.snowDay.factors).map(([key, factor]) => {
                  // Map camelCase keys to translation keys
                  const factorKeyMap: Record<string, string> = {
                    snowfall: "snowfall",
                    temperature: "temperature",
                    windSpeed: "wind_speed",
                    visibility: "visibility",
                    baseScore: "base_score",
                  }
                  const factorKey = factorKeyMap[key] || key.toLowerCase()
                  return (
                    <div key={key} className="border-l-4 border-blue-200 pl-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium capitalize text-gray-700">
                          {t(`results.factors.${factorKey}`)}
                        </span>
                        <span className={`font-bold ${getProbabilityTextColor(factor.impact)}`}>
                          +{factor.impact}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tips and Information */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                {t("results.notes.title")}
              </h3>
              <div className="prose text-gray-600">
                <ul className="space-y-2">
                  <li>• {t("results.notes.note1")}</li>
                  <li>• {t("results.notes.note2")}</li>
                  <li>• {t("results.notes.note3")}</li>
                  <li>• {t("results.notes.note4")}</li>
                  <li>• {t("results.notes.note5")}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Features Section (when no results) */}
        {!weatherData && !loading && (
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/20 via-blue-900/15 to-purple-900/20 p-8 shadow-2xl backdrop-blur-xl">
              {/* Animated background elements */}
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl"></div>

              <div className="relative">
                <div className="mb-12 text-center">
                  <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
                    <span className="text-2xl">⚡</span>
                    <h2 className="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent">
                      {t("features.title")}
                    </h2>
                  </div>
                  <p className="mx-auto max-w-3xl text-lg text-slate-300">
                    {t.rich("features.description", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                  {/* Real-time Data Card */}
                  <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-blue-900/10 p-8 text-center transition-all duration-500 hover:border-blue-400/40 hover:from-blue-500/15 hover:to-cyan-500/10 hover:shadow-2xl hover:shadow-blue-500/25">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                    <div className="relative">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg">
                        <Snowflake className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-4 text-xl font-bold text-white">
                        {t("features.realtime.title")}
                      </h3>
                      <p className="text-slate-300">
                        {t.rich("features.realtime.description", {
                          strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                        })}
                      </p>

                      <div className="mt-6 flex justify-center space-x-3">
                        <div className="rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                          {t("features.realtime.tags.temperature")}
                        </div>
                        <div className="rounded-lg bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-300">
                          {t("features.realtime.tags.snowfall")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Algorithm Card */}
                  <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-red-900/10 p-8 text-center transition-all duration-500 hover:border-orange-400/40 hover:from-orange-500/15 hover:to-amber-500/10 hover:shadow-2xl hover:shadow-orange-500/25">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                    <div className="relative">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg">
                        <AlertCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-4 text-xl font-bold text-white">
                        {t("features.algorithm.title")}
                      </h3>
                      <p className="text-slate-300">
                        {t.rich("features.algorithm.description", {
                          strong: (chunks) => <strong className="text-orange-300">{chunks}</strong>,
                        })}
                      </p>

                      <div className="mt-6 flex justify-center space-x-3">
                        <div className="rounded-lg bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300">
                          {t("features.algorithm.tags.ai_models")}
                        </div>
                        <div className="rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                          {t("features.algorithm.tags.pattern_analysis")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Accurate Card */}
                  <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-green-900/10 p-8 text-center transition-all duration-500 hover:border-emerald-400/40 hover:from-emerald-500/15 hover:to-teal-500/10 hover:shadow-2xl hover:shadow-emerald-500/25">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                    <div className="relative">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-4 text-xl font-bold text-white">
                        {t("features.precision.title")}
                      </h3>
                      <p className="text-slate-300">
                        {t.rich("features.precision.description", {
                          strong: (chunks) => (
                            <strong className="text-emerald-300">{chunks}</strong>
                          ),
                        })}
                      </p>

                      <div className="mt-6 flex justify-center space-x-3">
                        <div className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                          {t("features.precision.tags.global_coverage")}
                        </div>
                        <div className="rounded-lg bg-teal-500/20 px-3 py-1 text-xs font-medium text-teal-300">
                          {t("features.precision.tags.gps_accuracy")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center">
                  <div className="to-white/2 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 p-6 backdrop-blur-sm">
                    <p className="mb-4 text-lg text-slate-300">
                      {t.rich("features.cta.description", {
                        strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                      })}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                        {t.rich("features.cta.badges.instant", {
                          strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                        {t.rich("features.cta.badges.free", {
                          strong: (chunks) => <strong className="text-green-400">{chunks}</strong>,
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                        {t.rich("features.cta.badges.no_registration", {
                          strong: (chunks) => <strong className="text-slate-300">{chunks}</strong>,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/20 via-purple-900/15 to-slate-900/20 p-8 shadow-2xl backdrop-blur-xl">
            {/* Animated background elements */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl"></div>

            <div className="relative grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-white">
                  {t("seo_content.how_it_works.title")}
                </h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    {t.rich("seo_content.how_it_works.description1", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <p>
                    {t.rich("seo_content.how_it_works.description2", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="group relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-4 transition-all duration-300 hover:border-blue-400/40 hover:from-blue-500/15 hover:to-cyan-500/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative flex items-center gap-3">
                        <div className="rounded-lg bg-blue-500/20 p-2">
                          <Snowflake className="h-5 w-5 text-blue-300" />
                        </div>
                        <span className="text-sm font-medium text-slate-200">
                          {t("seo_content.how_it_works.features.snowfall")}
                        </span>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/5 p-4 transition-all duration-300 hover:border-red-400/40 hover:from-red-500/15 hover:to-orange-500/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative flex items-center gap-3">
                        <div className="rounded-lg bg-red-500/20 p-2">
                          <Thermometer className="h-5 w-5 text-red-300" />
                        </div>
                        <span className="text-sm font-medium text-slate-200">
                          {t("seo_content.how_it_works.features.temperature")}
                        </span>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4 transition-all duration-300 hover:border-emerald-400/40 hover:from-emerald-500/15 hover:to-teal-500/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-500/20 p-2">
                          <Wind className="h-5 w-5 text-emerald-300" />
                        </div>
                        <span className="text-sm font-medium text-slate-200">
                          {t("seo_content.how_it_works.features.wind")}
                        </span>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-4 transition-all duration-300 hover:border-purple-400/40 hover:from-purple-500/15 hover:to-pink-500/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative flex items-center gap-3">
                        <div className="rounded-lg bg-purple-500/20 p-2">
                          <Eye className="h-5 w-5 text-purple-300" />
                        </div>
                        <span className="text-sm font-medium text-slate-200">
                          {t("seo_content.how_it_works.features.visibility")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-6 text-3xl font-bold text-white">
                  {t("seo_content.why_use.title")}
                </h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    {t.rich("seo_content.why_use.description", {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                    })}
                  </p>
                  <div className="space-y-4">
                    <div className="group flex items-start gap-4 rounded-lg border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 p-3 transition-all duration-300 hover:border-cyan-400/40 hover:from-cyan-500/10 hover:to-blue-500/10">
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white shadow-lg">
                        ⚡
                      </div>
                      <div>
                        {t.rich("seo_content.why_use.benefits.instant.title", {
                          strong: (chunks) => (
                            <strong className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                              {chunks}
                            </strong>
                          ),
                        })}
                        <span className="text-slate-300">
                          {t("seo_content.why_use.benefits.instant.description")}
                        </span>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4 rounded-lg border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 p-3 transition-all duration-300 hover:border-emerald-400/40 hover:from-emerald-500/10 hover:to-teal-500/10">
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white shadow-lg">
                        🌍
                      </div>
                      <div>
                        {t.rich("seo_content.why_use.benefits.global.title", {
                          strong: (chunks) => (
                            <strong className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                              {chunks}
                            </strong>
                          ),
                        })}
                        <span className="text-slate-300">
                          {t("seo_content.why_use.benefits.global.description")}
                        </span>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5 p-3 transition-all duration-300 hover:border-purple-400/40 hover:from-purple-500/10 hover:to-pink-500/10">
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-xs font-bold text-white shadow-lg">
                        🔬
                      </div>
                      <div>
                        {t.rich("seo_content.why_use.benefits.scientific.title", {
                          strong: (chunks) => (
                            <strong className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                              {chunks}
                            </strong>
                          ),
                        })}
                        <span className="text-slate-300">
                          {t("seo_content.why_use.benefits.scientific.description")}
                        </span>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5 p-3 transition-all duration-300 hover:border-amber-400/40 hover:from-amber-500/10 hover:to-orange-500/10">
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white shadow-lg">
                        📱
                      </div>
                      <div>
                        {t.rich("seo_content.why_use.benefits.mobile.title", {
                          strong: (chunks) => (
                            <strong className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                              {chunks}
                            </strong>
                          ),
                        })}
                        <span className="text-slate-300">
                          {t("seo_content.why_use.benefits.mobile.description")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-12 overflow-hidden rounded-2xl border-t border-white/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 pt-8 backdrop-blur-sm">
              {/* Decorative elements */}
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-2xl"></div>
              <div className="absolute bottom-0 left-1/3 h-16 w-16 rounded-full bg-gradient-to-br from-pink-400/10 to-orange-400/10 blur-2xl"></div>

              <div className="relative text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-2 backdrop-blur-sm">
                  <span className="text-2xl">🎓</span>
                  <h3 className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-xl font-semibold text-transparent">
                    {t("seo_content.trusted.title")}
                  </h3>
                </div>
                <p className="mx-auto max-w-3xl text-slate-300">
                  {t.rich("seo_content.trusted.description", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
                <div className="my-8 flex flex-wrap justify-center gap-4">
                  <div className="rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 text-sm text-green-300 backdrop-blur-sm">
                    {t.rich("seo_content.trusted.badges.free_forever", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </div>
                  <div className="rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-2 text-sm text-blue-300 backdrop-blur-sm">
                    {t.rich("seo_content.trusted.badges.no_registration", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </div>
                  <div className="rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 text-sm text-purple-300 backdrop-blur-sm">
                    {t.rich("seo_content.trusted.badges.instant", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </div>
                  <div className="rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2 text-sm text-amber-300 backdrop-blur-sm">
                    {t.rich("seo_content.trusted.badges.mobile", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mx-auto mt-20 max-w-4xl rounded-xl bg-slate-800 p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
              <span className="text-2xl">❓</span>
              <h2 className="text-2xl font-bold text-white">{t("faq.title")}</h2>
            </div>
            <p className="mx-auto max-w-2xl text-slate-400">
              {t.rich("faq.description", {
                strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
              })}
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-slate-700 pb-6 last:border-b-0 last:pb-0">
                <h3 className="mb-3 text-lg font-semibold text-white">{faq.question}</h3>
                <p className="leading-relaxed text-slate-400">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* FAQ Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-3 backdrop-blur-sm">
              <Info className="h-5 w-5 text-green-300" />
              <span className="font-medium text-green-300">{t("faq.footer")}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
