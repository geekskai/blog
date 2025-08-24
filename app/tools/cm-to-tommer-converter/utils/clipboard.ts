import type { CopyStatus } from "../types"

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
 * 格式化复制文本
 */
export function formatCopyText(
  input: number,
  output: number,
  inputUnit: string,
  outputUnit: string
): string {
  return `${input} ${inputUnit} = ${output} ${outputUnit}`
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
