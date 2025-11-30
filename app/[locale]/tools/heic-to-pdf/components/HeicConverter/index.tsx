"use client"

import React from "react"
import { useHeicConverter } from "./useHeicConverter"
import DropZone from "./DropZone"
import FileList from "./FileList"
import ConfigPanel from "./ConfigPanel"
import HeaderControls from "./HeaderControls"

export default function HeicConverter() {
  const {
    files,
    setFiles,
    converting,
    outputType,
    setOutputType,
    pdfMode,
    setPdfMode,
    error,
    setError,
    progress,
    showConfigPanel,
    setShowConfigPanel,
    imageConfig,
    setImageConfig,
    fileOutputs,
    setFileOutputs,
    fileInputRef,
    onDrop,
    handleFileOutputChange,
    hasPdfMergeOption,
    getFileOutputType,
    handlePdfMergeCheckbox,
    handleImageConfigChange,
    removeFile,
    removeAllFiles,
    convertFiles,
  } = useHeicConverter()

  // Status Indicator Component
  const StatusIndicator = () => {
    const allCompleted = files.length > 0 && files.every((file) => progress[file.name] === 100)
    const hasInProgress = files.some((file) => progress[file.name] > 0 && progress[file.name] < 100)

    return (
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm">
          {/* Files status */}
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                files.length > 0 ? "bg-green-500" : "bg-slate-500"
              }`}
            />
            <span className="text-sm text-slate-300">Files ({files.length})</span>
          </div>

          {/* Conversion status */}
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                allCompleted
                  ? "animate-pulse bg-emerald-500"
                  : hasInProgress || converting
                    ? "animate-spin bg-yellow-500"
                    : "bg-slate-500"
              }`}
            />
            <span className="text-sm text-slate-300">
              {allCompleted ? "Ready" : hasInProgress || converting ? "Processing..." : "Waiting"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Status Feedback Component
  const StatusFeedback = () => {
    if (converting) {
      return (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-8 py-4 backdrop-blur-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500"></div>
            <span className="text-lg font-medium text-blue-300">Processing your files...</span>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="mb-8 text-center">
          <div className="inline-flex items-start gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-4 backdrop-blur-sm">
            <span className="text-2xl">❌</span>
            <div className="text-left">
              <p className="font-medium text-red-300">Processing Failed</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )
    }

    const allCompleted = files.length > 0 && files.every((file) => progress[file.name] === 100)
    if (allCompleted) {
      return (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-8 py-4 backdrop-blur-sm">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-green-300">Conversion Completed Successfully!</p>
              <p className="text-sm text-green-400">
                {files.length} file{files.length > 1 ? "s" : ""} converted
              </p>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  // Floating Action Buttons (Optional quick access)
  const FloatingActions = () => {
    if (files.length === 0) return null

    return (
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3">
        {/* Quick Convert button - only show when not converting */}
        {!converting && files.length > 0 && (
          <button
            onClick={convertFiles}
            disabled={files.length === 0}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-4 text-white shadow-2xl shadow-green-500/25 transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/30 active:scale-95"
            title="Quick start conversion"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
            <span className="relative text-2xl">🚀</span>
            {/* Pulse animation */}
            <div className="absolute inset-0 animate-ping rounded-full bg-green-500/30"></div>
          </button>
        )}

        {/* Reset button */}
        {files.length > 0 && !converting && (
          <button
            onClick={removeAllFiles}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-slate-600 to-slate-700 p-4 text-white shadow-xl shadow-slate-500/25 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-slate-500/30 active:scale-95"
            title="Clear all files"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <span className="relative text-2xl">🔄</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Status Indicator */}
      {files.length > 0 && <StatusIndicator />}

      {/* Status Feedback */}
      <StatusFeedback />

      {files.length === 0 ? (
        <DropZone onDrop={onDrop} fileInputRef={fileInputRef} error={error} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
          {/* File Upload & List Module */}
          <div className="animate-in fade-in-50 slide-in-from-left-5 duration-500">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-pink-500/25 p-8 shadow-2xl backdrop-blur-xl">
              {/* Decorative background elements */}
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl"></div>
              <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl"></div>

              <div className="relative">
                {/* Title */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
                    <span className="text-2xl">📁</span>
                    <h2 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
                      Files & Controls
                    </h2>
                  </div>
                </div>

                {/* Header Controls */}
                <HeaderControls
                  fileInputRef={fileInputRef}
                  onDrop={onDrop}
                  removeAllFiles={removeAllFiles}
                  hasPdfMergeOption={hasPdfMergeOption}
                  pdfMode={pdfMode}
                  handlePdfMergeCheckbox={handlePdfMergeCheckbox}
                  setShowConfigPanel={setShowConfigPanel}
                  convertFiles={convertFiles}
                  converting={converting}
                  files={files}
                />

                {/* File List */}
                <FileList
                  files={files}
                  progress={progress}
                  getFileOutputType={getFileOutputType}
                  handleFileOutputChange={handleFileOutputChange}
                  removeFile={removeFile}
                  converting={converting}
                />
              </div>
            </div>
          </div>

          {/* Configuration Module */}
          <div className="animate-in fade-in-50 slide-in-from-right-5 duration-500">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/25 via-teal-500/20 to-cyan-500/25 p-8 shadow-2xl backdrop-blur-xl">
              {/* Decorative background elements */}
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl"></div>
              <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-cyan-500/15 blur-3xl"></div>

              <div className="relative">
                {/* Title */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
                    <span className="text-2xl">⚙️</span>
                    <h2 className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                      Configuration
                    </h2>
                  </div>
                </div>

                {/* Quick Settings */}
                <div className="space-y-6">
                  {/* Output Format Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Output Format</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        { value: "pdf", label: "PDF", icon: "📄", description: "Document format" },
                        { value: "jpeg", label: "JPEG", icon: "🖼️", description: "Image format" },
                      ].map(({ value, label, icon, description }) => (
                        <button
                          key={value}
                          onClick={() => setOutputType(value as "pdf" | "jpeg")}
                          className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 ${
                            outputType === value
                              ? "border-emerald-400 bg-gradient-to-br from-emerald-500/20 to-teal-500/15 shadow-lg shadow-emerald-500/25"
                              : "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:shadow-lg hover:shadow-emerald-500/15"
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                          <div className="relative space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{icon}</span>
                              <h4 className="font-semibold text-white">{label}</h4>
                            </div>
                            <p className="text-sm text-slate-300">{description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PDF Merge Option */}
                  {hasPdfMergeOption && (
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 backdrop-blur-sm">
                        <input
                          type="checkbox"
                          checked={pdfMode === "merge"}
                          onChange={handlePdfMergeCheckbox}
                          className="h-5 w-5 rounded border-emerald-500/30 bg-emerald-500/10 text-emerald-500 focus:ring-emerald-500/20"
                        />
                        <div>
                          <span className="font-medium text-white">Merge PDF Files</span>
                          <p className="text-sm text-slate-400">
                            Combine all PDF files into a single document
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Advanced Settings Button */}
                  <button
                    onClick={() => setShowConfigPanel(true)}
                    className="group relative w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚙️</span>
                        <div>
                          <h4 className="font-semibold text-white">Advanced Options</h4>
                          <p className="text-sm text-slate-400">Page size, dimensions, metadata</p>
                        </div>
                      </div>
                      <svg
                        className="h-5 w-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Convert Button Area */}
          {files.length > 0 && (
            <div className="col-span-full mt-8 text-center">
              <button
                onClick={convertFiles}
                disabled={files.length === 0 || converting}
                className={`group relative overflow-hidden rounded-2xl px-12 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 ${
                  files.length === 0 || converting
                    ? "cursor-not-allowed bg-slate-600 shadow-slate-500/25"
                    : "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-green-500/25 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95"
                }`}
                aria-label="Start converting HEIC files"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                <span className="relative flex items-center justify-center gap-3">
                  {converting ? (
                    <>
                      <svg
                        className="h-6 w-6 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Converting...
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🚀</span>
                      Start Conversion
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Advanced Configuration Panel */}
      <ConfigPanel
        imageConfig={imageConfig}
        handleImageConfigChange={handleImageConfigChange}
        outputType={outputType}
        show={showConfigPanel}
        onClose={() => setShowConfigPanel(false)}
      />

      {/* Floating Action Buttons */}
      <FloatingActions />

      {/* Structured Data - Helps with SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "HEIC to PDF Online Conversion Tool",
            description:
              "Free HEIC photos to PDF or JPEG format conversion, supports batch processing, no software installation required",
            operatingSystem: "All",
            applicationCategory: "UtilitiesApplication",
            offers: {
              "@type": "Offer",
              price: "0",
            },
          }),
        }}
      />
    </>
  )
}
