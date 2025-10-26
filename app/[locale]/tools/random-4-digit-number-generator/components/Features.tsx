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
    <section className="mt-20">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <div className="to-white/2 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-white/5 px-6 py-2 backdrop-blur-sm">
          <span className="text-2xl">✨</span>
          <span className="text-sm font-medium text-slate-300">{t("badge")}</span>
        </div>
        <h2 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-400">{t("description")}</p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon

          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl"
            >
              {/* Animated background gradient */}
              <div
                className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${feature.bgGradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
              ></div>

              <div className="relative">
                {/* Icon Container */}
                <div className="mb-6">
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold text-white">{feature.title}</h3>

                {/* Description */}
                <p className="text-slate-300">{feature.description}</p>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
      <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 p-8 text-center backdrop-blur-xl">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-2">
            <span className="text-2xl">🎓</span>
            <span className="text-lg font-semibold text-white">{t("trust_signals.badge")}</span>
          </div>
        </div>

        <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-300">
          {t("trust_signals.description")}
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4">
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
              className="rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 text-sm font-medium text-green-300 backdrop-blur-sm"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Shield className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-yellow-300">{t("security_notice.title")}</h4>
            <p className="text-sm text-slate-300">{t("security_notice.description")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
