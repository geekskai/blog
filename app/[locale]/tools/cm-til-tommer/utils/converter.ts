import type { ConversionResult, ConversionUnit, PrecisionOption, PresetValue } from "../types"

// 转换常数
export const CONVERSION_CONSTANTS = {
  CM_TO_TOMMER: 0.3937, // 1 cm = 0.3937 tommer (inches)
  TOMMER_TO_CM: 2.54, // 1 tommer = 2.54 cm
} as const

// 转换范围限制
export const CONVERSION_LIMITS = {
  MIN_VALUE: 0,
  MAX_VALUE: 99999,
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
      formula: getConversionFormula(fromUnit, toUnit),
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
    formula: getConversionFormula(fromUnit, toUnit),
  }
}

/**
 * 批量转换函数
 */
export function batchConvert(
  values: number[],
  fromUnit: ConversionUnit,
  toUnit: ConversionUnit,
  precision: PrecisionOption = 2
): ConversionResult[] {
  return values.map((value) => convert(value, fromUnit, toUnit, precision))
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
 * 获取单位的显示名称（多语言支持）
 */
export function getUnitDisplayName(
  unit: ConversionUnit,
  language: "da" | "no" | "en" = "da"
): string {
  const unitNames = {
    da: {
      cm: "Centimeter",
      tommer: "Tommer",
    },
    no: {
      cm: "Centimeter",
      tommer: "Tommer",
    },
    en: {
      cm: "Centimeters",
      tommer: "Inches",
    },
  }
  return unitNames[language][unit]
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
  if (fromUnit === toUnit) return "Samme enhed"

  if (fromUnit === "cm" && toUnit === "tommer") {
    return `1 cm = ${CONVERSION_CONSTANTS.CM_TO_TOMMER} tommer`
  }

  if (fromUnit === "tommer" && toUnit === "cm") {
    return `1 tommer = ${CONVERSION_CONSTANTS.TOMMER_TO_CM} cm`
  }

  return "Ugyldig konvertering"
}

/**
 * 解析用户输入的字符串为数字
 */
export function parseInputValue(input: string): number {
  // 移除非数字字符（除了小数点和负号）
  const cleaned = input.replace(/[^\d.,-]/g, "").replace(",", ".")
  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? 0 : parsed
}

/**
 * 生成常用转换值的快速参考
 */
export function getCommonConversions(): Array<{ cm: number; tommer: number }> {
  const commonValues = [1, 2.54, 5, 10, 15, 20, 25, 30, 50, 100, 150, 200]

  return commonValues.map((cm) => ({
    cm,
    tommer: roundToPrecision(cmToTommer(cm), 2),
  }))
}

/**
 * 获取预设值（家具、建筑等常用尺寸）
 */
export function getPresetValues(): PresetValue[] {
  return [
    // 常用尺寸
    { value: 1, unit: "cm", label: "1 cm", category: "common" },
    { value: 2.54, unit: "cm", label: "1 tommer", category: "common" },
    { value: 10, unit: "cm", label: "10 cm", category: "common" },
    { value: 30, unit: "cm", label: "30 cm", category: "common" },

    // 家具尺寸
    { value: 90, unit: "cm", label: "Bordbredde", category: "furniture" },
    { value: 200, unit: "cm", label: "Sengelængde", category: "furniture" },
    { value: 60, unit: "cm", label: "Skabdybde", category: "furniture" },

    // 建筑尺寸
    { value: 240, unit: "cm", label: "Loftshøjde", category: "construction" },
    { value: 80, unit: "cm", label: "Dørbredde", category: "construction" },
    { value: 120, unit: "cm", label: "Vindue", category: "construction" },

    // 电子产品
    { value: 55, unit: "tommer", label: 'TV 55"', category: "electronics" },
    { value: 27, unit: "tommer", label: 'Monitor 27"', category: "electronics" },
    { value: 15.6, unit: "tommer", label: 'Laptop 15.6"', category: "electronics" },
  ]
}

/**
 * 验证精度值是否有效
 */
export function isValidPrecision(precision: number): precision is PrecisionOption {
  return [0, 1, 2, 3].includes(precision)
}

/**
 * 生成转换步骤说明
 */
export function getConversionSteps(
  value: number,
  fromUnit: ConversionUnit,
  toUnit: ConversionUnit,
  precision: PrecisionOption
): string[] {
  if (fromUnit === toUnit) {
    return [`Værdi: ${value} ${getUnitSymbol(fromUnit)}`, "Ingen konvertering nødvendig"]
  }

  const steps: string[] = []

  if (fromUnit === "cm" && toUnit === "tommer") {
    steps.push(`Start værdi: ${value} cm`)
    steps.push(`Formel: cm × 0.3937 = tommer`)
    steps.push(
      `Beregning: ${value} × 0.3937 = ${formatNumber(value * CONVERSION_CONSTANTS.CM_TO_TOMMER, precision)}`
    )
    steps.push(`Resultat: ${formatNumber(cmToTommer(value, precision), precision)} tommer`)
  } else if (fromUnit === "tommer" && toUnit === "cm") {
    steps.push(`Start værdi: ${value} tommer`)
    steps.push(`Formel: tommer × 2.54 = cm`)
    steps.push(
      `Beregning: ${value} × 2.54 = ${formatNumber(value * CONVERSION_CONSTANTS.TOMMER_TO_CM, precision)}`
    )
    steps.push(`Resultat: ${formatNumber(tommerToCm(value, precision), precision)} cm`)
  }

  return steps
}
