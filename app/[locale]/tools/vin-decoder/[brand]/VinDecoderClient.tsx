"use client"

import { useState, useCallback, useEffect } from "react"
import { Link } from "@/app/i18n/navigation"
import { Car, Search, Home, ChevronRight, Database, Share2, Copy, Check } from "lucide-react"
import { useTranslations } from "next-intl"
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
  const t = useTranslations("VinDecoder.brandPage")
  const tBreadcrumb = useTranslations("VinDecoder.breadcrumb")
  const tErrors = useTranslations("VinDecoder.errors")

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
            message: tErrors("no_data_message"),
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
      const errorMessage = error instanceof Error ? error.message : tErrors("network_error_message")

      setSearchState((prev) => ({
        ...prev,
        isDecoding: false,
        decodeResult: {
          status: "network_error" as DecodeStatus,
          message: errorMessage,
        },
      }))
    }
  }, [searchState, brand.name, tErrors])

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
          title: `${brand.name} ${t("vin_decoder_suffix")}`,
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
  }, [searchState.decodeResult, searchState.vin, brand.slug, brand.name, t])

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
      {/* Breadcrumb Navigation - Mobile Optimized */}
      <nav className="mx-auto max-w-7xl px-3 pt-3 sm:px-4 sm:pt-4 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-400 sm:gap-2 sm:text-sm">
          <li>
            <Link href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="ml-1 hidden sm:inline">{tBreadcrumb("home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-3 w-3 flex-shrink-0 text-slate-500 sm:h-4 sm:w-4" />
          <li className="hidden sm:block">
            <Link href="/tools" className="transition-colors hover:text-slate-200">
              {tBreadcrumb("tools")}
            </Link>
          </li>
          <ChevronRight className="hidden h-3 w-3 flex-shrink-0 text-slate-500 sm:block sm:h-4 sm:w-4" />
          <li>
            <Link href="/tools/vin-decoder" className="transition-colors hover:text-slate-200">
              <span className="sm:hidden">VIN</span>
              <span className="hidden sm:inline">{tBreadcrumb("vin_decoder")}</span>
            </Link>
          </li>
          <ChevronRight className="h-3 w-3 flex-shrink-0 text-slate-500 sm:h-4 sm:w-4" />
          <li className="max-w-[120px] truncate font-medium text-slate-100 sm:max-w-none">
            {brand.name}
          </li>
        </ol>
      </nav>

      {/* Simplified Brand Hero - Mobile Optimized */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:py-8 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          {/* Brand Badge */}
          <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
            <Car className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            {brand.name} {t("vin_decoder_suffix")}
          </div>

          {/* Title */}
          <h1 className="mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent sm:mb-4 sm:text-3xl md:text-4xl">
            {brand.name} {t("vin_decoder_suffix")}
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl px-2 text-sm leading-relaxed text-slate-300 sm:px-0 sm:text-base md:text-lg">
            {brand.description} {t("nhtsa_integration")}
          </p>
        </div>

        {/* VIN Input and Results - Mobile Optimized Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-4 sm:space-y-6 lg:col-span-8">
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
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {searchState.decodeResult.status === "success" &&
                  searchState.decodeResult.vehicle && (
                    <>
                      <ResultSummary
                        vehicle={searchState.decodeResult.vehicle}
                        onCopy={handleCopy}
                        onShare={handleShare}
                      />

                      {/* Export Actions - Mobile Optimized */}
                      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 md:gap-4">
                        <button
                          onClick={handleCopy}
                          className="group relative overflow-hidden rounded-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40 px-3 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base md:px-6"
                        >
                          <div className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                            {copyStatus === "copied" ? (
                              <>
                                <Check className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
                                <span className="text-green-400">{t("copied")}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="hidden sm:inline">{t("copy_summary")}</span>
                                <span className="sm:hidden">{t("copy")}</span>
                              </>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => handleExport({ type: "json", includeRaw: false })}
                          className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 px-3 py-2.5 text-sm font-medium text-emerald-300 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base md:px-6"
                        >
                          <div className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                            <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">{t("export_json")}</span>
                            <span className="sm:hidden">{t("json")}</span>
                          </div>
                        </button>

                        <button
                          onClick={handleShare}
                          className="group relative col-span-2 overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 px-3 py-2.5 text-sm font-medium text-blue-300 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20 sm:col-span-1 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base md:px-6"
                        >
                          <div className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span>{t("share")}</span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>

          {/* Brand-specific Sidebar - Mobile Optimized */}
          <div className="order-first space-y-4 sm:space-y-6 lg:order-last lg:col-span-4">
            {/* Brand Info */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  {t("brand_info_title", { brand: brand.name })}
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-1 sm:space-y-4">
                  {brand.country && (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400 sm:h-2 sm:w-2"></div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white sm:text-sm">
                          {t("country")}
                        </div>
                        <div className="truncate text-xs sm:text-sm">{brand.country}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400 sm:h-2 sm:w-2"></div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white sm:text-sm">
                        {t("full_name")}
                      </div>
                      <div className="truncate text-xs sm:text-sm">{brand.fullName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WMI Codes */}
            {brand.commonWMIs && brand.commonWMIs.length > 0 && (
              <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
                <div className="border-b border-slate-700 px-4 py-3 sm:px-6 sm:py-4">
                  <h2 className="text-base font-semibold text-white sm:text-lg">
                    {t("wmi_codes")}
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="mb-3 text-xs text-slate-300 sm:mb-4 sm:text-sm">
                    {t("wmi_codes_desc", { brand: brand.name })}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {brand.commonWMIs.map((wmi) => (
                      <span
                        key={wmi}
                        className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-xs text-blue-300 sm:rounded-lg sm:px-3 sm:py-1 sm:text-sm"
                      >
                        {wmi}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Popular Models - Hidden on mobile, shown on larger screens */}
            {brand.popularModels && brand.popularModels.length > 0 && (
              <div className="hidden overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700 sm:block">
                <div className="border-b border-slate-700 px-4 py-3 sm:px-6 sm:py-4">
                  <h2 className="text-base font-semibold text-white sm:text-lg">
                    {t("popular_models")}
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    {brand.popularModels.slice(0, 5).map((model) => (
                      <div
                        key={model}
                        className="flex items-center gap-2 rounded-lg bg-slate-700/30 px-2.5 py-1.5 sm:px-3 sm:py-2"
                      >
                        <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 sm:h-4 sm:w-4" />
                        <span className="truncate text-xs text-white sm:text-sm">{model}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand-specific FAQ Section - Mobile Optimized */}
        <div className="mt-8 space-y-4 sm:mt-12 sm:space-y-6 md:mt-16 md:space-y-8">
          <div className="text-center">
            <h2 className="mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-xl font-bold text-transparent sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl">
              {t("faq_title", { brand: brand.name })}
            </h2>
            <p className="text-sm text-slate-400 sm:text-base md:text-lg">
              {t("faq_subtitle", { brand: brand.name })}
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
            <div className="rounded-lg bg-gradient-to-r from-blue-800 to-indigo-700 p-4 sm:rounded-xl sm:p-5 md:p-6">
              <h3 className="mb-2 text-sm font-semibold text-white sm:mb-3 sm:text-base md:text-lg">
                {t("faq_where_find_q", { brand: brand.name })}
              </h3>
              <p className="text-xs leading-relaxed text-slate-200 sm:text-sm md:text-base">
                {t("faq_where_find_a", { brand: brand.name })}
              </p>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-emerald-800 to-teal-700 p-4 sm:rounded-xl sm:p-5 md:p-6">
              <h3 className="mb-2 text-sm font-semibold text-white sm:mb-3 sm:text-base md:text-lg">
                {t("faq_wmi_q")}
              </h3>
              <p className="text-xs leading-relaxed text-slate-200 sm:text-sm md:text-base">
                {t("faq_wmi_a", { brand: brand.name, wmiCodes: brand.commonWMIs.join(", ") })}
              </p>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-purple-800 to-pink-700 p-4 sm:rounded-xl sm:p-5 md:p-6">
              <h3 className="mb-2 text-sm font-semibold text-white sm:mb-3 sm:text-base md:text-lg">
                {t("faq_info_q")}
              </h3>
              <p className="text-xs leading-relaxed text-slate-200 sm:text-sm md:text-base">
                {t("faq_info_a", { brand: brand.name })}
              </p>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-orange-800 to-red-700 p-4 sm:rounded-xl sm:p-5 md:p-6">
              <h3 className="mb-2 text-sm font-semibold text-white sm:mb-3 sm:text-base md:text-lg">
                {t("faq_free_q")}
              </h3>
              <p className="text-xs leading-relaxed text-slate-200 sm:text-sm md:text-base">
                {t("faq_free_a", { brand: brand.name })}
              </p>
            </div>
          </div>
        </div>

        {/* Other Brands - Mobile Optimized */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="text-center">
            <h2 className="mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-xl font-bold text-transparent sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl">
              {t("other_brands_title")}
            </h2>
            <p className="mb-4 text-sm text-slate-400 sm:mb-6 sm:text-base md:mb-8 md:text-lg">
              {t("other_brands_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4">
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
                    className={`group relative overflow-hidden rounded-xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-3 text-center backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl sm:rounded-2xl sm:p-4 ${colorScheme.glow}`}
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                    <div className="relative">
                      <h3 className="truncate text-sm font-bold text-white sm:text-base md:text-lg">
                        {otherBrand.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-300 sm:mt-1 sm:text-sm">
                        {t("vin_decoder_suffix")}
                      </p>
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
