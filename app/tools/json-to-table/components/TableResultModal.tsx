"use client"

import React, { useEffect } from "react"
import { OutputFormat, type TableData } from "../types"
import { renderHTMLTable, renderASCIITable, renderJSON } from "../lib/table-generator"

interface TableResultModalProps {
  isOpen: boolean
  onClose: () => void
  tableData: TableData | null
  format: OutputFormat
  loading?: boolean
  error?: string
}

export default function TableResultModal({
  isOpen,
  onClose,
  tableData,
  format,
  loading = false,
  error,
}: TableResultModalProps) {
  const [copied, setCopied] = React.useState(false)
  // ESC键关闭弹窗
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden" // 防止背景滚动
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileExtension = (format: OutputFormat): string => {
    switch (format) {
      case OutputFormat.HTML:
        return "html"
      case OutputFormat.ASCII:
        return "txt"
      case OutputFormat.JSON:
        return "json"
      default:
        return "txt"
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-96 items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500/30 border-t-orange-500"></div>
            <span className="text-lg text-white">Processing data...</span>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <div className="mb-4 text-6xl">❌</div>
          <h3 className="mb-2 text-xl font-semibold text-red-400">Processing Error</h3>
          <p className="text-red-300">{error}</p>
        </div>
      )
    }

    if (!tableData) {
      return (
        <div className="flex h-96 items-center justify-center text-center">
          <div className="space-y-4">
            <div className="text-6xl">📊</div>
            <div>
              <h3 className="text-xl font-semibold text-white">No Data Yet</h3>
              <p className="text-slate-300">Select a data source to generate a table</p>
            </div>
          </div>
        </div>
      )
    }

    const renderedContent = (() => {
      switch (format) {
        case OutputFormat.HTML:
          return renderHTMLTable(tableData)
        case OutputFormat.ASCII:
          return renderASCIITable(tableData)
        case OutputFormat.JSON:
          return renderJSON(tableData)
        default:
          return renderHTMLTable(tableData)
      }
    })()

    return (
      <div className="space-y-6">
        {/* 元数据信息 */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2">
            <span className="text-orange-300">
              📊 {tableData.metadata.totalRows} rows × {tableData.metadata.totalColumns} columns
            </span>
          </div>
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2">
            <span className="text-purple-300">📋 Type: {tableData.metadata.dataType}</span>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2">
            <span className="text-blue-300">🎨 Format: {format}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(renderedContent)}
            className={`group relative overflow-hidden rounded-xl border px-4 py-2 transition-all duration-300 hover:shadow-lg ${
              copied
                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:shadow-emerald-500/25"
                : "border-green-500/30 bg-green-500/10 text-green-300 hover:shadow-green-500/25"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <span className="relative flex items-center gap-2 text-sm">
              <span>{copied ? "✅" : "📋"}</span>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </span>
          </button>

          <button
            onClick={() => downloadAsFile(renderedContent, `table.${getFileExtension(format)}`)}
            className="group relative overflow-hidden rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <span className="relative flex items-center gap-2 text-sm">
              <span>💾</span>
              Download File
            </span>
          </button>
        </div>

        {/* 内容显示 */}
        <div className="to-red-500/3 scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-orange-500/60 hover:scrollbar-thumb-orange-500/80 relative max-h-[60vh] overflow-auto rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/5 p-6 backdrop-blur-sm">
          {format === OutputFormat.HTML ? (
            <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-white">{renderedContent}</pre>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="animate-in fade-in-0 zoom-in-95 relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/25 via-red-500/20 to-pink-500/25 shadow-2xl backdrop-blur-xl duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 装饰性背景元素 */}
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl"></div>

          <div className="relative p-8">
            {/* 标题栏 */}
            <div className="mb-8 flex items-center justify-between">
              <div className="inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
                <span className="text-2xl">📋</span>
                <h2 className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
                  Generated Table
                </h2>
              </div>

              <button
                onClick={onClose}
                className="group relative overflow-hidden rounded-xl border border-slate-500/30 bg-slate-500/10 p-3 text-slate-300 transition-all duration-300 hover:bg-slate-500/20 hover:shadow-lg hover:shadow-slate-500/25"
                title="Close (ESC)"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative text-xl">✕</span>
              </button>
            </div>

            {/* 内容区域 */}
            <div className="overflow-auto">{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  )
}
