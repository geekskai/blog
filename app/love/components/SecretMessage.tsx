"use client"

import React, { useEffect, useRef, useState } from "react"

interface SecretMessageItem {
  id: number
  text: string
  fading: boolean
}

const SECRET_MESSAGES = [
  "💝 谢谢你愿意看到这里",
  "🌟 你知道吗？每次想起你，我都会忍不住微笑",
  "🌹 这个页面每一行代码都是为你写的",
  "✨ 如果爱是一种能力，那我希望能永远爱你",
  "💫 在所有星辰之中，你是最亮的那一颗",
]

const MAX_VISIBLE = 5
const DISPLAY_MS = 5000
const FADE_MS = 500

// 隐藏彩蛋：每5次点击解锁一条消息，最多同时显示5条
export default function SecretMessage() {
  const [clickCount, setClickCount] = useState(0)
  const [secretMessages, setSecretMessages] = useState<SecretMessageItem[]>([])
  const unlockedStepsRef = useRef<Set<number>>(new Set())
  const timersRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    const handleClick = () => {
      setClickCount((prev) => {
        const nextCount = prev + 1

        if (nextCount % 5 === 0) {
          const step = nextCount / 5
          // 防止快速点击或重复监听导致同一步骤重复入栈
          if (!unlockedStepsRef.current.has(step)) {
            unlockedStepsRef.current.add(step)

            const text = SECRET_MESSAGES[(step - 1) % SECRET_MESSAGES.length]
            const id = Date.now() + Math.random()

            setSecretMessages((prevMessages) => {
              const next = [...prevMessages, { id, text, fading: false }]
              return next.slice(-MAX_VISIBLE)
            })

            // 5秒后淡出
            const fadeTimer = setTimeout(() => {
              setSecretMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.id === id ? { ...msg, fading: true } : msg))
              )
            }, DISPLAY_MS)

            // 淡出后移除
            const removeTimer = setTimeout(() => {
              setSecretMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id))
            }, DISPLAY_MS + FADE_MS)

            timersRef.current.push(fadeTimer, removeTimer)
          }
        }

        return nextCount
      })
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
      timersRef.current.forEach((timer) => clearTimeout(timer))
      timersRef.current = []
    }
  }, [])

  if (secretMessages.length === 0) return null

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[20] w-full max-w-md -translate-x-1/2 px-6">
      {secretMessages.map((message) => (
        <div
          key={message.id}
          className={`mb-3 rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-emerald-900/80 p-4 text-center backdrop-blur-xl transition-all duration-500 ${
            message.fading ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <p className="text-lg font-medium text-emerald-100">{message.text}</p>
          {!message.fading && (
            <>
              <div className="absolute -right-2 -top-2 animate-ping text-2xl">⭐</div>
              <div className="absolute -bottom-2 -left-2 animate-bounce text-2xl">✨</div>
            </>
          )}
        </div>
      ))}

      {clickCount > 0 && clickCount % 5 !== 0 && (
        <div className="mt-3 text-center text-xs text-pink-300/60">
          {`再点击 ${5 - (clickCount % 5)} 次解锁下一条消息... 💫`}
        </div>
      )}
    </div>
  )
}
