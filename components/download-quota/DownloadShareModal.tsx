"use client"

import CopyAndTwitterShareButton from "@/components/CopyAndTwitterShareButton"
import { Share2, UserPlus, X } from "lucide-react"

type DownloadShareModalProps = {
  isOpen: boolean
  shareLink: string
  shareTitle?: string
  unlockAmount?: number
  canRegister?: boolean
  canShare?: boolean
  errorMessage?: string | null
  onClose: () => void
  onUnlock: () => void | Promise<void>
  onCreateAccount?: () => void
}

export default function DownloadShareModal({
  isOpen,
  shareLink,
  shareTitle,
  unlockAmount = 5,
  canRegister = true,
  canShare = true,
  errorMessage,
  onClose,
  onUnlock,
  onCreateAccount,
}: DownloadShareModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-slate-900 p-5 text-white shadow-2xl shadow-black/40 md:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Today's downloads are used up</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {canRegister
                ? "Create a free account to increase today's allowance from 3 to 10 downloads."
                : canShare
                  ? "Open a prepared X post to unlock five more downloads today."
                  : "You've used today's account and share allowance. Please come back tomorrow."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-white/20 hover:bg-white/10"
            aria-label="Close download allowance dialog"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {canRegister && onCreateAccount ? (
          <button
            type="button"
            onClick={onCreateAccount}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            Create free account — unlock 7 more today
          </button>
        ) : null}

        {canRegister && canShare ? (
          <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            or continue without an account
            <span className="h-px flex-1 bg-white/10" />
          </div>
        ) : null}

        {canShare ? (
          <CopyAndTwitterShareButton
            url={shareLink}
            title={shareTitle}
            onShareClick={() => void onUnlock()}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Share on X — unlock {unlockAmount}
          </CopyAndTwitterShareButton>
        ) : null}

        {errorMessage ? (
          <p role="alert" className="mt-3 text-center text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {canShare ? (
          <p className="mt-3 text-center text-xs leading-5 text-slate-400">
            The reward is granted when the X share composer opens, once per UTC day. Geekskai does
            not claim to verify publication.
          </p>
        ) : null}
      </div>
    </div>
  )
}
