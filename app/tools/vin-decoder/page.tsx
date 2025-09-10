"use client"

import React, { useState, useCallback, useEffect } from "react"
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
import VinInput from "./components/VinInput"
import ResultSummary from "./components/ResultSummary"
import {
  SearchState,
  DecodeStatus,
  DecodedVehicle,
  HistoryItem,
  ExportFormat,
  SUPPORTED_BRANDS,
} from "./types"
import { validateVIN, isValidVin } from "./lib/validation"
import { decodeVehicle } from "./lib/api"
import { vinCache, history, dedupeRequest } from "./lib/cache"
import { formatVehicleSummary, exportAsJSON, exportAsCSV, exportAsText } from "./lib/mapping"
import Link from "next/link"

export default function VinDecoder() {
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
            message: "No vehicle data found for this VIN. Please verify the VIN is correct.",
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
        error instanceof Error
          ? error.message
          : "Failed to decode VIN. Please check your connection and try again."

      setSearchState((prev) => ({
        ...prev,
        isDecoding: false,
        decodeResult: {
          status: "network_error" as DecodeStatus,
          message: errorMessage,
        },
      }))
    }
  }, [searchState.vin, searchState.validationResult])

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
          title: "VIN Decoder Result",
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
  }, [searchState.decodeResult, searchState.vin])

  const handleCopyUrl = useCallback(async () => {
    if (typeof window === "undefined") return

    const url = `${window.location.origin}/tools/vin-decoder`

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        setCopyStatus("copied")
        setTimeout(() => setCopyStatus("idle"), 2000)
      } catch (error) {
        console.error("Failed to copy URL:", error)
      }
    }
  }, [])

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">Home</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="hover:text-slate-200">
              Tools
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">VIN Decoder</li>
        </ol>
      </nav>

      {/* Enhanced Background decorations */}
      {/* <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="from-blue-500/8 to-indigo-500/8 absolute -left-1/4 -top-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-gradient-to-br blur-3xl" />
        <div className="from-indigo-500/8 to-purple-500/8 absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-gradient-to-br blur-3xl" />
        <div className="from-cyan-500/4 to-blue-500/4 absolute left-1/3 top-1/2 h-1/3 w-1/3 rounded-full bg-gradient-to-br blur-2xl" />
        <div className="from-purple-500/4 to-pink-500/4 absolute right-1/4 top-1/4 h-1/4 w-1/4 rounded-full bg-gradient-to-br blur-2xl" />
      </div> */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          {/* Official Data Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <Database className="mr-2 h-4 w-4" />
            Official NHTSA Database
          </div>

          {/* Tool Title */}
          <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
            Free VIN Decoder & Vehicle Lookup
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Instantly decode any Vehicle Identification Number to get complete vehicle
            specifications, engine details, safety features, and manufacturing information. 100%
            free with no registration required.
          </p>

          {/* Share Component */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
              <p className="mb-3 text-center text-sm font-medium text-slate-300">
                Share this VIN decoder tool:
              </p>
              <div className="flex items-center justify-center gap-3">
                {mounted && typeof window !== "undefined" && (
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 rounded-lg border border-slate-600/30 bg-slate-700/30 px-4 py-2 text-sm text-slate-300 transition-all hover:border-blue-500/40 hover:bg-blue-500/20 hover:text-blue-300"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                )}
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-2 rounded-lg border border-slate-600/30 bg-slate-700/30 px-4 py-2 text-sm text-slate-300 transition-all hover:border-green-500/40 hover:bg-green-500/20 hover:text-green-300"
                >
                  {copyStatus === "copied" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copyStatus === "copied" ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content Panel */}
          <div className="space-y-6 lg:col-span-8">
            <VinInput
              value={searchState.vin}
              onChange={handleVinChange}
              onSubmit={handleDecode}
              isValid={searchState.validationResult?.isValid || false}
              error={searchState.validationResult?.error}
              isLoading={searchState.isDecoding}
            />

            {/* Results Section - Directly below VIN Input */}
            {searchState.decodeResult && (
              <div className="space-y-8">
                {searchState.decodeResult.status === "success" &&
                  searchState.decodeResult.vehicle && (
                    <>
                      <ResultSummary
                        vehicle={searchState.decodeResult.vehicle}
                        onCopy={handleCopy}
                        onShare={handleShare}
                      />

                      {/* Enhanced Export Actions */}
                      <div className="flex flex-wrap justify-center gap-4">
                        <button
                          onClick={handleCopy}
                          className="group relative overflow-hidden rounded-2xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40 px-6 py-3 text-base font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                          <div className="relative flex items-center gap-2">
                            {copyStatus === "copied" ? (
                              <>
                                <Check className="h-5 w-5 text-green-400" />
                                <span className="text-green-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-5 w-5" />
                                <span>Copy Summary</span>
                              </>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => handleExport({ type: "json", includeRaw: false })}
                          className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 px-6 py-3 text-base font-medium text-emerald-300 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                          <div className="relative flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            <span>Export JSON</span>
                          </div>
                        </button>

                        <button
                          onClick={() => handleExport({ type: "csv", includeRaw: false })}
                          className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-purple-600/10 px-6 py-3 text-base font-medium text-purple-300 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                          <div className="relative flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            <span>Export CSV</span>
                          </div>
                        </button>

                        <button
                          onClick={handleShare}
                          className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 px-6 py-3 text-base font-medium text-blue-300 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                          <div className="relative flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            <span>Share</span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}

                {searchState.decodeResult.status === "no_data" && (
                  <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/15 to-orange-500/10 p-10 text-center backdrop-blur-xl">
                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 blur-2xl" />
                    <div className="relative">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
                        <Info className="h-8 w-8 text-yellow-400" />
                      </div>
                      <h3 className="mb-4 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-2xl font-bold text-transparent">
                        No Data Found
                      </h3>
                      <p className="text-lg text-slate-200">{searchState.decodeResult.message}</p>
                    </div>
                  </div>
                )}

                {searchState.decodeResult.status === "network_error" && (
                  <div className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-pink-500/10 p-10 text-center backdrop-blur-xl">
                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 blur-2xl" />
                    <div className="relative">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                        <Info className="h-8 w-8 text-red-400" />
                      </div>
                      <h3 className="mb-4 bg-gradient-to-r from-red-200 to-pink-200 bg-clip-text text-2xl font-bold text-transparent">
                        Connection Error
                      </h3>
                      <p className="mb-6 text-lg text-slate-200">
                        {searchState.decodeResult.message}
                      </p>
                      <button
                        onClick={handleDecode}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                        <span className="relative">Try Again</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            {searchState.decodeResult && mounted && historyItems.length > 0 && (
              <div className="mt-16 flex items-center justify-center">
                <div className="flex w-full max-w-sm items-center">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"></div>
                  <div className="mx-4 rounded-full bg-slate-700/50 px-3 py-1 text-xs font-medium text-slate-400">
                    Previous Decodes
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Enhanced History Button - Moved below results */}
            {mounted && historyItems.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="group relative overflow-hidden rounded-2xl border border-slate-600/30 bg-gradient-to-br from-slate-800/40 to-slate-900/40 px-6 py-3 text-base font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/50 hover:shadow-xl hover:shadow-slate-500/20"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0 transition-transform duration-700 group-hover:translate-x-full" />
                  <div className="relative flex items-center gap-3">
                    <div className="rounded-lg bg-slate-600/30 p-2">
                      <History className="h-5 w-5" />
                    </div>
                    <span>
                      {showHistory ? "Hide" : "View"} History ({historyItems.length})
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Enhanced History Panel - Moved below history button */}
            {mounted && showHistory && historyItems.length > 0 && (
              <div className="relative mt-6 overflow-hidden rounded-3xl border border-slate-600/30 bg-gradient-to-br from-slate-800/30 via-slate-800/20 to-slate-900/30 p-8 backdrop-blur-xl">
                {/* Panel background decoration */}
                <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-2xl" />

                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-2xl font-bold text-transparent">
                      Recent Decodes
                    </h3>
                    <button
                      onClick={handleClearHistory}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all duration-300 hover:border-red-400/50 hover:bg-red-500/20"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {historyItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistorySelect(item)}
                        className="group relative overflow-hidden rounded-2xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40 p-4 text-left transition-all duration-300 hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-slate-500/0 via-slate-500/5 to-slate-500/0 transition-transform duration-500 group-hover:translate-x-full" />
                        <div className="relative">
                          <span className="block font-mono text-sm font-medium text-white">
                            {item.vin}
                          </span>
                          {item.make && (
                            <p className="mt-2 text-sm text-slate-300">
                              {item.year} {item.make} {item.model}
                            </p>
                          )}
                          <span className="mt-2 block text-xs text-slate-400">
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
          <div className="space-y-6 lg:col-span-4">
            {/* Usage Guidelines */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Usage Guidelines</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                    <div>
                      <div className="font-medium text-white">Enter VIN</div>
                      <div>Type or paste a 17-character VIN</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-400"></div>
                    <div>
                      <div className="font-medium text-white">Instant Decode</div>
                      <div>Get complete vehicle specifications</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-purple-400"></div>
                    <div>
                      <div className="font-medium text-white">Export Data</div>
                      <div>Download results in JSON, CSV, or TXT</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VIN Quick Facts */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">VIN Quick Facts</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                    <div>
                      <div className="font-medium text-white">17 Characters</div>
                      <div>Every VIN is exactly 17 characters long</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-400"></div>
                    <div>
                      <div className="font-medium text-white">No I, O, Q</div>
                      <div>These letters are excluded to avoid confusion</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-purple-400"></div>
                    <div>
                      <div className="font-medium text-white">Check Digit</div>
                      <div>Position 9 validates the entire VIN</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-orange-400"></div>
                    <div>
                      <div className="font-medium text-white">Global Standard</div>
                      <div>Used worldwide since 1981</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity - Only show when history panel is not open */}
            {mounted && historyItems.length > 0 && !showHistory && (
              <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
                <div className="border-b border-slate-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                    <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-300">
                      {historyItems.length}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {historyItems.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistorySelect(item)}
                        className="group w-full rounded-lg border border-slate-600/30 bg-slate-700/30 p-3 text-left transition-all hover:border-slate-500/50 hover:bg-slate-600/30"
                      >
                        <div className="font-mono text-sm font-medium text-white">{item.vin}</div>
                        {item.make && (
                          <div className="mt-1 text-xs text-slate-400">
                            {item.year} {item.make} {item.model}
                          </div>
                        )}
                      </button>
                    ))}
                    {historyItems.length > 3 && (
                      <button
                        onClick={() => setShowHistory(true)}
                        className="w-full rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-center text-sm font-medium text-blue-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/20"
                      >
                        View All ({historyItems.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Brand Links */}
        <div className="relative mt-20">
          {/* Section background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl" />
            <div className="absolute bottom-0 right-1/4 h-28 w-28 rounded-full bg-gradient-to-br from-blue-500/5 to-cyan-500/5 blur-2xl" />
          </div>

          <div className="text-center">
            <h2 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
              Decode by Brand
            </h2>
            <p className="mb-12 text-lg text-slate-400">
              Quick access to brand-specific VIN decoders
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                  className={`group relative overflow-hidden rounded-2xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-6 text-center backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${colorScheme.glow}`}
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                  <div className="relative">
                    <h3 className="text-lg font-bold text-white">{brand.name}</h3>
                    <p className="mt-2 text-sm text-slate-300">VIN Decoder</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-20 space-y-16">
          {/* VIN Structure Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Vehicle Identification Number (VIN) Structure Guide
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  A Vehicle Identification Number (VIN) is a unique 17-character code assigned to
                  every motor vehicle when manufactured. It follows international standards and
                  provides detailed information about the vehicle's specifications, manufacturer,
                  and production details.
                </p>
                <p className="text-slate-200">
                  Our VIN decoder uses the official NHTSA database to provide accurate and
                  comprehensive vehicle information, making it the most reliable tool for vehicle
                  identification.
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">VIN Character Positions</h3>
                <ul className="space-y-2 text-slate-200">
                  <li>
                    • <strong>Positions 1-3:</strong> World Manufacturer Identifier (WMI)
                  </li>
                  <li>
                    • <strong>Positions 4-8:</strong> Vehicle Descriptor Section (VDS)
                  </li>
                  <li>
                    • <strong>Position 9:</strong> Check Digit (validation)
                  </li>
                  <li>
                    • <strong>Position 10:</strong> Model Year
                  </li>
                  <li>
                    • <strong>Position 11:</strong> Plant Code
                  </li>
                  <li>
                    • <strong>Positions 12-17:</strong> Sequential Number
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">How to Use This VIN Decoder</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-emerald-900/30 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Search className="h-5 w-5 text-emerald-300" />
                  <h3 className="text-lg font-semibold text-white">Step 1: Enter VIN</h3>
                </div>
                <p className="text-slate-200">
                  Type or paste your 17-character VIN into the input field. The system will validate
                  the format in real-time and highlight any issues.
                </p>
              </div>
              <div className="rounded-lg bg-emerald-900/30 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-300" />
                  <h3 className="text-lg font-semibold text-white">Step 2: Decode</h3>
                </div>
                <p className="text-slate-200">
                  Click the "Decode VIN" button to instantly retrieve comprehensive vehicle
                  information from the official NHTSA database.
                </p>
              </div>
              <div className="rounded-lg bg-emerald-900/30 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Download className="h-5 w-5 text-emerald-300" />
                  <h3 className="text-lg font-semibold text-white">Step 3: Export</h3>
                </div>
                <p className="text-slate-200">
                  View detailed results and export the data in JSON, CSV, or TXT format for your
                  records or further analysis.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Why Choose Our VIN Decoder?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-purple-900/30 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-300" />
                  <h3 className="text-lg font-semibold text-white">Official Data</h3>
                </div>
                <p className="text-slate-200">
                  Direct access to the NHTSA Vehicle Product Information Catalog (vPIC) database,
                  ensuring accurate and up-to-date vehicle information.
                </p>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-300" />
                  <h3 className="text-lg font-semibold text-white">Free Forever</h3>
                </div>
                <p className="text-slate-200">
                  No hidden fees, no registration required, no limits. Decode unlimited VINs
                  completely free with full access to all features and data export options.
                </p>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-300" />
                  <h3 className="text-lg font-semibold text-white">Global Coverage</h3>
                </div>
                <p className="text-slate-200">
                  Supports vehicles from all major manufacturers worldwide, including cars, trucks,
                  motorcycles, and other motor vehicles from any country.
                </p>
              </div>
            </div>
          </section>

          {/* VIN Facts Section */}
          <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Important VIN Facts & Validation Rules
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Valid VIN Characteristics</h3>
                <ul className="space-y-2 text-slate-200">
                  <li>✅ Exactly 17 characters long</li>
                  <li>✅ Uses letters A-Z and numbers 0-9</li>
                  <li>✅ Excludes letters I, O, Q to avoid confusion</li>
                  <li>✅ Check digit matches calculated value</li>
                  <li>✅ Valid manufacturer identifier (WMI)</li>
                  <li>✅ Proper year code encoding</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">What You'll Get</h3>
                <ul className="space-y-2 text-slate-200">
                  <li>🚗 Make, model, year, and trim details</li>
                  <li>🔧 Engine specifications and fuel type</li>
                  <li>⚙️ Transmission and drivetrain information</li>
                  <li>🛡️ Safety features and equipment</li>
                  <li>🏭 Manufacturing location and plant details</li>
                  <li>📊 Complete technical specifications</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-20 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-8 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">
              Trusted by Millions of Vehicle Owners Worldwide
            </h2>
            <p className="mb-6 text-slate-300">
              Our VIN decoder is used by car buyers, sellers, mechanics, and automotive
              professionals worldwide for accurate vehicle identification and specification lookup.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>Official NHTSA Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span>No Registration Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                <span>Multiple Export Formats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
