import React from "react"
import { Settings, Eye, EyeOff, Star, Type, Sliders, Palette, Zap, X, Upload } from "lucide-react"
import { useTranslations } from "next-intl"
import { TitleCardState, TabType, CharacterPreset } from "../types"
import {
  getCharacterPresets,
  getBackgroundPresets,
  getTextColorPresets,
  getEffectPresets,
} from "../constants"
import { ImageUpload } from "./ImageUpload"
import { ColorInput } from "./ColorInput"

interface SettingsPanelProps {
  state: TitleCardState
  setState: React.Dispatch<React.SetStateAction<TitleCardState>>
  showSettings: boolean
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
  activeTab: TabType
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>
  onApplyPreset: (preset: CharacterPreset) => void
  isFullscreen: boolean
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  state,
  setState,
  showSettings,
  setShowSettings,
  activeTab,
  setActiveTab,
  onApplyPreset,
  isFullscreen,
}) => {
  const t = useTranslations("InvincibleTitleCardGenerator")

  // Get translated presets
  const characterPresets = getCharacterPresets(t)
  const backgroundPresets = getBackgroundPresets(t)
  const textColorPresets = getTextColorPresets(t)
  const effectPresets = getEffectPresets(t)

  if (isFullscreen) return null

  return (
    <div className="space-y-6 lg:col-span-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-xl font-semibold text-white">
              <Settings className="mr-3 h-5 w-5 text-slate-400" />
              {t("settings.customization")}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-xl p-2 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
              >
                {showSettings ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="p-6">
            {/* Modern Tab Navigation */}
            <div className="mb-8 flex rounded-xl border border-white/10 bg-white/10 p-1.5 backdrop-blur-sm">
              {(["presets", "text", "colors", "effects"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t(`settings.${tab}_tab`)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Presets Tab */}
              {activeTab === "presets" && (
                <div className="space-y-4">
                  <h3 className="flex items-center text-sm font-medium text-slate-300">
                    <Star className="mr-2 h-4 w-4" />
                    {t("settings.character_presets")}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {characterPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => onApplyPreset(preset)}
                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10"
                        style={{
                          background: `linear-gradient(135deg, ${preset.background}10, ${preset.background}20)`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white transition-colors group-hover:text-yellow-300">
                              {preset.name}
                            </h4>
                            <p className="text-xs text-slate-400">{preset.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <div
                              className="h-4 w-4 rounded-md border border-white/20 shadow-sm"
                              style={{ backgroundColor: preset.background }}
                            />
                            <div
                              className="h-4 w-4 rounded-md border border-white/20 shadow-sm"
                              style={{ backgroundColor: preset.color }}
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Tab */}
              {activeTab === "text" && (
                <div className="space-y-6">
                  <h3 className="flex items-center text-sm font-medium text-slate-300">
                    <Type className="mr-2 h-4 w-4" />
                    {t("settings.text_settings")}
                  </h3>

                  {/* Text Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        {t("settings.main_title_label")}
                      </label>
                      <input
                        type="text"
                        value={state.text}
                        onChange={(e) => setState((prev) => ({ ...prev, text: e.target.value }))}
                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-red-500 focus:bg-white/10 focus:ring-2 focus:ring-red-500/50"
                        placeholder={t("settings.main_title_placeholder")}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        {t("settings.small_subtitle_label")}
                      </label>
                      <input
                        type="text"
                        value={state.smallSubtitle}
                        onChange={(e) =>
                          setState((prev) => ({ ...prev, smallSubtitle: e.target.value }))
                        }
                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-red-500 focus:bg-white/10 focus:ring-2 focus:ring-red-500/50"
                        placeholder={t("settings.small_subtitle_placeholder")}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        {t("settings.credits_subtitle_label")}
                      </label>
                      <input
                        type="text"
                        value={state.subtitle}
                        onChange={(e) =>
                          setState((prev) => ({ ...prev, subtitle: e.target.value }))
                        }
                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-red-500 focus:bg-white/10 focus:ring-2 focus:ring-red-500/50"
                        placeholder={t("settings.credits_subtitle_placeholder")}
                      />
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="space-y-6">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label className="flex items-center text-sm font-medium text-slate-300">
                          <Sliders className="mr-2 h-4 w-4" />
                          {t("settings.font_size")}
                        </label>
                        <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 font-mono text-xs text-slate-300 backdrop-blur-sm">
                          {state.fontSize}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="40"
                        step="1"
                        value={state.fontSize}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            fontSize: parseInt(e.target.value, 10),
                          }))
                        }
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 accent-red-500 transition-colors hover:accent-red-600"
                        style={{
                          background: `linear-gradient(to right, rgb(239 68 68) 0%, rgb(239 68 68) ${
                            ((state.fontSize - 10) / (40 - 10)) * 100
                          }%, rgb(55 65 81) ${
                            ((state.fontSize - 10) / (40 - 10)) * 100
                          }%, rgb(55 65 81) 100%)`,
                        }}
                      />
                      <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>10</span>
                        <span>25</span>
                        <span>40</span>
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">
                          {t("settings.text_outline")}
                        </label>
                        <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 font-mono text-xs text-slate-300 backdrop-blur-sm">
                          {state.outline}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        value={state.outline}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            outline: parseInt(e.target.value),
                          }))
                        }
                        className="w-full accent-red-500"
                      />
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">
                          {t("settings.subtitle_offset")}
                        </label>
                        <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 font-mono text-xs text-slate-300 backdrop-blur-sm">
                          {state.subtitleOffset}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        value={state.subtitleOffset}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            subtitleOffset: parseInt(e.target.value),
                          }))
                        }
                        className="w-full accent-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Colors Tab */}
              {activeTab === "colors" && (
                <div className="space-y-6">
                  {/* Upload Custom Background Image */}
                  <div>
                    <h3 className="mb-4 flex items-center text-sm font-medium text-slate-300">
                      <Upload className="mr-2 h-4 w-4" />
                      {t("settings.upload_background")}
                    </h3>
                    <ImageUpload
                      value={state.backgroundImage}
                      onChange={(image) =>
                        setState((prev) => ({
                          ...prev,
                          backgroundImage: image,
                          // Clear background preset when uploading image
                          background: image ? "" : prev.background,
                        }))
                      }
                      onRemove={() =>
                        setState((prev) => ({
                          ...prev,
                          backgroundImage: null,
                          // Restore default background if no preset was selected
                          background:
                            prev.background || "linear-gradient(135deg, #169ee7, #1e40af)",
                        }))
                      }
                    />
                  </div>

                  {/* Custom Background Color */}
                  <div>
                    <h3 className="mb-4 flex items-center text-sm font-medium text-slate-300">
                      <Palette className="mr-2 h-4 w-4" />
                      {t("settings.custom_background_color")}
                    </h3>
                    <ColorInput
                      value={
                        state.backgroundImage
                          ? "#169ee7"
                          : state.background.startsWith("#") && state.background.length === 7
                            ? state.background
                            : "#169ee7"
                      }
                      onChange={(color) =>
                        setState((prev) => ({
                          ...prev,
                          background: color,
                          backgroundImage: null,
                        }))
                      }
                      label={t("settings.background_color_picker")}
                    />
                    <p className="mt-2 text-xs text-slate-400">{t("settings.custom_color_hint")}</p>
                  </div>

                  {/* Background Colors */}
                  <div>
                    <h3 className="mb-4 flex items-center text-sm font-medium text-slate-300">
                      <Palette className="mr-2 h-4 w-4" />
                      {t("settings.background_style")}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {backgroundPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              background: preset.value,
                              // Clear uploaded image when selecting preset
                              backgroundImage: null,
                            }))
                          }
                          className={`group relative overflow-hidden rounded-xl border-2 p-4 text-xs font-medium transition-all hover:scale-105 ${
                            state.background === preset.value && !state.backgroundImage
                              ? "border-white shadow-xl"
                              : "border-white/20 hover:border-white/40"
                          }`}
                          style={{ background: preset.value }}
                          title={preset.name}
                        >
                          <div className="relative z-10 text-white drop-shadow-lg">
                            {preset.name}
                          </div>
                          {preset.type === "gradient" && (
                            <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white/50" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Text Color */}
                  <div>
                    <h3 className="mb-4 text-sm font-medium text-slate-300">
                      {t("settings.custom_text_color")}
                    </h3>
                    <ColorInput
                      value={state.color}
                      onChange={(color) => setState((prev) => ({ ...prev, color }))}
                      label={t("settings.text_color_picker")}
                    />
                  </div>

                  {/* Text Colors */}
                  <div>
                    <h3 className="mb-4 text-sm font-medium text-slate-300">
                      {t("settings.text_color")}
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {textColorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setState((prev) => ({ ...prev, color: preset.value }))}
                          className={`aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                            state.color === preset.value
                              ? "border-white shadow-xl"
                              : "border-white/20 hover:border-white/40"
                          }`}
                          style={{ backgroundColor: preset.value }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Effects Tab */}
              {activeTab === "effects" && (
                <div className="space-y-6">
                  {/* Visual Effects Section */}
                  <div>
                    <h3 className="mb-4 flex items-center text-sm font-medium text-slate-300">
                      <Zap className="mr-2 h-4 w-4" />
                      {t("settings.visual_effects")}
                    </h3>
                    <p className="mb-4 text-xs text-slate-400">
                      {t("settings.visual_effects_description")}
                    </p>

                    {/* Effect Grid */}
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {effectPresets.map((effect) => {
                        const isSelected = state.effects.includes(effect.id)
                        return (
                          <button
                            key={effect.id}
                            onClick={() => {
                              setState((prev) => {
                                const currentEffects = prev.effects || []
                                if (isSelected) {
                                  return {
                                    ...prev,
                                    effects: currentEffects.filter((id) => id !== effect.id),
                                  }
                                } else {
                                  return {
                                    ...prev,
                                    effects: [...currentEffects, effect.id],
                                  }
                                }
                              })
                            }}
                            className={`group relative overflow-hidden rounded-xl border-2 p-3 transition-all hover:scale-105 ${
                              isSelected
                                ? "border-red-500 bg-red-500/20 shadow-lg shadow-red-500/20"
                                : "border-white/20 bg-white/5 hover:border-white/40"
                            }`}
                            title={effect.description}
                          >
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-800">
                              <img
                                src={effect.image}
                                alt={effect.name}
                                className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                                onError={(e) => {
                                  // Fallback if image doesn't exist
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<div class="flex h-full items-center justify-center text-xs text-slate-400">${effect.name}</div>`
                                  }
                                }}
                              />
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center bg-red-500/30">
                                  <div className="rounded-full bg-red-500 p-1">
                                    <Zap className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <p className="mt-2 text-xs font-medium text-white">{effect.name}</p>
                          </button>
                        )
                      })}
                    </div>

                    {/* Selected Effects List */}
                    {state.effects && state.effects.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-medium text-slate-300">
                          {t("settings.selected_effects")} ({state.effects.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {state.effects.map((effectId) => {
                            const effect = effectPresets.find((e) => e.id === effectId)
                            if (!effect) return null
                            return (
                              <div
                                key={effectId}
                                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5"
                              >
                                <span className="text-xs text-white">{effect.name}</span>
                                <button
                                  onClick={() => {
                                    setState((prev) => ({
                                      ...prev,
                                      effects: prev.effects.filter((id) => id !== effectId),
                                    }))
                                  }}
                                  className="text-red-400 transition-colors hover:text-red-300"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Display Options Section */}
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="mb-4 flex items-center text-sm font-medium text-slate-300">
                      {t("settings.display_options")}
                    </h3>

                    {/* Checkboxes with improved styling */}
                    <div className="space-y-4">
                      <label className="flex cursor-pointer items-center space-x-3 rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={state.showCredits}
                          onChange={(e) =>
                            setState((prev) => ({ ...prev, showCredits: e.target.checked }))
                          }
                          className="h-5 w-5 rounded-lg border-white/20 bg-white/10 text-red-500 focus:ring-red-500 focus:ring-offset-slate-900"
                        />
                        <div>
                          <span className="text-sm font-medium text-white">
                            {t("settings.show_credits")}
                          </span>
                          <p className="text-xs text-slate-400">
                            {t("settings.show_credits_description")}
                          </p>
                        </div>
                      </label>

                      <label className="flex cursor-pointer items-center space-x-3 rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={state.showWatermark}
                          onChange={(e) =>
                            setState((prev) => ({ ...prev, showWatermark: e.target.checked }))
                          }
                          className="h-5 w-5 rounded-lg border-white/20 bg-white/10 text-red-500 focus:ring-red-500 focus:ring-offset-slate-900"
                        />
                        <div>
                          <span className="text-sm font-medium text-white">
                            {t("settings.show_watermark")}
                          </span>
                          <p className="text-xs text-slate-400">
                            {t("settings.show_watermark_description")}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
