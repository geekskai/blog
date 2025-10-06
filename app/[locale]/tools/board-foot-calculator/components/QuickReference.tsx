"use client"

import React from "react"
import { BookOpen, TrendingUp, Ruler, DollarSign } from "lucide-react"
import {
  getCommonDimensions,
  getCommonWoodSpecies,
  formatNumber,
  formatCurrency,
  calculateBoardFeet,
} from "../utils/calculator"

export default function QuickReference() {
  const commonDimensions = getCommonDimensions()
  const commonWoodSpecies = getCommonWoodSpecies()

  return (
    <div className="space-y-8">
      {/* 常用尺寸快速参考 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-900/25 via-teal-900/20 to-cyan-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-cyan-500/15 blur-3xl" />

        <div className="relative">
          {/* 标题 */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
              <Ruler className="h-5 w-5 text-emerald-400" />
              <h3 className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
                Common Lumber Dimensions
              </h3>
            </div>
            <p className="text-slate-300">
              Standard lumber sizes and their board foot calculations
            </p>
          </div>

          {/* 尺寸表格 */}
          <div className="space-y-4">
            {/* 表头 */}
            <div className="grid grid-cols-4 gap-4 rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-sm font-medium text-emerald-400">Nominal Size</div>
                <div className="text-xs text-slate-400">inches</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-teal-400">Actual Size</div>
                <div className="text-xs text-slate-400">inches</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-cyan-400">Board Feet</div>
                <div className="text-xs text-slate-400">per 8 ft</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-blue-400">Common Uses</div>
                <div className="text-xs text-slate-400">applications</div>
              </div>
            </div>

            {/* 尺寸行 */}
            <div className="space-y-2">
              {commonDimensions.map((dimension, index) => {
                const boardFeet = calculateBoardFeet(dimension.actual, 2)

                return (
                  <div
                    key={dimension.name}
                    className="group grid grid-cols-4 gap-4 rounded-lg bg-slate-800/20 p-3 transition-all duration-300 hover:bg-slate-700/30"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{dimension.name}</div>
                      <div className="text-xs text-slate-400">
                        {formatNumber(dimension.nominal.thickness, 0)}" ×{" "}
                        {formatNumber(dimension.nominal.width, 0)}"
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-300">
                        {formatNumber(dimension.actual.thickness, 2)}" ×{" "}
                        {formatNumber(dimension.actual.width, 2)}"
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-emerald-400">
                        {formatNumber(boardFeet, 2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">{dimension.commonUses[0]}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-emerald-300">Pro Tip</h4>
                <p className="text-sm text-slate-300">
                  Nominal sizes are the traditional lumber names, while actual sizes are the true
                  dimensions after planing and drying. Always use actual dimensions for board foot
                  calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 木材种类和价格参考 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-900/25 via-orange-900/20 to-red-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-amber-500/15 to-orange-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl" />

        <div className="relative">
          {/* 标题 */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-3 backdrop-blur-sm">
              <DollarSign className="h-5 w-5 text-amber-400" />
              <h3 className="bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-xl font-bold text-transparent">
                Wood Species & Pricing
              </h3>
            </div>
            <p className="text-slate-300">
              Common wood types and their typical price ranges per board foot
            </p>
          </div>

          {/* 木材种类网格 */}
          <div className="grid grid-cols-1 gap-6">
            {commonWoodSpecies.map((species, index) => (
              <div
                key={species.id}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{species.name}</h4>
                    <p className="text-sm text-slate-400">{species.commonName}</p>
                  </div>
                  <div
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${
                      species.hardness === "hardwood"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {species.hardness}
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Average Price:</span>
                    <span className="font-semibold text-amber-400">
                      {formatCurrency(species.averagePrice)}/bf
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Price Range:</span>
                    <span className="text-sm text-slate-300">
                      {formatCurrency(species.priceRange.min)} -{" "}
                      {formatCurrency(species.priceRange.max)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Density:</span>
                    <span className="text-sm text-slate-300">{species.density} lb/ft³</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-300">{species.description}</p>
                </div>

                <div>
                  <div className="mb-2 text-xs font-medium text-amber-400">Common Uses:</div>
                  <div className="flex flex-wrap gap-1">
                    {species.commonUses.slice(0, 3).map((use, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-700/50 px-2 py-1 text-xs text-slate-400"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 价格说明 */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 text-lg font-semibold text-white">Pricing Notes</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>
                    • Prices vary significantly by region, supplier, grade, and market conditions
                  </p>
                  <p>
                    • Hardwoods (oak, maple, walnut) are typically more expensive than softwoods
                    (pine, cedar)
                  </p>
                  <p>• Specialty woods and exotic species can cost $20-100+ per board foot</p>
                  <p>
                    • Always get current quotes from local suppliers for accurate project budgeting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 计算公式参考 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-indigo-900/20 to-purple-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />

        <div className="relative">
          {/* 标题 */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-3 backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <h3 className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-xl font-bold text-transparent">
                Board Foot Formula Reference
              </h3>
            </div>
            <p className="text-slate-300">
              Essential formulas and conversions for lumber calculations
            </p>
          </div>

          {/* 公式卡片 */}
          <div className="grid grid-cols-1 gap-6">
            {/* 基本公式 */}
            <div className="rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-lg font-semibold text-white">Basic Board Foot Formula</h4>
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-700/50 p-4 text-center font-mono">
                  <div className="text-lg text-blue-400">Board Feet = </div>
                  <div className="text-xl text-white">(Length × Width × Thickness) ÷ 144</div>
                  <div className="mt-2 text-sm text-slate-400">All dimensions in inches</div>
                </div>
                <p className="text-sm text-slate-300">
                  The standard formula where 144 represents the cubic inches in one board foot (12"
                  × 12" × 1").
                </p>
              </div>
            </div>

            {/* 单位转换 */}
            <div className="rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-lg font-semibold text-white">Unit Conversions</h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">1 foot =</span>
                    <span className="font-mono text-white">12 inches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">1 inch =</span>
                    <span className="font-mono text-white">2.54 cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">1 meter =</span>
                    <span className="font-mono text-white">39.37 inches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">1 cm =</span>
                    <span className="font-mono text-white">0.3937 inches</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 示例计算 */}
            <div className="rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-lg font-semibold text-white">Example Calculation</h4>
              <div className="space-y-3">
                <div className="text-sm text-slate-300">For a 2×4 that's 8 feet long:</div>
                <div className="rounded-lg bg-slate-700/50 p-3 font-mono text-sm">
                  <div className="text-slate-400">Length: 8 ft = 96 inches</div>
                  <div className="text-slate-400">Width: 4 inches (nominal)</div>
                  <div className="text-slate-400">Thickness: 2 inches (nominal)</div>
                  <div className="mt-2 text-blue-400">(96 × 4 × 2) ÷ 144 = 5.33 bf</div>
                </div>
              </div>
            </div>

            {/* 成本计算 */}
            <div className="rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-lg font-semibold text-white">Cost Calculation</h4>
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-700/50 p-3 font-mono text-sm">
                  <div className="text-green-400">Total Cost = </div>
                  <div className="text-white">Board Feet × Price per Board Foot</div>
                </div>
                <div className="text-sm text-slate-300">
                  Don't forget to add waste percentage (typically 5-15%) and applicable taxes for
                  accurate project budgeting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
