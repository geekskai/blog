"use client"
import {
  TrendingUp,
  ArrowLeftRight,
  Globe,
  BookOpen,
  Home,
  ChevronRight,
  Sparkles,
  Zap,
  Calculator,
} from "lucide-react"
import ConverterCard from "./components/ConverterCard"
import QuickReference from "./components/QuickReference"
import EducationalContent from "./components/EducationalContent"

export default function GbpNokConverter() {
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
              <span className="ml-1">Home</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="transition-colors hover:text-slate-200">
              Tools
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">GBP NOK Currency Converter</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <ArrowLeftRight className="mr-2 h-4 w-4 text-blue-400" />
              Free GBP ↔ NOK Currency Converter with Live Exchange Rates
              <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">Pund til NOK</span>
              <span className="block bg-gradient-to-r from-blue-500 via-red-500 to-emerald-500 bg-clip-text text-transparent">
                Kalkulator 2025
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              <strong className="text-slate-300">Gratis pund til NOK kalkulator</strong> med live
              valutakurser. Konverter{" "}
              <strong className="text-slate-300">britiske pund til norske kroner</strong>{" "}
              øyeblikkelig for reise, handel og internasjonale transaksjoner. Få nøyaktige{" "}
              <strong className="text-slate-300">pund til krone valutakurser</strong> oppdatert hver
              time fra pålitelige finansielle kilder.
            </p>

            {/* SEO-optimized feature badges - 挪威语关键词 */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Live Valutakurser</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Pund til NOK Kalkulator</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Øyeblikkelig Konvertering</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Gratis Valutaverktøy</span>
              </div>
            </div>

            {/* Additional SEO keywords section - 挪威语长尾关键词 */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  pund til nok
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  pund til nok kalkulator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  GBP til NOK
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  britiske pund norske kroner
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  valutakalkulator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  valutakurs pund nok
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  pund krone kurs
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  reise valuta
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
              How to Use GBP to NOK Currency Converter - Complete Guide
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Master{" "}
              <strong className="text-slate-300">
                British Pound to Norwegian Krone conversion
              </strong>{" "}
              for <strong className="text-slate-300">international travel</strong>,{" "}
              <strong className="text-slate-300">business transactions</strong>, and{" "}
              <strong className="text-slate-300">forex trading</strong>. Our{" "}
              <strong className="text-slate-300">real-time GBP NOK converter</strong> provides
              accurate exchange rates for all your currency needs.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Enter Currency Amount</h3>
              <p className="text-slate-400">
                Input your amount in British Pounds (GBP) or Norwegian Krone (NOK). Our converter
                accepts any amount and provides instant real-time conversion.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">View Live Exchange Rate</h3>
              <p className="text-slate-400">
                See the current GBP/NOK exchange rate updated hourly from reliable financial data
                sources. Perfect for accurate currency conversion.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Get Instant Results</h3>
              <p className="text-slate-400">
                View real-time conversion results with detailed exchange rate information. Perfect
                for travel planning and international business transactions.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Copy & Use Results</h3>
              <p className="text-slate-400">
                Copy conversion results with one click for use in travel budgets, business invoices,
                or financial planning documents.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO - 挪威语优化内容 */}
        <div className="mt-20 space-y-16">
          {/* 挪威语核心内容区域 */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Pund til NOK Kalkulator - Hvorfor Velge Vår Valutaomregner?
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  Vår <strong>pund til NOK kalkulator</strong> er den mest nøyaktige og
                  brukervennlige valutaomregneren på nettet. Med live valutakurser oppdatert hver
                  time, kan du stole på at du får de mest aktuelle{" "}
                  <strong>GBP til NOK kursene</strong> for dine transaksjoner.
                </p>
                <p className="text-slate-200">
                  Perfekt for nordmenn som reiser til Storbritannia, handler online fra britiske
                  butikker, eller driver forretninger med britiske selskaper. Vår{" "}
                  <strong>pund til kroner kalkulator</strong>
                  gir deg øyeblikkelige og presise resultater.
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Fordeler med Vår Pund til NOK Kalkulator
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• Live valutakurser oppdatert hver time</li>
                  <li>• Gratis og ubegrenset bruk</li>
                  <li>• Nøyaktige GBP til NOK konverteringer</li>
                  <li>• Perfekt for reise og handel</li>
                  <li>• Mobilvennlig design</li>
                  <li>• Ingen registrering påkrevd</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Vanlige spørsmål på norsk */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Ofte Stilte Spørsmål om Pund til NOK Konvertering
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-lg bg-purple-900/30 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Hvor mye er 1 pund i NOK?
                  </h3>
                  <p className="text-slate-200">
                    1 britisk pund tilsvarer omtrent 13-14 norske kroner, men kursen endres
                    konstant. Bruk vår kalkulator for den mest oppdaterte{" "}
                    <strong>pund til NOK kursen</strong>.
                  </p>
                </div>
                <div className="rounded-lg bg-purple-900/30 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">Er kalkulatoren gratis?</h3>
                  <p className="text-slate-200">
                    Ja! Vår <strong>pund til NOK kalkulator</strong> er helt gratis å bruke uten
                    begrensninger eller registrering.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg bg-purple-900/30 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Hvor ofte oppdateres kursene?
                  </h3>
                  <p className="text-slate-200">
                    Våre <strong>GBP til NOK valutakurser</strong> oppdateres hver time fra
                    pålitelige finansielle kilder for maksimal nøyaktighet.
                  </p>
                </div>
                <div className="rounded-lg bg-purple-900/30 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Kan jeg bruke dette for store beløp?
                  </h3>
                  <p className="text-slate-200">
                    Ja, vår kalkulator håndterer alle beløp. For faktiske transaksjoner, sjekk med
                    din bank for deres aktuelle kurser og gebyrer.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="mt-20 space-y-16">
          {/* What affects GBP NOK rates */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              What Affects GBP to NOK Exchange Rates?
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  The GBP to NOK exchange rate is influenced by various economic factors including
                  oil prices (affecting Norway's economy), interest rate differences between the
                  Bank of England and Norges Bank, Brexit developments, and overall economic
                  performance of both countries.
                </p>
                <p className="text-slate-200">
                  Our real-time GBP NOK converter helps you stay updated with these fluctuations,
                  providing accurate exchange rates essential for international transactions, travel
                  planning, and business operations between the UK and Norway.
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">Key Rate Influencers</h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• Oil price fluctuations (Norway's main export)</li>
                  <li>• Central bank interest rate decisions</li>
                  <li>• Brexit and UK political developments</li>
                  <li>• Economic data from both countries</li>
                  <li>• Global market sentiment and risk appetite</li>
                  <li>• Trade relationships and agreements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* GBP NOK Conversion Guide */}
          <section className="rounded-xl bg-gradient-to-r from-red-800 to-rose-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              GBP to NOK Conversion Guide & Calculator Tips
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-red-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">💱 Live Exchange Rates</h3>
                <div className="space-y-2 text-slate-200">
                  <p>Our converter uses real-time data from reliable financial sources</p>
                  <p>Rates update hourly for maximum accuracy</p>
                  <p>Perfect for both personal and business use</p>
                </div>
              </div>
              <div className="rounded-lg bg-red-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🎯 Best Conversion Times</h3>
                <div className="space-y-2 text-slate-200">
                  <p>European trading hours: 8 AM - 5 PM GMT</p>
                  <p>Avoid major news announcements</p>
                  <p>Monitor oil prices for NOK trends</p>
                </div>
              </div>
              <div className="rounded-lg bg-red-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">⚡ Quick Examples</h3>
                <div className="space-y-2 text-slate-200">
                  <p>£100 ≈ 1,345 NOK</p>
                  <p>£500 ≈ 6,725 NOK</p>
                  <p>£1,000 ≈ 13,450 NOK</p>
                  <p>*Rates vary with market conditions</p>
                </div>
              </div>
            </div>
          </section>

          {/* Travel and Business Usage */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              GBP NOK Converter for Travel & Business
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🇬🇧 UK to Norway Travel</h3>
                <p className="text-slate-400">
                  Essential for British travelers visiting Norway. Convert pounds to krone for
                  budgeting hotels, restaurants, attractions, and shopping in Oslo, Bergen, and
                  other Norwegian cities.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🇳🇴 Norway to UK Travel</h3>
                <p className="text-slate-400">
                  Perfect for Norwegian visitors to the UK. Convert krone to pounds for London
                  trips, Scottish highlands tours, and understanding costs across England, Wales,
                  and Northern Ireland.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🏢 International Business</h3>
                <p className="text-slate-400">
                  Critical for UK-Norway business transactions, import/export pricing, contract
                  negotiations, and financial reporting between British and Norwegian companies.
                </p>
              </div>
            </div>
          </section>

          {/* Common Use Cases Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Common GBP to NOK Conversion Use Cases
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Travel & Tourism</h3>
                    <p className="text-slate-400">
                      Convert pounds to krone for Norwegian vacation planning, hotel bookings,
                      restaurant budgets, and activity costs. Essential for UK travelers visiting
                      Norway's fjords and cities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">International Business</h3>
                    <p className="text-slate-400">
                      Professional currency conversion for UK-Norway trade, import/export pricing,
                      contract negotiations, and financial reporting between British and Norwegian
                      companies.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Online Shopping</h3>
                    <p className="text-slate-400">
                      Convert currencies when shopping from UK or Norwegian online stores,
                      understanding product prices, shipping costs, and total expenses in your
                      preferred currency.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Education & Study Abroad</h3>
                    <p className="text-slate-400">
                      Calculate tuition fees, living expenses, and study costs for British students
                      in Norway or Norwegian students in the UK. Essential for education planning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    5
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Investment & Finance</h3>
                    <p className="text-slate-400">
                      Monitor GBP/NOK exchange rates for forex trading, international investments,
                      portfolio diversification, and financial planning involving both currencies.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    6
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Remittances & Transfers</h3>
                    <p className="text-slate-400">
                      Calculate costs for money transfers between UK and Norway, understanding
                      exchange rates for remittances, and planning international money movements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Professional GBP NOK Currency Converter Features
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                Everything you need for accurate British Pound to Norwegian Krone conversion
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <TrendingUp className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Real-Time Exchange Rates</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Live GBP to NOK exchange rates updated hourly from reliable financial data sources
                  for accurate currency conversion.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <ArrowLeftRight className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Bidirectional Conversion</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Convert from GBP to NOK or NOK to GBP with instant results and easy currency
                  switching for maximum flexibility.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Calculator className="h-12 w-12 text-emerald-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Professional Tools</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Copy results, view detailed exchange rate information, and access quick reference
                  tables for efficient currency conversion.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Frequently Asked Questions About GBP to NOK Conversion
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What is the current GBP to NOK exchange rate?
                </h3>
                <p className="text-slate-400">
                  The GBP to NOK exchange rate fluctuates throughout the day based on market
                  conditions. Our converter shows real-time rates updated hourly from reliable
                  financial sources. As of recent data, 1 GBP typically equals around 13-14 NOK, but
                  this varies constantly.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How do I convert British Pounds to Norwegian Krone?
                </h3>
                <p className="text-slate-400">
                  Simply enter the amount in GBP in our converter, and it will automatically
                  calculate the equivalent in NOK using the current exchange rate. You can also
                  switch to convert NOK to GBP by clicking the swap button.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Why do GBP NOK exchange rates change?
                </h3>
                <p className="text-slate-400">
                  Exchange rates change due to various factors including oil prices (affecting
                  Norway's economy), interest rate differences, Brexit developments, economic data
                  from both countries, and global market sentiment.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is this GBP NOK converter suitable for business use?
                </h3>
                <p className="text-slate-400">
                  Yes, our converter is suitable for business transactions, travel planning, and
                  personal use. For large business transactions, we recommend checking with your
                  bank for commercial rates and considering currency hedging strategies.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How accurate are the exchange rates shown?
                </h3>
                <p className="text-slate-400">
                  Our exchange rates are sourced from reliable financial data providers and updated
                  regularly. However, actual rates may vary slightly depending on your bank or
                  exchange service, especially for cash transactions.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I use this for travel to Norway from the UK?
                </h3>
                <p className="text-slate-400">
                  Absolutely! Our GBP to NOK converter is perfect for travel planning. Use it to
                  budget for hotels, restaurants, attractions, and shopping in Norway. Remember that
                  Norway is generally more expensive than the UK.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is this currency converter free to use?
                </h3>
                <p className="text-slate-400">
                  Yes! Our GBP to NOK currency converter is completely free with no registration
                  required. You can perform unlimited conversions and access all features without
                  any cost or hidden fees.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What other currency conversion tools do you offer?
                </h3>
                <p className="text-slate-400">
                  We offer a comprehensive suite of currency conversion tools and calculators.
                  Explore our tools section for additional converters including EUR, USD, and other
                  major currencies paired with both GBP and NOK.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/20 to-red-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to Convert GBP to NOK?</h2>
            <p className="mb-8 text-xl text-slate-300">
              Start using our free, accurate, and professional GBP to NOK currency converter for all
              your British Pound to Norwegian Krone conversion needs.
            </p>
            <button
              onClick={() => {
                document.querySelector("#converter-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Calculator className="h-5 w-5" />
              Use GBP NOK Converter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
