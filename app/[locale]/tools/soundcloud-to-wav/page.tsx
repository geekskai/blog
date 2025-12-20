"use client"

import { FormEvent, useState } from "react"
import TrackInfoCard, { TrackInfo } from "./TrackInfoCard"
import React from "react"

type LoadingState = "idle" | "loading" | "success" | "error"

// 常量
const SOUNDCLOUD_URL_REGEX = /^https?:\/\/(www\.)?soundcloud\.com\/.+/
const ERROR_MESSAGES = {
  EMPTY_URL: "请输入 SoundCloud 链接",
  INVALID_URL: "请输入有效的 SoundCloud 链接",
  NETWORK_ERROR: "网络错误，请稍后重试",
  DOWNLOAD_FAILED: "下载失败，请稍后重试",
  GET_INFO_FAILED: "获取信息失败，请检查链接是否正确",
} as const

// 工具函数
const isValidSoundCloudUrl = (url: string): boolean => {
  return SOUNDCLOUD_URL_REGEX.test(url)
}

const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2)
}

const createDownloadLink = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName.toLowerCase()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

const getFileName = (trackInfo: TrackInfo | null): string => {
  return trackInfo?.title ? `${trackInfo.title}.mp3` : `audio-${Date.now()}.mp3`
}

// 加载图标组件
const LoadingSpinner = () => (
  <svg
    className="h-5 w-5 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

// 进度条组件
interface ProgressBarProps {
  progress: number
  status: string
  className?: string
}

const ProgressBar = ({ progress, status, className = "" }: ProgressBarProps) => (
  <div className={`space-y-1 ${className}`}>
    <div className="flex items-center justify-between text-xs text-white/80">
      <span className={progress > 0 ? "" : "truncate"}>{status || "处理中..."}</span>
      {progress > 0 && <span className="ml-2 flex-shrink-0">{progress}%</span>}
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-white/20">
      {progress > 0 ? (
        <div
          className="h-full rounded-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      ) : (
        <div className="h-full w-full animate-pulse rounded-full bg-white/50" />
      )}
    </div>
  </div>
)

export default function Page() {
  const [url, setUrl] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [infoProgress, setInfoProgress] = useState<number>(0)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [infoStatus, setInfoStatus] = useState<string>("")
  const [downloadStatus, setDownloadStatus] = useState<string>("")

  // 重置状态
  const resetInfoState = () => {
    setInfoProgress(0)
    setInfoStatus("")
  }

  const resetDownloadState = () => {
    setDownloadProgress(0)
    setDownloadStatus("")
    setDownloading(false)
  }

  const resetDownloadProgress = () => {
    setDownloadProgress(0)
    setDownloadStatus("")
  }

  const resetError = () => {
    setErrorMessage("")
  }

  // 验证URL
  const validateUrl = (): boolean => {
    if (!url.trim()) {
      setErrorMessage(ERROR_MESSAGES.EMPTY_URL)
      return false
    }
    if (!isValidSoundCloudUrl(url.trim())) {
      setErrorMessage(ERROR_MESSAGES.INVALID_URL)
      return false
    }
    return true
  }

  // 获取音频信息
  const handleGetInfo = async (e?: FormEvent) => {
    e?.preventDefault()

    if (!validateUrl()) {
      setLoadingState("error")
      return
    }

    try {
      setLoadingState("loading")
      resetError()
      setTrackInfo(null)
      resetInfoState()
      setInfoStatus("正在连接服务器...")

      const startTime = Date.now()
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed < 1000) {
          setInfoStatus("正在连接服务器...")
          setInfoProgress(10)
        } else if (elapsed < 3000) {
          setInfoStatus("正在获取音频信息...")
          setInfoProgress(30)
        } else {
          setInfoStatus("正在处理数据...")
          setInfoProgress(60)
        }
      }, 500)

      const response = await fetch("/api/soundcloud-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      clearInterval(progressInterval)
      setInfoStatus("正在解析响应...")
      setInfoProgress(90)

      const data = await response.json()

      if (data.success) {
        setInfoProgress(100)
        setInfoStatus("完成")
        setTrackInfo({ ...data.info, downloadable: true })
        setLoadingState("success")
        setTimeout(resetInfoState, 1000)
      } else {
        setErrorMessage(data.error || ERROR_MESSAGES.GET_INFO_FAILED)
        setLoadingState("error")
        resetInfoState()
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR)
      setLoadingState("error")
      resetInfoState()
      console.error("Get info error:", error)
    }
  }

  // 下载音频（使用 fetch + ReadableStream 追踪进度）
  const handleDownload = async () => {
    if (!validateUrl()) return

    // 防止重复点击
    if (downloading) return

    try {
      setDownloading(true)
      resetError()
      resetDownloadProgress()
      setDownloadStatus("正在连接服务器...")

      setDownloadStatus("正在发送请求...")
      setDownloadProgress(5)

      const response = await fetch("/api/download-soundcloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: ERROR_MESSAGES.DOWNLOAD_FAILED,
        }))
        setErrorMessage(errorData.error || ERROR_MESSAGES.DOWNLOAD_FAILED)
        resetDownloadState()
        return
      }

      setDownloadStatus("服务器正在处理（从 SoundCloud 下载音频）...")
      setDownloadProgress(10)

      // 从响应头获取文件大小和 SoundCloud 信息
      const contentLength = response.headers.get("Content-Length")
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0
      const infoHeader = response.headers.get("X-SoundCloud-Info")
      let downloadedInfo: TrackInfo | null = null

      if (infoHeader) {
        try {
          downloadedInfo = {
            ...JSON.parse(infoHeader),
            downloadable: true,
          }
          setTrackInfo(downloadedInfo)
        } catch (e) {
          console.warn("Failed to parse SoundCloud info:", e)
        }
      }

      // 使用 ReadableStream 追踪下载进度
      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()
      const chunks: BlobPart[] = []
      let loadedBytes = 0

      // 读取流数据
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        chunks.push(value)
        loadedBytes += value.length

        // 更新进度
        if (totalBytes > 0) {
          const progress = Math.round((loadedBytes / totalBytes) * 80 + 20)
          setDownloadProgress(progress)
          const loadedMB = formatFileSize(loadedBytes)
          const totalMB = formatFileSize(totalBytes)
          setDownloadStatus(`正在下载文件: ${loadedMB}MB / ${totalMB}MB`)
        } else {
          setDownloadStatus("正在下载文件...")
          setDownloadProgress((prev) => Math.min(prev + 2, 95))
        }
      }

      // 构建 Blob
      setDownloadProgress(100)
      setDownloadStatus("正在保存文件...")

      const blob = new Blob(chunks, { type: "audio/mpeg" })
      createDownloadLink(blob, getFileName(downloadedInfo || trackInfo))

      setTimeout(resetDownloadState, 1000)
    } catch (error) {
      console.error("Download error:", error)
      setErrorMessage(error instanceof Error ? error.message : ERROR_MESSAGES.DOWNLOAD_FAILED)
      resetDownloadState()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8">
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800 md:text-5xl">
            🎵 SoundCloud 音乐下载工具
          </h1>
          <p className="text-gray-600 md:text-lg">输入 SoundCloud 链接，获取音乐信息并下载</p>
        </div>

        {/* 输入区域卡片 */}
        <div className="mx-auto mb-8 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <form onSubmit={handleGetInfo} className="space-y-4">
                <div>
                  <label
                    htmlFor="soundcloud-url"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    SoundCloud 链接
                  </label>
                  <input
                    id="soundcloud-url"
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      resetError()
                      setLoadingState("idle")
                    }}
                    placeholder="https://soundcloud.com/..."
                    className="w-full rounded-lg border-2 border-white/20 bg-white/90 px-4 py-3 text-gray-800 placeholder-gray-400 transition-all focus:border-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                {/* 操作按钮组 */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex flex-1 flex-col gap-2">
                      <button
                        type="submit"
                        disabled={loadingState === "loading" || !url.trim()}
                        className="flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 shadow-md transition-all hover:bg-gray-100 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loadingState === "loading" ? (
                          <>
                            <LoadingSpinner />
                            <span>获取中...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">🔍</span>
                            <span>获取信息</span>
                          </>
                        )}
                      </button>
                      {loadingState === "loading" && (
                        <ProgressBar progress={infoProgress} status={infoStatus} />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={downloading || !url.trim() || loadingState === "loading"}
                        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-green-600 hover:to-emerald-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloading ? (
                          <>
                            <LoadingSpinner />
                            <span>下载中...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">⬇️</span>
                            <span>直接下载</span>
                          </>
                        )}
                      </button>
                      {downloading && (
                        <ProgressBar progress={downloadProgress} status={downloadStatus} />
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* 错误提示 */}
            {errorMessage && (
              <div className="border-t border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <span>⚠️</span>
                  <span className="text-sm font-medium">{errorMessage}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 加载骨架屏 */}
        {loadingState === "loading" && !trackInfo && (
          <div className="mx-auto max-w-4xl">
            <div className="animate-pulse space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="h-64 rounded-lg bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-8 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        )}

        {/* 音乐信息卡片 */}
        {trackInfo && (
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">音乐信息</h2>
              <p className="mt-1 text-sm text-gray-500">查看详细信息并下载音乐</p>
            </div>
            <div className="transition-all duration-500 ease-in-out">
              <TrackInfoCard
                trackInfo={trackInfo}
                onDownload={handleDownload}
                isDownloading={downloading}
              />
            </div>
          </div>
        )}

        {/* 空状态提示 */}
        {loadingState === "idle" && !trackInfo && (
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-2xl border border-gray-200 bg-white/50 p-12 shadow-lg backdrop-blur-sm">
              <div className="mb-4 text-6xl">🎼</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-700">开始使用</h3>
              <p className="text-gray-500">
                在上方输入 SoundCloud 链接，点击&ldquo;获取信息&rdquo;按钮开始
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
