// Core conversion types
export interface Fraction {
  numerator: number
  denominator: number
  simplified: Fraction | null
  decimal: number
}

export interface ConversionResult {
  input: string
  wholeNumber: number
  fraction: Fraction | null
  decimal: number
  formatted: string
  commonEquivalents: Fraction[]
  timestamp: Date
}

export interface ParsedInput {
  isValid: boolean
  wholeNumber: number
  numerator: number
  denominator: number
  fraction: Fraction | null
  precision: number
  error?: string
}

export interface FractionResult {
  decimal: number
  numerator: number
  denominator: number
  formatted: string
  error: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  suggestions: string[]
}

// UI State types
export interface ConverterState {
  input: string
  result: ConversionResult | null
  precision: number
  showRuler: boolean
  conversionMode: "fraction-to-decimal" | "decimal-to-fraction"
  history: ConversionResult[]
  isLoading: boolean
  error: string | null
}

// Common fractions for quick access
export interface CommonFraction {
  display: string
  value: string
  decimal: number
  description?: string
}

// Visual ruler types
export interface RulerMark {
  position: number
  fraction: string
  decimal: number
  size: "major" | "minor" | "tiny"
}

// Export types
export interface ExportData {
  conversions: ConversionResult[]
  exportDate: Date
  format: "csv" | "json" | "txt"
}

// Analytics types
export interface ConversionEvent {
  type: "conversion_completed"
  conversionType: "fraction_to_decimal" | "decimal_to_fraction"
  inputType: "typed" | "button" | "voice"
  precisionLevel: number
  deviceType: "mobile" | "tablet" | "desktop"
  timestamp: Date
}

export interface MobileInteractionEvent {
  type: "mobile_interaction"
  interactionType: "touch_input" | "voice_input" | "copy_result"
  gloveMode?: boolean
  outdoorMode?: boolean
  timestamp: Date
}
