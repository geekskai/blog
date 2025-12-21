"use client"

import Image from "next/image"
import React from "react"

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
const formatDuration = (ms?: number): string => {
  if (!ms) return "Unknown"
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
const formatDate = (dateString?: string): string => {
  if (!dateString) return "Unknown"
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffMonths < 12) return `${diffMonths} months ago`
    if (diffYears < 1) return `${diffYears} years ago`
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
}: {
  label: string
  value: string | number | boolean | undefined
  icon?: string
}) => {
  if (value === undefined || value === null) return null

  const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)

  return (
    <div className="flex items-start space-x-3">
      {icon && <span className="text-xl">{icon}</span>}
      <div className="flex-1">
        <span className="text-xs font-medium text-gray-400">{label}</span>
        <p className="text-sm font-semibold text-white">{displayValue}</p>
      </div>
    </div>
  )
}

export default function TrackInfoCard({
  trackInfo,
  onDownload,
  isDownloading = false,
}: TrackInfoCardProps) {
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
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
      {/* Header: artwork and basic info */}
      <div className="border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          {/* Artwork */}
          {artworkUrl && (
            <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl shadow-purple-500/25 md:h-56 md:w-56">
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
          <div className="flex flex-1 flex-col justify-center space-y-4 text-white">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">{title || "Unknown Title"}</h2>
              {user && (
                <div className="mt-3 flex items-center space-x-3">
                  {userAvatarUrl && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/30">
                      <Image
                        src={userAvatarUrl}
                        alt={user.username || "User"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <span className="text-lg font-medium text-white/90">
                    {user.username || "Unknown Artist"}
                  </span>
                </div>
              )}
            </div>

            {/* Duration and status labels */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                ⏱️ {formatDuration(duration || full_duration)}
              </span>
              {streamable && (
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                  🔊 Streamable
                </span>
              )}
              {downloadable && (
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                  ⬇️ Downloadable
                </span>
              )}
              {genre && (
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                  🎵 {genre}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-8">
        {/* Description */}
        {description && (
          <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-3 text-sm font-semibold text-purple-300">Description</h3>
            <p className="text-sm leading-relaxed text-slate-300">{description}</p>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="group rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <div className="text-3xl font-bold text-pink-400">{formatNumber(likes_count)}</div>
            <div className="text-xs text-pink-300">❤️ Likes</div>
          </div>
          <div className="group rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <div className="text-3xl font-bold text-blue-400">{formatNumber(playback_count)}</div>
            <div className="text-xs text-blue-300">👁️ Plays</div>
          </div>
          <div className="group rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <div className="text-3xl font-bold text-emerald-400">{formatNumber(reposts_count)}</div>
            <div className="text-xs text-emerald-300">🔄 Reposts</div>
          </div>
          <div className="group rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <div className="text-3xl font-bold text-purple-400">{formatNumber(comment_count)}</div>
            <div className="text-xs text-purple-300">💬 Comments</div>
          </div>
        </div>

        {/* Tags */}
        {tag_list && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold text-purple-300">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {tag_list.split(" ").map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-purple-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed info grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="ID" value={trackInfo.id} icon="🆔" />
          <InfoItem label="Type" value={kind} icon="📋" />
          <InfoItem label="Status" value={state} icon="📊" />
          <InfoItem label="Download Count" value={formatNumber(download_count)} icon="⬇️" />
          <InfoItem label="Downloadable Remaining" value={has_downloads_left} icon="📥" />
          <InfoItem label="Commentable" value={commentable} icon="💬" />
          <InfoItem label="Public" value={isPublic} icon="🌐" />
          <InfoItem label="Monetization Model" value={monetization_model} icon="💰" />
          <InfoItem label="Policy" value={policy} icon="📜" />
          {trackInfo.label_name && (
            <InfoItem label="Label" value={trackInfo.label_name} icon="🏷️" />
          )}
          {created_at && <InfoItem label="Created At" value={formatDate(created_at)} icon="📅" />}
          {last_modified && (
            <InfoItem label="Last Modified" value={formatDate(last_modified)} icon="✏️" />
          )}
          {display_date && (
            <InfoItem label="Display Date" value={formatDate(display_date)} icon="📆" />
          )}
        </div>

        {/* Action buttons area */}
        <div className="flex flex-wrap gap-4 border-t border-white/10 pt-8">
          {onDownload && (
            <button
              onClick={onDownload}
              disabled={isDownloading || !downloadable}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative flex items-center gap-2">
                {isDownloading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
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
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">⬇️</span>
                    <span>Download</span>
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
              className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <span className="mr-2 text-xl">🔗</span>
              <span>View on SoundCloud</span>
            </a>
          )}
          {waveform_url && (
            <a
              href={waveform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <span className="mr-2 text-xl">📊</span>
              <span>View Waveform</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
