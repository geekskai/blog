import React from "react"
import { AlertTriangle, Shield } from "lucide-react"
import { useTranslations } from "next-intl"

const LegalDisclaimer = () => {
  const t = useTranslations("RandomVinGenerator.legal_disclaimer")
  return (
    <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">{t("title")}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">✅ {t("approved_uses")}</h3>
          <ul className="space-y-2 text-slate-200">
            <li>✅ {t("approved_automotive_testing")}</li>
            <li>✅ {t("approved_vehicle_database")}</li>
            <li>✅ {t("approved_educational_research")}</li>
            <li>✅ {t("approved_application_validation")}</li>
            <li>✅ {t("approved_developer_integration")}</li>
            <li>✅ {t("approved_academic_coursework")}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">❌ {t("prohibited_uses")}</h3>
          <ul className="space-y-2 text-slate-200">
            <li>❌ {t("prohibited_vehicle_fraud")}</li>
            <li>❌ {t("prohibited_illegal_transactions")}</li>
            <li>❌ {t("prohibited_insurance_fraud")}</li>
            <li>❌ {t("prohibited_registration_deception")}</li>
            <li>❌ {t("prohibited_vin_cloning")}</li>
            <li>❌ {t("prohibited_vehicle_impersonation")}</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-lg bg-red-900/30 p-4">
        <p className="text-sm text-slate-200">
          <strong className="text-red-300">{t("legal_disclaimer")}</strong>{" "}
          {t("legal_disclaimer_text")}
        </p>
      </div>
    </section>
  )
}

export const UsageRestrictions = () => {
  const t = useTranslations("RandomVinGenerator.usage_guidelines")

  return (
    <div className="mt-6 rounded-lg bg-slate-800 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Shield className="h-5 w-5 text-green-400" />
        <h4 className="font-medium text-green-300">{t("approved_uses")}</h4>
      </div>
      <ul className="mb-4 space-y-1 text-sm text-slate-300">
        <li>✅ {t("approved_automotive_testing")}</li>
        <li>✅ {t("approved_database_development")}</li>
        <li>✅ {t("approved_educational_research")}</li>
        <li>✅ {t("approved_vin_validation")}</li>
        <li>✅ {t("approved_application_development")}</li>
        <li>✅ {t("approved_form_validation")}</li>
      </ul>

      <div className="mb-3 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <h4 className="font-medium text-red-300">{t("prohibited_uses")}</h4>
      </div>
      <ul className="space-y-1 text-sm text-slate-300">
        <li>❌ {t("prohibited_vehicle_fraud")}</li>
        <li>❌ {t("prohibited_insurance_fraud")}</li>
        <li>❌ {t("prohibited_title_forgery")}</li>
        <li>❌ {t("prohibited_registration_fraud")}</li>
        <li>❌ {t("prohibited_sales_misrepresentation")}</li>
        <li>❌ {t("prohibited_illegal_activities")}</li>
      </ul>
    </div>
  )
}

export default LegalDisclaimer
