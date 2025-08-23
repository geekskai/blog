import { JSONParseStatus, type JSONParseResult, type ProcessingError } from "../types"

/**
 * 安全的 JSON 解析函数
 * @param json JSON 字符串
 * @returns 解析结果
 */
export function jsonTryParse<T = unknown>(json: string): JSONParseResult<T, ProcessingError> {
  try {
    // 预处理：去除首尾空白字符
    const trimmedJson = json.trim()

    if (!trimmedJson) {
      return {
        status: JSONParseStatus.Error,
        error: {
          type: "parse",
          message: "Empty JSON string",
          details: "Please provide valid JSON data",
        },
      }
    }

    const data = JSON.parse(trimmedJson)

    return {
      status: JSONParseStatus.Ok,
      data: data as T,
    }
  } catch (error) {
    return {
      status: JSONParseStatus.Error,
      error: {
        type: "parse",
        message: "Invalid JSON format",
        details: error instanceof Error ? error.message : "Unknown parsing error",
      },
    }
  }
}

/**
 * 安全的 JSON 解析，带默认值
 * @param json JSON 字符串
 * @param defaultValue 默认值
 * @returns 解析结果或默认值
 */
export function jsonSafeParse<T>(json: string, defaultValue: T): T {
  const result = jsonTryParse<T>(json)
  return result.status === JSONParseStatus.Ok ? result.data : defaultValue
}

/**
 * 验证 JSON 数据类型
 * @param data 解析后的数据
 * @returns 数据类型描述
 */
export function getDataType(data: unknown): string {
  if (data === null) return "null"
  if (Array.isArray(data)) return "array"
  if (typeof data === "object") return "object"
  return typeof data
}

/**
 * 检查数据是否为原始类型
 * @param data 数据
 * @returns 是否为原始类型
 */
export function isPrimitive(data: unknown): boolean {
  return data === null || typeof data !== "object"
}

/**
 * 格式化 JSON 字符串
 * @param data 数据对象
 * @param spaces 缩进空格数
 * @returns 格式化的 JSON 字符串
 */
export function formatJSON(data: unknown, spaces: number = 2): string {
  try {
    return JSON.stringify(data, null, spaces)
  } catch (error) {
    return String(data)
  }
}
