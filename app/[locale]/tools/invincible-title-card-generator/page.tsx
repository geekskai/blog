"use client"

import React, { useRef } from "react"
import { useTranslations } from "next-intl"
import { Header } from "./components/Header"
import { PreviewArea } from "./components/PreviewArea"
import { SettingsPanel } from "./components/SettingsPanel"
import { ContentSections } from "./components/ContentSections"
import { useTitleCardState } from "./hooks"
import { getDefaultState } from "./constants"
import {
  downloadTitleCard,
  copySettings,
  randomizeAll,
  resetToDefault,
  addToFavorites,
} from "./utils"
import { TitleCardState } from "./types"
import "./title-card.css"

const InvincibleTitleCardGenerator = () => {
  const t = useTranslations("InvincibleTitleCardGenerator")

  // Get translated default state
  const defaultState = getDefaultState(t)

  const {
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
    applyPreset,
  } = useTitleCardState(defaultState)

  const canvasRef = useRef<HTMLDivElement>(null)

  // Handler functions
  const handleDownload = () => downloadTitleCard(canvasRef, state, setState)
  const handleCopySettings = () => copySettings(state, t)
  const handleRandomize = () => randomizeAll(setState)
  const handleReset = () => resetToDefault(setState, setFavorites, defaultState)
  const handleAddToFavorites = () => addToFavorites(state, favorites, setFavorites)
  const handleToggleFullscreen = () => setIsFullscreen(!isFullscreen)
  const handleApplyFavorite = (favorite: TitleCardState) => setState(favorite)

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header
          onRandomize={handleRandomize}
          onToggleFullscreen={handleToggleFullscreen}
          onDownload={handleDownload}
          isFullscreen={isFullscreen}
          isGenerating={state.generating}
        />

        {/* Main Content with Improved Layout */}
        <div className={`grid gap-8 ${isFullscreen ? "grid-cols-1" : "lg:grid-cols-12"}`}>
          <PreviewArea
            canvasRef={canvasRef}
            state={state}
            isFullscreen={isFullscreen}
            favorites={favorites}
            onToggleFullscreen={handleToggleFullscreen}
            onDownload={handleDownload}
            onAddToFavorites={handleAddToFavorites}
            onCopySettings={handleCopySettings}
            onResetAll={handleReset}
            onApplyFavorite={handleApplyFavorite}
          />

          <SettingsPanel
            state={state}
            setState={setState}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onApplyPreset={applyPreset}
            isFullscreen={isFullscreen}
          />
        </div>

        {!isFullscreen && <ContentSections />}
      </div>
    </div>
  )
}

export default InvincibleTitleCardGenerator
