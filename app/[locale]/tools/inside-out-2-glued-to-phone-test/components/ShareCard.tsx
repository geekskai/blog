"use client"

import React, { useRef, useState, useEffect } from "react"
import { TestResult } from "../types"
import { shareUtils } from "../utils/shareUtils"

interface ShareCardProps {
  result: TestResult
  isVisible?: boolean
}

export const ShareCard: React.FC<ShareCardProps> = ({ result, isVisible = false }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { dominantEmotion, addictionLevel, emotionScores } = result

  // 获取前3个情绪
  const topEmotions = Object.entries(emotionScores)
    .map(([emotion, score]) => ({ emotion, score: Math.round(score as number) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  if (!isClient) return null

  return (
    <div
      ref={cardRef}
      className={`pointer-events-none fixed left-0 top-0 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ transform: "translateX(-9999px)" }}
    >
      <div
        className="w-[800px] bg-white text-gray-900"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-lg">
          {/* 头部区域 */}
          <div
            className="border-b border-gray-200 p-8"
            style={{
              background: `linear-gradient(135deg, ${dominantEmotion.gradientFrom}20, ${dominantEmotion.gradientTo}20)`,
            }}
          >
            <div className="text-center">
              <div className="mb-4 text-6xl">{dominantEmotion.avatar}</div>
              <h1 className="mb-2 text-3xl font-bold text-gray-800">
                {dominantEmotion.displayName} Controls My Phone Time!
              </h1>
              <div className="inline-block rounded-full bg-white px-6 py-3 shadow-sm">
                <span className="text-xl font-semibold" style={{ color: addictionLevel.color }}>
                  {addictionLevel.level} Addiction Level ({addictionLevel.percentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-8">
            {/* 情绪分析 */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center border-b border-gray-200 pb-2 text-xl font-bold text-gray-800">
                <span className="mr-2">🧠</span> My Emotion Breakdown
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {topEmotions.map(({ emotion, score }, index) => {
                  const emotionData =
                    dominantEmotion.id === emotion
                      ? dominantEmotion
                      : Object.values(require("../constants/emotions").EMOTIONS).find(
                          (e: any) => e.id === emotion
                        )

                  if (!emotionData) return null

                  return (
                    <div key={emotion} className="rounded-lg bg-gray-50 p-4 text-center">
                      <div className="mb-2 text-2xl">{(emotionData as any).avatar}</div>
                      <div className="text-sm font-medium capitalize text-gray-700">{emotion}</div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: (emotionData as any).color }}
                      >
                        {score}%
                      </div>
                      <div className="text-xs text-gray-500">#{index + 1}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 关键洞察 */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center border-b border-gray-200 pb-2 text-xl font-bold text-gray-800">
                <span className="mr-2">💡</span> Key Insight
              </h2>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="leading-relaxed text-gray-700">{dominantEmotion.description}</p>
              </div>
            </div>

            {/* 分享引用 */}
            <div className="mb-6">
              <div
                className="rounded-lg border-l-4 p-6"
                style={{
                  borderColor: dominantEmotion.color,
                  backgroundColor: `${dominantEmotion.color}10`,
                }}
              >
                <p className="text-lg italic text-gray-700">"{result.shareableQuote}"</p>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Test Completed</div>
                <div className="font-medium text-gray-800">
                  {new Date(result.completedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Dominant Emotion</div>
                <div className="font-medium text-gray-800">
                  {dominantEmotion.displayName} {dominantEmotion.avatar}
                </div>
              </div>
            </div>
          </div>

          {/* 页脚 */}
          <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Inside Out 2 Phone Addiction Test
                </div>
                <div className="text-sm text-gray-500">
                  Discover which emotion controls your phone time
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">geekskai.com</div>
                <div className="text-xs text-gray-500">Take the test yourself!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 导出生成分享图片的函数
export const generateShareImage = async (result: TestResult): Promise<string> => {
  try {
    // 创建临时的分享卡片元素
    const tempDiv = document.createElement("div")
    tempDiv.style.position = "fixed"
    tempDiv.style.left = "-9999px"
    tempDiv.style.top = "0"
    document.body.appendChild(tempDiv)

    // 渲染分享卡片到临时元素
    const { createRoot } = await import("react-dom/client")
    const root = createRoot(tempDiv)

    return new Promise((resolve, reject) => {
      root.render(React.createElement(ShareCard, { result, isVisible: true }))

      // 等待渲染完成
      setTimeout(async () => {
        try {
          const cardElement = tempDiv.querySelector("[data-share-card]") as HTMLElement
          if (!cardElement) {
            throw new Error("Share card element not found")
          }

          // 使用html2canvas生成图片
          const html2canvas = (await import("html2canvas")).default
          const canvas = await html2canvas(cardElement, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
            allowTaint: false,
            logging: false,
          })

          const imageDataUrl = canvas.toDataURL("image/png")

          // 清理临时元素
          root.unmount()
          document.body.removeChild(tempDiv)

          resolve(imageDataUrl)
        } catch (error) {
          // 清理临时元素
          root.unmount()
          document.body.removeChild(tempDiv)
          reject(error)
        }
      }, 1000)
    })
  } catch (error) {
    console.error("Failed to generate share image:", error)
    throw error
  }
}
