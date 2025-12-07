"use client"

import React, { useState, useEffect } from "react"
import { Palette } from "lucide-react"

interface ColorInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, label }) => {
  const [color, setColor] = useState(value)

  useEffect(() => {
    setColor(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    onChange(newColor)
  }

  // Convert hex to RGB for better display
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const rgb = hexToRgb(color)
  const isLight = rgb ? rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186 : false

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className="group relative">
        <div
          className="relative h-12 w-full cursor-pointer overflow-hidden rounded-xl border-2 border-white/20 transition-all hover:scale-[1.02] hover:border-white/40"
          style={{ backgroundColor: color }}
        >
          <input
            type="color"
            value={color}
            onChange={handleChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label || "Color picker"}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-2 backdrop-blur-sm transition-all ${
                isLight ? "bg-black/20 text-black" : "bg-white/20 text-white"
              }`}
            >
              <Palette className="h-4 w-4" />
              <span className="font-mono text-sm font-semibold">{color.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
