"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"
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
  Music,
  Users,
  Heart,
  Wand2,
} from "lucide-react"
import { Link } from "@/app/i18n/navigation"
// import ShareButtons from "@/components/ShareButtons"

// Color themes inspired by Chromakopia
const chromaColors = [
  { name: "Neon Green", hex: "#00FF41", rgb: "rgb(0, 255, 65)" },
  { name: "Electric Blue", hex: "#0080FF", rgb: "rgb(0, 128, 255)" },
  { name: "Vibrant Pink", hex: "#FF0080", rgb: "rgb(255, 0, 128)" },
  { name: "Golden Yellow", hex: "#FFD700", rgb: "rgb(255, 215, 0)" },
  { name: "Purple Haze", hex: "#8000FF", rgb: "rgb(128, 0, 255)" },
  { name: "Coral Orange", hex: "#FF4500", rgb: "rgb(255, 69, 0)" },
  { name: "Cyan Burst", hex: "#00FFFF", rgb: "rgb(0, 255, 255)" },
  { name: "Magenta Flow", hex: "#FF00FF", rgb: "rgb(255, 0, 255)" },
]

// Name prefixes inspired by Chromakopia themes
const chromaPrefixes = [
  "St.",
  "Chroma",
  "Neon",
  "Prism",
  "Color",
  "Vibrant",
  "Electric",
  "Cosmic",
  "Rainbow",
  "Spectrum",
  "Bright",
  "Radiant",
  "Luminous",
  "Crystal",
  "Diamond",
  "Kaleidoscope",
  "Aurora",
  "Solar",
  "Stellar",
  "Mystic",
  "Phoenix",
  "Chrome",
  "Ultra",
  "Hyper",
  "Neo",
  "Future",
  "Digital",
  "Cyber",
  "Quantum",
  "Infinite",
]

// Name suffixes with personality traits
const chromaSuffixes = [
  "Flux",
  "Wave",
  "Storm",
  "Beam",
  "Spark",
  "Glow",
  "Shine",
  "Burst",
  "Flash",
  "Blaze",
  "Fire",
  "Soul",
  "Heart",
  "Mind",
  "Dream",
  "Vision",
  "Echo",
  "Rhythm",
  "Beat",
  "Flow",
  "Vibe",
  "Energy",
  "Force",
  "Power",
  "Spirit",
  "Essence",
  "Core",
  "Nova",
  "Star",
  "Moon",
  "Sun",
  "Light",
]

// Personality traits inspired by the album's themes
const chromaTraits = [
  "Fearlessly authentic",
  "Colorfully rebellious",
  "Emotionally transparent",
  "Creatively unstoppable",
  "Boldly expressive",
  "Vibrantly alive",
  "Courageously vulnerable",
  "Artistically free",
  "Uniquely beautiful",
  "Passionately driven",
  "Spiritually awakened",
  "Mentally liberated",
  "Socially conscious",
  "Musically gifted",
  "Visually striking",
  "Culturally influential",
  "Personally transformative",
  "Romantically intense",
]

// Character descriptions
const chromaDescriptions = [
  "breaks free from society's black and white expectations",
  "brings color to every room they enter",
  "fears nothing except losing their authentic self",
  "creates art that speaks to the soul",
  "challenges the world to see in full spectrum",
  "transforms fear into vibrant expression",
  "masks their vulnerabilities with bold creativity",
  "fights against conformity with every breath",
  "paints their emotions across the cosmic canvas",
  "dances between light and shadow",
  "sings their truth in technicolor",
  "illuminates the path for other lost souls",
]

interface GeneratedPersona {
  name: string
  color: string
  colorName: string
  trait: string
  description: string
  superpower: string
  quote: string
}

const ChromakopiaNameGenerator = () => {
  const t = useTranslations("ChromakopiaNamGenerator")
  const tCommon = useTranslations("HomePage")

  const [generatedPersona, setGeneratedPersona] = useState<GeneratedPersona | null>(null)
  const [inputName, setInputName] = useState("")
  const [generationStyle, setGenerationStyle] = useState<"random" | "inspired" | "custom">("random")
  const [showSettings, setShowSettings] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [favoritePersonas, setFavoritePersonas] = useState<GeneratedPersona[]>([])

  const personaRef = useRef<HTMLDivElement>(null)

  // Generate random persona
  const generateRandomPersona = useCallback(() => {
    const randomColor = chromaColors[Math.floor(Math.random() * chromaColors.length)]
    const prefix = chromaPrefixes[Math.floor(Math.random() * chromaPrefixes.length)]
    const suffix = chromaSuffixes[Math.floor(Math.random() * chromaSuffixes.length)]
    const trait = chromaTraits[Math.floor(Math.random() * chromaTraits.length)]
    const description = chromaDescriptions[Math.floor(Math.random() * chromaDescriptions.length)]

    const superpowers = [
      "Can see emotions as colors",
      "Transforms sadness into rainbow light",
      "Makes black and white photos come alive",
      "Heals hearts through color therapy",
      "Creates musical rainbows",
      "Paints with pure emotion",
      "Brings forgotten dreams back to life",
      "Turns fears into beautiful art",
    ]

    const quotes = [
      '"Can you feel the light?"',
      '"I refuse to live in black and white"',
      '"Color is my rebellion"',
      '"Fear can\'t dim my brightness"',
      '"I paint my truth boldly"',
      '"Authenticity is my superpower"',
      '"I choose color over conformity"',
      '"My light can\'t be contained"',
    ]

    return {
      name: `${prefix} ${suffix}`,
      color: randomColor.hex,
      colorName: randomColor.name,
      trait,
      description,
      superpower: superpowers[Math.floor(Math.random() * superpowers.length)],
      quote: quotes[Math.floor(Math.random() * quotes.length)],
    }
  }, [])

  // Generate persona based on input name
  const generateInspiredPersona = useCallback((name: string) => {
    const nameHash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colorIndex = nameHash % chromaColors.length
    const prefixIndex = nameHash % chromaPrefixes.length
    const suffixIndex = (nameHash * 2) % chromaSuffixes.length
    const traitIndex = (nameHash * 3) % chromaTraits.length
    const descIndex = (nameHash * 4) % chromaDescriptions.length

    const selectedColor = chromaColors[colorIndex]

    return {
      name: `${chromaPrefixes[prefixIndex]} ${name} ${chromaSuffixes[suffixIndex]}`,
      color: selectedColor.hex,
      colorName: selectedColor.name,
      trait: chromaTraits[traitIndex],
      description: chromaDescriptions[descIndex],
      superpower: "Channels their unique energy into colorful creativity",
      quote: `"I am ${name}, and I shine in ${selectedColor.name}"`,
    }
  }, [])

  // Main generation function
  const generatePersona = async () => {
    setIsGenerating(true)

    // Add some animation delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    let newPersona: GeneratedPersona

    switch (generationStyle) {
      case "inspired":
        if (inputName.trim()) {
          newPersona = generateInspiredPersona(inputName.trim())
        } else {
          newPersona = generateRandomPersona()
        }
        break
      case "custom":
        // For custom, we'll use input name but with random elements
        newPersona = inputName.trim()
          ? { ...generateRandomPersona(), name: inputName.trim() }
          : generateRandomPersona()
        break
      default:
        newPersona = generateRandomPersona()
    }

    setGeneratedPersona(newPersona)
    setIsGenerating(false)
  }

  // Add to favorites
  const addToFavorites = () => {
    if (generatedPersona && !favoritePersonas.find((p) => p.name === generatedPersona.name)) {
      setFavoritePersonas((prev) => [...prev, generatedPersona])
    }
  }

  // Copy persona to clipboard
  const copyPersona = async () => {
    if (!generatedPersona) return

    const text = t("persona_card.copy_text", {
      name: generatedPersona.name,
      colorName: generatedPersona.colorName,
      trait: generatedPersona.trait,
      description: generatedPersona.description,
      superpower: generatedPersona.superpower,
      quote: generatedPersona.quote,
    })

    try {
      await navigator.clipboard.writeText(text)
      alert(t("persona_card.copied_message"))
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  // Download persona as image
  const downloadPersona = async () => {
    if (!personaRef.current || !generatedPersona) return

    try {
      const html2canvas = (await import("html2canvas-pro")).default
      const canvas = await html2canvas(personaRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
        logging: false,
      })

      const link = document.createElement("a")
      link.download = `${generatedPersona.name.replace(/\s+/g, "-").toLowerCase()}-chromakopia-persona.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (error) {
      console.error("Download failed:", error)
      alert(t("persona_card.download_failed"))
    }
  }

  // Reset everything
  const resetGenerator = () => {
    setGeneratedPersona(null)
    setInputName("")
    setGenerationStyle("random")
    setFavoritePersonas([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute left-1/2 top-40 h-80 w-80 animate-pulse rounded-full bg-green-500 opacity-20 mix-blend-multiply blur-xl filter"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="hover:text-slate-200">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">
            {t("breadcrumb.chromakopia_name_generator")}
          </li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-green-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <Palette className="mr-2 h-4 w-4" />
            {t("free_tool_badge")}
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-green-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
            {t("header.main_title")}
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-300">{t("header.description")}</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Persona Display */}
          <div className={`${showSettings ? "lg:col-span-8" : "lg:col-span-10"}`}>
            <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
              <div className="border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{t("persona_display.title")}</h2>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      {t("persona_display.st_chroma_style")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {generatedPersona ? (
                  <div ref={personaRef} className="space-y-6">
                    {/* Persona Card */}
                    <div
                      className="rounded-2xl p-8 text-center shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${generatedPersona.color}20, ${generatedPersona.color}40)`,
                        border: `2px solid ${generatedPersona.color}60`,
                      }}
                    >
                      {/* Color Circle */}
                      <div
                        className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-white shadow-lg"
                        style={{ backgroundColor: generatedPersona.color }}
                      ></div>

                      {/* Name */}
                      <h3 className="mb-2 text-3xl font-bold text-white">
                        {generatedPersona.name}
                      </h3>

                      {/* Color Name */}
                      <p
                        className="mb-4 text-lg font-medium"
                        style={{ color: generatedPersona.color }}
                      >
                        {t("persona_display.radiating_in")} {generatedPersona.colorName}
                      </p>

                      {/* Trait */}
                      <div className="mb-6 rounded-lg bg-black/20 p-4">
                        <p className="font-medium text-white">{generatedPersona.trait}</p>
                      </div>

                      {/* Description */}
                      <p className="mb-6 text-lg text-slate-200">{generatedPersona.description}</p>

                      {/* Superpower */}
                      <div className="mb-6 rounded-lg bg-white/10 p-4">
                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">
                          {t("persona_display.chromatic_superpower")}
                        </h4>
                        <p className="text-slate-200">{generatedPersona.superpower}</p>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-xl font-bold italic text-white">
                        {generatedPersona.quote}
                      </blockquote>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-purple-600">
                      <Palette className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      {t("persona_display.ready_title")}
                    </h3>
                    <p className="mb-8 text-slate-400">{t("persona_display.ready_description")}</p>
                    <button
                      onClick={generatePersona}
                      className="rounded-lg bg-gradient-to-r from-green-600 to-purple-600 px-8 py-3 font-medium text-white shadow-lg hover:from-green-700 hover:to-purple-700"
                    >
                      {t("persona_display.generate_button")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Favorites Section */}
            {favoritePersonas.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
                <div className="border-b border-slate-700 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">
                    {t("favorites.title")} ({favoritePersonas.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {favoritePersonas.map((persona, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-600 bg-slate-700/50 p-4"
                      >
                        <div className="mb-2 flex items-center space-x-3">
                          <div
                            className="h-6 w-6 rounded-full border border-white/20"
                            style={{ backgroundColor: persona.color }}
                          ></div>
                          <h4 className="text-sm font-medium text-white">{persona.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400">{persona.trait}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className={`space-y-6 lg:col-span-4 ${!showSettings && "lg:col-span-2"}`}>
            <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
              <div className="border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{t("settings.title")}</h2>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-700"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {showSettings && (
                <div className="space-y-6 p-6">
                  {/* Generation Style */}
                  <div>
                    <div className="mb-3 block text-sm font-medium text-slate-300">
                      {t("settings.generation_style")}
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          value: "random",
                          label: t("settings.random_persona"),
                          icon: Shuffle,
                          desc: t("settings.random_description"),
                        },
                        {
                          value: "inspired",
                          label: t("settings.name_inspired"),
                          icon: Sparkles,
                          desc: t("settings.name_inspired_description"),
                        },
                        {
                          value: "custom",
                          label: t("settings.custom_mix"),
                          icon: Wand2,
                          desc: t("settings.custom_mix_description"),
                        },
                      ].map(({ value, label, icon: Icon, desc }) => (
                        <button
                          key={value}
                          onClick={() => setGenerationStyle(value as any)}
                          className={`flex w-full items-start space-x-3 rounded-lg border p-4 text-left transition-colors ${
                            generationStyle === value
                              ? "border-green-500 bg-green-900/20 text-green-300"
                              : "border-slate-600 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <Icon className="mt-0.5 h-5 w-5" />
                          <div>
                            <div className="text-sm font-medium">{label}</div>
                            <div className="text-xs text-slate-400">{desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Name (if needed) */}
                  {(generationStyle === "inspired" || generationStyle === "custom") && (
                    <div>
                      <label
                        htmlFor="input-name"
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        {t("settings.input_name_label")}
                      </label>
                      <input
                        id="input-name"
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white focus:border-green-500 focus:ring-green-500"
                        placeholder={t("settings.input_name_placeholder")}
                      />
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={generatePersona}
                    disabled={isGenerating}
                    className="w-full rounded-lg bg-gradient-to-r from-green-600 to-purple-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-green-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>{t("settings.generating")}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Palette className="h-5 w-5" />
                        <span>{t("settings.generate_persona")}</span>
                      </div>
                    )}
                  </button>

                  {/* Action Buttons */}
                  {generatedPersona && (
                    <div className="space-y-2">
                      <button
                        onClick={copyPersona}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-600"
                      >
                        <Copy className="h-4 w-4" />
                        <span>{t("settings.copy_persona")}</span>
                      </button>

                      <button
                        onClick={downloadPersona}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-600"
                      >
                        <Download className="h-4 w-4" />
                        <span>{t("settings.download_image")}</span>
                      </button>

                      <button
                        onClick={addToFavorites}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-pink-600 px-4 py-3 text-sm font-medium text-white hover:bg-pink-700"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{t("settings.add_to_favorites")}</span>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={resetGenerator}
                    className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-600"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>{t("settings.reset_all")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Music className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.music_inspired")}
              </h3>
              <p className="text-slate-400">{t("features.music_description")}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.creative_expression")}
              </h3>
              <p className="text-slate-400">{t("features.creative_description")}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.share_connect")}
              </h3>
              <p className="text-slate-400">{t("features.share_description")}</p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* About Chromakopia Section */}
          <section className="rounded-xl bg-gradient-to-r from-green-800 to-purple-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("about_chromakopia.title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">{t("about_chromakopia.description_1")}</p>
                <p className="text-slate-200">{t("about_chromakopia.description_2")}</p>
              </div>
              <div className="rounded-lg bg-green-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("about_chromakopia.core_themes")}
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• {t("about_chromakopia.theme_1")}</li>
                  <li>• {t("about_chromakopia.theme_2")}</li>
                  <li>• {t("about_chromakopia.theme_3")}</li>
                  <li>• {t("about_chromakopia.theme_4")}</li>
                  <li>• {t("about_chromakopia.theme_5")}</li>
                  <li>• {t("about_chromakopia.theme_6")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("how_to_use.title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900 text-sm font-medium text-green-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("how_to_use.step_1_title")}</h3>
                    <p className="text-slate-400">{t("how_to_use.step_1_description")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900 text-sm font-medium text-green-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("how_to_use.step_2_title")}</h3>
                    <p className="text-slate-400">{t("how_to_use.step_2_description")}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900 text-sm font-medium text-green-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("how_to_use.step_3_title")}</h3>
                    <p className="text-slate-400">{t("how_to_use.step_3_description")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900 text-sm font-medium text-green-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{t("how_to_use.step_4_title")}</h3>
                    <p className="text-slate-400">{t("how_to_use.step_4_description")}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("faq.title")}</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q1")}</h3>
                <p className="text-slate-400">{t("faq.a1")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q2")}</h3>
                <p className="text-slate-400">{t("faq.a2")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q3")}</h3>
                <p className="text-slate-400">{t("faq.a3")}</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">{t("faq.q4")}</h3>
                <p className="text-slate-400">{t("faq.a4")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ChromakopiaNameGenerator
