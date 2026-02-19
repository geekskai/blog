"use client"

import React, { useEffect, useState } from "react"

const QUOTES = [
  "在我眼中，你就是全世界。",
  "遇见你，是命运最好的安排。",
  "你的笑容，是我最珍贵的宝藏。",
  "每一个有你的日子，都是最美好的时光。",
  "余生很长，想和你一起度过。",
  "我喜欢你，认真且怂，从一而终。",
  "愿得一人心，白首不相离。",
  "你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫，日复一日的梦想。",
]

export default function LoveQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % QUOTES.length)
        setIsVisible(true)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-[15] w-full max-w-2xl -translate-x-1/2 px-6">
      <div
        className={`rounded-2xl border border-pink-400/30 bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-pink-900/40 p-6 text-center backdrop-blur-lg transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <p className="text-lg italic leading-relaxed text-pink-100 md:text-xl">
          &ldquo;{QUOTES[currentQuote]}&rdquo;
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {QUOTES.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentQuote ? "w-8 bg-pink-400" : "w-2 bg-pink-400/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
