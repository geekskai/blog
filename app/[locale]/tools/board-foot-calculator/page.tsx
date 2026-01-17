"use client"
import { Calculator, Hammer, Home, ChevronRight, Sparkles, Package, DollarSign } from "lucide-react"
import { useTranslations } from "next-intl"
import CalculatorCard from "./components/CalculatorCard"
import ProjectManager from "./components/ProjectManager"
import { Link } from "@/app/i18n/navigation"

export default function BoardFootCalculator() {
  const t = useTranslations("BoardFootCalculator")
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
            <Link href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="transition-colors hover:text-slate-200">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb.board_foot_calculator")}</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <Calculator className="mr-2 h-4 w-4 text-amber-400" />
              {t("free_calculator_badge")}
              <Sparkles className="ml-2 h-4 w-4 text-orange-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">{t("page_title")}</span>
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {t("page_subtitle")}
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              {t("page_description")}
            </p>

            {/* SEO-optimized feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Calculator className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{t("feature_badges.board_foot_formula")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">{t("feature_badges.lumber_cost_estimator")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Package className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{t("feature_badges.project_management")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Hammer className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{t("feature_badges.construction_calculator")}</span>
              </div>
            </div>

            {/* Additional SEO keywords section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.board_foot_calculator")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.lumber_calculator")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.wood_calculator")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.construction_calculator")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.woodworking_calculator")}
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  {t("keywords_tags.lumber_cost_estimator")}
                </span>
              </p>
            </div>
          </div>

          {/* Main calculator area */}
          <div id="calculator-section">
            <CalculatorCard />
          </div>

          {/* Project Manager */}
          <div className="mt-16">
            <ProjectManager />
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_1_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_1_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_2_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_2_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_3_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_3_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
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
          {/* What is Board Foot Section */}
          <section className="rounded-xl bg-gradient-to-r from-amber-800 to-orange-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.what_is_board_foot_title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.what_is_board_foot_description")}
                </p>
              </div>
              <div className="rounded-lg bg-amber-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.calculator_benefits")}
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

          {/* Board Foot Formula Guide */}
          <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.formula_guide_title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.standard_formula")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      Board Feet = (L × W × T) ÷ 144
                    </code>
                  </p>
                  <p className="text-sm">{t("content_sections.formula_explanation")}</p>
                  <p>{t("content_sections.formula_usage")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.precision_control")}
                </h3>
                <div className="space-y-2 text-slate-200">
                  <p>{t("content_sections.precision_control_content.decimals_0")}</p>
                  <p>{t("content_sections.precision_control_content.decimals_1_2")}</p>
                  <p>{t("content_sections.precision_control_content.decimals_3")}</p>
                  <p>{t("content_sections.precision_control_content.precision_note")}</p>
                </div>
              </div>
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.quick_examples")}
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

          {/* Lumber Industry Applications */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.applications_title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.construction_app")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.construction_app_description")}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.woodworking_app")}
                </h3>
                <p className="text-slate-400">
                  {t("content_sections.woodworking_app_description")}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {t("content_sections.retail_app")}
                </h3>
                <p className="text-slate-400">{t("content_sections.retail_app_description")}</p>
              </div>
            </div>
          </section>

          {/* Common Use Cases Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.use_cases.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.use_cases.case_1_title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.use_cases.case_1_description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.use_cases.case_2_title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.use_cases.case_2_description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.use_cases.case_3_title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.use_cases.case_3_description")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.use_cases.case_4_title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.use_cases.case_4_description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    5
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.use_cases.case_5_title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.use_cases.case_5_description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    6
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {t("content_sections.use_cases.case_6_title")}
                    </h3>
                    <p className="text-slate-400">
                      {t("content_sections.use_cases.case_6_description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Features */}
          <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.professional_features.title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {t("content_sections.professional_features.advanced_title")}
                </h3>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.professional_features.advanced_description")}
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• {t("content_sections.professional_features.advanced_feature_1")}</li>
                  <li>• {t("content_sections.professional_features.advanced_feature_2")}</li>
                  <li>• {t("content_sections.professional_features.advanced_feature_3")}</li>
                  <li>• {t("content_sections.professional_features.advanced_feature_4")}</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {t("content_sections.professional_features.tools_title")}
                </h3>
                <p className="mb-4 text-slate-200">
                  {t("content_sections.professional_features.tools_description")}
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• {t("content_sections.professional_features.tools_feature_1")}</li>
                  <li>• {t("content_sections.professional_features.tools_feature_2")}</li>
                  <li>• {t("content_sections.professional_features.tools_feature_3")}</li>
                  <li>• {t("content_sections.professional_features.tools_feature_4")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                {t("content_sections.main_features.title")}
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                {t("content_sections.main_features.subtitle")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Calculator className="h-12 w-12 text-amber-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.main_features.accurate_calculations_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.main_features.accurate_calculations_description")}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <DollarSign className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.main_features.cost_estimation_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.main_features.cost_estimation_description")}
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Package className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  {t("content_sections.main_features.project_management_title")}
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  {t("content_sections.main_features.project_management_description")}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {t("content_sections.faq.title")}
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q1")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a1")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q2")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a2")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q3")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a3")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q4")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a4")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q5")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a5")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q6")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a6")}</p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q7")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a7")}</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("content_sections.faq.q8")}
                </h3>
                <p className="text-slate-400">{t("content_sections.faq.a8")}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">{t("final_cta.title")}</h2>
            <p className="mb-8 text-xl text-slate-300">{t("final_cta.description")}</p>
            <button
              onClick={() => {
                document.querySelector("#calculator-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
