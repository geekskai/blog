// 转换单位类型
export type ConversionUnit = "cm" | "tommer"

// 转换方向类型
export type ConversionDirection = "cm-til-tommer" | "tommer-til-cm"

// 转换结果接口
export interface ConversionResult {
  input: number
  output: number
  inputUnit: ConversionUnit
  outputUnit: ConversionUnit
  precision: number
  formula: string
}

// 转换历史记录接口
export interface ConversionHistory {
  id: string
  timestamp: Date
  result: ConversionResult
}

// 精度选项
export type PrecisionOption = 0 | 1 | 2 | 3

// 批量转换项
export interface BatchConversionItem {
  id: string
  input: number
  inputUnit: ConversionUnit
  result?: ConversionResult
}

// 组件 Props 接口
export interface ConverterProps {
  defaultValue?: number
  defaultUnit?: ConversionUnit
  defaultPrecision?: PrecisionOption
  onConvert?: (result: ConversionResult) => void
  enableBatchMode?: boolean
}

// 语言设置类型
export type Language = "da" | "no" | "en"

// 复制状态类型
export type CopyStatus = "idle" | "copying" | "copied" | "error"

// 预设值配置
export interface PresetValue {
  value: number
  unit: ConversionUnit
  label: string
  category: "common" | "furniture" | "construction" | "electronics"
}

// 转换模式
export type ConversionMode = "single" | "batch" | "preset"

// 工具配置接口
export interface ToolConfig {
  language: Language
  mode: ConversionMode
  precision: PrecisionOption
  showFormula: boolean
  enableHistory: boolean
}
