"use client"

import { Copy } from "lucide-react"
import type { ReactNode } from "react"

export const DEFAULT_FISSION_SHARE_URL = "https://geekskai.com/tools/?ref=fission_share"

export const DEFAULT_FISSION_SHARE_TITLE =
  "Geekskai offers practical browser-based tools. Review the source and usage rights before downloading."

type CopyAndTwitterShareButtonProps = {
  url?: string
  title?: string
  disabled?: boolean
  className?: string
  children?: ReactNode
  /** Fires after the link is copied successfully — plug in toast here. */
  onCopied?: () => void
  /** Fires when clipboard copy fails — user can still share via the X dialog. */
  onCopyFailed?: () => void
  /** Creates the final attributed URL after the user selects X. */
  onPrepareUrl?: () => Promise<string>
  /** Fires on the same user gesture as copy + X popup (e.g. grant a share-intent reward). */
  onShareClick?: () => void
}

async function copyShareLink(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "true")
  textarea.style.position = "fixed"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

export function openTwitterComposer(
  url: string,
  title: string,
  openWindow: typeof window.open = window.open.bind(window)
) {
  const shareUrl = new URL("https://twitter.com/intent/tweet")
  shareUrl.searchParams.set("url", url)
  shareUrl.searchParams.set("text", title)
  const popup = openWindow(shareUrl, "_blank", "width=720,height=640")
  if (!popup) return false
  popup.opener = null
  return true
}

export default function CopyAndTwitterShareButton({
  url = DEFAULT_FISSION_SHARE_URL,
  title = DEFAULT_FISSION_SHARE_TITLE,
  disabled = false,
  className,
  children,
  onCopied,
  onCopyFailed,
  onPrepareUrl,
  onShareClick,
}: CopyAndTwitterShareButtonProps) {
  const handleClick = () => {
    if (!onPrepareUrl) {
      void copyShareLink(url).then(onCopied).catch(onCopyFailed)
      if (openTwitterComposer(url, title)) onShareClick?.()
      return
    }

    const popup = window.open("about:blank", "_blank", "width=720,height=640")
    if (!popup) return
    popup.opener = null
    void onPrepareUrl()
      .then((preparedUrl) => {
        void copyShareLink(preparedUrl).then(onCopied).catch(onCopyFailed)
        const shareUrl = new URL("https://twitter.com/intent/tweet")
        shareUrl.searchParams.set("url", preparedUrl)
        shareUrl.searchParams.set("text", title)
        popup.location.href = shareUrl.toString()
        onShareClick?.()
      })
      .catch(() => popup.close())
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={
        className ??
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      }
      aria-label="Copy link and share on X"
    >
      {children ?? (
        <>
          <Copy className="h-4 w-4" aria-hidden />
          Copy link & share on X
        </>
      )}
    </button>
  )
}
