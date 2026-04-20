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
    <section className="mt-12 md:mt-20 lg:mt-24">
      {/* Section Header */}
      <div className="mb-8 text-center md:mb-12">
        <div className="to-white/2 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-white/5 px-3 py-1.5 backdrop-blur-sm sm:px-4 md:px-6 md:py-2">
          <span className="text-xl md:text-2xl">🎯</span>
          <span className="text-xs font-medium text-slate-300 md:text-sm">{t("badge")}</span>
        </div>
        <h2 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-5xl text-base leading-7 text-slate-400 md:text-lg">
          {t("description")}
        </p>
      </div>

      {/* Use Cases Grid */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {useCases.map((useCase, index) => {
          const colors = getColorClasses(useCase.color)
          const Icon = useCase.icon

          return (
            <div
              key={index}
              className={`group overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.gradient} p-4 backdrop-blur-sm transition-all duration-500 ${colors.hover} hover:shadow-xl sm:p-5 md:p-6`}
            >
              <div className="relative">
                {/* Icon */}
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm sm:h-14 sm:w-14`}
                >
                  <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${colors.icon}`} />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-bold text-white sm:mb-3 sm:text-xl">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="mb-4 text-sm leading-6 text-slate-300">{useCase.description}</p>

                {/* Examples */}
                <div className="flex flex-wrap gap-2">
                  {useCase.examples.map((example, exampleIndex) => (
                    <span
                      key={exampleIndex}
                      className={`rounded-full ${colors.badge} px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-xs`}
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
      <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-5 backdrop-blur-xl sm:p-6 md:mt-16 md:p-10 lg:p-12">
        <div className="grid gap-7 md:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column */}
          <div>
            <h3 className="mb-5 text-2xl font-bold text-white sm:text-3xl">
              {t("how_it_works.title")}
            </h3>
            <div className="space-y-4 text-sm leading-7 text-slate-300 sm:text-base">
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
            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {[
                { step: "1", text: t("how_it_works.steps.step_1") },
                { step: "2", text: t("how_it_works.steps.step_2") },
                { step: "3", text: t("how_it_works.steps.step_3") },
                { step: "4", text: t("how_it_works.steps.step_4") },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-sm font-bold text-blue-300 sm:h-8 sm:w-8">
                    {item.step}
                  </div>
                  <div className="pt-0.5 text-sm leading-6 text-slate-300 sm:pt-1 sm:text-base">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="mb-5 text-2xl font-bold text-white sm:text-3xl">
              {t("why_choose.title")}
            </h3>
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
                  className="to-white/2 group flex items-start gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 p-3.5 transition-all duration-300 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 sm:gap-4 sm:p-4"
                >
                  <div className="text-xl sm:text-2xl">{feature.icon}</div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-white sm:text-base">
                      {feature.title}
                    </h4>
                    <p className="text-xs leading-6 text-slate-400 sm:text-sm">
                      {feature.description}
                    </p>
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
