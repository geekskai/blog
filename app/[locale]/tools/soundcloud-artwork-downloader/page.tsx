"use client"

import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
import { TldrBlock } from "@/components/TldrBlock"
import { GoogleAdUnitPlaceholder } from "@/components/GoogleAdUnitPlaceholder"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import React, { useEffect, useMemo, useRef, useState } from "react"
import ArtworkDownloadForm from "./components/ArtworkDownloadForm"
import {
  getPreviewArtworkUrl,
  useSoundCloudArtworkDownloadForm,
} from "./hooks/useSoundCloudArtworkDownloadForm"
import { CoreFactsSection, FAQSection, HowItWorksSection } from "./SEOContent"

const DeferredGoogleAdUnitWrap = dynamic(() => import("@/components/GoogleAdUnitWrap"), {
  ssr: false,
  loading: () => <GoogleAdUnitPlaceholder />,
})

const seoContentVisibilityStyle: React.CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "auto 2200px",
}

const formatDuration = (ms?: number): string => {
  if (!ms) {
    return "--"
  }

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

const formatNumber = (value?: number): string => {
  if (!value) {
    return "0"
  }

  return value.toLocaleString()
}

export default function SoundCloudArtworkDownloaderPage() {
  const t = useTranslations("SoundCloudArtworkDownloader")
  const {
    url,
    trackInfo,
    previewArtworkUrl,
    loadingState,
    downloading,
    errorMessage,
    isPlaylistError,
    infoProgress,
    infoStatus,
    downloadProgress,
    downloadStatus,
    handleUrlChange,
    handleGetInfo,
    handleDownload,
  } = useSoundCloudArtworkDownloadForm(t)

  const artworkUrl = useMemo(
    () => previewArtworkUrl || getPreviewArtworkUrl(trackInfo?.artwork_url),
    [previewArtworkUrl, trackInfo?.artwork_url]
  )
  const artworkCandidates = useMemo(() => {
    const candidates = [
      artworkUrl,
      trackInfo?.artwork_url?.replace(/^http:\/\//i, "https://"),
      trackInfo?.artwork_url,
    ]
    return Array.from(new Set(candidates.filter(Boolean))) as string[]
  }, [artworkUrl, trackInfo?.artwork_url])
  const [artworkSrcIndex, setArtworkSrcIndex] = useState(0)
  const resultSectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setArtworkSrcIndex(0)
  }, [artworkCandidates])

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

  const activeArtworkSrc = artworkCandidates[artworkSrcIndex] || ""

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative mx-auto max-w-7xl space-y-4 p-4">
        <ContentFreshnessBadge
          lastModified={new Date("2026-05-26")}
          namespace="SoundCloudArtworkDownloader"
        />

        <header className="text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 px-4 py-2 text-sm text-white shadow-lg shadow-pink-500/25 md:px-6 md:py-3 md:text-base">
            <div className="rounded-full bg-white/20 p-1">
              <span className="text-base md:text-lg">🖼️</span>
            </div>
            <span className="font-semibold">{t("tool_badge")}</span>
          </div>

          <h1 className="my-3 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-2xl font-bold leading-tight text-transparent md:text-5xl">
            {t("page_title")}
          </h1>

          <p className="mx-auto mb-3 max-w-7xl text-base text-slate-300 md:text-lg">
            {t("page_subtitle")}
          </p>

          <TldrBlock title={t("page_quick_answer_title")}>
            {t("page_quick_answer_content")}
          </TldrBlock>
        </header>

        <div className="mx-auto max-w-7xl md:mb-12">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <div className="border-b border-white/10 bg-gradient-to-r from-fuchsia-900/20 to-orange-900/20 px-4 py-3">
              <h2 className="text-lg font-semibold text-white md:text-2xl">{t("form_title")}</h2>
            </div>

            <ArtworkDownloadForm
              formId="soundcloud-artwork-downloader-form"
              url={url}
              placeholder="https://soundcloud.com/username/song-name"
              loadingState={loadingState}
              canDownload={Boolean(trackInfo?.artwork_url)}
              downloading={downloading}
              errorMessage={errorMessage}
              isPlaylistError={isPlaylistError}
              infoProgress={infoProgress}
              infoStatus={infoStatus}
              downloadProgress={downloadProgress}
              downloadStatus={downloadStatus}
              onUrlChange={handleUrlChange}
              onSubmit={handleGetInfo}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {loadingState === "loading" && !trackInfo ? (
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
              <div className="animate-pulse space-y-4 p-8">
                <div className="aspect-square w-full max-w-md rounded-2xl bg-white/10"></div>
                <div className="space-y-2">
                  <div className="h-8 w-3/4 rounded-lg bg-white/10"></div>
                  <div className="h-4 w-1/2 rounded-lg bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {trackInfo && activeArtworkSrc ? (
          <div ref={resultSectionRef} className="mx-auto max-w-7xl scroll-mt-24">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                {t("preview_title")}
              </h2>
              <p className="text-xs text-slate-400 md:text-sm">{t("preview_subtitle")}</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm md:rounded-3xl">
              <div className="border-b border-white/10 bg-gradient-to-r from-fuchsia-900/20 to-orange-900/20 p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                  <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl md:mx-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeArtworkSrc}
                      alt={trackInfo.title || t("preview_unknown_title")}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setArtworkSrcIndex((current) =>
                          current < artworkCandidates.length - 1 ? current + 1 : current
                        )
                      }}
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-5 text-center md:text-left">
                    <div className="space-y-2">
                      <span className="inline-flex items-center rounded-full border border-pink-400/20 bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-200">
                        {t("preview_ready_badge")}
                      </span>
                      <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                        {trackInfo.title || t("preview_unknown_title")}
                      </h2>
                      <p className="text-base text-slate-300 md:text-lg">
                        {trackInfo.user?.username || t("preview_unknown_artist")}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-400">
                          {t("preview_stat_duration")}
                        </div>
                        <div className="mt-2 text-xl font-bold text-white">
                          {formatDuration(trackInfo.duration)}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-400">
                          {t("preview_stat_likes")}
                        </div>
                        <div className="mt-2 text-xl font-bold text-white">
                          {formatNumber(trackInfo.likes_count)}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-400">
                          {t("preview_stat_plays")}
                        </div>
                        <div className="mt-2 text-xl font-bold text-white">
                          {formatNumber(trackInfo.playback_count)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={downloading}
                        className="group flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
                      >
                        <span className="relative flex items-center justify-center gap-3">
                          <span className="text-xl">⬇️</span>
                          <span>{t("preview_download_button")}</span>
                        </span>
                      </button>

                      {trackInfo.permalink_url ? (
                        <a
                          href={trackInfo.permalink_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-lg focus:ring-4 focus:ring-white/5 active:scale-[0.98] sm:text-base md:flex-1 lg:flex-initial"
                        >
                          <span className="mr-3 text-xl">🔗</span>
                          <span>{t("preview_open_button")}</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {trackInfo.description ? (
                <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-8">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
                      {t("preview_description_label")}
                    </h3>
                    <p className="text-sm text-slate-300 sm:text-base md:text-lg md:leading-relaxed">
                      {trackInfo.description}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <DeferredGoogleAdUnitWrap />

        <div
          className="mx-auto max-w-7xl space-y-8 md:space-y-12"
          style={seoContentVisibilityStyle}
        >
          <CoreFactsSection />
          <HowItWorksSection />

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
              {t("boundary_title")}
            </h2>
            <p className="text-slate-300">{t("boundary_description")}</p>
          </section>

          <FAQSection />
        </div>
      </div>
    </div>
  )
}
