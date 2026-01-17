"use client"

import React from "react"
import { Home, ChevronRight, Shield, Zap, Download, Users, AlertTriangle } from "lucide-react"
import { useTranslations } from "next-intl"
import ShareButtons from "@/components/ShareButtons"
import LegalDisclaimer, { UsageRestrictions } from "./components/LegalDisclaimer"
import SSNGeneratorComponent from "./components/SSNGenerator"
import EducationalContent from "./components/EducationalContent"
import FAQSection from "./components/FAQSection"
import { Link } from "@/app/i18n/navigation"

export default function RandomSSNGenerator() {
  const t = useTranslations("RandomSSNGenerator")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb_home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="hover:text-slate-200">
              {t("breadcrumb_tools")}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb_title")}</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          {/* Legal Notice Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {t("legal_notice_badge")}
          </div>

          {/* Tool Title */}
          <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
            {t("page_title")}
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg text-slate-300">{t("page_description")}</p>

          {/* Share Component */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
              <p className="mb-3 text-center text-sm font-medium text-slate-300">
                {t("share_title")}
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Generator Panel */}
          <div className="space-y-6 lg:col-span-8">
            <SSNGeneratorComponent />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Usage Restrictions */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  {t("sidebar_usage_guidelines")}
                </h2>
              </div>
              <div className="p-6">
                <UsageRestrictions />
              </div>
            </div>

            {/* Quick Info */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">{t("sidebar_quick_facts")}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-400"></div>
                    <div>
                      <div className="font-medium text-white">
                        {t("quick_facts_format_structure")}
                      </div>
                      <div>{t("quick_facts_format_value")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                    <div>
                      <div className="font-medium text-white">
                        {t("quick_facts_validation_rules")}
                      </div>
                      <div>{t("quick_facts_validation_value")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-purple-400"></div>
                    <div>
                      <div className="font-medium text-white">{t("quick_facts_character_set")}</div>
                      <div>{t("quick_facts_character_value")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-orange-400"></div>
                    <div>
                      <div className="font-medium text-white">{t("quick_facts_use_cases")}</div>
                      <div>{t("quick_facts_use_cases_value")}</div>
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features_instant_title")}
              </h3>
              <p className="text-slate-400">{t("features_instant_description")}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features_educational_title")}
              </h3>
              <p className="text-slate-400">{t("features_educational_description")}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("features_export_title")}
              </h3>
              <p className="text-slate-400">{t("features_export_description")}</p>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <EducationalContent />

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA Section */}
        <div className="mt-20 rounded-xl bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 p-8 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">{t("cta_title")}</h2>
            <p className="mb-6 text-slate-300">{t("cta_description")}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>{t("cta_free_forever")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span>{t("cta_no_registration")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span>{t("cta_educational_content")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                <span>{t("cta_multiple_formats")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
