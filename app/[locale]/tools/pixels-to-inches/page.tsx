"use client"
import {
  Home,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
  Monitor,
  Settings,
  ArrowLeftRight,
  Palette,
  Printer,
  Calculator,
  HelpCircle,
} from "lucide-react"
import ConverterCard from "./components/ConverterCard"
import { useTranslations } from "./hooks/useTranslations"
import { Link } from "@/app/i18n/navigation"
export default function PixelsToInchesConverter() {
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
          <li className="font-medium text-slate-100">
            {t("breadcrumb.pixels_to_inches_converter")}
          </li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <Monitor className="mr-2 h-4 w-4 text-blue-400" />
              {t("free_calculator_badge")}
              <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">{t("page_title")}</span>
              <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
                <span className="font-medium">{t("feature_badges.pixel_converter")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{t("feature_badges.screen_resolution")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="font-medium">{t("feature_badges.instant_conversion")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Settings className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{t("feature_badges.customizable_ppi")}</span>
              </div>
            </div>
          </div>

          {/* Main conversion area */}
          <div id="converter-section" className="flex justify-center">
            <div className="w-full max-w-2xl">
              <ConverterCard />
            </div>
          </div>
        </div>

        {/* SEO-optimized Introduction Section */}
        <div className="relative mb-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-pink-500/15 p-8 shadow-2xl backdrop-blur-xl md:p-12 lg:p-16">
          {/* Decorative background elements */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/15 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/15 blur-3xl"></div>
          <div className="absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/10 blur-2xl"></div>

          <div className="relative mx-auto max-w-5xl">
            {/* Main Title */}
            <div className="mb-8 text-center">
              <h2 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl">
                {t("intro_section.title")}
              </h2>
            </div>

            {/* Content Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              {/* Left Column - Paragraphs */}
              <div className="space-y-6 text-left">
                <p className="text-lg leading-relaxed text-slate-300 md:text-xl">
                  {t("intro_section.paragraph_1")}
                </p>
                <p className="text-lg leading-relaxed text-slate-300 md:text-xl">
                  {t("intro_section.paragraph_2")}
                </p>
              </div>

              {/* Right Column - Key Features */}
              <div className="flex items-center">
                <div className="w-full rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-blue-500/20 md:p-8">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                      <Sparkles className="h-5 w-5 text-blue-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-white md:text-xl">Key Features</h3>
                  </div>
                  <p className="text-base leading-relaxed text-slate-200 md:text-lg">
                    {t("intro_section.key_features_intro")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Conversion Examples Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-12 shadow-2xl backdrop-blur-xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t("conversion_examples_section.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {t("conversion_examples_section.subtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="mb-3 text-sm font-medium text-slate-400">
                {t("conversion_examples_section.example_1_title")}
              </div>
              <div className="text-2xl font-bold text-white">
                {t("conversion_examples_section.example_1_result")}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="mb-3 text-sm font-medium text-slate-400">
                {t("conversion_examples_section.example_2_title")}
              </div>
              <div className="text-2xl font-bold text-white">
                {t("conversion_examples_section.example_2_result")}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="mb-3 text-sm font-medium text-slate-400">
                {t("conversion_examples_section.example_3_title")}
              </div>
              <div className="text-2xl font-bold text-white">
                {t("conversion_examples_section.example_3_result")}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="mb-3 text-sm font-medium text-slate-400">
                {t("conversion_examples_section.example_4_title")}
              </div>
              <div className="text-2xl font-bold text-white">
                {t("conversion_examples_section.example_4_result")}
              </div>
            </div>
          </div>
        </div>

        {/* Usage guide */}
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
                {t("usage_guide.step_1_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_1_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("usage_guide.step_2_title")}
              </h3>
              <p className="text-slate-400">{t("usage_guide.step_2_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
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

        {/* Features section */}
        <div className="mt-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{t("features_section.title")}</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {t("features_section.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <ArrowLeftRight className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">
                {t("features_section.two_way_conversion")}
              </h3>
              <p className="text-lg leading-relaxed text-slate-400">
                {t("features_section.two_way_conversion_description")}
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <Monitor className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">
                {t("features_section.customizable_ppi")}
              </h3>
              <p className="text-lg leading-relaxed text-slate-400">
                {t("features_section.customizable_ppi_description")}
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                <Settings className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-white">
                {t("features_section.precision_control")}
              </h3>
              <p className="text-lg leading-relaxed text-slate-400">
                {t("features_section.precision_control_description")}
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 p-12 shadow-2xl backdrop-blur-xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{t("use_cases_section.title")}</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {t("use_cases_section.subtitle")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {t("use_cases_section.use_case_1_title")}
                </h3>
              </div>
              <p className="text-slate-400">{t("use_cases_section.use_case_1_description")}</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-500">
                  <Monitor className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {t("use_cases_section.use_case_2_title")}
                </h3>
              </div>
              <p className="text-slate-400">{t("use_cases_section.use_case_2_description")}</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 to-pink-500">
                  <Printer className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {t("use_cases_section.use_case_3_title")}
                </h3>
              </div>
              <p className="text-slate-400">{t("use_cases_section.use_case_3_description")}</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-orange-500">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {t("use_cases_section.use_case_4_title")}
                </h3>
              </div>
              <p className="text-slate-400">{t("use_cases_section.use_case_4_description")}</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-32 rounded-xl bg-slate-800 p-8 md:p-12">
          <h2 className="mb-8 text-3xl font-bold text-white">{t("faq_section.title")}</h2>
          <div className="space-y-6">
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("faq_section.q1_question")}
              </h3>
              <p className="text-slate-400">{t("faq_section.q1_answer")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("faq_section.q2_question")}
              </h3>
              <p className="text-slate-400">{t("faq_section.q2_answer")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("faq_section.q3_question")}
              </h3>
              <p className="text-slate-400">{t("faq_section.q3_answer")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("faq_section.q4_question")}
              </h3>
              <p className="text-slate-400">{t("faq_section.q4_answer")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("faq_section.q5_question")}
              </h3>
              <p className="text-slate-400">{t("faq_section.q5_answer")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("faq_section.q6_question")}
              </h3>
              <p className="text-slate-400">{t("faq_section.q6_answer")}</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("faq_section.q7_question")}
              </h3>
              <p className="text-slate-400">{t("faq_section.q7_answer")}</p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("faq_section.q8_question")}
              </h3>
              <p className="text-slate-400">{t("faq_section.q8_answer")}</p>
            </div>
          </div>
        </section>

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
              <Monitor className="h-5 w-5" />
              {t("final_cta.button_text")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
