"use client"

import React, { useRef } from "react"
import { Shield, Download } from "lucide-react"
import type { ResultLevel, TraitType } from "../constants"

interface ShareCardProps {
  score: number
  resultLevel: ResultLevel
  traitScores: Record<TraitType, number>
  mode: "modern" | "knight" | "hybrid"
}

export default function ShareCard({ score, resultLevel, traitScores, mode }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `chivalry-test-result-${score}.png`
      link.href = url
      link.click()
    } catch (error) {
      console.error("Failed to download image:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl"
      >
        {/* Background decoration */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-white">{resultLevel.title}</h2>
            <div className={`text-5xl font-bold ${resultLevel.color}`}>{score}</div>
            <p className="mt-2 text-sm text-slate-300">{resultLevel.description}</p>
          </div>

          {/* Trait scores */}
          <div className="mb-6 rounded-xl bg-white/5 p-4 backdrop-blur-sm">
            <h3 className="mb-3 text-center text-sm font-semibold text-white">Your Traits</h3>
            <div className="space-y-2">
              {Object.entries(traitScores).map(([trait, score]) => (
                <div key={trait} className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize text-slate-300">{trait}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-bold text-white">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-slate-400">geekskai.com/chivalry-test</p>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="mx-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700"
      >
        <Download className="h-4 w-4" />
        Download Result Card
      </button>
    </div>
  )
}
