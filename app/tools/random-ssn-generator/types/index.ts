// SSN Generator Types
export interface SSNGeneratorState {
  generatedSSN: string
  isGenerating: boolean
  batchCount: number
  generatedBatch: string[]
  exportFormat: "txt" | "csv" | "json"
  includeValidation: boolean
  showStructure: boolean
}

export interface SSNGenerationOptions {
  count?: number
  format?: "formatted" | "raw"
  includeMetadata?: boolean
}

export interface SSNMetadata {
  areaNumber: string
  groupNumber: string
  serialNumber: string
  isValid: boolean
  generatedAt: string
}

export interface SSNValidationResult {
  isValid: boolean
  errors: string[]
  structure: {
    area: string
    group: string
    serial: string
  }
}

export interface ExportData {
  ssns: string[]
  metadata?: SSNMetadata[]
  exportedAt: string
  format: string
  totalCount: number
}
