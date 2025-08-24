"use client"

import { useState, useCallback, useEffect } from "react"
import { Music, ArrowLeftRight, Clock } from "lucide-react"
import ConversionModeToggle from "./components/ConversionModeToggle"
import ConversionInput from "./components/ConversionInput"
import ConversionResults from "./components/ConversionResults"
import { ConversionState, ConversionMode } from "./types"
import { performConversion } from "./utils"

export default function BPMMSConverter() {
  const [state, setState] = useState<ConversionState>({
    mode: "bpm-to-ms",
    inputValue: "",
    result: null,
    isValid: false,
  })

  // Handle mode change
  const handleModeChange = useCallback((mode: ConversionMode["id"]) => {
    setState((prev) => ({
      ...prev,
      mode,
      inputValue: "",
      result: null,
      isValid: false,
      error: undefined,
    }))
  }, [])

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      inputValue: value,
    }))
  }, [])

  // Handle validation change
  const handleValidationChange = useCallback((isValid: boolean, error?: string) => {
    setState((prev) => ({
      ...prev,
      isValid,
      error,
    }))
  }, [])

  // Perform conversion when input is valid
  useEffect(() => {
    if (state.isValid && state.inputValue.trim()) {
      const result = performConversion(state.inputValue, state.mode)
      setState((prev) => ({
        ...prev,
        result,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        result: null,
      }))
    }
  }, [state.inputValue, state.mode, state.isValid])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="relative border-b border-white/5 bg-gradient-to-b from-slate-900/80 to-slate-900/60 backdrop-blur-xl">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Title */}
              <h1 className="mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
                BPM ↔︎ MS CONVERTER
              </h1>

              <p className="mb-8 text-lg font-medium text-slate-300">
                Professional Timing Calculator for Music Production
              </p>

              {/* Feature Icons */}
              <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <Music className="h-6 w-6 text-blue-400" />
                  <ArrowLeftRight className="h-4 w-4 text-slate-400" />
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Mode Toggle */}
            <ConversionModeToggle currentMode={state.mode} onModeChange={handleModeChange} />

            {/* Input Section */}
            <ConversionInput
              mode={state.mode}
              value={state.inputValue}
              onChange={handleInputChange}
              onValidationChange={handleValidationChange}
            />

            {/* Results Section */}
            {state.result && <ConversionResults result={state.result} mode={state.mode} />}
          </div>
        </div>
      </div>
    </div>
  )
}
