// 转换单位类型
export type ConversionUnit = "cm" | "pm"

// 转换方向类型
export type ConversionDirection = "cm-to-pm" | "pm-to-cm"

// 转换结果接口
export interface ConversionResult {
  input: number
  output: number
  inputUnit: ConversionUnit
  outputUnit: ConversionUnit
  precision: PrecisionOption
  scientificNotation: string
  formula: string
}

// 科学记数法接口
export interface ScientificNotation {
  coefficient: number
  exponent: number
  formatted: string
}

// 转换历史记录接口
export interface ConversionHistory {
  id: string
  timestamp: Date
  result: ConversionResult
}

// 精度选项 (0-6 decimal places as per PRD)
export type PrecisionOption = 0 | 1 | 2 | 3 | 4 | 5 | 6

// 显示格式类型
export type DisplayFormat = "standard" | "scientific"

// 组件 Props 接口
export interface ConverterProps {
  defaultValue?: number
  defaultUnit?: ConversionUnit
  defaultPrecision?: PrecisionOption
  defaultFormat?: DisplayFormat
  onConvert?: (result: ConversionResult) => void
}

// 验证结果接口
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// 复制状态类型
export type CopyStatus = "idle" | "copying" | "copied" | "error"

// 原子尺度示例接口
export interface AtomicScaleExample {
  name: string
  size: number // in picometers
  description: string
  category: "atom" | "molecule" | "bond" | "structure"
}

// 教育内容接口
export interface EducationalContent {
  title: string
  description: string
  examples: AtomicScaleExample[]
  applications: string[]
}
