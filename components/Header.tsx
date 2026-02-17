"use client"
import { useEffect } from "react"
import siteMetadata from "@/data/siteMetadata"
import headerNavLinks from "@/data/headerNavLinks"
import Link from "./Link"
import MobileNav from "./MobileNav"
import SearchButton from "./SearchButton"
import Image from "next/image"
import { ChevronDown, Zap, Star, Sparkles } from "lucide-react"
import { toolsData } from "@/data/toolsData"
import LanguageSelect from "./LanguageSelect"
import { useTranslations } from "next-intl"
import LinkNext from "next/link"
import MegaMenu from "./MegaMenu"

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
                src="/static/logo.png"
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
            {headerNavLinks.map((link) => (
              <LinkNext
                key={link.title}
                href={link.href}
                className="group relative px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white md:text-lg"
              >
                {t(link.title)}
                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
              </LinkNext>
            ))}

            {/* Tools Dropdown */}
            <div className="group/dropdown" data-dropdown>
              <div
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white group-hover/dropdown:text-white md:text-lg"
                aria-haspopup="true"
              >
                {t("header_nav_tools")}
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover/dropdown:rotate-180" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover/dropdown:scale-x-100" />
              </div>

              {/* MegaMenu Dropdown - Centered relative to header container */}
              <div className="invisible absolute inset-x-0 top-full z-50 mt-0 flex w-full justify-center opacity-0 shadow-xl backdrop-blur-xl transition-all duration-300 group-hover/dropdown:visible group-hover/dropdown:opacity-100">
                <div className="max-w-8xl w-[95vw]">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-x-4 inset-y-0 -z-10 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover/dropdown:opacity-100"></div>
                  <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/95 p-10 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between border-b border-slate-700/50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                          <Zap className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{t("header_nav_tools")}</h2>
                          <p className="text-sm text-slate-400">
                            Discover our collection of professional tools
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
                        <Star className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-300">
                          {toolsData.length} {t("header_nav_tools")}
                        </span>
                      </div>
                    </div>

                    {/* MegaMenu Content */}
                    <div className="custom-scrollbar max-h-[60vh] overflow-y-auto pr-4">
                      <MegaMenu />
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex items-center justify-between border-t border-slate-700/50 pt-6">
                      <p className="text-sm italic text-slate-400">
                        Ready to convert? Choose a tool and start now.
                      </p>
                      <Link
                        href="/tools"
                        className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
                      >
                        <Sparkles className="h-4 w-4" />
                        {t("header_nav_tools")}
                        <ChevronDown className="h-4 w-4 rotate-[-90deg] transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
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
