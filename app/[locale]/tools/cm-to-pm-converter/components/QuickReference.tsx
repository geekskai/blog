"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { BookOpen, TrendingUp, Zap, Calculator } from "lucide-react"
import { getCommonConversions, formatNumber, toScientificNotation } from "../utils/converter"

export default function QuickReference() {
  const t = useTranslations("CmToPmConverter")
  const commonConversions = getCommonConversions()

  const scientificConstants = [
    {
      name: t("quick_reference.scientific_constants.hydrogen_atom.name"),
      cm: 5.3e-9,
      pm: 53,
      description: t("quick_reference.scientific_constants.hydrogen_atom.description"),
    },
    {
      name: t("quick_reference.scientific_constants.carbon_bond.name"),
      cm: 1.54e-8,
      pm: 154,
      description: t("quick_reference.scientific_constants.carbon_bond.description"),
    },
    {
      name: t("quick_reference.scientific_constants.dna_helix.name"),
      cm: 2e-7,
      pm: 2000,
      description: t("quick_reference.scientific_constants.dna_helix.description"),
    },
    {
      name: t("quick_reference.scientific_constants.xray_wavelength.name"),
      cm: 1e-8,
      pm: 100,
      description: t("quick_reference.scientific_constants.xray_wavelength.description"),
    },
  ]

  const conversionTips = [
    {
      title: t("quick_reference.conversion_tips.scientific_notation.title"),
      tip: t("quick_reference.conversion_tips.scientific_notation.tip"),
      example: t("quick_reference.conversion_tips.scientific_notation.example"),
    },
    {
      title: t("quick_reference.conversion_tips.precision_selection.title"),
      tip: t("quick_reference.conversion_tips.precision_selection.tip"),
      example: t("quick_reference.conversion_tips.precision_selection.example"),
    },
    {
      title: t("quick_reference.conversion_tips.scale_context.title"),
      tip: t("quick_reference.conversion_tips.scale_context.tip"),
      example: t("quick_reference.conversion_tips.scale_context.example"),
    },
    {
      title: t("quick_reference.conversion_tips.input_formats.title"),
      tip: t("quick_reference.conversion_tips.input_formats.tip"),
      example: t("quick_reference.conversion_tips.input_formats.example"),
    },
  ]

  return (
    <div className="space-y-6">
      {/* 快速转换表 */}
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
                {t("quick_reference.reference_table.title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("quick_reference.reference_table.description")}</p>
          </div>

          {/* 转换表格 */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-sm font-medium text-emerald-400">
                  {t("quick_reference.reference_table.headers.centimeters")}
                </div>
                <div className="text-xs text-slate-400">cm</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-teal-400">
                  {t("quick_reference.reference_table.headers.picometers")}
                </div>
                <div className="text-xs text-slate-400">pm</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-cyan-400">
                  {t("quick_reference.reference_table.headers.scientific")}
                </div>
                <div className="text-xs text-slate-400">
                  {t("quick_reference.reference_table.headers.notation")}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {commonConversions.map(({ cm, pm, description }, index) => (
                <div
                  key={cm}
                  className="group grid grid-cols-3 gap-4 rounded-lg bg-slate-800/20 p-3 transition-all duration-300 hover:bg-slate-700/30"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="text-center">
                    <span className="text-lg font-semibold text-white">{cm}</span>
                    <span className="ml-1 text-sm text-slate-400">cm</span>
                    <div className="mt-1 text-xs text-slate-500">{description}</div>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-white">
                      {formatNumber(pm, pm >= 1e6 ? 0 : 2)}
                    </span>
                    <span className="ml-1 text-sm text-slate-400">pm</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-sm text-slate-300">
                      {toScientificNotation(pm)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 科学常数参考 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-indigo-900/20 to-purple-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-3 backdrop-blur-sm">
              <Calculator className="h-5 w-5 text-blue-400" />
              <h3 className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-xl font-bold text-transparent">
                {t("quick_reference.scientific_constants.title")}
              </h3>
            </div>
            <p className="text-slate-300">
              {t("quick_reference.scientific_constants.description")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {scientificConstants.map((constant, index) => (
              <div
                key={constant.name}
                className="group rounded-2xl bg-slate-800/30 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-white">{constant.name}</h4>
                  <p className="text-xs text-slate-400">{constant.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Centimeters:</span>
                    <span className="font-mono text-sm text-blue-300">
                      {constant.cm.toExponential(2)} cm
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Picometers:</span>
                    <span className="font-mono text-sm text-indigo-300">{constant.pm} pm</span>
                  </div>
                </div>

                {/* 可视化条 */}
                <div className="mt-3">
                  <div className="h-1 rounded-full bg-slate-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, Math.max(10, (constant.pm / 2000) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 使用技巧 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/25 via-pink-900/20 to-rose-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-pink-500/15 to-rose-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-3 backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h3 className="bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-xl font-bold text-transparent">
                {t("quick_reference.conversion_tips.title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("quick_reference.conversion_tips.description")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {conversionTips.map((tip, index) => (
              <div
                key={tip.title}
                className="group rounded-2xl bg-slate-800/30 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-3 flex items-start gap-3">
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{tip.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">{tip.tip}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-700/30 p-3">
                  <div className="mb-1 text-xs text-purple-400">Example:</div>
                  <div className="font-mono text-xs text-slate-300">{tip.example}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 重要提醒 */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
              <div>
                <h4 className="font-semibold text-purple-300">
                  {t("quick_reference.remember_tip.title")}
                </h4>
                <p className="text-sm text-slate-300">
                  {t("quick_reference.remember_tip.content")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
