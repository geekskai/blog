"use client"

import { trackClarityEvent } from "./clarity"

export type ToolEventName =
  | "tool_started"
  | "tool_succeeded"
  | "tool_failed"
  | "tool_result_copied"
  | "related_tool_clicked"

export interface ToolEventProperties {
  tool_id: string
  action: string
  format?: string
  result_count?: number
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (command: "event", eventName: string, properties: ToolEventProperties) => void
    umami?: {
      track: (eventName: string, properties: ToolEventProperties) => void
    }
  }
}

export function trackToolEvent(eventName: ToolEventName, properties: ToolEventProperties) {
  if (typeof window === "undefined") return

  if (window.gtag) {
    window.gtag("event", eventName, properties)
  } else {
    window.dataLayer?.push({ event: eventName, ...properties })
  }
  window.umami?.track(eventName, properties)
  trackClarityEvent(`${eventName}_${properties.tool_id.replaceAll("-", "_")}`)
}
