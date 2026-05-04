"use client"
import React, { useEffect, useRef } from "react"
import TrackInfoCard, { TrackInfo } from "./TrackInfoCard"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { GoogleAdUnitPlaceholder } from "@/components/GoogleAdUnitPlaceholder"
import TrackDownloadForm from "../soundcloud-downloader/components/TrackDownloadForm"
import {
  CoreFactsSection,
  FAQSection,
  HowToSection,
  FormatComparisonSection,
  UseCasesSection,
  KeyFeaturesSection,
} from "./SEOContent"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
import ShareButtons from "@/components/ShareButtons"
import { useSoundCloudTrackDownloadForm } from "../soundcloud-downloader/hooks/useSoundCloudTrackDownloadForm"

const DeferredGoogleAdUnitWrap = dynamic(() => import("@/components/GoogleAdUnitWrap"), {
  ssr: false,
  loading: () => <GoogleAdUnitPlaceholder />,
})

const createDownloadLink = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName.toLowerCase()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

const getFileName = (trackInfo: TrackInfo | null, extension: string): string => {
  return trackInfo?.title ? `${trackInfo.title}.${extension}` : `audio-${Date.now()}.${extension}`
}

const seoContentVisibilityStyle: React.CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "auto 3200px",
}

export default function Page() {
  const t = useTranslations("SoundCloudToWAV")
  const {
    url,
    extension,
    downloading,
    trackInfo,
    loadingState,
    errorMessage,
    isPlaylistError,
    infoProgress,
    downloadProgress,
    infoStatus,
    downloadStatus,
    setExtension,
    handleUrlChange,
    handleGetInfo,
    handleDownload,
  } = useSoundCloudTrackDownloadForm<TrackInfo>({
    initialExtension: "wav",
    t,
    invalidUrlLogPrefix: "soundcloud to wav",
    getFileName,
    createDownloadLink,
  })
  const resultSectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!trackInfo || !resultSectionRef.current) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 150)

    return () => window.clearTimeout(timeoutId)
  }, [trackInfo])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative mx-auto max-w-7xl space-y-4 p-4">
        {/* Content Freshness Badge */}
        <ContentFreshnessBadge lastModified={new Date("2026-04-26")} namespace="SoundCloudToWAV" />

        {/* Header Section - SEO Optimized */}
        <header className="text-center">
          {/* Tool Badge */}
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-4 py-2 text-sm text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30 md:px-6 md:py-3 md:text-base">
            <div className="rounded-full bg-white/20 p-1">
              <span className="text-base md:text-lg">🎵</span>
            </div>
            <span className="font-semibold">{t("tool_badge")}</span>
          </div>

          {/* Main Title - H1 for SEO */}
          <h1 className="my-3 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-2xl font-bold leading-tight text-transparent md:text-5xl">
            {t("page_title")}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-3 max-w-7xl text-base text-slate-300 md:text-lg">
            {t.rich("page_subtitle", {
              wav: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
              mp3: (chunks) => <strong className="text-cyan-400">{chunks}</strong>,
              free: (chunks) => <strong className="text-emerald-400">{chunks}</strong>,
              fast: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              no_registration: (chunks) => <strong className="text-pink-400">{chunks}</strong>,
            })}
          </p>

          {/* <div className="mx-auto mt-5 max-w-4xl rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-indigo-500/10 p-4 text-left shadow-lg md:mt-7 md:border-purple-500/30 md:p-5 md:backdrop-blur-md">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
              <div className="inline-flex w-fit items-center rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-200">
                {t("section_convert_online_title")}
              </div>
              <p className="flex-1 text-sm leading-6 text-slate-200 md:text-[15px] md:leading-7">
                {t("section_convert_online_description")}
              </p>
            </div>
          </div> */}
        </header>

        {/* Input area card */}
        <div className="mx-auto max-w-7xl md:mb-8">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <div className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 px-4 py-3">
              <h2 className="text-lg font-semibold text-white md:text-2xl">{t("form_title")}</h2>
            </div>
            <TrackDownloadForm
              namespace="SoundCloudToWAV"
              variant="track"
              formId="soundcloud-to-wav-form"
              url={url}
              placeholder="https://soundcloud.com/username/song-name"
              relatedToolHref="/tools/soundcloud-downloader/"
              extension={extension}
              loadingState={loadingState}
              downloading={downloading}
              errorMessage={errorMessage}
              isPlaylistError={isPlaylistError}
              infoProgress={infoProgress}
              infoStatus={infoStatus}
              downloadProgress={downloadProgress}
              downloadStatus={downloadStatus}
              onUrlChange={handleUrlChange}
              onExtensionChange={setExtension}
              onSubmit={handleGetInfo}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {/* Loading skeleton */}
        {loadingState === "loading" && !trackInfo && (
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
              <div className="animate-pulse space-y-4 p-8">
                <div className="h-64 rounded-lg bg-white/10"></div>
                <div className="space-y-2">
                  <div className="h-8 w-3/4 rounded-lg bg-white/10"></div>
                  <div className="h-4 w-1/2 rounded-lg bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Music info card */}
        {trackInfo && (
          <div ref={resultSectionRef} className="mx-auto max-w-7xl scroll-mt-24">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                {t("track_info_title")}
              </h2>
              <p className="text-xs text-slate-400 md:text-sm">{t("track_info_subtitle")}</p>
            </div>
            <div className="transition-all duration-500 ease-in-out">
              <TrackInfoCard
                trackInfo={trackInfo}
                onDownload={handleDownload}
                isDownloading={downloading}
              />
            </div>
          </div>
        )}

        <ShareButtons />

        <DeferredGoogleAdUnitWrap />

        {/* Empty state message */}
        {/* {loadingState === "idle" && !trackInfo && (
          <div className="mx-auto max-w-6xl text-center">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm md:p-10">
              <div className="mb-4 text-5xl md:mb-6 md:text-7xl">🎼</div>
              <h2 className="mb-2 text-xl font-bold text-white md:mb-3 md:text-2xl">
                {t("empty_state_title")}
              </h2>
              <p className="text-sm text-slate-300 md:text-base">{t("empty_state_description")}</p>
            </div>
          </div>
        )} */}

        {/* SEO Content Sections */}
        <div
          className="mx-auto max-w-7xl space-y-8 md:space-y-12"
          style={seoContentVisibilityStyle}
        >
          {/* What is this tool section */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <div className="relative z-10">
              <h2 className="mb-6 text-2xl font-bold text-white md:mb-8 md:text-3xl">
                {t("section_what_is_title")}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                <div>
                  <p className="mb-4 text-base text-slate-300 md:mb-6 md:text-lg">
                    {t.rich("section_what_is_description_1", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                  <p className="text-base text-slate-300 md:text-lg">
                    {t.rich("section_what_is_description_2", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
                    })}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur-sm md:p-8">
                  <h3 className="mb-4 flex items-center text-lg font-semibold text-white md:mb-6 md:text-xl">
                    <span className="mr-3 text-xl md:text-2xl">✨</span>
                    {t("section_what_is_key_benefits")}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300 md:space-y-3 md:text-base">
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-purple-400"></div>
                      {t("section_what_is_benefit_1")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-pink-400"></div>
                      {t("section_what_is_benefit_2")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-emerald-400"></div>
                      {t("section_what_is_benefit_3")}
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                      {t("section_what_is_benefit_4")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Convert SoundCloud to WAV Online Section */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
              {t("section_convert_online_title")}
            </h2>
            <p className="text-base text-slate-300 md:text-lg">
              {t("section_convert_online_description")}
            </p>
          </section>

          {/* Core Facts Section */}
          <CoreFactsSection />

          {/* Key Features Section */}
          <KeyFeaturesSection />

          {/* How-to Guide Section */}
          <HowToSection />

          {/* Format Comparison Section */}
          <FormatComparisonSection />

          {/* Use Cases Section */}
          <UseCasesSection />

          {/* FAQ Section */}
          <FAQSection />

          {/* Legal and Ethical Section */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <h2 className="mb-4 text-2xl font-bold text-white md:mb-6 md:text-3xl">
              {t("section_legal_title")}
            </h2>
            <div className="md:prose-md prose prose-base max-w-none text-slate-300 prose-headings:text-white prose-strong:font-bold prose-strong:text-orange-300 prose-ul:text-slate-300">
              <p>{t("section_legal_description")}</p>
              <ul className="list-inside list-disc space-y-2 md:space-y-3">
                <li>{t("section_legal_point_1")}</li>
                <li>{t("section_legal_point_2")}</li>
                <li>{t("section_legal_point_3")}</li>
                <li>{t("section_legal_point_4")}</li>
              </ul>
              <p className="mt-4 md:mt-6">{t("section_legal_footer")}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
