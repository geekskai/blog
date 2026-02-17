"use client"

import { useState } from "react"
import React from "react"
import { useTranslations } from "next-intl"
import {
  BoundarySection,
  ComparisonSection,
  CoreFactsSection,
  FAQSection,
  HowToSection,
  KeyFeaturesSection,
  UseCaseSection,
  TechnicalSpecsSection,
  IntroSection,
  WhyUseSection,
  PrivacySection,
  TLDRSection,
  AdvancedTechSection,
} from "./SEOContent"
import ShareButtons from "@/components/ShareButtons"
import dynamic from "next/dynamic"

// Dynamic import to avoid SSR issues with hls.js
const HLSPlayer = dynamic(() => import("./HLSPlayer"), {
  ssr: false,
})

type LoadingState = "idle" | "loading" | "success" | "error"

export default function Page() {
  const t = useTranslations("HLSMusicPlayer")
  const [url, setUrl] = useState("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8")
  const [playingUrl, setPlayingUrl] = useState("")
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const isValidHLSUrl = (input: string) => {
    try {
      const urlObj = new URL(input)
      return urlObj.pathname.endsWith(".m3u8")
    } catch {
      return false
    }
  }

  const handlePlay = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setErrorMessage(t("error_empty_url"))
      setLoadingState("error")
      return
    }

    if (!isValidHLSUrl(trimmedUrl)) {
      setErrorMessage(t("error_invalid_url"))
      setLoadingState("error")
      return
    }

    setErrorMessage("")
    setLoadingState("loading")
    setPlayingUrl(trimmedUrl)
  }

  return (
    <div className="relative min-h-screen bg-slate-950">
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

      <div className="relative mx-auto max-w-6xl space-y-4 p-4">
        <header className="text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-4 py-2 text-sm text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 md:px-6 md:py-3 md:text-base">
            <div className="rounded-full bg-white/20 p-1">
              <span className="text-base md:text-lg">📺</span>
            </div>
            <span className="font-semibold">{t("tool_badge")}</span>
          </div>

          <h1 className="my-4 text-3xl font-bold leading-tight text-white md:text-5xl">
            {t("page_title")}
          </h1>

          <p className="mx-auto mb-6 max-w-5xl text-sm text-slate-300 md:text-lg">
            {t("page_subtitle")}
          </p>
        </header>

        <div className="mx-auto max-w-6xl space-y-8">
          {/* URL Input */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <form onSubmit={handlePlay} className="space-y-4 p-6 md:p-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/90 md:text-base">
                  {t("form_label_url")}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">
                    🎬
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] hover:shadow-purple-500/40 active:scale-[0.98]"
              >
                {t("form_button_play")}
              </button>
            </form>

            {errorMessage && (
              <div className="border-t border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Player Display */}
          {playingUrl ? (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <HLSPlayer
                url={playingUrl}
                onLoading={(loading) => setLoadingState(loading ? "loading" : "success")}
                onError={(err) => {
                  setErrorMessage(err)
                  setLoadingState("error")
                }}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
              <div className="mb-4 text-6xl opacity-20">📡</div>
              <h2 className="mb-2 text-xl font-bold text-white">{t("empty_state_title")}</h2>
              <p className="text-slate-400">{t("empty_state_description")}</p>
            </div>
          )}
        </div>

        <ShareButtons />

        {/* SEO Content */}
        <div className="mx-auto max-w-6xl space-y-4">
          <TLDRSection />
          <HowToSection />
          <IntroSection />
          <WhyUseSection />
          <ComparisonSection />
          <AdvancedTechSection />
          <PrivacySection />
          <CoreFactsSection />
          <KeyFeaturesSection />
          <UseCaseSection />
          <BoundarySection />
          <TechnicalSpecsSection />
          <FAQSection />
        </div>
      </div>
    </div>
  )
}
