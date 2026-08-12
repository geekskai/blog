"use client"

import { Show, UserButton } from "@clerk/nextjs"
import { FolderOpen, LogIn, UserPlus } from "lucide-react"
import { Link } from "@/app/i18n/navigation"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { authPrimaryCtaClassName, authPrimaryCtaStyle } from "./authStyles"

interface AuthControlsProps {
  mobile?: boolean
  onNavigate?: () => void
}

export default function AuthControls({ mobile = false, onNavigate }: AuthControlsProps) {
  const linkClassName = mobile
    ? "flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-300 transition-[color,background-color,transform] duration-200 hover:bg-slate-800/70 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transform-none motion-reduce:transition-none"
    : "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-3.5 text-[13px] font-semibold tracking-[0.01em] text-slate-300 transition-[color,background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-white/[0.06] hover:text-white active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"

  const handleNavigate = (eventName: string) => {
    trackClarityEvent(eventName)
    onNavigate?.()
  }

  return (
    <div
      data-auth-controls={mobile ? "mobile" : "desktop"}
      className={
        mobile
          ? "space-y-2"
          : "flex items-center gap-1 rounded-xl border border-white/[0.09] bg-slate-900/70 p-1 shadow-[0_12px_30px_-18px_rgba(236,72,153,0.7)] backdrop-blur-xl"
      }
    >
      <Show when="signed-out">
        <Link
          href="/sign-in/"
          data-auth-action="sign-in"
          className={`${linkClassName} group`}
          onClick={() => handleNavigate("auth_sign_in_clicked")}
        >
          <span
            className={
              mobile
                ? "contents"
                : "flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.05] text-slate-400 transition-colors group-hover:text-white"
            }
          >
            <LogIn className="h-4 w-4" />
          </span>
          <span>Sign in</span>
        </Link>
        <Link
          href="/sign-up/"
          aria-label="Create free account"
          data-auth-action="sign-up"
          className={`${linkClassName} ${authPrimaryCtaClassName} group ${mobile ? "justify-center" : "px-4"}`}
          style={authPrimaryCtaStyle}
          onClick={() => handleNavigate("auth_sign_up_clicked")}
        >
          <UserPlus className="relative h-4 w-4 transition-transform duration-200 group-hover:rotate-6" />
          <span className="relative">Create free account</span>
        </Link>
      </Show>

      <Show when="signed-in">
        <Link
          href="/audio-toolkit/"
          data-auth-action="workspace"
          className={linkClassName}
          onClick={() => handleNavigate("workspace_nav_clicked")}
        >
          <FolderOpen className="h-4 w-4" />
          Audio Toolkit
        </Link>
        <div className={mobile ? "px-4 py-2" : "flex items-center"}>
          <UserButton />
        </div>
      </Show>
    </div>
  )
}
