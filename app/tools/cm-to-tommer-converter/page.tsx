"use client"

import React from "react"
import {
  Ruler,
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
} from "lucide-react"
import ConverterCard from "./components/ConverterCard"
import QuickReference from "./components/QuickReference"
import EducationalContent from "./components/EducationalContent"

export default function CmToTommerConverter() {
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
          <li className="font-medium text-slate-100">CM to Tommer Converter</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section with Converter */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <ArrowLeftRight className="mr-2 h-4 w-4 text-blue-400" />
              Free CM to Tommer Converter & Nordic Measurement Tool
              <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">CM to Tommer</span>
              <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                Converter & Calculator
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              <strong className="text-slate-300">Free CM to Tommer converter</strong> and Nordic
              measurement calculator. Convert{" "}
              <strong className="text-slate-300">centimeters to tommer</strong> (Danish/Norwegian
              inches), convert <strong className="text-slate-300">tommer to centimeters</strong>,
              and calculate precise measurements with decimal precision. Perfect for{" "}
              <strong className="text-slate-300">furniture shopping</strong>,{" "}
              <strong className="text-slate-300">construction projects</strong>,{" "}
              <strong className="text-slate-300">IKEA dimensions</strong>, and international
              commerce across Nordic countries.
            </p>

            {/* SEO-optimized feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Centimeter to Tommer Calculator</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Danish Norwegian Inch Converter</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="font-medium">IKEA Furniture Size Tool</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Nordic Construction Measurement</span>
              </div>
            </div>

            {/* Additional SEO keywords section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  cm to tommer
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  tommer to cm
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  danish inch converter
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  norwegian measurement
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  nordic units
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  scandinavian converter
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
              How to Use CM to Tommer Converter - Complete Guide
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Master <strong className="text-slate-300">centimeter to tommer conversion</strong> for{" "}
              <strong className="text-slate-300">Nordic furniture shopping</strong>,{" "}
              <strong className="text-slate-300">construction projects</strong>, and{" "}
              <strong className="text-slate-300">international measurements</strong>. Our{" "}
              <strong className="text-slate-300">Danish Norwegian inch converter</strong> provides
              accurate results for all your measurement needs.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Enter Measurement Value</h3>
              <p className="text-slate-400">
                Input your measurement in centimeters or tommer. Our converter accepts decimal
                values and automatically switches between units for instant conversion.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Choose Precision Level</h3>
              <p className="text-slate-400">
                Select decimal precision from 0 to 3 decimal places for your conversion needs.
                Perfect for construction accuracy or general furniture measurements.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Get Instant Results</h3>
              <p className="text-slate-400">
                View real-time conversion results with the exact formula used. Perfect for
                understanding Nordic measurement standards and international commerce.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Copy & Use Results</h3>
              <p className="text-slate-400">
                Copy conversion results with one click for use in shopping lists, construction
                plans, or international product specifications.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Tommer Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              What is Tommer? Understanding Nordic Measurement Units
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  Tommer is the Danish and Norwegian word for "inch" and represents a traditional
                  Nordic measurement unit. In modern usage, 1 tommer equals exactly 2.54
                  centimeters, identical to the international inch standard. This CM to Tommer
                  converter helps you navigate Nordic measurements for furniture shopping,
                  construction projects, and international commerce.
                </p>
                <p className="text-slate-200">
                  Our centimeter to tommer converter is essential for anyone working with Nordic
                  countries, IKEA furniture dimensions, Scandinavian construction standards, or
                  international product specifications that use tommer measurements.
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Tommer Conversion Benefits
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• Accurate Nordic measurement conversion</li>
                  <li>• Perfect for IKEA furniture dimensions</li>
                  <li>• Essential for construction projects</li>
                  <li>• International commerce compatibility</li>
                  <li>• Precision up to 3 decimal places</li>
                  <li>• Free and instant conversion</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CM to Tommer Conversion Guide */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              CM to Tommer Conversion Formula & Calculator Guide
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">📏 Conversion Formula</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      cm × 0.3937 = tommer
                    </code>
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      tommer × 2.54 = cm
                    </code>
                  </p>
                  <p>Use our calculator for instant and accurate conversions.</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🎯 Precision Control</h3>
                <div className="space-y-2 text-slate-200">
                  <p>0 decimals: General measurements</p>
                  <p>1-2 decimals: Furniture dimensions</p>
                  <p>3 decimals: Construction precision</p>
                  <p>Choose the right precision for your specific needs.</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">⚡ Quick Examples</h3>
                <div className="space-y-2 text-slate-200">
                  <p>10 cm = 3.94 tommer</p>
                  <p>25.4 cm = 10 tommer</p>
                  <p>100 cm = 39.37 tommer</p>
                  <p>Perfect for common measurement conversions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Nordic Countries Usage */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Tommer Usage Across Nordic Countries
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🇩🇰 Denmark</h3>
                <p className="text-slate-400">
                  In Denmark, tommer is commonly used in construction, furniture manufacturing, and
                  traditional crafts. Danish furniture companies often specify dimensions in tommer
                  for international markets.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🇳🇴 Norway</h3>
                <p className="text-slate-400">
                  Norwegian construction and woodworking industries frequently use tommer
                  measurements. Our converter helps with Norwegian building standards and
                  architectural specifications.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🌍 International</h3>
                <p className="text-slate-400">
                  Global companies working with Nordic suppliers need accurate tommer conversion for
                  product specifications, shipping dimensions, and quality control standards.
                </p>
              </div>
            </div>
          </section>

          {/* Common Use Cases Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Common CM to Tommer Conversion Use Cases
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">IKEA Furniture Shopping</h3>
                    <p className="text-slate-400">
                      Convert IKEA furniture dimensions from centimeters to tommer for better
                      understanding of sizes when shopping internationally or comparing with local
                      standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Construction Projects</h3>
                    <p className="text-slate-400">
                      Professional builders and architects need accurate tommer conversion for
                      Nordic construction standards, building materials, and architectural
                      specifications.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">International Commerce</h3>
                    <p className="text-slate-400">
                      Import/export businesses need precise tommer to cm conversion for product
                      specifications, shipping documentation, and quality control standards.
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
                    <h3 className="font-semibold text-white">Home Renovation</h3>
                    <p className="text-slate-400">
                      DIY enthusiasts and homeowners converting Nordic furniture dimensions,
                      appliance sizes, and room measurements for renovation planning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    5
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Educational & Academic</h3>
                    <p className="text-slate-400">
                      Students and researchers studying Nordic culture, international measurements,
                      or working on projects involving Scandinavian countries and standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                    6
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Manufacturing & Design</h3>
                    <p className="text-slate-400">
                      Product designers and manufacturers creating items for Nordic markets need
                      accurate tommer conversion for specifications and compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Measurement Tools Integration */}
          <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Professional Measurement Tools & Nordic Standards
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Nordic Measurement Standards
                </h3>
                <p className="mb-4 text-slate-200">
                  Our CM to Tommer converter follows official Nordic measurement standards used
                  across Denmark, Norway, and international commerce. The tool provides precise
                  conversions essential for professional applications in construction,
                  manufacturing, and international trade.
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• Official Nordic measurement standards</li>
                  <li>• Construction industry compliance</li>
                  <li>• International trade specifications</li>
                  <li>• Quality control measurements</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Professional Conversion Features
                </h3>
                <p className="mb-4 text-slate-200">
                  Designed for professionals who need accurate and reliable tommer conversion for
                  business applications. Our tool supports various precision levels and provides
                  instant results for efficient workflow integration.
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• Precision control (0-3 decimals)</li>
                  <li>• Instant conversion results</li>
                  <li>• Copy-paste functionality</li>
                  <li>• Mobile-friendly interface</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Professional CM to Tommer Converter Features
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                Everything you need for accurate Nordic measurement conversion
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <ArrowLeftRight className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  Bidirectional CM to Tommer Conversion
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Convert from centimeters to tommer and tommer to centimeters with instant results
                  and precision control for all your Nordic measurement needs.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Calculator className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Precision Control</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Choose from 0 to 3 decimal places for your conversion needs. Perfect for
                  construction accuracy, furniture measurements, and professional applications.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Settings className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Professional Tools</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Copy results, view conversion formulas, and access quick reference tables for
                  efficient workflow integration and professional use.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Frequently Asked Questions About CM to Tommer Conversion
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How do I convert centimeters to tommer accurately?
                </h3>
                <p className="text-slate-400">
                  Use our CM to Tommer converter by entering your centimeter value. The tool
                  automatically calculates the tommer equivalent using the precise formula: cm ×
                  0.3937 = tommer. You can adjust decimal precision from 0 to 3 places for your
                  specific needs.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What is the exact conversion formula for CM to Tommer?
                </h3>
                <p className="text-slate-400">
                  The conversion formulas are: 1 cm = 0.3937 tommer and 1 tommer = 2.54 cm. These
                  are based on the international inch standard, as modern tommer is identical to the
                  international inch measurement.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is tommer the same as inches in Nordic countries?
                </h3>
                <p className="text-slate-400">
                  Yes, modern tommer is identical to the international inch. Both equal exactly 2.54
                  centimeters. The word "tommer" is simply the Danish and Norwegian term for "inch,"
                  making our converter perfect for Nordic measurements.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Why do I need a CM to Tommer converter for IKEA furniture?
                </h3>
                <p className="text-slate-400">
                  IKEA and other Nordic furniture companies often use tommer in their specifications
                  for international markets. Our converter helps you understand exact dimensions
                  when shopping for Scandinavian furniture or comparing sizes.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I use this converter for construction projects?
                </h3>
                <p className="text-slate-400">
                  Absolutely! Our CM to Tommer converter is perfect for construction projects,
                  especially when working with Nordic building standards, materials, or
                  architectural specifications that use tommer measurements.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How accurate is this CM to Tommer conversion tool?
                </h3>
                <p className="text-slate-400">
                  Our converter uses the exact international standard conversion factors and
                  provides precision up to 3 decimal places. This accuracy level is suitable for
                  professional applications including construction, manufacturing, and international
                  commerce.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is this CM to Tommer converter free to use?
                </h3>
                <p className="text-slate-400">
                  Yes! Our CM to Tommer converter is completely free with no registration required.
                  Convert unlimited measurements, access all precision levels, and use all features
                  without any restrictions or hidden costs.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I convert multiple measurements at once?
                </h3>
                <p className="text-slate-400">
                  Currently, our converter processes one measurement at a time for maximum accuracy.
                  However, you can quickly convert multiple values by entering each measurement
                  individually and copying the results for your projects.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What other measurement conversion tools do you offer?
                </h3>
                <p className="text-slate-400">
                  We offer a comprehensive suite of measurement and conversion tools for
                  professionals and individuals. Explore our tools section for additional
                  converters, calculators, and utilities designed for accuracy and ease of use.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to Convert CM to Tommer?</h2>
            <p className="mb-8 text-xl text-slate-300">
              Start using our free, accurate, and professional CM to Tommer converter for all your
              Nordic measurement needs.
            </p>
            <button
              onClick={() => {
                document.querySelector("#converter-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Calculator className="h-5 w-5" />
              Use CM to Tommer Converter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
