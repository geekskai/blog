"use client"

import React from "react"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { Check, Copy, Loader2, X } from "lucide-react"
import type { QuotaToolId } from "@/lib/download-quota/config"
import {
  SHARE_CHANNELS,
  buildShareIntentUrl,
  cleanGrowthShareUrl,
  getTemplateShareCopy,
  type ShareChannel,
} from "@/lib/growth/sharing"

type PostDownloadShareCardProps = {
  isOpen: boolean
  toolId: QuotaToolId
  onClose: () => void
}

const channelLabels: Record<ShareChannel, string> = {
  x: "X",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  reddit: "Reddit",
  copy: "Copy link",
}

async function postGrowth(body: Record<string, unknown>) {
  const response = await fetch("/api/download-quota", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = (await response.json().catch(() => ({}))) as { shareId?: string }
  if (!response.ok) throw new Error("Growth request failed")
  return data
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value)
  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "true")
  textarea.style.position = "fixed"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

function ChannelGlyph({ channel }: { channel: ShareChannel }) {
  const className = "h-4 w-4"

  if (channel === "copy") {
    return <Copy className={className} aria-hidden />
  }

  if (channel === "x") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.833L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    )
  }

  if (channel === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2m5.76 13.99c-.24.67-1.18 1.22-1.93 1.38-.52.11-1.2.2-3.49-.75-2.93-1.21-4.82-4.17-4.97-4.36-.14-.2-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.24-.26.64-.38 1.02-.38.12 0 .23 0 .33.01.29.01.43.03.62.48.24.55.82 2 .89 2.15.07.14.12.31.02.5-.09.2-.14.31-.28.48l-.42.5c-.14.16-.29.33-.12.64.16.31.72 1.18 1.54 1.91 1.06.95 1.95 1.24 2.26 1.38.3.14.48.12.66-.07.18-.2.77-.9.98-1.21.2-.31.41-.26.69-.16.29.1 1.82.86 2.13 1.01.31.16.52.23.59.36.08.13.08.76-.16 1.43"
        />
      </svg>
    )
  }

  if (channel === "telegram") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M21.95 3.56a1.1 1.1 0 0 0-1.13-.16L2.7 10.62c-.86.34-.85 1.56.02 1.86l4.53 1.57 1.73 5.5c.24.76 1.21 1.04 1.84.53l2.5-2.03 4.3 3.14c.7.51 1.7.12 1.88-.73l3.38-15.5a1.1 1.1 0 0 0-.43-1.4M9.2 13.74l8.16-5.13-6.43 6.86-.22 2.48z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M14.24 15.5c-.13 0-.26-.02-.38-.05a3.3 3.3 0 0 1-1.86-1.3 3.3 3.3 0 0 1-1.86 1.3c-.12.03-.25.05-.38.05-.7 0-1.27-.5-1.27-1.12 0-.5.32-.93.79-1.08-.05-.2-.08-.4-.08-.61 0-1.72 2.06-3.12 4.6-3.12s4.6 1.4 4.6 3.12c0 .21-.03.41-.08.61.47.15.79.58.79 1.08 0 .62-.57 1.12-1.27 1.12m-4.6-1.74c.3 0 .54.24.54.54s-.24.54-.54.54-.54-.24-.54-.54.24-.54.54-.54m5.12 0c.3 0 .54.24.54.54s-.24.54-.54.54-.54-.24-.54-.54.24-.54.54-.54M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6.5 9.16c.55.27.92.83.92 1.47 0 .5-.22.96-.58 1.28.07.28.1.57.1.87 0 2.43-2.8 4.4-6.25 4.4H11.3c-3.45 0-6.25-1.97-6.25-4.4 0-.3.03-.59.1-.87A1.66 1.66 0 0 1 4.57 12.6c0-.64.37-1.2.92-1.47C5.7 8.7 8.6 7.1 12 7.1s6.3 1.6 6.5 4.06"
      />
    </svg>
  )
}

export default function PostDownloadShareCard({
  isOpen,
  toolId,
  onClose,
}: PostDownloadShareCardProps) {
  const viewedRef = useRef(false)
  const pendingRef = useRef(false)
  const headingId = useId()
  const [copied, setCopied] = useState(false)
  const [pendingChannel, setPendingChannel] = useState<ShareChannel | null>(null)
  const copiedTimerRef = useRef<number>(0)

  useEffect(() => {
    if (!isOpen) {
      viewedRef.current = false
      pendingRef.current = false
      window.clearTimeout(copiedTimerRef.current)
      setCopied(false)
      setPendingChannel(null)
      return
    }
    if (!viewedRef.current) {
      viewedRef.current = true
      void postGrowth({
        action: "event",
        eventName: "share_card_viewed",
        toolId,
        surface: "post_download",
        copyMode: "template",
        copyVariant: "baseline",
      }).catch(() => undefined)
    }
    return () => window.clearTimeout(copiedTimerRef.current)
  }, [isOpen, toolId])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  const openChannel = useCallback(
    async (channel: ShareChannel) => {
      if (pendingRef.current) return
      const popup = channel === "copy" ? null : window.open("about:blank", "_blank")
      if (channel !== "copy" && !popup) return
      if (popup) popup.opener = null
      pendingRef.current = true
      setPendingChannel(channel)

      const selectedCopy = getTemplateShareCopy(toolId, channel, "post_download")
      let shareUrl = cleanGrowthShareUrl(window.location.href)
      let hasAttribution = false

      try {
        const data = await postGrowth({
          action: "create_share",
          toolId,
          channel,
          surface: "post_download",
          copyMode: "template",
          copyVariant: "baseline",
        })
        shareUrl = cleanGrowthShareUrl(window.location.href, data.shareId)
        hasAttribution = true
      } catch {
        // Sharing remains available, but unattributed actions stay out of growth metrics.
      }

      try {
        if (channel === "copy") {
          await copyText(shareUrl)
          setCopied(true)
          window.clearTimeout(copiedTimerRef.current)
          copiedTimerRef.current = window.setTimeout(() => setCopied(false), 2_000)
        } else if (popup) {
          popup.location.href = buildShareIntentUrl(channel, shareUrl, selectedCopy)
        }
        if (hasAttribution) {
          void postGrowth({
            action: "event",
            eventName: "share_channel_opened",
            toolId,
            channel,
            surface: "post_download",
            copyMode: "template",
            copyVariant: "baseline",
          }).catch(() => undefined)
        }
      } catch {
        popup?.close()
      } finally {
        pendingRef.current = false
        setPendingChannel(null)
      }
    },
    [toolId]
  )

  if (!isOpen) return null

  const busy = pendingChannel !== null

  return (
    <aside
      role="region"
      aria-labelledby={headingId}
      className="fixed inset-x-4 bottom-[calc(4.25rem+0.75rem+env(safe-area-inset-bottom))] z-[110] mx-auto w-auto max-w-sm rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-[0_25px_50px_-12px_rgb(0_0_0_/_0.25)] motion-safe:[animation:fadeIn_200ms_ease-out] lg:inset-x-auto lg:bottom-6 lg:right-6 lg:mx-0"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/45 to-transparent"
        aria-hidden
      />

      <div className="flex items-start gap-3 p-4 pb-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={headingId} className="text-sm font-semibold tracking-tight text-white">
            Download complete
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-400">
            Sharing is optional and does not change your allowance.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
          aria-label="Dismiss share options"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 px-4 pb-4 sm:grid-cols-5">
        {SHARE_CHANNELS.map((channel) => {
          const isCopy = channel === "copy"
          const label = isCopy && copied ? "Copied" : channelLabels[channel]
          const isPending = pendingChannel === channel

          return (
            <button
              key={channel}
              type="button"
              disabled={busy}
              onClick={() => void openChannel(channel)}
              title={label}
              aria-label={
                isCopy
                  ? copied
                    ? "Link copied"
                    : "Copy link"
                  : `Share via ${channelLabels[channel]}`
              }
              className="inline-flex min-h-11 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-0.5 py-1.5 text-slate-300 transition-colors duration-200 hover:border-sky-500/35 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
              ) : isCopy && copied ? (
                <Check className="h-4 w-4 text-emerald-300" aria-hidden />
              ) : (
                <ChannelGlyph channel={channel} />
              )}
              <span className="max-w-full truncate text-[11px] font-medium leading-none">
                {isCopy ? (copied ? "Copied" : "Copy") : channelLabels[channel]}
              </span>
            </button>
          )
        })}
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </aside>
  )
}
