import React from "react"
import { Shield, Book, Code, AlertTriangle, Car, Wrench } from "lucide-react"
import { useTranslations } from "next-intl"

const EducationalContent = () => {
  const t = useTranslations("RandomVinGenerator.educational_content")
  return (
    <div className="mt-20 space-y-16">
      {/* VIN Structure Section */}
      <section className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("vin_structure_title")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-4 text-slate-200">{t("vin_structure_desc")}</p>
            <p className="text-slate-200">{t("vin_structure_desc2")}</p>
          </div>
          <div className="rounded-lg bg-emerald-900/30 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">{t("character_positions")}</h3>
            <ul className="space-y-2 text-slate-200">
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
      <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("validation_title")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-orange-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Code className="h-5 w-5 text-orange-300" />
              <h3 className="text-lg font-semibold text-white">{t("check_digit_algorithm")}</h3>
            </div>
            <p className="text-slate-200">{t("check_digit_algorithm_desc")}</p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Car className="h-5 w-5 text-orange-300" />
              <h3 className="text-lg font-semibold text-white">{t("manufacturer_codes")}</h3>
            </div>
            <p className="text-slate-200">{t("manufacturer_codes_desc")}</p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-300" />
              <h3 className="text-lg font-semibold text-white">{t("year_encoding")}</h3>
            </div>
            <p className="text-slate-200">{t("year_encoding_desc")}</p>
          </div>
        </div>
      </section>

      {/* Testing Best Practices */}
      <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("testing_best_practices")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">{t("security_first")}</h3>
            </div>
            <p className="text-slate-200">{t("security_first_desc")}</p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">{t("testing_scenarios")}</h3>
            </div>
            <p className="text-slate-200">{t("testing_scenarios_desc")}</p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">{t("documentation")}</h3>
            </div>
            <p className="text-slate-200">{t("documentation_desc")}</p>
          </div>
        </div>
      </section>

      {/* VIN Character Rules */}
      <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("character_rules_title")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{t("valid_characteristics")}</h3>
            <ul className="space-y-2 text-slate-200">
              <li>✅ {t("valid_17_chars")}</li>
              <li>✅ {t("valid_chars")}</li>
              <li>✅ {t("valid_excludes")}</li>
              <li>✅ {t("valid_check_digit")}</li>
              <li>✅ {t("valid_wmi")}</li>
              <li>✅ {t("valid_year_code")}</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{t("invalid_patterns")}</h3>
            <ul className="space-y-2 text-slate-200">
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
      <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("use_cases_title")}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-semibold text-white">🚗 {t("automotive_testing")}</h3>
            <p className="text-sm text-slate-200">{t("automotive_testing_desc")}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-semibold text-white">🏫 {t("education")}</h3>
            <p className="text-sm text-slate-200">{t("education_desc")}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-semibold text-white">🔧 {t("development")}</h3>
            <p className="text-sm text-slate-200">{t("development_desc")}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-semibold text-white">📊 {t("analytics")}</h3>
            <p className="text-sm text-slate-200">{t("analytics_desc")}</p>
          </div>
        </div>
      </section>

      {/* Automotive Compliance */}
      <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("compliance_title")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-green-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">{t("iso_standard")}</h3>
            </div>
            <p className="text-slate-300">{t("iso_standard_desc")}</p>
          </div>
          <div className="rounded-lg bg-green-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">{t("data_protection")}</h3>
            </div>
            <p className="text-slate-300">{t("data_protection_desc")}</p>
          </div>
          <div className="rounded-lg bg-green-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">{t("ethical_usage")}</h3>
            </div>
            <p className="text-slate-300">{t("ethical_usage_desc")}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EducationalContent
