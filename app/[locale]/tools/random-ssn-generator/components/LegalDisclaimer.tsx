"use client"

import React from "react"
import { AlertTriangle, Shield } from "lucide-react"
import { useTranslations } from "next-intl"

const LegalDisclaimer = () => {
  const t = useTranslations("RandomSSNGenerator")

  return (
    <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">{t("legal_disclaimer_title")}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            ✅ {t("legal_approved_uses_title")}
          </h3>
          <ul className="space-y-2 text-slate-200">
            <li>✅ {t("legal_approved_use_1")}</li>
            <li>✅ {t("legal_approved_use_2")}</li>
            <li>✅ {t("legal_approved_use_3")}</li>
            <li>✅ {t("legal_approved_use_4")}</li>
            <li>✅ {t("legal_approved_use_5")}</li>
            <li>✅ {t("legal_approved_use_6")}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            ❌ {t("legal_prohibited_uses_title")}
          </h3>
          <ul className="space-y-2 text-slate-200">
            <li>❌ {t("legal_prohibited_use_1")}</li>
            <li>❌ {t("legal_prohibited_use_2")}</li>
            <li>❌ {t("legal_prohibited_use_3")}</li>
            <li>❌ {t("legal_prohibited_use_4")}</li>
            <li>❌ {t("legal_prohibited_use_5")}</li>
            <li>❌ {t("legal_prohibited_use_6")}</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-lg bg-red-900/30 p-4">
        <p className="text-sm text-slate-200">
          <strong className="text-red-300">{t("legal_disclaimer_text")}</strong>{" "}
          {t("legal_disclaimer_content")}
        </p>
      </div>
    </section>
  )
}

export const UsageRestrictions = () => {
  const t = useTranslations("RandomSSNGenerator")

  return (
    <div className="mt-6 rounded-lg bg-slate-800 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Shield className="h-5 w-5 text-green-400" />
        <h4 className="font-medium text-green-300">{t("usage_restrictions_approved_title")}</h4>
      </div>
      <ul className="mb-4 space-y-1 text-sm text-slate-300">
        <li>✅ {t("usage_restrictions_approved_1")}</li>
        <li>✅ {t("usage_restrictions_approved_2")}</li>
        <li>✅ {t("usage_restrictions_approved_3")}</li>
        <li>✅ {t("usage_restrictions_approved_4")}</li>
        <li>✅ {t("usage_restrictions_approved_5")}</li>
        <li>✅ {t("usage_restrictions_approved_6")}</li>
      </ul>

      <div className="mb-3 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <h4 className="font-medium text-red-300">{t("usage_restrictions_prohibited_title")}</h4>
      </div>
      <ul className="space-y-1 text-sm text-slate-300">
        <li>❌ {t("usage_restrictions_prohibited_1")}</li>
        <li>❌ {t("usage_restrictions_prohibited_2")}</li>
        <li>❌ {t("usage_restrictions_prohibited_3")}</li>
        <li>❌ {t("usage_restrictions_prohibited_4")}</li>
        <li>❌ {t("usage_restrictions_prohibited_5")}</li>
        <li>❌ {t("usage_restrictions_prohibited_6")}</li>
      </ul>
    </div>
  )
}

export default LegalDisclaimer
