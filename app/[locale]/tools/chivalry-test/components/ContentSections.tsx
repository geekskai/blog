import React from "react"
import { Shield, Sparkles, Users, CheckCircle, HelpCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export const ContentSections: React.FC = () => {
  const t = useTranslations("ChivalryTest")

  return (
    <>
      {/* Modern Features Section */}
      <div className="mt-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">{t("what_test_measures")}</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">
            {t("what_test_measures_description")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Shield className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">{t("modern_mode")}</h3>
            <p className="text-lg leading-relaxed text-slate-400">{t("modern_mode_description")}</p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Sparkles className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">{t("knight_mode")}</h3>
            <p className="text-lg leading-relaxed text-slate-400">{t("knight_mode_description")}</p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Users className="h-12 w-12 text-emerald-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">{t("your_traits")}</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              {t("what_test_measures_description")}
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections for SEO - Modern Design */}
      <div className="mt-40 space-y-24">
        {/* About Section */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10"></div>
          <div className="relative z-10">
            <h2 className="mb-8 text-3xl font-bold text-white">{t("title")}</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-6 text-lg leading-relaxed text-slate-300">{t("subtitle")}</p>
                <p className="text-lg leading-relaxed text-slate-300">
                  {t("what_test_measures_description")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-6 flex items-center text-xl font-semibold text-white">
                  <Sparkles className="mr-3 h-6 w-6 text-blue-400" />
                  {t("what_test_measures")}
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                    Courtesy
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-purple-400"></div>
                    Respect
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-emerald-400"></div>
                    Integrity
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-orange-400"></div>
                    Courage
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-pink-400"></div>
                    Loyalty
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What This Test Measures */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">{t("what_test_measures")}</h2>
          </div>
          <div className="mb-6">
            <p className="text-lg leading-relaxed text-slate-300">
              {t("what_test_measures_description")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {(["courtesy", "respect", "integrity", "courage", "loyalty"] as const).map((trait) => (
              <div
                key={trait}
                className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <h3 className="mb-2 font-semibold capitalize text-white">{trait}</h3>
                <p className="text-sm text-slate-400">{t("what_test_measures_description")}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="rounded-2xl bg-slate-800/90 p-10 shadow-2xl backdrop-blur-sm">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">{t("faq_title")}</h2>
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                <HelpCircle className="mr-2 h-5 w-5 text-blue-400" />
                {t("faq_what_is_chivalry")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("faq_what_is_chivalry_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                <HelpCircle className="mr-2 h-5 w-5 text-purple-400" />
                {t("faq_still_relevant")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("faq_still_relevant_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                <HelpCircle className="mr-2 h-5 w-5 text-emerald-400" />
                {t("faq_test_accurate")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("faq_test_accurate_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                <HelpCircle className="mr-2 h-5 w-5 text-orange-400" />
                {t("faq_women_take")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("faq_women_take_answer")}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                <HelpCircle className="mr-2 h-5 w-5 text-pink-400" />
                {t("faq_help_improve")}
              </h3>
              <p className="leading-relaxed text-slate-300">{t("faq_help_improve_answer")}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
