"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import { CreditCard, FolderOpen, LogIn, LogOut } from "lucide-react"
import { Link } from "@/app/i18n/navigation"
import { trackClarityEvent } from "@/lib/analytics/clarity"

type AccountMenuVariant = "header" | "dock"

export default function AccountMenu({
  variant = "header",
  onNavigate,
}: {
  variant?: AccountMenuVariant
  onNavigate?: () => void
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const isDock = variant === "dock"

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const signInClassName = isDock
    ? "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-slate-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none"
    : "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"

  if (!isLoaded) {
    return <div className={isDock ? "h-11 w-16" : "h-11 w-20"} aria-hidden />
  }

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in/"
        data-auth-action="sign-in"
        className={signInClassName}
        onClick={() => {
          trackClarityEvent("auth_sign_in_clicked")
          onNavigate?.()
        }}
      >
        <LogIn className={isDock ? "h-5 w-5" : "mr-2 h-4 w-4"} aria-hidden />
        Sign in
      </Link>
    )
  }

  const menuItems = [
    { href: "/audio-toolkit/", label: "Audio Toolkit", icon: FolderOpen },
    { href: "/account/billing/", label: "Billing", icon: CreditCard },
  ]

  return (
    <div ref={rootRef} className={isDock ? "relative flex flex-1 justify-center" : "relative"} data-account-menu={variant}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={
          isDock
            ? "flex min-h-11 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            : "inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-slate-200 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
        }
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/30 text-xs font-bold text-white">
            {(user?.firstName?.[0] ?? user?.primaryEmailAddress?.emailAddress?.[0] ?? "A").toUpperCase()}
          </span>
        )}
        {isDock ? <span>Account</span> : <span className="hidden sm:inline">Account</span>}
      </button>
      {open ? (
        <div
          role="menu"
          className={`absolute z-80 w-52 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 py-1 shadow-xl ${
            isDock ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : "right-0 top-full mt-2"
          }`}
        >
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              className="flex min-h-11 items-center gap-2 px-4 text-sm font-medium text-slate-200 hover:bg-slate-800"
              onClick={() => {
                setOpen(false)
                onNavigate?.()
              }}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            className="flex min-h-11 w-full items-center gap-2 px-4 text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            onClick={() => {
              setOpen(false)
              trackClarityEvent("auth_sign_out_clicked")
              void signOut({ redirectUrl: "/" })
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}
