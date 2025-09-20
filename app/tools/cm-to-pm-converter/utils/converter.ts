import type {
  ConversionResult,
  ConversionUnit,
  PrecisionOption,
  ScientificNotation,
  ValidationResult,
  DisplayFormat,
} from "../types"

// 转换常数 (基于PRD文档中的精确值)
export const CONVERSION_CONSTANTS = {
  CM_TO_PM: 1e10, // 1 cm = 10^10 pm
  PM_TO_CM: 1e-10, // 1 pm = 10^-10 cm
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  SCIENTIFIC_THRESHOLD: 1e6, // Use scientific notation above this
} as const

// 转换范围限制
export const CONVERSION_LIMITS = {
  MIN_VALUE: 0,
  MAX_VALUE: 1e15, // Maximum supported picometer value as per PRD
  DEFAULT_PRECISION: 3,
} as const

/**
 * 将厘米转换为皮米
 */
export function cmToPm(cm: number, precision: PrecisionOption = 3): number {
  if (!isValidInput(cm)) return 0
  const result = cm * CONVERSION_CONSTANTS.CM_TO_PM
  return roundToPrecision(result, precision)
}

/**
 * 将皮米转换为厘米
 */
export function pmToCm(pm: number, precision: PrecisionOption = 3): number {
  if (!isValidInput(pm)) return 0
  const result = pm * CONVERSION_CONSTANTS.PM_TO_CM
  return roundToPrecision(result, precision)
}

/**
 * 通用转换函数
 */
export function convert(
  value: number,
  fromUnit: ConversionUnit,
  toUnit: ConversionUnit,
  precision: PrecisionOption = 3
): ConversionResult {
  if (!isValidInput(value)) {
    return createEmptyResult(fromUnit, toUnit, precision)
  }

  let output: number
  let formula: string

  if (fromUnit === toUnit) {
    output = value
    formula = "Same unit"
  } else if (fromUnit === "cm" && toUnit === "pm") {
    output = cmToPm(value, precision)
    formula = `${value} cm × 10¹⁰ = ${formatNumber(output, precision)} pm`
  } else if (fromUnit === "pm" && toUnit === "cm") {
    output = pmToCm(value, precision)
    formula = `${value} pm × 10⁻¹⁰ = ${formatNumber(output, precision)} cm`
  } else {
    output = 0
    formula = "Invalid conversion"
  }

  return {
    input: value,
    output,
    inputUnit: fromUnit,
    outputUnit: toUnit,
    precision,
    scientificNotation: toScientificNotation(output),
    formula,
  }
}

/**
 * 创建空的转换结果
 */
function createEmptyResult(
  fromUnit: ConversionUnit,
  toUnit: ConversionUnit,
  precision: PrecisionOption
): ConversionResult {
  return {
    input: 0,
    output: 0,
    inputUnit: fromUnit,
    outputUnit: toUnit,
    precision,
    scientificNotation: "0",
    formula: "",
  }
}

/**
 * 验证输入值是否有效
 */
export function isValidInput(value: number): boolean {
  return (
    typeof value === "number" &&
    !isNaN(value) &&
    isFinite(value) &&
    value >= CONVERSION_LIMITS.MIN_VALUE &&
    value <= CONVERSION_LIMITS.MAX_VALUE
  )
}

/**
 * 验证输入并返回详细结果
 */
export function validateInput(value: number): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (typeof value !== "number" || isNaN(value)) {
    errors.push("Input must be a valid number")
  } else if (!isFinite(value)) {
    errors.push("Input must be a finite number")
  } else if (value < CONVERSION_LIMITS.MIN_VALUE) {
    errors.push(`Value must be greater than or equal to ${CONVERSION_LIMITS.MIN_VALUE}`)
  } else if (value > CONVERSION_LIMITS.MAX_VALUE) {
    errors.push(`Value exceeds maximum limit of ${CONVERSION_LIMITS.MAX_VALUE}`)
  }

  // Warnings for very large or very small values
  if (value > 1e12) {
    warnings.push("Very large values may have reduced precision")
  } else if (value > 0 && value < 1e-6) {
    warnings.push("Very small values may have reduced precision")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * 将数字四舍五入到指定精度
 */
export function roundToPrecision(value: number, precision: PrecisionOption): number {
  if (precision === 0) {
    return Math.round(value)
  }

  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

/**
 * 格式化数字显示
 */
export function formatNumber(
  value: number,
  precision: PrecisionOption = 3,
  format: DisplayFormat = "standard"
): string {
  if (!isValidInput(value)) return "0"

  if (format === "scientific" || value >= CONVERSION_CONSTANTS.SCIENTIFIC_THRESHOLD) {
    return toScientificNotation(value)
  }

  if (precision === 0) {
    return Math.round(value).toLocaleString()
  }

  return value.toFixed(precision)
}

/**
 * 转换为科学记数法
 */
export function toScientificNotation(value: number): string {
  if (value === 0) return "0"

  const exponent = Math.floor(Math.log10(Math.abs(value)))
  const coefficient = value / Math.pow(10, exponent)

  return `${coefficient.toFixed(2)} × 10${formatExponent(exponent)}`
}

/**
 * 格式化指数显示
 */
function formatExponent(exponent: number): string {
  const superscriptMap: { [key: string]: string } = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "-": "⁻",
  }

  return exponent
    .toString()
    .split("")
    .map((char) => superscriptMap[char] || char)
    .join("")
}

/**
 * 解析科学记数法
 */
export function parseScientificNotation(input: string): ScientificNotation | null {
  const scientificRegex = /^([+-]?\d*\.?\d+)\s*[×x*]\s*10\s*\^?\s*([+-]?\d+)$/i
  const match = input.match(scientificRegex)

  if (!match) return null

  const coefficient = parseFloat(match[1])
  const exponent = parseInt(match[2])

  if (isNaN(coefficient) || isNaN(exponent)) return null

  return {
    coefficient,
    exponent,
    formatted: `${coefficient} × 10${formatExponent(exponent)}`,
  }
}

/**
 * 获取单位的显示名称
 */
export function getUnitDisplayName(unit: ConversionUnit): string {
  const unitNames = {
    cm: "Centimeters",
    pm: "Picometers",
  }
  return unitNames[unit]
}

/**
 * 获取单位的简短符号
 */
export function getUnitSymbol(unit: ConversionUnit): string {
  const unitSymbols = {
    cm: "cm",
    pm: "pm",
  }
  return unitSymbols[unit]
}

/**
 * 生成转换公式说明
 */
export function getConversionFormula(fromUnit: ConversionUnit, toUnit: ConversionUnit): string {
  if (fromUnit === toUnit) return "Same unit"

  if (fromUnit === "cm" && toUnit === "pm") {
    return `1 cm = ${CONVERSION_CONSTANTS.CM_TO_PM.toExponential()} pm`
  }

  if (fromUnit === "pm" && toUnit === "cm") {
    return `1 pm = ${CONVERSION_CONSTANTS.PM_TO_CM.toExponential()} cm`
  }

  return "Invalid conversion"
}

/**
 * 解析用户输入的字符串为数字
 */
export function parseInputValue(input: string): number {
  // Handle scientific notation input
  const scientificNotation = parseScientificNotation(input)
  if (scientificNotation) {
    return scientificNotation.coefficient * Math.pow(10, scientificNotation.exponent)
  }

  // Handle regular number input
  const cleaned = input.replace(/[^\d.eE+-]/g, "")
  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? 0 : parsed
}

/**
 * 生成常用转换值的快速参考
 */
export function getCommonConversions(): Array<{ cm: number; pm: number; description: string }> {
  const commonValues = [
    { cm: 0.001, description: "Micrometer scale" },
    { cm: 0.01, description: "Cell organelle" },
    { cm: 0.1, description: "Bacteria size" },
    { cm: 1, description: "Standard centimeter" },
    { cm: 10, description: "Large measurement" },
  ]

  return commonValues.map(({ cm, description }) => ({
    cm,
    pm: roundToPrecision(cmToPm(cm), 2),
    description,
  }))
}

/**
 * 验证精度值是否有效
 */
export function isValidPrecision(precision: number): precision is PrecisionOption {
  return [0, 1, 2, 3, 4, 5, 6].includes(precision)
}

/**
 * 获取推荐的精度级别
 */
export function getRecommendedPrecision(value: number): PrecisionOption {
  if (value >= 1e12) return 0 // Very large values
  if (value >= 1e6) return 1 // Large values
  if (value >= 1000) return 2 // Medium values
  return 3 // Default precision for small values
}

/**
 * 格式化结果用于复制
 */
export function formatResultForCopy(
  result: ConversionResult,
  includeFormula: boolean = true
): string {
  const basicResult = `${result.input} ${getUnitSymbol(result.inputUnit)} = ${formatNumber(result.output, result.precision)} ${getUnitSymbol(result.outputUnit)}`

  if (includeFormula && result.formula) {
    return `${basicResult}\nFormula: ${result.formula}`
  }

  return basicResult
}
