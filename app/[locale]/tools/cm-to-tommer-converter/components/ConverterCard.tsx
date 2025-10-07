"use client"

import { useState, useCallback } from "react"
import { ArrowUpDown, Copy, Check, AlertCircle, Ruler } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ConversionUnit, PrecisionOption, CopyStatus } from "../types"
import { convert, formatNumber, getUnitSymbol, parseInputValue } from "../utils/converter"
import { copyToClipboard, formatCopyText } from "../utils/clipboard"

interface ConverterCardProps {
  className?: string
}

export default function ConverterCard({ className = "" }: ConverterCardProps) {
  const t = useTranslations("CmToTommerConverter.converter_card")

  // 状态管理
  const [inputValue, setInputValue] = useState<string>("1")
  const [inputUnit, setInputUnit] = useState<ConversionUnit>("cm")
  const [precision, setPrecision] = useState<PrecisionOption>(2)
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")

  // 计算输出值
  const outputUnit: ConversionUnit = inputUnit === "cm" ? "tommer" : "cm"
  const numericInput = parseInputValue(inputValue)
  const conversionResult = convert(numericInput, inputUnit, outputUnit, precision)

  // 处理单位切换
  const handleUnitSwap = useCallback(() => {
    setInputUnit((prev) => (prev === "cm" ? "tommer" : "cm"))
    // 保持数值，只切换单位
  }, [])

  // 处理复制功能
  const handleCopy = useCallback(async () => {
    setCopyStatus("copying")

    const copyText = formatCopyText(
      conversionResult.input,
      conversionResult.output,
      getUnitSymbol(inputUnit),
      getUnitSymbol(outputUnit)
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
          text: t("copying"),
          className: "bg-blue-500 hover:bg-blue-600",
        }
      case "copied":
        return {
          icon: <Check className="h-4 w-4" />,
          text: t("copied"),
          className: "bg-green-500 hover:bg-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: t("copy_failed"),
          className: "bg-red-500 hover:bg-red-600",
        }
      default:
        return {
          icon: <Copy className="h-4 w-4" />,
          text: t("copy_button"),
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
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl" />

      <div className="relative">
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
            <Ruler className="h-5 w-5 text-blue-400" />
            <h2 className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
              {t("title")}
            </h2>
          </div>
          <p className="text-slate-300">{t("description")}</p>
        </div>

        {/* 转换器主体 */}
        <div className="space-y-6">
          {/* 输入区域 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              {inputUnit === "cm" ? t("input_label_cm") : t("input_label_tommer")}
            </label>

            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t("placeholder")}
                className={`w-full rounded-2xl border py-4 pl-6 pr-20 text-lg backdrop-blur-sm transition-all duration-300 focus:outline-none ${
                  inputUnit === "cm"
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
            <label className="block text-sm font-medium text-slate-300">
              {outputUnit === "cm" ? t("result_label_cm") : t("result_label_tommer")}
            </label>

            <div className="relative">
              <div
                className={`w-full rounded-2xl border py-4 pl-6 pr-20 text-lg backdrop-blur-sm ${
                  outputUnit === "cm"
                    ? "border-blue-500/30 bg-blue-500/10"
                    : "border-purple-500/30 bg-purple-500/10"
                } text-white`}
              >
                <span className="text-2xl font-bold">
                  {formatNumber(conversionResult.output, precision)}
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
          </div>

          {/* 精度控制 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              {t("precision_label")}
            </label>

            <div className="flex gap-2">
              {[0, 1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setPrecision(p as PrecisionOption)}
                  className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-300 ${
                    precision === p
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  {t(`precision_${p}`)}
                </button>
              ))}
            </div>
          </div>

          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            disabled={copyStatus === "copying"}
            className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 ${copyButtonContent.className}`}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative flex items-center justify-center gap-2">
              {copyButtonContent.icon}
              <span>{copyButtonContent.text}</span>
            </div>
          </button>

          {/* 转换公式显示 */}
          <div className="rounded-xl bg-slate-800/50 p-4 text-center backdrop-blur-sm">
            <p className="text-sm text-slate-400">
              {t("formula_label")}{" "}
              <span className="font-mono text-slate-300">
                {inputUnit === "cm" ? t("formula_cm_to_tommer") : t("formula_tommer_to_cm")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
