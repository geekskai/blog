"use client"

import { Show } from "@clerk/nextjs"
import React, { useEffect } from "react"
import { ArrowRight, FolderHeart } from "lucide-react"
import { Link } from "@/app/i18n/navigation"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { authUrlWithRedirect } from "@/lib/auth/redirect"
import { SOUNDCLOUD_SET_PREP_PATH } from "@/lib/workspace/set-prep"
import { authPrimaryCtaClassName, authPrimaryCtaStyle } from "./authStyles"

export default function FreeWorkspacePrompt() {
  useEffect(() => {
    trackClarityEvent("dj_set_prep_offer_seen")
  }, [])

  return (
    <aside className="mx-auto max-w-7xl rounded-2xl border border-sky-400/25 bg-slate-950/80 p-5 shadow-[0_16px_32px_rgba(2,6,23,0.3)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
            <FolderHeart className="h-5 w-5" aria-hidden />
          </span>
          <div className="max-w-2xl">
            <h2 className="font-semibold text-white">Prepare files you own for a DJ set</h2>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Add local files you own or are authorized to use. Processing stays in your browser and
              does not grant rights to obtain or export third-party content.
            </p>
          </div>
        </div>
        <Show when="signed-in">
          <Link
            href={SOUNDCLOUD_SET_PREP_PATH}
            className={`${authPrimaryCtaClassName} group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold`}
            style={authPrimaryCtaStyle}
          >
            <span className="relative">Open Set Prep</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Show>
        <Show when="signed-out">
          <Link
            href={authUrlWithRedirect("/sign-up/", SOUNDCLOUD_SET_PREP_PATH)}
            className={`${authPrimaryCtaClassName} group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold`}
            style={authPrimaryCtaStyle}
          >
            <span className="relative">Open Set Prep</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Show>
      </div>
    </aside>
  )
}
