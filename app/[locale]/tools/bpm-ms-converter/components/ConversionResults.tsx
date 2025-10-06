"use client"

import { useState } from "react"
import { Copy, Check, Music, Timer } from "lucide-react"
import { ConversionResult, ConversionMode, CopyState } from "../types"
import { formatForCopy, copyToClipboard, NOTE_VALUES } from "../utils"

interface ConversionResultsProps {
  result: ConversionResult
  mode: ConversionMode["id"]
}

export default function ConversionResults({ result, mode }: ConversionResultsProps) {
  const [copyState, setCopyState] = useState<CopyState>({ copied: false })

  const isBPMMode = mode === "bpm-to-ms"
  const primaryIcon = isBPMMode ? Timer : Music
  const PrimaryIcon = primaryIcon

  const handleCopyAll = async () => {
    const copyText = formatForCopy(result, mode)
    const success = await copyToClipboard(copyText)

    if (success) {
      setCopyState({ copied: true, copiedItem: "all" })
      setTimeout(() => setCopyState({ copied: false }), 2000)
    }
  }

  const handleCopyValue = async (value: number, unit: string, noteId?: string) => {
    const copyText = `${value} ${unit}`
    const success = await copyToClipboard(copyText)

    if (success) {
      setCopyState({ copied: true, copiedItem: noteId || "primary" })
      setTimeout(() => setCopyState({ copied: false }), 2000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Primary Result */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-xl">
        <div className="text-center">
          {/* Result Header */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <PrimaryIcon className="h-8 w-8 text-white" />
            <h3 className="text-2xl font-bold text-white">
              {isBPMMode ? "Milliseconds per Beat" : "Beats per Minute"}
            </h3>
          </div>

          {/* Primary Value Display */}
          <div className="mb-6">
            <div
              className={`inline-block rounded-2xl border bg-gradient-to-r px-8 py-6 ${
                isBPMMode
                  ? "border-blue-500/30 from-blue-500/10 to-blue-500/5"
                  : "border-purple-500/30 from-purple-500/10 to-purple-500/5"
              }`}
            >
              <span className="text-5xl font-bold text-white">{result.primaryValue}</span>
              <span
                className={`ml-3 text-2xl font-medium ${
                  isBPMMode ? "text-blue-300" : "text-purple-300"
                }`}
              >
                {isBPMMode ? "ms" : "BPM"}
              </span>
            </div>
          </div>

          {/* Copy Primary Button */}
          <button
            onClick={() =>
              handleCopyValue(result.primaryValue, isBPMMode ? "ms" : "BPM", "primary")
            }
            className="rounded-xl border border-slate-600/30 bg-slate-700/50 px-6 py-3 transition-all duration-300 hover:border-slate-500/50 hover:bg-slate-600/50"
          >
            <div className="flex items-center gap-2">
              {copyState.copied && copyState.copiedItem === "primary" ? (
                <>
                  <Check className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 text-slate-300" />
                  <span className="text-slate-300">Copy Result</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Note Values */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Common Note Values</h3>
          <button
            onClick={handleCopyAll}
            className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 px-6 py-3 font-medium text-emerald-300 transition-all duration-300 hover:border-emerald-400/50"
          >
            <div className="flex items-center gap-2">
              {copyState.copied && copyState.copiedItem === "all" ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied All!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy All</span>
                </>
              )}
            </div>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.noteValues.map((noteResult) => {
            const noteConfig = NOTE_VALUES.find((n) => n.id === noteResult.noteId)

            return (
              <div
                key={noteResult.noteId}
                className="group rounded-2xl border border-slate-600/30 bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 transition-all duration-300 hover:border-slate-500/50"
              >
                {/* Note Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{noteConfig?.icon || "♪"}</span>
                    <div>
                      <h4 className="font-bold text-white">{noteResult.name}</h4>
                      <p className="text-xs text-slate-400">{noteResult.description}</p>
                    </div>
                  </div>

                  {/* Copy Note Button */}
                  <button
                    onClick={() =>
                      handleCopyValue(noteResult.value, noteResult.unit, noteResult.noteId)
                    }
                    className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    {copyState.copied && copyState.copiedItem === noteResult.noteId ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-400 hover:text-white" />
                    )}
                  </button>
                </div>

                {/* Note Value */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">{noteResult.value}</span>
                  <span className="ml-2 text-lg font-medium text-slate-300">{noteResult.unit}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
