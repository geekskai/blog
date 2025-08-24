"use client";
import { Info, Globe, Calculator } from "lucide-react";

export default function EducationalContent() {
  const useCases = [
    {
      icon: "🏠",
      title: "Furniture & Home Decor",
      description:
        "Converting furniture dimensions when shopping from Nordic countries or international retailers.",
      examples: [
        "IKEA product dimensions",
        "Scandinavian furniture catalogs",
        "Home renovation projects",
      ],
    },
    {
      icon: "🏗️",
      title: "Construction & Architecture",
      description:
        "Professional building projects requiring precise measurements in different unit systems.",
      examples: ["Architectural drawings", "Building materials", "Technical specifications"],
    },
    {
      icon: "🛒",
      title: "E-commerce & Shopping",
      description: "Understanding product sizes when buying from international online stores.",
      examples: ["Clothing measurements", "Electronics dimensions", "Shipping box sizes"],
    },
    {
      icon: "📐",
      title: "Engineering & Design",
      description:
        "Technical work requiring conversion between metric and Nordic measurement systems.",
      examples: ["CAD drawings", "Product specifications", "Manufacturing tolerances"],
    },
  ]

  const facts = [
    {
      title: "Historical Background",
      content:
        'Tommer (meaning "thumb" in Danish/Norwegian) has been used in Nordic countries for centuries, originally based on the width of a thumb.',
    },
    {
      title: "Modern Standardization",
      content:
        "Today, 1 tommer equals exactly 2.54 cm, identical to the international inch, ensuring global compatibility.",
    },
    {
      title: "Regional Usage",
      content:
        "While metric system is official in Nordic countries, tommer is still commonly used in construction, furniture, and traditional crafts.",
    },
    {
      title: "Precision Matters",
      content:
        "In professional applications, even small conversion errors can compound. Our tool provides up to 3 decimal places for maximum accuracy.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* 使用场景 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-900/25 via-red-900/20 to-pink-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
              <Globe className="h-5 w-5 text-orange-400" />
              <h3 className="bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
                Common Use Cases
              </h3>
            </div>
            <p className="text-slate-300">
              Discover when and why you might need to convert between cm and tommer
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((useCase, index) => (
              <div
                key={useCase.title}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-2xl">{useCase.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{useCase.title}</h4>
                </div>

                <p className="mb-4 text-sm text-slate-300">{useCase.description}</p>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-orange-400">Examples:</div>
                  <ul className="space-y-1">
                    {useCase.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="h-1 w-1 rounded-full bg-orange-400" />
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

      {/* 教育内容 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/25 via-purple-900/20 to-blue-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-blue-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
              <Info className="h-5 w-5 text-indigo-400" />
              <h3 className="bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 bg-clip-text text-xl font-bold text-transparent">
                About Tommer & Centimeters
              </h3>
            </div>
            <p className="text-slate-300">
              Learn about the history and practical applications of these measurement units
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {facts.map((fact, index) => (
              <div
                key={fact.title}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                  {fact.title}
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">{fact.content}</p>
              </div>
            ))}
          </div>

          {/* 转换公式说明 */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 text-lg font-semibold text-white">Conversion Formulas</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-700/50 px-2 py-1 font-mono">
                      cm × 0.3937 = tommer
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>Centimeters to Tommer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-700/50 px-2 py-1 font-mono">
                      tommer × 2.54 = cm
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>Tommer to Centimeters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
