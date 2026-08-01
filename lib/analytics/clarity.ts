"use client"

import Clarity from "@microsoft/clarity"

export function trackClarityEvent(eventName: string) {
  if (typeof window !== "undefined" && window.__clarityInitialized) {
    Clarity.event(eventName)
  }
}
