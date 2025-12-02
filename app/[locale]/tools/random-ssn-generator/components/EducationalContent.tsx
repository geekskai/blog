"use client"

import React from "react"
import { Shield, Book, Code, AlertTriangle } from "lucide-react"
import { useTranslations } from "next-intl"

const EducationalContent = () => {
  const t = useTranslations("RandomSSNGenerator")

  return (
    <div className="mt-20 space-y-16">
      {/* SSN Structure Section */}
      <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("educational_structure_title")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-4 text-slate-200">{t("educational_structure_description_1")}</p>
            <p className="text-slate-200">{t("educational_structure_description_2")}</p>
          </div>
          <div className="rounded-lg bg-blue-900/30 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              {t("educational_structure_breakdown_title")}
            </h3>
            <ul className="space-y-2 text-slate-200">
              <li>
                • <strong>{t("educational_structure_area")}</strong>{" "}
                {t("educational_structure_area_desc")}
              </li>
              <li>
                • <strong>{t("educational_structure_group")}</strong>{" "}
                {t("educational_structure_group_desc")}
              </li>
              <li>
                • <strong>{t("educational_structure_serial")}</strong>{" "}
                {t("educational_structure_serial_desc")}
              </li>
              <li>
                • <strong>{t("educational_structure_format")}</strong>{" "}
                {t("educational_structure_format_desc")}
              </li>
              <li>
                • <strong>{t("educational_structure_length")}</strong>{" "}
                {t("educational_structure_length_desc")}
              </li>
              <li>
                • <strong>{t("educational_structure_charset")}</strong>{" "}
                {t("educational_structure_charset_desc")}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testing Best Practices */}
      <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          {t("educational_best_practices_title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">
                {t("educational_best_practices_security_title")}
              </h3>
            </div>
            <p className="text-slate-200">{t("educational_best_practices_security_desc")}</p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">
                {t("educational_best_practices_testing_title")}
              </h3>
            </div>
            <p className="text-slate-200">{t("educational_best_practices_testing_desc")}</p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">
                {t("educational_best_practices_documentation_title")}
              </h3>
            </div>
            <p className="text-slate-200">{t("educational_best_practices_documentation_desc")}</p>
          </div>
        </div>
      </section>

      {/* Validation Rules */}
      <section className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("educational_validation_title")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              {t("educational_validation_valid_title")}
            </h3>
            <ul className="space-y-2 text-slate-200">
              <li>✅ {t("educational_validation_valid_1")}</li>
              <li>✅ {t("educational_validation_valid_2")}</li>
              <li>✅ {t("educational_validation_valid_3")}</li>
              <li>✅ {t("educational_validation_valid_4")}</li>
              <li>✅ {t("educational_validation_valid_5")}</li>
              <li>✅ {t("educational_validation_valid_6")}</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              {t("educational_validation_invalid_title")}
            </h3>
            <ul className="space-y-2 text-slate-200">
              <li>❌ {t("educational_validation_invalid_1")}</li>
              <li>❌ {t("educational_validation_invalid_2")}</li>
              <li>❌ {t("educational_validation_invalid_3")}</li>
              <li>❌ {t("educational_validation_invalid_4")}</li>
              <li>❌ {t("educational_validation_invalid_5")}</li>
              <li>❌ {t("educational_validation_invalid_6")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("educational_use_cases_title")}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-orange-900/30 p-4">
            <h3 className="mb-2 font-semibold text-white">
              🧪 {t("educational_use_cases_qa_title")}
            </h3>
            <p className="text-sm text-slate-200">{t("educational_use_cases_qa_desc")}</p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-4">
            <h3 className="mb-2 font-semibold text-white">
              🎓 {t("educational_use_cases_education_title")}
            </h3>
            <p className="text-sm text-slate-200">{t("educational_use_cases_education_desc")}</p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-4">
            <h3 className="mb-2 font-semibold text-white">
              🔧 {t("educational_use_cases_development_title")}
            </h3>
            <p className="text-sm text-slate-200">{t("educational_use_cases_development_desc")}</p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-4">
            <h3 className="mb-2 font-semibold text-white">
              📊 {t("educational_use_cases_analytics_title")}
            </h3>
            <p className="text-sm text-slate-200">{t("educational_use_cases_analytics_desc")}</p>
          </div>
        </div>
      </section>

      {/* Privacy and Ethics */}
      <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">{t("educational_privacy_title")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">
                {t("educational_privacy_legal_title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("educational_privacy_legal_desc")}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">
                {t("educational_privacy_data_title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("educational_privacy_data_desc")}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                {t("educational_privacy_ethical_title")}
              </h3>
            </div>
            <p className="text-slate-300">{t("educational_privacy_ethical_desc")}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EducationalContent
