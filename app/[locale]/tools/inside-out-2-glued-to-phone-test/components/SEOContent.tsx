"use client"

import React from "react"
// import { FAQ } from "./FAQ"
import { Link } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"

export const SEOContent: React.FC = () => {
  const t = useTranslations("InsideOut2GluedToPhoneTest")
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Core Facts Section - AI提取优化 */}
      <section className="mb-16 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 backdrop-blur-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">{t("seo_core_title")}</h2>
        <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-2 text-lg font-semibold text-white">{t("seo_core_pricing")}</dt>
            <dd className="text-xl font-bold text-blue-400">
              {t.rich("seo_core_pricing_value", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-2 text-lg font-semibold text-white">{t("seo_core_features")}</dt>
            <dd className="text-slate-300">
              {t.rich("seo_core_features_value", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-2 text-lg font-semibold text-white">{t("seo_core_positioning")}</dt>
            <dd className="text-slate-300">
              {t.rich("seo_core_positioning_value", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-2 text-lg font-semibold text-white">{t("seo_core_target")}</dt>
            <dd className="text-slate-300">
              {t.rich("seo_core_target_value", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </dd>
          </div>
        </dl>
      </section>

      {/* Features Section */}
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">{t("page_features_title")}</h2>
        <p className="mx-auto max-w-2xl text-xl text-slate-400">{t("page_features_subtitle")}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="group text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
            <span className="text-4xl">🧠</span>
          </div>
          <h3 className="mb-6 text-xl font-semibold text-white">{t("page_feature_1_title")}</h3>
          <p className="text-lg leading-relaxed text-slate-400">
            {t.rich("page_feature_1_desc", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
          </p>
        </div>

        <div className="group text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
            <span className="text-4xl">📱</span>
          </div>
          <h3 className="mb-6 text-xl font-semibold text-white">{t("page_feature_2_title")}</h3>
          <p className="text-lg leading-relaxed text-slate-400">
            {t.rich("page_feature_2_desc", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
          </p>
        </div>

        <div className="group text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
            <span className="text-4xl">💡</span>
          </div>
          <h3 className="mb-6 text-xl font-semibold text-white">{t("page_feature_3_title")}</h3>
          <p className="text-lg leading-relaxed text-slate-400">
            {t.rich("page_feature_3_desc", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">{t("page_how_it_works_title")}</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">
            {t("page_how_it_works_subtitle")}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
              1
            </div>
            <h3 className="mb-3 text-lg font-semibold text-white">{t("page_step_1_title")}</h3>
            <p className="text-slate-400">{t("page_step_1_desc")}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
              2
            </div>
            <h3 className="mb-3 text-lg font-semibold text-white">{t("page_step_2_title")}</h3>
            <p className="text-slate-400">{t("page_step_2_desc")}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
              3
            </div>
            <h3 className="mb-3 text-lg font-semibold text-white">{t("page_step_3_title")}</h3>
            <p className="text-slate-400">{t("page_step_3_desc")}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
              4
            </div>
            <h3 className="mb-3 text-lg font-semibold text-white">{t("page_step_4_title")}</h3>
            <p className="text-slate-400">{t("page_step_4_desc")}</p>
          </div>
        </div>
      </div>

      {/* Educational Content Sections */}
      <div className="mt-20 space-y-16">
        {/* What is Phone Addiction Section */}
        <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("page_phone_addiction_title")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-4 text-slate-200">
                {t.rich("page_phone_addiction_text_1", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
              <p className="text-slate-200">
                {t.rich("page_phone_addiction_text_2", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="rounded-lg bg-blue-900/30 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("page_phone_addiction_signs_title")}
              </h3>
              <ul className="space-y-2 text-slate-200">
                <li>• {t("page_phone_addiction_sign_1")}</li>
                <li>• {t("page_phone_addiction_sign_2")}</li>
                <li>• {t("page_phone_addiction_sign_3")}</li>
                <li>• {t("page_phone_addiction_sign_4")}</li>
                <li>• {t("page_phone_addiction_sign_5")}</li>
                <li>• {t("page_phone_addiction_sign_6")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Inside Out 2 Emotions and Phone Habits */}
        <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("page_emotions_title")}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-purple-900/30 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("page_emotion_joy_title")}
              </h3>
              <div className="space-y-2 text-slate-200">
                <p>
                  {t.rich("page_emotion_joy_text_1", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich("page_emotion_joy_pattern", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-purple-900/30 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("page_emotion_anxiety_title")}
              </h3>
              <div className="space-y-2 text-slate-200">
                <p>
                  {t.rich("page_emotion_anxiety_text_1", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich("page_emotion_anxiety_pattern", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-purple-900/30 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t("page_emotion_sadness_title")}
              </h3>
              <div className="space-y-2 text-slate-200">
                <p>
                  {t.rich("page_emotion_sadness_text_1", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich("page_emotion_sadness_pattern", {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Phone Addiction vs Healthy Usage */}
        <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">
            {t("page_addiction_vs_healthy_title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-green-900/30 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                {t("page_addiction_signs_title")}
              </h3>
              <p className="mb-4 text-slate-200">
                {t.rich("page_addiction_signs_text", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
              <ul className="space-y-2 text-slate-200">
                <li>• {t("page_addiction_sign_1")}</li>
                <li>• {t("page_addiction_sign_2")}</li>
                <li>• {t("page_addiction_sign_3")}</li>
                <li>• {t("page_addiction_sign_4")}</li>
                <li>• {t("page_addiction_sign_5")}</li>
              </ul>
            </div>
            <div className="rounded-lg bg-green-900/30 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">{t("page_healthy_title")}</h3>
              <p className="mb-4 text-slate-200">
                {t.rich("page_healthy_text", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
              <ul className="space-y-2 text-slate-200">
                <li>• {t("page_healthy_habit_1")}</li>
                <li>• {t("page_healthy_habit_2")}</li>
                <li>• {t("page_healthy_habit_3")}</li>
                <li>• {t("page_healthy_habit_4")}</li>
                <li>• {t("page_healthy_habit_5")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="rounded-xl bg-slate-800 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("page_faq_title")}</h2>
          <div className="space-y-6">
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("page_faq_accuracy_question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("page_faq_accuracy_answer", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("page_faq_meaning_question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("page_faq_meaning_answer", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("page_faq_emotions_question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("page_faq_emotions_answer", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("page_faq_help_question")}
              </h3>
              <p className="text-slate-400">
                {t.rich("page_faq_help_answer", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Related Tools Section - Internal Linking */}
      <section className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-8 backdrop-blur-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          {t("seo_related_tools_title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/tools"
            className="group rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-blue-400">
              {t("seo_related_tools_all")}
            </h3>
            <p className="text-sm text-slate-400">{t("seo_related_tools_all_desc")}</p>
          </Link>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              {t("seo_related_tools_digital")}
            </h3>
            <p className="text-sm text-slate-400">{t("seo_related_tools_digital_desc")}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              {t("seo_related_tools_psychology")}
            </h3>
            <p className="text-sm text-slate-400">{t("seo_related_tools_psychology_desc")}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
