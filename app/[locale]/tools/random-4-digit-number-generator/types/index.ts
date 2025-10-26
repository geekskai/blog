// Random 4-Digit Number Generator Types

/**
 * Generator state management
 */
export interface NumberGeneratorState {
  readonly generatedNumber: string
  readonly isGenerating: boolean
  readonly batchCount: number
  readonly generatedBatch: string[]
  readonly exportFormat: "txt" | "csv" | "json"
  readonly allowDuplicates: boolean
  readonly showHistory: boolean
  readonly rangeStart: number
  readonly rangeEnd: number
  readonly format: NumberFormat
  readonly exclusionRules: ExclusionRules
}

/**
 * Number format options
 */
export type NumberFormat = "plain" | "hyphen" | "dot" | "prefix"

/**
 * Format configuration
 */
export interface FormatConfig {
  readonly type: NumberFormat
  readonly separator?: string
  readonly prefix?: string
}

/**
 * Exclusion rules for generation
 */
export interface ExclusionRules {
  readonly excludeSequential: boolean // 1234, 4321
  readonly excludeRepeated: boolean // 1111, 2222
  readonly excludeSpecific: string[] // User-defined exclusions
}

/**
 * Generation options
 */
export interface GenerationOptions {
  readonly count?: number
  readonly rangeStart?: number
  readonly rangeEnd?: number
  readonly allowDuplicates?: boolean
  readonly format?: FormatConfig
  readonly exclusionRules?: ExclusionRules
}

/**
 * Generated number metadata
 */
export interface NumberMetadata {
  readonly number: string
  readonly formatted: string
  readonly timestamp: string
  readonly format: NumberFormat
  readonly isUnique: boolean
}

/**
 * Validation result
 */
export interface ValidationResult {
  readonly isValid: boolean
  readonly errors: string[]
  readonly number: string
}

/**
 * Export data structure
 */
export interface ExportData {
  readonly numbers: string[]
  readonly metadata?: NumberMetadata[]
  readonly exportedAt: string
  readonly format: string
  readonly totalCount: number
  readonly options: GenerationOptions
}

/**
 * Generation statistics
 */
export interface GenerationStats {
  readonly totalGenerated: number
  readonly uniqueCount: number
  readonly duplicateCount: number
  readonly excludedCount: number
  readonly successRate: number
}

/**
 * History item
 */
export interface HistoryItem {
  readonly number: string
  readonly timestamp: string
  readonly format: NumberFormat
}
