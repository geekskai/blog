"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import LoveButton from "./components/LoveButton"
import FloatingHearts from "./components/FloatingHearts"
import LoveQuotes from "./components/LoveQuotes"
import MusicPlayer from "./components/MusicPlayer"
import SecretMessage from "./components/SecretMessage"

// ===== 类型定义 =====
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  gravity: number
  decay: number
  trail: Array<{ x: number; y: number }>
}

interface Rocket {
  x: number
  y: number
  targetY: number
  vy: number
  color: string
  alpha: number
  trail: Array<{ x: number; y: number }>
  exploded: boolean
}

interface BgParticle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  color: string
  alpha: number
}

interface ClickHeart {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  scale: number
  rotation: number
}

// ===== 常量配置 =====
const COLORS = [
  "#ff69b4",
  "#ff1493",
  "#ff6eb4",
  "#ffb6c1",
  "#fff0f5",
  "#ffd700",
  "#ff4500",
  "#00ced1",
  "#9400d3",
  "#00ff7f",
  "#1e90ff",
  "#ff8c00",
]

const PETAL_SYMBOLS = ["🌸", "💕", "✨", "💖", "🌺", "💗", "⭐", "🌹", "💝", "🦋"]

export default function LovePage() {
  const fwCanvasRef = useRef<HTMLCanvasElement>(null)
  const pCanvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const [cardVisible, setCardVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [confessionVisible, setConfessionVisible] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const rocketsRef = useRef<Rocket[]>([])
  const bgParticlesRef = useRef<BgParticle[]>([])
  const clickHeartsRef = useRef<ClickHeart[]>([])
  const frameCountRef = useRef(0)

  // ===== 烟花粒子类 =====
  const createParticle = useCallback(
    (x: number, y: number, color: string, angle: number, speed: number): Particle => {
      return {
        x,
        y,
        color,
        alpha: 1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1,
        gravity: 0.08,
        decay: Math.random() * 0.015 + 0.008,
        trail: [],
      }
    },
    []
  )

  // ===== 火箭类 =====
  const createRocket = useCallback((canvas: HTMLCanvasElement): Rocket => {
    const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1
    const targetY = Math.random() * canvas.height * 0.5 + 50
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    return {
      x,
      y: canvas.height + 10,
      targetY,
      vy: -18 - Math.random() * 6,
      color,
      alpha: 1,
      trail: [],
      exploded: false,
    }
  }, [])

  // ===== 火箭爆炸 =====
  const explodeRocket = useCallback(
    (rocket: Rocket) => {
      const count = 150 + Math.floor(Math.random() * 80) // 增加粒子数量
      const c1 = COLORS[Math.floor(Math.random() * COLORS.length)]
      const c2 = COLORS[Math.floor(Math.random() * COLORS.length)]

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = Math.random() * 8 + 3
        const color = Math.random() > 0.5 ? c1 : c2
        particlesRef.current.push(createParticle(rocket.x, rocket.y, color, angle, speed))
      }

      // 额外火花
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 4 + 1
        particlesRef.current.push(createParticle(rocket.x, rocket.y, "#fff", angle, speed))
      }
    },
    [createParticle]
  )

  // ===== 发射火箭 =====
  const launchRocket = useCallback(() => {
    const canvas = fwCanvasRef.current
    if (!canvas) return
    rocketsRef.current.push(createRocket(canvas))
  }, [createRocket])

  // ===== 大烟花效果 =====
  const triggerBigFireworks = useCallback(() => {
    for (let i = 0; i < 12; i++) {
      // 增加到12枚
      setTimeout(() => launchRocket(), i * 150)
    }
  }, [launchRocket])

  // ===== 烟花动画循环 =====
  useEffect(() => {
    const canvas = fwCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let animationId: number

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.12)" // 更长的轨迹
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      frameCountRef.current++
      if (frameCountRef.current % 60 === 0) {
        // 更频繁的烟花
        launchRocket()
      }

      // 更新和绘制火箭
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const rocket = rocketsRef.current[i]
        rocket.trail.push({ x: rocket.x, y: rocket.y })
        if (rocket.trail.length > 15) rocket.trail.shift()

        rocket.vy += 0.3
        rocket.y += rocket.vy

        if (rocket.y <= rocket.targetY && !rocket.exploded) {
          rocket.exploded = true
          explodeRocket(rocket)
          rocketsRef.current.splice(i, 1)
          continue
        }

        if (!rocket.exploded) {
          // 绘制火箭尾迹
          for (let j = 0; j < rocket.trail.length; j++) {
            const a = (j / rocket.trail.length) * 0.7
            ctx.globalAlpha = a
            ctx.fillStyle = rocket.color
            ctx.shadowBlur = 12
            ctx.shadowColor = rocket.color
            ctx.beginPath()
            ctx.arc(rocket.trail[j].x, rocket.trail[j].y, 2.5, 0, Math.PI * 2)
            ctx.fill()
          }

          // 绘制火箭
          ctx.globalAlpha = 1
          ctx.fillStyle = "#fff"
          ctx.shadowBlur = 25
          ctx.shadowColor = rocket.color
          ctx.beginPath()
          ctx.arc(rocket.x, rocket.y, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // 更新和绘制粒子
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]

        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 10) p.trail.shift()

        p.vx *= 0.98
        p.vy += p.gravity
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1)
          continue
        }

        ctx.save()

        // 绘制尾迹
        for (let j = 0; j < p.trail.length; j++) {
          const a = (j / p.trail.length) * p.alpha * 0.5
          ctx.globalAlpha = a
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.trail[j].x, p.trail[j].y, p.radius * (j / p.trail.length), 0, Math.PI * 2)
          ctx.fill()
        }

        // 绘制粒子
        ctx.globalAlpha = p.alpha
        ctx.shadowBlur = 18
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [launchRocket, explodeRocket])

  // ===== 背景粒子动画 =====
  useEffect(() => {
    const canvas = pCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 初始化背景粒子
    for (let i = 0; i < 100; i++) {
      // 增加粒子数量
      bgParticlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: `hsl(${310 + Math.random() * 80},100%,${60 + Math.random() * 30}%)`,
        alpha: Math.random() * 0.6 + 0.3,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of bgParticlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // 连接附近的粒子
      for (let i = 0; i < bgParticlesRef.current.length; i++) {
        for (let j = i + 1; j < bgParticlesRef.current.length; j++) {
          const dx = bgParticlesRef.current[i].x - bgParticlesRef.current[j].x
          const dy = bgParticlesRef.current[i].y - bgParticlesRef.current[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.globalAlpha = (1 - dist / 120) * 0.2
            ctx.strokeStyle = "#ff69b4"
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(bgParticlesRef.current[i].x, bgParticlesRef.current[i].y)
            ctx.lineTo(bgParticlesRef.current[j].x, bgParticlesRef.current[j].y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // ===== 星星效果 =====
  useEffect(() => {
    const stars: HTMLDivElement[] = []
    for (let i = 0; i < 150; i++) {
      // 增加星星数量
      const star = document.createElement("div")
      star.className = "fixed rounded-full bg-white animate-twinkle pointer-events-none"
      const size = Math.random() * 3 + 1
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 3 + 2}s;
        animation-delay: ${Math.random() * 3}s;
        z-index: 0;
        box-shadow: 0 0 ${size * 2}px rgba(255,255,255,0.5);
      `
      document.body.appendChild(star)
      stars.push(star)
    }

    return () => {
      stars.forEach((star) => star.remove())
    }
  }, [])

  // ===== 浮动花瓣 =====
  useEffect(() => {
    const createPetal = () => {
      const petal = document.createElement("div")
      petal.className = "fixed pointer-events-none animate-petal-fall"
      petal.textContent = PETAL_SYMBOLS[Math.floor(Math.random() * PETAL_SYMBOLS.length)]
      petal.style.cssText = `
        left: ${Math.random() * 100}vw;
        font-size: ${Math.random() * 1 + 0.8}em;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 5}s;
        z-index: 5;
        opacity: 0.9;
        filter: drop-shadow(0 0 3px rgba(255,105,180,0.5));
      `
      document.body.appendChild(petal)
      setTimeout(() => petal.remove(), 14000)
    }

    const interval = setInterval(createPetal, 400) // 更频繁
    return () => clearInterval(interval)
  }, [])

  // ===== 自定义光标 =====
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // ===== 鼠标点击爱心特效 =====
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const count = 4 + Math.floor(Math.random() * 4)
      for (let i = 0; i < count; i++) {
        clickHeartsRef.current.push({
          id: Date.now() + i + Math.random(),
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 5 - 3,
          life: 0,
          maxLife: 70,
          scale: Math.random() * 0.6 + 0.6,
          rotation: Math.random() * 360,
        })
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // ===== 点击爱心动画 =====
  useEffect(() => {
    let animationId: number

    const animate = () => {
      clickHeartsRef.current = clickHeartsRef.current.filter((heart) => {
        heart.life++
        heart.y += heart.vy
        heart.x += heart.vx
        heart.vy += 0.12
        heart.rotation += 6
        return heart.life < heart.maxLife
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])

  // ===== 卡片3D倾斜效果 =====
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return

      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const rx = ((e.clientY - cy) / cy) * -8
      const ry = ((e.clientX - cx) / cx) * 8

      cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`
    }

    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = ""
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // ===== 显示卡片（分阶段动画）=====
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCardVisible(true)
    }, 300)

    const timer2 = setTimeout(() => {
      setTextVisible(true)
      launchRocket()
    }, 1000)

    const timer3 = setTimeout(() => {
      setConfessionVisible(true)
      setTimeout(launchRocket, 400)
      setTimeout(launchRocket, 800)
    }, 1800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [launchRocket])

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-purple-950/30 to-black"
      style={{ cursor: "none" }}
    >
      {/* 自定义光标 */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform"
        style={{
          background: "radial-gradient(circle, #ff69b4, #ff1493)",
          boxShadow: "0 0 25px #ff69b4, 0 0 50px #ff1493, 0 0 75px #ff69b4",
        }}
      />

      {/* 点击爱心特效 */}
      {clickHeartsRef.current.map((heart) => {
        const progress = heart.life / heart.maxLife
        const opacity = 1 - progress
        return (
          <div
            key={heart.id}
            className="pointer-events-none fixed z-[100] text-4xl"
            style={{
              left: heart.x,
              top: heart.y,
              opacity,
              transform: `translate(-50%, -50%) scale(${heart.scale * (1 + progress * 0.6)}) rotate(${heart.rotation}deg)`,
              filter: "drop-shadow(0 0 5px rgba(255,105,180,0.8))",
            }}
          >
            💖
          </div>
        )
      })}

      {/* Canvas 层 */}
      <canvas ref={pCanvasRef} className="fixed left-0 top-0 z-[1]" />
      <canvas ref={fwCanvasRef} className="fixed left-0 top-0 z-[2]" />

      {/* 浮动爱心 */}
      <FloatingHearts />

      {/* 浪漫语录 */}
      <LoveQuotes />

      {/* 音乐播放器 */}
      <MusicPlayer />

      {/* 隐藏彩蛋 */}
      <SecretMessage />

      {/* 主场景 */}
      <div
        className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto p-4"
        style={{ perspective: "2000px" }}
      >
        <div
          ref={cardRef}
          className={`relative my-auto w-full max-w-[95vw] rounded-3xl border-2 border-pink-400/60 p-6 text-center shadow-[0_0_100px_rgba(255,20,147,0.5),0_0_200px_rgba(255,20,147,0.3),inset_0_0_100px_rgba(255,20,147,0.1)] backdrop-blur-2xl transition-all duration-1000 sm:max-w-[700px] sm:p-10 md:p-14 lg:p-16 ${
            cardVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(135deg, rgba(20,0,30,0.95) 0%, rgba(60,0,50,0.95) 30%, rgba(40,0,60,0.95) 70%, rgba(50,0,40,0.95) 100%)",
            transformStyle: "preserve-3d",
            animation: "float-card 10s ease-in-out infinite",
          }}
        >
          {/* 增强的发光装饰球 */}
          <div className="absolute -right-24 -top-24 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br from-pink-500/40 to-purple-500/40 blur-3xl" />
          <div
            className="absolute -bottom-24 -left-24 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute -right-12 bottom-12 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-cyan-500/30 to-pink-500/30 blur-3xl"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute -left-12 top-12 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-yellow-500/20 to-pink-500/20 blur-3xl"
            style={{ animationDelay: "1.5s" }}
          />

          {/* 增强的角落装饰 */}
          <div
            className="sm:border-l-3 sm:border-t-3 absolute left-2 top-2 h-8 w-8 animate-pulse rounded-tl-xl border-l-2 border-t-2 border-pink-400/90 opacity-90 sm:left-4 sm:top-4 sm:h-14 sm:w-14"
            style={{ boxShadow: "0 0 10px rgba(255,105,180,0.5)" }}
          />
          <div
            className="sm:border-r-3 sm:border-t-3 absolute right-2 top-2 h-8 w-8 animate-pulse rounded-tr-xl border-r-2 border-t-2 border-pink-400/90 opacity-90 sm:right-4 sm:top-4 sm:h-14 sm:w-14"
            style={{ animationDelay: "0.2s", boxShadow: "0 0 10px rgba(255,105,180,0.5)" }}
          />
          <div
            className="sm:border-b-3 sm:border-l-3 absolute bottom-2 left-2 h-8 w-8 animate-pulse rounded-bl-xl border-b-2 border-l-2 border-pink-400/90 opacity-90 sm:bottom-4 sm:left-4 sm:h-14 sm:w-14"
            style={{ animationDelay: "0.4s", boxShadow: "0 0 10px rgba(255,105,180,0.5)" }}
          />
          <div
            className="sm:border-b-3 sm:border-r-3 absolute bottom-2 right-2 h-8 w-8 animate-pulse rounded-br-xl border-b-2 border-r-2 border-pink-400/90 opacity-90 sm:bottom-4 sm:right-4 sm:h-14 sm:w-14"
            style={{ animationDelay: "0.6s", boxShadow: "0 0 10px rgba(255,105,180,0.5)" }}
          />

          {/* 内容 */}
          <div
            className={`transition-all duration-1000 ${textVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <h1
              className="mb-3 text-4xl font-bold leading-tight tracking-[0.15em] text-white sm:mb-4 sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                textShadow:
                  "0 0 30px #ff69b4, 0 0 60px #ff1493, 0 0 120px #ff69b4, 0 0 180px #ff1493",
                animation:
                  "glow-pulse 2.5s ease-in-out infinite, text-shimmer 4s ease-in-out infinite, scale-pulse 4s ease-in-out infinite",
                background:
                  "linear-gradient(45deg, #fff 0%, #ff69b4 25%, #fff 50%, #ff1493 75%, #fff 100%)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              陈成连
            </h1>

            <p
              className="mb-6 text-base tracking-[0.3em] text-pink-200/90 sm:mb-8 sm:text-lg md:mb-10 md:text-xl lg:text-2xl"
              style={{ fontFamily: "serif", textShadow: "0 0 10px rgba(255,105,180,0.5)" }}
            >
              — 致那个让我心动的你 —
            </p>
          </div>

          <div
            className={`transition-all delay-300 duration-1000 ${textVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            {/* 分割线 */}
            <div className="relative mx-auto mb-5 h-px w-full bg-gradient-to-r from-transparent via-pink-400 to-transparent sm:mb-6">
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(20,0,30,0.98)] px-2 text-2xl sm:px-3 sm:text-3xl"
                style={{ animation: "heart-beat 1.5s ease-in-out infinite" }}
              >
                <span
                  className="inline-block"
                  style={{ filter: "drop-shadow(0 0 12px #ff69b4) drop-shadow(0 0 20px #ff1493)" }}
                >
                  ❤
                </span>
              </div>
            </div>

            <div
              className="mb-5 text-base leading-[1.9] tracking-[0.08em] text-pink-50/95 sm:mb-6 sm:text-lg sm:leading-[2.2] md:text-xl md:leading-[2.4]"
              style={{ fontFamily: "serif", textShadow: "0 0 8px rgba(255,105,180,0.3)" }}
            >
              遇见你，是我这辈子
              <br />
              最美好的事情之一。
              <br />
              你的笑容，是我每天
              <br />
              最期待的风景。
            </div>
          </div>

          <div
            className={`transition-all delay-700 duration-1000 ${confessionVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <div className="relative mx-auto mb-5 h-px w-full bg-gradient-to-r from-transparent via-pink-400 to-transparent sm:mb-6">
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(20,0,30,0.98)] px-2 text-2xl sm:px-3 sm:text-3xl"
                style={{
                  animation: "heart-beat 1.5s ease-in-out infinite",
                  animationDelay: "0.4s",
                }}
              >
                <span
                  className="inline-block"
                  style={{ filter: "drop-shadow(0 0 12px #ff69b4) drop-shadow(0 0 20px #ff1493)" }}
                >
                  ❤
                </span>
              </div>
            </div>

            <div
              className="mb-5 text-3xl tracking-[0.2em] text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl"
              style={{
                textShadow: "0 0 30px #ff69b4, 0 0 60px #ff1493, 0 0 120px #ff69b4",
                animation:
                  "glow-pulse 2.5s ease-in-out infinite, scale-pulse 4s ease-in-out infinite",
                background: "linear-gradient(45deg, #fff, #ff69b4, #fff)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              我喜欢你 ❤
            </div>

            <div
              className="mb-6 text-base leading-[1.9] tracking-[0.08em] text-pink-50/95 sm:mb-8 sm:text-lg sm:leading-[2.2] md:mb-10 md:text-xl md:leading-[2.4]"
              style={{ fontFamily: "serif", textShadow: "0 0 8px rgba(255,105,180,0.3)" }}
            >
              喜欢你说话的样子，
              <br />
              喜欢你认真的眼神，
              <br />
              喜欢每一个
              <span
                className="font-bold text-pink-400"
                style={{
                  textShadow: "0 0 18px #ff69b4, 0 0 35px #ff1493",
                  filter: "drop-shadow(0 0 5px rgba(255,105,180,0.8))",
                }}
              >
                有你在
              </span>
              的瞬间。
              <br />
              愿意陪你走过以后的每一天。
            </div>

            <LoveButton onClick={triggerBigFireworks} />
          </div>
        </div>
      </div>

      {/* CSS动画 */}
      <style jsx>{`
        @keyframes float-card {
          0%,
          100% {
            transform: translateY(0px) rotateX(0.5deg) rotateY(0.5deg);
          }
          25% {
            transform: translateY(-12px) rotateX(-0.5deg) rotateY(1deg);
          }
          50% {
            transform: translateY(-18px) rotateX(0deg) rotateY(0deg);
          }
          75% {
            transform: translateY(-12px) rotateX(0.5deg) rotateY(-1deg);
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            text-shadow:
              0 0 30px #ff69b4,
              0 0 60px #ff1493,
              0 0 120px #ff69b4;
          }
          50% {
            text-shadow:
              0 0 40px #ff69b4,
              0 0 80px #ff1493,
              0 0 160px #ff69b4,
              0 0 240px #ff1493;
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes scale-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @keyframes heart-beat {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          20% {
            transform: translate(-50%, -50%) scale(1.25);
          }
          40% {
            transform: translate(-50%, -50%) scale(1);
          }
          60% {
            transform: translate(-50%, -50%) scale(1.2);
          }
          80% {
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes petal-fall {
          0% {
            transform: translateY(-30px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(2);
          }
        }

        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }

        .animate-petal-fall {
          animation: petal-fall linear infinite;
        }
      `}</style>
    </div>
  )
}
