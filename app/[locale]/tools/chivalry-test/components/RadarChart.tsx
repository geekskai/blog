"use client"

import React from "react"
import type { TraitType } from "../constants"

interface RadarChartProps {
  scores: Record<TraitType, number>
  className?: string
}

const traitLabels: Record<TraitType, string> = {
  courtesy: "Courtesy",
  respect: "Respect",
  integrity: "Integrity",
  courage: "Courage",
  loyalty: "Loyalty",
}

// Ensure all traits are present
const allTraits: TraitType[] = ["courtesy", "respect", "integrity", "courage", "loyalty"]

const traitColors: Record<TraitType, string> = {
  courtesy: "text-blue-500",
  respect: "text-purple-500",
  integrity: "text-emerald-500",
  courage: "text-orange-500",
  loyalty: "text-pink-500",
}

export default function RadarChart({ scores, className = "" }: RadarChartProps) {
  const size = 200
  const center = size / 2
  const radius = 80
  const numTraits = 5
  const angleStep = (2 * Math.PI) / numTraits

  // Convert scores to coordinates
  const getPoint = (traitIndex: number, score: number) => {
    const angle = traitIndex * angleStep - Math.PI / 2 // Start from top
    const distance = (radius * score) / 100
    const x = center + distance * Math.cos(angle)
    const y = center + distance * Math.sin(angle)
    return { x, y }
  }

  // Create polygon points
  const points = allTraits
    .map((trait, index) => {
      const point = getPoint(index, scores[trait])
      return `${point.x},${point.y}`
    })
    .join(" ")

  // Create grid circles
  const gridLevels = [25, 50, 75, 100]

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(radius * level) / 100}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-700"
            opacity={0.3}
          />
        ))}

        {/* Grid lines */}
        {allTraits.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2
          const x2 = center + radius * Math.cos(angle)
          const y2 = center + radius * Math.sin(angle)
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-700"
              opacity={0.3}
            />
          )
        })}

        {/* Score polygon */}
        <polygon
          points={points}
          fill="url(#gradient)"
          fillOpacity={0.3}
          stroke="url(#gradient)"
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Trait labels */}
        {allTraits.map((trait, index) => {
          const angle = index * angleStep - Math.PI / 2
          const labelRadius = radius + 25
          const x = center + labelRadius * Math.cos(angle)
          const y = center + labelRadius * Math.sin(angle)

          return (
            <g key={trait}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-xs font-semibold ${traitColors[trait]}`}
              >
                {traitLabels[trait]}
              </text>
              <text
                x={x}
                y={y + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold text-slate-400"
              >
                {scores[trait]}%
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
