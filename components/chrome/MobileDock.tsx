"use client"

import { useState } from "react"
import { BookOpen, FolderOpen, MoreHorizontal, Wrench } from "lucide-react"
import { Link, usePathname } from "@/app/i18n/navigation"
import type { ChromeSurface } from "@/lib/chrome/surface"
import { normalizeChromePath } from "@/lib/chrome/surface"
import AccountMenu from "./AccountMenu"

const dockItemClass =
  "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none"

function isActive(pathname: string, href: string) {
  const path = normalizeChromePath(pathname)
  const target = normalizeChromePath(href)
  if (target === "/") return path === "/"
  return path === target || path.startsWith(target)
}

function WorkspaceMore() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex flex-1 justify-center">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={`${dockItemClass} w-full text-slate-300 hover:text-white`}
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden />
        More
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute bottom-full mb-2 w-44 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 py-1 shadow-xl"
        >
          <Link
            href="/tools/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center px-4 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            All tools
          </Link>
          <Link
            href="/terms/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center px-4 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Terms
          </Link>
          <Link
            href="/privacy/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center px-4 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Privacy
          </Link>
        </div>
      ) : null}
    </div>
  )
}

export default function MobileDock({ surface }: { surface: Exclude<ChromeSurface, "auth"> }) {
  const pathname = usePathname()

  return (
    <>
      <div className="h-16 lg:hidden" aria-hidden />
      <nav
        data-mobile-dock={surface}
        aria-label="Mobile site navigation"
        className="fixed inset-x-0 bottom-0 z-80 border-t border-slate-800/80 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-stretch px-2">
          {surface === "workspace" ? (
            <>
              <Link
                href="/audio-toolkit/"
                aria-current={isActive(pathname, "/audio-toolkit/") ? "page" : undefined}
                className={`${dockItemClass} ${
                  isActive(pathname, "/audio-toolkit/") ? "text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                <FolderOpen className="h-5 w-5" aria-hidden />
                Toolkit
              </Link>
              <AccountMenu variant="dock" />
              <WorkspaceMore />
            </>
          ) : (
            <>
              <Link
                href="/tools/"
                aria-current={isActive(pathname, "/tools/") ? "page" : undefined}
                className={`${dockItemClass} ${
                  isActive(pathname, "/tools/") ? "text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                <Wrench className="h-5 w-5" aria-hidden />
                Tools
              </Link>
              <Link
                href="/blog/"
                aria-current={isActive(pathname, "/blog/") ? "page" : undefined}
                className={`${dockItemClass} ${
                  isActive(pathname, "/blog/") ? "text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                <BookOpen className="h-5 w-5" aria-hidden />
                Blog
              </Link>
              <AccountMenu variant="dock" />
            </>
          )}
        </div>
      </nav>
    </>
  )
}
