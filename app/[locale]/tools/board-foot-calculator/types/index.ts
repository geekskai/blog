// 单位类型
export type LengthUnit = "inches" | "feet" | "cm" | "meters"
export type UnitSystem = "imperial" | "metric"

// 木材尺寸接口
export interface LumberDimensions {
  length: number
  width: number
  thickness: number
  unit: LengthUnit
}

// 板英尺计算结果接口
export interface BoardFootResult {
  boardFeet: number
  dimensions: LumberDimensions
  cost?: number
  pricePerBoardFoot?: number
}

// 项目中的木材件接口
export interface LumberPiece {
  id: string
  name: string
  dimensions: LumberDimensions
  quantity: number
  pricePerBoardFoot?: number
  boardFeet: number
  totalBoardFeet: number
  cost: number
  totalCost: number
}

// 项目接口
export interface Project {
  id: string
  name: string
  pieces: LumberPiece[]
  totalBoardFeet: number
  totalCost: number
  wastePercentage: number
  taxRate: number
  createdAt: Date
  updatedAt: Date
}

// 计算配置接口
export interface CalculationConfig {
  precision: PrecisionOption
  unitSystem: UnitSystem
  defaultUnit: LengthUnit
  wastePercentage: number
  taxRate: number
}

// 精度选项
export type PrecisionOption = 0 | 1 | 2 | 3

// 复制状态类型
export type CopyStatus = "idle" | "copying" | "copied" | "error"

// 木材种类接口
export interface WoodSpecies {
  id: string
  name: string
  commonName: string
  averagePrice: number
  priceRange: {
    min: number
    max: number
  }
  density: number
  hardness: "softwood" | "hardwood"
  description: string
  commonUses: string[]
}

// 常用尺寸接口
export interface CommonDimension {
  name: string
  nominal: LumberDimensions
  actual: LumberDimensions
  description: string
  commonUses: string[]
}

// 转换结果接口
export interface ConversionResult {
  value: number
  fromUnit: LengthUnit
  toUnit: LengthUnit
  originalValue: number
}

// 计算历史记录接口
export interface CalculationHistory {
  id: string
  timestamp: Date
  dimensions: LumberDimensions
  result: BoardFootResult
  projectId?: string
}

// 组件 Props 接口
export interface CalculatorProps {
  defaultDimensions?: Partial<LumberDimensions>
  defaultPrecision?: PrecisionOption
  defaultUnitSystem?: UnitSystem
  onCalculate?: (result: BoardFootResult) => void
}

export interface ProjectManagerProps {
  project?: Project
  onProjectUpdate?: (project: Project) => void
  onPieceAdd?: (piece: LumberPiece) => void
  onPieceRemove?: (pieceId: string) => void
}

// 表单验证接口
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// 导出选项接口
export interface ExportOptions {
  format: "pdf" | "csv" | "json"
  includeCalculations: boolean
  includeCosts: boolean
  includeFormulas: boolean
}

// 价格数据接口
export interface PriceData {
  species: string
  grade: string
  pricePerBoardFoot: number
  currency: string
  region: string
  lastUpdated: Date
}
