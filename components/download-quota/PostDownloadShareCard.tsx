"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Copy, MessageCircle, Send, Share2, X } from "lucide-react"
import type { QuotaToolId } from "@/lib/download-quota/config"
import {
  buildShareIntentUrl,
  cleanGrowthShareUrl,
  getTemplateShareCopy,
  isEnglishPathname,
  type ShareChannel,
  type ShareCopy,
  type ShareCopyMode,
} from "@/lib/growth/sharing"

type PostDownloadShareCardProps = {
  isOpen: boolean
  toolId: QuotaToolId
  onClose: () => void
}

type AiCopyResponse = {
  copy?: string
  mode?: ShareCopyMode
  variant?: string
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

export default function PostDownloadShareCard({
  isOpen,
  toolId,
  onClose,
}: PostDownloadShareCardProps) {
  const viewedRef = useRef(false)
  const [aiCopy, setAiCopy] = useState<ShareCopy | null>(null)
  const [copyMode, setCopyMode] = useState<ShareCopyMode>("template")
  const [copyVariant, setCopyVariant] = useState("baseline")
  const [copied, setCopied] = useState(false)
  const templateCopy = useMemo(() => getTemplateShareCopy(toolId, "x", "post_download"), [toolId])

  useEffect(() => {
    if (!isOpen) {
      viewedRef.current = false
      setAiCopy(null)
      setCopyMode("template")
      setCopyVariant("baseline")
      return
    }
    if (viewedRef.current) return
    viewedRef.current = true
    void postGrowth({
      action: "event",
      eventName: "share_card_viewed",
      toolId,
      surface: "post_download",
      copyMode: "template",
      copyVariant: "baseline",
    }).catch(() => undefined)
  }, [isOpen, toolId])

  useEffect(() => {
    if (!isOpen || !isEnglishPathname(window.location.pathname)) return
    const controller = new AbortController()
    void fetch("/api/growth/share-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId, locale: "en", channel: "x" }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return null
        return (await response.json()) as AiCopyResponse
      })
      .then((data) => {
        if (!data?.mode || !data.variant) return
        void postGrowth({
          action: "event",
          eventName: "share_card_viewed",
          toolId,
          channel: "x",
          surface: "post_download",
          copyMode: data.mode,
          copyVariant: data.variant,
        }).catch(() => undefined)
        if (!data.copy || data.mode !== "ai") return
        setAiCopy({ text: data.copy })
        setCopyMode("ai")
        setCopyVariant(data.variant)
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [isOpen, toolId])

  const openChannel = useCallback(
    async (channel: ShareChannel) => {
      const popup = channel === "copy" ? null : window.open("about:blank", "_blank")
      if (channel !== "copy" && !popup) return
      if (popup) popup.opener = null

      const channelTemplate = getTemplateShareCopy(toolId, channel, "post_download")
      const selectedCopy = channel === "x" && aiCopy ? aiCopy : channelTemplate
      const selectedMode = channel === "x" ? copyMode : "template"
      const selectedVariant = channel === "x" ? copyVariant : "baseline"
      let shareUrl = cleanGrowthShareUrl(window.location.href)

      try {
        const data = await postGrowth({
          action: "create_share",
          toolId,
          channel,
          surface: "post_download",
          copyMode: selectedMode,
          copyVariant: selectedVariant,
        })
        shareUrl = cleanGrowthShareUrl(window.location.href, data.shareId)
      } catch {
        // Sharing remains available without attribution when server growth mode is unavailable.
      }

      try {
        if (channel === "copy") {
          await copyText(shareUrl)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2_000)
        } else if (popup) {
          popup.location.href = buildShareIntentUrl(channel, shareUrl, selectedCopy)
        }
        void postGrowth({
          action: "event",
          eventName: "share_channel_opened",
          toolId,
          channel,
          surface: "post_download",
          copyMode: selectedMode,
          copyVariant: selectedVariant,
        }).catch(() => undefined)
      } catch {
        popup?.close()
      }
    },
    [aiCopy, copyMode, copyVariant, toolId]
  )

  if (!isOpen) return null

  const displayedCopy = aiCopy ?? templateCopy

  return (
    <aside className="fixed bottom-4 right-4 z-[110] w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/15 bg-slate-900/95 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur md:bottom-6 md:right-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Share this tool</h2>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Your download is complete. Sharing is optional and does not change your allowance.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss share options"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <p className="mt-3 rounded-lg bg-white/[0.05] px-3 py-2 text-xs leading-5 text-slate-300">
        {displayedCopy.text}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(["x", "whatsapp", "telegram", "reddit", "copy"] as const).map((channel) => (
          <button
            key={channel}
            type="button"
            onClick={() => void openChannel(channel)}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2 text-xs font-medium text-slate-100 transition hover:border-sky-400/40 hover:bg-sky-500/10"
            aria-label={`Share via ${channelLabels[channel]}`}
          >
            {channel === "copy" ? (
              <Copy className="h-3.5 w-3.5" aria-hidden />
            ) : channel === "telegram" ? (
              <Send className="h-3.5 w-3.5" aria-hidden />
            ) : channel === "whatsapp" ? (
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Share2 className="h-3.5 w-3.5" aria-hidden />
            )}
            <span>{channel === "copy" && copied ? "Copied" : channelLabels[channel]}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
