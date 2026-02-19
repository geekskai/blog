"use client"

import React, { useEffect, useState, useRef } from "react"

interface BarrageItem {
  id: number
  text: string
  x: number
  y: number
  opacity: number
  createdAt: number
}

const QUOTES = [
  "在我眼中，你就是全世界。",
  "遇见你，是命运最好的安排。",
  "你的笑容，是我最珍贵的宝藏。",
  "每一个有你的日子，都是最美好的时光。",
  "余生很长，想和你一起度过。",
  "我喜欢你，认真且怂，从一而终。",
  "愿得一人心，白首不相离。",
  "你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫，日复一日的梦想。",
  "谢谢你愿意看到这里。",
  "致予我心动的你。",
  "你知道吗？每次想起你，我都会忍不住微笑。",
  "这个页面每一行代码都是为你写的。",
  "如果爱是一种能力，那我希望能永远爱你。",
]

// 避开中间卡片区域的随机位置生成
const getRandomPosition = () => {
  const side = Math.random()
  let x: number
  let y: number

  if (side < 0.25) {
    // 上方区域
    x = Math.random() * 100
    y = Math.random() * 25 // 0-25%
  } else if (side < 0.5) {
    // 下方区域
    x = Math.random() * 100
    y = Math.random() * 25 + 75 // 75-100%
  } else if (side < 0.75) {
    // 左侧区域
    x = Math.random() * 25 // 0-25%
    y = Math.random() * 100
  } else {
    // 右侧区域
    x = Math.random() * 25 + 75 // 75-100%
    y = Math.random() * 100
  }

  return { x, y }
}

export default function Barrage() {
  const [barrages, setBarrages] = useState<BarrageItem[]>([])
  const timersRef = useRef<Map<number, NodeJS.Timeout>>(new Map())

  // 强制限制弹幕数量不超过5个
  useEffect(() => {
    if (barrages.length > 5) {
      setBarrages((prev) => {
        // 保留最新的5个，移除最旧的
        const sorted = [...prev].sort((a, b) => a.createdAt - b.createdAt)
        const toRemove = sorted.slice(0, prev.length - 5)

        // 清理被移除弹幕的定时器
        toRemove.forEach((barrage) => {
          const timer = timersRef.current.get(barrage.id)
          if (timer) {
            clearTimeout(timer)
            timersRef.current.delete(barrage.id)
          }
        })

        return sorted.slice(-5)
      })
    }
  }, [barrages.length])

  // 为每个弹幕设置5秒后消失的定时器
  useEffect(() => {
    barrages.forEach((barrage) => {
      // 如果已经有定时器，跳过
      if (timersRef.current.has(barrage.id)) {
        return
      }

      // 计算剩余时间
      const elapsed = Date.now() - barrage.createdAt
      const remaining = Math.max(0, 5000 - elapsed)

      // 设置定时器
      const timer = setTimeout(() => {
        // 先设置透明度为0
        setBarrages((prev) => {
          return prev.map((b) => (b.id === barrage.id ? { ...b, opacity: 0 } : b))
        })

        // 0.5秒后完全移除
        const removeTimer = setTimeout(() => {
          setBarrages((prev) => {
            const filtered = prev.filter((b) => b.id !== barrage.id)
            timersRef.current.delete(barrage.id)
            return filtered
          })
        }, 500)

        timersRef.current.set(barrage.id, removeTimer)
      }, remaining)

      timersRef.current.set(barrage.id, timer)
    })

    // 清理已删除弹幕的定时器
    const currentIds = new Set(barrages.map((b) => b.id))
    timersRef.current.forEach((timer, id) => {
      if (!currentIds.has(id)) {
        clearTimeout(timer)
        timersRef.current.delete(id)
      }
    })
  }, [barrages])

  useEffect(() => {
    // 创建新弹幕的函数
    const createBarrage = () => {
      const text = QUOTES[Math.floor(Math.random() * QUOTES.length)]
      const position = getRandomPosition()
      const now = Date.now()

      const newBarrage: BarrageItem = {
        id: now + Math.random(),
        text,
        x: position.x,
        y: position.y,
        opacity: 1,
        createdAt: now,
      }

      // 原子性操作：检查数量并添加新弹幕（严格限制最多5个）
      setBarrages((prev) => {
        // 如果已经有5个或更多，先移除最旧的
        let updated = prev
        if (prev.length >= 5) {
          // 按创建时间排序，移除最旧的
          const sorted = [...prev].sort((a, b) => a.createdAt - b.createdAt)
          const toRemove = sorted[0]

          // 清理被移除弹幕的定时器
          const timer = timersRef.current.get(toRemove.id)
          if (timer) {
            clearTimeout(timer)
            timersRef.current.delete(toRemove.id)
          }

          // 保留最新的4个
          updated = sorted.slice(1)
        }

        // 添加新弹幕（确保不超过5个）
        const result = [...updated, newBarrage]

        // 双重检查：如果还是超过5个，强制限制
        if (result.length > 5) {
          const sorted = result.sort((a, b) => a.createdAt - b.createdAt)
          const toRemove = sorted.slice(0, result.length - 5)
          toRemove.forEach((barrage) => {
            const timer = timersRef.current.get(barrage.id)
            if (timer) {
              clearTimeout(timer)
              timersRef.current.delete(barrage.id)
            }
          })
          return sorted.slice(-5)
        }

        return result
      })
    }

    // 初始创建2个弹幕
    const initialCount = 2
    const initialTimers: NodeJS.Timeout[] = []
    for (let i = 0; i < initialCount; i++) {
      const timer = setTimeout(() => createBarrage(), i * 2500)
      initialTimers.push(timer)
    }

    // 每隔4-6秒创建一个新弹幕
    const interval = setInterval(
      () => {
        createBarrage()
      },
      Math.random() * 2000 + 4000 // 4-6秒随机间隔
    )
    const timersMap = timersRef.current

    return () => {
      clearInterval(interval)
      initialTimers.forEach((timer) => clearTimeout(timer))
      // 清理所有定时器
      timersMap.forEach((timer) => clearTimeout(timer))
      timersMap.clear()
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {barrages.map((barrage) => (
        <div
          key={barrage.id}
          className="absolute whitespace-nowrap text-pink-200/90"
          style={{
            left: `${barrage.x}%`,
            top: `${barrage.y}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "clamp(14px, 2vw, 18px)",
            opacity: barrage.opacity,
            transition: "opacity 0.5s ease-out",
            textShadow: "0 0 10px rgba(255, 20, 147, 0.5), 0 0 20px rgba(255, 20, 147, 0.3)",
          }}
        >
          {barrage.text}
        </div>
      ))}
    </div>
  )
}
