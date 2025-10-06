"use client"
import { Info, Globe, Calculator, Home, Building, Monitor } from "lucide-react"
import { useTranslations } from "../hooks/useTranslations"

export default function EducationalContent() {
  const t = useTranslations()

  const useCases = [
    {
      icon: <Home className="h-6 w-6" />,
      title: t("educational_content.use_cases.furniture.title"),
      description: t("educational_content.use_cases.furniture.description"),
      examples: [
        t("educational_content.use_cases.furniture.examples.ikea"),
        t("educational_content.use_cases.furniture.examples.scandinavian"),
        t("educational_content.use_cases.furniture.examples.renovation"),
        t("educational_content.use_cases.furniture.examples.kitchen"),
      ],
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: t("educational_content.use_cases.construction.title"),
      description: t("educational_content.use_cases.construction.description"),
      examples: [
        t("educational_content.use_cases.construction.examples.drawings"),
        t("educational_content.use_cases.construction.examples.materials"),
        t("educational_content.use_cases.construction.examples.specifications"),
        t("educational_content.use_cases.construction.examples.standards"),
      ],
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: t("educational_content.use_cases.electronics.title"),
      description: t("educational_content.use_cases.electronics.description"),
      examples: [
        t("educational_content.use_cases.electronics.examples.tv"),
        t("educational_content.use_cases.electronics.examples.laptop"),
        t("educational_content.use_cases.electronics.examples.tablet"),
        t("educational_content.use_cases.electronics.examples.shipping"),
      ],
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: t("educational_content.use_cases.engineering.title"),
      description: t("educational_content.use_cases.engineering.description"),
      examples: [
        t("educational_content.use_cases.engineering.examples.cad"),
        t("educational_content.use_cases.engineering.examples.product_specs"),
        t("educational_content.use_cases.engineering.examples.tolerances"),
        t("educational_content.use_cases.engineering.examples.quality"),
      ],
    },
  ]

  const facts = [
    {
      title: t("educational_content.facts.historical.title"),
      content: t("educational_content.facts.historical.content"),
    },
    {
      title: t("educational_content.facts.modern.title"),
      content: t("educational_content.facts.modern.content"),
    },
    {
      title: t("educational_content.facts.regional.title"),
      content: t("educational_content.facts.regional.content"),
    },
    {
      title: t("educational_content.facts.precision.title"),
      content: t("educational_content.facts.precision.content"),
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
                {t("educational_content.common_uses.title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("educational_content.common_uses.description")}</p>
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
                  <div className="text-orange-400">{useCase.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{useCase.title}</h4>
                </div>

                <p className="mb-4 text-sm text-slate-300">{useCase.description}</p>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-orange-400">
                    {t("educational_content.examples")}:
                  </div>
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
                {t("educational_content.about_units.title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("educational_content.about_units.description")}</p>
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
                <h4 className="mb-2 text-lg font-semibold text-white">
                  {t("educational_content.conversion_formulas")}
                </h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-700/50 px-2 py-1 font-mono">
                      cm × 0,3937 = tommer
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{t("educational_content.cm_to_inches")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-700/50 px-2 py-1 font-mono">
                      tommer × 2,54 = cm
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{t("educational_content.inches_to_cm")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 丹麦/挪威特色信息 */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 backdrop-blur-sm">
            <h4 className="mb-3 text-lg font-semibold text-white">
              {t("educational_content.nordic_tradition.title")}
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h5 className="mb-2 font-medium text-blue-300">
                  🇩🇰 {t("educational_content.nordic_tradition.denmark.title")}
                </h5>
                <p className="text-sm text-slate-300">
                  {t("educational_content.nordic_tradition.denmark.content")}
                </p>
              </div>
              <div>
                <h5 className="mb-2 font-medium text-cyan-300">
                  🇳🇴 {t("educational_content.nordic_tradition.norway.title")}
                </h5>
                <p className="text-sm text-slate-300">
                  {t("educational_content.nordic_tradition.norway.content")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
