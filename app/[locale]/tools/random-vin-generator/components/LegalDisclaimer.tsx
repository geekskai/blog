import React from "react"
import { AlertTriangle, Shield } from "lucide-react"
import { useTranslations } from "next-intl"

const LegalDisclaimer = () => {
  const t = useTranslations("RandomVinGenerator.legal_disclaimer")
  return (
    <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-4 sm:p-6 md:p-8">
      <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
        {t("title")}
      </h2>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
            ✅ {t("approved_uses")}
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-200 sm:space-y-2 sm:text-sm md:text-base">
            <li>✅ {t("approved_automotive_testing")}</li>
            <li>✅ {t("approved_vehicle_database")}</li>
            <li>✅ {t("approved_educational_research")}</li>
            <li>✅ {t("approved_application_validation")}</li>
            <li>✅ {t("approved_developer_integration")}</li>
            <li>✅ {t("approved_academic_coursework")}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
            ❌ {t("prohibited_uses")}
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-200 sm:space-y-2 sm:text-sm md:text-base">
            <li>❌ {t("prohibited_vehicle_fraud")}</li>
            <li>❌ {t("prohibited_illegal_transactions")}</li>
            <li>❌ {t("prohibited_insurance_fraud")}</li>
            <li>❌ {t("prohibited_registration_deception")}</li>
            <li>❌ {t("prohibited_vin_cloning")}</li>
            <li>❌ {t("prohibited_vehicle_impersonation")}</li>
          </ul>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-red-900/30 p-3 sm:mt-6 sm:p-4">
        <p className="text-xs leading-relaxed text-slate-200 sm:text-sm md:text-base">
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
    <div className="rounded-lg bg-slate-800/50 p-3 sm:p-4">
      <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
        <Shield className="h-4 w-4 flex-shrink-0 text-green-400 sm:h-5 sm:w-5" />
        <h4 className="text-sm font-medium text-green-300 sm:text-base">{t("approved_uses")}</h4>
      </div>
      <ul className="mb-3 space-y-1 text-xs text-slate-300 sm:mb-4 sm:text-sm">
        <li>✅ {t("approved_automotive_testing")}</li>
        <li>✅ {t("approved_database_development")}</li>
        <li>✅ {t("approved_educational_research")}</li>
        <li>✅ {t("approved_vin_validation")}</li>
        <li>✅ {t("approved_application_development")}</li>
        <li>✅ {t("approved_form_validation")}</li>
      </ul>

      <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-400 sm:h-5 sm:w-5" />
        <h4 className="text-sm font-medium text-red-300 sm:text-base">{t("prohibited_uses")}</h4>
      </div>
      <ul className="space-y-1 text-xs text-slate-300 sm:text-sm">
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
