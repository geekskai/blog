"use client"

import { Copy } from "lucide-react"
import type { ReactNode } from "react"
import { TwitterShareButton } from "react-share"

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
  /** Fires on the same user gesture as copy + X popup (e.g. start unlock verification). */
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
  const handleBeforeClick = () => {
    // Intentionally not async / not awaited: keep the X popup in the same user-gesture
    // stack so browsers do not treat it as script-triggered and block it.
    void copyShareLink(url)
      .then(() => {
        onCopied?.()
        // toast("Link copied!")
      })
      .catch(() => {
        onCopyFailed?.()
        // toast("Copy failed — you can still share from the X dialog.")
      })
  }

  return (
    <TwitterShareButton
      url={url}
      title={title}
      beforeOnClick={handleBeforeClick}
      onClick={() => onShareClick?.()}
      resetButtonStyle={false}
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
    </TwitterShareButton>
  )
}
