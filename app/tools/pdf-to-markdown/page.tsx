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
} from "lucide-react"

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
    if (!markdown) return <p className="text-gray-400">Converted markdown will appear here...</p>

    try {
      const html = remarkable.render(markdown)
      return (
        <div
          className="prose prose-sm prose-gray max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )
    } catch (err) {
      return <p className="text-red-400">Error rendering preview</p>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <FileText className="mr-2 h-4 w-4" />
            PDF to Markdown
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-slate-300">
            Convert PDF to Markdown
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Transform your PDF documents into clean, editable Markdown format. Fast, secure, and
            completely browser-based.
          </p>
        </div>

        {/* Main Content - Single Flow */}
        <div className="space-y-6">
          {/* Upload or Show Success */}
          {!parseResult ? (
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              {/* Upload Section */}
              <div className="p-8">
                <div
                  role="button"
                  tabIndex={0}
                  className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-blue-500 dark:hover:bg-slate-600"
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
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                          {loadingStage}
                        </p>
                        <p className="text-sm text-slate-500">{Math.round(progress)}% complete</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="rounded-full bg-blue-100 p-4 group-hover:bg-blue-200 dark:bg-blue-900 dark:group-hover:bg-blue-800">
                        <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                          Upload your PDF
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                          Click to browse or drag and drop your file here
                        </p>
                        <p className="text-xs text-slate-400">Maximum file size: 50MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              {/* Success Header */}
              <div className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:border-slate-700 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Conversion Complete
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Your PDF has been successfully converted to Markdown
                      </p>
                    </div>
                  </div>
                  {file && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === "edit"
                        ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    }`}
                  >
                    <Edit3 className="mr-2 inline h-4 w-4" />
                    Edit Markdown
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === "preview"
                        ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
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
                    className="h-full w-full resize-none border-none bg-transparent p-6 font-mono text-sm text-slate-800 outline-none dark:text-slate-200"
                    placeholder="Your converted markdown will appear here..."
                  />
                ) : (
                  <div className="h-full overflow-auto p-6">{renderPreview()}</div>
                )}
              </div>

              {/* Document Stats */}
              {parseResult.metadata && (
                <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
                    <div className="text-center">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {parseResult.pages.length}
                      </p>
                      <p className="text-slate-500">Pages</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {markdown.split(/\s+/).length.toLocaleString()}
                      </p>
                      <p className="text-slate-500">Words</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {markdown.length.toLocaleString()}
                      </p>
                      <p className="text-slate-500">Characters</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {markdown.split("\n").length.toLocaleString()}
                      </p>
                      <p className="text-slate-500">Lines</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {(markdown.length / 1024).toFixed(1)}KB
                      </p>
                      <p className="text-slate-500">Size</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
                  <button
                    onClick={resetState}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Convert Another PDF
                  </button>

                  <button
                    onClick={downloadMarkdown}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Markdown
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section - Only show when no result */}
        {!parseResult && !isLoading && (
          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Lightning Fast
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Advanced parsing algorithms ensure rapid conversion without compromising quality.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Format Preserved
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Intelligent parsing maintains document structure, headers, and formatting.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Privacy First
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All processing happens locally in your browser. Your files never leave your
                  device.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PdfToMarkdown
