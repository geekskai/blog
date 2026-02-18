import React from "react"
import { Shield, Book, Code, AlertTriangle, Car, Wrench } from "lucide-react"
import { useTranslations } from "next-intl"

const EducationalContent = () => {
  const t = useTranslations("RandomVinGenerator.educational_content")
  return (
    <div className="mt-12 space-y-8 sm:space-y-12 md:mt-16 md:space-y-16 lg:mt-20">
      {/* VIN Structure Section */}
      <section className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-4 sm:p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
          {t("vin_structure_title")}
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs text-slate-200 sm:text-sm md:mb-4 md:text-base">
              {t("vin_structure_desc")}
            </p>
            <p className="text-xs text-slate-200 sm:text-sm md:text-base">
              {t("vin_structure_desc2")}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-900/30 p-4 sm:p-6">
            <h3 className="mb-2 text-base font-semibold text-white sm:mb-3 sm:text-lg">
              {t("character_positions")}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-200 sm:space-y-2 sm:text-sm md:text-base">
              <li>
                • <strong>{t("positions_1_3")}</strong> {t("positions_1_3_desc")}
              </li>
              <li>
                • <strong>{t("positions_4_8")}</strong> {t("positions_4_8_desc")}
              </li>
              <li>
                • <strong>{t("position_9")}</strong> {t("position_9_desc")}
              </li>
              <li>
                • <strong>{t("position_10")}</strong> {t("position_10_desc")}
              </li>
              <li>
                • <strong>{t("position_11")}</strong> {t("position_11_desc")}
              </li>
              <li>
                • <strong>{t("positions_12_17")}</strong> {t("positions_12_17_desc")}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* VIN Validation */}
      <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-4 sm:p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
          {t("validation_title")}
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-orange-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Code className="h-4 w-4 flex-shrink-0 text-orange-300 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("check_digit_algorithm")}
              </h3>
            </div>
            <p className="text-xs text-slate-200 sm:text-sm md:text-base">
              {t("check_digit_algorithm_desc")}
            </p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Car className="h-4 w-4 flex-shrink-0 text-orange-300 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("manufacturer_codes")}
              </h3>
            </div>
            <p className="text-xs text-slate-200 sm:text-sm md:text-base">
              {t("manufacturer_codes_desc")}
            </p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Wrench className="h-4 w-4 flex-shrink-0 text-orange-300 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("year_encoding")}
              </h3>
            </div>
            <p className="text-xs text-slate-200 sm:text-sm md:text-base">
              {t("year_encoding_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Testing Best Practices */}
      <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-4 sm:p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
          {t("testing_best_practices")}
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-purple-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Shield className="h-4 w-4 flex-shrink-0 text-purple-300 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("security_first")}
              </h3>
            </div>
            <p className="text-xs text-slate-200 sm:text-sm md:text-base">
              {t("security_first_desc")}
            </p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Code className="h-4 w-4 flex-shrink-0 text-purple-300 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("testing_scenarios")}
              </h3>
            </div>
            <p className="text-xs text-slate-200 sm:text-sm md:text-base">
              {t("testing_scenarios_desc")}
            </p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Book className="h-4 w-4 flex-shrink-0 text-purple-300 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("documentation")}
              </h3>
            </div>
            <p className="text-xs text-slate-200 sm:text-sm md:text-base">
              {t("documentation_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* VIN Character Rules */}
      <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-4 sm:p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
          {t("character_rules_title")}
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
              {t("valid_characteristics")}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-200 sm:space-y-2 sm:text-sm md:text-base">
              <li>✅ {t("valid_17_chars")}</li>
              <li>✅ {t("valid_chars")}</li>
              <li>✅ {t("valid_excludes")}</li>
              <li>✅ {t("valid_check_digit")}</li>
              <li>✅ {t("valid_wmi")}</li>
              <li>✅ {t("valid_year_code")}</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
              {t("invalid_patterns")}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-200 sm:space-y-2 sm:text-sm md:text-base">
              <li>❌ {t("invalid_ioq")}</li>
              <li>❌ {t("invalid_length")}</li>
              <li>❌ {t("invalid_check_digit")}</li>
              <li>❌ {t("invalid_manufacturer")}</li>
              <li>❌ {t("invalid_special_chars")}</li>
              <li>❌ {t("invalid_lowercase")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-4 sm:p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
          {t("use_cases_title")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-800 p-3 sm:p-4">
            <h3 className="mb-1.5 text-sm font-semibold text-white sm:mb-2 sm:text-base">
              🚗 {t("automotive_testing")}
            </h3>
            <p className="text-xs text-slate-200 sm:text-sm">{t("automotive_testing_desc")}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-3 sm:p-4">
            <h3 className="mb-1.5 text-sm font-semibold text-white sm:mb-2 sm:text-base">
              🏫 {t("education")}
            </h3>
            <p className="text-xs text-slate-200 sm:text-sm">{t("education_desc")}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-3 sm:p-4">
            <h3 className="mb-1.5 text-sm font-semibold text-white sm:mb-2 sm:text-base">
              🔧 {t("development")}
            </h3>
            <p className="text-xs text-slate-200 sm:text-sm">{t("development_desc")}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-3 sm:p-4">
            <h3 className="mb-1.5 text-sm font-semibold text-white sm:mb-2 sm:text-base">
              📊 {t("analytics")}
            </h3>
            <p className="text-xs text-slate-200 sm:text-sm">{t("analytics_desc")}</p>
          </div>
        </div>
      </section>

      {/* Automotive Compliance */}
      <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-4 sm:p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
          {t("compliance_title")}
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-green-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-yellow-400 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("iso_standard")}
              </h3>
            </div>
            <p className="text-xs text-slate-300 sm:text-sm md:text-base">
              {t("iso_standard_desc")}
            </p>
          </div>
          <div className="rounded-lg bg-green-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Shield className="h-4 w-4 flex-shrink-0 text-green-400 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("data_protection")}
              </h3>
            </div>
            <p className="text-xs text-slate-300 sm:text-sm md:text-base">
              {t("data_protection_desc")}
            </p>
          </div>
          <div className="rounded-lg bg-green-900/30 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Book className="h-4 w-4 flex-shrink-0 text-blue-400 sm:h-5 sm:w-5" />
              <h3 className="text-sm font-semibold text-white sm:text-base md:text-lg">
                {t("ethical_usage")}
              </h3>
            </div>
            <p className="text-xs text-slate-300 sm:text-sm md:text-base">
              {t("ethical_usage_desc")}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EducationalContent
