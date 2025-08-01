"use client"

import { useState, useRef, useEffect } from "react"
import siteMetadata from "@/data/siteMetadata"
import headerNavLinks from "@/data/headerNavLinks"
import Logo from "@/data/logo.png"
import Link from "./Link"
import MobileNav from "./MobileNav"
import SearchButton from "./SearchButton"
import Image from "next/image"
import {
  ChevronDown,
  Calculator,
  FileText,
  DollarSign,
  Palette,
  Monitor,
  Sparkles,
  Star,
  Zap,
} from "lucide-react"

// Tools data for dropdown menu
const toolsData = [
  {
    id: "job-worth-calculator",
    title: "Job Worth Calculator",
    description: "Calculate your job's true value with comprehensive analysis",
    icon: Calculator,
    href: "/tools/job-worth-calculator",
    badge: "Popular",
    badgeColor: "bg-blue-500",
    category: "Productivity",
  },
  {
    id: "pdf-to-markdown",
    title: "PDF to Markdown Converter",
    description: "Convert PDF documents to clean Markdown files",
    icon: FileText,
    href: "/tools/pdf-to-markdown",
    badge: "Professional",
    badgeColor: "bg-emerald-500",
    category: "Development",
  },
  {
    id: "tip-screen-generator",
    title: "Tip Screen Generator",
    description: "Educational tip screen psychology and generator",
    icon: DollarSign,
    href: "/tools/tip-screen-generator",
    badge: "Educational",
    badgeColor: "bg-orange-500",
    category: "Design",
  },
  {
    id: "chromakopia-name-generator",
    title: "Chromakopia Name Generator",
    description: "Create colorful personas inspired by creativity",
    icon: Palette,
    href: "/tools/chromakopia-name-generator",
    badge: "Creative",
    badgeColor: "bg-purple-500",
    category: "Entertainment",
  },
  {
    id: "invincible-title-card-generator",
    title: "Invincible Title Card Generator",
    description: "Professional title cards with authentic styling",
    icon: Monitor,
    href: "/tools/invincible-title-card-generator",
    badge: "Professional",
    badgeColor: "bg-pink-500",
    category: "Creative",
  },
]

const Header = () => {
  const [toolsOpen, setToolsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setToolsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 shadow-xl backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 xl:px-0">
        {/* Logo Section */}
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="group flex items-center gap-3">
            <div className="relative">
              <Image
                src={Logo}
                alt="geekskai Logo"
                width={100}
                height={36}
                className="h-[36px] w-[100px] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            {typeof siteMetadata.headerTitle === "string" ? (
              <div className="hidden bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 lg:flex">
          <nav className="flex items-center space-x-2">
            {headerNavLinks
              .filter((link) => link.href !== "/" && link.title !== "Tools")
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group relative px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white md:text-lg"
                >
                  {link.title}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white md:text-lg"
                aria-expanded={toolsOpen}
                aria-haspopup="true"
              >
                Tools
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    toolsOpen ? "rotate-180" : ""
                  }`}
                />
                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
              </button>

              {/* Dropdown Menu */}
              {toolsOpen && (
                <div className="animate-in slide-in-from-top-5 absolute left-1/2 top-full mt-2 w-80 -translate-x-1/2 transform rounded-2xl border border-slate-700/50 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl duration-300">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between border-b border-slate-700/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold text-white">Developer Tools</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-1">
                      <Star className="h-3 w-3 text-blue-400" />
                      <span className="text-xs font-medium text-blue-300">
                        {toolsData.length} Tools
                      </span>
                    </div>
                  </div>

                  {/* Tools List */}
                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    {toolsData.map((tool) => {
                      const IconComponent = tool.icon
                      return (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="group flex items-start gap-3 rounded-xl border border-transparent bg-slate-800/50 p-3 transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                        >
                          <div className="flex-shrink-0 rounded-lg bg-slate-700/50 p-2 transition-transform duration-300 group-hover:scale-110">
                            <IconComponent className="h-4 w-4 text-slate-300 group-hover:text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <h4 className="truncate text-sm font-medium text-white transition-colors duration-300 group-hover:text-blue-300">
                                {tool.title}
                              </h4>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${tool.badgeColor} ml-2 flex-shrink-0`}
                              >
                                {tool.badge}
                              </span>
                            </div>
                            <p className="line-clamp-2 text-xs text-slate-400">
                              {tool.description}
                            </p>
                            <div className="mt-1.5">
                              <span className="rounded-md bg-slate-800/50 px-2 py-0.5 text-xs text-slate-500">
                                {tool.category}
                              </span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 border-t border-slate-700/50 pt-3">
                    <Link
                      href="/tools"
                      onClick={() => setToolsOpen(false)}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Sparkles className="h-4 w-4" />
                      View All Tools
                      <ChevronDown className="h-4 w-4 rotate-[-90deg] transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <SearchButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4 lg:hidden">
          <SearchButton />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
