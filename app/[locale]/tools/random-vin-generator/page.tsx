import { Home, ChevronRight, Shield, Download, Users, AlertTriangle, Car } from "lucide-react"
import { useTranslations } from "next-intl"
import ShareButtons from "@/components/ShareButtons"
import VINGeneratorComponent from "./components/VINGenerator"
import LegalDisclaimer, { UsageRestrictions } from "./components/LegalDisclaimer"
import EducationalContent from "./components/EducationalContent"
import FAQSection from "./components/FAQSection"

export default function RandomVINGenerator() {
  const t = useTranslations("RandomVinGenerator")

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
          <li className="font-medium text-slate-100">{t("breadcrumb.random_vin_generator")}</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          {/* Legal Notice Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {t("header.legal_notice_badge")}
          </div>

          {/* Tool Title */}
          <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
            {t("header.main_title")}
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg text-slate-300">{t("header.description")}</p>

          {/* Share Component */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
              <p className="mb-3 text-center text-sm font-medium text-slate-300">
                {t("header.share_text")}
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Generator Panel */}
          <div className="space-y-6 lg:col-span-8">
            <VINGeneratorComponent />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Usage Restrictions */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">{t("usage_guidelines.title")}</h2>
              </div>
              <div className="p-6">
                <UsageRestrictions />
              </div>
            </div>

            {/* Quick Info */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">{t("quick_facts.title")}</h2>
              </div>
              <div className="p-6">
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
        <div className="mt-16">
          <div className="mx-auto">
            <LegalDisclaimer />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.iso_compliant_title")}
              </h3>
              <p className="text-slate-400">{t("features.iso_compliant_desc")}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.educational_focus_title")}
              </h3>
              <p className="text-slate-400">{t("features.educational_focus_desc")}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features.export_share_title")}
              </h3>
              <p className="text-slate-400">{t("features.export_share_desc")}</p>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <EducationalContent />

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA Section */}
        <div className="mt-20 rounded-xl bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 p-8 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">{t("final_cta.title")}</h2>
            <p className="mb-6 text-slate-300">{t("final_cta.description")}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>{t("final_cta.badge_iso_compliant")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span>{t("final_cta.badge_no_registration")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span>{t("final_cta.badge_automotive_standards")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                <span>{t("final_cta.badge_export_formats")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
