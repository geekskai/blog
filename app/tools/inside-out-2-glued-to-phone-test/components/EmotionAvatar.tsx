"use client"

import React from "react"
import { EmotionAvatarProps } from "../types"

export const EmotionAvatar: React.FC<EmotionAvatarProps> = ({
  emotion,
  size = "md",
  animated = false,
  glowing = false,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-2xl",
    md: "w-16 h-16 text-4xl",
    lg: "w-24 h-24 text-6xl",
    xl: "w-32 h-32 text-8xl",
  }

  const glowStyle = glowing
    ? {
        boxShadow: `0 0 20px ${emotion.color}40, 0 0 40px ${emotion.color}20`,
        filter: "brightness(1.1)",
      }
    : {}

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        flex items-center justify-center rounded-full
        transition-all duration-300 ease-out
        ${animated ? "animate-bounce" : ""}
        ${glowing ? "animate-pulse" : ""}
      `}
      style={{
        background: `linear-gradient(135deg, ${emotion.gradientFrom}20, ${emotion.gradientTo}20)`,
        border: `2px solid ${emotion.color}30`,
        ...glowStyle,
      }}
    >
      <span className="select-none">{emotion.avatar}</span>
    </div>
  )
}

// 情绪角色轮播组件
export const EmotionCarousel: React.FC<{
  emotions: any[]
  currentIndex: number
  onEmotionChange?: (index: number) => void
}> = ({ emotions, currentIndex, onEmotionChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      {emotions.map((emotion, index) => {
        const isCurrent = index === currentIndex
        const isAdjacent = Math.abs(index - currentIndex) === 1
        const isVisible = Math.abs(index - currentIndex) <= 2

        if (!isVisible) return null

        return (
          <button
            key={emotion.id}
            type="button"
            className={`
              cursor-pointer border-none bg-transparent p-0 transition-all duration-500
              ${
                isCurrent
                  ? "scale-100 opacity-100"
                  : isAdjacent
                    ? "scale-75 opacity-60"
                    : "scale-50 opacity-30"
              }
            `}
            onClick={() => onEmotionChange?.(index)}
            aria-label={`Select ${emotion.displayName} emotion`}
          >
            <EmotionAvatar
              emotion={emotion}
              size={isCurrent ? "xl" : isAdjacent ? "lg" : "md"}
              animated={isCurrent}
              glowing={isCurrent}
            />
            <div className="mt-2 text-center">
              <div
                className={`font-semibold ${isCurrent ? "text-lg text-white" : "text-sm text-slate-400"}`}
              >
                {emotion.displayName}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
