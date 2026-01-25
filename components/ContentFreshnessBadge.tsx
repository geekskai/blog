"use client"

import { formatDistanceToNow } from "date-fns"
import React from "react"
import { useTranslations } from "next-intl"

/**
 * ContentFreshnessBadge Component
 *
 * Unified component for displaying content freshness indicator across all tool pages.
 * Matches the style used in print-test-page for consistency.
 *
 * Displays content freshness indicator for AI SEO optimization.
 * Shows green badge if content updated within 90 days, orange if older.
 *
 * @param lastModified - The date when content was last modified
 * @param namespace - Translation namespace for i18n (e.g., "PrintTestPage", "SoundCloudToWAV")
 * @param className - Optional additional CSS classes
 *
 * Based on AI-SEO-Complete-Guide.md best practices:
 * - Content freshness is the strongest AI ranking signal
 * - 30-90 day update cycle performs best
 *
 * @example
 * ```tsx
 * import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
 *
 * <ContentFreshnessBadge
 *   lastModified={new Date("2026-01-24")}
 *   namespace="PrintTestPage"
 * />
 * ```
 */
export function ContentFreshnessBadge({
  lastModified,
  namespace,
  className = "",
}: {
  lastModified: Date
  namespace: string
  className?: string
}) {
  const t = useTranslations(namespace)
  const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24))
  const isFresh = daysSinceUpdate < 90

  return (
    <div
      className={`inline-flex w-full items-center justify-center gap-3 ${
        isFresh ? "text-emerald-300" : "text-orange-300"
      } ${className}`}
      role="status"
      aria-label={`Content ${isFresh ? "fresh" : "needs update"}`}
    >
      <span className="text-lg" aria-hidden="true">
        {isFresh ? "✓" : "⚠"}
      </span>
      <span className="text-sm font-semibold">
        {isFresh
          ? `${t("content_freshness_updated")} ${formatDistanceToNow(lastModified, { addSuffix: true })}`
          : `${t("content_freshness_last_updated")} ${formatDistanceToNow(lastModified, { addSuffix: true })}`}
      </span>
    </div>
  )
}

/**
 * Helper function to check if content needs update
 * @param lastModified - The date when content was last modified
 * @returns true if content is older than 90 days
 */
export function shouldUpdateContent(lastModified: Date): boolean {
  const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24))
  return daysSinceUpdate > 90
}

/**
 * Calculate next review date based on update frequency
 */
export function calculateNextReviewDate(
  lastModified: Date,
  frequency: "daily" | "weekly" | "monthly" | "quarterly"
): Date {
  const daysMap = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    quarterly: 90,
  }

  const days = daysMap[frequency]
  const nextDate = new Date(lastModified)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}
