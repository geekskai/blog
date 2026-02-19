"use client"

import { useEffect, useState } from "react"

interface Heart {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  emoji: string
}

const HEART_EMOJIS = ["❤️", "💕", "💖", "💗", "💝", "💘", "💞", "💓"]

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    // 初始化8个爱心
    const initialHearts: Heart[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      size: Math.random() * 15 + 18,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 5,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    }))

    setHearts(initialHearts)

    // 定期添加新爱心
    const interval = setInterval(() => {
      const newHeart: Heart = {
        id: Date.now(),
        x: Math.random() * 100,
        size: Math.random() * 15 + 18,
        duration: Math.random() * 8 + 10,
        delay: 0,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      }

      setHearts((prev) => [...prev, newHeart])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // 动画结束后自动移除爱心
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    hearts.forEach((heart) => {
      const totalTime = (heart.duration + heart.delay) * 1000
      const timer = setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== heart.id))
      }, totalTime)
      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [hearts])

  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute opacity-70"
          style={{
            left: `${heart.x}%`,
            bottom: "-50px",
            fontSize: `${heart.size}px`,
            animation: `float-up ${heart.duration}s linear ${heart.delay}s forwards`,
          }}
        >
          {heart.emoji}
        </div>
      ))}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes float-up {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
              }
              10% {
                opacity: 0.7;
              }
              90% {
                opacity: 0.5;
              }
              100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `,
        }}
      />
    </div>
  )
}
