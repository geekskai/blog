"use client"

import { useState, useCallback, useEffect } from "react"
import { Link } from "@/app/i18n/navigation"
import { Car, Search, Home, ChevronRight, Database, Share2, Copy, Check } from "lucide-react"
import { BrandInfo, SUPPORTED_BRANDS } from "../types"
import VinInput from "../components/VinInput"
import ResultSummary from "../components/ResultSummary"
import { SearchState, DecodeStatus, ExportFormat } from "../types"
import { validateVIN } from "../lib/validation"
import { decodeVehicle } from "../lib/api"
import { vinCache, history, dedupeRequest } from "../lib/cache"
import { formatVehicleSummary, exportAsJSON, exportAsCSV, exportAsText } from "../lib/mapping"

interface VinDecoderClientProps {
  brand: BrandInfo
}

export default function VinDecoderClient({ brand }: VinDecoderClientProps) {
  const [searchState, setSearchState] = useState<SearchState>({
    vin: "",
    isValidating: false,
    isDecoding: false,
  })

  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">("idle")

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
      decodeResult: undefined,
    }))
  }, [])

  const handleDecode = useCallback(async () => {
    const { vin, validationResult } = searchState
    console.warn(`brand: ${brand.name} vin: ${vin} 🚀 ~ searchState:`, searchState)

    if (!validationResult?.isValid) return

    setSearchState((prev) => ({
      ...prev,
      isDecoding: true,
      decodeResult: { status: "loading" as DecodeStatus },
    }))

    try {
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

      const vehicle = await dedupeRequest(vin, () => decodeVehicle(vin))

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

      vinCache.set(vin, vehicle)
      history.add(vehicle)
      // setHistoryItems(history.get())

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

  const handleShare = useCallback(async () => {
    if (!searchState.decodeResult?.vehicle) return

    const text = formatVehicleSummary(searchState.decodeResult.vehicle)

    if (typeof window === "undefined") return

    const url = `${window.location.origin}/tools/vin-decoder/${brand.slug}?vin=${searchState.vin}`

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${brand.name} VIN Decoder Result`,
          text,
          url,
        })
      } catch (error) {
        console.log("Share cancelled:", error)
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setCopyStatus("copied")
      setTimeout(() => setCopyStatus("idle"), 2000)
    }
  }, [searchState.decodeResult, searchState.vin, brand.slug])

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
          filename = `${brand.slug}_vin_${vehicle.vin}.json`
          mimeType = "application/json"
          break
        case "csv":
          content = exportAsCSV(vehicle)
          filename = `${brand.slug}_vin_${vehicle.vin}.csv`
          mimeType = "text/csv"
          break
        case "txt":
          content = exportAsText(vehicle)
          filename = `${brand.slug}_vin_${vehicle.vin}.txt`
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
    [searchState.decodeResult, brand.slug]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">Home</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="hover:text-slate-200">
              Tools
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools/vin-decoder" className="hover:text-slate-200">
              VIN Decoder
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">{brand.name}</li>
        </ol>
      </nav>

      {/* Simplified Brand Hero */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          {/* Brand Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <Car className="mr-2 h-4 w-4" />
            {brand.name} VIN Decoder
          </div>

          {/* Title */}
          <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
            {brand.name} VIN Decoder
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            {brand.description} Get instant results with our official NHTSA database integration.
          </p>
        </div>

        {/* VIN Input and Results */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <VinInput
              value={searchState.vin}
              onChange={handleVinChange}
              onSubmit={handleDecode}
              isValid={searchState.validationResult?.isValid || false}
              error={searchState.validationResult?.error}
              isLoading={searchState.isDecoding}
            />

            {/* Results Section */}
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

                      {/* Export Actions */}
                      <div className="flex flex-wrap justify-center gap-4">
                        <button
                          onClick={handleCopy}
                          className="group relative overflow-hidden rounded-2xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40 px-6 py-3 text-base font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20"
                        >
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
                          <div className="relative flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            <span>Export JSON</span>
                          </div>
                        </button>

                        <button
                          onClick={handleShare}
                          className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 px-6 py-3 text-base font-medium text-blue-300 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20"
                        >
                          <div className="relative flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            <span>Share</span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>

          {/* Brand-specific Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Brand Info */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">{brand.name} Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm text-slate-300">
                  {brand.country && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-400"></div>
                      <div>
                        <div className="font-medium text-white">Country</div>
                        <div>{brand.country}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                    <div>
                      <div className="font-medium text-white">Full Name</div>
                      <div>{brand.fullName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WMI Codes */}
            {brand.commonWMIs && brand.commonWMIs.length > 0 && (
              <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
                <div className="border-b border-slate-700 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">WMI Codes</h2>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-sm text-slate-300">
                    Common {brand.name} WMI codes (first 3 VIN characters):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {brand.commonWMIs.map((wmi) => (
                      <span
                        key={wmi}
                        className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-sm text-blue-300"
                      >
                        {wmi}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Popular Models */}
            {brand.popularModels && brand.popularModels.length > 0 && (
              <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
                <div className="border-b border-slate-700 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">Popular Models</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {brand.popularModels.slice(0, 5).map((model) => (
                      <div
                        key={model}
                        className="flex items-center gap-2 rounded-lg bg-slate-700/30 px-3 py-2"
                      >
                        <Search className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-white">{model}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand-specific FAQ Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-3xl font-bold text-transparent">
              {brand.name} VIN Decoder FAQ
            </h2>
            <p className="text-lg text-slate-400">
              Common questions about decoding {brand.name} VINs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Where can I find my {brand.name} VIN?
              </h3>
              <p className="text-slate-200">
                On most {brand.name} vehicles, you can find the VIN on the driver's side dashboard
                (visible through the windshield), on the driver's side door jamb, or in your vehicle
                registration and insurance documents.
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                What do the first 3 characters mean?
              </h3>
              <p className="text-slate-200">
                The first 3 characters (WMI) identify {brand.name} as the manufacturer. Common{" "}
                {brand.name} WMI codes include: {brand.commonWMIs.join(", ")}.
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">What information can I get?</h3>
              <p className="text-slate-200">
                Our {brand.name} VIN decoder provides comprehensive vehicle specifications including
                model year, exact model, trim level, engine type and size, transmission type, drive
                configuration, safety features, and manufacturing location.
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">Is this decoder free?</h3>
              <p className="text-slate-200">
                Yes, our {brand.name} VIN decoder is completely free to use with no limits. No
                registration or payment required - just enter your VIN and get instant results.
              </p>
            </div>
          </div>
        </div>

        {/* Other Brands */}
        <div className="mt-16">
          <div className="text-center">
            <h2 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-3xl font-bold text-transparent">
              Other Brand VIN Decoders
            </h2>
            <p className="mb-8 text-lg text-slate-400">
              Decode VINs for other popular vehicle brands
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {SUPPORTED_BRANDS.filter((b) => b.slug !== brand.slug)
              .slice(0, 8)
              .map((otherBrand, index) => {
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
                    key={otherBrand.slug}
                    href={`/tools/vin-decoder/${otherBrand.slug}`}
                    className={`group relative overflow-hidden rounded-2xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-4 text-center backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${colorScheme.glow}`}
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                    <div className="relative">
                      <h3 className="text-lg font-bold text-white">{otherBrand.name}</h3>
                      <p className="mt-1 text-sm text-slate-300">VIN Decoder</p>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
