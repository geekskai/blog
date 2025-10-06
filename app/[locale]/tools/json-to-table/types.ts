// 数据源类型定义
export enum SourceType {
  Text = "text",
  File = "file",
  URL = "url",
}

// 数据源接口
export type DataSource = {
  data: string
} & (
  | {
      type: SourceType.Text
    }
  | {
      type: SourceType.File
      fileName: string
    }
  | {
      type: SourceType.URL
    }
)

// 输出格式
export enum OutputFormat {
  HTML = "HTML",
  ASCII = "ASCII",
  JSON = "JSON",
}

// 表格配置选项
export interface TableConfig {
  format: OutputFormat
  showLineNumbers: boolean
  compactMode: boolean
  maxDepth: number
  cornerCellValue: string
  joinArrayValues: boolean
}

// 默认配置
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  format: OutputFormat.HTML,
  showLineNumbers: true,
  compactMode: false,
  maxDepth: 10,
  cornerCellValue: "№",
  joinArrayValues: true,
}

// JSON 解析结果
export enum JSONParseStatus {
  Ok = "ok",
  Error = "error",
}

export type JSONParseResult<T, E> =
  | {
      status: JSONParseStatus.Ok
      data: T
    }
  | {
      status: JSONParseStatus.Error
      error: E
    }

// 表格单元格
export interface TableCell {
  value: string
  type: "header" | "data" | "corner" | "index"
  rowSpan?: number
  colSpan?: number
}

// 表格结构
export interface TableData {
  headers: string[]
  rows: TableCell[][]
  metadata: {
    totalRows: number
    totalColumns: number
    dataType: string
  }
  originalBlock?: any // 保存原始 Block 数据用于正确渲染
}

// 错误类型
export interface ProcessingError {
  type: "parse" | "network" | "file" | "processing"
  message: string
  details?: string
}
