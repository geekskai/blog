"use client"
import { Calculator, Hammer, Home, ChevronRight, Sparkles, Package, DollarSign } from "lucide-react"
import CalculatorCard from "./components/CalculatorCard"
import ProjectManager from "./components/ProjectManager"
import QuickReference from "./components/QuickReference"
import EducationalContent from "./components/EducationalContent"

export default function BoardFootCalculator() {
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
          <li className="font-medium text-slate-100">Board Foot Calculator</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-16">
          {/* SEO-optimized header */}
          <div className="mb-8 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur-sm">
              <Calculator className="mr-2 h-4 w-4 text-amber-400" />
              Free Board Foot Calculator & Professional Lumber Tool
              <Sparkles className="ml-2 h-4 w-4 text-orange-400" />
            </div>

            <h1 className="mb-8 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              <span className="block">Board Foot Calculator</span>
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                & Lumber Estimator
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-slate-400">
              <strong className="text-slate-300">Professional board foot calculator</strong> for
              lumber and wood projects. Calculate{" "}
              <strong className="text-slate-300">board feet</strong>, estimate{" "}
              <strong className="text-slate-300">lumber costs</strong>, and manage materials for{" "}
              <strong className="text-slate-300">construction</strong>,{" "}
              <strong className="text-slate-300">woodworking</strong>, and{" "}
              <strong className="text-slate-300">furniture making</strong>. Features project
              management,
              <strong className="text-slate-300">waste calculations</strong>, and{" "}
              <strong className="text-slate-300">cost estimation</strong>
              with professional-grade accuracy for contractors, woodworkers, and DIY enthusiasts.
            </p>

            {/* SEO-optimized feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Calculator className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Board Foot Formula Calculator</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">Lumber Cost Estimator</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Package className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Project Management Tool</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Hammer className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Construction Calculator</span>
              </div>
            </div>

            {/* Additional SEO keywords section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  board foot calculator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  lumber calculator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  wood calculator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  construction calculator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  woodworking calculator
                </span>
                <span className="mx-1 inline-block rounded-full bg-slate-800/50 px-3 py-1">
                  lumber cost estimator
                </span>
              </p>
            </div>
          </div>

          {/* Main calculator area */}
          <div id="calculator-section" className="grid gap-8 lg:grid-cols-3">
            {/* Left panel - Calculator */}
            <div className="space-y-6 lg:col-span-2">
              <CalculatorCard />
            </div>

            {/* Right panel - Quick Reference */}
            <div className="lg:col-span-1">
              <QuickReference />
            </div>
          </div>

          {/* Project Manager */}
          <div className="mt-16">
            <ProjectManager />
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
              How to Use Board Foot Calculator - Complete Professional Guide
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              Master <strong className="text-slate-300">board foot calculations</strong> for{" "}
              <strong className="text-slate-300">lumber projects</strong>,{" "}
              <strong className="text-slate-300">construction estimating</strong>, and{" "}
              <strong className="text-slate-300">woodworking planning</strong>. Our{" "}
              <strong className="text-slate-300">professional lumber calculator</strong> provides
              accurate results for all your material needs.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Enter Lumber Dimensions</h3>
              <p className="text-slate-400">
                Input length, width, and thickness of your lumber. Calculator supports both imperial
                (inches/feet) and metric (cm/meters) units with automatic conversion.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Add Pricing Information</h3>
              <p className="text-slate-400">
                Enter price per board foot for accurate cost estimation. Use our wood species
                database for reference pricing or input custom rates.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Get Instant Calculations</h3>
              <p className="text-slate-400">
                View real-time board foot results using the standard formula (L×W×T÷144). Perfect
                for construction and woodworking project planning.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Manage Projects</h3>
              <p className="text-slate-400">
                Add multiple lumber pieces, calculate totals with waste factors, and export results
                for professional project management.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections for SEO */}
        <div className="mt-20 space-y-16">
          {/* What is Board Foot Section */}
          <section className="rounded-xl bg-gradient-to-r from-amber-800 to-orange-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              What is a Board Foot? Understanding Lumber Measurement Standards
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-slate-200">
                  A board foot is the standard unit of measurement for lumber volume in the
                  construction and woodworking industries. One board foot equals 144 cubic inches,
                  equivalent to a piece of wood measuring 12 inches long, 12 inches wide, and 1 inch
                  thick. This Board Foot Calculator uses the industry-standard formula to provide
                  accurate measurements for all your lumber and wood projects.
                </p>
                <p className="text-slate-200">
                  Our lumber calculator is essential for contractors, woodworkers, furniture makers,
                  and DIY enthusiasts who need precise material calculations for construction
                  projects, cabinet making, flooring installation, and custom woodworking.
                </p>
              </div>
              <div className="rounded-lg bg-amber-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Board Foot Calculator Benefits
                </h3>
                <ul className="space-y-2 text-slate-200">
                  <li>• Accurate lumber volume calculations</li>
                  <li>• Professional cost estimation</li>
                  <li>• Project material planning</li>
                  <li>• Waste factor calculations</li>
                  <li>• Multiple unit support</li>
                  <li>• Free professional tool</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Board Foot Formula Guide */}
          <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Board Foot Formula & Lumber Calculation Guide
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">📏 Standard Formula</h3>
                <div className="space-y-2 text-slate-200">
                  <p>
                    <code className="rounded bg-black/30 px-2 py-1 text-sm">
                      Board Feet = (L × W × T) ÷ 144
                    </code>
                  </p>
                  <p className="text-sm">Where L, W, T are in inches</p>
                  <p>Use our calculator for instant and accurate board foot calculations.</p>
                </div>
              </div>
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">🎯 Precision Control</h3>
                <div className="space-y-2 text-slate-200">
                  <p>0 decimals: General estimates</p>
                  <p>1-2 decimals: Standard projects</p>
                  <p>3 decimals: Professional precision</p>
                  <p>Choose the right precision for your specific lumber needs.</p>
                </div>
              </div>
              <div className="rounded-lg bg-orange-900/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">⚡ Quick Examples</h3>
                <div className="space-y-2 text-slate-200">
                  <p>2×4×8ft = 5.33 board feet</p>
                  <p>1×6×10ft = 5.00 board feet</p>
                  <p>2×10×12ft = 20.00 board feet</p>
                  <p>Perfect for common lumber calculations.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Lumber Industry Applications */}
          <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Professional Lumber Calculator Applications
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🏗️ Construction</h3>
                <p className="text-slate-400">
                  Calculate framing lumber, structural beams, and building materials for residential
                  and commercial construction projects. Essential for accurate material ordering and
                  cost estimation.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🪵 Woodworking</h3>
                <p className="text-slate-400">
                  Plan material requirements for furniture making, cabinet construction, and custom
                  woodworking projects. Calculate hardwood and softwood needs with precision.
                </p>
              </div>
              <div className="rounded-lg bg-slate-800 p-6 shadow-md">
                <h3 className="mb-3 text-lg font-semibold text-white">🏪 Retail</h3>
                <p className="text-slate-400">
                  Lumber dealers and retailers use board foot calculations for customer quotes,
                  inventory management, and pricing strategies across different wood species and
                  grades.
                </p>
              </div>
            </div>
          </section>

          {/* Common Use Cases Section */}
          <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Common Board Foot Calculator Use Cases
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Home Construction Projects</h3>
                    <p className="text-slate-400">
                      Calculate lumber needs for house framing, deck construction, room additions,
                      and home renovation projects. Essential for accurate material ordering and
                      budget planning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Furniture & Cabinet Making</h3>
                    <p className="text-slate-400">
                      Plan hardwood requirements for custom furniture, kitchen cabinets, built-in
                      storage, and fine woodworking projects with precise material calculations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Commercial Construction</h3>
                    <p className="text-slate-400">
                      Estimate lumber costs for large-scale construction projects, multi-unit
                      housing, and commercial building framing with professional-grade accuracy.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Flooring Installation</h3>
                    <p className="text-slate-400">
                      Calculate hardwood flooring materials, subflooring requirements, and trim
                      pieces for residential and commercial flooring projects.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    5
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Lumber Retail & Sales</h3>
                    <p className="text-slate-400">
                      Provide accurate customer quotes, manage inventory calculations, and support
                      sales processes with reliable board foot measurements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-sm font-medium text-amber-400">
                    6
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">Educational & Training</h3>
                    <p className="text-slate-400">
                      Support construction education, carpentry training programs, and woodworking
                      courses with accurate calculation tools and learning resources.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Features */}
          <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Professional Board Foot Calculator Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Advanced Calculation Features
                </h3>
                <p className="mb-4 text-slate-200">
                  Our Board Foot Calculator provides professional-grade features including
                  multi-unit support, precision control, waste factor calculations, and project
                  management tools. Perfect for contractors, woodworkers, and lumber professionals
                  who need accurate and reliable calculations.
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• Imperial and metric unit support</li>
                  <li>• Precision control (0-3 decimal places)</li>
                  <li>• Real-time cost estimation</li>
                  <li>• Project management features</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Professional Tools & Export
                </h3>
                <p className="mb-4 text-slate-200">
                  Export calculations to CSV format, manage multiple lumber pieces, and access
                  comprehensive wood species pricing database. Designed for professional workflow
                  integration with copy-paste functionality and mobile-friendly interface.
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li>• CSV export capabilities</li>
                  <li>• Wood species pricing database</li>
                  <li>• Copy-paste functionality</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features section */}
          <div className="mt-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Professional Board Foot Calculator Features
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                Everything you need for accurate lumber calculations and project management
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Calculator className="h-12 w-12 text-amber-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">
                  Accurate Board Foot Calculations
                </h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Calculate lumber board feet using the standard industry formula (L×W×T÷144) with
                  precision control and support for both imperial and metric measurements.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <DollarSign className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Cost Estimation</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Estimate lumber costs with wood species pricing database, waste factor
                  calculations, and tax integration for accurate project budgeting and material
                  planning.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                  <Package className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="mb-6 text-xl font-semibold text-white">Project Management</h3>
                <p className="text-lg leading-relaxed text-slate-400">
                  Manage multiple lumber pieces, calculate project totals, export to CSV format, and
                  organize materials for efficient construction and woodworking project planning.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="rounded-xl bg-slate-800 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Frequently Asked Questions About Board Foot Calculations
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How do I calculate board feet for lumber projects?
                </h3>
                <p className="text-slate-400">
                  Use the standard board foot formula: Board Feet = (Length × Width × Thickness) ÷
                  144, where all dimensions are in inches. Our calculator automatically handles unit
                  conversions and provides instant results with precision control for professional
                  accuracy.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What is the difference between nominal and actual lumber dimensions?
                </h3>
                <p className="text-slate-400">
                  Nominal dimensions (like 2×4) are traditional lumber names, while actual
                  dimensions (1.5" × 3.5" for a 2×4) are the true measurements after planing and
                  drying. Always use actual dimensions for accurate board foot calculations.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How do I estimate lumber costs for my construction project?
                </h3>
                <p className="text-slate-400">
                  Calculate total board feet needed, multiply by price per board foot, and add waste
                  factor (typically 5-15%). Our calculator includes cost estimation features with
                  wood species pricing and waste calculations.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I use this calculator for both hardwood and softwood projects?
                </h3>
                <p className="text-slate-400">
                  Yes, our board foot calculator works for all wood types including hardwoods (oak,
                  maple, walnut) and softwoods (pine, cedar, fir). The calculation formula is
                  universal across all lumber species.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What waste factor should I include in my lumber calculations?
                </h3>
                <p className="text-slate-400">
                  Typical waste factors range from 5-15% depending on project complexity. Simple
                  projects need 5-10% waste, while complex projects with many cuts may require
                  10-15% to account for mistakes and cutting waste.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is this board foot calculator suitable for professional use?
                </h3>
                <p className="text-slate-400">
                  Yes, our calculator provides professional-grade accuracy with precision control up
                  to 3 decimal places. It's used by contractors, woodworkers, lumber dealers, and
                  construction professionals for accurate project planning.
                </p>
              </div>
              <div className="border-b border-slate-700 pb-4">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Can I export my lumber calculations for project documentation?
                </h3>
                <p className="text-slate-400">
                  Yes, the calculator includes project management features with CSV export
                  capabilities. You can save multiple lumber pieces, calculate totals, and export
                  detailed reports for project documentation and material ordering.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Does the calculator work with metric measurements?
                </h3>
                <p className="text-slate-400">
                  Yes, our calculator supports both imperial (inches, feet) and metric (centimeters,
                  meters) units with automatic conversion. This makes it suitable for international
                  projects and users worldwide.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-12 text-center backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to Calculate Board Feet?</h2>
            <p className="mb-8 text-xl text-slate-300">
              Start using our free, professional board foot calculator for all your lumber and
              woodworking projects.
            </p>
            <button
              onClick={() => {
                document.querySelector("#calculator-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Calculator className="h-5 w-5" />
              Use Board Foot Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
