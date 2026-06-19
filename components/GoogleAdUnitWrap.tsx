"use client"

import React, { useEffect, useRef, useState } from "react"

const ADS_CLIENT = "ca-pub-2108246014001009"
const ADS_SLOT = "5811688701"
const ADS_SCRIPT_ID = "adsbygoogle-script"
const ADS_SCRIPT_BASE_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
const ADS_SCRIPT_SRC = `${ADS_SCRIPT_BASE_SRC}?client=${ADS_CLIENT}`
const AD_WRAPPER_CLASS = "my-6 flex w-full justify-center overflow-x-clip px-0 sm:px-2 md:my-8"
const AD_SLOT_CLASS =
  "block h-[280px] w-full min-w-0 max-w-[336px] overflow-hidden sm:h-[60px] sm:max-w-[468px] md:h-[90px] md:max-w-[728px] xl:max-w-[970px]"
const AD_INS_CLASS = "adsbygoogle block h-full w-full"

type AdsWindow = Window & {
  adsbygoogle?: Array<Record<string, unknown>>
}

export default function GoogleAdUnitWrap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const adRef = useRef<HTMLModElement>(null)
  const hasInitializedRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "250px 0px" }
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let isCancelled = false
    let idleHandle: number | undefined

    const ensureAdSenseScript = async () => {
      const existingScript =
        document.getElementById(ADS_SCRIPT_ID) ||
        document.querySelector<HTMLScriptElement>(`script[src^="${ADS_SCRIPT_BASE_SRC}"]`)
      if (existingScript) return

      const script = document.createElement("script")
      script.id = ADS_SCRIPT_ID
      script.async = true
      script.src = ADS_SCRIPT_SRC
      script.crossOrigin = "anonymous"
      document.head.appendChild(script)

      await new Promise<void>((resolve) => {
        script.addEventListener("load", () => resolve(), { once: true })
        script.addEventListener("error", () => resolve(), { once: true })
      })
    }

    const initAd = async () => {
      if (hasInitializedRef.current) return
      await ensureAdSenseScript()
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
      if (isCancelled || !adRef.current) return
      if (adRef.current.getAttribute("data-adsbygoogle-status") === "done") return
      if (adRef.current.getBoundingClientRect().width === 0) return

      try {
        const adsWindow = window as AdsWindow
        adsWindow.adsbygoogle = adsWindow.adsbygoogle || []
        adsWindow.adsbygoogle.push({})
        hasInitializedRef.current = true
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("AdSense render skipped:", error)
        }
      }
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(() => void initAd(), { timeout: 2000 })
    } else {
      idleHandle = window.setTimeout(() => void initAd(), 250)
    }

    return () => {
      isCancelled = true
      if (idleHandle === undefined) return

      if (idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle)
      } else {
        window.clearTimeout(idleHandle)
      }
    }
  }, [isVisible])

  return (
    <div ref={containerRef} className={AD_WRAPPER_CLASS} aria-label="Advertisement">
      <div className={AD_SLOT_CLASS}>
        {isVisible ? (
          <ins
            ref={adRef}
            className={AD_INS_CLASS}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
            }}
            data-ad-client={ADS_CLIENT}
            data-ad-slot={ADS_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className={AD_SLOT_CLASS} aria-hidden="true" />
        )}
      </div>
    </div>
  )
}
