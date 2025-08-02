export interface ConversionMode {
  type: "url" | "html"
  multiple?: boolean
}

export interface UrlInput {
  id: string
  url: string
  status: "pending" | "loading" | "success" | "error"
  title?: string
  markdown?: string
  error?: string
  wordCount?: number
}

export interface ConversionOptions {
  headingStyle: "atx" | "setext"
  bulletListMarker: "-" | "*" | "+"
  codeBlockStyle: "indented" | "fenced"
  linkStyle: "inlined" | "referenced"
  emDelimiter: "_" | "*"
  strongDelimiter: "**" | "__"
  preserveImages: boolean
  includeMetadata: boolean
  cleanHtml: boolean
  removeComments: boolean
  preserveWhitespace: boolean
  convertTables: boolean
}

export interface ConversionResult {
  id: string
  timestamp: number
  input: string
  inputType: "url" | "html"
  markdown: string
  title?: string
  wordCount: number
  size: number
  processingTime: number
}

export interface BatchConversionProgress {
  total: number
  completed: number
  failed: number
  current?: string
  percentage: number
}

export interface HtmlProcessingResult {
  success: boolean
  markdown?: string
  title?: string
  wordCount?: number
  error?: string
  processingTime: number
}

export interface UrlValidationResult {
  isValid: boolean
  normalizedUrl?: string
  error?: string
}

export interface DownloadOptions {
  filename: string
  format: "md" | "txt"
  includeMetadata: boolean
}
