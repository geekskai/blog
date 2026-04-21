"use client"

import { useState, useCallback, useEffect } from "react"
import { Copy, Check, AlertCircle, Monitor, Ruler, Info } from "lucide-react"
import type { PrecisionOption, CopyStatus } from "../types"
import {
  convert,
  formatNumber,
  parseInputValue,
  isValidInput,
  isValidPPI,
  DEFAULT_PPI,
} from "../utils/converter"
import { copyConversionResult } from "../utils/clipboard"
import { useTranslations } from "../hooks/useTranslations"

interface ConverterCardProps {
  className?: string
}

export default function ConverterCard({ className = "" }: ConverterCardProps) {
  const t = useTranslations()

  // 状态管理
  const [inches, setInches] = useState<string>("1")
  const [pixels, setPixels] = useState<string>("96")
  const [ppi, setPpi] = useState<string>("96")
  const [precision, setPrecision] = useState<PrecisionOption>(2)
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  const [activeField, setActiveField] = useState<"inches" | "pixels" | "ppi" | null>(null)

  // 解析输入值
  const inchesValue = parseInputValue(inches)
  const pixelsValue = parseInputValue(pixels)
  const ppiValue = parseInputValue(ppi)

  // 计算转换结果
  const conversionResult = convert(
    activeField === "inches" ? inchesValue : null,
    activeField === "pixels" ? pixelsValue : null,
    isValidPPI(ppiValue || 0) ? ppiValue || DEFAULT_PPI : DEFAULT_PPI,
    precision
  )

  // 当PPI改变时，重新计算
  useEffect(() => {
    if (activeField === "inches" && inchesValue !== null && isValidInput(inchesValue)) {
      const validPPI = isValidPPI(ppiValue || 0) ? ppiValue || DEFAULT_PPI : DEFAULT_PPI
      const calculatedPixels = inchesValue * validPPI
      setPixels(formatNumber(calculatedPixels, 0))
    } else if (activeField === "pixels" && pixelsValue !== null && isValidInput(pixelsValue)) {
      const validPPI = isValidPPI(ppiValue || 0) ? ppiValue || DEFAULT_PPI : DEFAULT_PPI
      const calculatedInches = pixelsValue / validPPI
      setInches(formatNumber(calculatedInches, precision))
    }
  }, [ppiValue, precision, activeField, inchesValue, pixelsValue])

  // 处理英寸输入
  const handleInchesChange = useCallback(
    (value: string) => {
      setInches(value)
      setActiveField("inches")
      const parsed = parseInputValue(value)
      if (parsed !== null && isValidInput(parsed)) {
        const validPPI = isValidPPI(ppiValue || 0) ? ppiValue || DEFAULT_PPI : DEFAULT_PPI
        const calculatedPixels = parsed * validPPI
        setPixels(formatNumber(calculatedPixels, 0))
      }
    },
    [ppiValue]
  )

  // 处理像素输入
  const handlePixelsChange = useCallback(
    (value: string) => {
      setPixels(value)
      setActiveField("pixels")
      const parsed = parseInputValue(value)
      if (parsed !== null && isValidInput(parsed)) {
        const validPPI = isValidPPI(ppiValue || 0) ? ppiValue || DEFAULT_PPI : DEFAULT_PPI
        const calculatedInches = parsed / validPPI
        setInches(formatNumber(calculatedInches, precision))
      }
    },
    [ppiValue, precision]
  )

  // 处理PPI输入
  const handlePpiChange = useCallback(
    (value: string) => {
      setPpi(value)
      setActiveField("ppi")
      const parsed = parseInputValue(value)
      if (parsed !== null && isValidPPI(parsed)) {
        // 如果英寸有值，重新计算像素
        if (inchesValue !== null && isValidInput(inchesValue)) {
          const calculatedPixels = inchesValue * parsed
          setPixels(formatNumber(calculatedPixels, 0))
        }
        // 如果像素有值，重新计算英寸
        else if (pixelsValue !== null && isValidInput(pixelsValue)) {
          const calculatedInches = pixelsValue / parsed
          setInches(formatNumber(calculatedInches, precision))
        }
      }
    },
    [inchesValue, pixelsValue, precision]
  )

  // 处理复制功能
  const handleCopy = useCallback(async () => {
    setCopyStatus("copying")
    const success = await copyConversionResult(conversionResult, "detailed")
    setCopyStatus(success ? "copied" : "error")
    setTimeout(() => setCopyStatus("idle"), 2000)
  }, [conversionResult])

  // 处理清除
  const handleClear = useCallback(() => {
    setInches("")
    setPixels("")
    setPpi("96")
    setActiveField(null)
  }, [])

  // 处理重新加载
  const handleReload = useCallback(() => {
    setInches("1")
    setPixels("96")
    setPpi("96")
    setActiveField(null)
  }, [])

  // 获取复制按钮的样式和图标
  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case "copying":
        return {
          icon: (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ),
          text: t("converter_card.copying"),
          className: "bg-blue-500 hover:bg-blue-600",
        }
      case "copied":
        return {
          icon: <Check className="h-4 w-4" />,
          text: t("converter_card.copied"),
          className: "bg-green-500 hover:bg-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: t("converter_card.failed"),
          className: "bg-red-500 hover:bg-red-600",
        }
      default:
        return {
          icon: <Copy className="h-4 w-4" />,
          text: t("converter_card.share_result"),
          className:
            "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600",
        }
    }
  }

  const copyButtonContent = getCopyButtonContent()

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/25 via-slate-800/20 to-slate-900/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      <div>
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 px-6 py-3 backdrop-blur-sm">
            <Monitor className="h-5 w-5 text-blue-300" />
            <h2 className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
              {t("converter_card.title")}
            </h2>
          </div>
          <p className="text-slate-300">{t("converter_card.description")}</p>
        </div>

        {/* 输入区域 */}
        <div className="space-y-6">
          {/* Inches 输入 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Ruler className="h-4 w-4 text-blue-400" />
              {t("converter_card.inches_label")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={inches}
                onChange={(e) => handleInchesChange(e.target.value)}
                onFocus={() => setActiveField("inches")}
                placeholder={t("converter_card.inches_placeholder")}
                className="w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 py-4 pl-6 pr-20 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
                {t("converter_card.inches_unit")}
              </div>
            </div>
          </div>

          {/* Pixels 输入 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Monitor className="h-4 w-4 text-emerald-400" />
              {t("converter_card.pixels_label")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={pixels}
                onChange={(e) => handlePixelsChange(e.target.value)}
                onFocus={() => setActiveField("pixels")}
                placeholder={t("converter_card.pixels_placeholder")}
                className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-4 pl-6 pr-20 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-300 backdrop-blur-sm">
                {t("converter_card.pixels_unit")}
              </div>
            </div>
          </div>

          {/* PPI 输入 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Info className="h-4 w-4 text-purple-400" />
              {t("converter_card.ppi_label")}
              <span className="ml-1 text-xs text-slate-400">({t("converter_card.ppi_info")})</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={ppi}
                onChange={(e) => handlePpiChange(e.target.value)}
                onFocus={() => setActiveField("ppi")}
                placeholder="96"
                className="w-full rounded-2xl border border-purple-500/30 bg-purple-500/10 py-4 pl-6 pr-20 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300 backdrop-blur-sm">
                PPI
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="rounded-xl bg-slate-800/50 p-4 backdrop-blur-sm">
            <p className="flex items-start gap-2 text-sm text-slate-400">
              <span className="text-lg">🤷</span>
              <span>{t("converter_card.info_text")}</span>
            </p>
          </div>

          {/* 精度控制 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              {t("converter_card.precision_label")}
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setPrecision(p as PrecisionOption)}
                  className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-300 ${
                    precision === p
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  {p} {t("converter_card.decimals")}
                </button>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* 分享结果按钮 */}
            <button
              onClick={handleCopy}
              disabled={copyStatus === "copying"}
              className={`group relative col-span-1 rounded-2xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-1 ${copyButtonContent.className}`}
            >
              <div className="relative flex items-center justify-center gap-2">
                {copyButtonContent.icon}
                <span className="hidden sm:inline">{copyButtonContent.text}</span>
              </div>
            </button>

            {/* 重新加载按钮 */}
            <button
              onClick={handleReload}
              className="group relative overflow-hidden rounded-2xl border border-slate-500/30 bg-gradient-to-br from-slate-700/15 to-slate-600/10 px-6 py-4 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-slate-400/50 hover:bg-slate-700/25 hover:text-white"
            >
              <span className="relative">{t("converter_card.reload_calculator")}</span>
            </button>

            {/* 清除按钮 */}
            <button
              onClick={handleClear}
              className="group relative overflow-hidden rounded-2xl border border-slate-500/30 bg-gradient-to-br from-slate-700/15 to-slate-600/10 px-6 py-4 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-slate-400/50 hover:bg-slate-700/25 hover:text-white"
            >
              <span className="relative">{t("converter_card.clear_all")}</span>
            </button>
          </div>

          {/* 转换公式显示 */}
          <div className="rounded-xl bg-slate-800/50 p-4 text-center backdrop-blur-sm">
            <p className="text-sm text-slate-400">
              {t("converter_card.formula_label")}:{" "}
              <span className="font-mono text-slate-300">
                {activeField === "inches" || (inchesValue !== null && inchesValue > 0)
                  ? `Inches × ${conversionResult.ppi} = Pixels`
                  : `Pixels ÷ ${conversionResult.ppi} = Inches`}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
