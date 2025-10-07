import type {
  EngineConfig,
  EngineType,
  FuelSystem,
  ConversionResult,
  ConversionDirection,
  ValidationResult,
  VehicleExample,
  PrecisionOption,
} from "../types"

// Engine configuration constants based on empirical data
export const ENGINE_CONFIGS: Record<string, EngineConfig> = {
  "4-stroke-naturally-aspirated": {
    type: "4-stroke",
    fuelSystem: "naturally-aspirated",
    coefficient: 0.8,
    description: "4-Stroke Naturally Aspirated",
  },
  "4-stroke-turbocharged": {
    type: "4-stroke",
    fuelSystem: "turbocharged",
    coefficient: 1.0,
    description: "4-Stroke Turbocharged",
  },
  "2-stroke-naturally-aspirated": {
    type: "2-stroke",
    fuelSystem: "naturally-aspirated",
    coefficient: 1.2,
    description: "2-Stroke Naturally Aspirated",
  },
  "2-stroke-turbocharged": {
    type: "2-stroke",
    fuelSystem: "turbocharged",
    coefficient: 1.4,
    description: "2-Stroke Turbocharged",
  },
} as const

// Base conversion constants
export const CONVERSION_CONSTANTS = {
  BASE_DIVISOR: 15, // Base formula: hp = (ccm ÷ 15) × coefficient
  VARIANCE_PERCENTAGE: 0.15, // ±15% variance for realistic range
  MIN_CCM: 50,
  MAX_CCM: 8000,
  MIN_HP: 1,
  MAX_HP: 1000,
} as const

/**
 * Get engine configuration by type and fuel system
 */
export function getEngineConfig(engineType: EngineType, fuelSystem: FuelSystem): EngineConfig {
  const key = `${engineType}-${fuelSystem}`
  return ENGINE_CONFIGS[key] || ENGINE_CONFIGS["4-stroke-naturally-aspirated"]
}

/**
 * Convert CCM to HP using empirical formula
 */
export function convertCcmToHp(
  ccm: number,
  engineType: EngineType,
  fuelSystem: FuelSystem,
  precision: PrecisionOption = 2
): ConversionResult {
  const engineConfig = getEngineConfig(engineType, fuelSystem)

  // Base formula: hp = (ccm ÷ 15) × coefficient
  const baseHp = (ccm / CONVERSION_CONSTANTS.BASE_DIVISOR) * engineConfig.coefficient

  // Calculate realistic range (±15%)
  const variance = baseHp * CONVERSION_CONSTANTS.VARIANCE_PERCENTAGE
  const minHp = Math.max(baseHp - variance, 1)
  const maxHp = baseHp + variance

  return {
    input: ccm,
    output: roundToPrecision(baseHp, precision),
    outputRange: {
      min: roundToPrecision(minHp, precision),
      max: roundToPrecision(maxHp, precision),
    },
    inputUnit: "ccm",
    outputUnit: "hp",
    engineConfig,
    formula: `HP = (${ccm} ÷ ${CONVERSION_CONSTANTS.BASE_DIVISOR}) × ${engineConfig.coefficient}`,
  }
}

/**
 * Convert HP to CCM (reverse calculation)
 */
export function convertHpToCcm(
  hp: number,
  engineType: EngineType,
  fuelSystem: FuelSystem,
  precision: PrecisionOption = 2
): ConversionResult {
  const engineConfig = getEngineConfig(engineType, fuelSystem)

  // Reverse formula: ccm = (hp ÷ coefficient) × 15
  const baseCcm = (hp / engineConfig.coefficient) * CONVERSION_CONSTANTS.BASE_DIVISOR

  // Calculate realistic range (±15%)
  const variance = baseCcm * CONVERSION_CONSTANTS.VARIANCE_PERCENTAGE
  const minCcm = Math.max(baseCcm - variance, 50)
  const maxCcm = baseCcm + variance

  return {
    input: hp,
    output: Math.round(baseCcm), // CCM should always be whole numbers
    outputRange: {
      min: Math.round(minCcm),
      max: Math.round(maxCcm),
    },
    inputUnit: "hp",
    outputUnit: "ccm",
    engineConfig,
    formula: `CCM = (${hp} ÷ ${engineConfig.coefficient}) × ${CONVERSION_CONSTANTS.BASE_DIVISOR}`,
  }
}

/**
 * Generic conversion function
 */
export function convert(
  value: number,
  direction: ConversionDirection,
  engineType: EngineType,
  fuelSystem: FuelSystem,
  precision: PrecisionOption = 2
): ConversionResult {
  if (direction === "ccm-to-hp") {
    return convertCcmToHp(value, engineType, fuelSystem, precision)
  } else {
    return convertHpToCcm(value, engineType, fuelSystem, precision)
  }
}

/**
 * Validate input value
 */
export function validateInput(value: number, direction: ConversionDirection): ValidationResult {
  if (isNaN(value) || value <= 0) {
    return {
      isValid: false,
      error: "INVALID_NUMBER",
    }
  }

  if (direction === "ccm-to-hp") {
    if (value < CONVERSION_CONSTANTS.MIN_CCM) {
      return {
        isValid: false,
        error: "MIN_CCM_ERROR",
      }
    }
    if (value > CONVERSION_CONSTANTS.MAX_CCM) {
      return {
        isValid: true,
        warning: "LARGE_CCM_WARNING",
      }
    }
  } else {
    if (value < CONVERSION_CONSTANTS.MIN_HP) {
      return {
        isValid: false,
        error: "MIN_HP_ERROR",
      }
    }
    if (value > CONVERSION_CONSTANTS.MAX_HP) {
      return {
        isValid: true,
        warning: "HIGH_HP_WARNING",
      }
    }
  }

  return { isValid: true }
}

/**
 * Round number to specified precision
 */
export function roundToPrecision(value: number, precision: PrecisionOption): number {
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

/**
 * Format number for display
 */
export function formatNumber(num: number, decimals: PrecisionOption = 2): string {
  return num.toFixed(decimals).replace(/\.0$/, "")
}

/**
 * Get common vehicle examples for reference
 */
export function getVehicleExamples(): VehicleExample[] {
  return [
    {
      name: "Honda CBR125R",
      ccm: 125,
      hp: 15,
      engineType: "4-stroke",
      fuelSystem: "naturally-aspirated",
      category: "motorcycle",
    },
    {
      name: "Yamaha YZ250",
      ccm: 250,
      hp: 48,
      engineType: "2-stroke",
      fuelSystem: "naturally-aspirated",
      category: "motorcycle",
    },
    {
      name: "Honda Civic Type R",
      ccm: 2000,
      hp: 320,
      engineType: "4-stroke",
      fuelSystem: "turbocharged",
      category: "car",
    },
    {
      name: "Kawasaki Ninja 400",
      ccm: 399,
      hp: 45,
      engineType: "4-stroke",
      fuelSystem: "naturally-aspirated",
      category: "motorcycle",
    },
    {
      name: "Rotax 125 Max",
      ccm: 125,
      hp: 30,
      engineType: "2-stroke",
      fuelSystem: "naturally-aspirated",
      category: "kart",
    },
    {
      name: "Mercury 150hp Outboard",
      ccm: 2500,
      hp: 150,
      engineType: "4-stroke",
      fuelSystem: "naturally-aspirated",
      category: "boat",
    },
  ]
}

/**
 * Get engine type options for UI
 */
export function getEngineTypeOptions(): Array<{
  value: EngineType
  label: string
  description: string
}> {
  return [
    {
      value: "4-stroke",
      label: "4-Stroke",
      description: "Most common in cars and modern motorcycles",
    },
    {
      value: "2-stroke",
      label: "2-Stroke",
      description: "Common in dirt bikes, chainsaws, and small engines",
    },
  ]
}

/**
 * Get fuel system options for UI
 */
export function getFuelSystemOptions(): Array<{
  value: FuelSystem
  label: string
  description: string
}> {
  return [
    {
      value: "naturally-aspirated",
      label: "Naturally Aspirated",
      description: "No forced induction",
    },
    {
      value: "turbocharged",
      label: "Turbocharged",
      description: "Forced induction for higher power",
    },
  ]
}

/**
 * Convert CCM to Liters
 */
export function ccmToLiters(ccm: number): number {
  return ccm / 1000
}

/**
 * Convert Liters to CCM
 */
export function litersToCcm(liters: number): number {
  return liters * 1000
}

/**
 * Convert HP to kW (kilowatts)
 */
export function hpToKw(hp: number): number {
  return hp * 0.7457 // 1 HP = 0.7457 kW
}

/**
 * Convert kW to HP
 */
export function kwToHp(kw: number): number {
  return kw / 0.7457 // 1 kW = 1.341 HP
}

/**
 * Parse URL parameters for conversion settings
 */
export function parseUrlParameters(): {
  input?: number
  engineType?: EngineType
  fuelSystem?: FuelSystem
  direction?: ConversionDirection
} {
  if (typeof window === "undefined") return {}

  const params = new URLSearchParams(window.location.search)

  return {
    input: params.get("input") ? parseFloat(params.get("input")!) : undefined,
    engineType: (params.get("type") as EngineType) || undefined,
    fuelSystem: (params.get("fuel") as FuelSystem) || undefined,
    direction: (params.get("direction") as ConversionDirection) || undefined,
  }
}

/**
 * Generate URL with conversion parameters
 */
export function generateUrlWithParameters(
  input: number,
  engineType: EngineType,
  fuelSystem: FuelSystem,
  direction: ConversionDirection
): string {
  const params = new URLSearchParams({
    input: input.toString(),
    type: engineType,
    fuel: fuelSystem,
    direction: direction,
  })

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "https://geekskai.com/tools/ccm-to-hp-converter"

  return `${baseUrl}?${params.toString()}`
}

/**
 * Get conversion history from localStorage
 */
export function getConversionHistory(): ConversionResult[] {
  if (typeof window === "undefined") return []

  try {
    const history = localStorage.getItem("ccm-hp-conversion-history")
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.warn("Failed to load conversion history:", error)
    return []
  }
}

/**
 * Save conversion to history
 */
export function saveConversionToHistory(result: ConversionResult): void {
  if (typeof window === "undefined") return

  try {
    const history = getConversionHistory()
    const newHistory = [result, ...history.slice(0, 9)] // Keep last 10 conversions
    localStorage.setItem("ccm-hp-conversion-history", JSON.stringify(newHistory))
  } catch (error) {
    console.warn("Failed to save conversion history:", error)
  }
}

/**
 * Clear conversion history
 */
export function clearConversionHistory(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("ccm-hp-conversion-history")
  } catch (error) {
    console.warn("Failed to clear conversion history:", error)
  }
}

/**
 * Generate conversion examples for different engine types
 */
export function getConversionExamples(): Array<{
  ccm: number
  hp: number
  engineType: EngineType
  fuelSystem: FuelSystem
  description: string
}> {
  const examples = [
    {
      ccm: 125,
      engineType: "4-stroke" as EngineType,
      fuelSystem: "naturally-aspirated" as FuelSystem,
    },
    {
      ccm: 250,
      engineType: "2-stroke" as EngineType,
      fuelSystem: "naturally-aspirated" as FuelSystem,
    },
    {
      ccm: 600,
      engineType: "4-stroke" as EngineType,
      fuelSystem: "naturally-aspirated" as FuelSystem,
    },
    {
      ccm: 1000,
      engineType: "4-stroke" as EngineType,
      fuelSystem: "naturally-aspirated" as FuelSystem,
    },
    { ccm: 2000, engineType: "4-stroke" as EngineType, fuelSystem: "turbocharged" as FuelSystem },
  ]

  return examples.map((example) => {
    const result = convertCcmToHp(example.ccm, example.engineType, example.fuelSystem)
    return {
      ...example,
      hp: result.output,
      description: result.engineConfig.description,
    }
  })
}
