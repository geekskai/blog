import TurndownService from "turndown"
import { ConversionOptions, HtmlProcessingResult } from "../types"

export class HtmlToMarkdownConverter {
  private turndownService: TurndownService
  private options: ConversionOptions

  constructor(options: ConversionOptions) {
    this.options = options
    this.turndownService = new TurndownService({
      headingStyle: options.headingStyle,
      bulletListMarker: options.bulletListMarker,
      codeBlockStyle: options.codeBlockStyle,
      linkStyle: options.linkStyle,
      emDelimiter: options.emDelimiter,
      strongDelimiter: options.strongDelimiter,
    })

    this.setupCustomRules()
  }

  private setupCustomRules() {
    // Custom rule for code blocks with language detection
    this.turndownService.addRule("codeBlocks", {
      filter: ["pre"],
      replacement: (content, node) => {
        const codeElement = node.querySelector("code")
        let language = ""

        if (codeElement) {
          // Try to extract language from class names
          const classList = Array.from(codeElement.classList)
          const langClass = classList.find(
            (cls) => cls.startsWith("language-") || cls.startsWith("lang-")
          )
          if (langClass) {
            language = langClass.replace(/^(language-|lang-)/, "")
          }
        }

        // Check for data attributes
        if (!language && node instanceof Element) {
          language = node.getAttribute("data-lang") || node.getAttribute("data-language") || ""
        }

        const cleanContent = content.replace(/^\n+|\n+$/g, "")
        return `\n\`\`\`${language}\n${cleanContent}\n\`\`\`\n`
      },
    })

    // Enhanced table support
    if (this.options.convertTables) {
      this.turndownService.addRule("tables", {
        filter: "table",
        replacement: (content, node) => {
          return this.convertTable(node as HTMLTableElement)
        },
      })
    }

    // Enhanced image handling
    if (this.options.preserveImages) {
      this.turndownService.addRule("images", {
        filter: "img",
        replacement: (content, node) => {
          const element = node as Element
          const alt = element.getAttribute("alt") || ""
          const src = element.getAttribute("src") || ""
          const title = element.getAttribute("title")

          // Handle relative URLs
          let finalSrc = src
          if (src.startsWith("/") && typeof window !== "undefined") {
            finalSrc = `${window.location.origin}${src}`
          }

          return title ? `![${alt}](${finalSrc} "${title}")` : `![${alt}](${finalSrc})`
        },
      })
    }

    // Handle blockquotes with proper formatting
    this.turndownService.addRule("blockquotes", {
      filter: "blockquote",
      replacement: (content) => {
        const lines = content.trim().split("\n")
        return "\n" + lines.map((line) => `> ${line}`).join("\n") + "\n"
      },
    })

    // Handle definition lists
    this.turndownService.addRule("definitionLists", {
      filter: ["dl"],
      replacement: (content, node) => {
        const items = node.querySelectorAll("dt, dd")
        let result = "\n"

        items.forEach((item) => {
          if (item.tagName === "DT") {
            result += `**${item.textContent?.trim()}**\n`
          } else if (item.tagName === "DD") {
            result += `: ${item.textContent?.trim()}\n`
          }
        })

        return result + "\n"
      },
    })

    // Remove comments if specified
    if (this.options.removeComments) {
      this.turndownService.addRule("removeComments", {
        filter: (node) => node.nodeType === 8, // Comment node
        replacement: () => "",
      })
    }

    // Handle horizontal rules
    this.turndownService.addRule("horizontalRule", {
      filter: "hr",
      replacement: () => "\n---\n",
    })
  }

  convert(html: string): HtmlProcessingResult {
    const startTime = Date.now()

    try {
      // Clean HTML if specified
      let processedHtml = html
      if (this.options.cleanHtml) {
        processedHtml = this.sanitizeHtml(html)
      }

      // Extract title if possible
      const titleMatch = processedHtml.match(/<title[^>]*>([^<]+)<\/title>/i)
      const title = titleMatch ? titleMatch[1].trim() : undefined

      // Convert to markdown
      const markdown = this.turndownService.turndown(processedHtml)

      // Post-process markdown
      const finalMarkdown = this.postProcessMarkdown(markdown)

      // Calculate word count
      const wordCount = this.calculateWordCount(finalMarkdown)

      const processingTime = Date.now() - startTime

      return {
        success: true,
        markdown: finalMarkdown,
        title,
        wordCount,
        processingTime,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Conversion failed",
        processingTime: Date.now() - startTime,
      }
    }
  }

  private convertTable(table: HTMLTableElement): string {
    const rows = Array.from(table.querySelectorAll("tr"))
    if (rows.length === 0) return ""

    const markdownRows: string[] = []
    let hasHeader = false

    rows.forEach((row, index) => {
      const cells = Array.from(row.querySelectorAll("td, th"))
      if (cells.length === 0) return

      // Check if this row contains header cells
      const isHeaderRow = cells.some((cell) => cell.tagName === "TH")
      if (isHeaderRow) hasHeader = true

      const markdownRow =
        "| " +
        cells
          .map((cell) => {
            const content = cell.textContent?.trim().replace(/\|/g, "\\|") || ""
            return content
          })
          .join(" | ") +
        " |"

      markdownRows.push(markdownRow)

      // Add separator after header row
      if (isHeaderRow || (index === 0 && !hasHeader)) {
        const separator = "| " + cells.map(() => "---").join(" | ") + " |"
        markdownRows.push(separator)
      }
    })

    return "\n" + markdownRows.join("\n") + "\n"
  }

  private sanitizeHtml(html: string): string {
    // Basic HTML sanitization
    // Remove script tags and their content
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

    // Remove style tags and their content
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")

    // Remove HTML comments if specified
    if (this.options.removeComments) {
      html = html.replace(/<!--[\s\S]*?-->/g, "")
    }

    return html
  }

  private postProcessMarkdown(markdown: string): string {
    let processed = markdown

    // Remove excessive blank lines
    processed = processed.replace(/\n{3,}/g, "\n\n")

    // Clean up whitespace if not preserving
    if (!this.options.preserveWhitespace) {
      processed = processed.replace(/[ \t]+$/gm, "") // Remove trailing spaces
      processed = processed.replace(/^\s+$/gm, "") // Remove lines with only whitespace
    }

    // Ensure proper spacing around headers
    processed = processed.replace(/^(#{1,6} .+)$/gm, "\n$1\n")
    processed = processed.replace(/\n{3,}/g, "\n\n") // Clean up extra newlines again

    // Clean up list formatting
    processed = processed.replace(/^(\s*[-*+] .+)$/gm, "$1")

    return processed.trim()
  }

  private calculateWordCount(text: string): number {
    // Remove markdown syntax for more accurate word count
    const cleanText = text
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/`[^`]+`/g, "") // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to just text
      .replace(/[#*_~`]/g, "") // Remove markdown symbols
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()

    return cleanText ? cleanText.split(/\s+/).length : 0
  }

  updateOptions(newOptions: Partial<ConversionOptions>) {
    this.options = { ...this.options, ...newOptions }
    // Recreate turndown service with new options
    this.turndownService = new TurndownService({
      headingStyle: this.options.headingStyle,
      bulletListMarker: this.options.bulletListMarker,
      codeBlockStyle: this.options.codeBlockStyle,
      linkStyle: this.options.linkStyle,
      emDelimiter: this.options.emDelimiter,
      strongDelimiter: this.options.strongDelimiter,
    })
    this.setupCustomRules()
  }
}

// Default conversion options
export const defaultConversionOptions: ConversionOptions = {
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  linkStyle: "inlined",
  emDelimiter: "_",
  strongDelimiter: "**",
  preserveImages: true,
  includeMetadata: true,
  cleanHtml: true,
  removeComments: true,
  preserveWhitespace: false,
  convertTables: true,
}
