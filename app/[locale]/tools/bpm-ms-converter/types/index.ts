// BPM to MS Converter Types

export interface ConversionMode {
  id: "bpm-to-ms" | "ms-to-bpm"
  label: string
  description: string
  inputLabel: string
  inputPlaceholder: string
  outputLabel: string
  icon: string
}

export interface NoteValue {
  id: string
  name: string
  multiplier: number
  description: string
  icon: string
  commonUse: string[]
}

export interface ConversionResult {
  primaryValue: number
  noteValues: NoteValueResult[]
  bpm?: number
  ms?: number
}

export interface NoteValueResult {
  noteId: string
  name: string
  value: number
  unit: "ms" | "bpm"
  description: string
}

export interface ConversionState {
  mode: ConversionMode["id"]
  inputValue: string
  result: ConversionResult | null
  isValid: boolean
  error?: string
}

export interface CopyState {
  copied: boolean
  copiedItem?: string
}

// Validation constraints
export const VALIDATION_LIMITS = {
  BPM: {
    MIN: 20,
    MAX: 300,
  },
  MS: {
    MIN: 100,
    MAX: 3000,
  },
} as const
