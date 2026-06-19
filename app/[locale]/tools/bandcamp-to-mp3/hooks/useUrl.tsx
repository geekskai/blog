"use client"

import { useEffect, useRef, useState } from "react"

export function useUrl({ setTrackUrl, initialUrl, inspectTrackUrl }) {
  const autoLoadedUrlRef = useRef<string | null>(null)
  const [isPasting, setIsPasting] = useState(false)

  useEffect(() => {
    const incomingUrl = initialUrl?.trim()
    if (!incomingUrl || autoLoadedUrlRef.current === incomingUrl) return

    autoLoadedUrlRef.current = incomingUrl
    setTrackUrl(incomingUrl)
    void inspectTrackUrl(incomingUrl)
  }, [inspectTrackUrl, initialUrl, setTrackUrl])

  return { isPasting, setIsPasting }
}
