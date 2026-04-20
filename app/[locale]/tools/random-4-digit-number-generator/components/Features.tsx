"use client"

import React from "react"
import { Shield, Zap, Download, Smartphone, Globe, Settings } from "lucide-react"
import { useTranslations } from "next-intl"

const Features = () => {
  const t = useTranslations("Random4DigitNumberGenerator.features")
  const features = [
    {
      icon: Shield,
      title: t("crypto_secure.title"),
      description: t("crypto_secure.description"),
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/15 to-cyan-500/10",
    },
    {
      icon: Zap,
      title: t("lightning_fast.title"),
      description: t("lightning_fast.description"),
      color: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/15 to-teal-500/10",
    },
    {
      icon: Download,
      title: t("multiple_exports.title"),
      description: t("multiple_exports.description"),
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/15 to-pink-500/10",
    },
    {
      icon: Smartphone,
      title: t("mobile_optimized.title"),
      description: t("mobile_optimized.description"),
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/15 to-red-500/10",
    },
    {
      icon: Globe,
      title: t("no_registration.title"),
      description: t("no_registration.description"),
      color: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/15 to-rose-500/10",
    },
    {
      icon: Settings,
      title: t("advanced_customization.title"),
      description: t("advanced_customization.description"),
      color: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/15 to-purple-500/10",
    },
  ]

  return (
    <section className="mt-12 md:mt-20 lg:mt-24">
      {/* Section Header */}
      <div className="mb-8 text-center md:mb-12">
        <div className="to-white/2 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-white/5 px-3 py-1.5 backdrop-blur-sm sm:px-4 md:px-6 md:py-2">
          <span className="text-xl md:text-2xl">✨</span>
          <span className="text-xs font-medium text-slate-300 md:text-sm">{t("badge")}</span>
        </div>
        <h2 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
          {t("description")}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon

          return (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl sm:p-5 md:p-6 lg:p-8"
            >
              <div className="relative">
                {/* Icon Container */}
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg sm:h-14 sm:w-14 md:h-16 md:w-16`}
                  >
                    <Icon className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-xl font-bold text-white sm:mb-3 sm:text-2xl">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-7 text-slate-300 sm:text-base">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-4 hidden items-center gap-2 text-sm font-medium text-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
                  <span>{t("learn_more")}</span>
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trust Signals */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 p-5 text-center backdrop-blur-xl sm:p-6 md:mt-16 md:p-8">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-1.5 sm:px-6 sm:py-2">
            <span className="text-2xl">🎓</span>
            <span className="text-base font-semibold text-white sm:text-lg">
              {t("trust_signals.badge")}
            </span>
          </div>
        </div>

        <p className="mx-auto mb-7 max-w-3xl text-base leading-7 text-slate-300 sm:mb-8 md:text-lg">
          {t("trust_signals.description")}
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 md:gap-4">
          {[
            t("trust_signals.badges.free_forever"),
            t("trust_signals.badges.no_registration"),
            t("trust_signals.badges.unlimited"),
            t("trust_signals.badges.privacy"),
            t("trust_signals.badges.open_source"),
            t("trust_signals.badges.cross_platform"),
          ].map((badge, index) => (
            <div
              key={index}
              className="rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-3 py-1.5 text-xs font-medium text-green-300 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 backdrop-blur-sm sm:p-5 md:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-yellow-400 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-yellow-300 sm:text-base">
              {t("security_notice.title")}
            </h4>
            <p className="text-xs leading-6 text-slate-300 sm:text-sm">
              {t("security_notice.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
