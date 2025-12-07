"use client"

import React, { useState, useRef } from "react"
import { ResultCardProps } from "../types"
import { EMOTIONS } from "../constants/emotions"
import { Download, RotateCcw, Copy } from "lucide-react"
import { shareUtils } from "../utils/shareUtils"
import ShareButtons from "@/components/ShareButtons"

export const ResultCard: React.FC<ResultCardProps> = ({ result, onShare, onRetake }) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const { dominantEmotion, addictionLevel, emotionScores, personalizedInsights, recommendations } =
    result

  // 获取情绪排名
  const emotionRanking = Object.entries(emotionScores)
    .map(([emotion, score]) => ({
      emotion: EMOTIONS[emotion],
      score: Math.round(score),
      percentage: Math.round((score / Math.max(...Object.values(emotionScores))) * 100),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  // 复制结果到剪贴板
  const handleCopyResult = async () => {
    try {
      const success = await shareUtils.copyShareText(result)
      if (success) {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  // 添加水印到canvas
  const addWatermark = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return canvas

    // 设置水印样式
    const watermarkText = "GeeksKai.com • Inside Out 2 Phone Test"
    const fontSize = Math.max(16, canvas.width / 50) // 响应式字体大小
    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    ctx.textAlign = "center"

    // 计算水印位置（底部中央）
    const x = canvas.width / 2
    const y = canvas.height - 30

    // 添加背景模糊效果
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2

    // 绘制水印文字
    ctx.fillText(watermarkText, x, y)

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    return canvas
  }

  // 下载结果图片（带水印）
  const handleDownload = async () => {
    if (!resultRef.current) return

    setIsDownloading(true)
    try {
      // 动态导入html2canvas
      const html2canvas = (await import("html2canvas-pro")).default

      // 优化canvas配置以提高图片质量
      const canvas = await html2canvas(resultRef.current, {
        scale: 3, // 提高分辨率
        backgroundColor: "#0f172a",
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: resultRef.current.scrollWidth,
        height: resultRef.current.scrollHeight,
        windowWidth: resultRef.current.scrollWidth,
        windowHeight: resultRef.current.scrollHeight,
        // 优化渲染质量
        foreignObjectRendering: true,
        imageTimeout: 15000,
      })

      // 添加水印
      const watermarkedCanvas = addWatermark(canvas)

      // 创建高质量的图片
      const link = document.createElement("a")
      link.download = `inside-out-2-phone-test-${dominantEmotion.id}-${Date.now()}.png`
      link.href = watermarkedCanvas.toDataURL("image/png", 1.0) // 最高质量

      // 触发下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
      alert("下载失败，请重试")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* 可下载的结果卡片 */}
      <div
        ref={resultRef}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 shadow-2xl backdrop-blur-xl"
      >
        {/* 装饰性背景 */}
        <div
          className="absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${dominantEmotion.gradientFrom}15, ${dominantEmotion.gradientTo}15)`,
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${dominantEmotion.gradientFrom}10, ${dominantEmotion.gradientTo}10)`,
          }}
        />

        <div className="relative p-8 md:p-12">
          {/* 主要结果展示 */}
          <div className="mb-12 text-center">
            {/* 情绪角色 */}
            <div className="mb-6">
              <div className="mb-4 text-8xl">{dominantEmotion.avatar}</div>
              <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
                <span
                  className="bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${dominantEmotion.gradientFrom}, ${dominantEmotion.gradientTo})`,
                  }}
                >
                  {dominantEmotion.displayName}
                </span>
                <span className="text-white"> Controls Your Phone Time!</span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-300">
                {dominantEmotion.description}
              </p>
            </div>

            {/* 依赖程度指示器 */}
            <div className="inline-flex items-center gap-4 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="mb-1 text-sm font-medium text-slate-400">Phone Stickiness</div>
                <div className="text-2xl font-bold" style={{ color: addictionLevel.color }}>
                  {addictionLevel.level}
                </div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <div className="mb-1 text-sm font-medium text-slate-400">Score</div>
                <div className="text-2xl font-bold" style={{ color: addictionLevel.color }}>
                  {addictionLevel.percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* 情绪分析图表 */}
          <div className="mb-12">
            <h3 className="mb-6 text-center text-2xl font-bold text-white">
              Your Emotion Breakdown
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {emotionRanking.map((item, index) => (
                <div
                  key={item.emotion.id}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.emotion.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{item.emotion.displayName}</div>
                      <div className="text-sm text-slate-400">#{index + 1} Emotion</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold" style={{ color: item.emotion.color }}>
                        {item.score}%
                      </div>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${item.percentage}%`,
                        background: `linear-gradient(90deg, ${item.emotion.gradientFrom}, ${item.emotion.gradientTo})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 个性化洞察 */}
          <div className="mb-12">
            <h3 className="mb-6 text-center text-2xl font-bold text-white">Personal Insights</h3>
            <div className="space-y-4">
              {personalizedInsights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${dominantEmotion.gradientFrom}, ${dominantEmotion.gradientTo})`,
                    }}
                  >
                    {index + 1}
                  </div>
                  <p className="leading-relaxed text-slate-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 改善建议 */}
          <div className="mb-8">
            <h3 className="mb-6 text-center text-2xl font-bold text-white">
              Recommendations for You
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <span className="text-2xl">{rec.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{rec.title}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`
                          rounded-full px-2 py-1 text-xs font-medium
                          ${
                            rec.difficulty === "easy"
                              ? "bg-green-500/20 text-green-300"
                              : rec.difficulty === "medium"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-red-500/20 text-red-300"
                          }
                        `}
                        >
                          {rec.difficulty}
                        </span>
                        <span className="text-xs capitalize text-slate-400">{rec.category}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 分享引用 */}
          <div className="text-center">
            <div className="inline-block rounded-2xl border border-white/20 bg-white/5 px-8 py-6 backdrop-blur-sm">
              <p className="mb-4 text-lg italic text-slate-300">"{result.shareableQuote}"</p>
              <div className="text-sm text-slate-400">
                Share your results and discover what emotions control your friends' phone habits!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-8 space-y-6">
        {/* 社交分享按钮 */}
        <div className="text-center">
          <h4 className="mb-4 text-lg font-semibold text-white">Share Your Results</h4>
          <div className="flex justify-center">
            <ShareButtons />
          </div>
        </div>

        {/* 功能按钮 */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* 复制和下载按钮 */}
          <button
            onClick={handleCopyResult}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-white transition-all ${
              copySuccess ? "bg-green-600 hover:bg-green-700" : "bg-slate-600 hover:bg-slate-700"
            }`}
          >
            <Copy className="h-4 w-4" />
            {copySuccess ? "Copied!" : "Copy Result"}
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-white transition-all ${
              isDownloading
                ? "cursor-not-allowed bg-purple-400"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            <Download className={`h-4 w-4 ${isDownloading ? "animate-bounce" : ""}`} />
            {isDownloading ? "Generating..." : "Download Image"}
          </button>

          {/* 重新测试按钮 */}
          <button
            onClick={onRetake}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
          >
            <RotateCcw className="h-4 w-4" />
            Take Test Again
          </button>
        </div>
      </div>
    </div>
  )
}
