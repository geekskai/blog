import { saveAs } from "file-saver"
import JSZip from "jszip"
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

/**
 * Download selected conversion results - single file directly, multiple files compressed
 */
export async function downloadSelectedResults(
  results: ConversionResult[],
  options: Partial<DownloadOptions> = {}
): Promise<void> {
  if (results.length === 0) return

  // Single file - download directly
  if (results.length === 1) {
    const result = results[0]
    const filename = generateFilename(result.input, result.inputType)
    downloadMarkdown(result.markdown, filename, options)
    return
  }

  // Multiple files - create zip
  const zip = new JSZip()
  const timestamp = new Date().toISOString().split("T")[0]
  const folderName = `markdown-exports-${timestamp}`
  const folder = zip.folder(folderName)

  if (!folder) {
    throw new Error("Failed to create zip folder")
  }

  // Add metadata file
  const metadata = {
    exportedAt: new Date().toISOString(),
    totalFiles: results.length,
    exportedBy: "GeeksKai HTML to Markdown Converter",
    files: results.map((result, index) => ({
      index: index + 1,
      title: result.title,
      source: result.inputType === "url" ? result.input : "HTML Input",
      wordCount: result.wordCount,
      processedAt: result.timestamp,
      processingTime: result.processingTime,
    })),
  }

  folder.file("export-metadata.json", JSON.stringify(metadata, null, 2))

  // Add each markdown file
  results.forEach((result, index) => {
    const filename = generateFilename(result.input, result.inputType)
    const safeFilename = `${String(index + 1).padStart(2, "0")}-${filename}.md`

    let content = result.markdown

    // Add frontmatter if metadata is enabled
    if (options.includeMetadata !== false) {
      const frontmatter = [
        "---",
        `title: "${result.title || `Conversion ${index + 1}`}"`,
        `source: ${result.inputType === "url" ? result.input : "HTML Input"}`,
        `exported_at: ${new Date().toISOString()}`,
        `word_count: ${result.wordCount}`,
        `processing_time: ${result.processingTime}ms`,
        `original_timestamp: ${result.timestamp}`,
        "---",
        "",
        content,
      ].join("\n")
      content = frontmatter
    }

    folder.file(safeFilename, content)
  })

  // Generate and download zip file
  try {
    const blob = await zip.generateAsync({ type: "blob" })
    saveAs(blob, `${folderName}.zip`)
  } catch (error) {
    console.error("Error creating zip file:", error)
    throw new Error("Failed to create zip file")
  }
}
