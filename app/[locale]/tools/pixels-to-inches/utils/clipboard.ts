import type { ConversionResult } from "../types"
import { formatNumber } from "./converter"

/**
 * 复制转换结果到剪贴板
 */
export async function copyConversionResult(
  result: ConversionResult,
  format: "simple" | "detailed" = "detailed"
): Promise<boolean> {
  try {
    let text = ""

    if (format === "simple") {
      text = `${result.inches} inches = ${result.pixels} pixels (${result.ppi} PPI)`
    } else {
      text = `Pixels to Inches Conversion Result:
Inches: ${formatNumber(result.inches, 2)}
Pixels: ${formatNumber(result.pixels, 0)}
PPI: ${result.ppi}

Formula: ${result.inches > 0 ? `Inches × ${result.ppi} = Pixels` : `Pixels ÷ ${result.ppi} = Inches`}`
    }

    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    return false
  }
}
