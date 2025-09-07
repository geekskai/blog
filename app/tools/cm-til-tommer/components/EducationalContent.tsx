"use client"
import { Info, Globe, Calculator, Home, Building, Monitor } from "lucide-react"

export default function EducationalContent() {
  const useCases = [
    {
      icon: <Home className="h-6 w-6" />,
      title: "Møbler & Boligindretning",
      description:
        "Konvertering af møbeldimensioner ved indkøb fra nordiske lande eller internationale forhandlere.",
      examples: [
        "IKEA produktdimensioner",
        "Skandinaviske møbelkataloger",
        "Boligrenovering projekter",
        "Køkkenskabe og indretning",
      ],
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Byggeri & Arkitektur",
      description:
        "Professionelle byggeprojekter der kræver præcise målinger i forskellige enhedssystemer.",
      examples: [
        "Arkitekttegninger",
        "Byggematerialer",
        "Tekniske specifikationer",
        "Konstruktionsstandarder",
      ],
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "Elektronik & Shopping",
      description: "Forståelse af produktstørrelser ved køb fra internationale online butikker.",
      examples: [
        "TV og skærmstørrelser",
        "Laptop dimensioner",
        "Tablet størrelser",
        "Forsendelseskasser",
      ],
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Ingeniørarbejde & Design",
      description:
        "Teknisk arbejde der kræver konvertering mellem metriske og nordiske målesystemer.",
      examples: [
        "CAD tegninger",
        "Produktspecifikationer",
        "Produktionstolerancer",
        "Kvalitetskontrol",
      ],
    },
  ]

  const facts = [
    {
      title: "Historisk Baggrund",
      content:
        'Tommer (betyder "tommelfinger" på dansk/norsk) har været brugt i nordiske lande i århundreder, oprindeligt baseret på bredden af en tommelfinger.',
    },
    {
      title: "Moderne Standardisering",
      content:
        "I dag er 1 tommer lig med præcis 2,54 cm, identisk med den internationale inch, hvilket sikrer global kompatibilitet.",
    },
    {
      title: "Regional Brug",
      content:
        "Selvom det metriske system er officielt i nordiske lande, bruges tommer stadig almindeligt i byggeri, møbler og traditionelle håndværk.",
    },
    {
      title: "Præcision Betyder Noget",
      content:
        "I professionelle anvendelser kan selv små konverteringsfejl sammensættes. Vores værktøj giver op til 3 decimaler for maksimal nøjagtighed.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* 使用场景 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-900/25 via-red-900/20 to-pink-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
              <Globe className="h-5 w-5 text-orange-400" />
              <h3 className="bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
                Almindelige Anvendelsesområder
              </h3>
            </div>
            <p className="text-slate-300">
              Opdag hvornår og hvorfor du måske skal konvertere mellem cm og tommer
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
                  <div className="text-orange-400">{useCase.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{useCase.title}</h4>
                </div>

                <p className="mb-4 text-sm text-slate-300">{useCase.description}</p>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-orange-400">Eksempler:</div>
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

      {/* 教育内容 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/25 via-purple-900/20 to-blue-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-blue-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
              <Info className="h-5 w-5 text-indigo-400" />
              <h3 className="bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 bg-clip-text text-xl font-bold text-transparent">
                Om Tommer & Centimeter
              </h3>
            </div>
            <p className="text-slate-300">
              Lær om historien og praktiske anvendelser af disse måleenheder
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {facts.map((fact, index) => (
              <div
                key={fact.title}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                  {fact.title}
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">{fact.content}</p>
              </div>
            ))}
          </div>

          {/* 转换公式说明 */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 text-lg font-semibold text-white">Konverteringsformler</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-700/50 px-2 py-1 font-mono">
                      cm × 0,3937 = tommer
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>Centimeter til Tommer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-700/50 px-2 py-1 font-mono">
                      tommer × 2,54 = cm
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>Tommer til Centimeter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 丹麦/挪威特色信息 */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 backdrop-blur-sm">
            <h4 className="mb-3 text-lg font-semibold text-white">Nordisk Måletradition</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h5 className="mb-2 font-medium text-blue-300">🇩🇰 Danmark</h5>
                <p className="text-sm text-slate-300">
                  I Danmark bruges tommer stadig i byggeri, møbelindustrien og traditionelle
                  håndværk. Danske møbelproducenter angiver ofte dimensioner i tommer til
                  internationale markeder.
                </p>
              </div>
              <div>
                <h5 className="mb-2 font-medium text-cyan-300">🇳🇴 Norge</h5>
                <p className="text-sm text-slate-300">
                  Norske bygge- og træindustrier bruger ofte tommer-målinger. Vores konverter
                  hjælper med norske byggerstandarder og arkitektoniske specifikationer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
