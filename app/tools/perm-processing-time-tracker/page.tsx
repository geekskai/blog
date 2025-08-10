"use client"

import { useState } from "react"
import {
  FileText,
  Clock,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Home,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import { usePERMTracker } from "./hooks/usePERMTracker"
import CurrentDataPanel from "./components/CurrentDataPanel"
import CaseTracker from "./components/CaseTracker"
import HistoricalChart from "./components/HistoricalChart"
import ShareButtons from "@/components/ShareButtons"

export default function PERMProcessingTimeTracker() {
  const [activeTab, setActiveTab] = useState<"overview" | "cases" | "trends">("overview")

  const {
    currentData,
    userCases,
    historicalData,
    trendAnalysis,
    isLoading,
    lastFetched,
    error,
    hasUserCases,
    totalCases,
    fetchLatestData,
    addCase,
    removeCase,
    updateCase,
    clearAllData,
  } = usePERMTracker()

  const handleTabChange = (tab: "overview" | "cases" | "trends") => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute left-1/2 top-40 h-80 w-80 rounded-full bg-green-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
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
          <li className="font-medium text-slate-100">PERM Processing Time Tracker</li>
        </ol>
      </nav>
      {/* Social Share */}
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <ShareButtons />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <Clock className="mr-2 h-4 w-4" />
            Real-time PERM Processing Tracker
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
            PERM Processing Time Tracker
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            Track your PERM application processing times with real-time DOL data. Get personalized
            estimates, monitor queue positions, and analyze historical trends for your immigration
            case.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="font-medium">Real-time DOL Data</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Privacy First</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Trend Analysis</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-lg bg-slate-800/80 p-1 backdrop-blur-sm">
            <button
              onClick={() => handleTabChange("overview")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => handleTabChange("cases")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "cases"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>My Cases</span>
              {totalCases > 0 && (
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs">
                  {totalCases}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange("trends")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "trends"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Historical Trends</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 p-4">
            <div className="flex items-center">
              <AlertCircle className="mr-3 h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-100">Data Fetch Error</h3>
                <p className="mt-1 text-sm text-red-200">{error}</p>
                <button
                  onClick={fetchLatestData}
                  disabled={isLoading}
                  className="mt-2 text-sm text-red-100 underline hover:text-white disabled:opacity-50"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <CurrentDataPanel
              data={currentData}
              trendAnalysis={trendAnalysis}
              isLoading={isLoading}
              lastFetched={lastFetched}
              onRefresh={fetchLatestData}
            />
          )}

          {activeTab === "cases" && (
            <CaseTracker
              cases={userCases}
              currentData={currentData}
              onAddCase={addCase}
              onRemoveCase={removeCase}
              onUpdateCase={updateCase}
            />
          )}

          {activeTab === "trends" && <HistoricalChart data={historicalData} />}
        </div>

        {/* Data Source Attribution */}
        <div className="mt-12 rounded-lg bg-slate-800/50 p-4 text-center">
          <p className="text-sm text-slate-400">
            📊 Data Source:{" "}
            <a
              href="https://flag.dol.gov/processingtimes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              U.S. Department of Labor - Office of Foreign Labor Certification
            </a>
          </p>
          {lastFetched && (
            <p className="mt-1 text-xs text-slate-500">
              Last updated:{" "}
              {lastFetched.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        {/* Features Section */}
        {activeTab === "overview" && (
          <div className="mt-20">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Powerful PERM Tracking Features
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Everything you need to monitor your PERM application processing status
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Real-time Processing Data</h3>
                <p className="mb-4 text-slate-400">
                  Get the latest PERM processing times directly from DOL data. Track current
                  priority dates, average processing times, and queue lengths with automatic
                  updates.
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Live DOL data integration</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Priority date tracking</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Queue position calculation</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Personal Case Tracking</h3>
                <p className="mb-4 text-slate-400">
                  Add your PERM cases and get personalized processing estimates. Track multiple
                  cases, compare OEWS vs Non-OEWS applications, and monitor your position in the
                  queue.
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Multi-case management</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>OEWS classification tracking</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Processing estimates</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Historical Trend Analysis</h3>
                <p className="mb-4 text-slate-400">
                  Analyze processing time trends over months and years. Understand patterns, predict
                  future processing times, and make informed decisions about your immigration
                  timeline.
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Interactive trend charts</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Pattern recognition</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Future predictions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="mt-20">
          <div className="rounded-xl bg-gradient-to-r from-blue-800 to-purple-700 p-8">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              How to Track Your PERM Processing Time
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">View Current Data</h3>
                <p className="text-blue-100">
                  Check the latest PERM processing times, priority dates, and queue information
                  directly from DOL data.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Add Your Cases</h3>
                <p className="text-blue-100">
                  Enter your PERM submission details to get personalized processing estimates and
                  track your position in the queue.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-600 text-white">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Monitor & Analyze</h3>
                <p className="text-blue-100">
                  Track processing trends, get notifications on updates, and make informed decisions
                  about your immigration timeline.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 space-y-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                How accurate are the processing time estimates?
              </h3>
              <p className="text-slate-400">
                Our estimates are based on official DOL data and historical trends. While we provide
                the most accurate predictions possible, actual processing times may vary based on
                case complexity, DOL workload, and other factors.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Is my case information stored securely?
              </h3>
              <p className="text-slate-400">
                All your case data is stored locally in your browser and never sent to our servers.
                This ensures complete privacy and security of your immigration information.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                What's the difference between OEWS and Non-OEWS cases?
              </h3>
              <p className="text-slate-400">
                OEWS (Occupational Employment Wage Statistics) cases typically process faster as
                they use standardized wage data. Non-OEWS cases require custom wage surveys and
                usually take longer to process.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                How often is the DOL data updated?
              </h3>
              <p className="text-slate-400">
                DOL updates PERM processing time data monthly, typically during the first work week
                of each month. Our tool automatically fetches the latest data to ensure accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Data Management */}
        {hasUserCases && (
          <div className="mt-12 rounded-xl bg-slate-800/50 p-6 ring-1 ring-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Data Management</h3>
                <p className="text-sm text-slate-400">
                  Your case data is stored locally in your browser
                </p>
              </div>
              <button
                onClick={clearAllData}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Clear All Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
