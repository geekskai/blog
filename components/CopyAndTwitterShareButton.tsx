"use client"

import { Copy } from "lucide-react"
import type { ReactNode } from "react"

export const DEFAULT_FISSION_SHARE_URL =
  "https://geekskai.com/tools/soundcloud-downloader/?ref=fission_share"

export const DEFAULT_FISSION_SHARE_TITLE =
  "🔥 Check out this awesome SoundCloud downloader! Saved my day. Try it here: "

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

export default function CopyAndTwitterShareButton({
  url = DEFAULT_FISSION_SHARE_URL,
  title = DEFAULT_FISSION_SHARE_TITLE,
  disabled = false,
  className,
  children,
  onCopied,
  onCopyFailed,
  onShareClick,
}: CopyAndTwitterShareButtonProps) {
  const handleClick = () => {
    void copyShareLink(url)
      .then(() => {
        onCopied?.()
        // toast("Link copied!")
      })
      .catch(() => {
        onCopyFailed?.()
      })

    const shareUrl = new URL("https://twitter.com/intent/tweet")
    shareUrl.searchParams.set("url", url)
    shareUrl.searchParams.set("text", title)
    const popup = window.open(shareUrl, "_blank", "width=720,height=640")
    if (popup) {
      popup.opener = null
      onShareClick?.()
    }
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
