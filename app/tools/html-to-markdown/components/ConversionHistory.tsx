"use client"

import React, { useState } from "react"
import {
  History,
  Download,
  Trash2,
  Search,
  Filter,
  Calendar,
  Globe,
  Code,
  FileText,
  Eye,
  Copy,
  Check,
  Clock,
  Hash,
  ExternalLink,
} from "lucide-react"
import { ConversionResult } from "../types"
import { formatFileSize, estimateReadingTime, copyToClipboard } from "../utils/downloadHelper"

interface ConversionHistoryProps {
  history: ConversionResult[]
  onClear: () => void
  onDownload: (selectedIds?: string[]) => void
  onItemSelect?: (item: ConversionResult) => void
}

export default function ConversionHistory({
  history,
  onClear,
  onDownload,
  onItemSelect,
}: ConversionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "url" | "html">("all")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"date" | "wordCount" | "title">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  // Filter and sort history
  const filteredHistory = history
    .filter((item) => {
      if (filterType !== "all" && item.inputType !== filterType) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          item.title?.toLowerCase().includes(query) ||
          item.input.toLowerCase().includes(query) ||
          item.markdown.toLowerCase().includes(query)
        )
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = a.timestamp - b.timestamp
          break
        case "wordCount":
          comparison = a.wordCount - b.wordCount
          break
        case "title":
          const titleA = a.title || ""
          const titleB = b.title || ""
          comparison = titleA.localeCompare(titleB)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredHistory.map((item) => item.id)))
    }
  }

  const handleDownloadSelected = () => {
    if (selectedItems.size > 0) {
      onDownload(Array.from(selectedItems))
    } else {
      onDownload()
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const handleCopyItem = async (item: ConversionResult) => {
    const success = await copyToClipboard(item.markdown)
    if (success) {
      setCopiedItems((prev) => new Set(prev).add(item.id))
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(item.id)
          return newSet
        })
      }, 2000)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  if (history.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="border-b border-slate-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Conversion History</h3>
        </div>
        <div className="p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700">
            <History className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="mb-2 text-lg font-semibold text-white">No conversions yet</h4>
          <p className="text-slate-400">
            Your conversion history will appear here after you convert some content.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="h-5 w-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">
              Conversion History ({filteredHistory.length})
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadSelected}
              className="inline-flex items-center space-x-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>
                {selectedItems.size > 0 ? `Download (${selectedItems.size})` : "Download All"}
              </span>
            </button>
            <button
              onClick={onClear}
              className="inline-flex items-center space-x-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="border-b border-slate-700 px-6 py-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversions..."
              className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "url" | "html")}
              className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="url">URLs</option>
              <option value="html">HTML</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split("-")
                setSortBy(by as "date" | "wordCount" | "title")
                setSortOrder(order as "asc" | "desc")
              }}
              className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="wordCount-desc">Most Words</option>
              <option value="wordCount-asc">Least Words</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Select All */}
        {filteredHistory.length > 0 && (
          <div className="mt-3 flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.size === filteredHistory.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-400">Select all visible items</span>
            </label>
          </div>
        )}
      </div>

      {/* History Items */}
      <div className="max-h-96 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400">No items match your search criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredHistory.map((item) => {
              const isExpanded = expandedItems.has(item.id)
              const isSelected = selectedItems.has(item.id)
              const isCopied = copiedItems.has(item.id)

              return (
                <div key={item.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectItem(item.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    {/* Item Content */}
                    <div className="min-w-0 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center space-x-2">
                            {item.inputType === "url" ? (
                              <Globe className="h-4 w-4 flex-shrink-0 text-blue-400" />
                            ) : (
                              <Code className="h-4 w-4 flex-shrink-0 text-green-400" />
                            )}
                            <h4 className="truncate text-sm font-medium text-white">
                              {item.title || "Untitled Conversion"}
                            </h4>
                          </div>
                          <p className="truncate text-xs text-slate-400">
                            {item.inputType === "url" ? item.input : "HTML Content"}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="ml-4 flex items-center space-x-1">
                          <button
                            onClick={() => handleCopyItem(item)}
                            className={`rounded p-1.5 text-xs transition-colors ${
                              isCopied
                                ? "bg-green-600 text-white"
                                : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white"
                            }`}
                          >
                            {isCopied ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="rounded bg-slate-700 p-1.5 text-slate-400 hover:bg-slate-600 hover:text-white"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          {onItemSelect && (
                            <button
                              onClick={() => onItemSelect(item)}
                              className="rounded bg-slate-700 p-1.5 text-slate-400 hover:bg-slate-600 hover:text-white"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(item.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Hash className="h-3 w-3" />
                          <span>{item.wordCount.toLocaleString()} words</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{formatFileSize(item.size)}</span>
                        </div>
                        <span>{estimateReadingTime(item.wordCount)} read</span>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-4 rounded-lg bg-slate-900 p-4">
                          <div className="max-h-40 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
                              {item.markdown.length > 500
                                ? item.markdown.substring(0, 500) + "..."
                                : item.markdown}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
