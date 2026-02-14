"use client"
import React from "react"
import ShareButtons from "@/components/ShareButtons"
import GoogleAdUnitWrap from "@/components/GoogleAdUnitWrap"
import { useState, useCallback, useEffect } from "react"
import {
  Home,
  ChevronRight,
  Users,
  Database,
  Search,
  History,
  Download,
  Share2,
  Copy,
  Check,
  Info,
  Sparkles,
  Shield,
  Zap,
  Globe,
} from "lucide-react"
import { useTranslations } from "next-intl"
import VinInput from "./components/VinInput"
import ResultSummary from "./components/ResultSummary"
import { SearchState, DecodeStatus, HistoryItem, ExportFormat, SUPPORTED_BRANDS } from "./types"
import { validateVIN, isValidVin } from "./lib/validation"
import { decodeVehicle } from "./lib/api"
import { vinCache, history, dedupeRequest } from "./lib/cache"
import { formatVehicleSummary, exportAsJSON, exportAsCSV, exportAsText } from "./lib/mapping"
import { Link } from "@/app/i18n/navigation"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"

export default function VinDecoder() {
  const t = useTranslations("VinDecoder")
  const [searchState, setSearchState] = useState<SearchState>({
    vin: "",
    isValidating: false,
    isDecoding: false,
  })

  const [showHistory, setShowHistory] = useState(false)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">("idle")
  const [mounted, setMounted] = useState(false)

  // Load history on mount
  useEffect(() => {
    setMounted(true)
    setHistoryItems(history.get())
  }, [])

  // Validate VIN as user types
  useEffect(() => {
    if (searchState.vin) {
      const validation = validateVIN(searchState.vin)
      setSearchState((prev) => ({
        ...prev,
        validationResult: validation,
      }))
    } else {
      setSearchState((prev) => ({
        ...prev,
        validationResult: undefined,
      }))
    }
  }, [searchState.vin])

  const handleVinChange = useCallback((vin: string) => {
    setSearchState((prev) => ({
      ...prev,
      vin,
      decodeResult: undefined, // Clear previous result when typing
    }))
  }, [])

  const handleDecode = useCallback(async () => {
    const { vin, validationResult } = searchState
    console.warn(`🚀 ~ searchState:`, searchState)

    if (!validationResult?.isValid) return

    // Set loading state
    setSearchState((prev) => ({
      ...prev,
      isDecoding: true,
      decodeResult: { status: "loading" as DecodeStatus },
    }))

    try {
      // Check cache first
      const cached = vinCache.get(vin)
      if (cached) {
        setSearchState((prev) => ({
          ...prev,
          isDecoding: false,
          decodeResult: {
            status: "success" as DecodeStatus,
            vehicle: cached,
            timestamp: Date.now(),
          },
        }))
        return
      }

      // Decode with deduplication
      const vehicle = await dedupeRequest(vin, () => decodeVehicle(vin))

      // Enhanced data validation - check for meaningful data
      const hasValidData = Boolean(
        vehicle.make ||
          vehicle.model ||
          vehicle.year ||
          vehicle.manufacturing?.manufacturerName ||
          vehicle.bodyClass ||
          vehicle.vehicleType ||
          vehicle.engine ||
          vehicle.transmission ||
          (vehicle.raw && Object.keys(vehicle.raw).length > 5)
      )

      if (!hasValidData) {
        setSearchState((prev) => ({
          ...prev,
          isDecoding: false,
          decodeResult: {
            status: "no_data" as DecodeStatus,
            message: t("errors.no_data_message"),
          },
        }))
        return
      }

      // Success - cache and save to history
      vinCache.set(vin, vehicle)
      history.add(vehicle)
      setHistoryItems(history.get())

      setSearchState((prev) => ({
        ...prev,
        isDecoding: false,
        decodeResult: {
          status: "success" as DecodeStatus,
          vehicle,
          timestamp: Date.now(),
        },
      }))
    } catch (error) {
      console.error("Decode error:", error)
      const errorMessage =
        error instanceof Error ? error.message : t("errors.network_error_message")

      setSearchState((prev) => ({
        ...prev,
        isDecoding: false,
        decodeResult: {
          status: "network_error" as DecodeStatus,
          message: errorMessage,
        },
      }))
    }
  }, [searchState, t])

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setSearchState({
      vin: item.vin,
      isValidating: false,
      isDecoding: false,
      validationResult: validateVIN(item.vin),
      decodeResult: item.vehicle
        ? {
            status: "success" as DecodeStatus,
            vehicle: item.vehicle,
            timestamp: Date.now(),
          }
        : undefined,
    })
    setShowHistory(false)
  }, [])

  const handleClearHistory = useCallback(() => {
    history.clear()
    setHistoryItems([])
  }, [])

  const handleCopy = useCallback(async () => {
    if (!searchState.decodeResult?.vehicle) return

    setCopyStatus("copying")
    const text = formatVehicleSummary(searchState.decodeResult.vehicle)

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setCopyStatus("copied")
        setTimeout(() => setCopyStatus("idle"), 2000)
      }
    } catch (error) {
      console.error("Failed to copy:", error)
      setCopyStatus("idle")
    }
  }, [searchState.decodeResult])

  const handleExport = useCallback(
    (format: ExportFormat) => {
      if (!searchState.decodeResult?.vehicle) return

      const vehicle = searchState.decodeResult.vehicle
      let content: string
      let filename: string
      let mimeType: string

      switch (format.type) {
        case "json":
          content = exportAsJSON(vehicle, format.includeRaw)
          filename = `vin_${vehicle.vin}.json`
          mimeType = "application/json"
          break
        case "csv":
          content = exportAsCSV(vehicle)
          filename = `vin_${vehicle.vin}.csv`
          mimeType = "text/csv"
          break
        case "txt":
          content = exportAsText(vehicle)
          filename = `vin_${vehicle.vin}.txt`
          mimeType = "text/plain"
          break
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    [searchState.decodeResult]
  )

  const handleShare = useCallback(async () => {
    if (!searchState.decodeResult?.vehicle) return

    const text = formatVehicleSummary(searchState.decodeResult.vehicle)

    if (typeof window === "undefined") return

    const url = `${window.location.origin}/tools/vin-decoder?vin=${searchState.vin}`

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: t("structured_data.name"),
          text,
          url,
        })
      } catch (error) {
        // User cancelled or error
        console.log("Share cancelled:", error)
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      // Fallback to copying link
      await navigator.clipboard.writeText(url)
      setCopyStatus("copied")
      setTimeout(() => setCopyStatus("idle"), 2000)
    }
  }, [searchState.decodeResult, t, searchState.vin])

  // Check for VIN in URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    const vinParam = params.get("vin")
    if (vinParam && isValidVin(vinParam)) {
      handleVinChange(vinParam)
      // Auto-decode after a short delay
      setTimeout(() => {
        setSearchState((prev) => ({
          ...prev,
          vin: vinParam,
          validationResult: validateVIN(vinParam),
        }))
        handleDecode()
      }, 500)
    }
  }, [handleVinChange, handleDecode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Breadcrumb Navigation */}
      <nav
        className="mx-auto max-w-7xl px-4 pt-3 sm:px-4 sm:pt-4 md:px-6 lg:px-8"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 sm:text-sm">
          <li>
            <Link href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
          <li>
            <Link href="/tools" className="hover:text-slate-200">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <ChevronRight className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb.vin_decoder")}</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:pb-5 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
        {/* Header Section */}
        <div className="text-center">
          <ShareButtons />

          {/* Official Data Badge */}
          <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
            <Database className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            {t("header.official_badge")}
          </div>

          {/* Tool Title */}
          <h1 className="mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl lg:leading-snug">
            {t("header.main_title")}
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-6xl px-1 text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
            {t("header.description")}
          </p>

          <GoogleAdUnitWrap />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 sm:gap-5 md:gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Main Content Panel */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:col-span-8">
            {/* Results Section - Directly below VIN Input */}
            {searchState.decodeResult && (
              <div className="space-y-5 sm:space-y-6 md:space-y-8">
                {searchState.decodeResult.status === "success" &&
                  searchState.decodeResult.vehicle && (
                    <>
                      <ResultSummary
                        vehicle={searchState.decodeResult.vehicle}
                        onCopy={handleCopy}
                        onShare={handleShare}
                      />

                      {/* Enhanced Export Actions */}
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                        <button
                          onClick={handleCopy}
                          className="group relative min-h-[44px] overflow-hidden rounded-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base md:px-6"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                          <div className="relative flex items-center gap-2">
                            {copyStatus === "copied" ? (
                              <>
                                <Check className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
                                <span className="text-green-400">{t("actions.copied")}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>{t("actions.copy_summary")}</span>
                              </>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => handleExport({ type: "json", includeRaw: false })}
                          className="group relative min-h-[44px] overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 px-4 py-2.5 text-sm font-medium text-emerald-300 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base md:px-6"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                          <div className="relative flex items-center gap-2">
                            <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span>{t("actions.export_json")}</span>
                          </div>
                        </button>

                        <button
                          onClick={() => handleExport({ type: "csv", includeRaw: false })}
                          className="group relative min-h-[44px] overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-purple-600/10 px-4 py-2.5 text-sm font-medium text-purple-300 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base md:px-6"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                          <div className="relative flex items-center gap-2">
                            <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span>{t("actions.export_csv")}</span>
                          </div>
                        </button>

                        <button
                          onClick={handleShare}
                          className="group relative min-h-[44px] overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base md:px-6"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                          <div className="relative flex items-center gap-2">
                            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span>{t("actions.share")}</span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}

                {searchState.decodeResult.status === "no_data" && (
                  <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/15 to-orange-500/10 p-5 text-center backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 blur-2xl" />
                    <div className="relative">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 sm:mb-5 sm:h-14 sm:w-14 md:mb-6 md:h-16 md:w-16">
                        <Info className="h-6 w-6 text-yellow-400 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </div>
                      <h3 className="mb-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-xl font-bold text-transparent sm:mb-3 sm:text-2xl">
                        {t("errors.no_data_title")}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-200 sm:text-base md:text-lg">
                        {searchState.decodeResult.message}
                      </p>
                    </div>
                  </div>
                )}

                {searchState.decodeResult.status === "network_error" && (
                  <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-pink-500/10 p-5 text-center backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 blur-2xl" />
                    <div className="relative">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 sm:mb-5 sm:h-14 sm:w-14 md:mb-6 md:h-16 md:w-16">
                        <Info className="h-6 w-6 text-red-400 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </div>
                      <h3 className="mb-2 bg-gradient-to-r from-red-200 to-pink-200 bg-clip-text text-xl font-bold text-transparent sm:mb-3 sm:text-2xl">
                        {t("errors.network_error_title")}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-slate-200 sm:mb-5 sm:text-base md:mb-6 md:text-lg">
                        {searchState.decodeResult.message}
                      </p>
                      <button
                        onClick={handleDecode}
                        className="group relative min-h-[44px] overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                        <span className="relative">{t("actions.try_again")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <VinInput
              value={searchState.vin}
              onChange={handleVinChange}
              onSubmit={handleDecode}
              isValid={searchState.validationResult?.isValid || false}
              error={searchState.validationResult?.error}
              isLoading={searchState.isDecoding}
            />

            {/* Divider */}
            {searchState.decodeResult && mounted && historyItems.length > 0 && (
              <div className="mt-10 flex items-center justify-center sm:mt-12 md:mt-16">
                <div className="flex w-full max-w-sm items-center">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"></div>
                  <div className="mx-3 rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-medium text-slate-400 sm:mx-4 sm:px-3">
                    {t("history.previous_decodes")}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Enhanced History Button - Moved below results */}
            {mounted && historyItems.length > 0 && (
              <div className="mt-5 flex justify-center sm:mt-6 md:mt-8">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="group relative min-h-[44px] overflow-hidden rounded-xl border border-slate-600/30 bg-gradient-to-br from-slate-800/40 to-slate-900/40 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/50 hover:shadow-xl hover:shadow-slate-500/20 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base md:px-6"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                  <div className="relative flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-slate-600/30 p-1.5 sm:p-2">
                      <History className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span>
                      {showHistory ? t("actions.hide_history") : t("actions.view_history")} (
                      {historyItems.length})
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Enhanced History Panel - Moved below history button */}
            {mounted && showHistory && historyItems.length > 0 && (
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-600/30 bg-gradient-to-br from-slate-800/30 via-slate-800/20 to-slate-900/30 p-4 backdrop-blur-xl sm:mt-5 sm:rounded-3xl sm:p-6 md:mt-6 md:p-8">
                {/* Panel background decoration */}
                <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-2xl" />

                <div className="relative">
                  <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between md:mb-6">
                    <h3 className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                      {t("history.title")}
                    </h3>
                    <button
                      onClick={handleClearHistory}
                      className="min-h-[40px] rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition-all duration-300 hover:border-red-400/50 hover:bg-red-500/20 sm:px-4 sm:text-sm md:min-h-[44px]"
                    >
                      {t("actions.clear_all")}
                    </button>
                  </div>
                  <div className="grid gap-2 sm:gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                    {historyItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistorySelect(item)}
                        className="group relative overflow-hidden rounded-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40 p-3 text-left transition-all duration-300 hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20 sm:rounded-2xl sm:p-4"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-slate-500/0 via-slate-500/5 to-slate-500/0 transition-transform duration-500 group-hover:translate-x-full" />
                        <div className="relative">
                          <span className="block font-mono text-xs font-medium text-white sm:text-sm">
                            {item.vin}
                          </span>
                          {item.make && (
                            <p className="mt-1 text-xs text-slate-300 sm:mt-2 sm:text-sm">
                              {item.year} {item.make} {item.model}
                            </p>
                          )}
                          <span className="mt-1 block text-xs text-slate-400 sm:mt-2">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:col-span-4">
            {/* Usage Guidelines */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700 sm:rounded-2xl">
              <div className="border-b border-slate-700 px-4 py-3 sm:px-5 sm:py-4 md:px-6">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  {t("sidebar.usage_guidelines_title")}
                </h2>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <div className="space-y-3 text-xs text-slate-300 sm:space-y-4 sm:text-sm">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 sm:h-2 sm:w-2"></div>
                    <div className="min-w-0">
                      <div className="font-medium text-white">{t("sidebar.usage_enter_vin")}</div>
                      <div className="leading-relaxed">{t("sidebar.usage_enter_vin_desc")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 sm:h-2 sm:w-2"></div>
                    <div className="min-w-0">
                      <div className="font-medium text-white">
                        {t("sidebar.usage_instant_decode")}
                      </div>
                      <div className="leading-relaxed">
                        {t("sidebar.usage_instant_decode_desc")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400 sm:h-2 sm:w-2"></div>
                    <div className="min-w-0">
                      <div className="font-medium text-white">{t("sidebar.usage_export_data")}</div>
                      <div className="leading-relaxed">{t("sidebar.usage_export_data_desc")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VIN Quick Facts */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700 sm:rounded-2xl">
              <div className="border-b border-slate-700 px-4 py-3 sm:px-5 sm:py-4 md:px-6">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  {t("sidebar.quick_facts_title")}
                </h2>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <div className="space-y-3 text-xs text-slate-300 sm:space-y-4 sm:text-sm">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 sm:h-2 sm:w-2"></div>
                    <div className="min-w-0">
                      <div className="font-medium text-white">
                        {t("sidebar.quick_facts_17_chars")}
                      </div>
                      <div className="leading-relaxed">
                        {t("sidebar.quick_facts_17_chars_desc")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 sm:h-2 sm:w-2"></div>
                    <div className="min-w-0">
                      <div className="font-medium text-white">
                        {t("sidebar.quick_facts_no_ioq")}
                      </div>
                      <div className="leading-relaxed">{t("sidebar.quick_facts_no_ioq_desc")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400 sm:h-2 sm:w-2"></div>
                    <div className="min-w-0">
                      <div className="font-medium text-white">
                        {t("sidebar.quick_facts_check_digit")}
                      </div>
                      <div className="leading-relaxed">
                        {t("sidebar.quick_facts_check_digit_desc")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400 sm:h-2 sm:w-2"></div>
                    <div className="min-w-0">
                      <div className="font-medium text-white">
                        {t("sidebar.quick_facts_global_standard")}
                      </div>
                      <div className="leading-relaxed">
                        {t("sidebar.quick_facts_global_standard_desc")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity - Only show when history panel is not open */}
            {mounted && historyItems.length > 0 && !showHistory && (
              <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700 sm:rounded-2xl">
                <div className="border-b border-slate-700 px-4 py-3 sm:px-5 sm:py-4 md:px-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white sm:text-lg">
                      {t("sidebar.recent_activity_title")}
                    </h2>
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300 sm:py-1">
                      {historyItems.length}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    {historyItems.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistorySelect(item)}
                        className="group w-full rounded-lg border border-slate-600/30 bg-slate-700/30 p-2.5 text-left transition-all hover:border-slate-500/50 hover:bg-slate-600/30 sm:p-3"
                      >
                        <div className="font-mono text-xs font-medium text-white sm:text-sm">
                          {item.vin}
                        </div>
                        {item.make && (
                          <div className="mt-0.5 text-xs text-slate-400 sm:mt-1">
                            {item.year} {item.make} {item.model}
                          </div>
                        )}
                      </button>
                    ))}
                    {historyItems.length > 3 && (
                      <button
                        onClick={() => setShowHistory(true)}
                        className="min-h-[40px] w-full rounded-lg border border-blue-500/30 bg-blue-500/10 p-2.5 text-center text-xs font-medium text-blue-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/20 sm:p-3 sm:text-sm md:min-h-[44px]"
                      >
                        {t("history.view_all")} ({historyItems.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Brand Links */}
        <div className="relative mt-12 sm:mt-16 md:mt-20">
          {/* Section background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl" />
            <div className="absolute bottom-0 right-1/4 h-28 w-28 rounded-full bg-gradient-to-br from-blue-500/5 to-cyan-500/5 blur-2xl" />
          </div>

          <div className="text-center">
            <h2 className="mb-3 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:mb-4 sm:text-3xl md:text-4xl">
              {t("brand_links.title")}
            </h2>
            <p className="mb-8 px-1 text-sm leading-relaxed text-slate-400 sm:mb-10 sm:text-base md:mb-12 md:text-lg">
              {t("brand_links.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
            {SUPPORTED_BRANDS.map((brand, index) => {
              const colors = [
                {
                  border: "border-blue-500/30",
                  bg: "from-blue-500/15 to-cyan-500/10",
                  glow: "hover:shadow-blue-500/25",
                },
                {
                  border: "border-emerald-500/30",
                  bg: "from-emerald-500/15 to-teal-500/10",
                  glow: "hover:shadow-emerald-500/25",
                },
                {
                  border: "border-purple-500/30",
                  bg: "from-purple-500/15 to-pink-500/10",
                  glow: "hover:shadow-purple-500/25",
                },
                {
                  border: "border-orange-500/30",
                  bg: "from-orange-500/15 to-red-500/10",
                  glow: "hover:shadow-orange-500/25",
                },
              ]
              const colorScheme = colors[index % colors.length]

              return (
                <Link
                  key={brand.slug}
                  href={`/tools/vin-decoder/${brand.slug}`}
                  className={`group relative overflow-hidden rounded-xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-3 text-center backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl sm:rounded-2xl sm:p-4 md:p-5 lg:p-6 ${colorScheme.glow}`}
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                  <div className="relative">
                    <h3 className="text-sm font-bold text-white sm:text-base md:text-lg">
                      {brand.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-300 sm:mt-2 sm:text-sm">
                      {t("brand_links.vin_decoder")}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12 md:mt-20 md:space-y-16">
          {/* VIN Structure Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-4 sm:p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-tight text-white sm:mb-5 sm:text-2xl md:mb-6">
              {t("educational.vin_structure_title")}
            </h2>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
              <div>
                <p className="mb-3 text-sm leading-relaxed text-slate-200 sm:mb-4 sm:text-base">
                  {t("educational.vin_structure_desc_1")}
                </p>
                <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                  {t("educational.vin_structure_desc_2")}
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-4 sm:p-5 md:p-6">
                <h3 className="mb-2 text-base font-semibold text-white sm:mb-3 sm:text-lg">
                  {t("educational.vin_structure_positions_title")}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-200 sm:space-y-2 sm:text-base">
                  <li>
                    • <strong>{t("educational.vin_structure_positions_1_3")}</strong>
                  </li>
                  <li>
                    • <strong>{t("educational.vin_structure_positions_4_8")}</strong>
                  </li>
                  <li>
                    • <strong>{t("educational.vin_structure_positions_9")}</strong>
                  </li>
                  <li>
                    • <strong>{t("educational.vin_structure_positions_10")}</strong>
                  </li>
                  <li>
                    • <strong>{t("educational.vin_structure_positions_11")}</strong>
                  </li>
                  <li>
                    • <strong>{t("educational.vin_structure_positions_12_17")}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-4 sm:p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-tight text-white sm:mb-5 sm:text-2xl md:mb-6">
              {t("educational.how_to_use_title")}
            </h2>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
              <div className="rounded-lg bg-emerald-900/30 p-4 sm:p-5 md:p-6">
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
                  <Search className="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" />
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {t("educational.how_to_use_step_1_title")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                  {t("educational.how_to_use_step_1_desc")}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-900/30 p-4 sm:p-5 md:p-6">
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
                  <Zap className="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" />
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {t("educational.how_to_use_step_2_title")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                  {t("educational.how_to_use_step_2_desc")}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-900/30 p-4 sm:p-5 md:p-6">
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
                  <Download className="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" />
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {t("educational.how_to_use_step_3_title")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                  {t("educational.how_to_use_step_3_desc")}
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-4 sm:p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-tight text-white sm:mb-5 sm:text-2xl md:mb-6">
              {t("educational.features_title")}
            </h2>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
              <div className="rounded-lg bg-purple-900/30 p-4 sm:p-5 md:p-6">
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
                  <Shield className="h-4 w-4 text-purple-300 sm:h-5 sm:w-5" />
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {t("educational.features_official_title")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                  {t("educational.features_official_desc")}
                </p>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-4 sm:p-5 md:p-6">
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
                  <Sparkles className="h-4 w-4 text-purple-300 sm:h-5 sm:w-5" />
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {t("educational.features_free_title")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                  {t("educational.features_free_desc")}
                </p>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-4 sm:p-5 md:p-6">
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
                  <Globe className="h-4 w-4 text-purple-300 sm:h-5 sm:w-5" />
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {t("educational.features_global_title")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                  {t("educational.features_global_desc")}
                </p>
              </div>
            </div>
          </section>

          {/* VIN Facts Section */}
          <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-4 sm:p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-tight text-white sm:mb-5 sm:text-2xl md:mb-6">
              {t("educational.vin_facts_title")}
            </h2>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
              <div>
                <h3 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
                  {t("educational.vin_facts_valid_title")}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-200 sm:space-y-2 sm:text-base">
                  <li>✅ {t("educational.vin_facts_valid_1")}</li>
                  <li>✅ {t("educational.vin_facts_valid_2")}</li>
                  <li>✅ {t("educational.vin_facts_valid_3")}</li>
                  <li>✅ {t("educational.vin_facts_valid_4")}</li>
                  <li>✅ {t("educational.vin_facts_valid_5")}</li>
                  <li>✅ {t("educational.vin_facts_valid_6")}</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
                  {t("educational.vin_facts_what_title")}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-200 sm:space-y-2 sm:text-base">
                  <li>🚗 {t("educational.vin_facts_what_1")}</li>
                  <li>🔧 {t("educational.vin_facts_what_2")}</li>
                  <li>⚙️ {t("educational.vin_facts_what_3")}</li>
                  <li>🛡️ {t("educational.vin_facts_what_4")}</li>
                  <li>🏭 {t("educational.vin_facts_what_5")}</li>
                  <li>📊 {t("educational.vin_facts_what_6")}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-5 text-center sm:mt-16 sm:p-6 md:mt-20 md:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex justify-center sm:mb-5 md:mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <Users className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </div>
            </div>
            <h2 className="mb-3 text-xl font-bold leading-tight text-white sm:mb-4 sm:text-2xl">
              {t("cta.title")}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-300 sm:mb-5 sm:text-base md:mb-6">
              {t("cta.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400 sm:gap-3 sm:text-sm md:gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>{t("cta.official_nhtsa")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span>{t("cta.no_registration")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span>{t("cta.instant_results")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                <span>{t("cta.multiple_formats")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
