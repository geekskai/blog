import React from "react"
import { Type, Palette, Download, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export const ContentSections: React.FC = () => {
  const t = useTranslations("InvincibleTitleCardGenerator")
  return (
    <>
      {/* Modern Features Section */}
      <div className="mt-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t("content.professional_features")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">
            {t("content.features_description")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Type className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">
              {t("content.advanced_typography")}
            </h3>
            <p className="text-lg leading-relaxed text-slate-400">
              {t("content.typography_description")}
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Palette className="h-12 w-12 text-yellow-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">
              {t("content.character_presets_feature")}
            </h3>
            <p className="text-lg leading-relaxed text-slate-400">
              {t("content.presets_description")}
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Download className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">
              {t("content.studio_export_quality")}
            </h3>
            <p className="text-lg leading-relaxed text-slate-400">
              {t("content.export_description")}
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections for SEO - Modern Design */}
      <div className="mt-40 space-y-24">
        {/* About Section */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10"></div>
          <div className="relative z-10">
            <h2 className="mb-8 text-3xl font-bold text-white">
              {t("content.create_professional_title")}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-6 text-lg leading-relaxed text-slate-300">
                  {t("content.about_description_1")}
                </p>
                <p className="text-lg leading-relaxed text-slate-300">
                  {t("content.about_description_2")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-6 flex items-center text-xl font-semibold text-white">
                  <Sparkles className="mr-3 h-6 w-6 text-yellow-400" />
                  {t("content.premium_features")}
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    {t("content.feature_character_presets")}
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    {t("content.feature_text_customization")}
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    {t("content.feature_gradient_backgrounds")}
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    {t("content.feature_high_resolution")}
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    {t("content.feature_real_time_preview")}
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    {t("content.feature_save_configurations")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            {t("content.how_to_create_title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t("content.step_1_title")}</h3>
              <p className="text-slate-400">{t("content.step_1_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t("content.step_2_title")}</h3>
              <p className="text-slate-400">{t("content.step_2_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t("content.step_3_title")}</h3>
              <p className="text-slate-400">{t("content.step_3_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t("content.step_4_title")}</h3>
              <p className="text-slate-400">{t("content.step_4_description")}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="rounded-2xl bg-slate-800/90 p-10 shadow-2xl backdrop-blur-sm">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            {t("content.faq_title")}
          </h2>
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                {t("content.faq_1_question")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("content.faq_1_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                {t("content.faq_2_question")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("content.faq_2_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                {t("content.faq_3_question")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("content.faq_3_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                {t("content.faq_4_question")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("content.faq_4_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                {t("content.faq_5_question")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("content.faq_5_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                {t("content.faq_6_question")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("content.faq_6_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                {t("content.faq_7_question")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("content.faq_7_answer")}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
