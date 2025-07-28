"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
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
  AlertTriangle,
  Zap,
  Shield,
  Users,
  Copy,
} from "lucide-react"
import ShareButtons from "@/components/ShareButtons"

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
}

const TipScreenGenerator = () => {
  const [billAmount, setBillAmount] = useState(25.75)
  const [billAmountInput, setBillAmountInput] = useState("25.75")
  const [selectedTip, setSelectedTip] = useState<number | null>(20)
  const [customTip, setCustomTip] = useState("")
  const [theme, setTheme] = useState<TipTheme>("ipad-pos")
  const [showSettings, setShowSettings] = useState(true)
  const [showCustomTipInput, setShowCustomTipInput] = useState(false)

  // Dark pattern toggles
  const [darkPatterns, setDarkPatterns] = useState({
    hideSkip: false,
    defaultHighest: true,
    guiltyText: false,
    smallSkip: false,
    watchingEyes: false,
    tipFirst: true,
  })

  const tipScreenRef = useRef<HTMLDivElement>(null)

  // Calculate tip options based on bill amount
  const tipOptions: TipOption[] = [
    { percentage: 15, amount: billAmount * 0.15, label: "Good" },
    { percentage: 20, amount: billAmount * 0.2, label: "Great" },
    { percentage: 25, amount: billAmount * 0.25, label: "Excellent" },
    { percentage: 30, amount: billAmount * 0.3, label: "Outstanding" },
  ]

  // Auto-select highest tip if dark pattern is enabled
  useEffect(() => {
    if (darkPatterns.defaultHighest) {
      setSelectedTip(30)
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
  const takeScreenshot = async () => {
    if (!tipScreenRef.current) {
      alert("Please wait for the screen to load completely before taking a screenshot.")
      return
    }

    // Check if the tip screen is properly rendered
    const hasContent = tipScreenRef.current.children.length > 0
    if (!hasContent) {
      alert("Please wait for the tip screen to render before taking a screenshot.")
      return
    }

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(tipScreenRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        height: tipScreenRef.current.scrollHeight,
        width: tipScreenRef.current.scrollWidth,
      })

      // Download the image
      const link = document.createElement("a")
      link.download = `fake-tip-screen-${theme}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (error) {
      console.error("Screenshot failed:", error)
      alert(
        "Screenshot failed. This might be due to browser security restrictions. Please try again or use a different browser."
      )
    }
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!tipScreenRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(tipScreenRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      })

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
            alert("Screenshot copied to clipboard!")
          } catch (err) {
            console.error("Copy failed:", err)
            alert("Copy failed. Please try the download option instead.")
          }
        }
      })
    } catch (error) {
      console.error("Copy to clipboard failed:", error)
    }
  }

  // Reset all settings
  const resetSettings = () => {
    setBillAmount(25.75)
    setBillAmountInput("25.75")
    setSelectedTip(20)
    setCustomTip("")
    setTheme("ipad-pos")
    setShowCustomTipInput(false)
    setDarkPatterns({
      hideSkip: false,
      defaultHighest: true,
      guiltyText: false,
      smallSkip: false,
      watchingEyes: false,
      tipFirst: true,
    })
  }

  // Handle custom tip selection
  const handleCustomTipSelect = () => {
    setSelectedTip(null)
    setShowCustomTipInput(true)
  }

  // Handle custom tip input change
  const handleCustomTipChange = (value: string) => {
    setCustomTip(value)
    setSelectedTip(null)
  }

  // Handle continue button click
  const handleContinue = () => {
    const tipAmount = getCurrentTipAmount()
    const total = calculateTotal()

    alert(
      `🎭 This is a FAKE tip screen!\n\n` +
        `Bill: $${billAmount.toFixed(2)}\n` +
        `Tip: $${tipAmount.toFixed(2)} (${selectedTip ? `${selectedTip}%` : "Custom"})\n` +
        `Total: $${total.toFixed(2)}\n\n` +
        `This tool is for educational and satirical purposes only!`
    )
  }

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

    if (amount < 0) {
      setBillAmount(0)
    } else if (amount > 9999.99) {
      setBillAmount(9999.99)
      setBillAmountInput("9999.99")
    } else {
      setBillAmount(amount)
    }
  }

  // Render different tip screen themes
  const renderTipScreen = () => {
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <li>
            <a
              href="/"
              className="flex items-center hover:text-slate-900 dark:hover:text-slate-200"
            >
              <Home className="h-4 w-4" />
              <span className="ml-1">Home</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="hover:text-slate-900 dark:hover:text-slate-200">
              Tools
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-900 dark:text-slate-100">Tip Screen Generator</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <DollarSign className="mr-2 h-4 w-4" />
            Free Online Tool
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-slate-300">
            Tip Screen Generator
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Create realistic tip screens for iPhone, iPad, and Android devices. Generate satirical
            POS interfaces, viral memes, and educational content about tipping culture. No app
            download required - works in any browser.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 backdrop-blur-sm dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  For entertainment and educational purposes only
                </p>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-slate-800/50">
              <p className="mb-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                Share this tool:
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Settings Panel */}
          <div className={`space-y-6 lg:col-span-4 ${!showSettings && "lg:col-span-2"}`}>
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Settings</h2>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {showSettings && (
                <div className="space-y-6 p-6">
                  {/* Bill Amount */}
                  <div>
                    <label
                      htmlFor="bill-amount"
                      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Bill Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="bill-amount"
                        type="number"
                        value={billAmountInput}
                        onChange={(e) => handleBillAmountChange(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm text-black focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                        step="0.01"
                        min="0"
                        placeholder="25.75"
                      />
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div>
                    <div className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Interface Theme
                    </div>
                    <div className="space-y-2">
                      {[
                        { value: "ipad-pos", label: "iPad POS", icon: Tablet },
                        { value: "uber-eats", label: "Food Delivery", icon: Smartphone },
                        { value: "dark-pattern", label: "Dark Pattern", icon: Monitor },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setTheme(value as TipTheme)}
                          className={`flex w-full items-center space-x-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                            theme === value
                              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
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
                    <div className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Dark Pattern Elements
                    </div>
                    <div className="space-y-3">
                      {[
                        { key: "defaultHighest", label: "Auto-select highest tip", icon: "🎯" },
                        { key: "hideSkip", label: "Hide 'No Tip' option", icon: "🙈" },
                        { key: "guiltyText", label: "Guilt-inducing messages", icon: "😢" },
                        { key: "smallSkip", label: "Tiny skip button", icon: "🔍" },
                        { key: "watchingEyes", label: "Employee watching", icon: "👀" },
                        { key: "tipFirst", label: "Show tip amount first", icon: "💰" },
                      ].map(({ key, label, icon }) => (
                        <label key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={darkPatterns[key as keyof typeof darkPatterns]}
                            onChange={(e) =>
                              setDarkPatterns((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {icon} {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={takeScreenshot}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Screenshot</span>
                    </button>

                    <button
                      onClick={copyToClipboard}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy to Clipboard</span>
                    </button>

                    <button
                      onClick={resetSettings}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tip Screen Preview */}
          <div className={`${showSettings ? "lg:col-span-8" : "lg:col-span-10"}`}>
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Tip Screen Preview
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-slate-400" />
                    <span className="text-sm capitalize text-slate-500">
                      {theme.replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-center">
                  <div ref={tipScreenRef} className="mx-auto w-full max-w-md">
                    <div className="transform-gpu transition-all duration-300 hover:scale-[1.02]">
                      {renderTipScreen()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                Satirical Design
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Expose manipulative UX patterns with humor and create viral content for social
                media.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                Educational Tool
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Perfect for UX designers, educators, and anyone interested in dark pattern
                awareness.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                Social Sharing
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Generate shareable screenshots and memes to spark conversations about tipping
                culture.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* Mobile Optimization Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 dark:from-slate-800 dark:to-slate-700">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              Create Tip Screens for iPhone, iPad & Android
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                  📱 iPhone Tip Screens
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Generate realistic iPhone POS tip screens with iOS-style interface. Perfect for
                  creating viral TikTok and Instagram content.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                  📟 iPad POS Systems
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Create professional-looking iPad point-of-sale tip screens commonly seen in
                  restaurants and cafes.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                  🤖 Android Interfaces
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Design Android-style tip screens with material design elements for delivery apps
                  and mobile payments.
                </p>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              How to Create Tip Screen Images and Memes
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Set Your Bill Amount
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Enter any bill amount to see how manipulative tip calculations work in real
                      POS systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Choose Interface Theme
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Select from iPad POS, food delivery, or extreme dark pattern interfaces.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Enable Dark Patterns
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Toggle manipulative design elements to show how businesses guilt customers
                      into higher tips.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Screenshot & Share
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Download or copy your fake tip screen to share on social media and educate
                      others.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-50 p-8 dark:bg-slate-800">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Is this a free tip screen generator app?
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Yes! This is completely free and doesn't require any app download. It works
                  directly in your browser on iPhone, iPad, Android, and desktop devices. Create
                  unlimited tip screen images and memes without any restrictions.
                </p>
              </div>
              <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Can I create tip screen images for iPhone and Android?
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Absolutely! Our generator creates realistic tip screens that mimic iPhone, iPad,
                  and Android interfaces. Perfect for creating viral content, memes, or educational
                  materials about tipping culture.
                </p>
              </div>
              <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Is this tool meant to be used for real transactions?
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  No, this is purely a satirical and educational tool. The generated screens are
                  fake and should only be used for entertainment, social commentary, or educational
                  purposes about dark UX patterns.
                </p>
              </div>
              <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  What are dark patterns in tip screens?
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Dark patterns are design techniques that manipulate users into making decisions
                  they wouldn't normally make. In tip screens, this includes auto-selecting high
                  percentages, hiding "no tip" options, using guilt-inducing language, and making it
                  difficult to skip tipping.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Can I share my generated tip screens?
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Yes! The tool includes screenshot and sharing functionality. Generated images are
                  perfect for social media posts, memes, or educational content about tipping
                  culture and UX design ethics.
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
}) => {
  return (
    <div className="aspect-[3/4] w-full rounded-2xl bg-slate-100 p-6 shadow-xl dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Add Tip</h3>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            👀 Your server is watching...
          </p>
        )}
      </div>

      {/* Bill Amount */}
      <div className="mb-6 rounded-lg bg-white p-4 dark:bg-slate-800">
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            ${billAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tip Options */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {tipOptions.map((option) => (
          <button
            key={option.percentage}
            onClick={() => setSelectedTip(option.percentage)}
            className={`rounded-lg border-2 p-4 text-center transition-colors ${
              selectedTip === option.percentage
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
            }`}
          >
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {darkPatterns.tipFirst ? `$${option.amount.toFixed(2)}` : `${option.percentage}%`}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {darkPatterns.tipFirst ? `${option.percentage}%` : `$${option.amount.toFixed(2)}`}
            </div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {option.label}
            </div>
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
        <div className="flex justify-between text-lg font-bold">
          <span className="text-green-800 dark:text-green-200">Total:</span>
          <span className="text-green-800 dark:text-green-200">${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
          <span>Tip:</span>
          <span>${getCurrentTipAmount().toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleContinue}
          className="w-full rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700"
        >
          Continue
        </button>

        {!darkPatterns.hideSkip && (
          <button
            className={`w-full rounded-lg border py-2 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 ${
              darkPatterns.smallSkip ? "py-1 text-xs" : "py-2"
            }`}
          >
            {darkPatterns.guiltyText ? "Skip (Your server will be sad 😢)" : "No Tip"}
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
}) => {
  return (
    <div className="aspect-[9/16] w-full rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Add tip</h3>
        <p className="text-slate-600 dark:text-slate-400">Help support your delivery partner</p>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            👀 Driver can see your tip amount
          </p>
        )}
      </div>

      {/* Tip Options */}
      <div className="mb-6 space-y-3">
        {tipOptions.map((option) => (
          <button
            key={option.percentage}
            onClick={() => setSelectedTip(option.percentage)}
            className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
              selectedTip === option.percentage
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {darkPatterns.tipFirst ? `$${option.amount.toFixed(2)}` : `${option.percentage}%`}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {option.label} service
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {darkPatterns.tipFirst ? `${option.percentage}%` : `$${option.amount.toFixed(2)}`}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Tip */}
      <div className="mb-6">
        {!showCustomTipInput ? (
          <button
            onClick={handleCustomTipSelect}
            className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-left hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="font-medium text-slate-800 dark:text-slate-200">Custom amount</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Enter your own tip</div>
          </button>
        ) : (
          <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="mb-2 font-medium text-slate-800 dark:text-slate-200">
              Custom tip amount
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => handleCustomTipChange && handleCustomTipChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <button
                onClick={() => setShowCustomTipInput && setShowCustomTipInput(false)}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Total Summary */}
      <div className="mb-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
            <span className="text-slate-800 dark:text-slate-200">${billAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Tip</span>
            <span className="text-slate-800 dark:text-slate-200">
              ${getCurrentTipAmount().toFixed(2)}
            </span>
          </div>
          <div className="border-t border-slate-200 pt-2 dark:border-slate-600">
            <div className="flex justify-between font-bold">
              <span className="text-slate-800 dark:text-slate-200">Total</span>
              <span className="text-slate-800 dark:text-slate-200">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleContinue}
          className="w-full rounded-xl bg-black py-4 font-medium text-white transition-colors hover:bg-gray-800"
        >
          Continue
        </button>

        {!darkPatterns.hideSkip && (
          <button
            className={`w-full text-center text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 ${
              darkPatterns.smallSkip ? "text-xs" : "text-sm"
            }`}
          >
            {darkPatterns.guiltyText
              ? "Continue without tipping (Driver won't be happy)"
              : "Continue without tip"}
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
}) => {
  return (
    <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-orange-50 p-6 shadow-xl dark:border-red-800 dark:from-red-900/20 dark:to-orange-900/20">
      {/* Manipulative Header */}
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-red-800 dark:text-red-200">🚨 TIP REQUIRED 🚨</h3>
        <p className="font-medium text-red-600 dark:text-red-400">
          Our hardworking staff depends on your generosity
        </p>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 animate-pulse text-sm text-red-700 dark:text-red-300">
            👀👀👀 Everyone is watching your choice 👀👀👀
          </p>
        )}
      </div>

      {/* Exaggerated Tip Options */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        {[
          { percentage: 25, label: "Minimum Decent", color: "bg-yellow-200 border-yellow-400" },
          { percentage: 30, label: "Fair", color: "bg-orange-200 border-orange-400" },
          { percentage: 40, label: "Good Person", color: "bg-green-200 border-green-400" },
          { percentage: 50, label: "HERO! ⭐", color: "bg-purple-200 border-purple-400" },
        ].map((option) => (
          <button
            key={option.percentage}
            onClick={() => setSelectedTip(option.percentage)}
            className={`rounded-lg border-2 p-3 text-center transition-colors ${
              selectedTip === option.percentage
                ? "border-red-500 bg-red-100 dark:bg-red-900/30"
                : `${option.color} hover:opacity-80`
            }`}
          >
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {darkPatterns.tipFirst
                ? `$${(billAmount * (option.percentage / 100)).toFixed(2)}`
                : `${option.percentage}%`}
            </div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {option.label}
            </div>
          </button>
        ))}
      </div>

      {/* Guilt Trip Section */}
      <div className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 dark:border-red-700 dark:bg-red-900/30">
        <p className="text-center text-sm font-medium text-red-800 dark:text-red-200">
          💔 Low tips hurt our team's ability to pay rent 💔
        </p>
      </div>

      {/* Total with Emphasis */}
      <div className="mb-4 rounded-lg border-2 border-green-400 bg-green-100 p-4 dark:border-green-600 dark:bg-green-900/30">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            ${calculateTotal().toFixed(2)}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Thank you for being generous! 🙏
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleContinue}
          className="w-full rounded-lg bg-green-600 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-green-700"
        >
          YES, I'LL TIP! ✨
        </button>

        {!darkPatterns.hideSkip && (
          <button
            className={`w-full text-center transition-all hover:opacity-80 ${
              darkPatterns.smallSkip
                ? "py-1 text-[8px] text-gray-400 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-500"
                : "py-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {darkPatterns.guiltyText ? "I don't care about workers 😢" : "Skip"}
          </button>
        )}
      </div>

      {/* Fake Social Pressure */}
      <div className="mt-4 space-y-2 text-center">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          💡 99% of customers tip at least 30%
        </p>
        {darkPatterns.watchingEyes && (
          <div className="animate-pulse text-[10px] text-red-600 dark:text-red-400">
            ⚠️ Low tips are publicly displayed on social media
          </div>
        )}
        {darkPatterns.guiltyText && (
          <div className="text-[10px] text-orange-600 dark:text-orange-400">
            💸 Your tip directly affects our rent payments
          </div>
        )}
      </div>
    </div>
  )
}

export default TipScreenGenerator
