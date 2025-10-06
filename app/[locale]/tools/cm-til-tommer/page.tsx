"use client"
import {
  ArrowLeftRight,
  Globe,
  BookOpen,
  Home,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
  Calculator,
  Settings,
  Flag,
} from "lucide-react"
import ConverterCard from "./components/ConverterCard"
import QuickReference from "./components/QuickReference"
import EducationalContent from "./components/EducationalContent"
import { useTranslations } from "./hooks/useTranslations"

export default function CmTilTommerConverter() {
  const t = useTranslations()

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
      <nav className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
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
          <li className="font-medium text-slate-100">{t("breadcrumb.cm_to_inches_converter")}</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section with Converter */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <Flag className="mr-2 h-4 w-4 text-red-400" />
              {t("free_calculator_badge")}
              <Sparkles className="ml-2 h-4 w-4 text-blue-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">{t("page_title")}</span>
              <span className="block bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
                {t("page_subtitle")}
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              {t("page_description")}
            </p>

            {/* SEO-optimized feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">{t("feature_badges.measurement_calculator")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-red-500" />
                <span className="font-medium">{t("feature_badges.nordic_converter")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{t("feature_badges.ikea_tool")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{t("feature_badges.construction_measurement")}</span>
              </div>
            </div>

            {/* Additional SEO keywords section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.cm_to_inches")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.inches_to_cm")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.danish_inches_converter")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.norwegian_measurement")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.nordic_units")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.scandinavian_converter")}
                </span>
              </p>
            </div>
          </div>

          {/* Main conversion area */}
          <div id="converter-section" className="grid gap-8 lg:grid-cols-3">
            {/* Left panel - Converter */}
            <div className="space-y-6 lg:col-span-2">
              <ConverterCard />
            </div>

            {/* Right panel - Quick Reference */}
            <div className="lg:col-span-1">
              <QuickReference />
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-16">
            <EducationalContent />
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_1_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_1_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_2_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_2_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_3_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_3_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_4_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_4_description")}</p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Tommer Section */}
          <section className="rounded-xl bg-gradient-to-r from-red-800 to-blue-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.what_is_inches_title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.what_is_inches_description")}
                </p>
              </div>
              <div className="rounded-lg bg-red-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.inches_conversion_benefits")}
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• {t("content_sections.benefit_1")}</li>
                  <li>• {t("content_sections.benefit_2")}</li>
                  <li>• {t("content_sections.benefit_3")}</li>
                  <li>• {t("content_sections.benefit_4")}</li>
                  <li>• {t("content_sections.benefit_5")}</li>
                  <li>• {t("content_sections.benefit_6")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CM til Tommer Conversion Guide */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-purple-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.formula_guide_title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  📏 {t("content_sections.conversion_formula")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      cm × 0,3937 = tommer
                    </code>
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      tommer × 2,54 = cm
                    </code>
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🎯 {t("content_sections.precision_control")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>{t("content_sections.precision_control_content.decimals_0")}</p>
                  <p>{t("content_sections.precision_control_content.decimals_1_2")}</p>
                  <p>{t("content_sections.precision_control_content.decimals_3")}</p>
                  <p>{t("content_sections.precision_control_content.precision_note")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  ⚡ {t("content_sections.quick_examples")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>{t("content_sections.quick_examples_content.example_1")}</p>
                  <p>{t("content_sections.quick_examples_content.example_2")}</p>
                  <p>{t("content_sections.quick_examples_content.example_3")}</p>
                  <p>{t("content_sections.quick_examples_content.examples_note")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Nordic Countries Usage */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.inches_usage_across_nordic_countries")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🇩🇰 {t("content_sections.denmark_usage")}
                </h3>
                <p className="text-slate-400">{t("content_sections.denmark_usage_text")}</p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🇳🇴 {t("content_sections.norway_usage")}
                </h3>
                <p className="text-slate-400">{t("content_sections.norway_usage_text")}</p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  🌍 {t("content_sections.international_usage")}
                </h3>
                <p className="text-slate-400">{t("content_sections.international_usage_text")}</p>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                {t("content_sections.features_title")}
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                {t("content_sections.features_subtitle")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <ArrowLeftRight className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.two_way_conversion")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.two_way_conversion_description")}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Calculator className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.precision_control_feature")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.precision_control_description")}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Settings className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.professional_tools")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.professional_tools_description")}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.faq_title")}
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq_how_convert")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq_how_convert_answer")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq_conversion_formula")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.faq_conversion_formula_answer")}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq_inches_same_as_international")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.faq_inches_same_as_international_answer")}
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq_why_need_converter")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.faq_why_need_converter_answer")}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq_is_free")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq_is_free_answer")}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-red-900/20 to-blue-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">{t("final_cta.title")}</h2>
            <p className="mb-8 text-xl text-slate-300">{t("final_cta.description")}</p>
            <button
              onClick={() => {
                document.querySelector("#converter-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
