"use client"

import CopyAndTwitterShareButton from "@/components/CopyAndTwitterShareButton"
import ShareButtons from "@/components/ShareButtons"
import { CheckCircle2, Share2, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

type DownloadShareModalProps = {
  isOpen: boolean
  shareLink: string
  shareTitle?: string
  unlockAmount?: number
  onClose: () => void
  onUnlock: () => void
}

export default function DownloadShareModal({
  isOpen,
  shareLink,
  shareTitle,
  unlockAmount = 3,
  onClose,
  onUnlock,
}: DownloadShareModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const unlockedRef = useRef(false)

  const startVerification = useCallback(() => {
    if (countdown != null) {
      return
    }

    unlockedRef.current = false
    setCountdown(5)
  }, [countdown])

  useEffect(() => {
    if (!isOpen) {
      setCountdown(null)
      setCopyError(null)
      setCopied(false)
      unlockedRef.current = false
      return
    }

    if (countdown == null) {
      return
    }

    if (countdown <= 0) {
      if (!unlockedRef.current) {
        unlockedRef.current = true
        onUnlock()
      }
      setCountdown(null)
      return
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => (current == null ? null : current - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [countdown, isOpen, onUnlock])

  if (!isOpen) {
    return null
  }

  const verifying = countdown != null

  const handleCopied = () => {
    setCopyError(null)
    setCopied(true)
  }

  const handleCopyFailed = () => {
    setCopyError("Copy failed, but verification will continue. You can copy the link manually.")
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-900 p-5 text-white shadow-2xl shadow-black/40 md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">
              🎉 Today's free downloads are used up!
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Share this useful tool with friends and instantly get{" "}
              <strong className="text-emerald-300">{unlockAmount} extra premium downloads</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={verifying}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close share unlock modal"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Share link
        </label>
        <input
          type="text"
          value={shareLink}
          readOnly
          className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-200 outline-none"
        />

        {copyError ? <p className="mt-2 text-xs text-orange-300">{copyError}</p> : null}
        {copied ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Link copied.
          </p>
        ) : null}

        <CopyAndTwitterShareButton
          url={shareLink}
          title={shareTitle}
          disabled={verifying}
          onCopied={handleCopied}
          onCopyFailed={handleCopyFailed}
          onShareClick={startVerification}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying
            ? `Verifying share status...${countdown ?? 0}s`
            : "Copy link & share on X to unlock"}
        </CopyAndTwitterShareButton>

        <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/35 p-3">
          <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Share2 className="h-3.5 w-3.5" aria-hidden />
            Social share
          </div>
          <div onClickCapture={startVerification}>
            <ShareButtons url={shareLink} title="GeeksKai free online downloader tools" />
          </div>
          {verifying ? (
            <p className="text-center text-xs text-slate-400">
              Verifying share status...{countdown ?? 0}s
            </p>
          ) : null}
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Verification takes 5 seconds. After it finishes, {unlockAmount} downloads will be added to
          today's quota.
        </p>
      </div>
    </div>
  )
}
