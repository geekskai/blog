"use client"

import React, { useState, useRef } from "react"
import {
  Eye,
  Code,
  Download,
  Copy,
  Settings,
  FileText,
  Clock,
  Hash,
  Archive,
  Check,
  ExternalLink,
  Maximize2,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { ConversionResult, ConversionOptions } from "../types"
import {
  downloadMarkdown,
  copyToClipboard,
  formatFileSize,
  estimateReadingTime,
} from "../utils/downloadHelper"

interface PreviewPanelProps {
  result: ConversionResult | null
  options: ConversionOptions
  onOptionsChange: (options: Partial<ConversionOptions>) => void
}

export default function PreviewPanel({ result, options, onOptionsChange }: PreviewPanelProps) {
  const [activeView, setActiveView] = useState<"preview" | "markdown">("preview")
  const [showSettings, setShowSettings] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const markdownRef = useRef<HTMLDivElement>(null)

  const handleCopy = async () => {
    if (!result) return

    const success = await copyToClipboard(result.markdown)
    setCopySuccess(success)

    if (success) {
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const filename = result.title || "converted-content"
    downloadMarkdown(result.markdown, filename, {
      format: "md",
      includeMetadata: true,
    })
  }

  const handleOptionsChange = (key: keyof ConversionOptions, value: any) => {
    onOptionsChange({ [key]: value })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!result) {
    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
          <div className="border-b border-slate-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Preview</h2>
          </div>
          <div className="p-12 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <FileText className="h-12 w-12 text-white" />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-white">Ready to convert content</h3>
            <p className="text-slate-400">
              Enter a website URL or paste HTML content to see the converted Markdown preview here.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-6" : ""}`}>
      {/* Header with Stats and Actions */}
      <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Conversion Result</h2>
              {result.title && (
                <p className="max-w-md truncate text-sm text-slate-400">{result.title}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-slate-700 px-6 py-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2 text-sm">
              <Hash className="h-4 w-4 text-blue-400" />
              <span className="text-slate-400">Words:</span>
              <span className="font-medium text-white">{result.wordCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Archive className="h-4 w-4 text-green-400" />
              <span className="text-slate-400">Size:</span>
              <span className="font-medium text-white">{formatFileSize(result.size)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-slate-400">Read time:</span>
              <span className="font-medium text-white">
                {estimateReadingTime(result.wordCount)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <ExternalLink className="h-4 w-4 text-orange-400" />
              <span className="text-slate-400">Source:</span>
              <span className="font-medium capitalize text-white">{result.inputType}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg bg-slate-700 p-1">
              <button
                onClick={() => setActiveView("preview")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === "preview"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Eye className="mr-2 inline h-4 w-4" />
                Preview
              </button>
              <button
                onClick={() => setActiveView("markdown")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === "markdown"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Code className="mr-2 inline h-4 w-4" />
                Markdown
              </button>
            </div>

            <button
              onClick={handleCopy}
              className={`inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                copySuccess
                  ? "bg-green-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
              }`}
            >
              {copySuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
          <div className="border-b border-slate-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Conversion Settings</h3>
          </div>
          <div className="space-y-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Heading Style */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Heading Style
                </label>
                <select
                  value={options.headingStyle}
                  onChange={(e) => handleOptionsChange("headingStyle", e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="atx">ATX (# ## ###)</option>
                  <option value="setext">Setext (=== ---)</option>
                </select>
              </div>

              {/* List Marker */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">List Marker</label>
                <select
                  value={options.bulletListMarker}
                  onChange={(e) => handleOptionsChange("bulletListMarker", e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="-">Dash (-)</option>
                  <option value="*">Asterisk (*)</option>
                  <option value="+">Plus (+)</option>
                </select>
              </div>

              {/* Code Block Style */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Code Block Style
                </label>
                <select
                  value={options.codeBlockStyle}
                  onChange={(e) => handleOptionsChange("codeBlockStyle", e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="fenced">Fenced (```)</option>
                  <option value="indented">Indented (4 spaces)</option>
                </select>
              </div>

              {/* Link Style */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Link Style</label>
                <select
                  value={options.linkStyle}
                  onChange={(e) => handleOptionsChange("linkStyle", e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="inlined">Inline [text](url)</option>
                  <option value="referenced">Referenced [text][ref]</option>
                </select>
              </div>
            </div>

            {/* Boolean Options */}
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { key: "preserveImages", label: "Preserve Images" },
                { key: "convertTables", label: "Convert Tables" },
                { key: "cleanHtml", label: "Clean HTML" },
                { key: "removeComments", label: "Remove Comments" },
                { key: "includeMetadata", label: "Include Metadata" },
                { key: "preserveWhitespace", label: "Preserve Whitespace" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options[key as keyof ConversionOptions] as boolean}
                    onChange={(e) =>
                      handleOptionsChange(key as keyof ConversionOptions, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Preview */}
      <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="border-b border-slate-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">
            {activeView === "preview" ? "Markdown Preview" : "Raw Markdown"}
          </h3>
        </div>

        <div className={`${isFullscreen ? "h-[calc(100vh-300px)]" : "max-h-96"} overflow-auto`}>
          {activeView === "preview" ? (
            <div ref={markdownRef} className="prose prose-invert max-w-none p-6">
              <ReactMarkdown
                components={{
                  // Custom components for better styling
                  h1: ({ children }) => (
                    <h1 className="mb-4 text-3xl font-bold text-white">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-3 text-2xl font-bold text-white">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-3 text-xl font-bold text-white">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="mb-2 text-lg font-bold text-white">{children}</h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="mb-2 text-base font-bold text-white">{children}</h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="mb-2 text-sm font-bold text-white">{children}</h6>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed text-slate-300">{children}</p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-400 underline hover:text-blue-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="rounded bg-slate-700 px-1.5 py-0.5 text-sm text-slate-200">
                        {children}
                      </code>
                    ) : (
                      <code className={className}>{children}</code>
                    )
                  },
                  pre: ({ children }) => (
                    <pre className="overflow-x-auto rounded-lg border border-slate-600 bg-slate-900 p-4">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 list-inside list-disc space-y-1 text-slate-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 list-inside list-decimal space-y-1 text-slate-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="text-slate-300">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 border-l-4 border-blue-500 pl-4 italic text-slate-400">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-slate-600 text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-slate-600 bg-slate-700 px-4 py-2 text-left font-medium text-white">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-slate-600 px-4 py-2 text-slate-300">{children}</td>
                  ),
                  hr: () => <hr className="my-6 border-slate-600" />,
                  img: ({ src, alt }) => (
                    <img src={src} alt={alt} className="h-auto max-w-full rounded-lg" />
                  ),
                }}
              >
                {result.markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                {result.markdown}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
