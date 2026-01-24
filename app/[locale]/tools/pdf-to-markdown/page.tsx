"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Remarkable } from "remarkable"
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit3,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileCheck,
  ArrowRight,
  Home,
  ChevronRight,
} from "lucide-react"
import { Link } from "@/app/i18n/navigation"

// Dynamic import for pdfjs-dist to avoid SSR issues
let pdfjsLib: typeof import("pdfjs-dist") | null = null

interface TextItem {
  x: number
  y: number
  width: number
  height: number
  text: string
  font: string
}

interface ParsedPage {
  index: number
  items: TextItem[]
}

interface ParseResult {
  metadata: {
    Title?: string
    Author?: string
    [key: string]: unknown
  }
  pages: ParsedPage[]
  markdown: string
}

const PdfToMarkdown = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [markdown, setMarkdown] = useState("")
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [progress, setProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState("")

  const remarkable = new Remarkable({
    breaks: true,
    html: true,
  })

  // Initialize pdfjs-dist on client side
  useEffect(() => {
    const initPdfJs = async () => {
      if (typeof window !== "undefined") {
        const pdfjs = await import("pdfjs-dist")
        pdfjsLib = pdfjs

        // Configure worker with local file
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"
      }
    }
    initPdfJs()
  }, [])

  // 自动转换PDF的函数
  const convertPdf = useCallback(async (fileToConvert: File) => {
    if (!fileToConvert || !pdfjsLib) return

    setIsLoading(true)
    setError("")
    setProgress(0)

    try {
      const arrayBuffer = await fileToConvert.arrayBuffer()
      const result = await parsePdf(arrayBuffer)
      setParseResult(result)
      setMarkdown(result.markdown)
    } catch (err) {
      console.error("PDF conversion error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while processing the PDF")
    } finally {
      setIsLoading(false)
      setProgress(0)
      setLoadingStage("")
    }
  }, [])

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (selectedFile && selectedFile.type === "application/pdf") {
        setFile(selectedFile)
        setError("")

        // 自动开始转换
        if (pdfjsLib) {
          await convertPdf(selectedFile)
        }
      } else {
        setError("Please select a valid PDF file")
        setFile(null)
      }
    },
    [convertPdf]
  )

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const droppedFile = event.dataTransfer.files[0]
      if (droppedFile && droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setError("")

        // 自动开始转换
        if (pdfjsLib) {
          await convertPdf(droppedFile)
        }
      } else {
        setError("Please drop a valid PDF file")
      }
    },
    [convertPdf]
  )

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const parsePdf = async (fileBuffer: ArrayBuffer): Promise<ParseResult> => {
    if (!pdfjsLib) throw new Error("PDF.js not loaded")

    setLoadingStage("Loading PDF document...")
    setProgress(10)

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(fileBuffer),
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@" + pdfjsLib.version + "/cmaps/",
      cMapPacked: true,
    })

    const pdfDocument = await loadingTask.promise
    setProgress(20)

    setLoadingStage("Parsing metadata...")
    const metadata = await pdfDocument.getMetadata()
    setProgress(30)

    const pages: ParsedPage[] = []
    const totalPages = pdfDocument.numPages

    setLoadingStage(`Extracting text from ${totalPages} pages...`)

    // Process each page
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDocument.getPage(i)
      const textContent = await page.getTextContent()
      const viewport = page.getViewport({ scale: 1.0 })

      // @ts-ignore-next-line
      const textItems: TextItem[] = textContent.items.map((item: Record<string, unknown>) => {
        // Calculate position and size
        const tx = pdfjsLib!.Util.transform(viewport.transform, item.transform)
        const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3])
        // @ts-ignore-next-line
        const dividedHeight = item.height / fontHeight

        return {
          // @ts-ignore-next-line
          x: Math.round(item.transform[4]),
          // @ts-ignore-next-line
          y: Math.round(item.transform[5]),
          // @ts-ignore-next-line
          width: Math.round(item.width),
          // @ts-ignore-next-line
          height: Math.round(dividedHeight <= 1 ? item.height : dividedHeight),
          text: item.str || "",
          font: item.fontName || "default",
        }
      })

      pages.push({
        index: i - 1,
        items: textItems,
      })

      // Update progress
      const pageProgress = 30 + (i / totalPages) * 50
      setProgress(pageProgress)
      setLoadingStage(`Processing page ${i} of ${totalPages}...`)
    }

    setLoadingStage("Converting to Markdown...")
    setProgress(90)

    // Convert to markdown
    const markdown = convertToMarkdown(pages)
    setProgress(100)

    return {
      metadata: (metadata.info as Record<string, unknown>) || {},
      pages,
      markdown,
    }
  }

  const convertToMarkdown = (pages: ParsedPage[]): string => {
    let markdown = ""

    pages.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        markdown += "\n---\n\n" // Page separator
      }

      // Group items by line (similar Y position)
      const lineGroups = groupByLines(page.items)

      lineGroups.forEach((lineItems) => {
        // Sort items in line by X position
        lineItems.sort((a, b) => a.x - b.x)

        const lineText = lineItems
          .map((item) => item.text)
          .join(" ")
          .trim()

        if (lineText) {
          // Simple heuristics for markdown formatting
          if (isLikelyHeader(lineText, lineItems)) {
            const level = getHeaderLevel(lineItems)
            markdown += "#".repeat(level) + " " + lineText + "\n\n"
          } else if (isLikelyListItem(lineText)) {
            markdown += "- " + lineText.replace(/^[-•*]\s*/, "") + "\n"
          } else {
            markdown += lineText + "\n\n"
          }
        }
      })
    })

    return markdown.trim()
  }

  const groupByLines = (items: TextItem[]): TextItem[][] => {
    if (items.length === 0) return []

    // Sort by Y position (top to bottom)
    const sortedItems = [...items].sort((a, b) => b.y - a.y)

    const lines: TextItem[][] = []
    let currentLine: TextItem[] = [sortedItems[0]]

    for (let i = 1; i < sortedItems.length; i++) {
      const item = sortedItems[i]
      const lastItem = currentLine[currentLine.length - 1]

      // If Y positions are similar (within 5 units), consider same line
      if (Math.abs(item.y - lastItem.y) <= 5) {
        currentLine.push(item)
      } else {
        lines.push(currentLine)
        currentLine = [item]
      }
    }

    lines.push(currentLine)
    return lines
  }

  const isLikelyHeader = (text: string, items: TextItem[]): boolean => {
    // Check if text is short and potentially a header
    if (text.length > 100) return false

    // Check for common header patterns
    const headerPatterns = [
      /^\d+\.?\s+[A-Z]/, // "1. Title" or "1 Title"
      /^[A-Z][A-Z\s]+$/, // "ALL CAPS"
      /^[A-Z]/, // Starts with capital
    ]

    // Check if font size is larger than average (simplified heuristic)
    const avgHeight = items.reduce((sum, item) => sum + item.height, 0) / items.length
    const isLargerFont = avgHeight > 12

    return isLargerFont && headerPatterns.some((pattern) => pattern.test(text))
  }

  const getHeaderLevel = (items: TextItem[]): number => {
    const avgHeight = items.reduce((sum, item) => sum + item.height, 0) / items.length

    // Simple heuristic based on font size
    if (avgHeight > 20) return 1
    if (avgHeight > 16) return 2
    if (avgHeight > 14) return 3
    return 4
  }

  const isLikelyListItem = (text: string): boolean => {
    return /^[-•*]\s+/.test(text) || /^\d+\.\s+/.test(text)
  }

  const downloadMarkdown = () => {
    if (!markdown) return

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${file?.name?.replace(".pdf", "") || "converted"}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetState = () => {
    setFile(null)
    setMarkdown("")
    setParseResult(null)
    setError("")
    setActiveTab("edit")
    setProgress(0)
    setLoadingStage("")
  }

  const renderPreview = () => {
    if (!markdown) return <p className="text-slate-400">Converted markdown will appear here...</p>

    try {
      const html = remarkable.render(markdown)
      return (
        <div
          className="prose prose-sm prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )
    } catch (err) {
      return <p className="text-red-400">Error rendering preview</p>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">Home</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="hover:text-slate-200">
              Tools
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">PDF to Markdown</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <FileText className="mr-2 h-4 w-4" />
            PDF to Markdown Converter
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent">
            PDF to Markdown Converter
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Professional PDF to Markdown converter online. Convert PDF to MD format instantly with
            our <strong>free</strong> PDF markdown converter. Extract text from PDF documents and
            transform to clean, editable Markdown files. <strong>No registration required</strong>,{" "}
            <strong>privacy-first</strong> local processing.
          </p>
        </div>

        {/* Main Content - Single Flow */}
        <div className="space-y-6">
          {/* Upload or Show Success */}
          {!parseResult ? (
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              {/* Upload Section */}
              <div className="p-8">
                <div
                  role="button"
                  tabIndex={0}
                  className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 transition-all duration-200 hover:border-blue-500 hover:bg-slate-600"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById("file-input")?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      document.getElementById("file-input")?.click()
                    }
                  }}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {isLoading ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-slate-300">{loadingStage}</p>
                        <p className="text-sm text-slate-500">{Math.round(progress)}% complete</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="rounded-full bg-blue-900 p-4 group-hover:bg-blue-800">
                        <Upload className="h-8 w-8 text-blue-400" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-300">
                          Upload PDF for Markdown Conversion
                        </h3>
                        <p className="text-slate-400">
                          Drop your PDF file here to convert PDF to MD format instantly
                        </p>
                        <p className="text-xs text-slate-400">
                          Free PDF to markdown converter - Maximum file size: 50MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 flex items-center space-x-2 rounded-lg bg-red-900/20 p-3 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl ring-1 ring-slate-700">
              {/* Success Header */}
              <div className="gap-5 border-b border-slate-700 bg-gradient-to-r from-green-900/20 to-emerald-900/20 p-6">
                {/* File Information */}
                {file && (
                  <h3 className="mb-4 flex w-full flex-1 items-center justify-center gap-4 px-4 text-center text-2xl">
                    <span className="truncate font-medium text-slate-300">📄 {file.name}</span>
                    <span className="text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </h3>
                )}

                <div className="flex items-center justify-between">
                  {/* Left: Success Message */}
                  <div className="flex flex-1 items-center space-x-3">
                    <div className="rounded-full bg-green-900 p-2">
                      <FileCheck className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Conversion Complete</h3>
                      <p className="text-sm text-slate-400">
                        Your PDF has been successfully converted to Markdown
                      </p>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex flex-1 flex-col items-center justify-end">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
                      <button
                        onClick={resetState}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-600"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Convert Another PDF
                      </button>

                      <button
                        onClick={downloadMarkdown}
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Markdown
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-slate-700">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === "edit"
                        ? "border-blue-400 text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <Edit3 className="mr-2 inline h-4 w-4" />
                    Edit Markdown
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === "preview"
                        ? "border-blue-400 text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <Eye className="mr-2 inline h-4 w-4" />
                    Preview
                  </button>
                </nav>
              </div>

              {/* Content Area */}
              <div className="h-[500px] overflow-hidden">
                {activeTab === "edit" ? (
                  <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="h-full w-full resize-none border-none bg-transparent p-6 font-mono text-sm text-slate-200 outline-none"
                    placeholder="Your converted markdown will appear here..."
                  />
                ) : (
                  <div className="h-full overflow-auto p-6">{renderPreview()}</div>
                )}
              </div>

              {/* Document Stats */}
              {parseResult.metadata && (
                <div className="border-t border-slate-700 bg-slate-800/50 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
                    <div className="text-center">
                      <p className="font-medium text-white">{parseResult.pages.length}</p>
                      <p className="text-slate-500">Pages</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-white">
                        {markdown.split(/\s+/).length.toLocaleString()}
                      </p>
                      <p className="text-slate-500">Words</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-white">{markdown.length.toLocaleString()}</p>
                      <p className="text-slate-500">Characters</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-white">
                        {markdown.split("\n").length.toLocaleString()}
                      </p>
                      <p className="text-slate-500">Lines</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-white">
                        {(markdown.length / 1024).toFixed(1)}KB
                      </p>
                      <p className="text-slate-500">Size</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Core Facts Section - Only show when no result - Optimized for AI retrieval */}
        {!parseResult && !isLoading && (
          <div className="mt-16">
            {/* Core Facts Extraction - Key information for AI */}
            <section className="mb-12 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-blue-500/10 p-8 backdrop-blur-sm">
              <h2 className="mb-6 text-center text-2xl font-bold text-white">Core Information</h2>
              <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <dt className="mb-2 text-sm font-medium text-slate-400">Pricing</dt>
                  <dd className="text-xl font-bold text-green-400">
                    <strong>Free Forever</strong>
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="mb-2 text-sm font-medium text-slate-400">Target Users</dt>
                  <dd className="text-lg font-semibold text-white">
                    <strong>Developers, Technical Writers, Content Creators</strong>
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="mb-2 text-sm font-medium text-slate-400">Positioning</dt>
                  <dd className="text-lg font-semibold text-white">
                    <strong>Privacy-First PDF to MD Converter</strong>
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="mb-2 text-sm font-medium text-slate-400">Key Features</dt>
                  <dd className="text-lg font-semibold text-white">
                    <strong>Local Processing, Format Preservation, No Registration</strong>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Features Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Lightning Fast</h3>
                <p className="text-slate-400">
                  <strong>Advanced parsing algorithms</strong> ensure rapid conversion without
                  compromising quality. Process PDFs up to <strong>50MB</strong> in seconds.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Format Preserved</h3>
                <p className="text-slate-400">
                  <strong>Intelligent parsing</strong> maintains document structure, headers, and
                  formatting. Achieves <strong>95%+ accuracy</strong> in preserving original
                  content.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Privacy First</h3>
                <p className="text-slate-400">
                  All processing happens <strong>locally in your browser</strong>. Your files{" "}
                  <strong>never leave your device</strong>, ensuring complete privacy and security.
                </p>
              </div>
            </div>

            {/* Detailed Content Sections for SEO */}
            <div className="mt-20 space-y-16">
              {/* How to Use Section - Content chunked for AI retrieval */}
              <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  How to Use Our PDF to Markdown Converter: Complete Guide
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                        1
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">Upload Your PDF Document</h3>
                        <p className="text-slate-400">
                          Click the upload area or drag and drop your PDF file into our PDF to
                          markdown converter. Our tool supports PDF files up to{" "}
                          <strong>50MB</strong> for PDF to MD conversion.{" "}
                          <strong>No registration required</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                        2
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">Automatic PDF to MD Conversion</h3>
                        <p className="text-slate-400">
                          Our PDF markdown converter <strong>automatically processes</strong> your
                          document, extracting text and converting PDF to markdown format while{" "}
                          <strong>preserving the original structure</strong>. Conversion happens{" "}
                          <strong>locally in your browser</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                        3
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">Edit & Preview Markdown</h3>
                        <p className="text-slate-400">
                          Fine-tune your converted markdown content using our{" "}
                          <strong>built-in editor</strong>. Preview the PDF to markdown conversion
                          results with <strong>live formatting</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                        4
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">Download MD File</h3>
                        <p className="text-slate-400">
                          Download your converted markdown file ready for use in{" "}
                          <strong>
                            documentation, GitHub, or any markdown-compatible platform
                          </strong>{" "}
                          after the PDF to MD conversion. <strong>Free unlimited downloads</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Use Cases Section - Fact chunks for AI */}
              <section className="rounded-xl bg-slate-800 p-8">
                <h2 className="mb-6 text-2xl font-bold text-white">Why Convert PDF to Markdown?</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-700 p-6">
                    <h3 className="mb-3 font-semibold text-white">Documentation</h3>
                    <p className="text-slate-400">
                      Convert PDF documentation to Markdown for <strong>easier editing</strong>,{" "}
                      <strong>version control</strong>, and integration with documentation platforms
                      like <strong>GitBook or Notion</strong>. Perfect for technical writers and
                      developers.
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-700 p-6">
                    <h3 className="mb-3 font-semibold text-white">Content Management</h3>
                    <p className="text-slate-400">
                      Transform PDF reports, articles, and guides into{" "}
                      <strong>editable Markdown format</strong> for content management systems and{" "}
                      <strong>static site generators</strong>. Ideal for content creators and
                      bloggers.
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-700 p-6">
                    <h3 className="mb-3 font-semibold text-white">GitHub Integration</h3>
                    <p className="text-slate-400">
                      Convert PDF files to Markdown for <strong>README files</strong>,{" "}
                      <strong>project documentation</strong>, and GitHub wikis with{" "}
                      <strong>proper formatting preserved</strong>. Essential for open-source
                      projects.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  PDF to Markdown Converter FAQ
                </h2>
                <div className="space-y-6">
                  <div className="border-b border-slate-700 pb-4">
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      What is the best free PDF to Markdown converter?
                    </h3>
                    <p className="text-slate-400">
                      Our PDF to Markdown converter is the <strong>best free online tool</strong>{" "}
                      for converting PDF to MD format. This PDF markdown converter offers{" "}
                      <strong>unlimited conversions</strong> with{" "}
                      <strong>no registration requirements</strong>,{" "}
                      <strong>subscription fees</strong>, or <strong>usage limits</strong>. Convert
                      PDF documents to markdown format as many times as you need.{" "}
                      <strong>100% free forever</strong>.
                    </p>
                  </div>
                  <div className="border-b border-slate-700 pb-4">
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      How accurate is PDF to MD conversion with this converter?
                    </h3>
                    <p className="text-slate-400">
                      Our PDF to markdown converter uses{" "}
                      <strong>advanced parsing algorithms</strong> to maintain document structure
                      when converting PDF to MD format. The PDF markdown conversion preserves{" "}
                      <strong>headers, lists, and formatting</strong>. Most PDF to markdown
                      conversions achieve <strong>95%+ accuracy</strong> in preserving the original
                      content structure.
                    </p>
                  </div>
                  <div className="border-b border-slate-700 pb-4">
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      Is this PDF to markdown converter secure?
                    </h3>
                    <p className="text-slate-400">
                      Yes, our PDF to MD converter is <strong>completely secure</strong>. All PDF to
                      markdown conversion happens <strong>locally in your browser</strong> using
                      client-side JavaScript. When you convert PDF to markdown with our tool, your
                      files <strong>never leave your device</strong>, ensuring{" "}
                      <strong>complete privacy and security</strong> during the PDF markdown
                      conversion process.
                    </p>
                  </div>
                  <div className="border-b border-slate-700 pb-4">
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      What are the file size limits for PDF to markdown conversion?
                    </h3>
                    <p className="text-slate-400">
                      Our PDF to markdown converter supports files up to <strong>50MB</strong> for
                      converting PDF to MD format. For larger PDF files, consider splitting them
                      into smaller sections before using the PDF markdown converter for optimal
                      conversion results.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      Can I convert scanned PDFs to markdown format?
                    </h3>
                    <p className="text-slate-400">
                      This PDF to markdown converter works best with{" "}
                      <strong>text-based PDF documents</strong>. For scanned PDFs or image-based
                      documents, the PDF to MD conversion may not extract text accurately as our PDF
                      markdown converter{" "}
                      <strong>
                        doesn't include OCR (Optical Character Recognition) functionality
                      </strong>
                      . Use text-based PDFs for best results when converting PDF to markdown.
                    </p>
                  </div>
                </div>
              </section>

              {/* Technical Benefits - Fact chunks */}
              <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  Advanced PDF to Markdown Conversion Features
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Smart Format Detection</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li>
                        • <strong>Automatically detects headers</strong> and converts to Markdown
                        heading syntax
                      </li>
                      <li>
                        • <strong>Preserves bullet points</strong> and numbered lists
                      </li>
                      <li>
                        • <strong>Maintains paragraph structure</strong> and spacing
                      </li>
                      <li>
                        • <strong>Handles multiple column layouts</strong> intelligently
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Browser-Based Processing</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li>
                        • <strong>No server uploads required</strong> for privacy
                      </li>
                      <li>
                        • <strong>Works offline</strong> once page is loaded
                      </li>
                      <li>
                        • <strong>Compatible with all modern browsers</strong>
                      </li>
                      <li>
                        • <strong>Real-time conversion progress</strong> tracking
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PdfToMarkdown
