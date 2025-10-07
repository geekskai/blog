"use client"
import { useTranslations } from "next-intl"
import {
  Microscope,
  ArrowLeftRight,
  Atom,
  Home,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Calculator,
  Beaker,
  Dna,
  Target,
  Award,
} from "lucide-react"
import ConverterCard from "./components/ConverterCard"
import QuickReference from "./components/QuickReference"
// import EducationalContent from "./components/EducationalContent"

export default function CmToPmConverter() {
  const t = useTranslations("CmToPmConverter")
  const tCommon = useTranslations("HomePage")

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav
        className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"
        aria-label={t("breadcrumb.label")}
      >
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="transition-colors hover:text-slate-200">
              {t("breadcrumb.tools")}
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb.cm_to_pm_converter")}</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section with Converter */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <Microscope className="mr-2 h-4 w-4 text-blue-400" />
              {t("header.badge_text")}
              <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">{t("header.main_title")}</span>
              <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("header.subtitle")}
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              {t("header.description")}
            </p>

            {/* SEO-optimized feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  {t("header.feature_badges.scientific_precision")}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Atom className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{t("header.feature_badges.atomic_scale")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Beaker className="h-4 w-4 text-purple-500" />
                <span className="font-medium">{t("header.feature_badges.nanotechnology")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Dna className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{t("header.feature_badges.molecular_biology")}</span>
              </div>
            </div>

            {/* Additional SEO keywords section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                {t("header.seo_keywords")
                  .split(", ")
                  .map((keyword, index) => (
                    <span
                      key={index}
                      className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1"
                    >
                      {keyword}
                    </span>
                  ))}
              </p>
            </div>
          </div>

          {/* Main conversion area */}
          <div id="converter-section">
            {/* Left panel - Converter */}
            <div className="space-y-6">
              <ConverterCard />
            </div>

            <QuickReference />
          </div>
        </div>

        {/* Usage guide - SEO optimized */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{t("usage_guide.title")}</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {t("usage_guide.description")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.steps.step1.title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.steps.step1.description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.steps.step2.title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.steps.step2.description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.steps.step3.title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.steps.step3.description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.steps.step4.title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.steps.step4.description")}</p>
            </div>
          </div>
        </div>

        {/* SEO-Enhanced Content Sections */}
        <div className="mt-20 space-y-16">
          {/* Primary Keywords Section */}
          <section className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.conversion_methods.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-emerald-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🔄 {t("content_sections.conversion_methods.pm_to_cm.title")}
                </h3>
                <p className="text-slate-200">
                  {t("content_sections.conversion_methods.pm_to_cm.description")}
                </p>
                <div className="mt-3 rounded bg-emerald-800/50 p-2 text-sm">
                  <strong>{t("content_sections.conversion_methods.formula_label")}</strong>{" "}
                  {t("content_sections.conversion_methods.pm_to_cm.formula")}
                </div>
              </div>
              <div className="rounded-lg bg-teal-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🔄 {t("content_sections.conversion_methods.cm_to_pm.title")}
                </h3>
                <p className="text-slate-200">
                  {t("content_sections.conversion_methods.cm_to_pm.description")}
                </p>
                <div className="mt-3 rounded bg-teal-800/50 p-2 text-sm">
                  <strong>{t("content_sections.conversion_methods.formula_label")}</strong>{" "}
                  {t("content_sections.conversion_methods.cm_to_pm.formula")}
                </div>
              </div>
              <div className="rounded-lg bg-cyan-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  ⚗️ {t("content_sections.conversion_methods.picometer_to_centimeter.title")}
                </h3>
                <p className="text-slate-200">
                  {t("content_sections.conversion_methods.picometer_to_centimeter.description")}
                </p>
                <div className="mt-3 rounded bg-cyan-800/50 p-2 text-sm">
                  <strong>{t("content_sections.conversion_methods.scale_label")}</strong>{" "}
                  {t("content_sections.conversion_methods.picometer_to_centimeter.scale")}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Picometer Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.understanding_scale.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.understanding_scale.description")}
                </p>
                <p className="text-slate-200">
                  {t("content_sections.understanding_scale.conversion_info")}
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.understanding_scale.applications.title")}
                </h3>
                <ul className="space-y-2 text-slate-200">
                  {t("content_sections.understanding_scale.applications.list")
                    .split(", ")
                    .map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Scientific Precision Section */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.scientific_precision.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🔬 {t("content_sections.scientific_precision.precision_levels.title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <strong>
                      {t("content_sections.scientific_precision.precision_levels.general")}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      {t("content_sections.scientific_precision.precision_levels.standard")}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      {t("content_sections.scientific_precision.precision_levels.high")}
                    </strong>
                  </p>
                  <p>{t("content_sections.scientific_precision.precision_levels.note")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  ⚡ {t("content_sections.scientific_precision.scientific_notation.title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      {t("content_sections.scientific_precision.scientific_notation.cm_to_pm")}
                    </code>
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      {t("content_sections.scientific_precision.scientific_notation.pm_to_cm")}
                    </code>
                  </p>
                  <p>{t("content_sections.scientific_precision.scientific_notation.note")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🎯 {t("content_sections.scientific_precision.accuracy_standards.title")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>{t("content_sections.scientific_precision.accuracy_standards.digits")}</p>
                  <p>{t("content_sections.scientific_precision.accuracy_standards.range")}</p>
                  <p>{t("content_sections.scientific_precision.accuracy_standards.grade")}</p>
                  <p>{t("content_sections.scientific_precision.accuracy_standards.note")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Research Applications */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.research_applications.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🔬 {t("content_sections.research_applications.nanotechnology.title")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.research_applications.nanotechnology.description")}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  ⚛️ {t("content_sections.research_applications.atomic_physics.title")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.research_applications.atomic_physics.description")}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🧬 {t("content_sections.research_applications.molecular_biology.title")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.research_applications.molecular_biology.description")}
                </p>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">{t("features.title")}</h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                {t("features.description")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <ArrowLeftRight className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("features.bidirectional.title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("features.bidirectional.description")}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Target className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("features.precision.title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("features.precision.description")}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Award className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("features.research_grade.title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("features.research_grade.description")}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("faq.title")}</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq.questions.how_to_convert.question")}
                </h3>
                <p className="text-slate-400">{t("faq.questions.how_to_convert.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq.questions.conversion_formulas.question")}
                </h3>
                <p className="text-slate-400">{t("faq.questions.conversion_formulas.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq.questions.importance.question")}
                </h3>
                <p className="text-slate-400">{t("faq.questions.importance.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq.questions.scientific_notation.question")}
                </h3>
                <p className="text-slate-400">{t("faq.questions.scientific_notation.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq.questions.accuracy.question")}
                </h3>
                <p className="text-slate-400">{t("faq.questions.accuracy.answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq.questions.free_use.question")}
                </h3>
                <p className="text-slate-400">{t("faq.questions.free_use.answer")}</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("faq.questions.applications.question")}
                </h3>
                <p className="text-slate-400">{t("faq.questions.applications.answer")}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">{t("final_cta.title")}</h2>
            <p className="mb-8 text-xl text-slate-300">{t("final_cta.description")}</p>
            <button
              onClick={() => {
                document.querySelector("#converter-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Calculator className="h-5 w-5" />
              {t("final_cta.button_text")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
