"use client"

import React from "react"
import { BookOpen, TrendingUp, Zap } from "lucide-react"
import { getCommonConversions, formatNumber } from "../utils/converter"

export default function QuickReference() {
  const commonConversions = getCommonConversions()

  // 特殊的丹麦/挪威常用尺寸
  const nordicSizes = [
    { cm: 2.54, tommer: 1, label: "1 tommer standard" },
    { cm: 30.48, tommer: 12, label: "1 fod (12 tommer)" },
    { cm: 91.44, tommer: 36, label: "1 yard (3 fod)" },
    { cm: 60, tommer: 23.62, label: "Standard skabdybde" },
    { cm: 90, tommer: 35.43, label: "Standard bordbredde" },
    { cm: 200, tommer: 78.74, label: "Standard sengelængde" },
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-900/25 via-teal-900/20 to-cyan-900/25 p-8 shadow-2xl backdrop-blur-xl">
      {/* 装饰性背景元素 */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-cyan-500/15 blur-3xl" />

      <div className="relative">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <h3 className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
              Hurtig Reference
            </h3>
          </div>
          <p className="text-slate-300">
            Almindelige centimeter til tommer konverteringer til hurtig reference
          </p>
        </div>

        {/* 基础转换表格 */}
        <div className="mb-8 space-y-4">
          <h4 className="text-lg font-semibold text-emerald-300">Grundlæggende Konverteringer</h4>

          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-sm font-medium text-emerald-400">Centimeter</div>
              <div className="text-xs text-slate-400">cm</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-teal-400">Tommer</div>
              <div className="text-xs text-slate-400">inches</div>
            </div>
          </div>

          <div className="space-y-2">
            {commonConversions.slice(0, 8).map(({ cm, tommer }, index) => (
              <div
                key={cm}
                className="group grid grid-cols-2 gap-4 rounded-lg bg-slate-800/20 p-3 transition-all duration-300 hover:bg-slate-700/30"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="text-center">
                  <span className="text-lg font-semibold text-white">{cm}</span>
                  <span className="ml-1 text-sm text-slate-400">cm</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-semibold text-white">
                    {formatNumber(tommer, 2)}
                  </span>
                  <span className="ml-1 text-sm text-slate-400">tommer</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 北欧常用尺寸 */}
        <div className="mb-6 space-y-4">
          <h4 className="text-lg font-semibold text-teal-300">Nordiske Standardstørrelser</h4>

          <div className="space-y-2">
            {nordicSizes.map(({ cm, tommer, label }, index) => (
              <div
                key={label}
                className="group rounded-lg bg-gradient-to-r from-teal-800/20 to-cyan-800/20 p-4 transition-all duration-300 hover:from-teal-700/30 hover:to-cyan-700/30"
                style={{
                  animationDelay: `${index * 75}ms`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-teal-300">{label}</div>
                    <div className="text-xs text-slate-400">
                      Almindelig størrelse i Danmark/Norge
                    </div>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <div className="text-sm font-semibold text-white">{cm} cm</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {formatNumber(tommer, 2)} tommer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-emerald-300">Professionelt Tip</h4>
                <p className="text-sm text-slate-300">
                  Tommer er det danske og norske ord for "inch". 1 tommer er nøjagtigt lig med 2,54
                  centimeter, det samme som den internationale inch.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400" />
              <div>
                <h4 className="font-semibold text-cyan-300">Hurtig Huskeregel</h4>
                <p className="text-sm text-slate-300">
                  For hurtige estimater: 1 cm ≈ 0,4 tommer, eller 2,5 cm ≈ 1 tommer. Brug vores
                  konverter for præcise beregninger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
