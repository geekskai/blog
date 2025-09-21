"use client"

import React from "react"
import {
  Microscope,
  ArrowLeftRight,
  Atom,
  BookOpen,
  Home,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
  Calculator,
  Settings,
  Beaker,
  Dna,
  Target,
  Award,
} from "lucide-react"
import ConverterCard from "./components/ConverterCard"
import QuickReference from "./components/QuickReference"
import EducationalContent from "./components/EducationalContent"

export default function CmToPmConverter() {
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
          <li className="font-medium text-slate-100">PM to CM & CM to PM Converter</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section with Converter */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <Microscope className="mr-2 h-4 w-4 text-blue-400" />
              Professional PM to CM & CM to PM Scientific Converter & Calculator
              <Sparkles className="ml-2 h-4 w-4 text-purple-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">PM to CM & CM to PM</span>
              <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Scientific Converter
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              <strong className="text-slate-300">
                Professional PM to CM and CM to PM converter
              </strong>{" "}
              for scientists, researchers, and students. Convert{" "}
              <strong className="text-slate-300">picometers to centimeters</strong> and{" "}
              <strong className="text-slate-300">centimeters to picometers</strong> with{" "}
              <strong className="text-slate-300">scientific precision</strong> up to 6 decimal
              places. Perfect for{" "}
              <strong className="text-slate-300">nanotechnology research</strong>,{" "}
              <strong className="text-slate-300">atomic physics calculations</strong>,{" "}
              <strong className="text-slate-300">materials science</strong>, and{" "}
              <strong className="text-slate-300">molecular measurements</strong>. Features{" "}
              <strong className="text-slate-300">
                bidirectional PM to CM and CM to PM conversion
              </strong>
              , <strong className="text-slate-300">scientific notation support</strong> and{" "}
              <strong className="text-slate-300">atomic scale visualization</strong>.
            </p>

            {/* SEO-optimized feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Scientific Precision Converter</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Atom className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Atomic Scale Measurements</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Beaker className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Nanotechnology Research Tool</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Dna className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Molecular Biology Calculator</span>
              </div>
            </div>

            {/* Additional SEO keywords section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  pm to cm converter
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  cm to pm converter
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  pm to cm calculator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  cm to pm calculator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  scientific notation
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  atomic measurements
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  nanotechnology tools
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  research calculator
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
              How to Use PM to CM & CM to PM Converter - Complete Scientific Guide
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Master <strong className="text-slate-300">PM to CM conversion</strong> and{" "}
              <strong className="text-slate-300">CM to PM conversion</strong> for{" "}
              <strong className="text-slate-300">scientific research</strong>,{" "}
              <strong className="text-slate-300">nanotechnology applications</strong>, and{" "}
              <strong className="text-slate-300">atomic physics calculations</strong>. Our{" "}
              <strong className="text-slate-300">
                professional bidirectional scientific converter
              </strong>{" "}
              provides laboratory-grade accuracy for all your PM to CM and CM to PM measurement
              needs.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Enter Scientific Value</h3>
              <p className="text-slate-400">
                Input your measurement in picometers or centimeters for PM to CM and CM to PM
                conversion. Supports both decimal notation and scientific notation (e.g., 1.5e-8)
                for precise scientific calculations.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Select Precision Level</h3>
              <p className="text-slate-400">
                Choose decimal precision from 0 to 6 decimal places for both PM to CM and CM to PM
                conversions. Use higher precision (4-6) for research calculations and lower
                precision (0-2) for general measurements.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">View Scientific Results</h3>
              <p className="text-slate-400">
                Get instant PM to CM and CM to PM conversion results with scientific notation,
                conversion formula, and atomic scale comparisons for better understanding of the
                measurements.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Export for Research</h3>
              <p className="text-slate-400">
                Copy formatted results with formulas to clipboard for use in research papers,
                laboratory reports, or scientific calculations and documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Picometer Section */}
          <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              PM to CM & CM to PM Conversion: Understanding Atomic Scale Measurements
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  A picometer (pm) is a unit of length equal to one trillionth of a meter (10⁻¹² m).
                  This incredibly small unit is essential for measuring atomic dimensions, molecular
                  bonds, and quantum phenomena. Our <strong>PM to CM and CM to PM converter</strong>{" "}
                  provides the scientific precision needed for nanotechnology research, atomic
                  physics, and materials science applications.
                </p>
                <p className="text-slate-200">
                  <strong>PM to CM conversion:</strong> 1 pm = 1 × 10⁻¹⁰ cm.{" "}
                  <strong>CM to PM conversion:</strong> 1 cm = 1 × 10¹⁰ pm. This bidirectional
                  conversion is critical for bridging macroscopic and atomic scale measurements in
                  scientific research and engineering applications.
                </p>
              </div>
              <div className="rounded-lg bg-blue-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">Picometer Applications</h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• Atomic radius measurements</li>
                  <li>• Molecular bond length calculations</li>
                  <li>• Nanotechnology precision engineering</li>
                  <li>• Quantum mechanics research</li>
                  <li>• Crystal lattice parameter analysis</li>
                  <li>• X-ray crystallography studies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Scientific Precision Section */}
          <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Scientific Precision in PM to CM and CM to PM Conversion
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🔬 Precision Levels</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <strong>0-1 decimals:</strong> General measurements
                  </p>
                  <p>
                    <strong>2-3 decimals:</strong> Standard research
                  </p>
                  <p>
                    <strong>4-6 decimals:</strong> High-precision calculations
                  </p>
                  <p>Choose precision based on your research requirements.</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">⚡ Scientific Notation</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      1 cm = 1.00 × 10¹⁰ pm
                    </code>
                  </p>
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      1 pm = 1.00 × 10⁻¹⁰ cm
                    </code>
                  </p>
                  <p>Automatic scientific notation for large values.</p>
                </div>
              </div>
              <div className="rounded-lg bg-purple-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🎯 Accuracy Standards</h3>
                <div className="space-y-2 text-slate-200">
                  <p>Maintains 15 significant digits</p>
                  <p>Supports values up to 10¹⁵ pm</p>
                  <p>Laboratory-grade precision</p>
                  <p>Perfect for professional research applications.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Research Applications */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Research Applications of PM to CM and CM to PM Conversion
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🔬 Nanotechnology</h3>
                <p className="text-slate-400">
                  Essential for designing nanomaterials, quantum dots, and molecular machines.
                  Precise measurements are critical for nanoparticle synthesis and characterization
                  in advanced materials research.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">⚛️ Atomic Physics</h3>
                <p className="text-slate-400">
                  Fundamental for atomic radius calculations, electron orbital measurements, and
                  quantum mechanical modeling. Critical for understanding atomic structure and
                  behavior at the quantum level.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🧬 Molecular Biology</h3>
                <p className="text-slate-400">
                  Vital for protein structure analysis, DNA measurements, and cellular component
                  studies. Enables precise characterization of biological molecules and their
                  interactions.
                </p>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Professional PM to CM & CM to PM Converter Features
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                Everything you need for accurate PM to CM and CM to PM scientific measurement
                conversion
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <ArrowLeftRight className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  Bidirectional PM to CM & CM to PM Conversion
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Convert from picometers to centimeters (PM to CM) and centimeters to picometers
                  (CM to PM) with scientific precision and automatic formula display for research
                  documentation.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Target className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Ultra-High Precision</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Choose from 0 to 6 decimal places with automatic precision recommendations.
                  Perfect for research calculations requiring laboratory-grade accuracy.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Award className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Research-Grade Tools</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Scientific notation support, atomic scale visualization, and educational content
                  designed specifically for researchers and students.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Frequently Asked Questions About PM to CM and CM to PM Conversion
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How do I convert PM to CM and CM to PM accurately?
                </h3>
                <p className="text-slate-400">
                  Use our PM to CM and CM to PM converter by entering your value in either
                  picometers or centimeters. For <strong>PM to CM conversion</strong>: divide by
                  10¹⁰ (pm ÷ 10¹⁰ = cm). For <strong>CM to PM conversion</strong>: multiply by 10¹⁰
                  (cm × 10¹⁰ = pm). You can adjust precision from 0 to 6 decimal places for your
                  specific research needs.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What are the exact conversion formulas for PM to CM and CM to PM?
                </h3>
                <p className="text-slate-400">
                  The bidirectional conversion formulas are: <strong>CM to PM:</strong> 1 cm = 1 ×
                  10¹⁰ pm and <strong>PM to CM:</strong> 1 pm = 1 × 10⁻¹⁰ cm. These are based on the
                  international standard where 1 meter = 10¹² picometers and 1 meter = 100
                  centimeters. Our converter handles both PM to CM and CM to PM conversions
                  automatically.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Why are PM to CM and CM to PM conversions important in scientific research?
                </h3>
                <p className="text-slate-400">
                  PM to CM and CM to PM conversions bridge macroscopic and atomic scales, essential
                  for nanotechnology, atomic physics, and materials science. Both PM to CM and CM to
                  PM conversions enable researchers to work with atomic dimensions while relating
                  them to measurable quantities.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I use scientific notation with this converter?
                </h3>
                <p className="text-slate-400">
                  Yes, our converter supports both standard decimal input and scientific notation
                  (e.g., 1.5e-8). Results can be displayed in both formats, with automatic
                  scientific notation for very large numbers exceeding 1×10⁶.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How accurate is this PM to CM and CM to PM converter for research purposes?
                </h3>
                <p className="text-slate-400">
                  Our PM to CM and CM to PM converter maintains accuracy to 15 significant digits
                  and supports values up to 10¹⁵ picometers. This precision level is suitable for
                  professional scientific research, including nanotechnology and atomic physics
                  applications. Both PM to CM and CM to PM conversions are equally accurate.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is this PM to CM and CM to PM converter free for academic use?
                </h3>
                <p className="text-slate-400">
                  Yes! Our PM to CM and CM to PM converter is completely free for all users,
                  including researchers, students, and academic institutions. No registration or
                  subscription is required for unlimited PM to CM and CM to PM conversions.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What scientific applications commonly use PM to CM and CM to PM conversion?
                </h3>
                <p className="text-slate-400">
                  Common applications include nanotechnology research, atomic radius calculations,
                  molecular bond length measurements, X-ray crystallography, quantum mechanics
                  studies, and materials science analysis where atomic-scale precision is required.
                  Both PM to CM and CM to PM conversions are essential for bridging different
                  measurement scales.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">
              Ready to Convert PM to CM & CM to PM?
            </h2>
            <p className="mb-8 text-xl text-slate-300">
              Start using our professional, accurate, and free PM to CM and CM to PM converter for
              all your scientific research and educational needs. Get instant bidirectional
              conversions with scientific precision.
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
              Use PM to CM & CM to PM Scientific Converter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
