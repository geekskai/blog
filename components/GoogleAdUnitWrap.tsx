"use client"

import React, { useEffect, useRef } from "react"

const ADS_CLIENT = "ca-pub-2108246014001009"
const ADS_SLOT = "5811688701"
const ADS_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`

type AdsWindow = Window & {
  adsbygoogle?: Array<Record<string, unknown>>
}

export default function GoogleAdUnitWrap() {
  const adRef = useRef<HTMLModElement>(null)
  const hasInitializedRef = useRef(false)

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
      if (hasInitializedRef.current) return
      await ensureAdSenseScript()
      if (isCancelled || !adRef.current) return
      if (adRef.current.getAttribute("data-adsbygoogle-status") === "done") return

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

    void initAd()

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <div className="flex w-full justify-center overflow-x-auto py-2 md:py-4">
      <div className="min-w-[728px]">
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
    </div>
  )
}
