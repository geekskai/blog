"use client"
import { Home, ChevronRight, Hash, Shield, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import ShareButtons from "@/components/ShareButtons"
import NumberGeneratorComponent from "./components/NumberGenerator"
import UseCases from "./components/UseCases"
import Features from "./components/Features"
import FAQSection from "./components/FAQSection"

export default function Random4DigitNumberGenerator() {
  const t = useTranslations("Random4DigitNumberGenerator")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="hover:text-slate-200">
              {t("breadcrumb.tools")}
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">
            {t("breadcrumb.random_4_digit_number_generator")}
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* === Hero Section === */}
        <div className="mb-12 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-2 backdrop-blur-sm">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">{t("header.badge_text")}</span>
          </div>

          {/* Main Title */}
          <h1 className="mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            {t("header.main_title")}
          </h1>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-3xl text-xl text-slate-300">
            {t("header.description", {
              verification_codes: t("header.verification_codes"),
              pins: t("header.pins"),
              testing_data: t("header.testing_data"),
            })}
          </p>

          {/* Key Features Pills */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: Zap, text: t("features_pills.instant_generation"), color: "blue" },
              { icon: Shield, text: t("features_pills.crypto_secure"), color: "emerald" },
              { icon: Hash, text: t("features_pills.bulk_export"), color: "purple" },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`inline-flex items-center gap-2 rounded-full border border-${feature.color}-500/30 bg-gradient-to-r from-${feature.color}-500/10 to-${feature.color}-500/5 px-4 py-2 backdrop-blur-sm`}
                >
                  <Icon className={`h-4 w-4 text-${feature.color}-400`} />
                  <span className="text-sm font-medium text-slate-200">{feature.text}</span>
                </div>
              )
            })}
          </div>

          {/* Share Component */}
          <div className="flex justify-center">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm">
              <p className="mb-3 text-center text-sm font-medium text-slate-300">
                {t("header.share_text")}
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* === Main Generator Component === */}
        <NumberGeneratorComponent />

        {/* === Use Cases Section === */}
        <UseCases />

        {/* === Features Section === */}
        <Features />

        {/* === FAQ Section === */}
        <FAQSection />

        {/* === Final CTA Section === */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto max-w-3xl">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl shadow-blue-500/50">
                <Hash className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
              {t("cta.title")}
            </h2>

            {/* Description */}
            <p className="mb-8 text-lg text-slate-300">{t("cta.description")}</p>

            {/* CTA Button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:shadow-purple-500/40"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative">{t("cta.button")}</span>
            </button>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              {[
                t("cta.trust_badges.crypto_secure"),
                t("cta.trust_badges.no_registration"),
                t("cta.trust_badges.free_forever"),
                t("cta.trust_badges.privacy"),
                t("cta.trust_badges.unlimited"),
                t("cta.trust_badges.cross_platform"),
              ].map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
                >
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SEO Content Section === */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-8 backdrop-blur-sm md:p-12">
          <div className="prose prose-invert max-w-none">
            <h2 className="mb-6 text-3xl font-bold text-white">{t("seo_content.title")}</h2>

            <div className="space-y-6 text-slate-300">
              <p>
                {t.rich("seo_content.paragraph_1", {
                  strong_generator: t("seo_content.strong_generator"),
                  strong_crypto: t("seo_content.strong_crypto"),
                  rich: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>

              <h3 className="text-2xl font-bold text-white">
                {t("seo_content.perfect_for_title")}
              </h3>
              <p>
                {t("seo_content.perfect_for_description", {
                  strong_verification: t("seo_content.strong_verification"),
                  strong_pins: t("seo_content.strong_pins"),
                  strong_test_data: t("seo_content.strong_test_data"),
                  strong_random: t("seo_content.strong_random"),
                })}
              </p>

              <h3 className="text-2xl font-bold text-white">
                {t("seo_content.key_features_title")}
              </h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  {t.rich("seo_content.features_list.crypto_secure", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich("seo_content.features_list.bulk_generation", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich("seo_content.features_list.multiple_formats", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich("seo_content.features_list.exclusion_rules", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich("seo_content.features_list.export_options", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich("seo_content.features_list.no_registration", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich("seo_content.features_list.free", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich("seo_content.features_list.privacy", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-white">
                {t("seo_content.how_it_works_title")}
              </h3>
              <p>
                {t("seo_content.how_it_works_description", {
                  strong_crypto: t("seo_content.strong_crypto_method"),
                  strong_otp: t("seo_content.strong_otp"),
                  strong_2fa: t("seo_content.strong_2fa"),
                  strong_verification: t("seo_content.strong_verification_codes"),
                })}
              </p>

              <h3 className="text-2xl font-bold text-white">{t("seo_content.why_choose_title")}</h3>
              <p>
                {t("seo_content.why_choose_description", {
                  strong_enterprise: t("seo_content.strong_enterprise"),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
