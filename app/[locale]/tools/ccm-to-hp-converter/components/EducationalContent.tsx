"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Info, Zap, Settings, TrendingUp } from "lucide-react"

export default function EducationalContent() {
  const t = useTranslations("CcmToHpConverter")
  const engineTypes = [
    {
      icon: "🏍️",
      title: t("educational_content.2_stroke_title"),
      description: t("educational_content.2_stroke_description"),
      characteristics: t("educational_content.2_stroke_characteristics").split("|"),
      powerFactor: t("educational_content.2_stroke_power_factor"),
    },
    {
      icon: "🚗",
      title: t("educational_content.4_stroke_title"),
      description: t("educational_content.4_stroke_description"),
      characteristics: t("educational_content.4_stroke_characteristics").split("|"),
      powerFactor: t("educational_content.4_stroke_power_factor"),
    },
  ]

  const fuelSystems = [
    {
      icon: "🌬️",
      title: t("educational_content.naturally_aspirated_title"),
      description: t("educational_content.naturally_aspirated_description"),
      advantages: t("educational_content.naturally_aspirated_advantages").split("|"),
      powerRange: t("educational_content.naturally_aspirated_power_range"),
    },
    {
      icon: "💨",
      title: t("educational_content.turbocharged_title"),
      description: t("educational_content.turbocharged_description"),
      advantages: t("educational_content.turbocharged_advantages").split("|"),
      powerRange: t("educational_content.turbocharged_power_range"),
    },
  ]

  const applications = [
    {
      icon: "🏍️",
      title: t("educational_content.motorcycles_title"),
      description: t("educational_content.motorcycles_description"),
      examples: t("educational_content.motorcycles_examples").split("|"),
    },
    {
      icon: "🚗",
      title: t("educational_content.cars_title"),
      description: t("educational_content.cars_description"),
      examples: t("educational_content.cars_examples").split("|"),
    },
    {
      icon: "🏁",
      title: t("educational_content.racing_title"),
      description: t("educational_content.racing_description"),
      examples: t("educational_content.racing_examples").split("|"),
    },
    {
      icon: "⛵",
      title: t("educational_content.marine_title"),
      description: t("educational_content.marine_description"),
      examples: t("educational_content.marine_examples").split("|"),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Engine Types Comparison */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-indigo-900/20 to-purple-900/25 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-3 backdrop-blur-sm">
              <Settings className="h-5 w-5 text-blue-400" />
              <h3 className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-xl font-bold text-transparent">
                {t("educational_content.engine_types_title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("educational_content.engine_types_description")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {engineTypes.map((engine, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-2xl">{engine.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{engine.title}</h4>
                </div>
                <p className="mb-4 text-sm text-slate-300">{engine.description}</p>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-blue-400">
                    {t("educational_content.key_characteristics")}
                  </div>
                  <ul className="space-y-1">
                    {engine.characteristics.map((char, charIndex) => (
                      <li
                        key={charIndex}
                        className="flex items-center gap-2 text-xs text-slate-400"
                      >
                        <div className="h-1 w-1 rounded-full bg-blue-400" />
                        {char}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 rounded-lg bg-blue-500/10 p-2">
                    <span className="text-xs font-medium text-blue-300">
                      {t("educational_content.power_factor")} {engine.powerFactor}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fuel Systems */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-green-900/25 via-emerald-900/20 to-teal-900/25 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-green-500/15 to-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-3 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-green-400" />
              <h3 className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-xl font-bold text-transparent">
                {t("educational_content.fuel_systems_title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("educational_content.fuel_systems_description")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {fuelSystems.map((system, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-2xl">{system.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{system.title}</h4>
                </div>
                <p className="mb-4 text-sm text-slate-300">{system.description}</p>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-green-400">
                    {t("educational_content.advantages")}
                  </div>
                  <ul className="space-y-1">
                    {system.advantages.map((advantage, advIndex) => (
                      <li key={advIndex} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="h-1 w-1 rounded-full bg-green-400" />
                        {advantage}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 rounded-lg bg-green-500/10 p-2">
                    <span className="text-xs font-medium text-green-300">
                      {t("educational_content.power_output")}: {system.powerRange}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/25 via-pink-900/20 to-rose-900/25 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-pink-500/15 to-rose-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-3 backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h3 className="bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-xl font-bold text-transparent">
                {t("educational_content.applications_title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("educational_content.applications_description")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {applications.map((app, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-2xl">{app.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{app.title}</h4>
                </div>
                <p className="mb-4 text-sm text-slate-300">{app.description}</p>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-purple-400">
                    {t("educational_content.typical_examples")}
                  </div>
                  <ul className="space-y-1">
                    {app.examples.map((example, exIndex) => (
                      <li key={exIndex} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="h-1 w-1 rounded-full bg-purple-400" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2 text-lg font-semibold text-white">
              {t("educational_content.disclaimer_title")}
            </h4>
            <p className="text-sm leading-relaxed text-slate-300">
              {t("educational_content.disclaimer_text")}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              {t("educational_content.disclaimer_factors")
                .split("|")
                .map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
            </ul>
            <p className="mt-2 text-sm text-slate-400">
              {t("educational_content.disclaimer_footer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
