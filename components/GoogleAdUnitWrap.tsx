"use client"

import { useEffect, useRef, useState } from "react"

export default function GoogleAdUnitWrap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const retryCountRef = useRef(0)
  const maxRetries = 10 // 最多重试10次，避免无限循环

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 检测是否为移动设备
  const isMobile = () => {
    if (typeof window === "undefined") return false
    return window.innerWidth < 768 // Tailwind md breakpoint
  }

  // 使用 Intersection Observer 确保容器可见后再初始化广告
  useEffect(() => {
    if (!isMounted || !containerRef.current) return

    // 移动端使用更小的rootMargin，避免过早触发
    const rootMargin = isMobile() ? "20px" : "50px"

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.1, // 至少10%可见
        rootMargin, // 移动端提前20px，桌面端提前50px
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isMounted])

  // 初始化广告 - 确保容器可见且有有效宽度（响应式支持）
  useEffect(() => {
    if (!isMounted || !isVisible) return

    const initAd = () => {
      const container = containerRef.current
      if (!container) return

      // 检查容器是否有有效宽度（支持响应式布局）
      const rect = container.getBoundingClientRect()
      // 移动端最小宽度：320px（标准移动设备宽度）
      // 桌面端最小宽度：300px（AdSense推荐的最小宽度）
      const minWidth = isMobile() ? 280 : 300

      if (rect.width < minWidth) {
        // 如果宽度不足，延迟重试（但限制重试次数）
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++
          setTimeout(initAd, 100)
          return
        } else {
          // 超过重试次数，停止尝试
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `AdSense initialization failed: container width ${rect.width}px is too small (minimum: ${minWidth}px)`
            )
          }
          return
        }
      }

      const adElement = container.querySelector("ins.adsbygoogle")
      if (!adElement) return

      const status = adElement.getAttribute("data-adsbygoogle-status")
      if (status === "done") return

      try {
        type AdsByGoogle = Array<Record<string, unknown>>
        const adsWindow = window as Window & { adsbygoogle?: AdsByGoogle }
        if (!adsWindow.adsbygoogle) {
          adsWindow.adsbygoogle = []
        }
        adsWindow.adsbygoogle.push({})
        retryCountRef.current = 0 // 成功后重置重试计数
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("AdSense render skipped:", error)
        }
      }
    }

    // 移动端需要稍长的延迟，确保布局稳定
    const delay = isMobile() ? 150 : 100
    const timer = setTimeout(initAd, delay)
    return () => clearTimeout(timer)
  }, [isMounted, isVisible])

  // 监听窗口大小变化，确保响应式布局时广告能正确显示
  useEffect(() => {
    if (!isMounted || !containerRef.current) return

    const handleResize = () => {
      const container = containerRef.current
      if (!container) return

      const adElement = container.querySelector("ins.adsbygoogle")
      if (!adElement) return

      const status = adElement.getAttribute("data-adsbygoogle-status")
      const rect = container.getBoundingClientRect()
      const minWidth = isMobile() ? 280 : 300

      // 如果广告已加载但容器宽度变化，AdSense会自动调整
      // 这里主要是确保容器始终有有效宽度
      if (status === "done" && rect.width < minWidth) {
        // 如果容器变得太小，AdSense会自动处理
        // 我们只需要确保容器本身是响应式的
      }
    }

    // 使用防抖优化resize事件
    let resizeTimer: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 150)
    }

    window.addEventListener("resize", debouncedResize, { passive: true })
    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(resizeTimer)
    }
  }, [isMounted])

  return (
    <div
      className="flex h-full w-full justify-center px-1 py-1"
      ref={containerRef}
      style={{
        minWidth: "280px", // 移动端最小宽度
        maxWidth: "100%", // 确保不溢出
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
        }}
        data-ad-client="ca-pub-2108246014001009"
        data-ad-slot="5811688701"
        data-ad-format="auto"
        data-full-width-responsive="true" // 启用全宽响应式模式
      ></ins>
    </div>
  )
}
