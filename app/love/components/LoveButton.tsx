"use client"

import React, { useState } from "react"

interface LoveButtonProps {
  onClick: () => void
}

export default function LoveButton({ onClick }: LoveButtonProps) {
  const [clicked, setClicked] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true)
    onClick()

    // 创建爱心爆炸效果
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
    }))

    setHearts((prev) => [...prev, ...newHearts])

    setTimeout(() => {
      setClicked(false)
      setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)))
    }, 1000)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 px-8 py-3 text-base tracking-[0.15em] text-white shadow-[0_0_40px_rgba(255,20,147,0.6),0_0_80px_rgba(255,20,147,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_60px_rgba(255,20,147,0.9),0_0_120px_rgba(255,20,147,0.5)] sm:px-10 sm:py-4 sm:text-lg ${
          clicked ? "animate-bounce" : ""
        }`}
        style={{
          cursor: "pointer",
          fontFamily: "cursive",
          animation: "button-pulse 2s ease-in-out infinite",
        }}
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-30 blur-md group-hover:opacity-50" />
        <span className="relative flex items-center justify-center gap-2">
          <span className="animate-pulse text-xl sm:text-2xl">✨</span>
          <span className="text-shadow-[0_0_10px_rgba(255,255,255,0.8)]">点击放烟花</span>
          <span className="animate-pulse text-xl sm:text-2xl">✨</span>
        </span>
      </button>

      {/* 爱心爆炸效果 */}
      {hearts.map((heart, index) => {
        const angle = (index / 12) * Math.PI * 2
        const distance = 100
        return (
          <div
            key={heart.id}
            className="animate-heart-burst pointer-events-none fixed z-[9999] text-3xl"
            style={
              {
                left: heart.x,
                top: heart.y,
                "--tx": `${Math.cos(angle) * distance}px`,
                "--ty": `${Math.sin(angle) * distance}px`,
              } as React.CSSProperties
            }
          >
            💖
          </div>
        )
      })}

      <style jsx>{`
        @keyframes heart-burst {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(2)
              rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes button-pulse {
          0%,
          100% {
            box-shadow:
              0 0 40px rgba(255, 20, 147, 0.6),
              0 0 80px rgba(255, 20, 147, 0.3);
          }
          50% {
            box-shadow:
              0 0 60px rgba(255, 20, 147, 0.8),
              0 0 120px rgba(255, 20, 147, 0.5);
          }
        }

        .animate-heart-burst {
          animation: heart-burst 1.2s ease-out forwards;
        }
      `}</style>
    </>
  )
}
