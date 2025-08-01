"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import {
  Palette,
  Settings,
  Download,
  Sparkles,
  Shuffle,
  Copy,
  RotateCcw,
  Home,
  ChevronRight,
  Zap,
  Monitor,
  Users,
  Heart,
  Share2,
  Type,
  Image as ImageIcon,
  Sliders,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Star,
  Play,
} from "lucide-react"
import ShareButtons from "@/components/ShareButtons"

// Character presets from the original project
const characterPresets = [
  {
    name: "Invincible",
    background: "#169ee7",
    color: "#eaed00",
    text: "Invincible",
    description: "The main character",
  },
  {
    name: "Invinciboy",
    background: "#169ee7",
    color: "#000000",
    text: "Invinciboy",
    description: "Young Mark Grayson",
  },
  {
    name: "Atom Eve",
    background: "#eb607a",
    color: "#f3cad2",
    text: "Atom Eve",
    description: "Samantha Eve Wilkins",
  },
  {
    name: "Omni-Man",
    background: "#e1ebed",
    color: "#ca4230",
    text: "Omni-Man",
    description: "Nolan Grayson",
  },
  {
    name: "Allen the Alien",
    background: "#3936ed",
    color: "#2bffe1",
    text: "Allen the Alien",
    description: "Coalition of Planets",
  },
  {
    name: "Immortal",
    background: "#3c3d53",
    color: "#e8c856",
    text: "Immortal",
    description: "Abraham Lincoln",
  },
  {
    name: "Oliver",
    background: "#9a004f",
    color: "#95b38e",
    text: "Oliver",
    description: "Mark's half-brother",
  },
]

// Background color presets with gradients
const backgroundPresets = [
  { name: "Classic Blue", value: "#169ee7", type: "solid" },
  { name: "Hero Gradient", value: "linear-gradient(135deg, #169ee7, #1e40af)", type: "gradient" },
  { name: "Villain Red", value: "linear-gradient(135deg, #dc2626, #991b1b)", type: "gradient" },
  { name: "Atom Pink", value: "linear-gradient(135deg, #eb607a, #be185d)", type: "gradient" },
  { name: "Space Black", value: "linear-gradient(135deg, #1f2937, #000000)", type: "gradient" },
  { name: "Cosmic Purple", value: "linear-gradient(135deg, #7c3aed, #3730a3)", type: "gradient" },
  { name: "Sunset Orange", value: "linear-gradient(135deg, #ea580c, #dc2626)", type: "gradient" },
  { name: "Forest Green", value: "linear-gradient(135deg, #059669, #047857)", type: "gradient" },
]

// Text color presets
const textColorPresets = [
  { name: "Invincible Yellow", value: "#eaed00" },
  { name: "Hero Blue", value: "#169ee7" },
  { name: "Danger Red", value: "#dc2626" },
  { name: "Royal Purple", value: "#7c3aed" },
  { name: "Pure Black", value: "#000000" },
  { name: "Pure White", value: "#ffffff" },
  { name: "Bright Orange", value: "#ea580c" },
  { name: "Steel Gray", value: "#6b7280" },
  { name: "Atom Pink", value: "#f3cad2" },
  { name: "Alien Cyan", value: "#2bffe1" },
]

interface TitleCardState {
  text: string
  smallSubtitle: string
  subtitle: string
  showCredits: boolean
  showWatermark: boolean
  color: string
  background: string
  fontSize: number
  outline: number
  outlineColor: string
  subtitleOffset: number
  generating: boolean
}

const InvincibleTitleCardGenerator = () => {
  const [state, setState] = useState<TitleCardState>({
    text: "Invincible",
    color: "#eaed00",
    showCredits: true,
    showWatermark: true,
    background: "linear-gradient(135deg, #169ee7, #1e40af)",
    fontSize: 28,
    outline: 2,
    subtitleOffset: 5,
    outlineColor: "#000000",
    generating: false,
    smallSubtitle: "BASED ON THE COMIC BOOK BY",
    subtitle: "Robert Kirkman, Cory Walker, & Ryan Ottley",
  })

  const [showSettings, setShowSettings] = useState(true)
  const [favorites, setFavorites] = useState<TitleCardState[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<"presets" | "colors" | "text" | "effects">("presets")
  const canvasRef = useRef<HTMLDivElement>(null)

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

  // Download title card
  const downloadTitleCard = async () => {
    if (!canvasRef.current) return

    setState((prev) => ({ ...prev, generating: true }))

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 3, // Higher quality
        logging: false,
        width: 1920,
        height: 1080,
        useCORS: true,
      })

      const link = document.createElement("a")
      link.download = `${state.text.replace(/\s+/g, "-").toLowerCase()}-invincible-title-card.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (error) {
      console.error("Download failed:", error)
      alert("Download failed. Please try again.")
    }

    setState((prev) => ({ ...prev, generating: false }))
  }

  // Quick actions
  const randomizeAll = () => {
    const randomPreset = characterPresets[Math.floor(Math.random() * characterPresets.length)]
    const randomBg = backgroundPresets[Math.floor(Math.random() * backgroundPresets.length)]
    applyPreset(randomPreset)
    setState((prev) => ({ ...prev, background: randomBg.value }))
  }

  // Copy title card settings
  const copySettings = async () => {
    const settings = {
      text: state.text,
      color: state.color,
      background: state.background,
      fontSize: state.fontSize,
      outline: state.outline,
      showCredits: state.showCredits,
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2))
      alert("Settings copied to clipboard! 🎬")
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  // Add to favorites
  const addToFavorites = () => {
    if (
      !favorites.find(
        (f) => f.text === state.text && f.color === state.color && f.background === state.background
      )
    ) {
      setFavorites((prev) => [...prev, { ...state }])
    }
  }

  // Reset all settings
  const resetAll = () => {
    setState({
      text: "Invincible",
      color: "#eaed00",
      showCredits: true,
      showWatermark: true,
      background: "linear-gradient(135deg, #169ee7, #1e40af)",
      fontSize: 28,
      outline: 2,
      subtitleOffset: 5,
      outlineColor: "#000000",
      generating: false,
      smallSubtitle: "BASED ON THE COMIC BOOK BY",
      subtitle: "Robert Kirkman, Cory Walker, & Ryan Ottley",
    })
    setFavorites([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      {/* Enhanced animated background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-red-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-yellow-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute left-1/2 top-40 h-80 w-80 animate-pulse rounded-full bg-blue-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute bottom-1/4 right-1/4 h-60 w-60 animate-pulse rounded-full bg-purple-500 opacity-5 mix-blend-multiply blur-xl filter"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">Home</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="transition-colors hover:text-slate-200">
              Tools
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">Invincible Title Card Generator</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Header with Quick Actions */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-yellow-600 px-6 py-3 text-sm font-medium text-white shadow-lg">
            <Monitor className="mr-2 h-4 w-4" />
            Free Title Card Generator
            <Sparkles className="ml-2 h-4 w-4" />
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
            Invincible Title Card Generator
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-slate-300">
            Create stunning title cards inspired by the Invincible animated series. Design
            professional-looking graphics with an intuitive interface and powerful customization
            options.
          </p>

          {/* Quick Action Buttons */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={randomizeAll}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Randomize
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              {isFullscreen ? (
                <Minimize2 className="mr-2 h-4 w-4" />
              ) : (
                <Maximize2 className="mr-2 h-4 w-4" />
              )}
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
            <button
              onClick={downloadTitleCard}
              disabled={state.generating}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
            >
              <Download className="mr-2 h-4 w-4" />
              {state.generating ? "Generating..." : "Quick Download"}
            </button>
          </div>

          {/* Share Section */}
          <div className="flex justify-center">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm">
              <p className="mb-4 text-center text-sm font-medium text-slate-300">
                Share this creative tool:
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* Main Content with Improved Layout */}
        <div className={`grid gap-8 ${isFullscreen ? "grid-cols-1" : "lg:grid-cols-12"}`}>
          {/* Enhanced Settings Panel */}
          {!isFullscreen && (
            <div className="space-y-6 lg:col-span-4">
              <div className="overflow-hidden rounded-xl bg-slate-800/90 shadow-2xl ring-1 ring-slate-700/50 backdrop-blur-sm">
                <div className="border-b border-slate-700/50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center text-xl font-semibold text-white">
                      <Settings className="mr-2 h-5 w-5" />
                      Customization
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                      >
                        {showSettings ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {showSettings && (
                  <div className="p-6">
                    {/* Tab Navigation */}
                    <div className="mb-6 flex rounded-lg bg-slate-700/50 p-1">
                      {(["presets", "text", "colors", "effects"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-all ${
                            activeTab === tab
                              ? "bg-red-600 text-white shadow-sm"
                              : "text-slate-300 hover:bg-slate-600 hover:text-white"
                          }`}
                        >
                          {tab}
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
                            Character Presets
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {characterPresets.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="group relative overflow-hidden rounded-lg border border-slate-600 p-4 text-left transition-all hover:border-slate-500 hover:bg-slate-700/30"
                                style={{
                                  background: `linear-gradient(135deg, ${preset.background}15, ${preset.background}25)`,
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
                                      className="h-4 w-4 rounded border border-white/20"
                                      style={{ backgroundColor: preset.background }}
                                    />
                                    <div
                                      className="h-4 w-4 rounded border border-white/20"
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
                            Text Settings
                          </h3>

                          {/* Text Inputs */}
                          <div className="space-y-4">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                Main Title
                              </label>
                              <input
                                type="text"
                                value={state.text}
                                onChange={(e) =>
                                  setState((prev) => ({ ...prev, text: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                placeholder="Enter title text..."
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                Small Subtitle
                              </label>
                              <input
                                type="text"
                                value={state.smallSubtitle}
                                onChange={(e) =>
                                  setState((prev) => ({ ...prev, smallSubtitle: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                placeholder="Small subtitle..."
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                Credits Subtitle
                              </label>
                              <input
                                type="text"
                                value={state.subtitle}
                                onChange={(e) =>
                                  setState((prev) => ({ ...prev, subtitle: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                placeholder="Credits subtitle..."
                              />
                            </div>
                          </div>

                          {/* Sliders */}
                          <div className="space-y-6">
                            <div>
                              <div className="mb-3 flex items-center justify-between">
                                <label className="flex items-center text-sm font-medium text-slate-300">
                                  <Sliders className="mr-2 h-4 w-4" />
                                  Font Size
                                </label>
                                <span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
                                  {state.fontSize}
                                </span>
                              </div>
                              <input
                                type="range"
                                min="12"
                                max="48"
                                value={state.fontSize}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    fontSize: parseInt(e.target.value),
                                  }))
                                }
                                className="w-full accent-red-500"
                              />
                            </div>

                            <div>
                              <div className="mb-3 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">
                                  Text Outline
                                </label>
                                <span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
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
                                  Subtitle Offset
                                </label>
                                <span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
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
                          {/* Background Colors */}
                          <div>
                            <h3 className="mb-4 flex items-center text-sm font-medium text-slate-300">
                              <Palette className="mr-2 h-4 w-4" />
                              Background Style
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              {backgroundPresets.map((preset) => (
                                <button
                                  key={preset.name}
                                  onClick={() =>
                                    setState((prev) => ({ ...prev, background: preset.value }))
                                  }
                                  className={`group relative overflow-hidden rounded-lg border-2 p-4 text-xs font-medium transition-all hover:scale-105 ${
                                    state.background === preset.value
                                      ? "border-white shadow-lg"
                                      : "border-slate-600 hover:border-slate-500"
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

                          {/* Text Colors */}
                          <div>
                            <h3 className="mb-4 text-sm font-medium text-slate-300">Text Color</h3>
                            <div className="grid grid-cols-5 gap-2">
                              {textColorPresets.map((preset) => (
                                <button
                                  key={preset.name}
                                  onClick={() =>
                                    setState((prev) => ({ ...prev, color: preset.value }))
                                  }
                                  className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                                    state.color === preset.value
                                      ? "border-white shadow-lg"
                                      : "border-slate-600"
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
                          <h3 className="flex items-center text-sm font-medium text-slate-300">
                            <Zap className="mr-2 h-4 w-4" />
                            Display Options
                          </h3>

                          {/* Checkboxes with improved styling */}
                          <div className="space-y-4">
                            <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-slate-600 p-3 transition-colors hover:bg-slate-700/30">
                              <input
                                type="checkbox"
                                checked={state.showCredits}
                                onChange={(e) =>
                                  setState((prev) => ({ ...prev, showCredits: e.target.checked }))
                                }
                                className="h-5 w-5 rounded border-slate-500 bg-slate-600 text-red-500 focus:ring-red-500"
                              />
                              <div>
                                <span className="text-sm font-medium text-white">Show Credits</span>
                                <p className="text-xs text-slate-400">
                                  Display subtitle information below the title
                                </p>
                              </div>
                            </label>

                            <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-slate-600 p-3 transition-colors hover:bg-slate-700/30">
                              <input
                                type="checkbox"
                                checked={state.showWatermark}
                                onChange={(e) =>
                                  setState((prev) => ({ ...prev, showWatermark: e.target.checked }))
                                }
                                className="h-5 w-5 rounded border-slate-500 bg-slate-600 text-red-500 focus:ring-red-500"
                              />
                              <div>
                                <span className="text-sm font-medium text-white">
                                  Show Watermark
                                </span>
                                <p className="text-xs text-slate-400">
                                  Add attribution to the generated image
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-8 space-y-3 border-t border-slate-700 pt-6">
                        <button
                          onClick={downloadTitleCard}
                          disabled={state.generating}
                          className="w-full rounded-lg bg-gradient-to-r from-red-600 to-yellow-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {state.generating ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              <span>Generating...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <Download className="h-5 w-5" />
                              <span>Download Title Card</span>
                            </div>
                          )}
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={addToFavorites}
                            className="flex items-center justify-center space-x-2 rounded-lg bg-pink-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-700"
                          >
                            <Heart className="h-4 w-4" />
                            <span>Save</span>
                          </button>

                          <button
                            onClick={copySettings}
                            className="flex items-center justify-center space-x-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Copy</span>
                          </button>
                        </div>

                        <button
                          onClick={resetAll}
                          className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Reset All</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Preview Area */}
          <div className={`${isFullscreen ? "col-span-1" : "lg:col-span-8"}`}>
            <div className="overflow-hidden rounded-xl bg-slate-800/90 shadow-2xl ring-1 ring-slate-700/50 backdrop-blur-sm">
              <div className="border-b border-slate-700/50 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-semibold text-white">
                    <Monitor className="mr-2 h-5 w-5" />
                    Live Preview
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>1920×1080</span>
                    </div>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
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
                  ref={canvasRef}
                  className={`relative overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${
                    isFullscreen ? "aspect-video w-full" : "aspect-video w-full"
                  }`}
                  style={{
                    background: state.background,
                    minHeight: isFullscreen ? "70vh" : "400px",
                  }}
                >
                  {/* Title Card Content */}
                  <div className="flex h-full flex-col items-center justify-center px-8">
                    <div
                      className="select-none text-center font-black transition-all duration-300"
                      style={{
                        color: state.color,
                        fontSize: `${state.fontSize * (isFullscreen ? 3 : 2)}px`,
                        textShadow:
                          state.outline > 0
                            ? `${state.outline * 2}px ${state.outline * 2}px 0px ${state.outlineColor}, -${state.outline}px -${state.outline}px 0px ${state.outlineColor}, ${state.outline}px -${state.outline}px 0px ${state.outlineColor}, -${state.outline}px ${state.outline}px 0px ${state.outlineColor}`
                            : "4px 4px 8px rgba(0,0,0,0.5)",
                        fontFamily: 'Impact, "Arial Black", sans-serif',
                        letterSpacing: "3px",
                        lineHeight: "0.9",
                      }}
                    >
                      {state.text || "Enter Your Title"}
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
                        Made with geekskai.com
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Section with improved design */}
            {favorites.length > 0 && !isFullscreen && (
              <div className="mt-8 overflow-hidden rounded-xl bg-slate-800/90 shadow-2xl ring-1 ring-slate-700/50 backdrop-blur-sm">
                <div className="border-b border-slate-700/50 px-6 py-4">
                  <h3 className="flex items-center text-lg font-semibold text-white">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Saved Configurations ({favorites.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((favorite, index) => (
                      <button
                        key={index}
                        className="group relative overflow-hidden rounded-lg border border-slate-600 bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 text-left transition-all hover:scale-105 hover:border-slate-500"
                        onClick={() => setState(favorite)}
                      >
                        <div className="mb-3 flex items-center space-x-3">
                          <div
                            className="h-8 w-8 rounded border-2 border-white/20"
                            style={{ background: favorite.background }}
                          ></div>
                          <div>
                            <h4 className="font-medium text-white transition-colors group-hover:text-yellow-300">
                              {favorite.text}
                            </h4>
                            <p className="text-xs text-slate-400">Click to apply</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div
                            className="h-3 w-3 rounded-full border border-white/20"
                            style={{ backgroundColor: favorite.color }}
                          />
                          <span className="text-xs text-slate-400">
                            Size: {favorite.fontSize}px
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section - only show when not in fullscreen */}
        {!isFullscreen && (
          <>
            <div className="mt-24">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="group text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transition-transform group-hover:scale-110">
                    <Type className="h-10 w-10" />
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-white">Custom Typography</h3>
                  <p className="leading-relaxed text-slate-400">
                    Create title cards with customizable text, fonts, sizes, and outline effects
                    that perfectly match the Invincible series aesthetic with professional quality.
                  </p>
                </div>

                <div className="group text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg transition-transform group-hover:scale-110">
                    <Palette className="h-10 w-10" />
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-white">Character Presets</h3>
                  <p className="leading-relaxed text-slate-400">
                    Quick-start with pre-configured color schemes and styles for popular Invincible
                    characters like Mark, Omni-Man, Atom Eve, and many more heroes and villains.
                  </p>
                </div>

                <div className="group text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-transform group-hover:scale-110">
                    <Download className="h-10 w-10" />
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-white">Professional Export</h3>
                  <p className="leading-relaxed text-slate-400">
                    Download your title cards in ultra-high resolution PNG format, perfect for video
                    projects, social media content, presentations, and professional productions.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Sections for SEO - Enhanced Design */}
            <div className="mt-32 space-y-20">
              {/* About Section */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-800 via-red-700 to-yellow-700 p-10 shadow-2xl">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <h2 className="mb-8 text-3xl font-bold text-white">
                    Create Professional Invincible-Style Title Cards
                  </h2>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <p className="mb-6 text-lg leading-relaxed text-slate-100">
                        Our advanced Invincible Title Card Generator empowers creators to produce
                        studio-quality title cards that capture the essence of the beloved animated
                        series. With intuitive controls and professional-grade output, bring your
                        creative vision to life.
                      </p>
                      <p className="text-lg leading-relaxed text-slate-100">
                        Whether you're creating fan videos, YouTube content, educational materials,
                        or professional presentations, our tool provides the flexibility and quality
                        you need to stand out from the crowd.
                      </p>
                    </div>
                    <div className="rounded-xl border border-red-400/30 bg-red-900/40 p-8 backdrop-blur-sm">
                      <h3 className="mb-6 flex items-center text-xl font-semibold text-white">
                        <Sparkles className="mr-3 h-6 w-6 text-yellow-300" />
                        Premium Features
                      </h3>
                      <ul className="space-y-3 text-slate-100">
                        <li className="flex items-center">
                          <div className="mr-3 h-2 w-2 rounded-full bg-yellow-300"></div>
                          Character-based color presets and themes
                        </li>
                        <li className="flex items-center">
                          <div className="mr-3 h-2 w-2 rounded-full bg-yellow-300"></div>
                          Advanced text customization and typography
                        </li>
                        <li className="flex items-center">
                          <div className="mr-3 h-2 w-2 rounded-full bg-yellow-300"></div>
                          Professional gradient backgrounds
                        </li>
                        <li className="flex items-center">
                          <div className="mr-3 h-2 w-2 rounded-full bg-yellow-300"></div>
                          High-resolution export (1920×1080)
                        </li>
                        <li className="flex items-center">
                          <div className="mr-3 h-2 w-2 rounded-full bg-yellow-300"></div>
                          Real-time preview and editing
                        </li>
                        <li className="flex items-center">
                          <div className="mr-3 h-2 w-2 rounded-full bg-yellow-300"></div>
                          Save and manage favorite configurations
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* How to Use Section */}
              <section className="rounded-2xl bg-slate-800/90 p-10 shadow-2xl backdrop-blur-sm">
                <h2 className="mb-8 text-center text-3xl font-bold text-white">
                  How to Create Your Perfect Title Card
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                      1
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-white">Choose Your Style</h3>
                    <p className="text-slate-400">
                      Select from character presets or start with a blank canvas. Each preset
                      includes optimized colors and styling for authentic results.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-2xl font-bold text-white">
                      2
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-white">Customize Text</h3>
                    <p className="text-slate-400">
                      Enter your title and adjust typography settings. Fine-tune font size, outline,
                      and positioning for the perfect look.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                      3
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-white">Design & Preview</h3>
                    <p className="text-slate-400">
                      Adjust colors, backgrounds, and effects while watching your changes in
                      real-time. Use the fullscreen mode for detailed editing.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                      4
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-white">Export & Share</h3>
                    <p className="text-slate-400">
                      Download your title card in professional quality and share it across your
                      projects, social media, or creative platforms.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="rounded-2xl bg-slate-800/90 p-10 shadow-2xl backdrop-blur-sm">
                <h2 className="mb-8 text-center text-3xl font-bold text-white">
                  Frequently Asked Questions
                </h2>
                <div className="mx-auto max-w-4xl space-y-8">
                  <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      What makes this title card generator special?
                    </h3>
                    <p className="leading-relaxed text-slate-300">
                      Our generator is specifically designed to replicate the authentic look and
                      feel of the Invincible animated series. We've carefully studied the show's
                      typography, color schemes, and visual style to provide character-specific
                      presets and professional-grade customization options that produce
                      studio-quality results.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Can I use these title cards for commercial projects?
                    </h3>
                    <p className="leading-relaxed text-slate-300">
                      The title cards you create are yours to use for personal projects and fan
                      content. For commercial use, please ensure you have the necessary rights and
                      permissions. Our tool is designed for creative expression and educational
                      purposes.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      What resolution and format are the exported images?
                    </h3>
                    <p className="leading-relaxed text-slate-300">
                      All title cards are exported in high-quality PNG format at 1920×1080
                      resolution (Full HD), perfect for video projects, presentations, and social
                      media. The files maintain transparency where applicable and are optimized for
                      both digital and print use.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      How do I save my favorite configurations?
                    </h3>
                    <p className="leading-relaxed text-slate-300">
                      Use the "Save" button to add your current configuration to your favorites. You
                      can save multiple configurations and quickly switch between them by clicking
                      on any saved preset in the favorites section. This feature helps you maintain
                      consistency across multiple title cards or quickly experiment with different
                      styles.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Is the tool completely free?
                    </h3>
                    <p className="leading-relaxed text-slate-300">
                      Yes! Our Invincible Title Card Generator is completely free with no
                      registration required, no hidden fees, and no watermarks (unless you choose to
                      keep the attribution). Create unlimited title cards and download them at full
                      resolution without any restrictions.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default InvincibleTitleCardGenerator
