import {
  type TableData,
  type TableCell,
  type TableConfig,
  OutputFormat,
  DEFAULT_TABLE_CONFIG,
} from "../types"
import { isPrimitive, getDataType, formatJSON } from "./json-parser"

// 导入 @json-table/core 核心功能

// 不用管这个报错，因为json-table/core 的类型定义文件没有正确生成
import { makeBlockFactory } from "@json-table/core/json-to-table"
import { blockToHTML } from "@json-table/core/block-to-html"
import { blockToASCII } from "@json-table/core/block-to-ascii"

// 核心类型定义
interface CoreBlock {
  height: number
  width: number
  data: {
    rows: CoreRow[]
    indexes: number[]
  }
}

interface CoreRow {
  cells: CoreCell[]
  columns: number[]
}

interface CoreCell {
  height: number
  width: number
  value: any
  type: string
}

/**
 * JSON 数据转换为表格 - 使用 @json-table/core 的正确实现
 */
export function jsonToTable(data: unknown, config: Partial<TableConfig> = {}): TableData {
  const finalConfig = { ...DEFAULT_TABLE_CONFIG, ...config }

  // 转换配置为 @json-table/core 格式
  const coreOptions = {
    cornerCellValue: finalConfig.cornerCellValue,
    joinPrimitiveArrayValues: finalConfig.joinArrayValues,
    combineArraysOfObjects: false,
    stabilizeOrderOfPropertiesInArraysOfObjects: true,
    proportionalSizeAdjustmentThreshold: 1,
    collapseIndexes: false,
  }

  // 使用 @json-table/core 的正确算法
  const makeBlock = makeBlockFactory(coreOptions)
  const block = makeBlock(data as any) as CoreBlock

  return blockToTableData(block, finalConfig)
}

// 核心转换逻辑由 @json-table/core 处理

/**
 * 创建表格矩阵并跟踪单元格占位
 */
function createTableMatrix(block: CoreBlock): {
  matrix: (TableCell | null)[][]
  cellMap: Map<string, TableCell>
} {
  const matrix: (TableCell | null)[][] = Array(block.height)
    .fill(null)
    .map(() => Array(block.width).fill(null))

  const cellMap = new Map<string, TableCell>()
  const placed = new Set<CoreCell>()

  // 遍历所有行和单元格
  for (let rowIndex = 0; rowIndex < block.data.rows.length; rowIndex++) {
    const row = block.data.rows[rowIndex]
    const absoluteRowIndex = block.data.indexes[rowIndex]

    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      const cell = row.cells[cellIndex]
      const absoluteColIndex = row.columns[cellIndex]

      // 避免重复放置同一个单元格
      if (placed.has(cell)) continue
      placed.add(cell)

      // 创建TableCell，处理类型转换
      const tableCell: TableCell = {
        type:
          cell.type === "header" || cell.type === "corner" || cell.type === "index"
            ? "header"
            : "data",
        value: String(cell.value),
        rowSpan: cell.height,
        colSpan: cell.width,
      }

      const cellId = `${absoluteRowIndex}-${absoluteColIndex}`
      cellMap.set(cellId, tableCell)

      // 在矩阵中标记占位
      for (let r = absoluteRowIndex; r < absoluteRowIndex + cell.height && r < block.height; r++) {
        for (let c = absoluteColIndex; c < absoluteColIndex + cell.width && c < block.width; c++) {
          if (matrix[r][c] === null) {
            matrix[r][c] =
              r === absoluteRowIndex && c === absoluteColIndex ? tableCell : ("occupied" as any)
          }
        }
      }
    }
  }

  return { matrix, cellMap }
}

/**
 * 将 Block 转换为 TableData
 */
function blockToTableData(block: CoreBlock, config: TableConfig): TableData {
  const { matrix } = createTableMatrix(block)

  // 转换矩阵为行数组，过滤掉占位符
  const rows: TableCell[][] = matrix.map(
    (row) =>
      row.filter(
        (cell) => cell !== null && typeof cell === "object" && "type" in cell
      ) as TableCell[]
  )

  // 提取表头（第一行的实际单元格）
  const headers = rows.length > 0 ? rows[0].map((cell) => cell.value) : []

  return {
    headers,
    rows,
    metadata: {
      totalRows: block.height,
      totalColumns: block.width,
      dataType: "nested-structure",
    },
    originalBlock: block, // 保存原始 Block 数据用于正确渲染
  }
}

/**
 * 格式化值为字符串
 */
function formatValue(value: unknown): string {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return JSON.stringify(value)
}

/**
 * 渲染 HTML 表格 - 使用 @json-table/core 的正确实现
 */
export function renderHTMLTable(data: TableData): string {
  // 如果有原始 Block 数据，直接使用 @json-table/core 渲染（保持合并表格功能）
  if (data.originalBlock) {
    const coreHTML = blockToHTML(data.originalBlock)
    // 为 @json-table/core 生成的HTML添加基本的Tailwind样式
    return addTailwindStylesToCoreHTML(coreHTML)
  }

  // 否则使用 Tailwind CSS 渲染
  return renderHTMLTableWithTailwind(data)
}

/**
 * 为 @json-table/core 生成的HTML添加Tailwind样式
 */
function addTailwindStylesToCoreHTML(html: string): string {
  // 为table标签添加Tailwind类名
  let styledHTML = html.replace(
    /<table[^>]*>/g,
    `<table class="w-full border-separate border-spacing-0 border-2 border-orange-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-xl">`
  )

  // 为th标签添加样式
  styledHTML = styledHTML.replace(
    /<th([^>]*)>/g,
    `<th$1 class="bg-gradient-to-r from-orange-500/30 via-red-500/25 to-pink-500/30 text-white font-bold text-sm uppercase tracking-wider px-6 py-4 text-center border-b-2 border-orange-500/40 border-r border-orange-500/20 sticky top-0 z-10">`
  )

  // 为td标签添加样式
  styledHTML = styledHTML.replace(
    /<td([^>]*)>/g,
    `<td$1 class="px-6 py-4 text-white/90 text-sm border-b border-orange-500/10 border-r border-orange-500/8 transition-all duration-300">`
  )

  // 为tr标签添加样式和交替背景色
  let rowIndex = 0
  styledHTML = styledHTML.replace(/<tr([^>]*)>/g, (match, attrs) => {
    const isEven = rowIndex % 2 === 0
    const bgClass = isEven
      ? "bg-gradient-to-r from-orange-500/5 via-red-500/3 to-pink-500/5"
      : "bg-gradient-to-r from-white/3 via-orange-500/2 to-white/3"

    rowIndex++
    return `<tr${attrs} class="${bgClass} hover:bg-gradient-to-r hover:from-orange-500/15 hover:via-red-500/10 hover:to-pink-500/12 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer transition-all duration-300 border-b border-orange-500/8">`
  })

  return styledHTML
}

/**
 * 使用 Tailwind CSS 渲染现代化表格
 */
function renderHTMLTableWithTailwind(data: TableData): string {
  const { rows, metadata } = data

  if (!rows || rows.length === 0) {
    return '<div class="text-center text-slate-400 py-8">No data to display</div>'
  }

  // 构建表格HTML
  const tableClasses = [
    "w-full",
    "border-separate",
    "border-spacing-0",
    "border-2",
    "border-orange-500/40",
    "rounded-2xl",
    "overflow-hidden",
    "shadow-2xl",
    "shadow-black/30",
    "bg-gradient-to-br",
    "from-slate-900/95",
    "to-slate-800/90",
    "backdrop-blur-xl",
  ].join(" ")

  const headerClasses = [
    "bg-gradient-to-r",
    "from-orange-500/30",
    "via-red-500/25",
    "to-pink-500/30",
    "text-white",
    "font-bold",
    "text-sm",
    "uppercase",
    "tracking-wider",
    "px-6",
    "py-4",
    "text-center",
    "border-b-2",
    "border-orange-500/40",
    "border-r",
    "border-orange-500/20",
    "sticky",
    "top-0",
    "z-10",
  ].join(" ")

  const cellClasses = [
    "px-6",
    "py-4",
    "text-white/90",
    "text-sm",
    "border-b",
    "border-orange-500/10",
    "border-r",
    "border-orange-500/8",
    "transition-all",
    "duration-300",
  ].join(" ")

  const rowEvenClasses = [
    "bg-gradient-to-r",
    "from-orange-500/5",
    "via-red-500/3",
    "to-pink-500/5",
  ].join(" ")

  const rowOddClasses = ["bg-gradient-to-r", "from-white/3", "via-orange-500/2", "to-white/3"].join(
    " "
  )

  const rowHoverClasses = [
    "hover:bg-gradient-to-r",
    "hover:from-orange-500/15",
    "hover:via-red-500/10",
    "hover:to-pink-500/12",
    "hover:transform",
    "hover:-translate-y-0.5",
    "hover:shadow-lg",
    "hover:shadow-orange-500/20",
    "cursor-pointer",
  ].join(" ")

  // 生成表头
  const headers = rows[0]?.map((cell) => cell.value) || []
  const headerRow = headers
    .map(
      (header, index) =>
        `<th class="${headerClasses} ${index === headers.length - 1 ? "border-r-0" : ""}">${header}</th>`
    )
    .join("")

  // 生成数据行
  const dataRows = rows
    .slice(1)
    .map((row, rowIndex) => {
      const isEven = rowIndex % 2 === 0
      const rowBgClass = isEven ? rowEvenClasses : rowOddClasses

      const cells = row
        .map((cell, cellIndex) => {
          const isLastCell = cellIndex === row.length - 1
          const cellClass = `${cellClasses} ${isLastCell ? "border-r-0" : ""}`
          return `<td class="${cellClass}">${cell.value || ""}</td>`
        })
        .join("")

      return `<tr class="${rowBgClass} ${rowHoverClasses} border-b border-orange-500/8">${cells}</tr>`
    })
    .join("")

  return `
    <table class="${tableClasses}">
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${dataRows}
      </tbody>
    </table>
  `
}

/**
 * 从矩阵数据渲染HTML表格 (备用方法)
 */
function renderHTMLTableFromMatrix(data: TableData): string {
  const { metadata } = data
  const { totalRows, totalColumns } = metadata

  // 创建表格矩阵来跟踪单元格占位
  const matrix: (TableCell | "occupied" | null)[][] = Array(totalRows)
    .fill(null)
    .map(() => Array(totalColumns).fill(null))

  // 收集所有单元格并按位置排序
  const allCells: Array<{ cell: TableCell; row: number; col: number }> = []

  let currentRow = 0
  let currentCol = 0

  // 遍历所有行的单元格
  for (const row of data.rows) {
    currentCol = 0
    for (const cell of row) {
      // 找到下一个可用位置
      while (
        currentCol < totalColumns &&
        matrix[currentRow] &&
        matrix[currentRow][currentCol] !== null
      ) {
        currentCol++
      }

      if (currentCol < totalColumns && currentRow < totalRows) {
        allCells.push({ cell, row: currentRow, col: currentCol })

        // 标记占位区域
        const rowSpan = cell.rowSpan || 1
        const colSpan = cell.colSpan || 1

        for (let r = currentRow; r < Math.min(currentRow + rowSpan, totalRows); r++) {
          for (let c = currentCol; c < Math.min(currentCol + colSpan, totalColumns); c++) {
            if (matrix[r] && matrix[r][c] === null) {
              matrix[r][c] = r === currentRow && c === currentCol ? cell : "occupied"
            }
          }
        }

        currentCol += colSpan
      }
    }
    currentRow++
  }

  // 生成HTML
  const htmlRows: string[] = []

  for (let r = 0; r < totalRows; r++) {
    const rowCells: string[] = []

    for (let c = 0; c < totalColumns; c++) {
      const cellData = matrix[r][c]

      if (cellData && cellData !== "occupied") {
        const cell = cellData as TableCell
        const tag =
          cell.type === "header" || cell.type === "corner" || cell.type === "index" ? "th" : "td"
        const rowSpanAttr = cell.rowSpan && cell.rowSpan > 1 ? ` rowspan="${cell.rowSpan}"` : ""
        const colSpanAttr = cell.colSpan && cell.colSpan > 1 ? ` colspan="${cell.colSpan}"` : ""
        const cssClass = `cell-${cell.type}`
        const content = cell.value || "&nbsp;"

        rowCells.push(`<${tag} class="${cssClass}"${rowSpanAttr}${colSpanAttr}>${content}</${tag}>`)
      }
    }

    if (rowCells.length > 0) {
      htmlRows.push(`<tr>${rowCells.join("")}</tr>`)
    }
  }

  return `<table class="json-table">${htmlRows.join("")}</table>`
}

/**
 * 渲染 ASCII 表格 - 使用 @json-table/core 的正确实现
 */
export function renderASCIITable(data: TableData): string {
  // 如果有原始 Block 数据，直接使用 @json-table/core 渲染
  if (data.originalBlock) {
    return blockToASCII(data.originalBlock)
  }

  // 否则使用简化的 ASCII 渲染
  const { rows } = data
  const lines: string[] = []

  for (const row of rows) {
    const line = row.map((cell) => cell.value || "").join(" | ")
    lines.push(`| ${line} |`)
  }

  return lines.join("\n")
}

/**
 * 渲染 JSON 格式
 */
export function renderJSON(data: TableData): string {
  return formatJSON(data, 2)
}
