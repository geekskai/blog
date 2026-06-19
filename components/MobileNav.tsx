"use client"

import { Dialog, Transition } from "@headlessui/react"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"
import { Fragment, useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import headerNavLinks from "@/data/headerNavLinks"
import { ChevronDown, Zap, Menu, X } from "lucide-react"
import LanguageSelect from "./LanguageSelect"
import LinkNext from "next/link"
import { useTranslations } from "next-intl"

const MobileToolsList = dynamic(() => import("./MobileToolsList"), {
  ssr: false,
  loading: () => <div className="h-48 rounded-xl bg-slate-800/40" aria-hidden="true" />,
})

const MobileNav = () => {
  const t = useTranslations("HomePage")
  const [navShow, setNavShow] = useState(false)
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

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
    if (!navShow) return

    const scrollTarget = navRef.current || document.body
    disableBodyScroll(scrollTarget)

    return () => {
      enableBodyScroll(scrollTarget)
    }
  }, [navShow])

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [])

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="rounded-lg p-2 transition-colors duration-300 hover:bg-slate-800/50 lg:hidden"
      >
        <Menu className="h-6 w-6 text-slate-300 hover:text-white" />
      </button>

      <Transition appear show={navShow} as={Fragment}>
        <Dialog as="div" onClose={closeNav}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
          >
            <Dialog.Panel
              ref={navRef}
              className="fixed right-0 top-0 z-50 h-full w-80 border-l border-slate-800/50 bg-slate-950/95 shadow-2xl backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800/50 p-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-lg font-bold text-white">Navigation</span>
                </div>
                <button
                  onClick={onToggleNav}
                  className="rounded-lg p-2 transition-colors duration-300 hover:bg-slate-800/50"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5 text-slate-300 hover:text-white" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6">
                <div className="space-y-2">
                  {headerNavLinks.map((link) => (
                    <LinkNext
                      key={link.title}
                      href={link.href}
                      onClick={closeNav}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white"
                    >
                      {t(link.title)}
                    </LinkNext>
                  ))}

                  {/* Tools Section */}
                  <div className="my-2">
                    <button
                      onClick={onToolsToggle}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white"
                    >
                      <span>{t("header_nav_tools")}</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          toolsExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Tools Categorized for Mobile */}
                    <Transition
                      show={toolsExpanded}
                      enter="transition-all duration-300 ease-out"
                      enterFrom="opacity-0 max-h-0"
                      enterTo="opacity-100 max-h-[80vh]"
                      leave="transition-all duration-200 ease-in"
                      leaveFrom="opacity-100 max-h-[80vh]"
                      leaveTo="opacity-0 max-h-0"
                    >
                      <div className="custom-scrollbar ml-4 mt-2 space-y-4 overflow-hidden overflow-y-auto border-l-2 border-slate-800/50 pl-4">
                        <MobileToolsList
                          onNavigate={closeNav}
                          viewAllLabel={t("footer_view_all_tools")}
                        />
                      </div>
                    </Transition>
                  </div>

                  {/* Language Select */}
                  <LanguageSelect />
                </div>
              </nav>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
