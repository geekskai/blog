import { Home, ChevronRight, Shield, Download, Users, AlertTriangle, Car } from "lucide-react"
import { useTranslations } from "next-intl"
import ShareButtons from "@/components/ShareButtons"
import VINGeneratorComponent from "./components/VINGenerator"
import LegalDisclaimer, { UsageRestrictions } from "./components/LegalDisclaimer"
import EducationalContent from "./components/EducationalContent"
import FAQSection from "./components/FAQSection"
import { Link } from "@/app/i18n/navigation"

export default function RandomVINGenerator() {
  const t = useTranslations("RandomVinGenerator")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 sm:text-sm">
          <li>
            <Link href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <li>
            <Link href="/tools" className="hover:text-slate-200">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb.random_vin_generator")}</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header Section */}
        <div className="mb-8 text-center md:mb-10 lg:mb-12">
          {/* Legal Notice Badge */}
          <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="truncate">{t("header.legal_notice_badge")}</span>
          </div>

          {/* Tool Title */}
          <h1 className="mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:mb-4 md:text-4xl lg:text-5xl">
            {t("header.main_title")}
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-7xl px-4 text-sm text-slate-300 sm:text-base md:text-lg">
            {t("header.description")}
          </p>

          {/* Share Component */}
          <div className="mt-4 flex justify-center sm:mt-6">
            <div className="w-full max-w-md rounded-lg bg-slate-800/50 p-3 backdrop-blur-sm sm:p-4">
              <p className="mb-2 text-center text-xs font-medium text-slate-300 sm:mb-3 sm:text-sm">
                {t("header.share_text")}
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-12 lg:items-start">
          {/* Generator Panel */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-8">
            <VINGeneratorComponent />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-4">
            {/* Usage Restrictions */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-base font-semibold text-white sm:text-lg md:text-xl">
                  {t("usage_guidelines.title")}
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <UsageRestrictions />
              </div>
            </div>

            {/* Quick Info */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-base font-semibold text-white sm:text-lg md:text-xl">
                  {t("quick_facts.title")}
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                    <div>
                      <div className="font-medium text-white">
                        {t("quick_facts.format_structure")}
                      </div>
                      <div>{t("quick_facts.format_structure_desc")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-400"></div>
                    <div>
                      <div className="font-medium text-white">{t("quick_facts.character_set")}</div>
                      <div>{t("quick_facts.character_set_desc")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-purple-400"></div>
                    <div>
                      <div className="font-medium text-white">{t("quick_facts.check_digit")}</div>
                      <div>{t("quick_facts.check_digit_desc")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-orange-400"></div>
                    <div>
                      <div className="font-medium text-white">{t("quick_facts.use_cases")}</div>
                      <div>{t("quick_facts.use_cases_desc")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Notice Section - Placed after core functionality */}
        <div className="mt-12 md:mt-16 lg:mt-20">
          <div className="mx-auto">
            <LegalDisclaimer />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 md:mt-16 lg:mt-20">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <Car className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
                {t("features.iso_compliant_title")}
              </h3>
              <p className="text-sm text-slate-400 sm:text-base">
                {t("features.iso_compliant_desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
                {t("features.educational_focus_title")}
              </h3>
              <p className="text-sm text-slate-400 sm:text-base">
                {t("features.educational_focus_desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <Download className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
                {t("features.export_share_title")}
              </h3>
              <p className="text-sm text-slate-400 sm:text-base">
                {t("features.export_share_desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <EducationalContent />

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA Section */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 p-6 text-center md:mt-16 md:p-8 lg:mt-20 lg:p-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex justify-center sm:mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <Users className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </div>
            </div>
            <h2 className="mb-3 text-lg font-bold text-white sm:text-xl md:mb-4 md:text-2xl">
              {t("final_cta.title")}
            </h2>
            <p className="mb-4 px-4 text-sm text-slate-300 sm:text-base md:mb-6">
              {t("final_cta.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400 sm:gap-4 sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400 sm:h-2 sm:w-2"></div>
                <span>{t("final_cta.badge_iso_compliant")}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400 sm:h-2 sm:w-2"></div>
                <span>{t("final_cta.badge_no_registration")}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400 sm:h-2 sm:w-2"></div>
                <span>{t("final_cta.badge_automotive_standards")}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400 sm:h-2 sm:w-2"></div>
                <span>{t("final_cta.badge_export_formats")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
