"use client"

import React, { useState } from "react"
import {
  FileText,
  Globe,
  Code,
  Zap,
  Users,
  Shield,
  Download,
  Settings,
  History,
  Home,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react"
import { useHtmlConverter } from "./hooks/useHtmlConverter"
import { useConversionHistory } from "./hooks/useConversionHistory"
import InputPanel from "./components/InputPanel"
import PreviewPanel from "./components/PreviewPanel"
import ConversionHistory from "./components/ConversionHistory"

export default function HtmlToMarkdownConverter() {
  const [activeTab, setActiveTab] = useState<"url" | "html">("url")
  const [showHistory, setShowHistory] = useState(false)
  const [showFeatures, setShowFeatures] = useState(true)

  const {
    convert,
    convertMultiple,
    isConverting,
    result,
    batchProgress,
    options,
    updateOptions,
    error,
    resetConverter,
  } = useHtmlConverter()

  const { history, addToHistory, addMultipleToHistory, clearHistory, downloadHistory, hasHistory } =
    useConversionHistory()

  const handleSingleConversion = async (input: string) => {
    const conversionResult = await convert(input, activeTab)
    if (conversionResult) {
      addToHistory(conversionResult)
    }
  }

  const handleBatchConversion = async (inputs: string[]) => {
    const results = await convertMultiple(inputs, activeTab)
    addMultipleToHistory(results)
  }

  const handleHistoryItemSelect = (item: any) => {
    // This could be used to load a previous conversion into the preview
    console.log("Selected history item:", item)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-blue-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute left-1/2 top-40 h-80 w-80 animate-pulse rounded-full bg-green-500 opacity-10 mix-blend-multiply blur-xl filter"></div>
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
          <li className="font-medium text-slate-100">HTML to Markdown Converter</li>
        </ol>
      </nav>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <FileText className="mr-2 h-4 w-4" />
            Free HTML to Markdown Tool
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
            HTML to Markdown Converter
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            Convert HTML content to clean Markdown format. Support for URLs, raw HTML, batch
            processing, and advanced customization options. Perfect for developers, writers, and
            content creators.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Privacy Focused</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Download className="h-4 w-4 text-purple-500" />
              <span className="font-medium">No Registration</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-900/20 p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <p className="text-red-300">{error}</p>
              <button
                onClick={resetConverter}
                className="ml-auto text-sm text-red-400 hover:text-red-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <InputPanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSingleConversion={handleSingleConversion}
              onBatchConversion={handleBatchConversion}
              isConverting={isConverting}
              batchProgress={batchProgress}
            />

            {/* History Toggle */}
            {hasHistory && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex w-full items-center justify-between rounded-lg bg-slate-800/80 p-4 ring-1 ring-slate-700 backdrop-blur-sm hover:bg-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <History className="h-5 w-5 text-slate-400" />
                    <span className="text-white">Conversion History</span>
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                      {history.length}
                    </span>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 text-slate-400 transition-transform ${showHistory ? "rotate-90" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7">
            <PreviewPanel result={result} options={options} onOptionsChange={updateOptions} />
          </div>
        </div>

        {/* History Section */}
        {showHistory && hasHistory && (
          <div className="mt-8">
            <ConversionHistory
              history={history}
              onClear={clearHistory}
              onDownload={downloadHistory}
              onItemSelect={handleHistoryItemSelect}
            />
          </div>
        )}

        {/* Features Section */}
        {showFeatures && (
          <div className="mt-20">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Powerful Features</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Everything you need to convert HTML to Markdown efficiently
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">URL Processing</h3>
                <p className="mb-4 text-slate-400">
                  Convert web pages directly by entering URLs. Supports batch processing of multiple
                  websites simultaneously with smart content extraction.
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Batch URL processing</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Smart content extraction</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>URL validation</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Code className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">HTML Processing</h3>
                <p className="mb-4 text-slate-400">
                  Paste raw HTML and get clean Markdown output. Advanced parsing with support for
                  tables, code blocks, images, and custom elements.
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Table conversion</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Code block detection</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Image preservation</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <Settings className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Customizable Output</h3>
                <p className="mb-4 text-slate-400">
                  Fine-tune conversion settings including heading styles, list markers, code block
                  formatting, and link styles to match your preferences.
                </p>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Heading style options</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>List marker choices</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Format preferences</span>
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
              How to Convert HTML to Markdown
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Choose Input Type</h3>
                <p className="text-blue-100">
                  Select whether you want to convert a website URL or paste HTML code directly.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Customize Settings</h3>
                <p className="text-blue-100">
                  Adjust conversion options like heading styles, list markers, and formatting
                  preferences.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-600 text-white">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Convert & Download</h3>
                <p className="text-blue-100">
                  Get clean Markdown output instantly. Copy to clipboard or download as a file.
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
                Is this HTML to Markdown converter free?
              </h3>
              <p className="text-slate-400">
                Yes! Our HTML to Markdown converter is completely free with no registration
                required. Convert unlimited content, save your conversion history, and download
                results without any restrictions.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                What HTML elements are supported?
              </h3>
              <p className="text-slate-400">
                We support all standard HTML elements including headings, paragraphs, lists, tables,
                code blocks, blockquotes, images, links, and more. Complex elements are
                intelligently converted to their Markdown equivalents.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Can I convert multiple URLs at once?
              </h3>
              <p className="text-slate-400">
                Absolutely! Enable batch mode to convert multiple websites simultaneously. You can
                paste a list of URLs or add them one by one. Progress tracking shows the conversion
                status for each URL.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                How do I customize the Markdown output?
              </h3>
              <p className="text-slate-400">
                Use the settings panel to customize heading styles (ATX vs Setext), list markers (-,
                *, +), code block styles (fenced vs indented), and many other formatting options to
                match your preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
