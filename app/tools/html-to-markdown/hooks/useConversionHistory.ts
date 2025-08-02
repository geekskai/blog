import { useState, useEffect, useCallback } from "react"
import { ConversionResult } from "../types"
import { downloadBatchResults } from "../utils/downloadHelper"

const STORAGE_KEY = "html-to-markdown-history"
const MAX_HISTORY_ITEMS = 50

export const useConversionHistory = () => {
  const [history, setHistory] = useState<ConversionResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedHistory = JSON.parse(stored) as ConversionResult[]
        // Sort by timestamp (newest first)
        const sortedHistory = parsedHistory.sort((a, b) => b.timestamp - a.timestamp)
        setHistory(sortedHistory.slice(0, MAX_HISTORY_ITEMS))
      }
    } catch (error) {
      console.error("Failed to load conversion history:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && history.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
      } catch (error) {
        console.error("Failed to save conversion history:", error)
      }
    }
  }, [history, isLoading])

  const addToHistory = useCallback((result: ConversionResult) => {
    setHistory((prev) => {
      // Check if this conversion already exists (by ID)
      const exists = prev.some((item) => item.id === result.id)
      if (exists) {
        return prev
      }

      // Add new result and keep only the latest MAX_HISTORY_ITEMS
      const newHistory = [result, ...prev].slice(0, MAX_HISTORY_ITEMS)
      return newHistory
    })
  }, [])

  const addMultipleToHistory = useCallback((results: ConversionResult[]) => {
    setHistory((prev) => {
      const newResults = results.filter((result) => !prev.some((item) => item.id === result.id))

      const combined = [...newResults, ...prev]
      return combined.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_HISTORY_ITEMS)
    })
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to clear history from storage:", error)
    }
  }, [])

  const getHistoryItem = useCallback(
    (id: string): ConversionResult | undefined => {
      return history.find((item) => item.id === id)
    },
    [history]
  )

  const downloadHistory = useCallback(
    (selectedIds?: string[]) => {
      const itemsToDownload = selectedIds
        ? history.filter((item) => selectedIds.includes(item.id))
        : history

      if (itemsToDownload.length === 0) {
        console.warn("No items to download")
        return
      }

      downloadBatchResults(itemsToDownload, {
        format: "md",
        includeMetadata: true,
      })
    },
    [history]
  )

  const getHistoryStats = useCallback(() => {
    const totalConversions = history.length
    const urlConversions = history.filter((item) => item.inputType === "url").length
    const htmlConversions = history.filter((item) => item.inputType === "html").length
    const totalWordCount = history.reduce((sum, item) => sum + item.wordCount, 0)
    const totalSize = history.reduce((sum, item) => sum + item.size, 0)
    const averageProcessingTime =
      history.length > 0
        ? Math.round(history.reduce((sum, item) => sum + item.processingTime, 0) / history.length)
        : 0

    const oldestTimestamp =
      history.length > 0 ? Math.min(...history.map((item) => item.timestamp)) : Date.now()

    const newestTimestamp =
      history.length > 0 ? Math.max(...history.map((item) => item.timestamp)) : Date.now()

    return {
      totalConversions,
      urlConversions,
      htmlConversions,
      totalWordCount,
      totalSize,
      averageProcessingTime,
      oldestDate: new Date(oldestTimestamp),
      newestDate: new Date(newestTimestamp),
    }
  }, [history])

  const searchHistory = useCallback(
    (query: string): ConversionResult[] => {
      if (!query.trim()) return history

      const lowercaseQuery = query.toLowerCase()
      return history.filter(
        (item) =>
          item.title?.toLowerCase().includes(lowercaseQuery) ||
          item.input.toLowerCase().includes(lowercaseQuery) ||
          item.markdown.toLowerCase().includes(lowercaseQuery)
      )
    },
    [history]
  )

  const filterHistory = useCallback(
    (filters: {
      inputType?: "url" | "html"
      dateRange?: { start: Date; end: Date }
      minWordCount?: number
      maxWordCount?: number
    }): ConversionResult[] => {
      return history.filter((item) => {
        if (filters.inputType && item.inputType !== filters.inputType) {
          return false
        }

        if (filters.dateRange) {
          const itemDate = new Date(item.timestamp)
          if (itemDate < filters.dateRange.start || itemDate > filters.dateRange.end) {
            return false
          }
        }

        if (filters.minWordCount && item.wordCount < filters.minWordCount) {
          return false
        }

        if (filters.maxWordCount && item.wordCount > filters.maxWordCount) {
          return false
        }

        return true
      })
    },
    [history]
  )

  const exportHistory = useCallback(
    (format: "json" | "csv" = "json") => {
      if (history.length === 0) {
        console.warn("No history to export")
        return
      }

      let content: string
      let filename: string
      let mimeType: string

      if (format === "json") {
        content = JSON.stringify(history, null, 2)
        filename = `html-to-markdown-history-${new Date().toISOString().split("T")[0]}.json`
        mimeType = "application/json"
      } else {
        // CSV format
        const headers = [
          "ID",
          "Timestamp",
          "Input Type",
          "Title",
          "Word Count",
          "Size (bytes)",
          "Processing Time (ms)",
          "Input",
        ]
        const rows = history.map((item) => [
          item.id,
          new Date(item.timestamp).toISOString(),
          item.inputType,
          item.title || "",
          item.wordCount.toString(),
          item.size.toString(),
          item.processingTime.toString(),
          item.input.replace(/"/g, '""'), // Escape quotes for CSV
        ])

        content = [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n")

        filename = `html-to-markdown-history-${new Date().toISOString().split("T")[0]}.csv`
        mimeType = "text/csv"
      }

      const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    [history]
  )

  return {
    // State
    history,
    isLoading,

    // Actions
    addToHistory,
    addMultipleToHistory,
    removeFromHistory,
    clearHistory,
    downloadHistory,
    exportHistory,

    // Utilities
    getHistoryItem,
    getHistoryStats,
    searchHistory,
    filterHistory,

    // Computed
    hasHistory: history.length > 0,
    historyCount: history.length,
  }
}
