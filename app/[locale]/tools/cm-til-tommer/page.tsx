"use client"
import {
  ArrowLeftRight,
  Globe,
  BookOpen,
  Home,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
  Calculator,
  Settings,
  Flag,
} from "lucide-react"
import ConverterCard from "./components/ConverterCard"
import QuickReference from "./components/QuickReference"
import EducationalContent from "./components/EducationalContent"

export default function CmTilTommerConverter() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">Hjem</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="transition-colors hover:text-slate-200">
              Værktøjer
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">CM til Tommer Konverter</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section with Converter */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <Flag className="mr-2 h-4 w-4 text-red-400" />
              Gratis CM til Tommer Konverter & Nordisk Måleværktøj
              <Sparkles className="ml-2 h-4 w-4 text-blue-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">CM til Tommer</span>
              <span className="block bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
                Konverter & Beregner
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              <strong className="text-slate-300">Gratis CM til Tommer konverter</strong> og nordisk
              måleberegner. Konverter{" "}
              <strong className="text-slate-300">centimeter til tommer</strong> (danske/norske
              tommer), konverter <strong className="text-slate-300">tommer til centimeter</strong>,
              og beregn præcise målinger med decimal præcision. Perfekt til{" "}
              <strong className="text-slate-300">møbelindkøb</strong>,{" "}
              <strong className="text-slate-300">byggeprojekter</strong>,{" "}
              <strong className="text-slate-300">IKEA dimensioner</strong>, og international handel
              på tværs af nordiske lande.
            </p>

            {/* SEO-optimized feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Centimeter til Tommer Beregner</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-red-500" />
                <span className="font-medium">Dansk Norsk Tommer Konverter</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="font-medium">IKEA Møbelstørrelse Værktøj</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Nordisk Byggemåling</span>
              </div>
            </div>

            {/* Additional SEO keywords section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  cm til tommer
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  tommer til cm
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  dansk tommer konverter
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  norsk måling
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  nordiske enheder
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  skandinavisk konverter
                </span>
              </p>
            </div>
          </div>

          {/* Main conversion area */}
          <div id="converter-section" className="grid gap-8 lg:grid-cols-3">
            {/* Left panel - Converter */}
            <div className="space-y-6 lg:col-span-2">
              <ConverterCard />
            </div>

            {/* Right panel - Quick Reference */}
            <div className="lg:col-span-1">
              <QuickReference />
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-16">
            <EducationalContent />
          </div>
        </div>

        {/* Usage guide - SEO optimized */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Sådan Bruger Du CM til Tommer Konverter - Komplet Guide
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Mester <strong className="text-slate-300">centimeter til tommer konvertering</strong>{" "}
              til <strong className="text-slate-300">nordisk møbelindkøb</strong>,{" "}
              <strong className="text-slate-300">byggeprojekter</strong>, og{" "}
              <strong className="text-slate-300">internationale målinger</strong>. Vores{" "}
              <strong className="text-slate-300">dansk norsk tommer konverter</strong> giver
              nøjagtige resultater til alle dine målebehov.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Indtast Måleværdi</h3>
              <p className="text-slate-400">
                Indtast din måling i centimeter eller tommer. Vores konverter accepterer decimal
                værdier og skifter automatisk mellem enheder for øjeblikkelig konvertering.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Vælg Præcisionsniveau</h3>
              <p className="text-slate-400">
                Vælg decimal præcision fra 0 til 3 decimaler til dine konverteringsbehov. Perfekt
                til byggenøjagtighed eller generelle møbelmålinger.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Få Øjeblikkelige Resultater</h3>
              <p className="text-slate-400">
                Se realtids konverteringsresultater med den nøjagtige formel brugt. Perfekt til
                forståelse af nordiske målestandarder og international handel.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Kopier & Brug Resultater</h3>
              <p className="text-slate-400">
                Kopier konverteringsresultater med et klik til brug i indkøbslister, byggeplaner,
                eller internationale produktspecifikationer.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Tommer Section */}
          <section className="rounded-xl bg-gradient-to-r from-red-800 to-blue-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Hvad er Tommer? Forståelse af Nordiske Måleenheder
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  Tommer er det danske og norske ord for "inch" og repræsenterer en traditionel
                  nordisk måleenhed. I moderne brug er 1 tommer lig med præcis 2,54 centimeter,
                  identisk med den internationale inch standard. Denne CM til Tommer konverter
                  hjælper dig med at navigere nordiske målinger til møbelindkøb, byggeprojekter og
                  international handel.
                </p>
                <p className="text-slate-200">
                  Vores centimeter til tommer konverter er essentiel for alle der arbejder med
                  nordiske lande, IKEA møbeldimensioner, skandinaviske byggerstandarder, eller
                  internationale produktspecifikationer der bruger tommer målinger.
                </p>
              </div>
              <div className="rounded-lg bg-red-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Tommer Konvertering Fordele
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• Nøjagtig nordisk målekonvertering</li>
                  <li>• Perfekt til IKEA møbeldimensioner</li>
                  <li>• Essentiel til byggeprojekter</li>
                  <li>• International handelskompatibilitet</li>
                  <li>• Præcision op til 3 decimaler</li>
                  <li>• Gratis og øjeblikkelig konvertering</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CM til Tommer Conversion Guide */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-purple-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              CM til Tommer Konverteringsformel & Beregner Guide
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">📏 Konverteringsformel</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      cm × 0,3937 = tommer
                    </code>
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      tommer × 2,54 = cm
                    </code>
                  </p>
                  <p>Brug vores beregner til øjeblikkelige og nøjagtige konverteringer.</p>
                </div>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🎯 Præcisionskontrol</h3>
                <div className="space-y-2 text-slate-200">
                  <p>0 decimaler: Generelle målinger</p>
                  <p>1-2 decimaler: Møbeldimensioner</p>
                  <p>3 decimaler: Byggepræcision</p>
                  <p>Vælg den rigtige præcision til dine specifikke behov.</p>
                </div>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">⚡ Hurtige Eksempler</h3>
                <div className="space-y-2 text-slate-200">
                  <p>10 cm = 3,94 tommer</p>
                  <p>25,4 cm = 10 tommer</p>
                  <p>100 cm = 39,37 tommer</p>
                  <p>Perfekt til almindelige målekonverteringer.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Nordic Countries Usage */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Tommer Brug På Tværs af Nordiske Lande
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🇩🇰 Danmark</h3>
                <p className="text-slate-400">
                  I Danmark bruges tommer almindeligt i byggeri, møbelproduktion og traditionelle
                  håndværk. Danske møbelvirksomheder angiver ofte dimensioner i tommer til
                  internationale markeder.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🇳🇴 Norge</h3>
                <p className="text-slate-400">
                  Norske bygge- og træindustrier bruger ofte tommer målinger. Vores konverter
                  hjælper med norske byggerstandarder og arkitektoniske specifikationer.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🌍 International</h3>
                <p className="text-slate-400">
                  Globale virksomheder der arbejder med nordiske leverandører har brug for nøjagtig
                  tommer konvertering til produktspecifikationer, forsendelsesdimensioner og
                  kvalitetskontrolstandarder.
                </p>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Professionel CM til Tommer Konverter Funktioner
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                Alt hvad du har brug for til nøjagtig nordisk målekonvertering
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <ArrowLeftRight className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  Tovejs CM til Tommer Konvertering
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Konverter fra centimeter til tommer og tommer til centimeter med øjeblikkelige
                  resultater og præcisionskontrol til alle dine nordiske målebehov.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Calculator className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Præcisionskontrol</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Vælg fra 0 til 3 decimaler til dine konverteringsbehov. Perfekt til
                  byggenøjagtighed, møbelmålinger og professionelle anvendelser.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Settings className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Professionelle Værktøjer</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Kopier resultater, se konverteringsformler, og få adgang til hurtige
                  referencetabeller til effektiv workflow integration og professionel brug.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Ofte Stillede Spørgsmål Om CM til Tommer Konvertering
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Hvordan konverterer jeg centimeter til tommer nøjagtigt?
                </h3>
                <p className="text-slate-400">
                  Brug vores CM til Tommer konverter ved at indtaste din centimeter værdi. Værktøjet
                  beregner automatisk tommer ækvivalenten ved hjælp af den præcise formel: cm ×
                  0,3937 = tommer. Du kan justere decimal præcision fra 0 til 3 pladser til dine
                  specifikke behov.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Hvad er den nøjagtige konverteringsformel for CM til Tommer?
                </h3>
                <p className="text-slate-400">
                  Konverteringsformlerne er: 1 cm = 0,3937 tommer og 1 tommer = 2,54 cm. Disse er
                  baseret på den internationale inch standard, da moderne tommer er identisk med den
                  internationale inch måling.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Er tommer det samme som inches i nordiske lande?
                </h3>
                <p className="text-slate-400">
                  Ja, moderne tommer er identisk med den internationale inch. Begge er lig med
                  præcis 2,54 centimeter. Ordet "tommer" er simpelthen det danske og norske udtryk
                  for "inch," hvilket gør vores konverter perfekt til nordiske målinger.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Hvorfor har jeg brug for en CM til Tommer konverter til IKEA møbler?
                </h3>
                <p className="text-slate-400">
                  IKEA og andre nordiske møbelvirksomheder bruger ofte tommer i deres
                  specifikationer til internationale markeder. Vores konverter hjælper dig med at
                  forstå nøjagtige dimensioner når du handler skandinaviske møbler eller
                  sammenligner størrelser.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Er denne CM til Tommer konverter gratis at bruge?
                </h3>
                <p className="text-slate-400">
                  Ja! Vores CM til Tommer konverter er helt gratis uden registrering påkrævet.
                  Konverter ubegrænsede målinger, få adgang til alle præcisionsniveauer, og brug
                  alle funktioner uden begrænsninger eller skjulte omkostninger.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-red-900/20 to-blue-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">
              Klar til at Konvertere CM til Tommer?
            </h2>
            <p className="mb-8 text-xl text-slate-300">
              Begynd at bruge vores gratis, nøjagtige og professionelle CM til Tommer konverter til
              alle dine nordiske målebehov.
            </p>
            <button
              onClick={() => {
                document.querySelector("#converter-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Calculator className="h-5 w-5" />
              Brug CM til Tommer Konverter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
