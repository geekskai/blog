"use client"

import React from "react"
import { OutputFormat, type TableConfig, DEFAULT_TABLE_CONFIG } from "../types"

interface ConfigPanelProps {
  config: TableConfig
  onConfigChange: (config: TableConfig) => void
}

export default function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const updateConfig = (updates: Partial<TableConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  const outputFormats = [
    {
      value: OutputFormat.HTML,
      label: "HTML Table",
      icon: "🌐",
      description: "Web-friendly HTML format",
    },
    {
      value: OutputFormat.ASCII,
      label: "ASCII Table",
      icon: "📋",
      description: "Plain text table format",
    },
    {
      value: OutputFormat.JSON,
      label: "JSON Structure",
      icon: "📄",
      description: "Structured JSON data",
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/25 via-teal-500/20 to-cyan-500/25 p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-cyan-500/15 blur-3xl"></div>

      <div className="relative space-y-8">
        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">⚙️</span>
            <h2 className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
              Table Configuration
            </h2>
          </div>
        </div>

        {/* Output format selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Output Format</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {outputFormats.map(({ value, label, icon, description }) => (
              <button
                key={value}
                onClick={() => updateConfig({ format: value })}
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 ${
                  config.format === value
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

        {/* Table options */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Table Options</h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Show line numbers */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.showLineNumbers}
                  onChange={(e) => updateConfig({ showLineNumbers: e.target.checked })}
                  className="h-5 w-5 rounded border-emerald-500/30 bg-emerald-500/10 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="font-medium text-white">Show Line Numbers</span>
              </label>
              <p className="text-sm text-slate-400">Add row numbers to the table</p>
            </div>

            {/* Compact mode */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.compactMode}
                  onChange={(e) => updateConfig({ compactMode: e.target.checked })}
                  className="h-5 w-5 rounded border-emerald-500/30 bg-emerald-500/10 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="font-medium text-white">Compact Mode</span>
              </label>
              <p className="text-sm text-slate-400">Reduce object details for cleaner view</p>
            </div>

            {/* Join array values */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.joinArrayValues}
                  onChange={(e) => updateConfig({ joinArrayValues: e.target.checked })}
                  className="h-5 w-5 rounded border-emerald-500/30 bg-emerald-500/10 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="font-medium text-white">Join Array Values</span>
              </label>
              <p className="text-sm text-slate-400">Combine primitive array values with commas</p>
            </div>

            {/* Maximum depth */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-medium text-white">Max Depth: {config.maxDepth}</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={config.maxDepth}
                  onChange={(e) => updateConfig({ maxDepth: parseInt(e.target.value) })}
                  className="mt-2 w-full"
                />
              </label>
              <p className="text-sm text-slate-400">Maximum nesting level to process</p>
            </div>
          </div>

          {/* Corner cell value */}
          <div className="space-y-3">
            <label className="block">
              <span className="font-medium text-white">Corner Cell Value</span>
              <input
                type="text"
                value={config.cornerCellValue}
                onChange={(e) => updateConfig({ cornerCellValue: e.target.value })}
                placeholder="№"
                className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              />
            </label>
            <p className="text-sm text-slate-400">Text to display in the top-left corner cell</p>
          </div>
        </div>

        {/* Reset button */}
        <div className="flex justify-center">
          <button
            onClick={() => onConfigChange(DEFAULT_TABLE_CONFIG)}
            className="group relative overflow-hidden rounded-2xl border border-slate-500/30 bg-gradient-to-r from-slate-500/10 to-slate-400/10 px-6 py-3 text-slate-300 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/25"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
            <span className="relative flex items-center gap-2">
              <span>🔄</span>
              Reset to Defaults
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
