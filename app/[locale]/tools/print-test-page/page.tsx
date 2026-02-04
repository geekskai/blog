"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import React from "react"
import GoogleAdUnitWrap from "@/components/GoogleAdUnitWrap"
import Color from "public/static/images/tools/print-test-page/color-print-colors-and-fonts.png"
import BlackWhite from "public/static/images/tools/print-test-page/gray-print-colors-and-fonts.png"
import CMYK from "public/static/images/tools/print-test-page/CMYK.png"
// import GeeksKaiWechat from "public/static/images/geekskai-wechat.jpg"

// Public paths for print window (must use absolute paths)
const PRINT_IMAGE_PATHS = {
  color: "/static/images/tools/print-test-page/color-print-colors-and-fonts.png",
  blackWhite: "/static/images/tools/print-test-page/gray-print-colors-and-fonts.png",
  cmyk: "/static/images/tools/print-test-page/CMYK.png",
} as const

import {
  CoreFactsSection,
  FAQSection,
  HowToSection,
  FeaturesSection,
  UseCasesSection,
} from "./SEOContent"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"

type TestPageType = "color" | "blackWhite" | "cmyk"

const DOWNLOAD_FILENAMES: Record<TestPageType, string> = {
  color: "color-print-colors-and-fonts.png",
  blackWhite: "gray-print-colors-and-fonts.png",
  cmyk: "CMYK.png",
}

export default function PrintTestPage() {
  const t = useTranslations("PrintTestPage")
  const [selectedType, setSelectedType] = useState<TestPageType | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [downloadingType, setDownloadingType] = useState<TestPageType | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  // Print function
  const handlePrint = (type: TestPageType) => {
    setSelectedType(type)
    setIsPrinting(true)

    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600")

    if (!printWindow) {
      alert(t("error_popup_blocked"))
      setIsPrinting(false)
      return
    }

    // Use full URL for print window to ensure images load correctly
    // In print window, we need absolute URL paths, not imported module paths
    const imageSrc = `${window.location.origin}${PRINT_IMAGE_PATHS[type]}`

    // Write HTML content to print window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t(`print_title_${type}`)}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: white;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            @media print {
              body {
                margin: 0;
              }
              img {
                width: 100%;
                height: auto;
              }
            }
          </style>
        </head>
        <body>
          <img src="${imageSrc}" alt="${t(`print_alt_${type}`)}" />
        </body>
      </html>
    `)

    printWindow.document.close()

    // Wait for image to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        setIsPrinting(false)
        setSelectedType(null)
        // Close window after printing (optional)
        setTimeout(() => {
          printWindow.close()
        }, 500)
      }, 500)
    }
  }

  const handleDownload = async (type: TestPageType) => {
    setDownloadingType(type)
    try {
      const imageUrl = `${window.location.origin}${PRINT_IMAGE_PATHS[type]}`
      const res = await fetch(imageUrl)
      if (!res.ok) throw new Error("Failed to fetch image")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = DOWNLOAD_FILENAMES[type]
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert(t("error_popup_blocked"))
    } finally {
      setDownloadingType(null)
    }
  }

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
      <div className="relative mx-auto max-w-4xl space-y-4 px-4 py-5 md:max-w-5xl md:space-y-6 md:px-6 md:py-6 lg:max-w-7xl lg:space-y-8 lg:px-8 lg:py-8">
        {/* Header Section - SEO Optimized */}
        <header className="text-center">
          {/* Main Title - H1 for SEO */}
          <h1 className="mb-2 text-2xl font-bold leading-tight text-white md:mb-3 md:text-3xl md:leading-snug lg:mb-4 lg:text-5xl">
            {t("page_title")}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-full px-0 text-sm leading-relaxed text-slate-300 md:max-w-5xl md:px-2 md:text-base md:leading-loose lg:text-lg">
            {t.rich("page_subtitle", {
              free: (chunks) => <strong className="text-emerald-400">{chunks}</strong>,
              instant: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              no_registration: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
            })}
          </p>
          {/* Content Freshness Badge */}
          <ContentFreshnessBadge lastModified={new Date("2026-02-04")} namespace="PrintTestPage" />
        </header>

        <GoogleAdUnitWrap />

        {/* Print Test Pages Section */}
        <div className="mx-auto w-full md:max-w-4xl lg:max-w-6xl">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm md:rounded-2xl">
            <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 md:p-5 lg:p-6">
              <h2 className="text-base font-semibold leading-snug text-white md:text-lg md:leading-snug lg:text-2xl">
                {t("print_section_title")}
              </h2>
              <span className="mt-1 block text-xs leading-relaxed text-slate-300 md:mt-2 md:text-sm">
                {t("print_section_description")}
              </span>
            </div>

            <div className="p-4 md:p-5 lg:p-6">
              {/* Test Page Preview Cards - Mobile: single column, md+: 3 columns */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
                {/* Color Test Page */}
                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4 transition-all duration-300 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/25 md:rounded-2xl md:p-5 lg:p-6">
                  <div className="mb-3 flex items-center justify-center md:mb-4">
                    <div className="relative h-24 w-full overflow-hidden rounded-lg bg-white md:h-28 lg:h-32">
                      <Image
                        src={Color}
                        alt={t("print_alt_color")}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  <h3 className="mb-1 text-sm font-bold leading-snug text-white md:mb-2 md:text-base lg:text-lg">
                    {t("print_type_color")}
                  </h3>
                  <p className="mb-3 text-xs leading-relaxed text-slate-300 md:mb-4 md:text-sm">
                    {t("print_type_color_description")}
                  </p>

                  {/* Print button */}
                  <button
                    onClick={() => handlePrint("color")}
                    disabled={isPrinting}
                    className="group/btn relative min-h-[48px] w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[44px] md:px-5 md:py-3 lg:px-6 lg:text-base"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {isPrinting && selectedType === "color" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin md:h-4 md:w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>{t("print_button_printing")}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm sm:text-base md:text-lg">🖨️</span>
                          <span>{t("print_button_color")}</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload("color")}
                    disabled={downloadingType !== null}
                    className="group/btn relative mt-2 min-h-[48px] w-full overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-purple-500/10 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[44px] md:px-5 md:py-3 lg:px-6 lg:text-base"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {downloadingType === "color" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin md:h-4 md:w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>{t("print_button_downloading")}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm sm:text-base md:text-lg">⬇️</span>
                          <span>{t("print_button_download")}</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Black & White Test Page */}
                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-500/10 via-gray-500/10 to-slate-600/10 p-4 transition-all duration-300 hover:border-slate-400/30 hover:shadow-lg hover:shadow-slate-500/25 md:rounded-2xl md:p-5 lg:p-6">
                  <div className="mb-3 flex items-center justify-center md:mb-4">
                    <div className="relative h-24 w-full overflow-hidden rounded-lg bg-white md:h-28 lg:h-32">
                      <Image
                        src={BlackWhite}
                        alt={t("print_alt_blackWhite")}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  <h3 className="mb-1 text-sm font-bold leading-snug text-white md:mb-2 md:text-base lg:text-lg">
                    {t("print_type_blackWhite")}
                  </h3>
                  <p className="mb-3 text-xs leading-relaxed text-slate-300 md:mb-4 md:text-sm">
                    {t("print_type_blackWhite_description")}
                  </p>

                  {/* Print button */}
                  <button
                    onClick={() => handlePrint("blackWhite")}
                    disabled={isPrinting}
                    className="group/btn relative min-h-[48px] w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/30 disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[44px] md:px-5 md:py-3 lg:px-6 lg:text-base"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {isPrinting && selectedType === "blackWhite" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin md:h-4 md:w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>{t("print_button_printing")}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm md:text-base lg:text-lg">🖨️</span>
                          <span>{t("print_button_blackWhite")}</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload("blackWhite")}
                    disabled={downloadingType !== null}
                    className="group/btn relative mt-2 min-h-[48px] w-full overflow-hidden rounded-xl border border-slate-500/30 bg-gradient-to-br from-slate-500/15 to-gray-500/10 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-500/25 transition-all duration-300 hover:border-slate-400/50 hover:shadow-xl hover:shadow-gray-500/30 disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[44px] md:px-5 md:py-3 lg:px-6 lg:text-base"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {downloadingType === "blackWhite" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin md:h-4 md:w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>{t("print_button_downloading")}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm sm:text-base md:text-lg">⬇️</span>
                          <span>{t("print_button_download")}</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* CMYK Test Page */}
                <div className="via-magenta-500/10 group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-yellow-500/10 p-4 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/25 md:rounded-2xl md:p-5 lg:p-6">
                  <div className="mb-3 flex items-center justify-center md:mb-4">
                    <div className="relative h-24 w-full overflow-hidden rounded-lg bg-white md:h-28 lg:h-32">
                      <Image
                        src={CMYK}
                        alt={t("print_alt_cmyk")}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  <h3 className="mb-1 text-sm font-bold leading-snug text-white md:mb-2 md:text-base lg:text-lg">
                    {t("print_type_cmyk")}
                  </h3>
                  <p className="mb-3 text-xs leading-relaxed text-slate-300 md:mb-4 md:text-sm">
                    {t("print_type_cmyk_description")}
                  </p>

                  {/* Print button */}
                  <button
                    onClick={() => handlePrint("cmyk")}
                    disabled={isPrinting}
                    className="group/btn via-magenta-600 hover:shadow-magenta-500/30 relative min-h-[48px] w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-yellow-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[44px] md:px-5 md:py-3 lg:px-6 lg:text-base"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {isPrinting && selectedType === "cmyk" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin md:h-4 md:w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>{t("print_button_printing")}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm md:text-base lg:text-lg">🖨️</span>
                          <span>{t("print_button_cmyk")}</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload("cmyk")}
                    disabled={downloadingType !== null}
                    className="group/btn relative mt-2 min-h-[48px] w-full overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 to-yellow-500/10 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-yellow-500/30 disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[44px] md:px-5 md:py-3 lg:px-6 lg:text-base"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {downloadingType === "cmyk" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin md:h-4 md:w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>{t("print_button_downloading")}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm sm:text-base md:text-lg">⬇️</span>
                          <span>{t("print_button_download")}</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="mt-5 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 backdrop-blur-sm md:mt-6 md:p-5 lg:mt-8 lg:p-6">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold leading-snug text-white md:text-base lg:text-xl">
                  <span className="text-base md:text-lg lg:text-xl">ℹ️</span>
                  {t("info_title")}
                </h3>
                <p className="text-xs leading-relaxed text-slate-300 md:text-sm md:leading-relaxed">
                  {t("info_description")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Sections - Mobile first spacing, then md/lg */}
        <div className="mx-auto w-full space-y-4 md:max-w-4xl md:space-y-6 lg:max-w-6xl lg:space-y-8">
          {/* What is this tool section */}
          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md md:rounded-3xl md:p-6 lg:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10"></div>
            <div className="relative z-10">
              <h2 className="mb-4 text-lg font-bold leading-tight text-white md:mb-6 md:text-2xl lg:mb-8 lg:text-3xl">
                {t("section_what_is_title")}
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
                <div>
                  <p className="mb-3 text-sm leading-relaxed text-slate-300 md:mb-5 md:text-base md:leading-relaxed lg:mb-6 lg:text-lg">
                    {t.rich("section_what_is_description_1", {
                      strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                    })}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300 md:text-base lg:text-lg">
                    {t.rich("section_what_is_description_2", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm md:rounded-2xl md:p-6 lg:p-8">
                  <h3 className="mb-3 flex items-center text-sm font-semibold leading-snug text-white md:mb-4 md:text-base lg:mb-6 lg:text-xl">
                    <span className="mr-2 text-lg md:mr-3 md:text-xl lg:text-2xl">✨</span>
                    {t("section_what_is_key_benefits")}
                  </h3>
                  <ul className="space-y-2.5 text-sm leading-relaxed text-slate-300 md:space-y-3 md:text-base">
                    <li className="flex items-start gap-2 md:gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 md:h-2 md:w-2"></div>
                      <span>{t("section_what_is_benefit_1")}</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400 md:h-2 md:w-2"></div>
                      <span>{t("section_what_is_benefit_2")}</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 md:h-2 md:w-2"></div>
                      <span>{t("section_what_is_benefit_3")}</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 md:h-2 md:w-2"></div>
                      <span>{t("section_what_is_benefit_4")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Core Facts Section */}
          <CoreFactsSection />

          {/* Features Section */}
          <FeaturesSection />

          {/* How-to Guide Section */}
          <HowToSection />

          {/* Use Cases Section */}
          <UseCasesSection />

          {/* FAQ Section */}
          <FAQSection />
        </div>
      </div>
      {/* Hidden print content */}
      <div ref={printRef} className="hidden">
        {selectedType && (
          <Image
            src={
              selectedType === "color" ? Color : selectedType === "blackWhite" ? BlackWhite : CMYK
            }
            alt={t(`print_alt_${selectedType}`)}
            width={1200}
            height={1600}
          />
        )}
      </div>
    </div>
  )
}
