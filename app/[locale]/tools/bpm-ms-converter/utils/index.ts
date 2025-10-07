import {
  ConversionResult,
  NoteValue,
  NoteValueResult,
  VALIDATION_LIMITS,
  ConversionMode,
} from "../types"

// Core conversion formulas
export const convertBPMToMS = (bpm: number): number => {
  return Math.round((60000 / bpm) * 100) / 100
}

export const convertMSToBPM = (ms: number): number => {
  return Math.round((60000 / ms) * 100) / 100
}

// Note value definitions - PRD required types only
export const NOTE_VALUES: NoteValue[] = [
  {
    id: "quarter",
    name: "Quarter Note", // This will be translated in components
    multiplier: 1,
    description: "1 beat - Standard beat reference", // This will be translated in components
    icon: "♩",
    commonUse: ["Kick drums", "Basic rhythm"],
  },
  {
    id: "eighth",
    name: "Eighth Note", // This will be translated in components
    multiplier: 0.5,
    description: "1/2 beat - Double-time feel", // This will be translated in components
    icon: "♫",
    commonUse: ["Hi-hats", "Delay timing"],
  },
  {
    id: "sixteenth",
    name: "Sixteenth Note", // This will be translated in components
    multiplier: 0.25,
    description: "1/4 beat - Subdivision timing", // This will be translated in components
    icon: "♬",
    commonUse: ["Fast hi-hats", "Quick delays"],
  },
  {
    id: "dotted-quarter",
    name: "Dotted Quarter", // This will be translated in components
    multiplier: 1.5,
    description: "1.5 beats - Adds swing feel", // This will be translated in components
    icon: "♩.",
    commonUse: ["Swing rhythms", "Triplet delays"],
  },
  {
    id: "eighth-triplet",
    name: "Eighth Triplet", // This will be translated in components
    multiplier: 1 / 3,
    description: "1/3 beat - Triplet subdivision", // This will be translated in components
    icon: "♫³",
    commonUse: ["Triplet feel", "Swing delays"],
  },
]

// Conversion modes configuration
export const CONVERSION_MODES: ConversionMode[] = [
  {
    id: "bpm-to-ms",
    label: "BPM → MS",
    description: "Convert beats per minute to milliseconds",
    inputLabel: "BPM (Beats Per Minute)",
    inputPlaceholder: "Enter BPM (20-300)",
    outputLabel: "Milliseconds per Beat",
    icon: "🎵",
  },
  {
    id: "ms-to-bpm",
    label: "MS → BPM",
    description: "Convert milliseconds to beats per minute",
    inputLabel: "Milliseconds per Beat",
    inputPlaceholder: "Enter MS (100-3000)",
    outputLabel: "BPM (Beats Per Minute)",
    icon: "⏱️",
  },
]

// Validation functions
export const validateBPM = (bpm: number): boolean => {
  return bpm >= VALIDATION_LIMITS.BPM.MIN && bpm <= VALIDATION_LIMITS.BPM.MAX
}

export const validateMS = (ms: number): boolean => {
  return ms >= VALIDATION_LIMITS.MS.MIN && ms <= VALIDATION_LIMITS.MS.MAX
}

export const validateInput = (value: string, mode: ConversionMode["id"]): boolean => {
  const numValue = parseFloat(value)
  if (isNaN(numValue) || numValue <= 0) return false

  return mode === "bpm-to-ms" ? validateBPM(numValue) : validateMS(numValue)
}

// Main conversion function
export const performConversion = (
  inputValue: string,
  mode: ConversionMode["id"]
): ConversionResult | null => {
  const numValue = parseFloat(inputValue)

  if (!validateInput(inputValue, mode)) {
    return null
  }

  let primaryValue: number
  let bpm: number
  let ms: number

  if (mode === "bpm-to-ms") {
    bpm = numValue
    ms = convertBPMToMS(bpm)
    primaryValue = ms
  } else {
    ms = numValue
    bpm = convertMSToBPM(ms)
    primaryValue = bpm
  }

  // Calculate all note values
  const noteValues: NoteValueResult[] = NOTE_VALUES.map((note) => {
    let value: number
    let unit: "ms" | "bpm"

    if (mode === "bpm-to-ms") {
      // For BPM to MS: calculate milliseconds for each note value
      value = Math.round(ms * note.multiplier * 100) / 100
      unit = "ms"
    } else {
      // For MS to BPM: calculate BPM for each note value (inverse relationship)
      value = Math.round((bpm / note.multiplier) * 100) / 100
      unit = "bpm"
    }

    return {
      noteId: note.id,
      name: note.name,
      value,
      unit,
      description: note.description,
    }
  })

  return {
    primaryValue,
    noteValues,
    bpm,
    ms,
  }
}

// Utility functions for formatting and copying
export const formatValue = (value: number, unit: string): string => {
  return `${value} ${unit}`
}

export const formatForCopy = (result: ConversionResult, mode: ConversionMode["id"]): string => {
  const header = mode === "bpm-to-ms" ? `${result.bpm} BPM Timing` : `${result.ms} ms Timing`

  const noteLines = result.noteValues
    .map((note) => `${note.name}: ${note.value} ${note.unit}`)
    .join("\n")

  return `${header}\n\n${noteLines}`
}

// Copy to clipboard function
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand("copy")
      document.body.removeChild(textArea)
      return result
    } catch (fallbackError) {
      console.error("Failed to copy to clipboard:", fallbackError)
      return false
    }
  }
}

// Get error message for invalid input
export const getErrorMessage = (value: string, mode: ConversionMode["id"]): string => {
  const numValue = parseFloat(value)

  if (isNaN(numValue) || numValue <= 0) {
    return "Please enter a valid positive number"
  }

  if (mode === "bpm-to-ms") {
    if (numValue < VALIDATION_LIMITS.BPM.MIN) {
      return `BPM must be at least ${VALIDATION_LIMITS.BPM.MIN}`
    }
    if (numValue > VALIDATION_LIMITS.BPM.MAX) {
      return `BPM must be no more than ${VALIDATION_LIMITS.BPM.MAX}`
    }
  } else {
    if (numValue < VALIDATION_LIMITS.MS.MIN) {
      return `Milliseconds must be at least ${VALIDATION_LIMITS.MS.MIN}`
    }
    if (numValue > VALIDATION_LIMITS.MS.MAX) {
      return `Milliseconds must be no more than ${VALIDATION_LIMITS.MS.MAX}`
    }
  }

  return "Invalid input"
}

// Get common use cases for a note value
export const getNoteUseCase = (noteId: string): string[] => {
  const note = NOTE_VALUES.find((n) => n.id === noteId)
  return note?.commonUse || []
}

// Format timing for DAW usage
export const formatForDAW = (ms: number): string => {
  // Common DAW delay time format
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)}s`
  }
  return `${ms}ms`
}

// Calculate swing percentage (for dotted notes)
export const calculateSwingPercentage = (straightMs: number, swungMs: number): number => {
  return Math.round(((swungMs / straightMs) * 100 - 100) * 10) / 10
}
