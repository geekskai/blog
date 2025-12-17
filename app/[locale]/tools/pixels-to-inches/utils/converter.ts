import type { ConversionResult, PrecisionOption } from "../types"

// 默认PPI值（标准屏幕分辨率）
export const DEFAULT_PPI = 96

// 转换范围限制
export const CONVERSION_LIMITS = {
  MIN_VALUE: 0,
  MAX_VALUE: 999999,
  MIN_PPI: 1,
  MAX_PPI: 1000,
  DEFAULT_PRECISION: 2,
} as const

/**
 * 将英寸转换为像素
 */
export function inchesToPixels(
  inches: number,
  ppi: number = DEFAULT_PPI,
  precision: PrecisionOption = 2
): number {
  if (!isValidInput(inches) || !isValidPPI(ppi)) return 0
  const result = inches * ppi
  return roundToPrecision(result, precision)
}

/**
 * 将像素转换为英寸
 */
export function pixelsToInches(
  pixels: number,
  ppi: number = DEFAULT_PPI,
  precision: PrecisionOption = 2
): number {
  if (!isValidInput(pixels) || !isValidPPI(ppi)) return 0
  const result = pixels / ppi
  return roundToPrecision(result, precision)
}

/**
 * 执行转换
 */
export function convert(
  inches: number | null,
  pixels: number | null,
  ppi: number = DEFAULT_PPI,
  precision: PrecisionOption = 2
): ConversionResult {
  const validPPI = isValidPPI(ppi) ? ppi : DEFAULT_PPI

  // 如果提供了英寸，计算像素
  if (inches !== null && isValidInput(inches)) {
    const calculatedPixels = inchesToPixels(inches, validPPI, precision)
    return {
      inches,
      pixels: calculatedPixels,
      ppi: validPPI,
    }
  }

  // 如果提供了像素，计算英寸
  if (pixels !== null && isValidInput(pixels)) {
    const calculatedInches = pixelsToInches(pixels, validPPI, precision)
    return {
      inches: calculatedInches,
      pixels,
      ppi: validPPI,
    }
  }

  // 默认值
  return {
    inches: inches || 0,
    pixels: pixels || 0,
    ppi: validPPI,
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
 * 验证PPI值是否有效
 */
export function isValidPPI(ppi: number): boolean {
  return (
    typeof ppi === "number" &&
    !isNaN(ppi) &&
    isFinite(ppi) &&
    ppi >= CONVERSION_LIMITS.MIN_PPI &&
    ppi <= CONVERSION_LIMITS.MAX_PPI
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
 * 解析用户输入的字符串为数字
 */
export function parseInputValue(input: string): number | null {
  if (!input || input.trim() === "") return null

  // 移除非数字字符（除了小数点和负号）
  const cleaned = input.replace(/[^\d.,-]/g, "").replace(",", ".")
  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? null : parsed
}

/**
 * 获取转换公式说明
 */
export function getConversionFormula(
  direction: "inches-to-pixels" | "pixels-to-inches",
  ppi: number
): string {
  if (direction === "inches-to-pixels") {
    return `Inches × ${ppi} = Pixels`
  } else {
    return `Pixels ÷ ${ppi} = Inches`
  }
}
