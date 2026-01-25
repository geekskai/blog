"use client"

import React, { useState, useEffect } from "react"
import { QuestionCardProps, Answer } from "../types"
import { EMOTIONS } from "../constants/emotions"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onPrevious,
  onNext,
  canGoBack = false,
  canGoNext = false,
  isAnimating = false,
}) => {
  const t = useTranslations("InsideOut2GluedToPhoneTest")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null)

  // 重置选择状态当问题改变时
  useEffect(() => {
    setSelectedOption(null)
    setIsSubmitting(false)
  }, [question.id])

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitting) return
    setSelectedOption(optionId)

    // 清除之前的定时器
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer)
    }

    // 设置自动跳转定时器（1.5秒后自动提交）
    const timer = setTimeout(() => {
      handleSubmit(optionId)
    }, 1500)

    setAutoAdvanceTimer(timer)
  }

  const handleSubmit = (optionId?: string) => {
    const targetOption = optionId || selectedOption
    if (!targetOption || isSubmitting) return

    const option = question.options.find((opt) => opt.id === targetOption)
    if (!option) return

    // 清除自动跳转定时器
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer)
      setAutoAdvanceTimer(null)
    }

    setIsSubmitting(true)

    const answer: Answer = {
      questionId: question.id,
      optionId: targetOption,
      value: option.value,
      emotionImpact: option.emotionImpact,
    }

    // 添加提交动画延迟
    setTimeout(() => {
      onAnswer(answer)
    }, 300)
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer)
      }
    }
  }, [autoAdvanceTimer])

  const progress = ((currentIndex + 1) / totalQuestions) * 100

  return (
    <div
      className={`mx-auto w-full max-w-4xl transition-all duration-500 ${isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}
    >
      {/* 进度条 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">
            {t("question_progress", { current: currentIndex + 1, total: totalQuestions })}
          </span>
          <span className="text-sm font-medium text-slate-300">
            {t("question_complete", { percent: Math.round(progress) })}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 问题卡片 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl" />

        <div className="relative p-8 md:p-12">
          {/* 问题标题 */}
          <div className="mb-8">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
              <span className="text-2xl">🧠</span>
              <h2 className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
                {t("question_analysis")}
              </h2>
            </div>

            <h3 className="text-2xl font-bold leading-relaxed text-white md:text-3xl">
              {question.text}
            </h3>
          </div>

          {/* 选项列表 */}
          <div className="mb-8 space-y-4">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === option.id
              const optionLetter = String.fromCharCode(65 + index) // A, B, C, D

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isSubmitting}
                  className={`
                    group relative w-full rounded-2xl border-2 p-6 text-left transition-all duration-300
                    ${
                      isSelected
                        ? "border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-purple-500/15 shadow-xl shadow-blue-500/25"
                        : "to-white/2 border-white/20 bg-gradient-to-br from-white/5 hover:border-white/40 hover:from-white/10 hover:to-white/5"
                    }
                    ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                  `}
                >
                  {/* 选项指示器 */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-white/10 text-slate-300 group-hover:bg-white/20"
                      }
                    `}
                    >
                      {optionLetter}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-lg leading-relaxed transition-colors duration-300 ${
                          isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {option.text}
                      </p>
                    </div>
                  </div>

                  {/* 选中指示器 */}
                  {isSelected && (
                    <div className="absolute right-4 top-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                        <ChevronRight className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* 导航按钮区域 */}
          <div className="flex items-center justify-between">
            {/* 上一题按钮 */}
            <button
              onClick={onPrevious}
              disabled={!canGoBack || isSubmitting}
              className={`
                flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300
                ${
                  canGoBack && !isSubmitting
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "cursor-not-allowed bg-white/5 text-slate-500 opacity-50"
                }
              `}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("question_previous")}
            </button>

            {/* 提交按钮 */}
            <button
              onClick={() => handleSubmit()}
              disabled={!selectedOption || isSubmitting}
              className={`
                group relative overflow-hidden rounded-2xl px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300
                ${
                  selectedOption && !isSubmitting
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
                    : "cursor-not-allowed bg-gradient-to-r from-slate-600 to-slate-700 opacity-50"
                }
              `}
            >
              {/* 光线扫过效果 */}
              {selectedOption && !isSubmitting && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              )}

              <span className="relative flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t("question_processing")}
                  </>
                ) : (
                  <>
                    {autoAdvanceTimer ? t("question_auto_advancing") : t("question_next")}
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </span>
            </button>

            {/* 下一题按钮 */}
            <button
              onClick={onNext}
              disabled={!canGoNext || isSubmitting}
              className={`
                flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300
                ${
                  canGoNext && !isSubmitting
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "cursor-not-allowed bg-white/5 text-slate-500 opacity-50"
                }
              `}
            >
              {t("question_next")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 情绪预览（可选，显示当前问题可能影响的情绪） */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>{t("question_analyzes")}</span>
          <div className="flex gap-1">
            {Object.entries(question.emotionWeights)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([emotionId]) => {
                const emotion = EMOTIONS[emotionId]
                return emotion ? (
                  <span key={emotionId} className="text-lg" title={emotion.displayName}>
                    {emotion.avatar}
                  </span>
                ) : null
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
