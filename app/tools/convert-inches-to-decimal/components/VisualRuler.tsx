"use client"

import { useMemo } from "react"
import type { ConversionResult } from "../types"
import { generateRulerMarks } from "../utils/converter"

interface VisualRulerProps {
  result?: ConversionResult | null
  maxValue?: number
  className?: string
}

export default function VisualRuler({ result, maxValue = 6, className = "" }: VisualRulerProps) {
  // Generate ruler marks
  const rulerMarks = useMemo(() => {
    return generateRulerMarks(maxValue, 0.0625) // 1/16 inch increments
  }, [maxValue])

  // Calculate highlight position for current result
  const highlightPosition = result ? Math.min(result.decimal, maxValue) : null

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-6 backdrop-blur-sm ${className}`}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-xl">📏</span>
          <h3 className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-lg font-bold text-transparent">
            Visual Ruler
          </h3>
        </div>
      </div>

      {/* Ruler Container */}
      <div className="relative">
        {/* Main ruler line */}
        <div className="relative h-16 overflow-x-auto">
          <svg
            width="100%"
            height="64"
            viewBox={`0 0 ${maxValue * 100} 64`}
            className="min-w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background ruler line */}
            <line
              x1="0"
              y1="48"
              x2={maxValue * 100}
              y2="48"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="2"
            />

            {/* Ruler marks */}
            {rulerMarks.map((mark, index) => {
              const x = mark.position * 100
              let height: number
              let strokeWidth: number
              let opacity: number

              switch (mark.size) {
                case "major":
                  height = 24
                  strokeWidth = 2
                  opacity = 1
                  break
                case "minor":
                  height = 16
                  strokeWidth = 1.5
                  opacity = 0.8
                  break
                case "tiny":
                  height = 8
                  strokeWidth = 1
                  opacity = 0.6
                  break
              }

              return (
                <g key={index}>
                  {/* Tick mark */}
                  <line
                    x1={x}
                    y1={48 - height / 2}
                    x2={x}
                    y2={48 + height / 2}
                    stroke="rgba(59, 130, 246, 0.8)"
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                  />

                  {/* Labels for major marks */}
                  {mark.size === "major" && (
                    <>
                      {/* Fraction label (top) */}
                      <text
                        x={x}
                        y="20"
                        textAnchor="middle"
                        fill="rgba(148, 163, 184, 0.9)"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {mark.fraction}
                      </text>

                      {/* Decimal label (bottom) */}
                      <text
                        x={x}
                        y="60"
                        textAnchor="middle"
                        fill="rgba(148, 163, 184, 0.7)"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        {mark.decimal.toFixed(2)}
                      </text>
                    </>
                  )}
                </g>
              )
            })}

            {/* Highlight current measurement */}
            {highlightPosition !== null && (
              <g>
                {/* Highlight line */}
                <line
                  x1={highlightPosition * 100}
                  y1="0"
                  x2={highlightPosition * 100}
                  y2="64"
                  stroke="rgba(34, 197, 94, 0.8)"
                  strokeWidth="3"
                  strokeDasharray="4,2"
                />

                {/* Highlight circle */}
                <circle
                  cx={highlightPosition * 100}
                  cy="48"
                  r="4"
                  fill="rgba(34, 197, 94, 1)"
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Current measurement display */}
        {result && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-sm">
              <span className="text-green-300">📍</span>
              <span className="font-medium text-white">
                Your measurement: {result.input} = {result.formatted}"
              </span>
            </div>
          </div>
        )}

        {/* Scale indicators */}
        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <span>0"</span>
          <span>{Math.floor(maxValue / 2)}"</span>
          <span>{maxValue}"</span>
        </div>
      </div>

      {/* Ruler legend */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="h-6 w-0.5 bg-blue-400"></div>
          <span>Whole inches</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="h-4 w-0.5 bg-blue-400 opacity-80"></div>
          <span>Quarter/Half inches</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="h-2 w-0.5 bg-blue-400 opacity-60"></div>
          <span>Smaller fractions</span>
        </div>
      </div>

      {/* Interactive measurement guide */}
      <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
        <h4 className="mb-2 text-sm font-semibold text-blue-300">How to read the ruler:</h4>
        <ul className="space-y-1 text-xs text-slate-300">
          <li>• Tall marks = whole inches and major fractions (1/2, 1/4, 3/4)</li>
          <li>• Medium marks = eighth inches (1/8, 3/8, 5/8, 7/8)</li>
          <li>• Small marks = sixteenth inches (1/16, 3/16, etc.)</li>
          <li>• Green line shows your current measurement</li>
        </ul>
      </div>
    </div>
  )
}

// Simplified ruler for mobile/compact view
export function CompactRuler({
  result,
  className = "",
}: {
  result?: ConversionResult | null
  className?: string
}) {
  const maxValue = 3 // Smaller range for mobile

  return (
    <div
      className={`rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>0"</span>
        <span>1"</span>
        <span>2"</span>
        <span>3"</span>
      </div>

      <div className="relative mt-2 h-8">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-blue-500/50"></div>

        {/* Major marks */}
        {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((pos) => (
          <div
            key={pos}
            className="absolute top-0 h-8 w-0.5 bg-blue-400"
            style={{ left: `${(pos / maxValue) * 100}%` }}
          ></div>
        ))}

        {/* Current position */}
        {result && result.decimal <= maxValue && (
          <div
            className="absolute top-0 h-8 w-1 rounded-full bg-green-400"
            style={{ left: `${(result.decimal / maxValue) * 100}%` }}
          ></div>
        )}
      </div>

      {result && (
        <div className="mt-2 text-center text-xs text-green-300">
          {result.input} = {result.formatted}"
        </div>
      )}
    </div>
  )
}
