import type { CopyStatus, BoardFootResult, LumberPiece, Project } from "../types"
import { formatNumber, formatCurrency, getUnitSymbol } from "./calculator"

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // 降级到传统方法
    return fallbackCopyToClipboard(text)
  } catch (error) {
    console.warn("Failed to copy to clipboard:", error)
    return false
  }
}

/**
 * 传统的复制到剪贴板方法（降级方案）
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const successful = document.execCommand("copy")
    document.body.removeChild(textArea)

    return successful
  } catch (error) {
    console.warn("Fallback copy failed:", error)
    return false
  }
}

/**
 * 格式化板英尺计算结果为复制文本
 */
export function formatBoardFootResult(result: BoardFootResult): string {
  const { dimensions, boardFeet, cost, pricePerBoardFoot } = result
  const unitSymbol = getUnitSymbol(dimensions.unit)

  let text = `Board Foot Calculation:
Length: ${formatNumber(dimensions.length, 2)} ${unitSymbol}
Width: ${formatNumber(dimensions.width, 2)} ${unitSymbol}
Thickness: ${formatNumber(dimensions.thickness, 2)} ${unitSymbol}
Board Feet: ${formatNumber(boardFeet, 3)}`

  if (pricePerBoardFoot !== undefined && cost !== undefined) {
    text += `
Price per Board Foot: ${formatCurrency(pricePerBoardFoot)}
Total Cost: ${formatCurrency(cost)}`
  }

  return text
}

/**
 * 格式化木材件信息为复制文本
 */
export function formatLumberPiece(piece: LumberPiece): string {
  const unitSymbol = getUnitSymbol(piece.dimensions.unit)

  let text = `${piece.name}:
Dimensions: ${formatNumber(piece.dimensions.length, 2)} × ${formatNumber(piece.dimensions.width, 2)} × ${formatNumber(piece.dimensions.thickness, 2)} ${unitSymbol}
Quantity: ${piece.quantity}
Board Feet per piece: ${formatNumber(piece.boardFeet, 3)}
Total Board Feet: ${formatNumber(piece.totalBoardFeet, 3)}`

  if (piece.pricePerBoardFoot !== undefined) {
    text += `
Price per Board Foot: ${formatCurrency(piece.pricePerBoardFoot)}
Cost per piece: ${formatCurrency(piece.cost)}
Total Cost: ${formatCurrency(piece.totalCost)}`
  }

  return text
}

/**
 * 格式化项目信息为复制文本
 */
export function formatProject(project: Project): string {
  let text = `Project: ${project.name}
Created: ${project.createdAt.toLocaleDateString()}
Total Pieces: ${project.pieces.length}
Total Board Feet: ${formatNumber(project.totalBoardFeet, 3)}`

  if (project.wastePercentage > 0) {
    const wasteAmount = project.totalBoardFeet * (project.wastePercentage / 100)
    const totalWithWaste = project.totalBoardFeet + wasteAmount
    text += `
Waste Percentage: ${project.wastePercentage}%
Board Feet with Waste: ${formatNumber(totalWithWaste, 3)}`
  }

  text += `
Total Cost: ${formatCurrency(project.totalCost)}`

  if (project.taxRate > 0) {
    const taxAmount = project.totalCost * (project.taxRate / 100)
    const totalWithTax = project.totalCost + taxAmount
    text += `
Tax Rate: ${project.taxRate}%
Total with Tax: ${formatCurrency(totalWithTax)}`
  }

  text += `

Lumber Pieces:`

  project.pieces.forEach((piece, index) => {
    text += `
${index + 1}. ${formatLumberPiece(piece)}`
  })

  return text
}

/**
 * 格式化简单的计算结果
 */
export function formatSimpleResult(
  boardFeet: number,
  cost?: number,
  pricePerBoardFoot?: number
): string {
  let text = `Board Feet: ${formatNumber(boardFeet, 3)}`

  if (pricePerBoardFoot !== undefined && cost !== undefined) {
    text += ` | Cost: ${formatCurrency(cost)} (${formatCurrency(pricePerBoardFoot)}/bf)`
  }

  return text
}

/**
 * 格式化尺寸信息
 */
export function formatDimensions(
  length: number,
  width: number,
  thickness: number,
  unit: string
): string {
  return `${formatNumber(length, 2)} × ${formatNumber(width, 2)} × ${formatNumber(thickness, 2)} ${unit}`
}

/**
 * 创建复制状态管理 Hook 的工具函数
 */
export function createCopyStatusManager() {
  let timeoutId: NodeJS.Timeout | null = null

  return {
    setCopyStatus: (
      status: CopyStatus,
      callback: (status: CopyStatus) => void,
      resetDelay: number = 2000
    ) => {
      callback(status)

      // 清除之前的定时器
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // 如果是成功或错误状态，设置自动重置
      if (status === "copied" || status === "error") {
        timeoutId = setTimeout(() => {
          callback("idle")
          timeoutId = null
        }, resetDelay)
      }
    },

    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    },
  }
}

/**
 * 生成CSV格式的项目数据
 */
export function generateProjectCSV(project: Project): string {
  const headers = [
    "Piece Name",
    "Length",
    "Width",
    "Thickness",
    "Unit",
    "Quantity",
    "Board Feet per Piece",
    "Total Board Feet",
    "Price per Board Foot",
    "Cost per Piece",
    "Total Cost",
  ]

  let csv = headers.join(",") + "\n"

  project.pieces.forEach((piece) => {
    const row = [
      `"${piece.name}"`,
      formatNumber(piece.dimensions.length, 3),
      formatNumber(piece.dimensions.width, 3),
      formatNumber(piece.dimensions.thickness, 3),
      piece.dimensions.unit,
      piece.quantity.toString(),
      formatNumber(piece.boardFeet, 3),
      formatNumber(piece.totalBoardFeet, 3),
      piece.pricePerBoardFoot ? formatNumber(piece.pricePerBoardFoot, 2) : "",
      formatNumber(piece.cost, 2),
      formatNumber(piece.totalCost, 2),
    ]
    csv += row.join(",") + "\n"
  })

  // 添加总计行
  csv += "\n"
  csv += `"TOTALS",,,,,,${formatNumber(project.totalBoardFeet, 3)},,,${formatNumber(project.totalCost, 2)}\n`

  if (project.wastePercentage > 0) {
    const wasteAmount = project.totalBoardFeet * (project.wastePercentage / 100)
    const totalWithWaste = project.totalBoardFeet + wasteAmount
    csv += `"With ${project.wastePercentage}% Waste",,,,,,${formatNumber(totalWithWaste, 3)},,,\n`
  }

  if (project.taxRate > 0) {
    const taxAmount = project.totalCost * (project.taxRate / 100)
    const totalWithTax = project.totalCost + taxAmount
    csv += `"With ${project.taxRate}% Tax",,,,,,,,${formatNumber(totalWithTax, 2)}\n`
  }

  return csv
}

/**
 * 下载文本文件
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 下载项目为CSV文件
 */
export function downloadProjectAsCSV(project: Project): void {
  const csv = generateProjectCSV(project)
  const filename = `${project.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_board_feet.csv`
  downloadTextFile(csv, filename, "text/csv")
}
