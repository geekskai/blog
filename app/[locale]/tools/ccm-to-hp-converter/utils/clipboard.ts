import type { CopyStatus, ConversionResult } from "../types"

/**
 * Copy text to clipboard with fallback support
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API (preferred)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback for older browsers
    return fallbackCopyToClipboard(text)
  } catch (error) {
    console.warn("Failed to copy to clipboard:", error)
    return false
  }
}

/**
 * Fallback clipboard method for older browsers
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
 * Format conversion result for copying
 */
export function formatCopyText(result: ConversionResult): string {
  const { input, output, inputUnit, outputUnit, engineConfig } = result

  if (inputUnit === "ccm") {
    return `${input}cc ${engineConfig.description} ≈ ${output}hp (${result.outputRange.min}-${result.outputRange.max}hp range)`
  } else {
    return `${input}hp ${engineConfig.description} ≈ ${output}cc (${result.outputRange.min}-${result.outputRange.max}cc range)`
  }
}

/**
 * Format conversion result for sharing
 */
export function formatShareText(result: ConversionResult): string {
  const copyText = formatCopyText(result)
  return `${copyText}\n\nCalculated using CCM to HP Converter - https://geekskai.com/tools/ccm-to-hp-converter/`
}

/**
 * Copy conversion result with proper formatting
 */
export async function copyConversionResult(result: ConversionResult): Promise<boolean> {
  const text = formatCopyText(result)
  return await copyToClipboard(text)
}

/**
 * Share conversion result (for social media or messaging)
 */
export async function shareConversionResult(result: ConversionResult): Promise<boolean> {
  const text = formatShareText(result)

  // Use Web Share API if available
  if (navigator.share) {
    try {
      await navigator.share({
        title: "CCM to HP Conversion Result",
        text: text,
        url: "https://geekskai.com/tools/ccm-to-hp-converter/",
      })
      return true
    } catch (error) {
      // User cancelled or error occurred, fallback to clipboard
      return await copyToClipboard(text)
    }
  }

  // Fallback to clipboard
  return await copyToClipboard(text)
}

/**
 * Generate shareable URL with conversion parameters
 */
export function generateShareableUrl(result: ConversionResult): string {
  const baseUrl = "https://geekskai.com/tools/ccm-to-hp-converter/"
  const params = new URLSearchParams({
    input: result.input.toString(),
    type: result.engineConfig.type,
    fuel: result.engineConfig.fuelSystem,
    direction: result.inputUnit === "ccm" ? "ccm-to-hp" : "hp-to-ccm",
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * Copy shareable URL to clipboard
 */
export async function copyShareableUrl(result: ConversionResult): Promise<boolean> {
  const url = generateShareableUrl(result)
  return await copyToClipboard(url)
}
