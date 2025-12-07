"use client"

import { useEffect } from "react"
import siteMetadata from "@/data/siteMetadata"
import headerNavLinks from "@/data/headerNavLinks"
import Logo from "@/data/logo.png"
import Link from "./Link"
import MobileNav from "./MobileNav"
import SearchButton from "./SearchButton"
import Image from "next/image"
import { ChevronDown, Zap, Star, Sparkles } from "lucide-react"
import { toolsData } from "@/data/toolsData"
import LanguageSelect from "./LanguageSelect"
import { useTranslations } from "next-intl"

const Header = () => {
  // Close dropdown on escape key
  const t = useTranslations("HomePage")

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Find the dropdown and remove hover state
        const dropdown = document.querySelector("[data-dropdown]") as HTMLElement
        if (dropdown) {
          dropdown.blur()
        }
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <header className="sticky top-0 z-80 border-b border-slate-800/50 bg-slate-950/80 shadow-xl backdrop-blur-xl">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 xl:px-0">
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
              .filter((link) => link.href !== "/" && link.title !== "nav_tools")
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group relative px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white md:text-lg"
                >
                  {t(link.title)}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}

            {/* Tools Dropdown */}
            <div className="group/dropdown relative" data-dropdown>
              <div
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white group-hover/dropdown:text-white md:text-lg"
                aria-haspopup="true"
              >
                {t("header_nav_tools")}
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover/dropdown:rotate-180" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover/dropdown:scale-x-100" />
              </div>

              {/* Dropdown Menu */}
              <div className="invisible absolute left-1/2 top-full mt-2 w-80 -translate-x-1/2 transform opacity-0 transition-all duration-300 group-hover/dropdown:visible group-hover/dropdown:opacity-100">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 blur-xl transition-opacity duration-300 group-hover/dropdown:opacity-50"></div>
                <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between border-b border-slate-700/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold text-white">{t("header_nav_tools")}</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-1">
                      <Star className="h-3 w-3 text-blue-400" />
                      <span className="text-xs font-medium text-blue-300">
                        {toolsData.length} {t("header_nav_tools")}
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
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-3 rounded-xl border border-transparent bg-slate-800/50 p-3 transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                        >
                          <div className="flex-shrink-0 rounded-lg bg-slate-700/50 p-2 transition-transform duration-300 group-hover:scale-110">
                            <IconComponent className="h-4 w-4 text-slate-300 group-hover:text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <p className="truncate text-sm font-medium text-white transition-colors duration-300 group-hover:text-blue-300">
                                {tool.title}
                              </p>
                              <span
                                className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white ${tool.badgeColor}`}
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Sparkles className="h-4 w-4" />
                      {t("header_nav_tools")}
                      <ChevronDown className="h-4 w-4 rotate-[-90deg] transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Select */}

            <LanguageSelect />
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
