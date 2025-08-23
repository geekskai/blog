"use client"

import { Dialog, Transition } from "@headlessui/react"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"
import { Fragment, useState, useEffect, useRef } from "react"
import Link from "./Link"
import headerNavLinks from "@/data/headerNavLinks"
import { ChevronDown, Zap, Menu, X } from "lucide-react"
import { toolsData } from "@/data/toolsData"

// Use imported tools data for mobile dropdown

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const navRef = useRef(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
        setToolsExpanded(false) // Reset tools expansion when closing
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  const onToolsToggle = () => {
    setToolsExpanded(!toolsExpanded)
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="rounded-lg p-2 transition-colors duration-300 hover:bg-slate-800/50 lg:hidden"
      >
        <Menu className="h-6 w-6 text-slate-300 hover:text-white" />
      </button>

      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
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
            unmount={false}
          >
            <Dialog.Panel className="fixed right-0 top-0 z-50 h-full w-80 border-l border-slate-800/50 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
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
              <nav ref={navRef} className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {headerNavLinks
                    .filter((link) => link.href !== "/" && link.title !== "Tools")
                    .map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        onClick={onToggleNav}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white"
                      >
                        {link.title}
                      </Link>
                    ))}

                  {/* Tools Section */}
                  <div className="mt-2">
                    <button
                      onClick={onToolsToggle}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white"
                    >
                      <span>Tools</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          toolsExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Tools Dropdown */}
                    <Transition
                      show={toolsExpanded}
                      enter="transition-all duration-300 ease-out"
                      enterFrom="opacity-0 max-h-0"
                      enterTo="opacity-100 max-h-96"
                      leave="transition-all duration-200 ease-in"
                      leaveFrom="opacity-100 max-h-96"
                      leaveTo="opacity-0 max-h-0"
                    >
                      <div className="ml-4 mt-2 space-y-2 overflow-hidden border-l-2 border-slate-800/50 pl-4">
                        {toolsData.map((tool) => {
                          const IconComponent = tool.icon
                          return (
                            <Link
                              key={tool.id}
                              href={tool.href}
                              onClick={onToggleNav}
                              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-all duration-300 hover:bg-slate-800/30 hover:text-white"
                            >
                              <div className="flex-shrink-0 rounded-md bg-slate-800/50 p-1.5 transition-transform duration-300 group-hover:scale-110">
                                <IconComponent className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="truncate font-medium group-hover:text-blue-300">
                                    {tool.title}
                                  </span>
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-xs font-medium text-white ${tool.badgeColor} ml-2 flex-shrink-0`}
                                  >
                                    {tool.badge}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          )
                        })}

                        {/* View All Tools */}
                        <Link
                          href="/tools"
                          onClick={onToggleNav}
                          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-400 transition-all duration-300 hover:bg-blue-500/20 hover:text-white"
                        >
                          <Zap className="h-4 w-4" />
                          View All Tools
                        </Link>
                      </div>
                    </Transition>
                  </div>
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
