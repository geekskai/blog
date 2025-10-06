// 转换单位类型
export type ConversionUnit = "cm" | "tommer"

// 转换方向类型
export type ConversionDirection = "cm-to-tommer" | "tommer-to-cm"

// 转换结果接口
export interface ConversionResult {
  input: number
  output: number
  inputUnit: ConversionUnit
  outputUnit: ConversionUnit
  precision: number
}

// 转换历史记录接口
export interface ConversionHistory {
  id: string
  timestamp: Date
  result: ConversionResult
}

// 精度选项
export type PrecisionOption = 0 | 1 | 2 | 3

// 组件 Props 接口
export interface ConverterProps {
  defaultValue?: number
  defaultUnit?: ConversionUnit
  defaultPrecision?: PrecisionOption
  onConvert?: (result: ConversionResult) => void
}

// 滑动条配置接口
export interface SliderConfig {
  min: number
  max: number
  step: number
  unit: ConversionUnit
}

// 复制状态类型
export type CopyStatus = "idle" | "copying" | "copied" | "error"
