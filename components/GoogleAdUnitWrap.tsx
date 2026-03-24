"use client"

import React, { useEffect, useRef } from "react"

const ADS_CLIENT = "ca-pub-2108246014001009"
const ADS_SLOT = "5811688701"
const ADS_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`

export default function GoogleAdUnitWrap() {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    let isCancelled = false

    const ensureAdSenseScript = async () => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${ADS_SCRIPT_SRC}"]`
      )
      if (existingScript) return

      const script = document.createElement("script")
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
      await ensureAdSenseScript()
      if (isCancelled || !adRef.current) return
      if (adRef.current.getAttribute("data-adsbygoogle-status") === "done") return

      try {
        const adsWindow = window as Window & {
          adsbygoogle?: Array<Record<string, unknown>>
        }
        adsWindow.adsbygoogle = adsWindow.adsbygoogle || []
        adsWindow.adsbygoogle.push({})
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("AdSense render skipped:", error)
        }
      }
    }

    const timer = setTimeout(() => {
      void initAd()
    }, 80)

    return () => {
      isCancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex w-full justify-center overflow-x-auto py-2 md:py-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "inline-block",
          width: "728px",
          height: "90px",
        }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={ADS_SLOT}
      />
    </div>
  )
}
