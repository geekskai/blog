import React from "react"
import type { ImageConfig } from "./useHeicConverter"

interface ConfigPanelProps {
  imageConfig: ImageConfig
  handleImageConfigChange: (field: keyof ImageConfig, value: string | boolean) => void
  outputType: "jpeg" | "pdf"
  show: boolean
  onClose: () => void
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  imageConfig,
  handleImageConfigChange,
  outputType,
  show,
  onClose,
}) => {
  // Handle keyboard events for accessibility
  React.useEffect(() => {
    if (!show) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [show, onClose])

  if (!show) return null

  // Handle click outside to close
  const handleBackdropClick = () => {
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm backdrop-filter transition-all duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="config-panel-title"
    >
      <button
        className="absolute inset-0"
        onClick={handleBackdropClick}
        aria-label="Close dialog"
        tabIndex={-1}
      />
      <div
        className="animate-fade-in relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/25 via-teal-500/20 to-cyan-500/25 p-8 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation()
          }
        }}
        role="document"
      >
        {/* Decorative background elements */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-cyan-500/15 blur-3xl"></div>

        <div className="relative">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
              <span className="text-2xl">⚙️</span>
              <h3
                id="config-panel-title"
                className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent"
              >
                Advanced Options
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-500/30 bg-slate-500/10 p-2 text-slate-400 transition-all duration-300 hover:bg-slate-500/20 hover:text-slate-200"
              aria-label="Close configuration panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-200px)] space-y-6 overflow-y-auto">
            {/* PDF Page Size Settings */}
            {outputType === "pdf" && (
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">PDF Page Size</label>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      value: "image",
                      label: "Image Size",
                      icon: "🖼️",
                      description: "Match image dimensions",
                    },
                    { value: "a4", label: "A4", icon: "📄", description: "210×297mm" },
                    { value: "letter", label: "Letter", icon: "📋", description: "216×279mm" },
                  ].map(({ value, label, icon, description }) => (
                    <button
                      key={value}
                      onClick={() => handleImageConfigChange("pdfPageSize", value)}
                      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                        imageConfig.pdfPageSize === value
                          ? "border-emerald-400 bg-gradient-to-br from-emerald-500/20 to-teal-500/15 shadow-lg shadow-emerald-500/25"
                          : "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:shadow-lg hover:shadow-emerald-500/15"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{icon}</span>
                          <h4 className="font-semibold text-white">{label}</h4>
                        </div>
                        <p className="text-xs text-slate-300">{description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Processing */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-white">Metadata Processing</label>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    value: true,
                    label: "Remove Metadata",
                    icon: "🔒",
                    description: "Protect privacy",
                  },
                  {
                    value: false,
                    label: "Keep Metadata",
                    icon: "📝",
                    description: "Preserve info",
                  },
                ].map(({ value, label, icon, description }) => (
                  <button
                    key={String(value)}
                    onClick={() => handleImageConfigChange("stripMetadata", value)}
                    className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                      imageConfig.stripMetadata === value
                        ? "border-emerald-400 bg-gradient-to-br from-emerald-500/20 to-teal-500/15 shadow-lg shadow-emerald-500/25"
                        : "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:shadow-lg hover:shadow-emerald-500/15"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <h4 className="font-semibold text-white">{label}</h4>
                      </div>
                      <p className="text-xs text-slate-300">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                Metadata contains information such as shooting device, time, GPS location, etc.
                Removing metadata can protect privacy and reduce file size.
              </p>
            </div>

            {/* Width and Height */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">Width</label>
                <input
                  type="number"
                  value={imageConfig.width}
                  onChange={(e) => handleImageConfigChange("width", e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="Output width (pixels)"
                />
                <p className="text-xs text-slate-400">Leave empty to keep original width</p>
              </div>
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">Height</label>
                <input
                  type="number"
                  value={imageConfig.height}
                  onChange={(e) => handleImageConfigChange("height", e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="Output height (pixels)"
                />
                <p className="text-xs text-slate-400">Leave empty to keep original height</p>
              </div>
            </div>

            {/* Fit Mode */}
            {(imageConfig.width || imageConfig.height) && (
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">Fit Mode</label>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      value: "max",
                      label: "Max Fit",
                      icon: "↔️",
                      description: "Maintain aspect ratio",
                    },
                    { value: "crop", label: "Crop", icon: "✂️", description: "Fill and crop" },
                    { value: "scale", label: "Scale", icon: "📏", description: "Force stretch" },
                  ].map(({ value, label, icon, description }) => (
                    <button
                      key={value}
                      onClick={() => handleImageConfigChange("fit", value)}
                      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                        imageConfig.fit === value
                          ? "border-emerald-400 bg-gradient-to-br from-emerald-500/20 to-teal-500/15 shadow-lg shadow-emerald-500/25"
                          : "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:shadow-lg hover:shadow-emerald-500/15"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{icon}</span>
                          <h4 className="font-semibold text-white">{label}</h4>
                        </div>
                        <p className="text-xs text-slate-300">{description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigPanel
