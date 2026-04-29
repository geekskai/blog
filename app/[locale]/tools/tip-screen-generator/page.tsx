"use client"

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react"
import {
  DollarSign,
  Settings,
  Download,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Home,
  ChevronRight,
  Zap,
  Shield,
  Users,
  Copy,
} from "lucide-react"
import { Link } from "@/app/i18n/navigation"
import ShareButtons from "@/components/ShareButtons"
import { useTranslations } from "next-intl"
import {
  findTipScreenElement,
  preloadTipScreenImages,
  captureElementAsImage,
  captureElementAsBlob,
  downloadImage,
} from "./utils"
import {
  DEFAULT_BILL_AMOUNT,
  DEFAULT_SELECTED_TIP,
  DEFAULT_THEME,
  DEFAULT_DARK_PATTERNS,
  TIP_PERCENTAGES,
  MAX_BILL_AMOUNT,
  MIN_BILL_AMOUNT,
} from "./constants"

// Define tip screen themes
type TipTheme = "ipad-pos" | "uber-eats" | "dark-pattern"

interface TipOption {
  percentage: number
  amount: number
  label: string
}

interface TipScreenProps {
  billAmount: number
  tipOptions: TipOption[]
  selectedTip: number | null
  setSelectedTip: (tip: number | null) => void
  customTip: string
  setCustomTip: (tip: string) => void
  calculateTotal: () => number
  getCurrentTipAmount: () => number
  darkPatterns: {
    hideSkip: boolean
    defaultHighest: boolean
    guiltyText: boolean
    smallSkip: boolean
    watchingEyes: boolean
    tipFirst: boolean
  }
  showCustomTipInput?: boolean
  setShowCustomTipInput?: (show: boolean) => void
  handleCustomTipSelect?: () => void
  handleCustomTipChange?: (value: string) => void
  handleContinue?: () => void
  t: any // Translation function
}

const TipScreenGenerator = () => {
  const t = useTranslations("TipScreenGenerator")

  const [billAmount, setBillAmount] = useState(DEFAULT_BILL_AMOUNT)
  const [billAmountInput, setBillAmountInput] = useState(DEFAULT_BILL_AMOUNT.toString())
  const [selectedTip, setSelectedTip] = useState<number | null>(
    DEFAULT_DARK_PATTERNS.defaultHighest
      ? TIP_PERCENTAGES[TIP_PERCENTAGES.length - 1]
      : DEFAULT_SELECTED_TIP
  )
  const [customTip, setCustomTip] = useState("")
  const [theme, setTheme] = useState<TipTheme>(DEFAULT_THEME)
  const [showSettings, setShowSettings] = useState(true)
  const [showCustomTipInput, setShowCustomTipInput] = useState(false)

  // Dark pattern toggles
  const [darkPatterns, setDarkPatterns] = useState({ ...DEFAULT_DARK_PATTERNS })

  const tipScreenRef = useRef<HTMLDivElement>(null)

  // Calculate tip options based on bill amount (memoized for performance)
  const tipOptions: TipOption[] = useMemo(
    () =>
      TIP_PERCENTAGES.map((percentage) => ({
        percentage,
        amount: billAmount * (percentage / 100),
        label:
          percentage === 15
            ? t("tip_options.good")
            : percentage === 20
              ? t("tip_options.great")
              : percentage === 25
                ? t("tip_options.excellent")
                : t("tip_options.outstanding"),
      })),
    [billAmount, t]
  )

  // Auto-select highest tip if dark pattern is enabled
  useEffect(() => {
    if (darkPatterns.defaultHighest) {
      setSelectedTip(TIP_PERCENTAGES[TIP_PERCENTAGES.length - 1]) // Highest percentage (30%)
    }
  }, [darkPatterns.defaultHighest])

  const calculateTotal = useCallback(() => {
    const tipAmount = selectedTip ? billAmount * (selectedTip / 100) : parseFloat(customTip) || 0
    return billAmount + tipAmount
  }, [billAmount, selectedTip, customTip])

  const getCurrentTipAmount = useCallback(() => {
    return selectedTip ? billAmount * (selectedTip / 100) : parseFloat(customTip) || 0
  }, [billAmount, selectedTip, customTip])

  // Screenshot functionality

  /**
   * Capture tip screen as image and download
   * Finds the actual tip screen element (not the wrapper) for accurate capture
   */
  const takeScreenshot = async () => {
    if (!tipScreenRef.current) {
      alert(t("alerts.screenshot_wait"))
      return
    }

    // Find the actual tip screen element (not the wrapper)
    const actualTipScreen = findTipScreenElement(tipScreenRef.current)
    if (!actualTipScreen) {
      alert(t("alerts.render_wait"))
      return
    }

    // Check if the tip screen is properly rendered
    const hasContent = actualTipScreen.children.length > 0
    if (!hasContent) {
      alert(t("alerts.render_wait"))
      return
    }

    try {
      // Wait for DOM to be fully rendered
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Preload all images and CSS backgrounds
      await preloadTipScreenImages(actualTipScreen)

      // Capture element as image
      const dataURL = await captureElementAsImage(actualTipScreen, {
        backgroundColor: "#ffffff",
        scale: 2,
      })

      // Download the image
      const filename = `fake-tip-screen-${theme}-${Date.now()}.png`
      downloadImage(dataURL, filename)

      console.log("✅ Screenshot downloaded successfully")
    } catch (error) {
      console.error("Screenshot failed:", error)
      alert(t("alerts.screenshot_failed"))
    }
  }

  /**
   * Copy tip screen to clipboard
   * Finds the actual tip screen element (not the wrapper) for accurate capture
   */
  const copyToClipboard = async () => {
    if (!tipScreenRef.current) return

    try {
      // Find the actual tip screen element (not the wrapper)
      const actualTipScreen = findTipScreenElement(tipScreenRef.current)
      if (!actualTipScreen) {
        alert(t("alerts.render_wait"))
        return
      }

      // Wait for DOM to be fully rendered
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Preload all images and CSS backgrounds
      await preloadTipScreenImages(actualTipScreen)

      // Capture element as blob
      const blob = await captureElementAsBlob(actualTipScreen, {
        backgroundColor: null,
        scale: 2,
      })

      if (blob) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
          alert(t("alerts.screenshot_copied"))
        } catch (err) {
          console.error("Copy failed:", err)
          alert(t("alerts.copy_failed"))
        }
      }
    } catch (error) {
      console.error(t("alerts.copy_failed_general"), error)
    }
  }

  // Reset all settings to default values
  const resetSettings = () => {
    setBillAmount(DEFAULT_BILL_AMOUNT)
    setBillAmountInput(DEFAULT_BILL_AMOUNT.toString())
    setSelectedTip(DEFAULT_SELECTED_TIP)
    setCustomTip("")
    setTheme(DEFAULT_THEME)
    setShowCustomTipInput(false)
    setDarkPatterns({ ...DEFAULT_DARK_PATTERNS })
  }

  // Handle custom tip selection
  const handleCustomTipSelect = useCallback(() => {
    setSelectedTip(null)
    setShowCustomTipInput(true)
  }, [])

  // Handle custom tip input change
  const handleCustomTipChange = useCallback((value: string) => {
    setCustomTip(value)
    setSelectedTip(null)
  }, [])

  /**
   * Handle continue button click
   * Shows an alert with tip calculation details
   */
  const handleContinue = useCallback(() => {
    const tipAmount = getCurrentTipAmount()
    const total = calculateTotal()
    const tipPercentage = selectedTip ? `${selectedTip}%` : "Custom"

    alert(
      `🎭 This is a FAKE tip screen!\n\n` +
        `Bill: $${billAmount.toFixed(2)}\n` +
        `Tip: $${tipAmount.toFixed(2)} (${tipPercentage})\n` +
        `Total: $${total.toFixed(2)}\n\n` +
        `This tool is for educational and satirical purposes only!`
    )
  }, [billAmount, selectedTip, getCurrentTipAmount, calculateTotal])

  // Validate bill amount
  const handleBillAmountChange = (value: string) => {
    // 更新输入框显示值
    setBillAmountInput(value)

    // 如果是空字符串，设置账单金额为0但保持输入框为空
    if (value === "") {
      setBillAmount(0)
      return
    }

    const amount = parseFloat(value)
    if (isNaN(amount)) {
      // 如果不是有效数字，不更新billAmount
      return
    }

    if (amount < MIN_BILL_AMOUNT) {
      setBillAmount(MIN_BILL_AMOUNT)
    } else if (amount > MAX_BILL_AMOUNT) {
      setBillAmount(MAX_BILL_AMOUNT)
      setBillAmountInput(MAX_BILL_AMOUNT.toString())
    } else {
      setBillAmount(amount)
    }
  }

  // Render different tip screen themes (memoized for performance)
  const renderTipScreen = useMemo(() => {
    const commonProps: TipScreenProps = {
      billAmount,
      tipOptions,
      selectedTip,
      setSelectedTip,
      customTip,
      setCustomTip,
      calculateTotal,
      getCurrentTipAmount,
      darkPatterns,
      showCustomTipInput,
      setShowCustomTipInput,
      handleCustomTipSelect,
      handleCustomTipChange,
      handleContinue,
      t,
    }

    switch (theme) {
      case "ipad-pos":
        return <IPadPOSScreen {...commonProps} />
      case "uber-eats":
        return <UberEatsScreen {...commonProps} />
      case "dark-pattern":
        return <DarkPatternScreen {...commonProps} />
      default:
        return <IPadPOSScreen {...commonProps} />
    }
  }, [
    billAmount,
    tipOptions,
    selectedTip,
    customTip,
    calculateTotal,
    getCurrentTipAmount,
    darkPatterns,
    showCustomTipInput,
    handleCustomTipSelect,
    handleCustomTipChange,
    handleContinue,
    theme,
    t,
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-3 md:px-6 md:pt-4 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 md:gap-2 md:text-sm">
          <li>
            <Link href="/" className="flex items-center gap-1 hover:text-slate-200">
              <Home className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
          <li>
            <Link href="/tools" className="hover:text-slate-200">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb.tip_screen_generator")}</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center md:mb-10">
          <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg md:mb-6 md:px-4 md:py-2 md:text-sm">
            <DollarSign className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            {t("header.professional_badge")}
          </div>

          <h1 className="mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-4xl md:mb-4 md:text-5xl">
            {t("header.main_title")}
          </h1>

          <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-300 md:text-lg md:leading-8">
            {t("header.description")}
          </p>

          {/* Share Button */}
          <div className="mt-5 flex justify-center md:mt-6">
            <div className="w-full max-w-sm rounded-xl bg-slate-800/50 p-3 backdrop-blur-sm md:w-auto md:max-w-none md:p-4">
              <p className="mb-2 text-center text-sm font-medium leading-5 text-slate-300 md:mb-3">
                Share this tip screen resource:
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-5 md:gap-8 lg:grid-cols-12 lg:items-start">
          {/* Settings Panel */}
          <div className="space-y-4 md:space-y-6 lg:col-span-4">
            <div className="overflow-hidden rounded-2xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{t("settings.title")}</h2>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    aria-expanded={showSettings}
                    aria-controls="tip-screen-settings-panel"
                    className="rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-slate-700"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div
                id="tip-screen-settings-panel"
                aria-hidden={!showSettings}
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                  showSettings ? "max-h-[120rem] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-5 p-4 md:space-y-6 md:p-6">
                  {/* Bill Amount */}
                  <div>
                    <label
                      htmlFor="bill-amount"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      {t("settings.bill_amount_label")}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="bill-amount"
                        type="number"
                        value={billAmountInput}
                        onChange={(e) => handleBillAmountChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-600 bg-slate-700 py-2.5 pl-10 pr-4 text-base text-white focus:border-blue-500 focus:ring-blue-500 md:py-3"
                        step="0.01"
                        min="0"
                        placeholder="25.75"
                      />
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div>
                    <div className="mb-3 block text-sm font-medium text-slate-300">
                      {t("settings.theme_label")}
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { value: "ipad-pos", label: t("settings.themes.ipad_pos"), icon: Tablet },
                        {
                          value: "uber-eats",
                          label: t("settings.themes.food_delivery"),
                          icon: Smartphone,
                        },
                        {
                          value: "dark-pattern",
                          label: t("settings.themes.dark_pattern"),
                          icon: Monitor,
                        },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setTheme(value as TipTheme)}
                          className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors md:px-4 ${
                            theme === value
                              ? "border-blue-500 bg-blue-900/20 text-blue-300"
                              : "border-slate-600 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dark Pattern Toggles */}
                  <div>
                    <div className="mb-3 block text-sm font-medium text-slate-300">
                      {t("settings.dark_patterns_label")}
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          key: "defaultHighest",
                          label: t("settings.dark_pattern_options.auto_select_highest"),
                          icon: "🎯",
                        },
                        {
                          key: "hideSkip",
                          label: t("settings.dark_pattern_options.hide_no_tip"),
                          icon: "🙈",
                        },
                        {
                          key: "guiltyText",
                          label: t("settings.dark_pattern_options.guilt_messages"),
                          icon: "😢",
                        },
                        {
                          key: "smallSkip",
                          label: t("settings.dark_pattern_options.tiny_skip"),
                          icon: "🔍",
                        },
                        {
                          key: "watchingEyes",
                          label: t("settings.dark_pattern_options.employee_watching"),
                          icon: "👀",
                        },
                        {
                          key: "tipFirst",
                          label: t("settings.dark_pattern_options.tip_amount_first"),
                          icon: "💰",
                        },
                      ].map(({ key, label, icon }) => (
                        <label
                          key={key}
                          className="flex min-h-[48px] items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/20 px-3 py-3"
                        >
                          <input
                            type="checkbox"
                            checked={darkPatterns[key as keyof typeof darkPatterns]}
                            onChange={(e) =>
                              setDarkPatterns((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                            className="mt-0.5 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm leading-5 text-slate-300">
                            {icon} {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5">
                    <button
                      onClick={takeScreenshot}
                      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Screenshot</span>
                    </button>

                    <button
                      onClick={copyToClipboard}
                      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy to Clipboard</span>
                    </button>

                    <button
                      onClick={resetSettings}
                      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Screen Preview */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-4 py-3 md:px-6 md:py-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-lg font-semibold text-white">{t("preview.title")}</h2>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-slate-400" />
                    <span className="text-sm capitalize text-slate-500">
                      {theme.replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 md:p-6">
                <div className="flex min-h-[39rem] justify-center md:min-h-[50rem]">
                  <div ref={tipScreenRef} className="mx-auto w-full max-w-[22rem] md:max-w-md">
                    <div className="transform-gpu transition-all duration-300 md:hover:scale-[1.02]">
                      {renderTipScreen}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-14 md:mt-20">
          <div className="grid gap-4 md:grid-cols-3 md:gap-8">
            <div className="rounded-2xl bg-slate-800/60 p-5 text-center ring-1 ring-slate-700/70 md:p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white md:h-16 md:w-16">
                <Zap className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.satirical_design.title")}
              </h3>
              <p className="text-sm leading-6 text-slate-400 md:text-base">
                {t("features.satirical_design.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800/60 p-5 text-center ring-1 ring-slate-700/70 md:p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white md:h-16 md:w-16">
                <Shield className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.educational_tool.title")}
              </h3>
              <p className="text-sm leading-6 text-slate-400 md:text-base">
                {t("features.educational_tool.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800/60 p-5 text-center ring-1 ring-slate-700/70 md:p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white md:h-16 md:w-16">
                <Users className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.social_sharing.title")}
              </h3>
              <p className="text-sm leading-6 text-slate-400 md:text-base">
                {t("features.social_sharing.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-14 space-y-10 md:mt-20 md:space-y-16">
          {/* What is Tip Screen Section */}
          <section className="rounded-2xl bg-gradient-to-r from-blue-800 to-indigo-700 p-5 md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-8 text-white md:mb-6 md:text-2xl">
              {t("educational_content.what_is_tip_screen.title")}
            </h2>
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <div>
                <p className="mb-4 text-sm leading-6 text-slate-200 md:text-base md:leading-7">
                  {t("educational_content.what_is_tip_screen.description_1")}
                </p>
                <p className="text-sm leading-6 text-slate-200 md:text-base md:leading-7">
                  {t("educational_content.what_is_tip_screen.description_2")}
                </p>
              </div>
              <div className="rounded-xl bg-blue-900/30 p-4 md:p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("educational_content.what_is_tip_screen.features_title")}
                </h3>
                <ul className="space-y-2 text-sm leading-6 text-slate-200 md:text-base">
                  <li>{t("educational_content.what_is_tip_screen.features.percentage_options")}</li>
                  <li>{t("educational_content.what_is_tip_screen.features.custom_input")}</li>
                  <li>{t("educational_content.what_is_tip_screen.features.skip_option")}</li>
                  <li>{t("educational_content.what_is_tip_screen.features.calculated_totals")}</li>
                  <li>{t("educational_content.what_is_tip_screen.features.visual_elements")}</li>
                  <li>{t("educational_content.what_is_tip_screen.features.social_messaging")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tip Screen Psychology Section */}
          <section className="rounded-2xl bg-gradient-to-r from-purple-800 to-pink-700 p-5 md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-8 text-white md:mb-6 md:text-2xl">
              {t("educational_content.psychology_section.title")}
            </h2>
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              <div className="rounded-xl bg-purple-900/30 p-4 md:p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("educational_content.psychology_section.cognitive_bias.title")}
                </h3>
                <p className="text-sm leading-6 text-slate-200 md:text-base">
                  {t("educational_content.psychology_section.cognitive_bias.description")}
                </p>
              </div>
              <div className="rounded-xl bg-purple-900/30 p-4 md:p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("educational_content.psychology_section.social_pressure.title")}
                </h3>
                <p className="text-sm leading-6 text-slate-200 md:text-base">
                  {t("educational_content.psychology_section.social_pressure.description")}
                </p>
              </div>
              <div className="rounded-xl bg-purple-900/30 p-4 md:p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("educational_content.psychology_section.default_effects.title")}
                </h3>
                <p className="text-sm leading-6 text-slate-200 md:text-base">
                  {t("educational_content.psychology_section.default_effects.description")}
                </p>
              </div>
            </div>
          </section>

          {/* Mobile Optimization Section */}
          <section className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 p-5 md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-8 text-white md:mb-6 md:text-2xl">
              {t("educational_content.device_section.title")}
            </h2>
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              <div className="rounded-xl bg-slate-800 p-4 shadow-md md:p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("educational_content.device_section.iphone.title")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.device_section.iphone.description")}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800 p-4 shadow-md md:p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("educational_content.device_section.ipad_pos.title")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.device_section.ipad_pos.description")}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800 p-4 shadow-md md:p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("educational_content.device_section.android.title")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.device_section.android.description")}
                </p>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="rounded-2xl bg-slate-800 p-5 shadow-lg md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-8 text-white md:mb-6 md:text-2xl">
              {t("educational_content.how_to_create.title")}
            </h2>
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-900 text-sm font-medium text-orange-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("educational_content.how_to_create.step_1.title")}
                    </h3>
                    <p className="text-sm leading-6 text-slate-400 md:text-base">
                      {t("educational_content.how_to_create.step_1.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-900 text-sm font-medium text-orange-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("educational_content.how_to_create.step_2.title")}
                    </h3>
                    <p className="text-sm leading-6 text-slate-400 md:text-base">
                      {t("educational_content.how_to_create.step_2.description")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-900 text-sm font-medium text-orange-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("educational_content.how_to_create.step_3.title")}
                    </h3>
                    <p className="text-sm leading-6 text-slate-400 md:text-base">
                      {t("educational_content.how_to_create.step_3.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-900 text-sm font-medium text-orange-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("educational_content.how_to_create.step_4.title")}
                    </h3>
                    <p className="text-sm leading-6 text-slate-400 md:text-base">
                      {t("educational_content.how_to_create.step_4.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="rounded-2xl bg-slate-800 p-5 md:p-8">
            <h2 className="mb-4 text-xl font-bold leading-8 text-white md:mb-6 md:text-2xl">
              {t("educational_content.faq.title")}
            </h2>
            <div className="space-y-5 md:space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("educational_content.faq.q1.question")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.faq.q1.answer")}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("educational_content.faq.q2.question")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.faq.q2.answer")}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("educational_content.faq.q3.question")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.faq.q3.answer")}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("educational_content.faq.q4.question")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.faq.q4.answer")}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("educational_content.faq.q5.question")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.faq.q5.answer")}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("educational_content.faq.q6.question")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("educational_content.faq.q6.answer")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// iPad POS Screen Component
const IPadPOSScreen: React.FC<TipScreenProps> = ({
  billAmount,
  tipOptions,
  selectedTip,
  setSelectedTip,
  calculateTotal,
  getCurrentTipAmount,
  darkPatterns,
  handleContinue,
  t,
}) => {
  return (
    <div className="aspect-[3/4] w-full rounded-2xl bg-slate-900 p-4 shadow-xl sm:p-5 md:p-6">
      {/* Header */}
      <div className="mb-4 text-center sm:mb-5 md:mb-6">
        <h3 className="text-lg font-bold text-slate-200 sm:text-xl">
          {t("tip_screen_components.tip")}
        </h3>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">
            👀 Your server is watching...
          </p>
        )}
      </div>

      {/* Bill Amount */}
      <div className="mb-4 rounded-lg bg-slate-800 p-3 sm:mb-5 sm:p-4 md:mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-slate-400 sm:text-base">
            {t("tip_screen_components.bill_total")}:
          </span>
          <span className="text-sm font-medium text-slate-200 sm:text-base">
            ${billAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tip Options */}
      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:mb-5 sm:gap-3 md:mb-6">
        {tipOptions.map((option) => (
          <button
            key={option.percentage}
            onClick={() => setSelectedTip(option.percentage)}
            className={`rounded-lg border-2 p-3 text-center transition-colors sm:p-4 ${
              selectedTip === option.percentage
                ? "border-blue-500 bg-blue-900/20"
                : "border-slate-600 bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <div className="text-base font-bold text-slate-200 sm:text-lg">
              {darkPatterns.tipFirst ? `$${option.amount.toFixed(2)}` : `${option.percentage}%`}
            </div>
            <div className="text-xs text-slate-400 sm:text-sm">
              {darkPatterns.tipFirst ? `${option.percentage}%` : `$${option.amount.toFixed(2)}`}
            </div>
            <div className="text-[11px] font-medium leading-4 text-blue-400 sm:text-xs">
              {option.label}
            </div>
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="mb-4 rounded-lg bg-green-900/20 p-3 sm:p-4">
        <div className="flex justify-between text-base font-bold sm:text-lg">
          <span className="text-green-200">{t("tip_screen_components.total")}:</span>
          <span className="text-green-200">${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-green-400 sm:text-sm">
          <span>{t("tip_screen_components.tip")}:</span>
          <span>${getCurrentTipAmount().toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleContinue}
          className="w-full rounded-lg bg-green-600 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 sm:text-base"
        >
          {t("tip_screen_components.continue")}
        </button>

        {!darkPatterns.hideSkip && (
          <button
            className={`w-full rounded-lg border border-slate-600 px-3 text-slate-400 transition-colors hover:bg-slate-700 ${
              darkPatterns.smallSkip ? "py-1 text-[11px]" : "py-2 text-xs sm:text-sm"
            }`}
          >
            {darkPatterns.guiltyText
              ? t("tip_screen_components.guilt_skip_message")
              : t("tip_screen_components.no_tip")}
          </button>
        )}
      </div>
    </div>
  )
}

// Uber Eats Style Screen Component
const UberEatsScreen: React.FC<TipScreenProps> = ({
  billAmount,
  tipOptions,
  selectedTip,
  setSelectedTip,
  calculateTotal,
  getCurrentTipAmount,
  darkPatterns,
  showCustomTipInput,
  setShowCustomTipInput,
  handleCustomTipSelect,
  handleCustomTipChange,
  customTip,
  handleContinue,
  t,
}) => {
  return (
    <div className="aspect-[9/16] w-full rounded-3xl bg-slate-900 p-4 shadow-xl sm:p-5 md:p-6">
      {/* Header */}
      <div className="mb-4 text-center sm:mb-5 md:mb-6">
        <h3 className="text-xl font-bold text-slate-200 sm:text-2xl">
          {t("tip_screen_components.tip")}
        </h3>
        <p className="text-sm leading-5 text-slate-400 sm:text-base">
          Help support your delivery partner
        </p>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 text-xs leading-5 text-red-400 sm:text-sm">
            👀 Driver can see your tip amount
          </p>
        )}
      </div>

      {/* Tip Options */}
      <div className="mb-4 space-y-2.5 sm:mb-5 sm:space-y-3 md:mb-6">
        {tipOptions.map((option) => (
          <button
            key={option.percentage}
            onClick={() => setSelectedTip(option.percentage)}
            className={`w-full rounded-xl border-2 p-3 text-left transition-colors sm:p-4 ${
              selectedTip === option.percentage
                ? "border-green-500 bg-green-900/20"
                : "border-slate-600 bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-slate-200 sm:text-lg">
                  {darkPatterns.tipFirst ? `$${option.amount.toFixed(2)}` : `${option.percentage}%`}
                </div>
                <div className="text-xs text-slate-400 sm:text-sm">{option.label} service</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 sm:text-sm">
                  {darkPatterns.tipFirst ? `${option.percentage}%` : `$${option.amount.toFixed(2)}`}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Tip */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        {!showCustomTipInput ? (
          <button
            onClick={handleCustomTipSelect}
            className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 p-3 text-left transition-colors hover:bg-slate-700 sm:p-4"
          >
            <div className="font-medium text-slate-200">
              {t("tip_screen_components.custom_tip")}
            </div>
            <div className="text-xs text-slate-400 sm:text-sm">
              {t("tip_screen_components.enter_amount")}
            </div>
          </button>
        ) : (
          <div className="rounded-xl border-2 border-blue-500 bg-blue-900/20 p-3 sm:p-4">
            <div className="mb-2 font-medium text-slate-200">
              {t("tip_screen_components.custom_tip")}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => handleCustomTipChange && handleCustomTipChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2.5 pl-8 pr-4 text-base text-white focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <button
                onClick={() => setShowCustomTipInput && setShowCustomTipInput(false)}
                className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Total Summary */}
      <div className="mb-4 rounded-xl bg-slate-800 p-3 sm:mb-5 sm:p-4 md:mb-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">{t("tip_screen_components.bill_total")}</span>
            <span className="text-sm text-slate-200">${billAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">{t("tip_screen_components.tip")}</span>
            <span className="text-sm text-slate-200">${getCurrentTipAmount().toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-600 pt-2">
            <div className="flex justify-between text-base font-bold sm:text-lg">
              <span className="text-slate-200">{t("tip_screen_components.total")}</span>
              <span className="text-slate-200">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleContinue}
          className="w-full rounded-xl bg-black py-3.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:py-4 sm:text-base"
        >
          {t("tip_screen_components.continue")}
        </button>

        {!darkPatterns.hideSkip && (
          <button
            className={`w-full px-3 text-center text-slate-400 transition-colors hover:text-slate-200 ${
              darkPatterns.smallSkip ? "text-[11px]" : "text-xs sm:text-sm"
            }`}
          >
            {darkPatterns.guiltyText
              ? t("tip_screen_components.delivery_guilt_message")
              : t("tip_screen_components.delivery_no_tip")}
          </button>
        )}
      </div>
    </div>
  )
}

// Dark Pattern Screen Component
const DarkPatternScreen: React.FC<TipScreenProps> = ({
  billAmount,
  tipOptions,
  selectedTip,
  setSelectedTip,
  calculateTotal,
  getCurrentTipAmount,
  darkPatterns,
  handleContinue,
  t,
}) => {
  return (
    <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-800 bg-gradient-to-b from-red-900/20 to-orange-900/20 p-4 shadow-xl sm:p-5 md:p-6">
      {/* Manipulative Header */}
      <div className="mb-4 text-center sm:mb-5 md:mb-6">
        <h3 className="text-xl font-bold text-red-200 sm:text-2xl">🚨 TIP REQUIRED 🚨</h3>
        <p className="text-sm font-medium leading-5 text-red-400 sm:text-base">
          Our hardworking staff depends on your generosity
        </p>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 animate-pulse text-xs leading-5 text-red-300 sm:text-sm">
            👀👀👀 Everyone is watching your choice 👀👀👀
          </p>
        )}
      </div>

      {/* Exaggerated Tip Options */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 md:mb-6">
        {[
          {
            percentage: 25,
            label: t("tip_screen_components.dark_pattern_labels.minimum_decent"),
            color: "bg-yellow-700 border-yellow-500",
          },
          {
            percentage: 30,
            label: t("tip_screen_components.dark_pattern_labels.fair"),
            color: "bg-orange-700 border-orange-500",
          },
          {
            percentage: 40,
            label: t("tip_screen_components.dark_pattern_labels.good_person"),
            color: "bg-green-700 border-green-500",
          },
          { percentage: 50, label: "HERO! ⭐", color: "bg-purple-700 border-purple-500" },
        ].map((option) => (
          <button
            key={option.percentage}
            onClick={() => setSelectedTip(option.percentage)}
            className={`rounded-lg border-2 p-2.5 text-center transition-colors sm:p-3 ${
              selectedTip === option.percentage
                ? "border-red-500 bg-red-900/30"
                : `${option.color} hover:opacity-80`
            }`}
          >
            <div className="text-base font-bold text-slate-200 sm:text-lg">
              {darkPatterns.tipFirst
                ? `$${(billAmount * (option.percentage / 100)).toFixed(2)}`
                : `${option.percentage}%`}
            </div>
            <div className="text-[11px] font-medium leading-4 text-slate-300 sm:text-xs">
              {option.label}
            </div>
          </button>
        ))}
      </div>

      {/* Guilt Trip Section */}
      <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 p-3">
        <p className="text-center text-xs font-medium leading-5 text-red-200 sm:text-sm">
          💔 Low tips hurt our team's ability to pay rent 💔
        </p>
      </div>

      {/* Total with Emphasis */}
      <div className="mb-4 rounded-lg border-2 border-green-600 bg-green-900/30 p-3 sm:p-4">
        <div className="text-center">
          <div className="text-xl font-bold text-green-200 sm:text-2xl">
            ${calculateTotal().toFixed(2)}
          </div>
          <div className="text-xs text-green-400 sm:text-sm">Thank you for being generous! 🙏</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleContinue}
          className="w-full rounded-lg bg-green-600 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-green-700 sm:py-4 sm:text-lg"
        >
          YES, I'LL TIP! ✨
        </button>

        {!darkPatterns.hideSkip && (
          <button
            className={`w-full px-2 text-center transition-all hover:opacity-80 ${
              darkPatterns.smallSkip
                ? "py-1 text-[8px] text-gray-600 hover:text-gray-500"
                : "py-2 text-[11px] text-gray-400 hover:text-gray-200 sm:text-xs"
            }`}
          >
            {darkPatterns.guiltyText
              ? t("tip_screen_components.dark_pattern_guilt")
              : t("tip_screen_components.skip")}
          </button>
        )}
      </div>

      {/* Fake Social Pressure */}
      <div className="mt-4 space-y-2 text-center">
        <p className="text-[11px] text-gray-400 sm:text-xs">💡 99% of customers tip at least 30%</p>
        {darkPatterns.watchingEyes && (
          <div className="animate-pulse text-[9px] text-red-400 sm:text-[10px]">
            ⚠️ Low tips are publicly displayed on social media
          </div>
        )}
        {darkPatterns.guiltyText && (
          <div className="text-[9px] text-orange-400 sm:text-[10px]">
            💸 Your tip directly affects our rent payments
          </div>
        )}
      </div>
    </div>
  )
}

export default TipScreenGenerator
