"use client"

import React, { useState, useRef, useCallback } from "react"
import {
  Globe,
  Code,
  Upload,
  Plus,
  X,
  AlertCircle,
  FileText,
  Loader2,
  Copy,
  Trash2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { validateUrl, parseUrlsFromText, validateMultipleUrls } from "../utils/urlValidator"
import { BatchConversionProgress } from "../types"

interface InputPanelProps {
  activeTab: "url" | "html"
  onTabChange: (tab: "url" | "html") => void
  onSingleConversion: (input: string) => Promise<void>
  onBatchConversion: (inputs: string[]) => Promise<void>
  isConverting: boolean
  batchProgress?: BatchConversionProgress | null
}

export default function InputPanel({
  activeTab,
  onTabChange,
  onSingleConversion,
  onBatchConversion,
  isConverting,
  batchProgress,
}: InputPanelProps) {
  const t = useTranslations("HtmlToMarkdown.components.input_panel")
  const [singleInput, setSingleInput] = useState("")
  const [multipleUrls, setMultipleUrls] = useState<string[]>([""])
  const [batchMode, setBatchMode] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleTabChange = (tab: "url" | "html") => {
    onTabChange(tab)
    setSingleInput("")
    setMultipleUrls([""])
    setBatchMode(false)
    setValidationErrors([])
  }

  const handleSingleInputChange = (value: string) => {
    setSingleInput(value)
    setValidationErrors([])
  }

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...multipleUrls]
    newUrls[index] = value
    setMultipleUrls(newUrls)
    setValidationErrors([])
  }

  const addUrlField = () => {
    setMultipleUrls([...multipleUrls, ""])
  }

  const removeUrlField = (index: number) => {
    if (multipleUrls.length > 1) {
      const newUrls = multipleUrls.filter((_, i) => i !== index)
      setMultipleUrls(newUrls)
    }
  }

  const handlePasteUrls = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const urls = parseUrlsFromText(text)
      if (urls.length > 0) {
        setMultipleUrls(urls)
        setBatchMode(true)
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (activeTab === "html") {
        setSingleInput(content)
      } else {
        // Parse URLs from file
        const urls = parseUrlsFromText(content)
        if (urls.length > 0) {
          setMultipleUrls(urls)
          setBatchMode(true)
        }
      }
    }
    reader.readAsText(file)
  }

  const validateAndConvert = useCallback(async () => {
    setValidationErrors([])

    if (activeTab === "url") {
      if (batchMode) {
        const nonEmptyUrls = multipleUrls.filter((url) => url.trim())
        if (nonEmptyUrls.length === 0) {
          setValidationErrors([t("error_at_least_one_url")])
          return
        }

        const { valid, invalid } = validateMultipleUrls(nonEmptyUrls)

        if (invalid.length > 0) {
          setValidationErrors(invalid.map((item) => `${item.url}: ${item.error}`))
        }

        if (valid.length > 0) {
          await onBatchConversion(valid)
        }
      } else {
        if (!singleInput.trim()) {
          setValidationErrors([t("error_enter_url")])
          return
        }

        const validation = validateUrl(singleInput.trim())
        if (!validation.isValid) {
          setValidationErrors([validation.error || t("error_invalid_url")])
          return
        }

        await onSingleConversion(validation.normalizedUrl || singleInput.trim())
      }
    } else {
      // HTML mode
      if (!singleInput.trim()) {
        setValidationErrors([t("error_enter_html")])
        return
      }

      await onSingleConversion(singleInput.trim())
    }
  }, [activeTab, t, batchMode, multipleUrls, singleInput, onBatchConversion, onSingleConversion])

  const clearAll = () => {
    setSingleInput("")
    setMultipleUrls([""])
    setBatchMode(false)
    setValidationErrors([])
  }

  return (
    <div className="space-y-6">
      {/* Input Type Tabs */}
      <div className="rounded-xl bg-slate-800/80 p-6 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-white">{t("input_source")}</h2>
          <div className="flex space-x-1 rounded-lg bg-slate-700 p-1">
            <button
              onClick={() => handleTabChange("url")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "url"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>{t("website_url")}</span>
            </button>
            <button
              onClick={() => handleTabChange("html")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "html"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Code className="h-4 w-4" />
              <span>{t("html_code")}</span>
            </button>
          </div>
        </div>

        {/* URL Input */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                {batchMode ? t("website_urls") : t("website_url")}
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setBatchMode(!batchMode)}
                  className={`inline-flex items-center space-x-1 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    batchMode
                      ? "bg-purple-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  <Plus className="h-3 w-3" />
                  <span>{t("batch_mode")}</span>
                </button>
                <button
                  onClick={handlePasteUrls}
                  className="inline-flex items-center space-x-1 rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-600"
                >
                  <Copy className="h-3 w-3" />
                  <span>{t("paste_urls")}</span>
                </button>
              </div>
            </div>

            {batchMode ? (
              <div className="space-y-3">
                {multipleUrls.map((url, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder={t("enter_url", { index: index + 1 })}
                      className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {multipleUrls.length > 1 && (
                      <button
                        onClick={() => removeUrlField(index)}
                        className="rounded-lg bg-red-600 p-3 text-white hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addUrlField}
                  className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-slate-600 py-3 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("add_another_url")}</span>
                </button>
              </div>
            ) : (
              <input
                type="url"
                value={singleInput}
                onChange={(e) => handleSingleInputChange(e.target.value)}
                placeholder={t("enter_website_url")}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
        )}

        {/* HTML Input */}
        {activeTab === "html" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">{t("html_content")}</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1 rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-600"
                >
                  <Upload className="h-3 w-3" />
                  <span>{t("upload_file")}</span>
                </button>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center space-x-1 rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-600"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>{t("clear")}</span>
                </button>
              </div>
            </div>

            <textarea
              ref={textAreaRef}
              value={singleInput}
              onChange={(e) => handleSingleInputChange(e.target.value)}
              placeholder={t("paste_html_placeholder")}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              rows={12}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4 space-y-2">
            {validationErrors.map((error, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 rounded-lg border border-red-800 bg-red-900/20 p-3"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            ))}
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={validateAndConvert}
          disabled={isConverting}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isConverting ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t("converting")}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{t("convert_to_markdown")}</span>
            </div>
          )}
        </button>

        {/* Batch Progress */}
        {batchProgress && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{t("processing")}</span>
              <span>
                {batchProgress.completed + batchProgress.failed}/{batchProgress.total}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${batchProgress.percentage}%` }}
              />
            </div>
            {batchProgress.current && (
              <p className="truncate text-xs text-slate-400">
                {t("current", { current: batchProgress.current })}
              </p>
            )}
            {batchProgress.failed > 0 && (
              <p className="text-xs text-red-400">
                {t("failed_conversions", { failed: batchProgress.failed })}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
