"use client"

import React, { useState, useCallback } from "react"
import { SourceType, type DataSource } from "../types"
import {
  createDataSource,
  readFileAsText,
  isValidUrl,
  isSupportedFileType,
  getFileTypeDescription,
} from "../lib/data-source"

interface DataSourceSelectorProps {
  onDataChange: (source: DataSource) => void
  loading?: boolean
}

export default function DataSourceSelector({
  onDataChange,
  loading = false,
}: DataSourceSelectorProps) {
  const [activeTab, setActiveTab] = useState<SourceType>(SourceType.Text)
  const [textData, setTextData] = useState("")
  const [urlData, setUrlData] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileUploadProgress, setFileUploadProgress] = useState(0)

  // 处理文本输入
  const handleTextChange = useCallback(
    (value: string) => {
      setTextData(value)
      const source = createDataSource(SourceType.Text)
      source.data = value
      onDataChange(source)
    },
    [onDataChange]
  )

  // 处理 URL 输入
  const handleUrlChange = useCallback(
    (value: string) => {
      setUrlData(value)
      const source = createDataSource(SourceType.URL)
      source.data = value
      onDataChange(source)
    },
    [onDataChange]
  )

  // 处理文件上传
  const handleFileUpload = useCallback(
    async (file: File) => {
      // 文件大小检查 (最大 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert("File size too large. Please upload files smaller than 10MB.")
        return
      }

      if (!isSupportedFileType(file.name)) {
        alert("Unsupported file type. Please upload JSON, TXT, JS, TS, JSX, TSX, or CSV files.")
        return
      }

      setUploadedFile(file)
      setFileUploadProgress(0)

      try {
        // 显示进度
        setFileUploadProgress(50)

        const content = await readFileAsText(file)

        // 完成进度
        setFileUploadProgress(100)

        const source = createDataSource(SourceType.File)
        source.data = content
        if ("fileName" in source) {
          source.fileName = file.name
        }
        onDataChange(source)

        // 重置进度
        setTimeout(() => setFileUploadProgress(0), 1000)
      } catch (error) {
        console.error("File reading error:", error)
        alert(`Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`)
        setUploadedFile(null)
        setFileUploadProgress(0)
      }
    },
    [onDataChange]
  )

  // 拖拽处理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload]
  )

  // 清除上传的文件
  const handleClearFile = useCallback(() => {
    setUploadedFile(null)
    setFileUploadProgress(0)
    const source = createDataSource(SourceType.File)
    onDataChange(source)
  }, [onDataChange])

  // 示例数据
  const loadExample = useCallback(() => {
    const exampleData = {
      company: "TechCorp",
      yearFounded: 2000,
      founders: ["Alice", "Bob"],
      headquarters: {
        city: "Silicon Valley",
        country: "USA",
      },
      departments: [
        {
          name: "Research",
          employees: [
            {
              name: "Charlie",
              position: "Research Scientist",
            },
            {
              name: "Diana",
              position: "Research Analyst",
            },
          ],
        },
        {
          name: "Development",
          employees: [
            {
              name: "Eva",
              position: "Software Engineer",
            },
            {
              name: "Frank",
              position: "UI/UX Designer",
            },
          ],
        },
        {
          name: "Marketing",
          employees: [
            {
              name: "Grace",
              position: "Marketing Manager",
            },
            {
              name: "Harry",
              position: "Social Media Specialist",
            },
          ],
        },
      ],
      projects: [
        {
          title: "Project A",
          team: ["Alice", "Charlie", "Eva"],
          progress: 75,
        },
        {
          title: "Project B",
          team: ["Bob", "Diana", "Frank"],
          progress: 60,
        },
        {
          title: "Project C",
          team: ["Charlie", "Eva", "Grace"],
          progress: 90,
        },
      ],
    }

    const jsonString = JSON.stringify(exampleData, null, 2)
    setTextData(jsonString)
    handleTextChange(jsonString)
    setActiveTab(SourceType.Text)
  }, [handleTextChange])

  const tabs = [
    { type: SourceType.Text, label: "Text Input", icon: "📝" },
    { type: SourceType.File, label: "File Upload", icon: "📁" },
    { type: SourceType.URL, label: "URL Fetch", icon: "🌐" },
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-pink-500/25 p-8 shadow-2xl backdrop-blur-xl">
      {/* 装饰性背景元素 */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl"></div>

      <div className="relative">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">📊</span>
            <h2 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
              Choose Data Source
            </h2>
          </div>
        </div>

        {/* 标签页 */}
        <div className="mb-6 flex justify-center">
          <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
            {tabs.map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === type
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6">
          {/* Text Input */}
          {activeTab === SourceType.Text && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-white">JSON Data</label>
                <button
                  onClick={loadExample}
                  className="rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 text-sm text-green-300 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={textData}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Paste your JSON data here..."
                disabled={loading}
                className="h-64 w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              />
            </div>
          )}

          {/* File Upload */}
          {activeTab === SourceType.File && (
            <div className="space-y-6">
              {/* 文件上传区域 */}
              {!uploadedFile && (
                <div
                  className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                    dragActive
                      ? "scale-105 border-purple-400 bg-purple-500/20"
                      : "border-purple-500/30 bg-purple-500/10 hover:border-purple-400/50 hover:bg-purple-500/15"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="animate-bounce text-6xl">📁</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Drop your file here</h3>
                      <p className="text-slate-300">or click to browse</p>
                    </div>
                    <input
                      type="file"
                      accept=".json,.txt,.js,.ts,.jsx,.tsx,.csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                      disabled={loading}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">
                        Supported formats: JSON, TXT, JS, TS, JSX, TSX, CSV
                      </p>
                      <p className="text-xs text-slate-500">Maximum file size: 10MB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 文件信息和进度 */}
              {uploadedFile && (
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">📄</div>
                      <div>
                        <h4 className="font-semibold text-white">{uploadedFile.name}</h4>
                        <p className="text-sm text-slate-400">
                          {(uploadedFile.size / 1024).toFixed(1)} KB •{" "}
                          {getFileTypeDescription(uploadedFile.name)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearFile}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 transition-all duration-300 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/25"
                      title="Remove file"
                    >
                      <span className="text-lg">🗑️</span>
                    </button>
                  </div>

                  {/* 进度条 */}
                  {fileUploadProgress > 0 && fileUploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Uploading...</span>
                        <span className="text-purple-300">{fileUploadProgress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                          style={{ width: `${fileUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 完成状态 */}
                  {fileUploadProgress === 100 && (
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="text-lg">✅</span>
                      <span className="text-sm font-medium">File uploaded successfully!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* URL Input */}
          {activeTab === SourceType.URL && (
            <div className="space-y-4">
              <label className="text-lg font-semibold text-white">URL Address</label>
              <div className="relative">
                <input
                  type="url"
                  value={urlData}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://api.example.com/data.json"
                  disabled={loading}
                  className="w-full rounded-2xl border border-purple-500/30 bg-purple-500/10 py-4 pl-16 pr-4 text-lg text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-purple-500/20 p-2 backdrop-blur-sm">
                  <span className="text-xl">🌐</span>
                </div>
                {urlData && !isValidUrl(urlData) && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400">❌</div>
                )}
              </div>
              <p className="text-sm text-slate-400">
                Enter a URL that returns JSON data. CORS must be enabled for the URL.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
