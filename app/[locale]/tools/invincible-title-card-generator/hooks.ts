import { useState, useCallback } from "react"
import { TitleCardState } from "./types"
import { DEFAULT_STATE, characterPresets, backgroundPresets } from "./constants"

export const useTitleCardState = () => {
  const [state, setState] = useState<TitleCardState>(DEFAULT_STATE)
  const [favorites, setFavorites] = useState<TitleCardState[]>([])
  const [showSettings, setShowSettings] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<"presets" | "colors" | "text" | "effects">("presets")

  // Apply character preset
  const applyPreset = useCallback((preset: (typeof characterPresets)[0]) => {
    setState((prev) => ({
      ...prev,
      text: preset.text.toUpperCase(),
      background:
        backgroundPresets.find((bg) => bg.name.includes("Hero"))?.value || preset.background,
      color: preset.color,
    }))
  }, [])

  return {
    // State
    state,
    setState,
    favorites,
    setFavorites,
    showSettings,
    setShowSettings,
    isFullscreen,
    setIsFullscreen,
    activeTab,
    setActiveTab,

    // Actions
    applyPreset,
  }
}
