"use client"

import React from "react"
import { Shield, Code, Lock, Gamepad2, GraduationCap } from "lucide-react"
import { useTranslations } from "next-intl"

const UseCases = () => {
  const t = useTranslations("Random4DigitNumberGenerator.use_cases")
  const useCases = [
    {
      icon: Shield,
      title: t("verification_codes.title"),
      description: t("verification_codes.description"),
      color: "blue",
      examples: [
        t("verification_codes.examples.sms_otp"),
        t("verification_codes.examples.email_verification"),
        t("verification_codes.examples.two_factor_auth"),
        t("verification_codes.examples.account_recovery"),
      ],
    },
    {
      icon: Lock,
      title: t("pin_numbers.title"),
      description: t("pin_numbers.description"),
      color: "emerald",
      examples: [
        t("pin_numbers.examples.atm_pins"),
        t("pin_numbers.examples.lock_codes"),
        t("pin_numbers.examples.access_control"),
        t("pin_numbers.examples.security_tokens"),
      ],
    },
    {
      icon: Code,
      title: t("testing_development.title"),
      description: t("testing_development.description"),
      color: "purple",
      examples: [
        t("testing_development.examples.qa_testing"),
        t("testing_development.examples.api_testing"),
        t("testing_development.examples.mock_data"),
        t("testing_development.examples.database_seeds"),
      ],
    },
    {
      icon: Gamepad2,
      title: t("gaming_lottery.title"),
      description: t("gaming_lottery.description"),
      color: "pink",
      examples: [
        t("gaming_lottery.examples.lucky_numbers"),
        t("gaming_lottery.examples.game_codes"),
        t("gaming_lottery.examples.contest_ids"),
        t("gaming_lottery.examples.random_selection"),
      ],
    },
    {
      icon: GraduationCap,
      title: t("educational_research.title"),
      description: t("educational_research.description"),
      color: "orange",
      examples: [
        t("educational_research.examples.statistical_sampling"),
        t("educational_research.examples.math_education"),
        t("educational_research.examples.research_data"),
        t("educational_research.examples.surveys"),
      ],
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        gradient: "from-blue-500/15 to-cyan-500/10",
        border: "border-blue-500/30",
        icon: "text-blue-400",
        badge: "bg-blue-500/20 text-blue-300",
        hover: "hover:border-blue-500/50 hover:shadow-blue-500/25",
      },
      emerald: {
        gradient: "from-emerald-500/15 to-teal-500/10",
        border: "border-emerald-500/30",
        icon: "text-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-300",
        hover: "hover:border-emerald-500/50 hover:shadow-emerald-500/25",
      },
      purple: {
        gradient: "from-purple-500/15 to-pink-500/10",
        border: "border-purple-500/30",
        icon: "text-purple-400",
        badge: "bg-purple-500/20 text-purple-300",
        hover: "hover:border-purple-500/50 hover:shadow-purple-500/25",
      },
      pink: {
        gradient: "from-pink-500/15 to-rose-500/10",
        border: "border-pink-500/30",
        icon: "text-pink-400",
        badge: "bg-pink-500/20 text-pink-300",
        hover: "hover:border-pink-500/50 hover:shadow-pink-500/25",
      },
      orange: {
        gradient: "from-orange-500/15 to-amber-500/10",
        border: "border-orange-500/30",
        icon: "text-orange-400",
        badge: "bg-orange-500/20 text-orange-300",
        hover: "hover:border-orange-500/50 hover:shadow-orange-500/25",
      },
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section className="mt-20">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <div className="to-white/2 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-white/5 px-6 py-2 backdrop-blur-sm">
          <span className="text-2xl">🎯</span>
          <span className="text-sm font-medium text-slate-300">{t("badge")}</span>
        </div>
        <h2 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-400">{t("description")}</p>
      </div>

      {/* Use Cases Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase, index) => {
          const colors = getColorClasses(useCase.color)
          const Icon = useCase.icon

          return (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.gradient} p-6 backdrop-blur-sm transition-all duration-500 ${colors.hover} hover:shadow-xl`}
            >
              {/* Decorative background */}
              <div className="to-white/2 absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 blur-2xl transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="relative">
                {/* Icon */}
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm`}
                >
                  <Icon className={`h-7 w-7 ${colors.icon}`} />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-white">{useCase.title}</h3>

                {/* Description */}
                <p className="mb-4 text-sm text-slate-300">{useCase.description}</p>

                {/* Examples */}
                <div className="flex flex-wrap gap-2">
                  {useCase.examples.map((example, exampleIndex) => (
                    <span
                      key={exampleIndex}
                      className={`rounded-full ${colors.badge} px-3 py-1 text-xs font-medium`}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* How It Works Section */}
      <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-xl md:p-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column */}
          <div>
            <h3 className="mb-6 text-3xl font-bold text-white">{t("how_it_works.title")}</h3>
            <div className="space-y-4 text-slate-300">
              <p>
                {t("how_it_works.description_1", {
                  strong_4digit: t("how_it_works.strong_4digit"),
                })}
              </p>
              <p>
                {t("how_it_works.description_2", {
                  strong_crypto: t("how_it_works.strong_crypto"),
                })}
              </p>
              <p>
                {t("how_it_works.description_3", {
                  strong_users: t("how_it_works.strong_users"),
                })}
              </p>
            </div>

            {/* Steps */}
            <div className="mt-8 space-y-4">
              {[
                { step: "1", text: t("how_it_works.steps.step_1") },
                { step: "2", text: t("how_it_works.steps.step_2") },
                { step: "3", text: t("how_it_works.steps.step_3") },
                { step: "4", text: t("how_it_works.steps.step_4") },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 font-bold text-blue-300">
                    {item.step}
                  </div>
                  <div className="pt-1 text-slate-300">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="mb-6 text-3xl font-bold text-white">{t("why_choose.title")}</h3>
            <div className="space-y-4">
              {[
                {
                  icon: "⚡",
                  title: t("why_choose.instant_generation.title"),
                  description: t("why_choose.instant_generation.description"),
                },
                {
                  icon: "🔒",
                  title: t("why_choose.crypto_secure.title"),
                  description: t("why_choose.crypto_secure.description"),
                },
                {
                  icon: "🌍",
                  title: t("why_choose.no_registration.title"),
                  description: t("why_choose.no_registration.description"),
                },
                {
                  icon: "💯",
                  title: t("why_choose.free_forever.title"),
                  description: t("why_choose.free_forever.description"),
                },
                {
                  icon: "📱",
                  title: t("why_choose.mobile_friendly.title"),
                  description: t("why_choose.mobile_friendly.description"),
                },
                {
                  icon: "🎨",
                  title: t("why_choose.customizable.title"),
                  description: t("why_choose.customizable.description"),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="to-white/2 group flex items-start gap-4 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 p-4 transition-all duration-300 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5"
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h4 className="mb-1 font-semibold text-white">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UseCases
