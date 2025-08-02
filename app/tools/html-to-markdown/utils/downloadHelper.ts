import { saveAs } from "file-saver"
import { ConversionResult, DownloadOptions } from "../types"

export function downloadMarkdown(
  content: string,
  filename?: string,
  options: Partial<DownloadOptions> = {}
): void {
  const { format = "md", includeMetadata = true } = options

  let finalContent = content
  let finalFilename = filename || `converted-content.${format}`

  // Ensure proper file extension
  if (!finalFilename.endsWith(`.${format}`)) {
    finalFilename = `${finalFilename}.${format}`
  }

  // Add metadata if requested
  if (includeMetadata && format === "md") {
    const timestamp = new Date().toISOString()
    const metadata = [
      "---",
      `title: "${filename || "Converted Content"}"`,
      `date: ${timestamp}`,
      `generated_by: HTML to Markdown Converter`,
      `source: GeeksKai Tools`,
      "---",
      "",
      finalContent,
    ].join("\n")
    finalContent = metadata
  }

  // Create and download file
  const blob = new Blob([finalContent], {
    type: format === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8",
  })

  saveAs(blob, finalFilename)
}

export function downloadBatchResults(
  results: ConversionResult[],
  options: Partial<DownloadOptions> = {}
): void {
  const { format = "md", includeMetadata = true } = options

  const timestamp = new Date().toISOString().split("T")[0]
  const filename = `batch-conversion-${timestamp}.${format}`

  let content = ""

  if (includeMetadata && format === "md") {
    content += [
      "---",
      `title: "Batch Conversion Results"`,
      `date: ${new Date().toISOString()}`,
      `total_files: ${results.length}`,
      `generated_by: HTML to Markdown Converter`,
      `source: GeeksKai Tools`,
      "---",
      "",
      "# Batch Conversion Results",
      "",
      `Generated on: ${new Date().toLocaleDateString()}`,
      `Total conversions: ${results.length}`,
      "",
      "---",
      "",
    ].join("\n")
  }

  results.forEach((result, index) => {
    if (format === "md") {
      content += `## ${result.title || `Conversion ${index + 1}`}\n\n`

      if (includeMetadata) {
        content += [
          `**Source:** ${result.inputType === "url" ? result.input : "HTML Input"}`,
          `**Word Count:** ${result.wordCount}`,
          `**Processed:** ${new Date(result.timestamp).toLocaleString()}`,
          `**Processing Time:** ${result.processingTime}ms`,
          "",
          "---",
          "",
        ].join("\n")
      }

      content += `${result.markdown}\n\n`

      if (index < results.length - 1) {
        content += "---\n\n"
      }
    } else {
      // Plain text format
      if (includeMetadata) {
        content += `=== ${result.title || `Conversion ${index + 1}`} ===\n`
        content += `Source: ${result.inputType === "url" ? result.input : "HTML Input"}\n`
        content += `Word Count: ${result.wordCount}\n`
        content += `Processed: ${new Date(result.timestamp).toLocaleString()}\n\n`
      }

      content += `${result.markdown}\n\n`

      if (index < results.length - 1) {
        content += "=====================================\n\n"
      }
    }
  })

  const blob = new Blob([content], {
    type: format === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8",
  })

  saveAs(blob, filename)
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern clipboard API
      navigator.clipboard
        .writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false))
    } else {
      // Fallback for older browsers
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
        resolve(successful)
      } catch (err) {
        resolve(false)
      }
    }
  })
}

export function generateFilename(input: string, inputType: "url" | "html"): string {
  if (inputType === "url") {
    try {
      const url = new URL(input)
      const domain = url.hostname.replace(/^www\./, "")
      const path = url.pathname.replace(/\//g, "-").replace(/^-+|-+$/g, "")
      return path ? `${domain}-${path}` : domain
    } catch {
      return "converted-url"
    }
  } else {
    // For HTML input, try to extract title or use generic name
    const titleMatch = input.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (titleMatch) {
      return titleMatch[1]
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()
    }
    return "converted-html"
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"

  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function estimateReadingTime(wordCount: number): string {
  // Average reading speed: 200-250 words per minute
  const wordsPerMinute = 225
  const minutes = Math.ceil(wordCount / wordsPerMinute)

  if (minutes === 1) return "1 minute"
  if (minutes < 60) return `${minutes} minutes`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`
  }

  return `${hours}h ${remainingMinutes}m`
}
