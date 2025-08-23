import { SourceType, type DataSource, type ProcessingError } from "../types"

/**
 * 创建数据源对象
 * @param type 数据源类型
 * @returns 数据源对象
 */
export function createDataSource(type: SourceType): DataSource {
  switch (type) {
    case SourceType.File:
      return {
        type,
        data: "",
        fileName: "",
      }
    default:
      return {
        type,
        data: "",
      }
  }
}

/**
 * 从 URL 获取文本数据
 * @param url URL 地址
 * @returns Promise<string>
 */
export async function fetchAsText(url: string): Promise<string> {
  try {
    // 验证 URL 格式
    new URL(url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.text()
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Invalid URL format")
    }
    throw error
  }
}

/**
 * 解析数据源并返回数据
 * @param source 数据源
 * @returns Promise<string>
 */
export async function resolveDataSource(source: DataSource): Promise<string> {
  try {
    switch (source.type) {
      case SourceType.Text:
        return source.data

      case SourceType.File:
        return source.data

      case SourceType.URL:
        if (!source.data) {
          throw new Error("URL is required")
        }
        return await fetchAsText(source.data)

      default:
        throw new Error(`Unsupported source type: ${(source as any).type}`)
    }
  } catch (error) {
    throw {
      type: source.type === SourceType.URL ? "network" : "processing",
      message: `Failed to resolve ${source.type} data source`,
      details: error instanceof Error ? error.message : "Unknown error",
    } as ProcessingError
  }
}

/**
 * 读取文件内容
 * @param file 文件对象
 * @returns Promise<string>
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === "string") {
        resolve(result)
      } else {
        reject(new Error("Failed to read file as text"))
      }
    }

    reader.onerror = () => {
      reject(new Error("File reading error"))
    }

    reader.readAsText(file)
  })
}

/**
 * 验证 URL 格式
 * @param urlString URL 字符串
 * @returns 是否为有效 URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * 获取文件扩展名
 * @param fileName 文件名
 * @returns 文件扩展名
 */
export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".")
  return lastDotIndex > 0 ? fileName.substring(lastDotIndex + 1).toLowerCase() : ""
}

/**
 * 检查文件类型是否支持
 * @param fileName 文件名
 * @returns 是否支持
 */
export function isSupportedFileType(fileName: string): boolean {
  const supportedExtensions = ["json", "txt", "js", "ts", "jsx", "tsx", "csv"]
  const extension = getFileExtension(fileName)
  return supportedExtensions.includes(extension)
}

/**
 * 获取文件类型的友好名称
 * @param fileName 文件名
 * @returns 文件类型描述
 */
export function getFileTypeDescription(fileName: string): string {
  const extension = getFileExtension(fileName)
  const typeMap: Record<string, string> = {
    json: "JSON Data",
    txt: "Text File",
    js: "JavaScript",
    ts: "TypeScript",
    jsx: "React JSX",
    tsx: "React TSX",
    csv: "CSV Data",
  }
  return typeMap[extension] || "Unknown File"
}
