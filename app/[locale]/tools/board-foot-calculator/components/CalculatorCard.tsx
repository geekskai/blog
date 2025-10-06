"use client"

import { useState, useCallback } from "react"
import { Calculator, Copy, Check, AlertCircle, ArrowUpDown, Ruler, DollarSign } from "lucide-react"
import type {
  LumberDimensions,
  BoardFootResult,
  LengthUnit,
  PrecisionOption,
  CopyStatus,
} from "../types"
import {
  calculateBoardFootResult,
  parseInputValue,
  formatNumber,
  formatCurrency,
  getUnitDisplayName,
  getUnitSymbol,
  getBoardFootFormula,
  validateLumberDimensions,
  getUnitSystem,
} from "../utils/calculator"
import { copyToClipboard, formatBoardFootResult } from "../utils/clipboard"

interface CalculatorCardProps {
  className?: string
  onCalculate?: (result: BoardFootResult) => void
}

export default function CalculatorCard({ className = "", onCalculate }: CalculatorCardProps) {
  // 状态管理
  const [dimensions, setDimensions] = useState<LumberDimensions>({
    length: 8,
    width: 4,
    thickness: 1,
    unit: "inches",
  })
  const [pricePerBoardFoot, setPricePerBoardFoot] = useState<string>("3.50")
  const [precision, setPrecision] = useState<PrecisionOption>(2)
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")

  // 计算结果
  const result = calculateBoardFootResult(dimensions, parseInputValue(pricePerBoardFoot), precision)

  // 验证输入
  const validation = validateLumberDimensions(dimensions)
  const unitSystem = getUnitSystem(dimensions.unit)

  // 处理尺寸输入变化
  const handleDimensionChange = useCallback(
    (field: keyof Omit<LumberDimensions, "unit">, value: string) => {
      const numericValue = parseInputValue(value)
      setDimensions((prev) => ({
        ...prev,
        [field]: numericValue,
      }))
    },
    []
  )

  // 处理单位切换
  const handleUnitChange = useCallback((newUnit: LengthUnit) => {
    setDimensions((prev) => ({
      ...prev,
      unit: newUnit,
    }))
  }, [])

  // 处理单位系统切换
  const handleUnitSystemToggle = useCallback(() => {
    const newUnit: LengthUnit =
      unitSystem === "imperial"
        ? dimensions.unit === "inches"
          ? "cm"
          : "meters"
        : dimensions.unit === "cm"
          ? "inches"
          : "feet"

    handleUnitChange(newUnit)
  }, [unitSystem, dimensions.unit, handleUnitChange])

  // 处理复制功能
  const handleCopy = useCallback(async () => {
    setCopyStatus("copying")

    const copyText = formatBoardFootResult(result)
    const success = await copyToClipboard(copyText)
    setCopyStatus(success ? "copied" : "error")

    // 2秒后重置状态
    setTimeout(() => setCopyStatus("idle"), 2000)

    // 调用回调
    if (onCalculate) {
      onCalculate(result)
    }
  }, [result, onCalculate])

  // 获取复制按钮的样式和图标
  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case "copying":
        return {
          icon: (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ),
          text: "Copying...",
          className: "bg-blue-500 hover:bg-blue-600",
        }
      case "copied":
        return {
          icon: <Check className="h-4 w-4" />,
          text: "Copied!",
          className: "bg-green-500 hover:bg-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Failed",
          className: "bg-red-500 hover:bg-red-600",
        }
      default:
        return {
          icon: <Copy className="h-4 w-4" />,
          text: "Copy Result",
          className:
            "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
        }
    }
  }

  const copyButtonContent = getCopyButtonContent()

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-900/25 via-orange-900/20 to-yellow-900/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* 装饰性背景元素 */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-amber-500/15 to-orange-500/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl" />
      <div className="absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-500/10 to-amber-500/10 blur-2xl" />

      <div className="relative">
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-3 backdrop-blur-sm">
            <Calculator className="h-5 w-5 text-amber-400" />
            <h2 className="bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-xl font-bold text-transparent">
              Board Foot Calculator
            </h2>
          </div>
          <p className="text-slate-300">Calculate lumber board feet and costs with precision</p>
        </div>

        {/* 计算器主体 */}
        <div className="space-y-6">
          {/* 单位系统切换 */}
          <div className="flex justify-center">
            <button
              onClick={handleUnitSystemToggle}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">
                  Switch to {unitSystem === "imperial" ? "Metric" : "Imperial"}
                </span>
              </div>
            </button>
          </div>

          {/* 尺寸输入区域 */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* 长度输入 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Length ({getUnitSymbol(dimensions.unit)})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dimensions.length}
                  onChange={(e) => handleDimensionChange("length", e.target.value)}
                  placeholder="Enter length..."
                  className="w-full rounded-2xl border border-amber-500/30 bg-amber-500/10 py-3 pl-4 pr-16 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-300 backdrop-blur-sm">
                  {getUnitSymbol(dimensions.unit)}
                </div>
              </div>
            </div>

            {/* 宽度输入 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Width ({getUnitSymbol(dimensions.unit)})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dimensions.width}
                  onChange={(e) => handleDimensionChange("width", e.target.value)}
                  placeholder="Enter width..."
                  className="w-full rounded-2xl border border-orange-500/30 bg-orange-500/10 py-3 pl-4 pr-16 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-300 backdrop-blur-sm">
                  {getUnitSymbol(dimensions.unit)}
                </div>
              </div>
            </div>

            {/* 厚度输入 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Thickness ({getUnitSymbol(dimensions.unit)})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dimensions.thickness}
                  onChange={(e) => handleDimensionChange("thickness", e.target.value)}
                  placeholder="Enter thickness..."
                  className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-3 pl-4 pr-16 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-red-500/20 px-2 py-1 text-xs font-medium text-red-300 backdrop-blur-sm">
                  {getUnitSymbol(dimensions.unit)}
                </div>
              </div>
            </div>
          </div>

          {/* 单位选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Unit System</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {(["inches", "feet", "cm", "meters"] as LengthUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => handleUnitChange(unit)}
                  className={`rounded-xl py-2 text-sm font-medium transition-all duration-300 ${
                    dimensions.unit === unit
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  {getUnitDisplayName(unit)}
                </button>
              ))}
            </div>
          </div>

          {/* 价格输入 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Price per Board Foot (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-400" />
              <input
                type="text"
                value={pricePerBoardFoot}
                onChange={(e) => setPricePerBoardFoot(e.target.value)}
                placeholder="3.50"
                className="w-full rounded-2xl border border-green-500/30 bg-green-500/10 py-3 pl-12 pr-4 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-green-400 focus:outline-none focus:ring-4 focus:ring-green-500/20"
              />
            </div>
          </div>

          {/* 精度控制 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Decimal Precision</label>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setPrecision(p as PrecisionOption)}
                  className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-300 ${
                    precision === p
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  {p} decimal{p !== 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* 结果显示 */}
          <div className="rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Calculation Results</h3>

            <div className="space-y-4">
              {/* 板英尺结果 */}
              <div className="flex items-center justify-between rounded-xl bg-slate-700/30 p-4">
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-amber-400" />
                  <span className="text-slate-300">Board Feet:</span>
                </div>
                <span className="text-2xl font-bold text-white">
                  {formatNumber(result.boardFeet, precision)}
                </span>
              </div>

              {/* 成本结果 */}
              {result.cost !== undefined && (
                <div className="flex items-center justify-between rounded-xl bg-slate-700/30 p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Total Cost:</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">
                    {formatCurrency(result.cost)}
                  </span>
                </div>
              )}

              {/* 公式显示 */}
              <div className="rounded-xl bg-slate-700/20 p-4 text-center">
                <p className="text-sm text-slate-400">
                  Formula:{" "}
                  <span className="font-mono text-slate-300">
                    {getBoardFootFormula(dimensions.unit)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 验证警告 */}
          {(!validation.isValid || validation.warnings.length > 0) && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4">
              {!validation.isValid && (
                <div className="mb-2">
                  <h4 className="mb-1 text-sm font-medium text-red-400">Errors:</h4>
                  <ul className="space-y-1 text-sm text-red-300">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {validation.warnings.length > 0 && (
                <div>
                  <h4 className="mb-1 text-sm font-medium text-yellow-400">Warnings:</h4>
                  <ul className="space-y-1 text-sm text-yellow-300">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

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
