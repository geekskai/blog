// 转换结果接口
export interface ConversionResult {
  inches: number
  pixels: number
  ppi: number
}

// 精度选项
export type PrecisionOption = 0 | 1 | 2 | 3

// 复制状态类型
export type CopyStatus = "idle" | "copying" | "copied" | "error"

// 转换方向类型
export type ConversionDirection = "inches-to-pixels" | "pixels-to-inches"
