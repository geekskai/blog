// VIN Generator Types
export interface VINGeneratorState {
  generatedVIN: string
  isGenerating: boolean
  batchCount: number
  generatedBatch: string[]
  exportFormat: "txt" | "csv" | "json"
  includeValidation: boolean
  showStructure: boolean
  selectedManufacturer: string
  modelYear: string
}

export interface VINGenerationOptions {
  count?: number
  manufacturer?: string
  modelYear?: string
  format?: "formatted" | "raw"
  includeMetadata?: boolean
}

export interface VINMetadata {
  wmi: string // World Manufacturer Identifier
  vds: string // Vehicle Descriptor Section
  checkDigit: string
  modelYear: string
  plantCode: string
  sequentialNumber: string
  isValid: boolean
  generatedAt: string
  manufacturer?: string
}

export interface VINValidationResult {
  isValid: boolean
  errors: string[]
  structure: {
    wmi: string
    vds: string
    checkDigit: string
    modelYear: string
    plantCode: string
    sequentialNumber: string
  }
  calculatedCheckDigit: string
}

export interface ManufacturerInfo {
  code: string
  name: string
  country: string
}

export interface ExportData {
  vins: string[]
  metadata?: VINMetadata[]
  exportedAt: string
  format: string
  totalCount: number
}

// VIN Character mapping for check digit calculation
export interface VINCharacterMap {
  [key: string]: number
}

// Model year encoding
export interface ModelYearMap {
  [key: string]: string
}
