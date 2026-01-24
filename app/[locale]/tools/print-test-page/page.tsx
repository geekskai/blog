"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import React from "react"

import Color from "public/static/images/tools/print-test-page/color-print-colors-and-fonts.png"
import BlackWhite from "public/static/images/tools/print-test-page/gray-print-colors-and-fonts.png"
import CMYK from "public/static/images/tools/print-test-page/CMYK.png"
import GeeksKaiWechat from "public/static/images/geekskai-wechat.jpg"
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
  ContentFreshnessBadge,
} from "./components/SEOContent"
import Link from "next/link"

type TestPageType = "color" | "blackWhite" | "cmyk"

export default function PrintTestPage() {
  const t = useTranslations("PrintTestPage")
  const [selectedType, setSelectedType] = useState<TestPageType | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)
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
      <div className="relative mx-auto max-w-6xl space-y-2 px-4 py-8 md:space-y-6 md:px-6 lg:px-8">
        {/* Content Freshness Badge */}
        <ContentFreshnessBadge lastModified={new Date("2026-01-24")} />
        {/* Header Section - SEO Optimized */}
        <header className="text-center">
          {/* Tool Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-3 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30">
            <div className="rounded-full bg-white/20 p-1">
              <span className="text-xl">🖨️</span>
            </div>
            <span className="font-semibold">{t("tool_badge")}</span>
          </div>

          {/* Main Title - H1 for SEO */}
          <h1 className="my-6 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-3xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
            {t("page_title")}
          </h1>

          {/* Subtitle */}
          <p className="text-md mx-auto mb-6 max-w-3xl leading-relaxed text-slate-300 md:text-lg">
            {t.rich("page_subtitle", {
              free: (chunks) => <strong className="text-emerald-400">{chunks}</strong>,
              instant: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              no_registration: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
            })}
          </p>
        </header>

        {/* Print Test Pages Section */}
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                {t("print_section_title")}
              </h2>
              <span className="mt-2 text-sm text-slate-300">{t("print_section_description")}</span>
              <div className="absolute right-0 top-0 flex items-center gap-2">
                <Image src={GeeksKaiWechat} alt="GeeksKai Wechat QR Code" width={80} height={80} />
              </div>
            </div>
            <div className="p-6">
              {/* Test Page Preview Cards */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Color Test Page */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 transition-all duration-300 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/25">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="relative h-32 w-full overflow-hidden rounded-lg bg-white/5">
                      <Image
                        src={Color}
                        alt={t("print_alt_color")}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{t("print_type_color")}</h3>
                  <p className="mb-4 text-sm text-slate-300">{t("print_type_color_description")}</p>
                  <button
                    onClick={() => handlePrint("color")}
                    disabled={isPrinting}
                    className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {isPrinting && selectedType === "color" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
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
                          <span className="text-lg">🖨️</span>
                          <span>{t("print_button_color")}</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Black & White Test Page */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-500/10 via-gray-500/10 to-slate-600/10 p-6 transition-all duration-300 hover:border-slate-400/30 hover:shadow-lg hover:shadow-slate-500/25">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="relative h-32 w-full overflow-hidden rounded-lg bg-white/5">
                      <Image
                        src={BlackWhite}
                        alt={t("print_alt_blackWhite")}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">
                    {t("print_type_blackWhite")}
                  </h3>
                  <p className="mb-4 text-sm text-slate-300">
                    {t("print_type_blackWhite_description")}
                  </p>
                  <button
                    onClick={() => handlePrint("blackWhite")}
                    disabled={isPrinting}
                    className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {isPrinting && selectedType === "blackWhite" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
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
                          <span className="text-lg">🖨️</span>
                          <span>{t("print_button_blackWhite")}</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* CMYK Test Page */}
                <div className="via-magenta-500/10 group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-yellow-500/10 p-6 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/25">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="relative h-32 w-full overflow-hidden rounded-lg bg-white/5">
                      <Image
                        src={CMYK}
                        alt={t("print_alt_cmyk")}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{t("print_type_cmyk")}</h3>
                  <p className="mb-4 text-sm text-slate-300">{t("print_type_cmyk_description")}</p>
                  <button
                    onClick={() => handlePrint("cmyk")}
                    disabled={isPrinting}
                    className="group/btn via-magenta-600 hover:shadow-magenta-500/30 relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-yellow-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {isPrinting && selectedType === "cmyk" ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
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
                          <span className="text-lg">🖨️</span>
                          <span>{t("print_button_cmyk")}</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="mt-8 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                  <span className="text-xl">ℹ️</span>
                  {t("info_title")}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">{t("info_description")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Sections */}
        <div className="mx-auto space-y-2 md:space-y-6">
          {/* What is this tool section */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10"></div>
            <div className="relative z-10">
              <h2 className="mb-8 text-3xl font-bold text-white">{t("section_what_is_title")}</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">
                    {t.rich("section_what_is_description_1", {
                      strong: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
                    })}
                  </p>
                  <p className="text-lg leading-relaxed text-slate-300">
                    {t.rich("section_what_is_description_2", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
                  <h3 className="mb-6 flex items-center text-xl font-semibold text-white">
                    <span className="mr-3 text-2xl">✨</span>
                    {t("section_what_is_key_benefits")}
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                      {t("section_what_is_benefit_1")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-purple-400"></div>
                      {t("section_what_is_benefit_2")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-emerald-400"></div>
                      {t("section_what_is_benefit_3")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-cyan-400"></div>
                      {t("section_what_is_benefit_4")}
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
