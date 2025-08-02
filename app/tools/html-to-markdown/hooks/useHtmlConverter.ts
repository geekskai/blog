import { useState, useCallback, useRef } from "react"
import {
  ConversionOptions,
  ConversionResult,
  HtmlProcessingResult,
  BatchConversionProgress,
} from "../types"
import { HtmlToMarkdownConverter, defaultConversionOptions } from "../utils/htmlToMarkdown"
import { validateUrl } from "../utils/urlValidator"
import { generateFilename } from "../utils/downloadHelper"

export const useHtmlConverter = () => {
  const [options, setOptions] = useState<ConversionOptions>(defaultConversionOptions)
  const [isConverting, setIsConverting] = useState(false)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [batchProgress, setBatchProgress] = useState<BatchConversionProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const converterRef = useRef<HtmlToMarkdownConverter | null>(null)

  // Initialize or update converter when options change
  const getConverter = useCallback(() => {
    if (
      !converterRef.current ||
      JSON.stringify(options) !== JSON.stringify(defaultConversionOptions)
    ) {
      converterRef.current = new HtmlToMarkdownConverter(options)
    }
    return converterRef.current
  }, [options])

  const convertHtml = useCallback(
    async (html: string, inputType: "html" | "url" = "html"): Promise<ConversionResult | null> => {
      const converter = getConverter()
      const startTime = Date.now()

      try {
        const processingResult: HtmlProcessingResult = converter.convert(html)

        if (!processingResult.success) {
          throw new Error(processingResult.error || "Conversion failed")
        }

        const result: ConversionResult = {
          id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          input: inputType === "url" ? html : html.substring(0, 100) + "...",
          inputType,
          markdown: processingResult.markdown || "",
          title: processingResult.title,
          wordCount: processingResult.wordCount || 0,
          size: new Blob([processingResult.markdown || ""]).size,
          processingTime: processingResult.processingTime,
        }

        return result
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Unknown conversion error")
      }
    },
    [getConverter]
  )

  const convertFromUrl = useCallback(
    async (url: string): Promise<ConversionResult | null> => {
      const validation = validateUrl(url)
      if (!validation.isValid) {
        throw new Error(validation.error || "Invalid URL")
      }

      try {
        const response = await fetch("/api/tools/fetch-html", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: validation.normalizedUrl }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        return await convertHtml(data.html, "url")
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch URL")
      }
    },
    [convertHtml]
  )

  const convert = useCallback(
    async (input: string, inputType: "html" | "url" = "html"): Promise<ConversionResult | null> => {
      setIsConverting(true)
      setError(null)
      setResult(null)

      try {
        let conversionResult: ConversionResult | null

        if (inputType === "url") {
          conversionResult = await convertFromUrl(input)
        } else {
          conversionResult = await convertHtml(input, "html")
        }

        setResult(conversionResult)
        return conversionResult
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Conversion failed"
        setError(errorMessage)
        return null
      } finally {
        setIsConverting(false)
      }
    },
    [convertFromUrl, convertHtml]
  )

  const convertMultiple = useCallback(
    async (inputs: string[], inputType: "html" | "url" = "url"): Promise<ConversionResult[]> => {
      setIsConverting(true)
      setError(null)
      setBatchProgress({
        total: inputs.length,
        completed: 0,
        failed: 0,
        percentage: 0,
      })

      const results: ConversionResult[] = []
      let completed = 0
      let failed = 0

      try {
        for (let i = 0; i < inputs.length; i++) {
          const input = inputs[i]

          setBatchProgress((prev) =>
            prev
              ? {
                  ...prev,
                  current: inputType === "url" ? input : `HTML Content ${i + 1}`,
                }
              : null
          )

          try {
            const result = await convert(input, inputType)
            if (result) {
              results.push(result)
              completed++
            } else {
              failed++
            }
          } catch (error) {
            console.error(`Failed to convert input ${i + 1}:`, error)
            failed++
          }

          const percentage = Math.round(((completed + failed) / inputs.length) * 100)
          setBatchProgress((prev) =>
            prev
              ? {
                  ...prev,
                  completed,
                  failed,
                  percentage,
                }
              : null
          )

          // Add small delay to prevent overwhelming the server
          if (inputType === "url" && i < inputs.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        }

        return results
      } finally {
        setIsConverting(false)
        setBatchProgress(null)
      }
    },
    [convert]
  )

  const updateOptions = useCallback((newOptions: Partial<ConversionOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }))
  }, [])

  const resetConverter = useCallback(() => {
    setResult(null)
    setError(null)
    setBatchProgress(null)
    setIsConverting(false)
  }, [])

  const reprocessWithNewOptions = useCallback(
    async (newOptions: Partial<ConversionOptions>) => {
      if (!result) return

      setOptions((prev) => ({ ...prev, ...newOptions }))

      // Re-process the current result with new options
      if (result.inputType === "html") {
        // For HTML, we would need the original HTML content
        // This is a limitation - we might want to store original input
        console.warn("Cannot reprocess HTML content - original HTML not stored")
      } else {
        // For URLs, we can re-fetch and convert
        await convert(result.input, result.inputType)
      }
    },
    [result, convert]
  )

  return {
    // State
    options,
    isConverting,
    result,
    batchProgress,
    error,

    // Actions
    convert,
    convertMultiple,
    updateOptions,
    resetConverter,
    reprocessWithNewOptions,

    // Utilities
    getConverter: () => converterRef.current,
  }
}
