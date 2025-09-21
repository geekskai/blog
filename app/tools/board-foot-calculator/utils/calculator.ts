import type {
  LumberDimensions,
  BoardFootResult,
  LengthUnit,
  UnitSystem,
  PrecisionOption,
  ConversionResult,
  CommonDimension,
  WoodSpecies,
  ValidationResult,
} from "../types"

// 转换常数
export const CONVERSION_CONSTANTS = {
  // 长度转换到英寸
  INCHES_TO_INCHES: 1,
  FEET_TO_INCHES: 12,
  CM_TO_INCHES: 0.3937,
  METERS_TO_INCHES: 39.3701,

  // 板英尺计算常数
  BOARD_FOOT_DIVISOR: 144, // 1 板英尺 = 144 立方英寸
} as const

// 计算限制
export const CALCULATION_LIMITS = {
  MIN_DIMENSION: 0.001,
  MAX_DIMENSION: 10000,
  MIN_PRICE: 0,
  MAX_PRICE: 10000,
  DEFAULT_PRECISION: 2,
  MAX_PIECES: 1000,
} as const

/**
 * 将任意长度单位转换为英寸
 */
export function convertToInches(value: number, unit: LengthUnit): number {
  if (!isValidDimension(value)) return 0

  switch (unit) {
    case "inches":
      return value * CONVERSION_CONSTANTS.INCHES_TO_INCHES
    case "feet":
      return value * CONVERSION_CONSTANTS.FEET_TO_INCHES
    case "cm":
      return value * CONVERSION_CONSTANTS.CM_TO_INCHES
    case "meters":
      return value * CONVERSION_CONSTANTS.METERS_TO_INCHES
    default:
      return 0
  }
}

/**
 * 将英寸转换为指定单位
 */
export function convertFromInches(inches: number, toUnit: LengthUnit): number {
  if (!isValidDimension(inches)) return 0

  switch (toUnit) {
    case "inches":
      return inches / CONVERSION_CONSTANTS.INCHES_TO_INCHES
    case "feet":
      return inches / CONVERSION_CONSTANTS.FEET_TO_INCHES
    case "cm":
      return inches / CONVERSION_CONSTANTS.CM_TO_INCHES
    case "meters":
      return inches / CONVERSION_CONSTANTS.METERS_TO_INCHES
    default:
      return 0
  }
}

/**
 * 单位转换
 */
export function convertUnit(
  value: number,
  fromUnit: LengthUnit,
  toUnit: LengthUnit
): ConversionResult {
  const inches = convertToInches(value, fromUnit)
  const convertedValue = convertFromInches(inches, toUnit)

  return {
    value: convertedValue,
    fromUnit,
    toUnit,
    originalValue: value,
  }
}

/**
 * 计算板英尺
 * 公式: (长度 × 宽度 × 厚度) ÷ 144 = 板英尺
 * 所有尺寸必须以英寸为单位
 */
export function calculateBoardFeet(
  dimensions: LumberDimensions,
  precision: PrecisionOption = 2
): number {
  // 转换所有尺寸为英寸
  const lengthInches = convertToInches(dimensions.length, dimensions.unit)
  const widthInches = convertToInches(dimensions.width, dimensions.unit)
  const thicknessInches = convertToInches(dimensions.thickness, dimensions.unit)

  // 验证尺寸
  if (
    !isValidDimension(lengthInches) ||
    !isValidDimension(widthInches) ||
    !isValidDimension(thicknessInches)
  ) {
    return 0
  }

  // 计算立方英寸
  const cubicInches = lengthInches * widthInches * thicknessInches

  // 转换为板英尺
  const boardFeet = cubicInches / CONVERSION_CONSTANTS.BOARD_FOOT_DIVISOR

  return roundToPrecision(boardFeet, precision)
}

/**
 * 完整的板英尺计算，包括成本
 */
export function calculateBoardFootResult(
  dimensions: LumberDimensions,
  pricePerBoardFoot?: number,
  precision: PrecisionOption = 2
): BoardFootResult {
  const boardFeet = calculateBoardFeet(dimensions, precision)

  let cost: number | undefined
  if (pricePerBoardFoot !== undefined && pricePerBoardFoot >= 0) {
    cost = roundToPrecision(boardFeet * pricePerBoardFoot, 2)
  }

  return {
    boardFeet,
    dimensions,
    cost,
    pricePerBoardFoot,
  }
}

/**
 * 验证尺寸是否有效
 */
export function isValidDimension(value: number): boolean {
  return (
    typeof value === "number" &&
    !isNaN(value) &&
    isFinite(value) &&
    value >= CALCULATION_LIMITS.MIN_DIMENSION &&
    value <= CALCULATION_LIMITS.MAX_DIMENSION
  )
}

/**
 * 验证价格是否有效
 */
export function isValidPrice(price: number): boolean {
  return (
    typeof price === "number" &&
    !isNaN(price) &&
    isFinite(price) &&
    price >= CALCULATION_LIMITS.MIN_PRICE &&
    price <= CALCULATION_LIMITS.MAX_PRICE
  )
}

/**
 * 验证木材尺寸输入
 */
export function validateLumberDimensions(dimensions: LumberDimensions): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 验证长度
  if (!isValidDimension(dimensions.length)) {
    errors.push("Length must be a valid positive number")
  } else if (dimensions.length < 1) {
    warnings.push("Length seems unusually small")
  } else if (dimensions.length > 500) {
    warnings.push("Length seems unusually large")
  }

  // 验证宽度
  if (!isValidDimension(dimensions.width)) {
    errors.push("Width must be a valid positive number")
  } else if (dimensions.width < 0.5) {
    warnings.push("Width seems unusually small")
  } else if (dimensions.width > 100) {
    warnings.push("Width seems unusually large")
  }

  // 验证厚度
  if (!isValidDimension(dimensions.thickness)) {
    errors.push("Thickness must be a valid positive number")
  } else if (dimensions.thickness < 0.25) {
    warnings.push("Thickness seems unusually small")
  } else if (dimensions.thickness > 50) {
    warnings.push("Thickness seems unusually large")
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
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

/**
 * 格式化数字显示
 */
export function formatNumber(value: number, precision: PrecisionOption = 2): string {
  if (!isValidDimension(value)) return "0"

  if (precision === 0) {
    return Math.round(value).toString()
  }

  return value.toFixed(precision)
}

/**
 * 格式化货币显示
 */
export function formatCurrency(value: number, currency: string = "USD"): string {
  if (!isValidPrice(value)) return "$0.00"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * 获取单位系统
 */
export function getUnitSystem(unit: LengthUnit): UnitSystem {
  return unit === "inches" || unit === "feet" ? "imperial" : "metric"
}

/**
 * 获取单位的显示名称
 */
export function getUnitDisplayName(unit: LengthUnit): string {
  const unitNames = {
    inches: "Inches",
    feet: "Feet",
    cm: "Centimeters",
    meters: "Meters",
  }
  return unitNames[unit]
}

/**
 * 获取单位的简短符号
 */
export function getUnitSymbol(unit: LengthUnit): string {
  const unitSymbols = {
    inches: "in",
    feet: "ft",
    cm: "cm",
    meters: "m",
  }
  return unitSymbols[unit]
}

/**
 * 解析用户输入的字符串为数字
 */
export function parseInputValue(input: string): number {
  // 移除非数字字符（除了小数点）
  const cleaned = input.replace(/[^\d.]/g, "")
  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? 0 : parsed
}

/**
 * 生成板英尺计算公式说明
 */
export function getBoardFootFormula(unit: LengthUnit): string {
  const unitSymbol = getUnitSymbol(unit)

  if (unit === "inches") {
    return `(Length × Width × Thickness) ÷ 144 = Board Feet`
  } else {
    return `Convert to inches, then: (Length × Width × Thickness) ÷ 144 = Board Feet`
  }
}

/**
 * 获取常用木材尺寸
 */
export function getCommonDimensions(): CommonDimension[] {
  return [
    {
      name: "1x4",
      nominal: { length: 96, width: 4, thickness: 1, unit: "inches" },
      actual: { length: 96, width: 3.5, thickness: 0.75, unit: "inches" },
      description: "Common board for trim and light construction",
      commonUses: ["Trim", "Shelving", "Light framing"],
    },
    {
      name: "1x6",
      nominal: { length: 96, width: 6, thickness: 1, unit: "inches" },
      actual: { length: 96, width: 5.5, thickness: 0.75, unit: "inches" },
      description: "Popular board for shelving and paneling",
      commonUses: ["Shelving", "Paneling", "Fence boards"],
    },
    {
      name: "1x8",
      nominal: { length: 96, width: 8, thickness: 1, unit: "inches" },
      actual: { length: 96, width: 7.25, thickness: 0.75, unit: "inches" },
      description: "Wide board for shelving and construction",
      commonUses: ["Wide shelving", "Stair treads", "Siding"],
    },
    {
      name: "2x4",
      nominal: { length: 96, width: 4, thickness: 2, unit: "inches" },
      actual: { length: 96, width: 3.5, thickness: 1.5, unit: "inches" },
      description: "Standard framing lumber",
      commonUses: ["Wall framing", "Studs", "General construction"],
    },
    {
      name: "2x6",
      nominal: { length: 96, width: 6, thickness: 2, unit: "inches" },
      actual: { length: 96, width: 5.5, thickness: 1.5, unit: "inches" },
      description: "Heavy framing and floor joists",
      commonUses: ["Floor joists", "Ceiling joists", "Heavy framing"],
    },
    {
      name: "2x8",
      nominal: { length: 96, width: 8, thickness: 2, unit: "inches" },
      actual: { length: 96, width: 7.25, thickness: 1.5, unit: "inches" },
      description: "Structural lumber for spans",
      commonUses: ["Floor joists", "Beams", "Deck framing"],
    },
    {
      name: "2x10",
      nominal: { length: 96, width: 10, thickness: 2, unit: "inches" },
      actual: { length: 96, width: 9.25, thickness: 1.5, unit: "inches" },
      description: "Large structural lumber",
      commonUses: ["Long span joists", "Beams", "Headers"],
    },
    {
      name: "2x12",
      nominal: { length: 96, width: 12, thickness: 2, unit: "inches" },
      actual: { length: 96, width: 11.25, thickness: 1.5, unit: "inches" },
      description: "Heavy structural lumber",
      commonUses: ["Long span beams", "Stair stringers", "Heavy construction"],
    },
  ]
}

/**
 * 获取常用木材种类和价格
 */
export function getCommonWoodSpecies(): WoodSpecies[] {
  return [
    {
      id: "pine",
      name: "Pine",
      commonName: "Southern Yellow Pine",
      averagePrice: 3.5,
      priceRange: { min: 2.5, max: 4.5 },
      density: 35,
      hardness: "softwood",
      description: "Affordable softwood, great for construction and general projects",
      commonUses: ["Framing", "Construction", "General carpentry", "Outdoor projects"],
    },
    {
      id: "oak",
      name: "Oak",
      commonName: "Red Oak",
      averagePrice: 8.75,
      priceRange: { min: 6.5, max: 12.0 },
      density: 45,
      hardness: "hardwood",
      description: "Strong, durable hardwood with attractive grain",
      commonUses: ["Furniture", "Flooring", "Cabinets", "Trim work"],
    },
    {
      id: "maple",
      name: "Maple",
      commonName: "Hard Maple",
      averagePrice: 9.25,
      priceRange: { min: 7.0, max: 13.0 },
      density: 44,
      hardness: "hardwood",
      description: "Dense, light-colored hardwood with fine grain",
      commonUses: ["Furniture", "Cutting boards", "Flooring", "Musical instruments"],
    },
    {
      id: "cedar",
      name: "Cedar",
      commonName: "Western Red Cedar",
      averagePrice: 5.25,
      priceRange: { min: 4.0, max: 7.0 },
      density: 23,
      hardness: "softwood",
      description: "Naturally rot-resistant softwood with pleasant aroma",
      commonUses: ["Outdoor furniture", "Decking", "Siding", "Closet lining"],
    },
    {
      id: "walnut",
      name: "Walnut",
      commonName: "Black Walnut",
      averagePrice: 15.5,
      priceRange: { min: 12.0, max: 20.0 },
      density: 38,
      hardness: "hardwood",
      description: "Premium hardwood with rich chocolate brown color",
      commonUses: ["Fine furniture", "Gunstocks", "Veneer", "Luxury projects"],
    },
    {
      id: "poplar",
      name: "Poplar",
      commonName: "Yellow Poplar",
      averagePrice: 4.75,
      priceRange: { min: 3.5, max: 6.5 },
      density: 28,
      hardness: "hardwood",
      description: "Soft hardwood, easy to work with, takes paint well",
      commonUses: ["Painted projects", "Trim", "Drawers", "Interior construction"],
    },
  ]
}

/**
 * 计算废料百分比
 */
export function calculateWithWaste(boardFeet: number, wastePercentage: number): number {
  if (wastePercentage < 0 || wastePercentage > 100) return boardFeet
  return boardFeet * (1 + wastePercentage / 100)
}

/**
 * 计算税费
 */
export function calculateWithTax(amount: number, taxRate: number): number {
  if (taxRate < 0 || taxRate > 100) return amount
  return amount * (1 + taxRate / 100)
}

/**
 * 验证精度值是否有效
 */
export function isValidPrecision(precision: number): precision is PrecisionOption {
  return [0, 1, 2, 3].includes(precision)
}
