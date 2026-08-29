"use client"
import React, { useEffect, useRef } from "react"
import TrackInfoCard, { TrackInfo } from "./TrackInfoCard"
import { useLocale, useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { GoogleAdUnitPlaceholder } from "@/components/GoogleAdUnitPlaceholder"
import SoundCloudToolSwitcher from "@/components/SoundCloudToolSwitcher"
import DownloadShareModal from "@/components/download-quota/DownloadShareModal"
import TrackDownloadForm from "../soundcloud-downloader/components/TrackDownloadForm"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
import { useSoundCloudTrackDownloadForm } from "../soundcloud-downloader/hooks/useSoundCloudTrackDownloadForm"
import FreeWorkspacePrompt from "@/components/auth/FreeWorkspacePrompt"
import SoundCloudEvidenceContent from "@/components/SoundCloudEvidenceContent"
import { getSoundCloudPageCopy, SOUNDCLOUD_SEO_UPDATED } from "@/data/soundCloudSeo"

const DeferredGoogleAdUnitWrap = dynamic(() => import("@/components/GoogleAdUnitWrap"), {
  ssr: false,
  loading: () => <GoogleAdUnitPlaceholder />,
})

const getFileName = (trackInfo: TrackInfo | null, extension: string): string => {
  return trackInfo?.title ? `${trackInfo.title}.${extension}` : `audio-${Date.now()}.${extension}`
}

export default function SoundCloudToMP3Page() {
  const t = useTranslations("SoundCloudToMP3")
  const locale = useLocale()
  const copy = getSoundCloudPageCopy("mp3", locale)
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
    hasCompletedDownload,
    downloadQuota,
    setExtension,
    handleUrlChange,
    handleGetInfo,
    handleDownload,
  } = useSoundCloudTrackDownloadForm<TrackInfo>({
    initialExtension: "mp3",
    t,
    invalidUrlLogPrefix: "soundcloud to mp3",
    getFileName,
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
      <div className="mx-auto max-w-7xl space-y-4 p-4">
        {/* Content Freshness Badge */}
        <ContentFreshnessBadge
          lastModified={new Date(SOUNDCLOUD_SEO_UPDATED)}
          namespace="SoundCloudToMP3"
        />
        <header className="text-center">
          {/* Main Title - H1 for SEO */}
          <h1 className="my-3 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-2xl font-bold leading-tight text-transparent md:text-5xl">
            {copy.pageTitle}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-3 max-w-7xl text-base text-slate-300 md:text-lg">
            {copy.heroDescription}
          </p>
        </header>

        {/* Input area card */}
        <div className="mx-auto max-w-7xl md:mb-8">
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

        <SoundCloudToolSwitcher current="mp3" />

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

        {hasCompletedDownload && <FreeWorkspacePrompt />}

        <DeferredGoogleAdUnitWrap />

        <SoundCloudEvidenceContent page="mp3" />
      </div>
      <DownloadShareModal
        isOpen={downloadQuota.showShareModal}
        shareLink={downloadQuota.shareLink}
        unlockAmount={downloadQuota.quotaConfig.shareBonusClicks}
        canRegister={!downloadQuota.quotaConfig.isRegistered}
        canShare={downloadQuota.quotaConfig.shareUnlockAvailable}
        used={downloadQuota.quotaConfig.used}
        limit={downloadQuota.quotaConfig.limit}
        remaining={downloadQuota.quotaConfig.remaining}
        errorMessage={downloadQuota.quotaMessage}
        onClose={downloadQuota.closeShareModal}
        onUnlock={downloadQuota.handleShareUnlock}
        onCreateAccount={downloadQuota.startRegistration}
      />
    </div>
  )
}
