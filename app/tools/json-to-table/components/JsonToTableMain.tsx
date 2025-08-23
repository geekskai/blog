"use client"

import React, { useState, useCallback, useEffect } from "react"
import DataSourceSelector from "./DataSourceSelector"
import ConfigPanel from "./ConfigPanel"
import TableResultModal from "./TableResultModal"
import {
  type DataSource,
  type TableConfig,
  type TableData,
  type ProcessingError,
  DEFAULT_TABLE_CONFIG,
  JSONParseStatus,
} from "../types"
import { resolveDataSource } from "../lib/data-source"
import { jsonTryParse } from "../lib/json-parser"
import { jsonToTable } from "../lib/table-generator"

export default function JsonToTableMain() {
  const [dataSource, setDataSource] = useState<DataSource | null>(null)
  const [config, setConfig] = useState<TableConfig>(DEFAULT_TABLE_CONFIG)
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [showResultModal, setShowResultModal] = useState(false)

  // 处理数据源变化 - 自动转换优化
  const handleDataSourceChange = useCallback((source: DataSource) => {
    setDataSource(source)
    setError("")

    // 自动转换：只要有数据就立即处理
    if (source.data.trim()) {
      processData(source)
    }
  }, [])

  // 处理配置变化
  const handleConfigChange = useCallback(
    (newConfig: TableConfig) => {
      setConfig(newConfig)

      // 如果有数据，重新生成表格
      if (dataSource && dataSource.data.trim()) {
        processData(dataSource, newConfig)
      }
    },
    [dataSource]
  )

  // 处理数据
  const processData = useCallback(
    async (source: DataSource, tableConfig: TableConfig = config) => {
      if (!source.data.trim()) {
        setTableData(null)
        setError("")
        return
      }

      setLoading(true)
      setError("")

      try {
        // 1. 解析数据源
        const rawData = await resolveDataSource(source)

        // 2. 解析 JSON
        const parseResult = jsonTryParse(rawData)

        if (parseResult.status === JSONParseStatus.Error) {
          throw parseResult.error
        }

        // 3. 生成表格
        const table = jsonToTable(parseResult.data, tableConfig)
        setTableData(table)

        // 4. 自动打开结果弹窗
        setShowResultModal(true)
      } catch (err) {
        console.error("Processing error:", err)

        if (err && typeof err === "object" && "message" in err) {
          const processingError = err as ProcessingError
          setError(
            `${processingError.message}${processingError.details ? `: ${processingError.details}` : ""}`
          )
        } else {
          setError("An unexpected error occurred while processing the data")
        }

        setTableData(null)
      } finally {
        setLoading(false)
      }
    },
    [config]
  )

  // 清除所有数据
  const handleClear = useCallback(() => {
    setDataSource(null)
    setTableData(null)
    setError("")
    setShowResultModal(false)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative">
        {/* 头部 */}
        <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="text-center">
              <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-6xl font-bold text-transparent">
                JSON to Table Converter
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                Transform your JSON data into beautiful, readable tables. Support for multiple input
                methods and customizable output formats.
              </p>

              {/* 功能特性 */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                  ✨ Multiple Input Methods
                </div>
                <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                  🎨 Customizable Output
                </div>
                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                  ⚡ Real-time Processing
                </div>
                <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                  📱 Mobile Friendly
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主内容 */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="space-y-12">
            {/* 数据源选择 */}
            <DataSourceSelector onDataChange={handleDataSourceChange} loading={loading} />

            {/* 配置面板 */}
            <ConfigPanel config={config} onConfigChange={handleConfigChange} />

            {/* 清除按钮 */}
            {(dataSource || tableData) && (
              <div className="flex justify-center">
                <button
                  onClick={handleClear}
                  className="group relative overflow-hidden rounded-2xl border border-slate-500/30 bg-gradient-to-r from-slate-500/10 to-slate-400/10 px-6 py-3 text-slate-300 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <span className="relative flex items-center gap-2 text-sm">
                    <span>🗑️</span>
                    Clear All Data
                  </span>
                </button>
              </div>
            )}

            {/* 处理状态提示 */}
            {loading && (
              <div className="text-center">
                <div className="inline-flex items-center gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-8 py-4 backdrop-blur-sm">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500"></div>
                  <span className="text-lg font-medium text-blue-300">Processing your data...</span>
                </div>
              </div>
            )}

            {/* 错误提示 */}
            {error && !loading && (
              <div className="text-center">
                <div className="inline-flex items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-4 backdrop-blur-sm">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="font-medium text-red-300">Processing Failed</p>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 成功提示 */}
            {tableData && !showResultModal && !loading && !error && (
              <div className="text-center">
                <button
                  onClick={() => setShowResultModal(true)}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-green-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
                  <span className="relative flex items-center gap-2">
                    <span>✅</span>
                    View Generated Table
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 页脚信息 */}
        <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="text-center text-slate-400">
              <p className="mb-4">
                Powered by modern web technologies. Built with React, TypeScript, and Tailwind CSS.
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <span>📊 Smart JSON parsing</span>
                <span>🎨 Beautiful table rendering</span>
                <span>⚡ Lightning fast processing</span>
                <span>📱 Responsive design</span>
              </div>
            </div>
          </div>
        </div>

        {/* 结果弹窗 */}
        <TableResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          tableData={tableData}
          format={config.format}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
