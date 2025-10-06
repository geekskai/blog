"use client"

import React from "react"
import { Home, ChevronRight, Shield, Zap, Download, Users, AlertTriangle } from "lucide-react"
import ShareButtons from "@/components/ShareButtons"
import LegalDisclaimer, { UsageRestrictions } from "./components/LegalDisclaimer"
import SSNGeneratorComponent from "./components/SSNGenerator"
import EducationalContent from "./components/EducationalContent"
import FAQSection from "./components/FAQSection"

export default function RandomSSNGenerator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <a href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">Home</span>
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <a href="/tools" className="hover:text-slate-200">
              Tools
            </a>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">Random SSN Generator</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          {/* Legal Notice Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <AlertTriangle className="mr-2 h-4 w-4" />
            For Testing & Development Only
          </div>

          {/* Tool Title */}
          <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
            Random SSN Generator & Educational Guide
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Generate valid format Social Security Numbers for software testing and development.
            Learn about SSN structure, validation rules, and best practices for secure development.
            Free educational tool with batch processing and export capabilities.
          </p>

          {/* Share Component */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
              <p className="mb-3 text-center text-sm font-medium text-slate-300">
                Share this SSN generator tool:
              </p>
              <ShareButtons />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Generator Panel */}
          <div className="space-y-6 lg:col-span-8">
            <SSNGeneratorComponent />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Usage Restrictions */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Usage Guidelines</h2>
              </div>
              <div className="p-6">
                <UsageRestrictions />
              </div>
            </div>

            {/* Quick Info */}
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">SSN Quick Facts</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-400"></div>
                    <div>
                      <div className="font-medium text-white">Format Structure</div>
                      <div>XXX-XX-XXXX (9 digits total)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                    <div>
                      <div className="font-medium text-white">Validation Rules</div>
                      <div>Excludes 000, 666, and 900-999 area codes</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-purple-400"></div>
                    <div>
                      <div className="font-medium text-white">Character Set</div>
                      <div>Numeric digits only (0-9)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-orange-400"></div>
                    <div>
                      <div className="font-medium text-white">Use Cases</div>
                      <div>Testing, development, education</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Notice Section - Placed after core functionality */}
        <div className="mt-16">
          <div className="mx-auto">
            <LegalDisclaimer />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Instant Generation</h3>
              <p className="text-slate-400">
                Generate valid SSN formats instantly with proper validation and structure
                compliance. Single or batch generation with real-time validation feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Educational Focus</h3>
              <p className="text-slate-400">
                Learn about SSN structure, validation rules, and best practices for development.
                Perfect for students, educators, and developers learning data validation.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Export & Share</h3>
              <p className="text-slate-400">
                Download generated data in multiple formats (TXT, CSV, JSON) or copy individual
                numbers for immediate use in your development projects.
              </p>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <EducationalContent />

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA Section */}
        <div className="mt-20 rounded-xl bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 p-8 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">
              Join Thousands of Developers Using Our Tools
            </h2>
            <p className="mb-6 text-slate-300">
              Our random SSN generator is trusted by developers, QA engineers, and educators
              worldwide for creating reliable test data while maintaining security and compliance
              standards.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span>No Registration Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span>Educational Content Included</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                <span>Multiple Export Formats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
