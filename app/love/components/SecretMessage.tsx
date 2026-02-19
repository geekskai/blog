"use client"

import React, { useState, useEffect } from "react"

// 隐藏彩蛋：当用户点击特定次数的页面时显示特殊消息
export default function SecretMessage() {
  const [clickCount, setClickCount] = useState(0)
  const [showSecret, setShowSecret] = useState(false)
  const [secretMessages, setSecretMessages] = useState<string[]>([])

  const SECRET_MESSAGES = [
    "💝 谢谢你愿意看到这里",
    "🌟 你知道吗？每次想起你，我都会忍不住微笑",
    "🌹 这个页面每一行代码都是为你写的",
    "✨ 如果爱是一种能力，那我希望能永远爱你",
    "💫 在所有星辰之中，你是最亮的那一颗",
  ]

  useEffect(() => {
    const handleClick = () => {
      setClickCount((prev) => {
        const newCount = prev + 1

        // 每5次点击显示一条消息
        if (newCount % 5 === 0) {
          const messageIndex = Math.floor(newCount / 5) - 1
          if (messageIndex < SECRET_MESSAGES.length) {
            setSecretMessages((prevMessages) => [...prevMessages, SECRET_MESSAGES[messageIndex]])
            setShowSecret(true)

            setTimeout(() => {
              setShowSecret(false)
            }, 5000)
          }
        }

        return newCount
      })
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  if (secretMessages.length === 0) return null

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[20] w-full max-w-md -translate-x-1/2 px-6">
      {secretMessages.map((message, index) => (
        <div
          key={index}
          className={`mb-3 transform rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-emerald-900/80 p-4 text-center backdrop-blur-xl transition-all duration-500 ${
            showSecret && index === secretMessages.length - 1
              ? "translate-y-0 opacity-100"
              : index === secretMessages.length - 1
                ? "-translate-y-4 opacity-0"
                : "opacity-70"
          }`}
        >
          <p className="text-lg font-medium text-emerald-100">{message}</p>

          {/* 闪烁的星星装饰 */}
          {showSecret && index === secretMessages.length - 1 && (
            <>
              <div className="absolute -right-2 -top-2 animate-ping text-2xl">⭐</div>
              <div className="absolute -bottom-2 -left-2 animate-bounce text-2xl">✨</div>
            </>
          )}
        </div>
      ))}

      {/* 进度提示 */}
      {clickCount > 0 && clickCount % 5 !== 0 && (
        <div className="mt-3 text-center text-xs text-pink-300/60">
          {`再点击 ${5 - (clickCount % 5)} 次解锁下一条消息... 💫`}
        </div>
      )}
    </div>
  )
}
