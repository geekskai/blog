import type { ConversionResult, ConversionUnit, PrecisionOption } from "../types"

// 转换常数
export const CONVERSION_CONSTANTS = {
  CM_TO_TOMMER: 0.3937, // 1 cm = 0.3937 tommer (inches)
  TOMMER_TO_CM: 2.54, // 1 tommer = 2.54 cm
} as const

// 转换范围限制
export const CONVERSION_LIMITS = {
  MIN_VALUE: 0,
  MAX_VALUE: 10000,
  DEFAULT_PRECISION: 2,
} as const

/**
 * 将厘米转换为 tommer (英寸)
 */
export function cmToTommer(cm: number, precision: PrecisionOption = 2): number {
  if (!isValidInput(cm)) return 0
  const result = cm * CONVERSION_CONSTANTS.CM_TO_TOMMER
  return roundToPrecision(result, precision)
}

/**
 * 将 tommer (英寸) 转换为厘米
 */
export function tommerToCm(tommer: number, precision: PrecisionOption = 2): number {
  if (!isValidInput(tommer)) return 0
  const result = tommer * CONVERSION_CONSTANTS.TOMMER_TO_CM
  return roundToPrecision(result, precision)
}

/**
 * 通用转换函数
 */
export function convert(
  value: number,
  fromUnit: ConversionUnit,
  toUnit: ConversionUnit,
  precision: PrecisionOption = 2
): ConversionResult {
  if (!isValidInput(value)) {
    return {
      input: 0,
      output: 0,
      inputUnit: fromUnit,
      outputUnit: toUnit,
      precision,
    }
  }

  let output: number

  if (fromUnit === toUnit) {
    output = value
  } else if (fromUnit === "cm" && toUnit === "tommer") {
    output = cmToTommer(value, precision)
  } else if (fromUnit === "tommer" && toUnit === "cm") {
    output = tommerToCm(value, precision)
  } else {
    output = 0
  }

  return {
    input: value,
    output,
    inputUnit: fromUnit,
    outputUnit: toUnit,
    precision,
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
 * 将数字四舍五入到指定精度
 */
export function roundToPrecision(value: number, precision: PrecisionOption): number {
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

/**
 * 格式化数字显示
 */
export function formatNumber(value: number, precision: PrecisionOption = 2): string {
  if (!isValidInput(value)) return "0"

  if (precision === 0) {
    return Math.round(value).toString()
  }

  return value.toFixed(precision)
}

/**
 * 获取单位的显示名称
 */
export function getUnitDisplayName(unit: ConversionUnit): string {
  const unitNames = {
    cm: "Centimeters",
    tommer: "Tommer (Inches)",
  }
  return unitNames[unit]
}

/**
 * 获取单位的简短符号
 */
export function getUnitSymbol(unit: ConversionUnit): string {
  const unitSymbols = {
    cm: "cm",
    tommer: "tommer",
  }
  return unitSymbols[unit]
}

/**
 * 生成转换公式说明
 */
export function getConversionFormula(fromUnit: ConversionUnit, toUnit: ConversionUnit): string {
  if (fromUnit === toUnit) return "Same unit"

  if (fromUnit === "cm" && toUnit === "tommer") {
    return `1 cm = ${CONVERSION_CONSTANTS.CM_TO_TOMMER} tommer`
  }

  if (fromUnit === "tommer" && toUnit === "cm") {
    return `1 tommer = ${CONVERSION_CONSTANTS.TOMMER_TO_CM} cm`
  }

  return "Invalid conversion"
}

/**
 * 解析用户输入的字符串为数字
 */
export function parseInputValue(input: string): number {
  // 移除非数字字符（除了小数点和负号）
  const cleaned = input.replace(/[^\d.-]/g, "")
  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? 0 : parsed
}

/**
 * 生成常用转换值的快速参考
 */
export function getCommonConversions(): Array<{ cm: number; tommer: number }> {
  const commonValues = [1, 5, 10, 15, 20, 25, 30, 50, 100]

  return commonValues.map((cm) => ({
    cm,
    tommer: roundToPrecision(cmToTommer(cm), 2),
  }))
}

/**
 * 验证精度值是否有效
 */
export function isValidPrecision(precision: number): precision is PrecisionOption {
  return [0, 1, 2, 3].includes(precision)
}
