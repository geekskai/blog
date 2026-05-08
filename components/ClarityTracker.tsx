"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

declare global {
  interface Window {
    __clarityInitialized?: boolean
  }
}

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wnnk525mvy"

export default function ClarityTracker() {
  useEffect(() => {
    if (!clarityProjectId || window.__clarityInitialized) {
      return
    }

    Clarity.init(clarityProjectId)
    window.__clarityInitialized = true
  }, [])

  return null
}
