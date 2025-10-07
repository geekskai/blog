"use client"
import { Info, Globe, Calculator } from "lucide-react"
import { useTranslations } from "next-intl"

export default function EducationalContent() {
  const t = useTranslations("CmToTommerConverter.educational_content")

  const useCases = [
    {
      icon: t("use_cases.furniture.icon"),
      title: t("use_cases.furniture.title"),
      description: t("use_cases.furniture.description"),
      examples: [
        t("use_cases.furniture.example_1"),
        t("use_cases.furniture.example_2"),
        t("use_cases.furniture.example_3"),
      ],
    },
    {
      icon: t("use_cases.construction.icon"),
      title: t("use_cases.construction.title"),
      description: t("use_cases.construction.description"),
      examples: [
        t("use_cases.construction.example_1"),
        t("use_cases.construction.example_2"),
        t("use_cases.construction.example_3"),
      ],
    },
    {
      icon: t("use_cases.ecommerce.icon"),
      title: t("use_cases.ecommerce.title"),
      description: t("use_cases.ecommerce.description"),
      examples: [
        t("use_cases.ecommerce.example_1"),
        t("use_cases.ecommerce.example_2"),
        t("use_cases.ecommerce.example_3"),
      ],
    },
    {
      icon: t("use_cases.engineering.icon"),
      title: t("use_cases.engineering.title"),
      description: t("use_cases.engineering.description"),
      examples: [
        t("use_cases.engineering.example_1"),
        t("use_cases.engineering.example_2"),
        t("use_cases.engineering.example_3"),
      ],
    },
  ]

  const facts = [
    {
      title: t("about_tommer.historical_background.title"),
      content: t("about_tommer.historical_background.content"),
    },
    {
      title: t("about_tommer.modern_standardization.title"),
      content: t("about_tommer.modern_standardization.content"),
    },
    {
      title: t("about_tommer.regional_usage.title"),
      content: t("about_tommer.regional_usage.content"),
    },
    {
      title: t("about_tommer.precision_matters.title"),
      content: t("about_tommer.precision_matters.content"),
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
                {t("use_cases.title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("use_cases.description")}</p>
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
                  <div className="text-xs font-medium text-orange-400">
                    {t("use_cases.examples_label")}
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
                {t("about_tommer.title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("about_tommer.description")}</p>
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
                  {t("about_tommer.conversion_formulas.title")}
                </h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-700/50 px-2 py-1 font-mono">
                      {t("about_tommer.conversion_formulas.cm_to_tommer")}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{t("about_tommer.conversion_formulas.cm_to_tommer_label")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-700/50 px-2 py-1 font-mono">
                      {t("about_tommer.conversion_formulas.tommer_to_cm")}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{t("about_tommer.conversion_formulas.tommer_to_cm_label")}</span>
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
