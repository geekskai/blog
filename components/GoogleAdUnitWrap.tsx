"use client"

import { useEffect, useRef, useState } from "react"

export default function GoogleAdUnitWrap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const adElement = containerRef.current?.querySelector("ins.adsbygoogle")
    if (!adElement) return

    const status = adElement.getAttribute("data-adsbygoogle-status")
    if (status === "done") return

    try {
      type AdsByGoogle = Array<Record<string, unknown>>
      const adsWindow = window as Window & { adsbygoogle?: AdsByGoogle }
      adsWindow.adsbygoogle = adsWindow.adsbygoogle || []
      adsWindow.adsbygoogle.push({})
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("AdSense render skipped:", error)
      }
    }
  }, [isMounted])

  return (
    <div className="flex min-h-[90px] w-full justify-center py-1" ref={containerRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2108246014001009"
        data-ad-slot="5811688701"
        data-ad-format="auto"
      ></ins>
    </div>
  )
}
