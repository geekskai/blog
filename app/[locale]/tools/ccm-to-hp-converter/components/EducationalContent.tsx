"use client"

import React from "react"
import { Info, Zap, Settings, TrendingUp } from "lucide-react"

export default function EducationalContent() {
  const engineTypes = [
    {
      icon: "🏍️",
      title: "2-Stroke Engines",
      description:
        "Higher power-to-weight ratio, common in dirt bikes, chainsaws, and racing applications.",
      characteristics: [
        "Power stroke every revolution",
        "Lighter and more compact",
        "Higher power output per cc",
        "Common in motorcycles and small engines",
      ],
      powerFactor: "1.2-1.4x coefficient",
    },
    {
      icon: "🚗",
      title: "4-Stroke Engines",
      description: "More fuel efficient and cleaner, standard in most cars and modern motorcycles.",
      characteristics: [
        "Power stroke every two revolutions",
        "Better fuel efficiency",
        "Lower emissions",
        "More durable and reliable",
      ],
      powerFactor: "0.8-1.0x coefficient",
    },
  ]

  const fuelSystems = [
    {
      icon: "🌬️",
      title: "Naturally Aspirated",
      description: "Air enters the engine at atmospheric pressure through normal intake process.",
      advantages: [
        "Simpler design and maintenance",
        "More predictable power delivery",
        "Lower cost",
        "Better reliability",
      ],
      powerRange: "Lower power density",
    },
    {
      icon: "💨",
      title: "Turbocharged",
      description: "Forced induction system that compresses air for higher power output.",
      advantages: [
        "Higher power from smaller displacement",
        "Better power-to-weight ratio",
        "Improved efficiency at high loads",
        "More power per cc",
      ],
      powerRange: "25-40% more power",
    },
  ]

  const applications = [
    {
      icon: "🏍️",
      title: "Motorcycles & Scooters",
      description: "From small commuter bikes to high-performance superbikes.",
      examples: [
        "125cc scooter: ~10-15 hp",
        "600cc sportbike: ~100-120 hp",
        "1000cc superbike: ~180-200 hp",
      ],
    },
    {
      icon: "🚗",
      title: "Cars & Trucks",
      description: "Passenger vehicles and commercial applications.",
      examples: [
        "1000cc city car: ~70-80 hp",
        "2000cc sedan: ~150-180 hp",
        "3000cc SUV: ~250-300 hp",
      ],
    },
    {
      icon: "🏁",
      title: "Racing & Performance",
      description: "High-performance applications with specialized tuning.",
      examples: [
        "125cc karting: ~30-35 hp",
        "250cc motocross: ~45-50 hp",
        "Formula racing: varies widely",
      ],
    },
    {
      icon: "⛵",
      title: "Marine & Outboard",
      description: "Boat engines and marine applications.",
      examples: [
        "25hp outboard: ~500-750cc",
        "150hp outboard: ~2500-3000cc",
        "High-performance marine engines",
      ],
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
                Engine Types & Power Characteristics
              </h3>
            </div>
            <p className="text-slate-300">
              Understanding how different engine designs affect power output
            </p>
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
                  <div className="text-xs font-medium text-blue-400">Key Characteristics:</div>
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
                      Power Factor: {engine.powerFactor}
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
                Fuel System Impact on Power
              </h3>
            </div>
            <p className="text-slate-300">
              How different induction systems affect horsepower output
            </p>
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
                  <div className="text-xs font-medium text-green-400">Advantages:</div>
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
                      Power Output: {system.powerRange}
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
                Real-World Applications
              </h3>
            </div>
            <p className="text-slate-300">
              Common CCM to HP ratios across different vehicle categories
            </p>
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
                  <div className="text-xs font-medium text-purple-400">Typical Examples:</div>
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
            <h4 className="mb-2 text-lg font-semibold text-white">Important Disclaimer</h4>
            <p className="text-sm leading-relaxed text-slate-300">
              The CCM to HP conversion provided by this tool is an <strong>estimate</strong> based
              on empirical data and industry averages. Actual horsepower output can vary
              significantly based on factors such as:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              <li>• Compression ratio and engine tuning</li>
              <li>• Fuel quality and octane rating</li>
              <li>• Air intake and exhaust system design</li>
              <li>• Engine management and ignition timing</li>
              <li>• Manufacturing tolerances and build quality</li>
            </ul>
            <p className="mt-2 text-sm text-slate-400">
              Always consult manufacturer specifications for accurate power ratings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
