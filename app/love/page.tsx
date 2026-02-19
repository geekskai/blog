"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"

// 懒加载非关键组件
const LoveButton = dynamic(() => import("./components/LoveButton"), { ssr: false })
const FloatingHearts = dynamic(() => import("./components/FloatingHearts"), { ssr: false })
const LoveQuotes = dynamic(() => import("./components/LoveQuotes"), { ssr: false })
const MusicPlayer = dynamic(() => import("./components/MusicPlayer"), { ssr: false })
const SecretMessage = dynamic(() => import("./components/SecretMessage"), { ssr: false })

// ===== 移动端检测 =====
const isMobile = () => {
  if (typeof window === "undefined") return false
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  )
}

// ===== 移动端优先配置 =====
const getMobileConfig = () => {
  const mobile = isMobile()
  return {
    // 移动端粒子数量减少70%
    FIREWORK_PARTICLES: mobile ? 40 : 100,
    FIREWORK_EXTRA_PARTICLES: mobile ? 20 : 50,
    BG_PARTICLES: mobile ? 30 : 60,
    STARS_COUNT: mobile ? 40 : 80,
    CLICK_HEARTS: mobile ? 2 : 3,
    MAX_CLICK_HEARTS: mobile ? 3 : 5,

    // 移动端频率降低50%
    FIREWORK_INTERVAL: mobile ? 150 : 90,
    PETAL_INTERVAL: mobile ? 1500 : 800,

    // 移动端简化渲染
    TRAIL_LENGTH: mobile ? 3 : 6,
    ROCKET_TRAIL: mobile ? 5 : 10,
    CONNECTION_DISTANCE: mobile ? 80 : 100,
    MAX_CONNECTIONS: mobile ? 2 : 3,

    // 移动端特效开关
    ENABLE_SHADOWS: !mobile, // 移动端禁用阴影
    ENABLE_BLUR: !mobile, // 移动端禁用模糊
    ENABLE_3D_TILT: !mobile, // 移动端禁用3D倾斜
    ENABLE_BG_PARTICLES: !mobile, // 移动端禁用背景粒子
  }
}

// ===== 类型定义 =====
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  trail: Array<{ x: number; y: number }>
}

interface Rocket {
  x: number
  y: number
  targetY: number
  vy: number
  color: string
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
  connections: number
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
}

const COLORS = ["#ff69b4", "#ff1493", "#ff6eb4", "#ffb6c1", "#ffd700", "#00ced1"]
const PETAL_SYMBOLS = ["🌸", "💕", "✨", "💖", "💗", "🌹"]

// 简化的节流函数
const throttle = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let lastCall = 0
  return ((...args: any[]) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }) as T
}

export default function LovePage() {
  const config = useMemo(() => getMobileConfig(), [])
  const fwCanvasRef = useRef<HTMLCanvasElement>(null)
  const pCanvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const [cardVisible, setCardVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [confessionVisible, setConfessionVisible] = useState(false)

  const particlesRef = useRef<Particle[]>([])
  const rocketsRef = useRef<Rocket[]>([])
  const bgParticlesRef = useRef<BgParticle[]>([])
  const clickHeartsRef = useRef<ClickHeart[]>([])
  const frameCountRef = useRef(0)

  // ===== 创建粒子 =====
  const createParticle = useCallback(
    (x: number, y: number, color: string, angle: number, speed: number): Particle => ({
      x,
      y,
      color,
      alpha: 1,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 2 + 1,
      trail: [],
    }),
    []
  )

  // ===== 创建火箭 =====
  const createRocket = useCallback(
    (canvas: HTMLCanvasElement): Rocket => ({
      x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
      y: canvas.height + 10,
      targetY: Math.random() * canvas.height * 0.5 + 50,
      vy: -18 - Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      trail: [],
      exploded: false,
    }),
    []
  )

  // ===== 火箭爆炸 =====
  const explodeRocket = useCallback(
    (rocket: Rocket) => {
      const count =
        config.FIREWORK_PARTICLES + Math.floor(Math.random() * config.FIREWORK_EXTRA_PARTICLES)
      const c1 = COLORS[Math.floor(Math.random() * COLORS.length)]
      const c2 = COLORS[Math.floor(Math.random() * COLORS.length)]

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = Math.random() * 6 + 2
        particlesRef.current.push(
          createParticle(rocket.x, rocket.y, Math.random() > 0.5 ? c1 : c2, angle, speed)
        )
      }
    },
    [config.FIREWORK_PARTICLES, config.FIREWORK_EXTRA_PARTICLES, createParticle]
  )

  // ===== 发射火箭 =====
  const launchRocket = useCallback(() => {
    const canvas = fwCanvasRef.current
    if (!canvas) return
    rocketsRef.current.push(createRocket(canvas))
  }, [createRocket])

  // ===== 触发烟花 =====
  const triggerFireworks = useCallback(() => {
    const count = isMobile() ? 4 : 8
    for (let i = 0; i < count; i++) {
      setTimeout(() => launchRocket(), i * 200)
    }
  }, [launchRocket])

  // ===== 烟花动画循环 =====
  useEffect(() => {
    const canvas = fwCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    let animationId: number
    let lastTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const deltaTime = now - lastTime

      if (deltaTime < 16) {
        animationId = requestAnimationFrame(animate)
        return
      }
      lastTime = now

      ctx.fillStyle = "rgba(0,0,0,0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      frameCountRef.current++
      if (frameCountRef.current % config.FIREWORK_INTERVAL === 0) {
        launchRocket()
      }

      // 更新火箭
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const rocket = rocketsRef.current[i]
        rocket.trail.push({ x: rocket.x, y: rocket.y })
        if (rocket.trail.length > config.ROCKET_TRAIL) rocket.trail.shift()

        rocket.vy += 0.3
        rocket.y += rocket.vy

        if (rocket.y <= rocket.targetY && !rocket.exploded) {
          rocket.exploded = true
          explodeRocket(rocket)
          rocketsRef.current.splice(i, 1)
          continue
        }

        if (!rocket.exploded) {
          ctx.save()
          ctx.strokeStyle = rocket.color
          ctx.lineWidth = 2
          ctx.globalAlpha = 0.6
          if (rocket.trail.length > 1) {
            ctx.beginPath()
            ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y)
            for (let j = 1; j < rocket.trail.length; j += 2) {
              ctx.lineTo(rocket.trail[j].x, rocket.trail[j].y)
            }
            ctx.stroke()
          }
          ctx.restore()
        }
      }

      // 更新粒子
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]

        if (p.trail.length < config.TRAIL_LENGTH) {
          p.trail.push({ x: p.x, y: p.y })
        } else {
          p.trail.shift()
          p.trail.push({ x: p.x, y: p.y })
        }

        p.vx *= 0.98
        p.vy += 0.12
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.02

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [config, launchRocket, explodeRocket])

  // ===== 背景粒子（仅PC）=====
  useEffect(() => {
    if (!config.ENABLE_BG_PARTICLES) return

    const canvas = pCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < config.BG_PARTICLES; i++) {
      bgParticlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: `hsl(${310 + Math.random() * 80},100%,${60 + Math.random() * 30}%)`,
        alpha: Math.random() * 0.5 + 0.2,
        connections: 0,
      })
    }

    let animationId: number
    let frameSkip = 0

    const animate = () => {
      frameSkip++
      if (frameSkip % 2 !== 0) {
        animationId = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bgParticlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        p.connections = 0

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // 简化连线逻辑
      for (let i = 0; i < bgParticlesRef.current.length; i++) {
        const p1 = bgParticlesRef.current[i]
        if (p1.connections >= config.MAX_CONNECTIONS) continue

        for (let j = i + 1; j < bgParticlesRef.current.length; j++) {
          const p2 = bgParticlesRef.current[j]
          if (p2.connections >= config.MAX_CONNECTIONS) continue

          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < config.CONNECTION_DISTANCE) {
            ctx.globalAlpha = (1 - dist / config.CONNECTION_DISTANCE) * 0.15
            ctx.strokeStyle = "#ff69b4"
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            p1.connections++
            p2.connections++
            if (p1.connections >= config.MAX_CONNECTIONS) break
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [config])

  // ===== 星星效果 =====
  useEffect(() => {
    const stars: HTMLDivElement[] = []
    for (let i = 0; i < config.STARS_COUNT; i++) {
      const star = document.createElement("div")
      star.className = "fixed rounded-full bg-white pointer-events-none"
      const size = Math.random() * 2 + 0.8
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 3}s infinite;
        z-index: 0;
        opacity: 0;
      `
      document.body.appendChild(star)
      stars.push(star)
    }

    return () => stars.forEach((star) => star.remove())
  }, [config.STARS_COUNT])

  // ===== 浮动花瓣（优化）=====
  useEffect(() => {
    const petals: HTMLDivElement[] = []
    const maxPetals = isMobile() ? 8 : 15

    const createPetal = () => {
      if (petals.length >= maxPetals) {
        const oldest = petals.shift()
        oldest?.remove()
      }

      const petal = document.createElement("div")
      petal.className = "fixed pointer-events-none"
      petal.textContent = PETAL_SYMBOLS[Math.floor(Math.random() * PETAL_SYMBOLS.length)]
      petal.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -20px;
        font-size: ${Math.random() * 0.8 + 0.7}em;
        animation: petal-fall ${Math.random() * 8 + 6}s linear forwards;
        z-index: 5;
        opacity: 0.8;
      `
      document.body.appendChild(petal)
      petals.push(petal)

      setTimeout(() => {
        const index = petals.indexOf(petal)
        if (index > -1) petals.splice(index, 1)
        petal.remove()
      }, 14000)
    }

    const interval = setInterval(createPetal, config.PETAL_INTERVAL)
    return () => {
      clearInterval(interval)
      petals.forEach((petal) => petal.remove())
    }
  }, [config.PETAL_INTERVAL])

  // ===== 点击爱心特效 =====
  useEffect(() => {
    const maxHearts = isMobile() ? 20 : 30

    const handleClick = (e: MouseEvent) => {
      if (clickHeartsRef.current.length >= maxHearts) return

      const count =
        config.CLICK_HEARTS +
        Math.floor(Math.random() * (config.MAX_CLICK_HEARTS - config.CLICK_HEARTS))

      for (let i = 0; i < count; i++) {
        clickHeartsRef.current.push({
          id: Date.now() + i + Math.random(),
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 4 - 2,
          life: 0,
          maxLife: 60,
          scale: Math.random() * 0.5 + 0.5,
        })
      }
    }

    document.addEventListener("click", handleClick, { passive: true })
    return () => document.removeEventListener("click", handleClick)
  }, [config])

  // ===== 点击爱心动画 =====
  useEffect(() => {
    let animationId: number
    let frameSkip = 0

    const animate = () => {
      frameSkip++
      if (frameSkip % 2 !== 0) {
        animationId = requestAnimationFrame(animate)
        return
      }

      clickHeartsRef.current = clickHeartsRef.current.filter((heart) => {
        heart.life++
        heart.y += heart.vy
        heart.x += heart.vx
        heart.vy += 0.15
        return heart.life < heart.maxLife
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])

  // ===== 3D倾斜（仅PC）=====
  useEffect(() => {
    if (!config.ENABLE_3D_TILT) return

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!cardRef.current) return
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const rx = ((e.clientY - cy) / cy) * -5
      const ry = ((e.clientX - cx) / cx) * 5
      cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }, 32)

    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [config.ENABLE_3D_TILT])

  // ===== 显示动画 =====
  useEffect(() => {
    const timer1 = setTimeout(() => setCardVisible(true), 300)
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

  // 渲染点击爱心
  const clickHearts = clickHeartsRef.current.map((heart) => {
    const progress = heart.life / heart.maxLife
    return (
      <div
        key={heart.id}
        className="pointer-events-none fixed z-[100] text-3xl"
        style={{
          left: heart.x,
          top: heart.y,
          opacity: 1 - progress,
          transform: `translate(-50%, -50%) scale(${heart.scale * (1 + progress * 0.5)})`,
        }}
      >
        💖
      </div>
    )
  })

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* 点击爱心 */}
      {clickHearts}

      {/* Canvas */}
      {config.ENABLE_BG_PARTICLES && (
        <canvas ref={pCanvasRef} className="fixed left-0 top-0 z-[1]" />
      )}
      <canvas ref={fwCanvasRef} className="fixed left-0 top-0 z-[2]" />

      {/* 组件 */}
      <FloatingHearts />
      <LoveQuotes />
      <MusicPlayer />
      <SecretMessage />

      {/* 主卡片 */}
      <div
        className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto p-4"
        style={{ perspective: "1500px" }}
      >
        <div
          ref={cardRef}
          className={`relative my-auto w-full max-w-[95vw] rounded-3xl border-2 border-pink-400/50 p-6 text-center backdrop-blur-lg transition-all duration-1000 sm:max-w-[700px] sm:p-10 md:p-14 ${
            cardVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(135deg, rgba(20,0,30,0.92), rgba(60,0,50,0.92), rgba(40,0,60,0.92))",
            boxShadow: config.ENABLE_SHADOWS ? "0 0 80px rgba(255,20,147,0.3)" : "none",
          }}
        >
          {/* 装饰球（仅PC）*/}
          {config.ENABLE_BLUR && (
            <>
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl" />
            </>
          )}

          {/* 角落装饰 */}
          <div className="absolute left-2 top-2 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-pink-400/80 sm:left-4 sm:top-4 sm:h-12 sm:w-12" />
          <div className="absolute right-2 top-2 h-8 w-8 rounded-tr-xl border-r-2 border-t-2 border-pink-400/80 sm:right-4 sm:top-4 sm:h-12 sm:w-12" />
          <div className="absolute bottom-2 left-2 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-pink-400/80 sm:bottom-4 sm:left-4 sm:h-12 sm:w-12" />
          <div className="absolute bottom-2 right-2 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-pink-400/80 sm:bottom-4 sm:right-4 sm:h-12 sm:w-12" />

          {/* 内容 */}
          <div
            className={`transition-all duration-1000 ${textVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <h1
              className="mb-3 text-4xl font-bold leading-tight tracking-[0.15em] text-white sm:mb-4 sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                textShadow: config.ENABLE_SHADOWS ? "0 0 25px #ff69b4, 0 0 50px #ff1493" : "none",
              }}
            >
              陈成连
            </h1>

            <p className="mb-6 text-base tracking-[0.3em] text-pink-200/85 sm:mb-8 sm:text-lg md:mb-10 md:text-xl">
              — 致那个让我心动的你 —
            </p>
          </div>

          <div
            className={`transition-all delay-300 duration-1000 ${textVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <div className="relative mx-auto mb-5 h-px w-full bg-gradient-to-r from-transparent via-pink-400 to-transparent sm:mb-6">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(20,0,30,0.95)] px-2 text-2xl sm:px-3">
                ❤
              </div>
            </div>

            <div className="mb-5 text-base leading-[1.9] tracking-[0.08em] text-pink-50/90 sm:mb-6 sm:text-lg sm:leading-[2.2] md:text-xl">
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
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(20,0,30,0.95)] px-2 text-2xl sm:px-3">
                ❤
              </div>
            </div>

            <div
              className="mb-5 text-3xl tracking-[0.2em] text-white sm:mb-6 sm:text-4xl md:text-5xl"
              style={{
                textShadow: config.ENABLE_SHADOWS ? "0 0 25px #ff69b4, 0 0 50px #ff1493" : "none",
              }}
            >
              我喜欢你 ❤
            </div>

            <div className="mb-6 text-base leading-[1.9] tracking-[0.08em] text-pink-50/90 sm:mb-8 sm:text-lg sm:leading-[2.2] md:text-xl">
              喜欢你说话的样子，
              <br />
              喜欢你认真的眼神，
              <br />
              喜欢每一个<span className="font-bold text-pink-400">有你在</span>的瞬间。
              <br />
              愿意陪你走过以后的每一天。
            </div>

            <LoveButton onClick={triggerFireworks} />
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes twinkle {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
            @keyframes petal-fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 0; }
              10% { opacity: 0.8; }
              90% { opacity: 0.6; }
              100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
          `,
        }}
      />
    </div>
  )
}
