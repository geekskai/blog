"use client"
import GoogleAdUnitWrap from "@/components/GoogleAdUnitWrap"
import React from "react"
import TrackInfoCard, { TrackInfo } from "./TrackInfoCard"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import {
  CoreFactsSection,
  FAQSection,
  HowToSection,
  FormatComparisonSection,
  UseCasesSection,
  KeyFeaturesSection,
  BoundaryDefinitionSection,
  FreeVsPaidSection,
} from "./SEOContent"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
import ShareButtons from "@/components/ShareButtons"
import { useSoundCloudTrackDownloadForm } from "../soundcloud-downloader/hooks/useSoundCloudTrackDownloadForm"

const TrackDownloadForm = dynamic(
  () => import("../soundcloud-downloader/components/TrackDownloadForm"),
  { ssr: false }
)

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

export default function SoundCloudToMP3Page() {
  const t = useTranslations("SoundCloudToMP3")
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
    initialExtension: "mp3",
    t,
    invalidUrlLogPrefix: "soundcloud to mp3",
    getFileName,
    createDownloadLink,
  })

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        {/* Content Freshness Badge */}
        <ContentFreshnessBadge lastModified={new Date("2026-02-20")} namespace="SoundCloudToMP3" />
        <header className="text-center">
          {/* Main Title - H1 for SEO */}
          <h1 className="my-3 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-2xl font-bold leading-tight text-transparent md:text-5xl">
            {t("page_title")}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-3 max-w-6xl text-base text-slate-300 md:text-lg">
            {t.rich("page_subtitle", {
              mp3: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
              wav: (chunks) => <strong className="text-cyan-400">{chunks}</strong>,
              free: (chunks) => <strong className="text-emerald-400">{chunks}</strong>,
              fast: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              no_registration: (chunks) => <strong className="text-pink-400">{chunks}</strong>,
            })}
          </p>

          {/* TL;DR Block - GEO Requirement: Answer Seed (80-150 words) */}
          <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10 p-5 shadow-2xl backdrop-blur-md sm:p-6 md:mt-12 md:p-10">
            <h2 className="mb-4 text-base font-bold text-purple-300 sm:text-lg md:text-2xl">
              {t("page_tldr_title")}
            </h2>
            <p className="text-sm text-slate-200 sm:text-base md:text-lg md:leading-loose">
              {t("page_tldr_content")}
            </p>
          </div>
        </header>

        <GoogleAdUnitWrap />

        {/* Input area card */}
        <div className="mx-auto max-w-6xl md:mb-12">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <div className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 px-4 py-3">
              <h2 className="text-lg font-semibold text-white md:text-2xl">{t("form_title")}</h2>
            </div>
            <TrackDownloadForm
              namespace="SoundCloudToMP3"
              variant="track"
              formId="soundcloud-to-mp3-form"
              url={url}
              placeholder="https://soundcloud.com/username/your-song-name"
              relatedToolHref="/tools/soundcloud-downloader"
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

        <ShareButtons />

        {/* Loading skeleton */}
        {loadingState === "loading" && !trackInfo && (
          <div className="mx-auto max-w-6xl">
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
          <div className="mx-auto max-w-6xl">
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

        {/* SEO Content Sections */}
        <div className="mx-auto max-w-6xl space-y-8 md:space-y-12">
          {/* What is this tool section */}
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <div>
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

          {/* Convert SoundCloud to MP3/WAV Online Section */}
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

          {/* Boundary Definition Section - GEO Requirement */}
          <BoundaryDefinitionSection />

          {/* Free vs Paid Comparison Section - GEO Requirement */}
          <FreeVsPaidSection />

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
