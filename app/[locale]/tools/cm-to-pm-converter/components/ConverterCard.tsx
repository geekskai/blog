"use client"

import { useState, useCallback, useMemo } from "react"
import { useTranslations } from "next-intl"
import { ArrowUpDown, Copy, Check, AlertCircle, Microscope, Calculator, Zap } from "lucide-react"
import type { ConversionUnit, PrecisionOption, CopyStatus, DisplayFormat } from "../types"
import {
  convert,
  formatNumber,
  getUnitSymbol,
  parseInputValue,
  validateInput,
  getRecommendedPrecision,
  formatResultForCopy,
} from "../utils/converter"
import { copyToClipboard, formatCopyText } from "../utils/clipboard"
import { generateScaleComparison } from "../utils/scientific"

interface ConverterCardProps {
  className?: string
}

export default function ConverterCard({ className = "" }: ConverterCardProps) {
  const t = useTranslations("CmToPmConverter")

  // 状态管理
  const [inputValue, setInputValue] = useState<string>("1")
  const [inputUnit, setInputUnit] = useState<ConversionUnit>("cm")
  const [precision, setPrecision] = useState<PrecisionOption>(3)
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>("standard")
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")

  // 计算输出值和验证
  const outputUnit: ConversionUnit = inputUnit === "cm" ? "pm" : "cm"
  const numericInput = parseInputValue(inputValue)
  const validation = validateInput(numericInput)
  const conversionResult = convert(numericInput, inputUnit, outputUnit, precision)

  // 生成尺度比较
  const scaleComparison = useMemo(() => {
    if (inputUnit === "cm" && numericInput > 0) {
      return generateScaleComparison(numericInput, conversionResult.output)
    }
    return null
  }, [inputUnit, numericInput, conversionResult.output])

  // 处理单位切换
  const handleUnitSwap = useCallback(() => {
    setInputUnit((prev) => (prev === "cm" ? "pm" : "cm"))
    // 保持数值，只切换单位
  }, [])

  // 处理精度推荐
  const handleAutoPrecision = useCallback(() => {
    const recommended = getRecommendedPrecision(conversionResult.output)
    setPrecision(recommended)
  }, [conversionResult.output])

  // 处理复制功能
  const handleCopy = useCallback(async () => {
    setCopyStatus("copying")

    const copyText = formatCopyText(
      conversionResult.input,
      conversionResult.output,
      getUnitSymbol(inputUnit),
      getUnitSymbol(outputUnit),
      conversionResult.scientificNotation,
      conversionResult.formula
    )

    const success = await copyToClipboard(copyText)
    setCopyStatus(success ? "copied" : "error")

    // 2秒后重置状态
    setTimeout(() => setCopyStatus("idle"), 2000)
  }, [conversionResult, inputUnit, outputUnit])

  // 获取复制按钮的样式和图标
  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case "copying":
        return {
          icon: (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ),
          text: t("converter_card.copy_button.copying"),
          className: "bg-blue-500 hover:bg-blue-600",
        }
      case "copied":
        return {
          icon: <Check className="h-4 w-4" />,
          text: t("converter_card.copy_button.copied"),
          className: "bg-green-500 hover:bg-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: t("converter_card.copy_button.failed"),
          className: "bg-red-500 hover:bg-red-600",
        }
      default:
        return {
          icon: <Copy className="h-4 w-4" />,
          text: t("converter_card.copy_button.idle"),
          className:
            "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
        }
    }
  }

  const copyButtonContent = getCopyButtonContent()

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-purple-900/20 to-indigo-900/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* 装饰性背景元素 */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-2xl" />

      <div className="relative">
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
            <Microscope className="h-5 w-5 text-blue-400" />
            <h2 className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
              {t("converter_card.title")}
            </h2>
          </div>
          <p className="text-slate-300">{t("converter_card.description")}</p>
        </div>

        {/* 转换器主体 */}
        <div className="space-y-6">
          {/* 输入区域 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              {t("converter_card.input_label")}{" "}
              {inputUnit === "cm"
                ? t("converter_card.units.centimeters")
                : t("converter_card.units.picometers")}
            </label>

            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  inputUnit === "cm"
                    ? t("converter_card.placeholders.enter_cm")
                    : t("converter_card.placeholders.enter_pm")
                }
                className={`w-full rounded-2xl border py-4 pl-6 pr-20 text-lg backdrop-blur-sm transition-all duration-300 focus:outline-none ${
                  !validation.isValid
                    ? "border-red-500/50 bg-red-500/10 focus:border-red-400 focus:ring-4 focus:ring-red-500/20"
                    : inputUnit === "cm"
                      ? "border-blue-500/30 bg-blue-500/10 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                      : "border-purple-500/30 bg-purple-500/10 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20"
                } text-white placeholder-slate-400`}
              />

              {/* 单位标签 */}
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-medium backdrop-blur-sm ${
                  inputUnit === "cm"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-purple-500/20 text-purple-300"
                }`}
              >
                {getUnitSymbol(inputUnit)}
              </div>
            </div>

            {/* 验证错误显示 */}
            {!validation.isValid && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{validation.errors[0]}</span>
              </div>
            )}

            {/* 验证警告显示 */}
            {validation.isValid && validation.warnings.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                <span>{validation.warnings[0]}</span>
              </div>
            )}
          </div>

          {/* 切换按钮 */}
          <div className="flex justify-center">
            <button
              onClick={handleUnitSwap}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/25"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <ArrowUpDown className="relative h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </div>

          {/* 输出区域 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300">
                {t("converter_card.result_label")}{" "}
                {outputUnit === "cm"
                  ? t("converter_card.units.centimeters")
                  : t("converter_card.units.picometers")}
              </label>

              {/* 显示格式切换 */}
              <div className="flex gap-1 rounded-lg bg-slate-800/50 p-1">
                <button
                  onClick={() => setDisplayFormat("standard")}
                  className={`rounded px-3 py-1 text-xs transition-all ${
                    displayFormat === "standard"
                      ? "bg-blue-500 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t("converter_card.display_formats.standard")}
                </button>
                <button
                  onClick={() => setDisplayFormat("scientific")}
                  className={`rounded px-3 py-1 text-xs transition-all ${
                    displayFormat === "scientific"
                      ? "bg-blue-500 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t("converter_card.display_formats.scientific")}
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                className={`w-full rounded-2xl border py-4 pl-6 pr-20 text-lg backdrop-blur-sm ${
                  outputUnit === "cm"
                    ? "border-blue-500/30 bg-blue-500/10"
                    : "border-purple-500/30 bg-purple-500/10"
                } text-white`}
              >
                <span className="text-2xl font-bold">
                  {displayFormat === "scientific" || conversionResult.output >= 1e6
                    ? conversionResult.scientificNotation
                    : formatNumber(conversionResult.output, precision, displayFormat)}
                </span>
              </div>

              {/* 单位标签 */}
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-medium backdrop-blur-sm ${
                  outputUnit === "cm"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-purple-500/20 text-purple-300"
                }`}
              >
                {getUnitSymbol(outputUnit)}
              </div>
            </div>

            {/* 尺度比较 */}
            {scaleComparison && (
              <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-3 backdrop-blur-sm">
                <p className="text-sm text-cyan-300">
                  <span className="font-medium">{t("converter_card.scale_reference")}</span>{" "}
                  {scaleComparison}
                </p>
              </div>
            )}
          </div>

          {/* 精度控制 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300">
                {t("converter_card.precision_label")}
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAutoPrecision()
                }}
                className="relative z-10 flex items-center gap-1 rounded-lg bg-slate-700/50 px-3 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-600/50"
              >
                <Zap className="h-3 w-3" />
                {t("converter_card.auto_precision")}
              </button>
            </div>

            <div className="relative z-20 grid grid-cols-7 gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setPrecision(p as PrecisionOption)
                  }}
                  className={`relative z-10 cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    precision === p
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 转换公式显示 */}
          <div className="rounded-xl bg-slate-800/50 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Calculator className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-300">
                  {t("converter_card.formula_label")}
                </p>
                <p className="mt-1 font-mono text-sm text-slate-400">
                  {conversionResult.formula ||
                    (inputUnit === "cm" ? "1 cm = 1 × 10¹⁰ pm" : "1 pm = 1 × 10⁻¹⁰ cm")}
                </p>
              </div>
            </div>
          </div>

          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            disabled={copyStatus === "copying" || !validation.isValid}
            className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 ${copyButtonContent.className}`}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative flex items-center justify-center gap-2">
              {copyButtonContent.icon}
              <span>{copyButtonContent.text}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
