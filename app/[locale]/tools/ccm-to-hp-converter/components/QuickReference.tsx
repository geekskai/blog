"use client"

import React from "react"
import { BookOpen, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { getConversionExamples, getVehicleExamples } from "../utils/converter"

export default function QuickReference() {
  const t = useTranslations("CcmToHpConverter")
  const conversionExamples = getConversionExamples()
  const vehicleExamples = getVehicleExamples()

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-900/25 via-teal-900/20 to-cyan-900/25 p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-cyan-500/15 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <h3 className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
              {t("quick_reference.title")}
            </h3>
          </div>
          <p className="text-slate-300">{t("quick_reference.description")}</p>
        </div>

        <div className="space-y-8">
          {/* Conversion Examples */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-emerald-300">
              {t("quick_reference.common_conversions")}
            </h4>
            <div className="space-y-3">
              {conversionExamples.map((example, index) => (
                <div
                  key={index}
                  className="group grid grid-cols-3 gap-4 rounded-lg bg-slate-800/20 p-3 transition-all duration-300 hover:bg-slate-700/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-center">
                    <span className="text-lg font-semibold text-white">{example.ccm}</span>
                    <span className="ml-1 text-sm text-slate-400">cc</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-white">{example.hp}</span>
                    <span className="ml-1 text-sm text-slate-400">hp</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-slate-400">{example.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Vehicle Examples */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-emerald-300">
              {t("quick_reference.real_vehicle_examples")}
            </h4>
            <div className="space-y-3">
              {vehicleExamples.map((vehicle, index) => (
                <div
                  key={index}
                  className="group rounded-lg bg-slate-800/20 p-4 transition-all duration-300 hover:bg-slate-700/30"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-white">{vehicle.name}</h5>
                      <p className="text-sm capitalize text-slate-400">
                        {vehicle.category} • {vehicle.engineType}{" "}
                        {vehicle.fuelSystem.replace("-", " ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">
                        {vehicle.ccm}cc → {vehicle.hp}hp
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip */}
          <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-emerald-300">{t("quick_reference.pro_tip")}</h4>
                <p className="text-sm text-slate-300">{t("quick_reference.pro_tip_text")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
