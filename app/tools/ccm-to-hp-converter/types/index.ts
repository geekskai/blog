// Engine types and configurations
export type EngineType = "2-stroke" | "4-stroke"
export type FuelSystem = "naturally-aspirated" | "turbocharged"

// Engine configuration interface
export interface EngineConfig {
  type: EngineType
  fuelSystem: FuelSystem
  coefficient: number
  description: string
}

// Conversion direction
export type ConversionDirection = "ccm-to-hp" | "hp-to-ccm"

// Conversion result interface
export interface ConversionResult {
  input: number
  output: number
  outputRange: {
    min: number
    max: number
  }
  inputUnit: "ccm" | "hp"
  outputUnit: "hp" | "ccm"
  engineConfig: EngineConfig
  formula: string
}

// Conversion history
export interface ConversionHistory {
  id: string
  timestamp: Date
  result: ConversionResult
}

// Component props
export interface ConverterProps {
  defaultValue?: number
  defaultEngineType?: EngineType
  defaultFuelSystem?: FuelSystem
  defaultDirection?: ConversionDirection
  onConvert?: (result: ConversionResult) => void
}

// Copy status for clipboard functionality
export type CopyStatus = "idle" | "copying" | "copied" | "error"

// Precision options for decimal places
export type PrecisionOption = 0 | 1 | 2 | 3

// Engine specifications for common vehicles
export interface VehicleExample {
  name: string
  ccm: number
  hp: number
  engineType: EngineType
  fuelSystem: FuelSystem
  category: "motorcycle" | "car" | "boat" | "kart"
}

// Validation result
export interface ValidationResult {
  isValid: boolean
  error?: string
  warning?: string
}

// Unit conversion options
export interface UnitOptions {
  ccm: string[]
  hp: string[]
}
