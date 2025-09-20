"use client"

import { useState } from "react"
import { Info, Atom, Microscope, Dna, BookOpen, ChevronRight, Zap } from "lucide-react"
import { ATOMIC_SCALE_EXAMPLES, getAtomicExamplesByCategory } from "../utils/scientific"
import { formatNumber } from "../utils/converter"

export default function EducationalContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("atom")
  const examplesByCategory = getAtomicExamplesByCategory()

  const applications = [
    {
      icon: "🔬",
      title: "Nanotechnology Research",
      description:
        "Essential for designing nanomaterials, quantum dots, and molecular machines at the atomic scale.",
      examples: [
        "Carbon nanotube diameter measurements",
        "Quantum dot size calculations",
        "Molecular motor dimensions",
      ],
    },
    {
      icon: "🧬",
      title: "Molecular Biology",
      description:
        "Critical for understanding protein structures, DNA dimensions, and cellular components.",
      examples: [
        "Protein folding analysis",
        "DNA sequencing accuracy",
        "Enzyme active site measurements",
      ],
    },
    {
      icon: "💎",
      title: "Materials Science",
      description:
        "Fundamental for crystal lattice analysis, defect characterization, and surface studies.",
      examples: [
        "Crystal lattice parameters",
        "Surface roughness analysis",
        "Defect size quantification",
      ],
    },
    {
      icon: "⚛️",
      title: "Atomic Physics",
      description:
        "Core measurements for atomic radii, bond lengths, and quantum mechanical calculations.",
      examples: [
        "Atomic orbital calculations",
        "Bond length measurements",
        "Quantum tunneling distances",
      ],
    },
  ]

  const scaleVisualization = [
    {
      scale: "Macroscopic",
      size: "1 cm",
      description: "Everyday objects",
      color: "from-blue-500 to-cyan-500",
    },
    {
      scale: "Microscopic",
      size: "10 μm",
      description: "Cell organelles",
      color: "from-green-500 to-emerald-500",
    },
    {
      scale: "Nanoscopic",
      size: "10 nm",
      description: "Large molecules",
      color: "from-yellow-500 to-orange-500",
    },
    {
      scale: "Atomic",
      size: "1 Å (100 pm)",
      description: "Atomic bonds",
      color: "from-red-500 to-pink-500",
    },
    {
      scale: "Subatomic",
      size: "1 fm",
      description: "Nuclear scale",
      color: "from-purple-500 to-indigo-500",
    },
  ]

  const categoryIcons = {
    atom: Atom,
    molecule: Dna,
    bond: Zap,
    structure: Microscope,
  }

  return (
    <div className="space-y-8">
      {/* 尺度可视化 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/25 via-purple-900/20 to-blue-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-blue-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
              <Microscope className="h-5 w-5 text-indigo-400" />
              <h3 className="bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 bg-clip-text text-xl font-bold text-transparent">
                Scale Visualization Journey
              </h3>
            </div>
            <p className="text-slate-300">
              Explore the incredible journey from centimeters to picometers
            </p>
          </div>

          <div className="space-y-4">
            {scaleVisualization.map((item, index) => (
              <div
                key={item.scale}
                className="group relative overflow-hidden rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-4 w-4 rounded-full bg-gradient-to-r ${item.color}`} />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{item.scale}</h4>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{item.size}</div>
                    <div className="text-xs text-slate-400">
                      {item.scale === "Atomic" ? "Our focus scale" : ""}
                    </div>
                  </div>
                </div>

                {/* 进度条显示相对尺寸 */}
                <div className="mt-4 h-2 rounded-full bg-slate-700/50">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                    style={{ width: `${Math.max(5, 100 - index * 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 原子尺度示例 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-900/25 via-blue-900/20 to-indigo-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-6 py-3 backdrop-blur-sm">
              <Atom className="h-5 w-5 text-cyan-400" />
              <h3 className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-xl font-bold text-transparent">
                Atomic Scale Examples
              </h3>
            </div>
            <p className="text-slate-300">Real-world examples at the picometer scale</p>
          </div>

          {/* 类别选择器 */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {Object.keys(examplesByCategory).map((category) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Atom
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="capitalize">{category}s</span>
                </button>
              )
            })}
          </div>

          {/* 示例网格 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {examplesByCategory[selectedCategory]?.map((example, index) => (
              <div
                key={example.name}
                className="group rounded-2xl bg-slate-800/30 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <h4 className="text-sm font-semibold text-white">{example.name}</h4>
                  <div className="rounded-lg bg-cyan-500/20 px-2 py-1">
                    <span className="text-xs font-bold text-cyan-300">
                      {formatNumber(example.size, 0)} pm
                    </span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-400">{example.description}</p>

                {/* 尺寸可视化条 */}
                <div className="mt-3">
                  <div className="h-1 rounded-full bg-slate-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, Math.max(10, (example.size / 2000) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Relative size comparison</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 科学应用 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-900/25 via-red-900/20 to-pink-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-orange-400" />
              <h3 className="bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
                Scientific Applications
              </h3>
            </div>
            <p className="text-slate-300">How CM to PM conversion powers cutting-edge research</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((app, index) => (
              <div
                key={app.title}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-2xl">{app.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{app.title}</h4>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-slate-300">{app.description}</p>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-orange-400">Key Applications:</div>
                  <ul className="space-y-1">
                    {app.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <ChevronRight className="h-3 w-3 text-orange-400" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* 精度重要性说明 */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 text-lg font-semibold text-white">Why Precision Matters</h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  At the picometer scale, even tiny measurement errors can have massive
                  implications. A 1% error in atomic bond length calculations could completely
                  change molecular behavior predictions. Our converter provides up to 6 decimal
                  places of precision to ensure your scientific calculations are accurate and
                  reliable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
