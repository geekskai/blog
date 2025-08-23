"use client"

import React, { useState, useEffect } from "react"
import { EMOTION_LIST } from "../constants/emotions"
import { EmotionCarousel } from "./EmotionAvatar"
import { Play, Brain, Smartphone, Heart, ChevronRight } from "lucide-react"

interface StartScreenProps {
  onStart: () => void
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)

  // 自动轮播情绪角色
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmotionIndex((prev) => (prev + 1) % EMOTION_LIST.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // 页面加载动画
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "9 Inside Out 2 Emotions",
      description: "Discover which emotion makes you glued to your phone",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Phone Addiction Analysis",
      description: "Measure your phone stickiness and dependency level",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Digital Wellness Insights",
      description: "Break free from phone addiction with personalized tips",
    },
  ]

  return (
    <div
      className={`min-h-screen bg-slate-950 transition-all duration-1000 ${isReady ? "opacity-100" : "opacity-0"}`}
    >
      {/* 第一屏：核心价值主张 + CTA */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* 品牌标识 */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">🎭</span>
            <h2 className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
              Inside Out 2 Phone Addiction Test
            </h2>
          </div>

          {/* 主标题 */}
          <h1 className="mb-8 text-5xl font-bold leading-tight text-white md:text-7xl">
            Are You
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Glued to Your
            </span>
            <br />
            Phone?
          </h1>

          {/* 核心价值主张 */}
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl">
            Discover which <strong className="text-white">Inside Out 2 emotion</strong> controls
            your phone habits. Get personalized insights in just{" "}
            <strong className="text-blue-300">3 minutes</strong>.
          </p>

          {/* 情绪预览轮播 */}
          <div className="mb-12">
            <EmotionCarousel
              emotions={EMOTION_LIST}
              currentIndex={currentEmotionIndex}
              onEmotionChange={setCurrentEmotionIndex}
            />
            <p className="mt-4 text-lg text-slate-400">
              Could{" "}
              <span className="font-semibold text-white">
                {EMOTION_LIST[currentEmotionIndex].displayName}
              </span>{" "}
              be controlling your phone time?
            </p>
          </div>

          {/* 主要CTA */}
          <div className="mb-8">
            <button
              onClick={onStart}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-12 py-6 text-xl font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-3">
                <Play className="h-6 w-6" />
                Start Free Test Now
              </span>
            </button>
          </div>

          {/* 信任信号 */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Free • 3 min • Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>No Registration Required</span>
            </div>
          </div>

          {/* 向下滚动提示 */}
          <div className="mt-16 animate-bounce">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <ChevronRight className="h-4 w-4 rotate-90 text-white/60" />
            </div>
            <p className="mt-2 text-xs text-slate-500">Learn more below</p>
          </div>
        </div>
      </div>

      {/* 第二屏：详细功能介绍 */}
      <div className="border-t border-white/10 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Our scientifically-designed test analyzes your phone habits through Disney Pixar's
              emotional framework
            </p>
          </div>

          {/* 功能特点网格 */}
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="to-white/2 group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:from-white/10 hover:to-white/5 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* 次要CTA */}
          <div className="mt-16 text-center">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Play className="h-5 w-5" />
              Start Your Emotion Analysis
              <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
