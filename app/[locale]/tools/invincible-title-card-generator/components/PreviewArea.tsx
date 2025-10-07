import React from "react"
import { Monitor, Maximize2, Minimize2, Download, Heart, Copy, RotateCcw, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { TitleCardState } from "../types"

interface PreviewAreaProps {
  canvasRef: React.RefObject<HTMLDivElement>
  state: TitleCardState
  isFullscreen: boolean
  favorites: TitleCardState[]
  onToggleFullscreen: () => void
  onDownload: () => void
  onAddToFavorites: () => void
  onCopySettings: () => void
  onResetAll: () => void
  onApplyFavorite: (favorite: TitleCardState) => void
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  canvasRef,
  state,
  isFullscreen,
  favorites,
  onToggleFullscreen,
  onDownload,
  onAddToFavorites,
  onCopySettings,
  onResetAll,
  onApplyFavorite,
}) => {
  const t = useTranslations("InvincibleTitleCardGenerator")
  return (
    <div className={`${isFullscreen ? "col-span-1" : "lg:col-span-8"}`}>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-xl font-semibold text-white">
              <Monitor className="mr-3 h-5 w-5 text-blue-400" />
              {t("preview.live_preview")}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                <span className="font-mono">{t("preview.resolution")}</span>
              </div>
              <button
                onClick={onToggleFullscreen}
                className="rounded-xl p-2 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div
            className={`relative overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${
              isFullscreen ? "aspect-video w-full" : "aspect-video w-full"
            }`}
            style={{
              minHeight: isFullscreen ? "70vh" : "400px",
            }}
          >
            {/* Title Card Content - This is what gets exported */}
            <div
              ref={canvasRef}
              className="flex h-full w-full flex-col items-center justify-center px-8"
              style={{
                background: state.background,
                aspectRatio: "16 / 9",
                minHeight: "100%",
              }}
            >
              <div
                className="select-none text-center font-black transition-all duration-300"
                style={{
                  color: state.color,
                  fontSize: `${state.fontSize * (isFullscreen ? 3 : 2)}px`,
                  textShadow:
                    state.outline > 0
                      ? `${state.outline}px ${state.outline}px 0px ${state.outlineColor}, -${state.outline}px -${state.outline}px 0px ${state.outlineColor}, ${state.outline}px -${state.outline}px 0px ${state.outlineColor}, -${state.outline}px ${state.outline}px 0px ${state.outlineColor}`
                      : "2px 2px 4px rgba(0,0,0,0.5)",
                  fontFamily: '"Inter", "Arial Black", Arial, sans-serif',
                  fontWeight: "900",
                  letterSpacing: "2px",
                  lineHeight: "1.1",
                  textTransform: "uppercase",
                  WebkitTextStroke:
                    state.outline > 0 ? `${state.outline}px ${state.outlineColor}` : "none",
                }}
              >
                {state.text || t("preview.default_title")}
              </div>

              {/* Credits */}
              {state.showCredits && (state.smallSubtitle || state.subtitle) && (
                <div
                  className="mt-6 text-center transition-all duration-300"
                  style={{
                    color: state.color,
                    marginTop: `${state.subtitleOffset + 3}%`,
                    filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.7))",
                  }}
                >
                  {state.smallSubtitle && (
                    <div
                      className="font-bold uppercase tracking-wider"
                      style={{
                        fontSize: `${state.fontSize * (isFullscreen ? 0.6 : 0.4)}px`,
                        marginBottom: "8px",
                        fontFamily: '"Inter", Arial, sans-serif',
                        fontWeight: "700",
                      }}
                    >
                      {state.smallSubtitle}
                    </div>
                  )}
                  {state.subtitle && (
                    <div
                      className="font-bold"
                      style={{
                        fontSize: `${state.fontSize * (isFullscreen ? 0.8 : 0.6)}px`,
                        fontFamily: '"Inter", Arial, sans-serif',
                        fontWeight: "600",
                      }}
                    >
                      {state.subtitle}
                    </div>
                  )}
                </div>
              )}

              {/* Watermark */}
              {state.showWatermark && (
                <div className="absolute bottom-4 right-4 text-sm font-medium text-white/40">
                  {t("preview.watermark")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Action Buttons */}
      <div className="mt-8 space-y-4 border-t border-white/10 pt-8">
        <button
          onClick={onDownload}
          disabled={state.generating}
          className="w-full rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {state.generating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>{t("header.generating")}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Download className="h-5 w-5" />
              <span>{t("preview.download_title_card")}</span>
            </div>
          )}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onAddToFavorites}
            className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <Heart className="h-4 w-4" />
            <span>{t("preview.save_button")}</span>
          </button>

          <button
            onClick={onCopySettings}
            className="flex items-center justify-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/15"
          >
            <Copy className="h-4 w-4" />
            <span>{t("preview.copy_button")}</span>
          </button>
        </div>

        <button
          onClick={onResetAll}
          className="flex w-full items-center justify-center space-x-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
          <span>{t("preview.reset_all")}</span>
        </button>
      </div>

      {/* Modern Favorites Section */}
      {favorites.length > 0 && !isFullscreen && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
          <div className="border-b border-white/10 px-6 py-4">
            <h3 className="flex items-center text-lg font-semibold text-white">
              <Star className="mr-3 h-5 w-5 text-yellow-400" />
              {t("preview.saved_configurations")} ({favorites.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite, index) => (
                <button
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10"
                  onClick={() => onApplyFavorite(favorite)}
                >
                  <div className="mb-3 flex items-center space-x-3">
                    <div
                      className="h-8 w-8 rounded-lg border border-white/20 shadow-sm"
                      style={{ background: favorite.background }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-white transition-colors group-hover:text-yellow-300">
                        {favorite.text}
                      </h4>
                      <p className="text-xs text-slate-400">{t("preview.click_to_apply")}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div
                      className="h-3 w-3 rounded-full border border-white/20"
                      style={{ backgroundColor: favorite.color }}
                    />
                    <span className="font-mono text-xs text-slate-400">{favorite.fontSize}px</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
