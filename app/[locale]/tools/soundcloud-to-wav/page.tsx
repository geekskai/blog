"use client"

import { FormEvent, useState } from "react"
import TrackInfoCard, { TrackInfo } from "./TrackInfoCard"
import React from "react"
import { useTranslations } from "next-intl"
import {
  CoreFactsSection,
  FAQSection,
  HowToSection,
  FormatComparisonSection,
  UseCasesSection,
  KeyFeaturesSection,
  ContentFreshnessBadge,
} from "./SEOContent

type LoadingState = "idle" | "loading" | "success" | "error"

// Constants
const SOUNDCLOUD_URL_REGEX = /^https?:\/\/(www\.)?soundcloud\.com\/.+/

// Utility functions
const isValidSoundCloudUrl = (url: string): boolean => {
  return SOUNDCLOUD_URL_REGEX.test(url)
}

const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2)
}

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

// Loading spinner component
const LoadingSpinner = () => (
  <svg
    className="h-5 w-5 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

// Progress bar component
interface ProgressBarProps {
  progress: number
  status: string
  className?: string
}

const ProgressBar = ({ progress, status, className = "" }: ProgressBarProps) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex items-center justify-between text-xs text-white/90">
      <span className={progress > 0 ? "truncate" : ""}>{status || "Processing..."}</span>
      {progress > 0 && (
        <span className="ml-2 flex-shrink-0 font-semibold text-purple-300">{progress}%</span>
      )}
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
      {progress > 0 ? (
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 shadow-lg shadow-purple-500/50 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      ) : (
        <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-cyan-500/50" />
      )}
    </div>
  </div>
)

export default function Page() {
  const t = useTranslations("SoundCloudToWAV")
  const [url, setUrl] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [infoProgress, setInfoProgress] = useState<number>(0)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [infoStatus, setInfoStatus] = useState<string>("")
  const [downloadStatus, setDownloadStatus] = useState<string>("")

  // Reset state
  const resetInfoState = () => {
    setInfoProgress(0)
    setInfoStatus("")
  }

  const resetDownloadState = () => {
    setDownloadProgress(0)
    setDownloadStatus("")
    setDownloading(false)
  }

  const resetDownloadProgress = () => {
    setDownloadProgress(0)
    setDownloadStatus("")
  }

  const resetError = () => {
    setErrorMessage("")
  }

  // Validate URL
  const validateUrl = (): boolean => {
    if (!url.trim()) {
      setErrorMessage(t("error_empty_url"))
      return false
    }
    if (!isValidSoundCloudUrl(url.trim())) {
      setErrorMessage(t("error_invalid_url"))
      return false
    }
    return true
  }

  // Get audio info
  const handleGetInfo = async (e?: FormEvent) => {
    e?.preventDefault()

    if (!validateUrl()) {
      setLoadingState("error")
      return
    }

    try {
      setLoadingState("loading")
      resetError()
      setTrackInfo(null)
      resetInfoState()
      setInfoStatus(t("progress_connecting"))

      const startTime = Date.now()
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed < 1000) {
          setInfoStatus(t("progress_connecting"))
          setInfoProgress(10)
        } else if (elapsed < 3000) {
          setInfoStatus(t("progress_fetching"))
          setInfoProgress(30)
        } else {
          setInfoStatus(t("progress_processing"))
          setInfoProgress(60)
        }
      }, 500)

      const response = await fetch("/api/soundcloud-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      clearInterval(progressInterval)
      setInfoStatus(t("progress_parsing"))
      setInfoProgress(90)

      const data = await response.json()

      if (data.success) {
        setInfoProgress(100)
        setInfoStatus(t("progress_complete"))
        setTrackInfo({ ...data.info, downloadable: true })
        setLoadingState("success")
        setTimeout(resetInfoState, 1000)

        // 可选：提示用户立即下载以避免 URL 过期
        // 或者自动开始下载
      } else {
        setErrorMessage(data.error || t("error_get_info_failed"))
        setLoadingState("error")
        resetInfoState()
      }
    } catch (error) {
      setErrorMessage(t("error_network"))
      setLoadingState("error")
      resetInfoState()
      console.error("Get info error:", error)
    }
  }

  const [extension, setExtension] = useState("wav")

  // Download audio (using fetch + ReadableStream to track progress)
  const handleDownload = async () => {
    if (!validateUrl()) return

    // Prevent duplicate clicks
    if (downloading) return

    try {
      setDownloading(true)
      resetError()
      resetDownloadProgress()
      setDownloadStatus(t("progress_connecting"))

      setDownloadStatus(t("progress_sending_request"))
      setDownloadProgress(5)

      const response = await fetch("/api/download-soundcloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: t("error_download_failed"),
        }))
        setErrorMessage(errorData.error || t("error_download_failed"))
        resetDownloadState()
        return
      }

      setDownloadStatus(t("progress_server_processing"))
      setDownloadProgress(10)

      // Get file size and SoundCloud info from response headers
      const contentLength = response.headers.get("Content-Length")
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0
      const infoHeader = response.headers.get("X-SoundCloud-Info")
      let downloadedInfo: TrackInfo | null = null

      if (infoHeader) {
        try {
          downloadedInfo = {
            ...JSON.parse(infoHeader),
            downloadable: true,
          }
          setTrackInfo(downloadedInfo)
        } catch (e) {
          console.warn("Failed to parse SoundCloud info:", e)
        }
      }

      // Use ReadableStream to track download progress
      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()
      const chunks: BlobPart[] = []
      let loadedBytes = 0

      // Read stream data
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        chunks.push(value)
        loadedBytes += value.length

        // Update progress
        if (totalBytes > 0) {
          const progress = Math.round((loadedBytes / totalBytes) * 80 + 20)
          setDownloadProgress(progress)
          const loadedMB = formatFileSize(loadedBytes)
          const totalMB = formatFileSize(totalBytes)
          setDownloadStatus(`${t("progress_downloading_file")}: ${loadedMB}MB / ${totalMB}MB`)
        } else {
          setDownloadStatus(t("progress_downloading_file"))
          setDownloadProgress((prev) => Math.min(prev + 2, 95))
        }
      }

      // Build Blob
      setDownloadProgress(100)
      setDownloadStatus(t("progress_saving_file"))

      const isMP3 = extension === "mp3"

      const blob = new Blob(chunks, { type: isMP3 ? "audio/mpeg" : "audio/wav" })
      createDownloadLink(blob, getFileName(downloadedInfo || trackInfo, isMP3 ? "mp3" : "wav"))

      setTimeout(resetDownloadState, 1000)
    } catch (error) {
      console.error("Download error:", error)
      setErrorMessage(error instanceof Error ? error.message : t("error_download_failed"))
      resetDownloadState()
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

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section - SEO Optimized */}
        <header className="mb-12 text-center">
          {/* Tool Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-6 py-3 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30">
            <div className="rounded-full bg-white/20 p-1">
              <span className="text-xl">🎵</span>
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
              wav: (chunks) => <strong className="text-purple-400">{chunks}</strong>,
              mp3: (chunks) => <strong className="text-cyan-400">{chunks}</strong>,
              free: (chunks) => <strong className="text-emerald-400">{chunks}</strong>,
              fast: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
              no_registration: (chunks) => <strong className="text-pink-400">{chunks}</strong>,
            })}
          </p>

          {/* Content Freshness Badge */}
          <ContentFreshnessBadge lastModified={new Date("2025-12-21")} />
        </header>

        {/* Input area card */}
        <div className="mx-auto mb-12 max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <div className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-6">
              <h2 className="text-xl font-semibold text-white md:text-2xl">{t("form_title")}</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleGetInfo} className="space-y-6">
                <div>
                  <label
                    htmlFor="soundcloud-url"
                    className="mb-3 block text-sm font-semibold text-white/90"
                  >
                    {t("form_label_soundcloud_link")}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-white/5 p-2 backdrop-blur-sm">
                      <span className="text-xl">🔗</span>
                    </div>
                    <input
                      id="soundcloud-url"
                      type="text"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value)
                        resetError()
                        setLoadingState("idle")
                      }}
                      placeholder={t("form_placeholder_url")}
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-4 pl-16 pr-6 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
                {/* Action buttons group */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex flex-1 flex-col gap-3">
                      <button
                        type="submit"
                        disabled={loadingState === "loading" || !url.trim()}
                        className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                        <span className="relative flex items-center justify-center gap-2">
                          {loadingState === "loading" ? (
                            <>
                              <LoadingSpinner />
                              <span>{t("form_button_fetching")}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl">🔍</span>
                              <span>{t("form_button_get_info")}</span>
                            </>
                          )}
                        </span>
                      </button>
                      {loadingState === "loading" && (
                        <ProgressBar progress={infoProgress} status={infoStatus} />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={downloading || !url.trim() || loadingState === "loading"}
                        className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                        <span className="relative flex items-center justify-center gap-2">
                          {downloading ? (
                            <>
                              <LoadingSpinner />
                              <span>{t("form_button_downloading")}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl">⬇️</span>
                              <span>{t("form_button_download")}</span>
                            </>
                          )}
                        </span>
                      </button>
                      {downloading && (
                        <ProgressBar progress={downloadProgress} status={downloadStatus} />
                      )}
                    </div>
                    {/* MP3 or WAV */}
                    <div className="flex w-full flex-col gap-3 sm:w-32">
                      <select
                        value={extension}
                        onChange={(e) => setExtension(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="mp3" className="bg-slate-900">
                          {t("form_select_format_mp3")}
                        </option>
                        <option value="wav" className="bg-slate-900">
                          {t("form_select_format_wav")}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>

              {/* Error message */}
              {errorMessage && (
                <div className="mt-6 rounded-lg border border-red-500/30 bg-red-900/20 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-red-400">
                    <span className="text-xl">⚠️</span>
                    <span className="text-sm font-medium">{errorMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {loadingState === "loading" && !trackInfo && (
          <div className="mx-auto max-w-4xl">
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
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-white">{t("track_info_title")}</h2>
              <p className="text-sm text-slate-400">{t("track_info_subtitle")}</p>
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

        {/* Empty state message */}
        {loadingState === "idle" && !trackInfo && (
          <div className="mx-auto max-w-2xl text-center">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-12 shadow-xl backdrop-blur-sm">
              <div className="mb-6 text-7xl">🎼</div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t("empty_state_title")}</h3>
              <p className="text-slate-300">{t("empty_state_description")}</p>
            </div>
          </div>
        )}

        {/* SEO Content Sections */}
        <div className="mx-auto mt-32 space-y-24">
          {/* What is this tool section */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10"></div>
            <div className="relative z-10">
              <h2 className="mb-8 text-3xl font-bold text-white">{t("section_what_is_title")}</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">
                    {t.rich("section_what_is_description_1", {
                      strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
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
          <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
            <h2 className="mb-6 text-3xl font-bold text-white">{t("section_legal_title")}</h2>
            <div className="prose prose-lg max-w-none text-slate-300 prose-headings:text-white prose-strong:font-bold prose-strong:text-orange-300 prose-ul:text-slate-300">
              <p>{t("section_legal_description")}</p>
              <ul className="list-inside list-disc space-y-3">
                <li>{t("section_legal_point_1")}</li>
                <li>{t("section_legal_point_2")}</li>
                <li>{t("section_legal_point_3")}</li>
                <li>{t("section_legal_point_4")}</li>
              </ul>
              <p className="mt-6">{t("section_legal_footer")}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
