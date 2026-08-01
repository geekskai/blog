"use client"

import { Show } from "@clerk/nextjs"
import { ArrowRight, FolderHeart } from "lucide-react"
import { Link } from "@/app/i18n/navigation"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { authPrimaryCtaClassName, authPrimaryCtaStyle } from "./authStyles"

export default function FreeWorkspacePrompt() {
  return (
    <Show when="signed-out">
      <aside className="mx-auto max-w-7xl rounded-2xl border border-blue-400/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-5 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <FolderHeart className="mt-0.5 h-6 w-6 shrink-0 text-blue-300" />
            <div>
              <h2 className="font-semibold text-white">Preparing tracks for a DJ set?</h2>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Save project metadata and reusable format presets in a free workspace. Downloads
                stay free and never require an account.
              </p>
            </div>
          </div>
          <Link
            href="/sign-up/?redirect_url=/workspace/"
            onClick={() => trackClarityEvent("workspace_prompt_clicked")}
            className={`${authPrimaryCtaClassName} group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold`}
            style={authPrimaryCtaStyle}
          >
            <span className="relative">Create free workspace</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </aside>
    </Show>
  )
}
