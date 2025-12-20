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
    <div className="flex items-start space-x-2">
      {icon && <span className="text-lg">{icon}</span>}
      <div className="flex-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <p className="text-sm font-semibold text-gray-800">{displayValue}</p>
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
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Header: artwork and basic info */}
      <div className="relative bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {/* Artwork */}
          {artworkUrl && (
            <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-xl md:h-56 md:w-56">
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
          <div className="flex flex-1 flex-col justify-center space-y-3 text-white">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">{title || "Unknown Title"}</h2>
              {user && (
                <div className="mt-2 flex items-center space-x-2">
                  {userAvatarUrl && (
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={userAvatarUrl}
                        alt={user.username || "User"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <span className="text-lg font-medium opacity-90">
                    {user.username || "Unknown Artist"}
                  </span>
                </div>
              )}
            </div>

            {/* Duration and status labels */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                ⏱️ {formatDuration(duration || full_duration)}
              </span>
              {streamable && (
                <span className="rounded-full bg-green-500/80 px-3 py-1 text-sm backdrop-blur-sm">
                  🔊 Streamable
                </span>
              )}
              {downloadable && (
                <span className="rounded-full bg-blue-500/80 px-3 py-1 text-sm backdrop-blur-sm">
                  ⬇️ Downloadable
                </span>
              )}
              {genre && (
                <span className="rounded-full bg-purple-500/80 px-3 py-1 text-sm backdrop-blur-sm">
                  🎵 {genre}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6">
        {/* Description */}
        {description && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Description</h3>
            <p className="text-sm leading-relaxed text-gray-600">{description}</p>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{formatNumber(likes_count)}</div>
            <div className="text-xs text-pink-600">❤️ Likes</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatNumber(playback_count)}</div>
            <div className="text-xs text-blue-600">👁️ Plays</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatNumber(reposts_count)}</div>
            <div className="text-xs text-green-600">🔄 Reposts</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{formatNumber(comment_count)}</div>
            <div className="text-xs text-purple-600">💬 Comments</div>
          </div>
        </div>

        {/* Tags */}
        {tag_list && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tag_list.split(" ").map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed info grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
          {onDownload && (
            <button
              onClick={onDownload}
              disabled={isDownloading || !downloadable}
              className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-green-600 hover:to-emerald-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDownloading ? (
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
                  <span>⬇️</span>
                  <span>Download</span>
                </>
              )}
            </button>
          )}
          {permalink_url && (
            <a
              href={permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              <span>🔗</span>
              <span>View on SoundCloud</span>
            </a>
          )}
          {waveform_url && (
            <a
              href={waveform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <span>📊</span>
              <span>View Waveform</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
