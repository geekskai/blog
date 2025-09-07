"use client"
import { Info, Globe, Calculator, TrendingUp } from "lucide-react"

export default function EducationalContent() {
  const useCases = [
    {
      icon: "✈️",
      title: "Travel & Tourism",
      description:
        "Essential for travelers between the UK and Norway to understand costs and budget effectively.",
      examples: [
        "Hotel booking comparisons",
        "Restaurant and shopping budgets",
        "Transportation costs",
        "Activity and tour pricing",
      ],
    },
    {
      icon: "🏢",
      title: "Business & Trade",
      description:
        "Critical for international business transactions and trade between British and Norwegian companies.",
      examples: [
        "Import/export pricing",
        "Contract negotiations",
        "Invoice processing",
        "Financial reporting",
      ],
    },
    {
      icon: "🎓",
      title: "Education & Study",
      description:
        "Important for students studying abroad or educational institutions with international programs.",
      examples: [
        "Tuition fee calculations",
        "Living expense budgets",
        "Scholarship amounts",
        "Study abroad costs",
      ],
    },
    {
      icon: "💼",
      title: "Investment & Finance",
      description:
        "Valuable for investors and financial professionals dealing with GBP-NOK currency pairs.",
      examples: [
        "Portfolio diversification",
        "Currency hedging",
        "International investments",
        "Financial planning",
      ],
    },
  ]

  const currencyFacts = [
    {
      title: "British Pound Sterling (GBP)",
      content:
        "The British Pound is one of the world's oldest currencies still in use, dating back over 1,200 years. It's the fourth most traded currency globally and serves as a major reserve currency.",
      flag: "🇬🇧",
    },
    {
      title: "Norwegian Krone (NOK)",
      content:
        "The Norwegian Krone has been Norway's currency since 1875. Norway's strong oil economy and sovereign wealth fund make the NOK a relatively stable Nordic currency.",
      flag: "🇳🇴",
    },
    {
      title: "Exchange Rate Factors",
      content:
        "GBP/NOK rates are influenced by oil prices (affecting NOK), Brexit developments, interest rate differences, and economic performance of both countries.",
      flag: "📊",
    },
    {
      title: "Trading Hours",
      content:
        "Currency markets operate 24/5, but GBP/NOK is most actively traded during European business hours (8 AM - 5 PM GMT) when both London and Oslo markets overlap.",
      flag: "🕐",
    },
  ]

  const exchangeRateFactors = [
    {
      factor: "Oil Prices",
      impact: "High",
      description:
        "Norway's oil-dependent economy makes NOK sensitive to crude oil price fluctuations.",
    },
    {
      factor: "Interest Rates",
      impact: "High",
      description:
        "Central bank policy differences between Bank of England and Norges Bank affect rates.",
    },
    {
      factor: "Economic Data",
      impact: "Medium",
      description:
        "GDP, inflation, and employment data from both countries influence currency strength.",
    },
    {
      factor: "Political Events",
      impact: "Medium",
      description: "Brexit developments, elections, and policy changes can cause volatility.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Use Cases Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-900/25 via-red-900/20 to-pink-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
              <Globe className="h-5 w-5 text-orange-400" />
              <h3 className="bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
                Common Use Cases
              </h3>
            </div>
            <p className="text-slate-300">
              Discover when and why you need GBP to NOK currency conversion
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((useCase, index) => (
              <div
                key={useCase.title}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-2xl">{useCase.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{useCase.title}</h4>
                </div>

                <p className="mb-4 text-sm text-slate-300">{useCase.description}</p>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-orange-400">Examples:</div>
                  <ul className="space-y-1">
                    {useCase.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="h-1 w-1 rounded-full bg-orange-400" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Currency Information Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/25 via-purple-900/20 to-blue-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-blue-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
              <Info className="h-5 w-5 text-indigo-400" />
              <h3 className="bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 bg-clip-text text-xl font-bold text-transparent">
                About GBP & NOK Currencies
              </h3>
            </div>
            <p className="text-slate-300">Learn about the British Pound and Norwegian Krone</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {currencyFacts.map((fact, index) => (
              <div
                key={fact.title}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                  <span className="text-2xl">{fact.flag}</span>
                  {fact.title}
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">{fact.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exchange Rate Factors Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-green-900/25 via-emerald-900/20 to-teal-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-green-500/15 to-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-3 backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h3 className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-xl font-bold text-transparent">
                Exchange Rate Factors
              </h3>
            </div>
            <p className="text-slate-300">Key factors that influence GBP/NOK exchange rates</p>
          </div>

          <div className="space-y-4">
            {exchangeRateFactors.map((item, index) => (
              <div
                key={item.factor}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">{item.factor}</h4>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.impact === "High"
                        ? "border border-red-500/30 bg-red-500/20 text-red-300"
                        : "border border-yellow-500/30 bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {item.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Trading tip */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 text-lg font-semibold text-white">Currency Conversion Tips</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-green-400">•</span>
                    <span>Monitor rates during European trading hours for better liquidity</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-green-400">•</span>
                    <span>Consider oil price trends when predicting NOK movements</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-green-400">•</span>
                    <span>Use limit orders for large conversions to get better rates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-green-400">•</span>
                    <span>Keep track of central bank announcements from both countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
