"use client"

import { useState, useCallback } from "react"
import { ArrowUpDown, Copy, Check, AlertCircle, Ruler, Calculator } from "lucide-react"
import type { ConversionUnit, PrecisionOption, CopyStatus, ConversionMode } from "../types"
import {
  convert,
  formatNumber,
  getUnitSymbol,
  parseInputValue,
  getConversionSteps,
} from "../utils/converter"
import { copyConversionResult } from "../utils/clipboard"

interface ConverterCardProps {
  className?: string
}

export default function ConverterCard({ className = "" }: ConverterCardProps) {
  // 状态管理
  const [inputValue, setInputValue] = useState<string>("1")
  const [inputUnit, setInputUnit] = useState<ConversionUnit>("cm")
  const [precision, setPrecision] = useState<PrecisionOption>(2)
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  const [mode, setMode] = useState<ConversionMode>("single")
  const [showSteps, setShowSteps] = useState<boolean>(false)

  // 计算输出值
  const outputUnit: ConversionUnit = inputUnit === "cm" ? "tommer" : "cm"
  const numericInput = parseInputValue(inputValue)
  const conversionResult = convert(numericInput, inputUnit, outputUnit, precision)

  // 获取转换步骤
  const conversionSteps = getConversionSteps(numericInput, inputUnit, outputUnit, precision)

  // 处理单位切换
  const handleUnitSwap = useCallback(() => {
    setInputUnit((prev) => (prev === "cm" ? "tommer" : "cm"))
    // 保持数值，只切换单位
  }, [])

  // 处理复制功能
  const handleCopy = useCallback(async () => {
    setCopyStatus("copying")

    const success = await copyConversionResult(conversionResult, "detailed")
    setCopyStatus(success ? "copied" : "error")

    // 2秒后重置状态
    setTimeout(() => setCopyStatus("idle"), 2000)
  }, [conversionResult])

  // 处理预设值
  const handlePresetValue = useCallback((value: number, unit: ConversionUnit) => {
    setInputValue(value.toString())
    setInputUnit(unit)
  }, [])

  // 获取复制按钮的样式和图标
  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case "copying":
        return {
          icon: (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ),
          text: "Kopierer...",
          className: "bg-blue-500 hover:bg-blue-600",
        }
      case "copied":
        return {
          icon: <Check className="h-4 w-4" />,
          text: "Kopieret!",
          className: "bg-green-500 hover:bg-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Fejl",
          className: "bg-red-500 hover:bg-red-600",
        }
      default:
        return {
          icon: <Copy className="h-4 w-4" />,
          text: "Kopier Resultat",
          className:
            "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
        }
    }
  }

  const copyButtonContent = getCopyButtonContent()

  // 获取主题颜色
  const getThemeColors = () => {
    return inputUnit === "cm"
      ? {
          primary: "blue-500",
          secondary: "cyan-500",
          gradient: "from-blue-500/15 to-cyan-500/10",
          border: "border-blue-500/30",
          bg: "bg-blue-500/10",
          focus: "focus:border-blue-400 focus:ring-blue-500/20",
          text: "text-blue-300",
        }
      : {
          primary: "emerald-500",
          secondary: "teal-500",
          gradient: "from-emerald-500/15 to-teal-500/10",
          border: "border-emerald-500/30",
          bg: "bg-emerald-500/10",
          focus: "focus:border-emerald-400 focus:ring-emerald-500/20",
          text: "text-emerald-300",
        }
  }

  const colors = getThemeColors()

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/25 via-slate-800/20 to-slate-900/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* 装饰性背景元素 */}
      <div
        className={`absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br ${colors.gradient} blur-3xl`}
      />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl" />
      <div className="absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-2xl" />

      <div className="relative">
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <div
            className={`mb-4 inline-flex items-center gap-3 rounded-full border ${colors.border} bg-gradient-to-r ${colors.gradient} px-6 py-3 backdrop-blur-sm`}
          >
            <Ruler className={`h-5 w-5 ${colors.text}`} />
            <h2
              className={`bg-gradient-to-r from-${colors.primary} via-${colors.secondary} to-${colors.primary} bg-clip-text text-xl font-bold text-transparent`}
            >
              CM til Tommer Konverter
            </h2>
          </div>
          <p className="text-slate-300">
            Konverter mellem centimeter og tommer (danske/norske tommer) øjeblikkeligt
          </p>
        </div>

        {/* 快速预设值 */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-slate-300">Hurtige Værdier</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 1, unit: "cm" as ConversionUnit, label: "1 cm" },
              { value: 2.54, unit: "cm" as ConversionUnit, label: "1 tommer" },
              { value: 10, unit: "cm" as ConversionUnit, label: "10 cm" },
              { value: 30, unit: "cm" as ConversionUnit, label: "30 cm" },
              { value: 12, unit: "tommer" as ConversionUnit, label: "1 fod" },
              { value: 24, unit: "tommer" as ConversionUnit, label: "2 fod" },
            ].map(({ value, unit, label }) => (
              <button
                key={`${value}-${unit}`}
                onClick={() => handlePresetValue(value, unit)}
                className="rounded-lg bg-slate-700/50 px-3 py-1 text-xs text-slate-300 transition-all duration-200 hover:bg-slate-600/50 hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 转换器主体 */}
        <div className="space-y-6">
          {/* 输入区域 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Indtast værdi i {inputUnit === "cm" ? "Centimeter" : "Tommer"}
            </label>

            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Indtast værdi..."
                className={`w-full rounded-2xl border py-4 pl-6 pr-20 text-lg backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 ${colors.border} ${colors.bg} ${colors.focus} text-white placeholder-slate-400`}
              />

              {/* 单位标签 */}
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-medium backdrop-blur-sm ${colors.bg} ${colors.text}`}
              >
                {getUnitSymbol(inputUnit)}
              </div>
            </div>
          </div>

          {/* 切换按钮 */}
          <div className="flex justify-center">
            <button
              onClick={handleUnitSwap}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-orange-500/25"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <ArrowUpDown className="relative h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </div>

          {/* 输出区域 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Resultat i {outputUnit === "cm" ? "Centimeter" : "Tommer"}
            </label>

            <div className="relative">
              <div
                className={`w-full rounded-2xl border py-4 pl-6 pr-20 text-lg backdrop-blur-sm ${
                  outputUnit === "cm"
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-blue-500/30 bg-blue-500/10"
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
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-blue-500/20 text-blue-300"
                }`}
              >
                {getUnitSymbol(outputUnit)}
              </div>
            </div>
          </div>

          {/* 精度控制 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Decimal Præcision</label>

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
                  {p} decimal{p !== 1 ? "er" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* 转换步骤显示 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300">Konverteringstrin</label>
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="flex items-center gap-2 rounded-lg bg-slate-700/50 px-3 py-1 text-xs text-slate-300 transition-all duration-200 hover:bg-slate-600/50"
              >
                <Calculator className="h-3 w-3" />
                {showSteps ? "Skjul" : "Vis"} Trin
              </button>
            </div>

            {showSteps && (
              <div className="rounded-xl bg-slate-800/50 p-4 backdrop-blur-sm">
                <div className="space-y-2">
                  {conversionSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-medium text-purple-300">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              Konverteringsformel:{" "}
              <span className="font-mono text-slate-300">
                {inputUnit === "cm" ? "1 cm = 0.3937 tommer" : "1 tommer = 2.54 cm"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
