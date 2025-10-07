"use client"

import React from "react"
import { BookOpen, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { getCommonConversions, formatNumber } from "../utils/converter"

export default function QuickReference() {
  const t = useTranslations("CmToTommerConverter.quick_reference")
  const commonConversions = getCommonConversions()

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
              {t("title")}
            </h3>
          </div>
          <p className="text-slate-300">{t("description")}</p>
        </div>

        {/* 转换表格 */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-sm font-medium text-emerald-400">{t("centimeters_header")}</div>
              <div className="text-xs text-slate-400">{t("cm_unit")}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-teal-400">{t("tommer_header")}</div>
              <div className="text-xs text-slate-400">{t("tommer_unit")}</div>
            </div>
          </div>

          <div className="space-y-2">
            {commonConversions.map(({ cm, tommer }, index) => (
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

        {/* 提示信息 */}
        <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
            <div>
              <h4 className="font-semibold text-emerald-300">{t("pro_tip_title")}</h4>
              <p className="text-sm text-slate-300">{t("pro_tip_description")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
