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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">Home</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="hover:text-slate-200">
              Tools
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">Tip Screen Generator</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <DollarSign className="mr-2 h-4 w-4" />
            Free Tip Screen Tool
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
            Tip Screen Guide & Generator
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Understanding tip screens: Learn how digital tip screens work, their psychological
            impact, and create realistic tip screen examples for iPhone, iPad, and Android devices.
            Free tip screen generator for educational and satirical purposes.
          </p>

          {/* Share Button */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
              <p className="mb-3 text-center text-sm font-medium text-slate-300">
                Share this tip screen resource:
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Settings Panel */}
          <div className={`space-y-6 lg:col-span-4 ${!showSettings && "lg:col-span-2"}`}>
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Tip Screen Settings</h2>
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
                  {/* Bill Amount */}
                  <div>
                    <label
                      htmlFor="bill-amount"
                      className="mb-2 block text-sm font-medium text-slate-300"
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
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 py-3 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                        step="0.01"
                        min="0"
                        placeholder="25.75"
                      />
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div>
                    <div className="mb-3 block text-sm font-medium text-slate-300">
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
                            className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-300">
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
                      className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-600"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy to Clipboard</span>
                    </button>

                    <button
                      onClick={resetSettings}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-600"
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
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Live Tip Screen Preview</h2>
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
              <h3 className="mb-2 text-lg font-semibold text-white">Satirical Design</h3>
              <p className="text-slate-400">
                Expose manipulative UX patterns with humor and create viral content for social
                media.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Educational Tool</h3>
              <p className="text-slate-400">
                Perfect for UX designers, educators, and anyone interested in dark pattern
                awareness.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Social Sharing</h3>
              <p className="text-slate-400">
                Generate shareable screenshots and memes to spark conversations about tipping
                culture.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Tip Screen Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              What is a Tip Screen? Understanding Digital Tipping
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  A tip screen is a digital interface that appears during payment transactions,
                  prompting customers to add a gratuity. These tip screens have become ubiquitous in
                  modern commerce, appearing on tablets, smartphones, and point-of-sale (POS)
                  systems across restaurants, coffee shops, delivery services, and retail
                  establishments.
                </p>
                <p className="text-slate-200">
                  The evolution of tip screens reflects the digitization of payments and changing
                  social expectations around tipping culture. What started as simple percentage
                  options has evolved into sophisticated interfaces that leverage psychological
                  principles to influence customer behavior.
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Common Tip Screen Features
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• Percentage-based tip options (15%, 18%, 20%, 25%)</li>
                  <li>• Custom tip amount input</li>
                  <li>• "No tip" or "Skip" option (sometimes hidden)</li>
                  <li>• Pre-calculated total amounts</li>
                  <li>• Visual design elements to influence choice</li>
                  <li>• Social pressure messaging</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tip Screen Psychology Section */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              The Psychology Behind Tip Screens
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🧠 Cognitive Bias</h3>
                <p className="text-slate-200">
                  Tip screens exploit cognitive biases like anchoring (high default percentages),
                  social proof (suggested amounts), and loss aversion (framing no tip as
                  "skipping").
                </p>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">👥 Social Pressure</h3>
                <p className="text-slate-200">
                  Digital tip screens create artificial social pressure through public displays,
                  employee visibility, and guilt-inducing language that makes customers feel
                  obligated to tip.
                </p>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🎯 Default Effects</h3>
                <p className="text-slate-200">
                  Pre-selected high tip percentages and prominent placement of higher amounts
                  leverage the default effect, where people tend to stick with suggested options.
                </p>
              </div>
            </div>
          </section>

          {/* Mobile Optimization Section */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Tip Screens Across Different Devices
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">📱 iPhone Tip Screens</h3>
                <p className="text-slate-400">
                  iPhone tip screens feature iOS-style design elements with smooth animations and
                  Apple Pay integration. Common in mobile payment apps and delivery services like
                  UberEats and DoorDash.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">📟 iPad POS Tip Screens</h3>
                <p className="text-slate-400">
                  iPad tip screens dominate restaurant and retail environments. These larger
                  displays allow for more elaborate designs and clear visibility to both customers
                  and staff.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🤖 Android Tip Screens</h3>
                <p className="text-slate-400">
                  Android tip screens incorporate Material Design principles and are prevalent in
                  various payment terminals and mobile applications across different Android
                  devices.
                </p>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">
              How to Create Tip Screen Images and Memes
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-900 text-sm font-medium text-orange-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Set Your Bill Amount</h3>
                    <p className="text-slate-400">
                      Enter any bill amount to see how manipulative tip calculations work in real
                      POS systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-900 text-sm font-medium text-orange-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Choose Interface Theme</h3>
                    <p className="text-slate-400">
                      Select from iPad POS, food delivery, or extreme dark pattern interfaces.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-900 text-sm font-medium text-orange-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Enable Dark Patterns</h3>
                    <p className="text-slate-400">
                      Toggle manipulative design elements to show how businesses guilt customers
                      into higher tips.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-900 text-sm font-medium text-orange-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Screenshot & Share</h3>
                    <p className="text-slate-400">
                      Download or copy your fake tip screen to share on social media and educate
                      others.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Frequently Asked Questions About Tip Screens
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What is a tip screen and how does it work?
                </h3>
                <p className="text-slate-400">
                  A tip screen is a digital interface that appears during payment transactions,
                  typically on tablets or smartphones. It prompts customers to add a gratuity by
                  presenting percentage options (usually 15%, 18%, 20%, 25% or higher) or allowing
                  custom amounts. The tip screen calculates the total automatically and processes
                  the payment including the tip.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Why are tip screens everywhere now?
                </h3>
                <p className="text-slate-400">
                  Tip screens have proliferated due to the shift to digital payments, especially
                  accelerated by the COVID-19 pandemic. They're easier to implement than traditional
                  tip jars, automatically calculate amounts, and can increase tip amounts through
                  psychological design elements. Many businesses adopted them to help staff
                  compensation during economic uncertainty.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is this tip screen generator free to use?
                </h3>
                <p className="text-slate-400">
                  Yes! This tip screen generator is completely free and doesn't require any app
                  download. It works directly in your browser on iPhone, iPad, Android, and desktop
                  devices. Create unlimited tip screen examples and educational content without any
                  restrictions.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What are dark patterns in tip screens?
                </h3>
                <p className="text-slate-400">
                  Dark patterns in tip screens are manipulative design techniques that pressure
                  customers into tipping more. These include auto-selecting high percentages, hiding
                  "no tip" options, using guilt-inducing language, making skip buttons tiny, and
                  displaying tips prominently to create social pressure. Our tool demonstrates these
                  patterns for educational purposes.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How do tip screens affect tipping behavior?
                </h3>
                <p className="text-slate-400">
                  Studies show tip screens generally increase both tip frequency and amounts. The
                  suggested percentages often anchor customers to higher amounts than they might
                  leave otherwise. The public nature of the interaction and preset options also
                  reduce the cognitive effort required to calculate tips, making customers more
                  likely to tip.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I use generated tip screens for educational purposes?
                </h3>
                <p className="text-slate-400">
                  Absolutely! The generated tip screens are perfect for educational content about UX
                  design, consumer psychology, digital ethics, and tipping culture. They're ideal
                  for blog posts, social media content, academic presentations, or training
                  materials about dark patterns and user experience design.
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
    <div className="aspect-[3/4] w-full rounded-2xl bg-slate-900 p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-slate-200">Add Tip</h3>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 text-sm text-slate-400">👀 Your server is watching...</p>
        )}
      </div>

      {/* Bill Amount */}
      <div className="mb-6 rounded-lg bg-slate-800 p-4">
        <div className="flex justify-between">
          <span className="text-slate-400">Subtotal:</span>
          <span className="font-medium text-slate-200">${billAmount.toFixed(2)}</span>
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
                ? "border-blue-500 bg-blue-900/20"
                : "border-slate-600 bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <div className="text-lg font-bold text-slate-200">
              {darkPatterns.tipFirst ? `$${option.amount.toFixed(2)}` : `${option.percentage}%`}
            </div>
            <div className="text-sm text-slate-400">
              {darkPatterns.tipFirst ? `${option.percentage}%` : `$${option.amount.toFixed(2)}`}
            </div>
            <div className="text-xs font-medium text-blue-400">{option.label}</div>
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="mb-4 rounded-lg bg-green-900/20 p-4">
        <div className="flex justify-between text-lg font-bold">
          <span className="text-green-200">Total:</span>
          <span className="text-green-200">${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-green-400">
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
            className={`w-full rounded-lg border border-slate-600 py-2 text-slate-400 hover:bg-slate-700 ${
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
    <div className="aspect-[9/16] w-full rounded-3xl bg-slate-900 p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-slate-200">Add tip</h3>
        <p className="text-slate-400">Help support your delivery partner</p>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 text-sm text-red-400">👀 Driver can see your tip amount</p>
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
                ? "border-green-500 bg-green-900/20"
                : "border-slate-600 bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-slate-200">
                  {darkPatterns.tipFirst ? `$${option.amount.toFixed(2)}` : `${option.percentage}%`}
                </div>
                <div className="text-sm text-slate-400">{option.label} service</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">
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
            className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 p-4 text-left hover:bg-slate-700"
          >
            <div className="font-medium text-slate-200">Custom amount</div>
            <div className="text-sm text-slate-400">Enter your own tip</div>
          </button>
        ) : (
          <div className="rounded-xl border-2 border-blue-500 bg-blue-900/20 p-4">
            <div className="mb-2 font-medium text-slate-200">Custom tip amount</div>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => handleCustomTipChange && handleCustomTipChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pl-8 pr-4 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <button
                onClick={() => setShowCustomTipInput && setShowCustomTipInput(false)}
                className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-400 hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Total Summary */}
      <div className="mb-6 rounded-xl bg-slate-800 p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-slate-200">${billAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Tip</span>
            <span className="text-slate-200">${getCurrentTipAmount().toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-600 pt-2">
            <div className="flex justify-between font-bold">
              <span className="text-slate-200">Total</span>
              <span className="text-slate-200">${calculateTotal().toFixed(2)}</span>
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
            className={`w-full text-center text-slate-400 hover:text-slate-200 ${
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
    <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-800 bg-gradient-to-b from-red-900/20 to-orange-900/20 p-6 shadow-xl">
      {/* Manipulative Header */}
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-red-200">🚨 TIP REQUIRED 🚨</h3>
        <p className="font-medium text-red-400">Our hardworking staff depends on your generosity</p>
        {darkPatterns.watchingEyes && (
          <p className="mt-2 animate-pulse text-sm text-red-300">
            👀👀👀 Everyone is watching your choice 👀👀👀
          </p>
        )}
      </div>

      {/* Exaggerated Tip Options */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        {[
          { percentage: 25, label: "Minimum Decent", color: "bg-yellow-700 border-yellow-500" },
          { percentage: 30, label: "Fair", color: "bg-orange-700 border-orange-500" },
          { percentage: 40, label: "Good Person", color: "bg-green-700 border-green-500" },
          { percentage: 50, label: "HERO! ⭐", color: "bg-purple-700 border-purple-500" },
        ].map((option) => (
          <button
            key={option.percentage}
            onClick={() => setSelectedTip(option.percentage)}
            className={`rounded-lg border-2 p-3 text-center transition-colors ${
              selectedTip === option.percentage
                ? "border-red-500 bg-red-900/30"
                : `${option.color} hover:opacity-80`
            }`}
          >
            <div className="text-lg font-bold text-slate-200">
              {darkPatterns.tipFirst
                ? `$${(billAmount * (option.percentage / 100)).toFixed(2)}`
                : `${option.percentage}%`}
            </div>
            <div className="text-xs font-medium text-slate-300">{option.label}</div>
          </button>
        ))}
      </div>

      {/* Guilt Trip Section */}
      <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 p-3">
        <p className="text-center text-sm font-medium text-red-200">
          💔 Low tips hurt our team's ability to pay rent 💔
        </p>
      </div>

      {/* Total with Emphasis */}
      <div className="mb-4 rounded-lg border-2 border-green-600 bg-green-900/30 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-200">${calculateTotal().toFixed(2)}</div>
          <div className="text-sm text-green-400">Thank you for being generous! 🙏</div>
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
                ? "py-1 text-[8px] text-gray-600 hover:text-gray-500"
                : "py-2 text-xs text-gray-400 hover:text-gray-200"
            }`}
          >
            {darkPatterns.guiltyText ? "I don't care about workers 😢" : "Skip"}
          </button>
        )}
      </div>

      {/* Fake Social Pressure */}
      <div className="mt-4 space-y-2 text-center">
        <p className="text-xs text-gray-400">💡 99% of customers tip at least 30%</p>
        {darkPatterns.watchingEyes && (
          <div className="animate-pulse text-[10px] text-red-400">
            ⚠️ Low tips are publicly displayed on social media
          </div>
        )}
        {darkPatterns.guiltyText && (
          <div className="text-[10px] text-orange-400">
            💸 Your tip directly affects our rent payments
          </div>
        )}
      </div>
    </div>
  )
}

export default TipScreenGenerator
