import type { ConversionResult } from "../types"

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback for older browsers
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
  } catch (err) {
    console.error("Failed to copy text: ", err)
    return false
  }
}

/**
 * Format conversion result for copying
 */
export function formatForClipboard(
  result: ConversionResult,
  format: "decimal-only" | "fraction-only" | "both" | "detailed" = "both"
): string {
  switch (format) {
    case "decimal-only":
      return result.formatted

    case "fraction-only": {
      if (result.wholeNumber > 0 && result.fraction) {
        return `${result.wholeNumber} ${result.fraction.numerator}/${result.fraction.denominator}`
      } else if (result.fraction) {
        return `${result.fraction.numerator}/${result.fraction.denominator}`
      } else {
        return result.wholeNumber.toString()
      }
    }

    case "both": {
      const fractionStr = result.input
      return `${fractionStr} = ${result.formatted}"`
    }

    case "detailed": {
      const lines = [
        `Input: ${result.input}`,
        `Decimal: ${result.formatted}"`,
        `Timestamp: ${result.timestamp.toLocaleString()}`,
      ]

      if (result.commonEquivalents.length > 0) {
        const equivalents = result.commonEquivalents
          .map((f) => `${f.numerator}/${f.denominator}`)
          .join(", ")
        lines.push(`Equivalents: ${equivalents}`)
      }

      return lines.join("\n")
    }

    default:
      return result.formatted
  }
}

/**
 * Copy conversion result with user feedback
 */
export async function copyConversionResult(
  result: ConversionResult,
  format: "decimal-only" | "fraction-only" | "both" | "detailed" = "both"
): Promise<{ success: boolean; message: string }> {
  try {
    const text = formatForClipboard(result, format)
    const success = await copyToClipboard(text)

    if (success) {
      return {
        success: true,
        message: `Copied: ${text}`,
      }
    } else {
      return {
        success: false,
        message: "Failed to copy to clipboard",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Copy operation failed",
    }
  }
}

/**
 * Share conversion result via Web Share API or fallback
 */
export async function shareConversionResult(
  result: ConversionResult,
  title: string = "Inches to Decimal Conversion"
): Promise<{ success: boolean; message: string }> {
  const text = formatForClipboard(result, "both")
  const url = window.location.href

  try {
    // Try Web Share API first (mobile browsers)
    if (navigator.share) {
      await navigator.share({
        title,
        text: `${text}\n\nConverted using Inches to Decimal Converter`,
        url,
      })
      return {
        success: true,
        message: "Shared successfully",
      }
    }

    // Fallback to clipboard
    const success = await copyToClipboard(`${text}\n\nConverted using: ${url}`)
    return {
      success,
      message: success ? "Copied to clipboard for sharing" : "Failed to prepare for sharing",
    }
  } catch (error) {
    // User cancelled share or error occurred
    return {
      success: false,
      message: "Share cancelled or failed",
    }
  }
}

/**
 * Export conversion history to different formats
 */
export function exportConversionHistory(
  conversions: ConversionResult[],
  format: "csv" | "json" | "txt" = "csv"
): { content: string; filename: string; mimeType: string } {
  const timestamp = new Date().toISOString().split("T")[0]

  switch (format) {
    case "csv": {
      const headers = ["Input", "Decimal Result", "Timestamp"]
      const rows = conversions.map((c) => [`"${c.input}"`, c.formatted, c.timestamp.toISOString()])

      const content = [headers, ...rows].map((row) => row.join(",")).join("\n")

      return {
        content,
        filename: `inches-to-decimal-conversions-${timestamp}.csv`,
        mimeType: "text/csv",
      }
    }

    case "json": {
      const content = JSON.stringify(
        {
          exportDate: new Date().toISOString(),
          conversions: conversions.map((c) => ({
            input: c.input,
            decimal: c.decimal,
            formatted: c.formatted,
            timestamp: c.timestamp.toISOString(),
          })),
        },
        null,
        2
      )

      return {
        content,
        filename: `inches-to-decimal-conversions-${timestamp}.json`,
        mimeType: "application/json",
      }
    }

    case "txt": {
      const content = [
        "Inches to Decimal Conversion History",
        `Exported: ${new Date().toLocaleString()}`,
        "",
        ...conversions.map((c) => `${c.input} = ${c.formatted}" (${c.timestamp.toLocaleString()})`),
      ].join("\n")

      return {
        content,
        filename: `inches-to-decimal-conversions-${timestamp}.txt`,
        mimeType: "text/plain",
      }
    }

    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

/**
 * Download exported data as file
 */
export function downloadExportedData(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
