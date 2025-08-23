"use client"

import React, { useState } from "react"

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export default function Tooltip({
  content,
  children,
  position = "left",
  delay = 500,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2"
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2"
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-3"
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-3"
      default:
        return "right-full top-1/2 -translate-y-1/2 mr-3"
    }
  }

  const getArrowClasses = () => {
    switch (position) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800"
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800"
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800"
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800"
      default:
        return "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800"
    }
  }

  return (
    <div className="relative" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}

      {isVisible && (
        <div
          className={`absolute z-50 ${getPositionClasses()} animate-in fade-in-0 zoom-in-95 duration-200`}
        >
          <div className="rounded-lg border border-slate-700/50 bg-slate-800 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-sm">
            {content}
          </div>
          <div className={`absolute h-0 w-0 border-4 ${getArrowClasses()}`} />
        </div>
      )}
    </div>
  )
}
