"use client"

import React from "react"
import { Zap, ArrowLeftRight, Settings, BookOpen, TrendingUp, Globe } from "lucide-react"
import ConverterCard from "./components/ConverterCard"
import QuickReference from "./components/QuickReference"
import EducationalContent from "./components/EducationalContent"

export default function CcmToHpConverter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section with Converter */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-950/30 to-red-950/30">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/20 to-red-400/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-red-400/20 to-pink-400/20 blur-3xl"></div>
          <div className="absolute right-1/3 top-1/4 h-40 w-40 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center space-x-2 text-sm text-slate-400">
            <a href="/tools" className="transition-colors hover:text-white">
              Tools
            </a>
            <span>/</span>
            <span className="text-white">CCM to HP Converter</span>
          </nav>

          {/* Main heading and description */}
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
              <Zap className="h-6 w-6 text-orange-400" />
              <span className="text-lg font-semibold text-orange-300">Engine Power Calculator</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
              <span className="bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-transparent">
                CCM to HP Converter
              </span>
              <br />
              <span className="text-3xl lg:text-4xl">Engine Power Estimator</span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              <strong className="text-slate-300">Free CCM to HP converter</strong> and engine power
              calculator. Convert{" "}
              <strong className="text-slate-300">
                engine displacement (ccm) to horsepower (hp)
              </strong>{" "}
              instantly with precision for{" "}
              <strong className="text-slate-300">2-stroke and 4-stroke engines</strong>. Perfect for{" "}
              <strong className="text-slate-300">motorcycle enthusiasts</strong>,{" "}
              <strong className="text-slate-300">car buyers</strong>,{" "}
              <strong className="text-slate-300">marine applications</strong>, and{" "}
              <strong className="text-slate-300">racing projects</strong>.
            </p>

            {/* SEO keyword tags */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-orange-300">
                ccm to hp
              </span>
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-300">hp to ccm</span>
              <span className="rounded-full bg-pink-500/10 px-3 py-1 text-pink-300">
                engine displacement calculator
              </span>
              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-300">
                horsepower estimator
              </span>
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-orange-300">
                motorcycle power calculator
              </span>
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-300">
                2-stroke 4-stroke converter
              </span>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <ArrowLeftRight className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Bidirectional CCM ↔ HP Conversion</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Settings className="h-4 w-4 text-red-500" />
                <span className="font-medium">2-Stroke & 4-Stroke Engine Support</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-pink-500" />
                <span className="font-medium">Turbocharged & Natural Aspiration</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Motorcycle, Car & Marine Engines</span>
              </div>
            </div>
          </div>

          {/* Main conversion area */}
          <div id="converter-section" className="grid gap-8 lg:grid-cols-3">
            {/* Main converter */}
            <div className="lg:col-span-2">
              <ConverterCard />
            </div>

            {/* Quick reference */}
            <div className="lg:col-span-1">
              <QuickReference />
            </div>
          </div>
        </div>

        {/* Usage guide - SEO optimized */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CCM to HP Converter - Complete Engine Power Guide
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Master{" "}
              <strong className="text-slate-300">
                engine displacement to horsepower conversion
              </strong>{" "}
              for motorcycle shopping, car evaluation, marine engines, and racing applications
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Enter Engine Displacement</h3>
              <p className="text-sm text-slate-400">
                Input your engine's <strong>displacement in CCM</strong> (cubic centimeters) or{" "}
                <strong>horsepower</strong> for reverse calculation
              </p>
            </div>

            <div className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Select Engine Type</h3>
              <p className="text-sm text-slate-400">
                Choose between <strong>2-stroke</strong> (dirt bikes, chainsaws) or{" "}
                <strong>4-stroke</strong> (cars, modern motorcycles) engines
              </p>
            </div>

            <div className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Choose Fuel System</h3>
              <p className="text-sm text-slate-400">
                Select <strong>naturally aspirated</strong> or <strong>turbocharged</strong> to get
                accurate power estimates
              </p>
            </div>

            <div className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
                <span className="text-xl font-bold text-white">4</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Get Instant Results</h3>
              <p className="text-sm text-slate-400">
                View <strong>estimated horsepower</strong> with power range, copy results, or share
                calculations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-semibold text-blue-300">Engine Power Education</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white">Understanding CCM to HP Conversion</h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-400">
            Learn about <strong className="text-slate-300">engine displacement</strong>,{" "}
            <strong className="text-slate-300">horsepower calculations</strong>, and factors
            affecting <strong className="text-slate-300">engine power output</strong>
          </p>
        </div>

        <EducationalContent />
      </div>

      {/* FAQ Section - SEO optimized */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* Dynamic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_45deg,transparent,rgba(139,92,246,0.1),transparent)]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Icon cloud */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
              </div>
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mb-16 max-w-3xl text-xl text-slate-400">
              Everything you need to know about{" "}
              <strong className="text-slate-300">CCM to HP conversion</strong> and{" "}
              <strong className="text-slate-300">engine power calculations</strong>
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {[
              {
                question: "How accurate is CCM to HP conversion?",
                answer:
                  "CCM to HP conversion provides estimates based on empirical data and industry averages. Actual horsepower can vary ±15-25% depending on engine tuning, compression ratio, fuel system, and other factors. Our calculator uses proven formulas with different coefficients for 2-stroke vs 4-stroke and naturally aspirated vs turbocharged engines.",
              },
              {
                question: "What's the difference between 2-stroke and 4-stroke power output?",
                answer:
                  "2-stroke engines typically produce more power per cc than 4-stroke engines because they have a power stroke every revolution instead of every two revolutions. Our calculator applies a 1.2-1.4x coefficient for 2-stroke engines and 0.8-1.0x for 4-stroke engines, reflecting real-world power differences.",
              },
              {
                question: "How does turbocharging affect CCM to HP conversion?",
                answer:
                  "Turbocharged engines produce significantly more power from the same displacement. Our calculator applies higher coefficients (1.0-1.4x) for turbocharged engines compared to naturally aspirated engines (0.8-1.2x), typically resulting in 25-40% more estimated horsepower.",
              },
              {
                question: "Can I use this for motorcycle, car, and marine engines?",
                answer:
                  "Yes! Our CCM to HP converter works for all internal combustion engines including motorcycles, cars, boats, ATVs, and racing engines. The calculator accounts for different engine types and configurations commonly found across these applications.",
              },
              {
                question: "Why do manufacturers' HP ratings sometimes differ from calculations?",
                answer:
                  "Manufacturer ratings are measured under specific conditions (SAE, DIN, etc.) and may include factors like altitude, temperature, and measurement standards. Our calculator provides estimates based on displacement and engine type, while actual ratings depend on complete engine design, tuning, and testing conditions.",
              },
              {
                question: "What CCM range works best with this calculator?",
                answer:
                  "Our calculator works accurately for engines from 50cc to 8000cc. For very small engines (under 50cc) or extremely large engines (over 8000cc), results may be less accurate due to different design principles and efficiency factors.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="mb-3 text-lg font-semibold text-white transition-colors group-hover:text-blue-300">
                  {faq.question}
                </h3>
                <p className="leading-relaxed text-slate-400">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 backdrop-blur-sm">
              <h3 className="mb-4 text-2xl font-bold text-white">
                Ready to Calculate Engine Power?
              </h3>
              <p className="mb-6 text-slate-300">
                Use our free CCM to HP converter to estimate your engine's horsepower instantly
              </p>
              <a
                href="#converter-section"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                <Zap className="relative h-5 w-5" />
                <span className="relative">Start Converting Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
