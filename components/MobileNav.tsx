"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import dynamic from "next/dynamic"
import headerNavLinks from "@/data/headerNavLinks"
import { ChevronDown, Zap, Menu, X } from "lucide-react"
import LanguageSelect from "./LanguageSelect"
import LinkNext from "next/link"
import { useTranslations } from "next-intl"
import AuthControls from "./auth/AuthControls"
import { usePathname } from "@/app/i18n/navigation"

interface MobileNavProps {
  authEnabled?: boolean
}

const MobileToolsList = dynamic(() => import("./MobileToolsList"), {
  ssr: false,
  loading: () => <div className="h-48 rounded-xl bg-slate-800/40" aria-hidden="true" />,
})

const MobileNav = ({ authEnabled = false }: MobileNavProps) => {
  const t = useTranslations("HomePage")
  const [navShow, setNavShow] = useState(false)
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)
  const pathname = usePathname()

  const onToggleNav = () => {
    if (navShow) {
      setNavShow(false)
      setToolsExpanded(false)
      return
    }

    setNavShow(true)
  }

  const closeNav = () => {
    setNavShow(false)
    setToolsExpanded(false)
  }

  const onToolsToggle = () => {
    setToolsExpanded((isExpanded) => !isExpanded)
  }

  useEffect(() => {
    if (!navShow) {
      if (wasOpenRef.current) menuButtonRef.current?.focus()
      wasOpenRef.current = false
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    wasOpenRef.current = true
    window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNav()
        return
      }

      if (event.key === "Tab" && navRef.current) {
        const focusable = Array.from(
          navRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleEscape)
    }
  }, [navShow])

  return (
    <>
      <button
        ref={menuButtonRef}
        type="button"
        aria-label="Toggle Menu"
        aria-expanded={navShow}
        aria-controls="mobile-navigation-panel"
        onClick={onToggleNav}
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none lg:hidden"
      >
        <Menu className="h-6 w-6 text-slate-300 hover:text-white" />
      </button>

      {navShow &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close Menu"
              tabIndex={-1}
              onClick={closeNav}
              className="absolute inset-0 bg-black/50"
            />

            <div
              id="mobile-navigation-panel"
              ref={navRef}
              className="absolute right-0 top-0 z-10 flex h-full w-80 flex-col border-l border-slate-800/50 bg-slate-950/95 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800/50 p-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-lg font-bold text-white">Navigation</span>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onToggleNav}
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5 text-slate-300 hover:text-white" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {headerNavLinks.map((link) => (
                    <LinkNext
                      key={link.title}
                      href={link.href}
                      onClick={closeNav}
                      aria-current={
                        pathname.replace(/\/+$/, "") === link.href.replace(/\/+$/, "")
                          ? "page"
                          : undefined
                      }
                      className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-[color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none ${
                        pathname.replace(/\/+$/, "") === link.href.replace(/\/+$/, "")
                          ? "bg-pink-500/10 text-white"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      }`}
                    >
                      {t(link.title)}
                    </LinkNext>
                  ))}

                  {/* Tools Section */}
                  <div className="my-2">
                    <button
                      type="button"
                      onClick={onToolsToggle}
                      className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-lg font-medium text-slate-300 transition-[color,background-color] duration-200 hover:bg-slate-800/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none"
                      aria-expanded={toolsExpanded}
                    >
                      <span>{t("header_nav_tools")}</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          toolsExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Tools Categorized for Mobile */}
                    {toolsExpanded && (
                      <div className="custom-scrollbar ml-4 mt-2 max-h-[80vh] space-y-4 overflow-y-auto border-l-2 border-slate-800/50 pl-4">
                        <MobileToolsList
                          onNavigate={closeNav}
                          viewAllLabel={t("footer_view_all_tools")}
                        />
                      </div>
                    )}
                  </div>

                  {/* Language Select */}
                  <LanguageSelect />

                  {authEnabled && (
                    <div className="mt-4 border-t border-slate-800/70 pt-4">
                      <AuthControls mobile onNavigate={closeNav} />
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default MobileNav
