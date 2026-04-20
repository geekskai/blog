"use client"
import { Home, ChevronRight, Hash, Shield, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import ShareButtons from "@/components/ShareButtons"
import NumberGeneratorComponent from "./components/NumberGenerator"
import UseCases from "./components/UseCases"
import Features from "./components/Features"
import FAQSection from "./components/FAQSection"
import { Link } from "@/app/i18n/navigation"

export default function Random4DigitNumberGenerator() {
  const t = useTranslations("Random4DigitNumberGenerator")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Breadcrumb Navigation - SEO Enhanced */}
      <nav
        className="mx-auto max-w-7xl px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 lg:px-8"
        aria-label="Breadcrumb"
      >
        <ol
          className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 sm:gap-2 sm:text-sm"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="flex items-center gap-1 hover:text-slate-200" itemProp="item">
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="line-clamp-1" itemProp="name">
                {t("breadcrumb.home")}
              </span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/tools" className="line-clamp-1 hover:text-slate-200" itemProp="item">
              <span itemProp="name">{t("breadcrumb.tools")}</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <li
            className="line-clamp-1 font-medium text-slate-100"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <span itemProp="name">{t("breadcrumb.random_4_digit_number_generator")}</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:px-8">
        {/* === Hero Section === */}
        <div className="mb-8 text-center md:mb-12 lg:mb-14">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1.5 backdrop-blur-sm sm:px-4 md:mb-6 md:px-6 md:py-2">
            <Shield className="h-4 w-4 text-blue-400 md:h-5 md:w-5" />
            <span className="text-xs font-medium text-blue-300 md:text-sm">
              {t("header.badge_text")}
            </span>
          </div>

          {/* Main Title - SEO Optimized */}
          <h1 className="mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-4xl md:mb-5 md:text-5xl lg:text-6xl">
            {t("header.main_title")}
          </h1>

          {/* SEO-optimized subtitle with keywords */}
          <p className="mx-auto mb-3 max-w-4xl text-sm font-semibold leading-6 text-blue-200 sm:text-base md:mb-4 md:text-lg md:leading-7">
            {t("header.seo_subtitle")}
          </p>

          {/* Description */}
          <p className="mx-auto mb-6 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base md:mb-8 md:max-w-5xl md:text-xl md:leading-8">
            {t("header.description", {
              verification_codes: t("header.verification_codes"),
              pins: t("header.pins"),
              testing_data: t("header.testing_data"),
            })}
          </p>

          {/* Key Features Pills */}
          <div className="mb-8 flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4">
            {[
              { icon: Zap, text: t("features_pills.instant_generation"), color: "blue" },
              { icon: Shield, text: t("features_pills.crypto_secure"), color: "emerald" },
              { icon: Hash, text: t("features_pills.bulk_export"), color: "purple" },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-${feature.color}-500/30 bg-gradient-to-r from-${feature.color}-500/10 to-${feature.color}-500/5 px-2.5 py-1.5 backdrop-blur-sm sm:px-3 md:min-h-[40px] md:gap-2 md:px-4 md:py-2`}
                >
                  <Icon className={`h-3.5 w-3.5 text-${feature.color}-400 md:h-4 md:w-4`} />
                  <span className="text-[11px] font-medium text-slate-200 sm:text-xs md:text-sm">
                    {feature.text}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Share Component */}
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-3.5 backdrop-blur-sm sm:p-4 md:max-w-lg md:p-6">
              <p className="mb-2 text-center text-xs font-medium text-slate-300 md:mb-3 md:text-sm">
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
        <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 p-5 text-center backdrop-blur-xl sm:p-6 md:mt-20 md:p-10 lg:p-12">
          <div className="mx-auto max-w-3xl">
            {/* Icon */}
            <div className="mb-5 flex justify-center md:mb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl shadow-blue-500/50 sm:h-16 sm:w-16 md:h-20 md:w-20">
                <Hash className="h-7 w-7 text-white sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:text-3xl md:mb-4 md:text-4xl">
              {t("cta.title")}
            </h2>

            {/* Description */}
            <p className="mb-6 text-sm leading-7 text-slate-300 sm:text-base md:mb-8 md:text-lg md:leading-8">
              {t("cta.description")}
            </p>

            {/* CTA Button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group w-full max-w-xs overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:shadow-purple-500/40 sm:w-auto sm:max-w-none sm:px-6 sm:text-base md:px-8 md:py-4 md:text-lg"
            >
              <span className="relative">{t("cta.button")}</span>
            </button>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap justify-center gap-2.5 text-[11px] text-slate-400 sm:text-xs md:mt-8 md:gap-4 md:text-sm">
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
                  className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-3 md:min-h-[40px] md:px-4 md:py-2"
                >
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === Enhanced SEO Content Section === */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-5 backdrop-blur-sm sm:p-6 md:mt-20 md:p-10 lg:p-12">
          <div className="prose prose-invert max-w-none">
            {/* H2 with primary keyword */}
            <h2 className="mb-4 text-xl font-bold leading-tight text-white sm:text-2xl md:mb-6 md:text-3xl">
              {t("seo_content.title")} - {t("seo_content.title_suffix")}
            </h2>

            <div className="space-y-5 text-sm leading-7 text-slate-300 sm:text-base md:space-y-6 md:leading-8">
              <p>
                {t.rich("seo_content.paragraph_1", {
                  strong_generator: t("seo_content.strong_generator"),
                  strong_crypto: t("seo_content.strong_crypto"),
                  rich: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>

              <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
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

              <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {t("seo_content.key_features_title")}
              </h3>
              <ul className="list-disc space-y-2 pl-5 sm:pl-6">
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

              <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
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

              <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {t("seo_content.why_choose_title")}
              </h3>
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
