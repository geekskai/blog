import React from "react"
import {
  Monitor,
  Sparkles,
  Shuffle,
  Download,
  Maximize2,
  Minimize2,
  Home,
  ChevronRight,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"

interface HeaderProps {
  onRandomize: () => void
  onToggleFullscreen: () => void
  onDownload: () => void
  isFullscreen: boolean
  isGenerating: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onRandomize,
  onToggleFullscreen,
  onDownload,
  isFullscreen,
  isGenerating,
}) => {
  const t = useTranslations("InvincibleTitleCardGenerator")

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="transition-colors hover:text-slate-200">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">
            {t("breadcrumb.invincible_title_card_generator")}
          </li>
        </ol>
      </nav>

      {/* Clean Header with Professional Design */}
      <div className="relative mb-16 text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
          <Monitor className="mr-2 h-4 w-4 text-blue-400" />
          {t("header.professional_badge")}
          <Sparkles className="ml-2 h-4 w-4 text-yellow-400" />
        </div>

        <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
          <span className="block">{t("header.main_title")}</span>
          <span className="block bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            {t("header.subtitle")}
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
          {t("header.description")}
        </p>

        {/* Clean Action Buttons */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={onRandomize}
            className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/15 hover:shadow-xl"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            {t("header.randomize_button")}
          </button>
          <button
            onClick={onToggleFullscreen}
            className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/15 hover:shadow-xl"
          >
            {isFullscreen ? (
              <Minimize2 className="mr-2 h-4 w-4" />
            ) : (
              <Maximize2 className="mr-2 h-4 w-4" />
            )}
            {isFullscreen ? t("header.exit_fullscreen_button") : t("header.fullscreen_button")}
          </button>
          <button
            onClick={onDownload}
            disabled={isGenerating}
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? t("header.generating") : t("header.download_button")}
          </button>
        </div>
      </div>
    </>
  )
}
