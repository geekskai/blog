"use client"

import Image from "next/image"
import React from "react"
import { useTranslations } from "next-intl"

interface Transcoding {
  url: string
  preset: string
  duration: number
  snipped: boolean
  format: {
    protocol: string
    mime_type: string
  }
}

interface User {
  id: number
  kind: string
  permalink: string
  username: string
  last_modified: string
  uri: string
  permalink_url: string
  avatar_url?: string
}

export interface TrackInfo {
  kind: string
  monetization_model: string
  id: number
  policy: string
  comment_count?: number
  full_duration?: number
  downloadable?: boolean
  created_at?: string
  description?: string
  media?: { transcodings: Transcoding[] }
  title?: string
  publisher_metadata?: any
  duration?: number
  has_downloads_left?: boolean
  artwork_url?: string
  public?: boolean
  streamable?: boolean
  tag_list?: string
  genre?: string
  reposts_count?: number
  label_name?: string
  state?: string
  last_modified?: string
  commentable?: boolean
  uri?: string
  download_count?: number
  likes_count?: number
  display_date?: string
  user_id?: number
  waveform_url?: string
  permalink?: string
  permalink_url?: string
  user?: User
  playback_count?: number
}

interface TrackInfoCardProps {
  trackInfo: TrackInfo
  onDownload?: () => void
  isDownloading?: boolean
}

// Format duration (milliseconds to mm:ss)
const formatDuration = (ms?: number, t?: ReturnType<typeof useTranslations>): string => {
  if (!ms) return t ? t("track_info_unknown") : "Unknown"
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Format number (add thousand separators)
const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return "0"
  return num.toLocaleString()
}

// Format date
const formatDate = (dateString?: string, t?: ReturnType<typeof useTranslations>): string => {
  if (!dateString) return t ? t("track_info_unknown") : "Unknown"
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (!t) {
      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins} minutes ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      if (diffDays < 30) return `${diffDays} days ago`
      if (diffMonths < 12) return `${diffMonths} months ago`
      if (diffYears < 1) return `${diffYears} years ago`
      return date.toLocaleDateString("en-US")
    }

    if (diffMins < 1) return t("track_info_just_now")
    if (diffMins < 60) return `${diffMins} ${t("track_info_minutes_ago")}`
    if (diffHours < 24) return `${diffHours} ${t("track_info_hours_ago")}`
    if (diffDays < 30) return `${diffDays} ${t("track_info_days_ago")}`
    if (diffMonths < 12) return `${diffMonths} ${t("track_info_months_ago")}`
    if (diffYears < 1) return `${diffYears} ${t("track_info_years_ago")}`
    return date.toLocaleDateString("en-US")
  } catch {
    return dateString
  }
}

// Info item component
const InfoItem = ({
  label,
  value,
  icon,
  t,
}: {
  label: string
  value: string | number | boolean | undefined
  icon?: string
  t?: ReturnType<typeof useTranslations>
}) => {
  if (value === undefined || value === null) return null

  const displayValue =
    typeof value === "boolean"
      ? value
        ? t
          ? t("track_info_yes")
          : "Yes"
        : t
          ? t("track_info_no")
          : "No"
      : String(value)

  return (
    <div className="flex items-start gap-2 sm:gap-3 md:gap-3">
      {icon && <span className="shrink-0 text-lg sm:text-xl">{icon}</span>}
      <div className="min-w-0 flex-1">
        <span className="text-xs font-medium text-gray-400 sm:text-sm">{label}</span>
        <p className="mt-0.5 truncate text-sm font-semibold text-white sm:text-base md:overflow-visible md:whitespace-normal">
          {displayValue}
        </p>
      </div>
    </div>
  )
}

export default function TrackInfoCard({
  trackInfo,
  onDownload,
  isDownloading = false,
}: TrackInfoCardProps) {
  const t = useTranslations("SoundCloudToWAV")
  const {
    title,
    artwork_url,
    user,
    duration,
    full_duration,
    description,
    genre,
    tag_list,
    likes_count,
    reposts_count,
    comment_count,
    playback_count,
    download_count,
    created_at,
    display_date,
    last_modified,
    streamable,
    downloadable,
    has_downloads_left,
    permalink_url,
    waveform_url,
    state,
    kind,
    monetization_model,
    policy,
    commentable,
    public: isPublic,
  } = trackInfo

  // Process artwork URL (replace size)
  const artworkUrl = artwork_url?.replace("-large", "-t500x500") || ""
  const userAvatarUrl = user?.avatar_url?.replace("-large", "-t300x300") || ""

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm sm:rounded-2xl md:rounded-2xl lg:rounded-3xl">
      {/* Header: artwork and basic info */}
      <div className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-4 backdrop-blur-sm sm:p-6 md:p-8 lg:p-10">
        <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-center md:gap-8 lg:gap-10">
          {/* Artwork */}
          {artworkUrl && (
            <div className="relative mx-auto h-40 w-40 flex-shrink-0 overflow-hidden rounded-xl border-2 border-white/20 shadow-2xl shadow-purple-500/25 sm:h-44 sm:w-44 sm:rounded-2xl md:mx-0 md:h-56 md:w-56 lg:h-64 lg:w-64">
              <Image
                src={artworkUrl}
                alt={title || "Track artwork"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Basic info */}
          <div className="flex min-w-0 flex-1 flex-col justify-center space-y-3 text-white sm:space-y-4 md:space-y-4 lg:space-y-5">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold leading-tight sm:text-2xl md:overflow-visible md:whitespace-normal md:text-3xl md:leading-snug lg:text-4xl lg:leading-snug">
                {title || t("track_info_unknown_title")}
              </h2>
              {user && (
                <div className="mt-2 flex min-w-0 items-center gap-2 sm:mt-3 sm:gap-3">
                  {userAvatarUrl && (
                    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/30 sm:h-10 sm:w-10">
                      <Image
                        src={userAvatarUrl}
                        alt={user.username || t("track_info_unknown_artist")}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <span className="min-w-0 truncate text-base font-medium text-white/90 sm:text-lg">
                    {user.username || t("track_info_unknown_artist")}
                  </span>
                </div>
              )}
            </div>

            {/* Duration and status labels */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-3 lg:gap-4">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                ⏱️ {formatDuration(duration || full_duration, t)}
              </span>
              {streamable && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                  🔊 {t("track_info_streamable")}
                </span>
              )}
              {downloadable && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                  ⬇️ {t("track_info_downloadable")}
                </span>
              )}
              {genre && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                  🎵 {genre}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Description */}
        {description && (
          <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:mb-8 sm:p-5 md:p-6 lg:mb-10 lg:p-8">
            <h3 className="mb-2 text-sm font-semibold leading-snug text-purple-300 sm:mb-3 sm:text-base">
              {t("track_info_description")}
            </h3>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base lg:leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-4 md:gap-4 lg:mb-10 lg:gap-6">
          <div className="group rounded-lg border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-5 md:p-6 lg:p-6">
            <div className="text-2xl font-bold text-pink-400 sm:text-3xl lg:text-4xl">
              {formatNumber(likes_count)}
            </div>
            <div className="mt-0.5 text-xs text-pink-300 sm:text-sm">
              ❤️ {t("track_info_likes")}
            </div>
          </div>
          <div className="group rounded-lg border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-5 md:p-6 lg:p-6">
            <div className="text-2xl font-bold text-blue-400 sm:text-3xl lg:text-4xl">
              {formatNumber(playback_count)}
            </div>
            <div className="mt-0.5 text-xs text-blue-300 sm:text-sm">
              👁️ {t("track_info_plays")}
            </div>
          </div>
          <div className="group rounded-lg border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-5 md:p-6 lg:p-6">
            <div className="text-2xl font-bold text-emerald-400 sm:text-3xl lg:text-4xl">
              {formatNumber(reposts_count)}
            </div>
            <div className="mt-0.5 text-xs text-emerald-300 sm:text-sm">
              🔄 {t("track_info_reposts")}
            </div>
          </div>
          <div className="group rounded-lg border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-5 md:p-6 lg:p-6">
            <div className="text-2xl font-bold text-purple-400 sm:text-3xl lg:text-4xl">
              {formatNumber(comment_count)}
            </div>
            <div className="mt-0.5 text-xs text-purple-300 sm:text-sm">
              💬 {t("track_info_comments")}
            </div>
          </div>
        </div>

        {/* Tags */}
        {tag_list && (
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <h3 className="mb-2 text-sm font-semibold text-purple-300 sm:mb-3 sm:text-base">
              {t("track_info_tags")}
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-3 lg:gap-4">
              {tag_list.split(" ").map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-purple-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:px-4 sm:py-2"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed info grid */}
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:mb-8 sm:gap-4 sm:p-5 md:grid-cols-2 md:p-6 lg:mb-10 lg:grid-cols-3 lg:gap-6 lg:p-8">
          <InfoItem label={t("track_info_id")} value={trackInfo.id} icon="🆔" t={t} />
          <InfoItem label={t("track_info_type")} value={kind} icon="📋" t={t} />
          <InfoItem label={t("track_info_status")} value={state} icon="📊" t={t} />
          <InfoItem
            label={t("track_info_download_count")}
            value={formatNumber(download_count)}
            icon="⬇️"
            t={t}
          />
          <InfoItem
            label={t("track_info_downloadable_remaining")}
            value={has_downloads_left}
            icon="📥"
            t={t}
          />
          <InfoItem label={t("track_info_commentable")} value={commentable} icon="💬" t={t} />
          <InfoItem label={t("track_info_public")} value={isPublic} icon="🌐" t={t} />
          <InfoItem
            label={t("track_info_monetization_model")}
            value={monetization_model}
            icon="💰"
            t={t}
          />
          <InfoItem label={t("track_info_policy")} value={policy} icon="📜" t={t} />
          {trackInfo.label_name && (
            <InfoItem label={t("track_info_label")} value={trackInfo.label_name} icon="🏷️" t={t} />
          )}
          {created_at && (
            <InfoItem
              label={t("track_info_created_at")}
              value={formatDate(created_at, t)}
              icon="📅"
              t={t}
            />
          )}
          {last_modified && (
            <InfoItem
              label={t("track_info_last_modified")}
              value={formatDate(last_modified, t)}
              icon="✏️"
              t={t}
            />
          )}
          {display_date && (
            <InfoItem
              label={t("track_info_display_date")}
              value={formatDate(display_date, t)}
              icon="📆"
              t={t}
            />
          )}
        </div>

        {/* Action buttons area */}
        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6 sm:gap-4 sm:pt-8 md:pt-8 lg:pt-10">
          {onDownload && (
            <button
              onClick={onDownload}
              disabled={isDownloading || !downloadable}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-lg sm:px-6 sm:py-3 sm:text-base md:min-h-[44px]"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative flex items-center gap-2">
                {isDownloading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin sm:h-5 sm:w-5"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>{t("form_button_downloading")}</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg sm:text-xl">⬇️</span>
                    <span>{t("form_button_download")}</span>
                  </>
                )}
              </span>
            </button>
          )}
          {permalink_url && (
            <a
              href={permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10 sm:rounded-lg sm:px-6 sm:py-3 sm:text-base"
            >
              <span className="mr-2 text-lg sm:text-xl">🔗</span>
              <span>{t("track_info_view_on_soundcloud")}</span>
            </a>
          )}
          {waveform_url && (
            <a
              href={waveform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10 sm:rounded-lg sm:px-6 sm:py-3 sm:text-base"
            >
              <span className="mr-2 text-lg sm:text-xl">📊</span>
              <span>{t("track_info_view_waveform")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
