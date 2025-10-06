import { TestResult, ShareCardData } from "../types"

/**
 * 分享工具类
 */
export class ShareUtils {
  /**
   * 生成分享卡片数据
   */
  generateShareCardData(result: TestResult): ShareCardData {
    const topEmotions = this.getTopEmotions(result.emotionScores, 3)

    return {
      dominantEmotion: result.dominantEmotion,
      addictionLevel: result.addictionLevel,
      emotionBreakdown: result.emotionScores,
      shareableQuote: result.shareableQuote,
      userStats: {
        testDate: new Date(result.completedAt).toLocaleDateString(),
        topEmotions: topEmotions.map((e) => e.name),
      },
    }
  }

  /**
   * 获取前N个情绪
   */
  private getTopEmotions(scores: any, count: number) {
    return Object.entries(scores)
      .map(([emotion, score]) => ({ name: emotion, score: score as number }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
  }

  /**
   * 生成社交媒体分享文本
   */
  generateShareText(
    result: TestResult,
    platform: "twitter" | "facebook" | "instagram" = "twitter"
  ): string {
    const { dominantEmotion, addictionLevel } = result

    const baseText = `${dominantEmotion.emoji} ${dominantEmotion.displayName} controls my phone time! `
    const addictionText = `My phone dependency level: ${addictionLevel.level} (${addictionLevel.percentage}%)`
    const callToAction = "\n\nDiscover which Inside Out 2 emotion drives your phone habits!"
    const url = "\n\nhttps://geekskai.com/tools/inside-out-2-glued-to-phone-test/"
    const hashtags = "\n\n#InsideOut2 #PhoneAddiction #DigitalWellness #EmotionTest"

    switch (platform) {
      case "twitter":
        return `${baseText}${addictionText}${callToAction}${url}${hashtags}`.substring(0, 280)

      case "facebook":
        return `${baseText}${addictionText}${callToAction}${url}${hashtags}`

      case "instagram":
        return `${baseText}${addictionText}${callToAction}${hashtags}`

      default:
        return `${baseText}${addictionText}${callToAction}${url}`
    }
  }

  /**
   * 生成分享URL
   */
  generateShareUrl(result: TestResult, platform: "twitter" | "facebook" | "linkedin"): string {
    const baseUrl = "https://geekskai.com/tools/inside-out-2-glued-to-phone-test/"
    const shareText = this.generateShareText(
      result,
      platform === "twitter" ? "twitter" : "facebook"
    )

    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}&quote=${encodeURIComponent(shareText)}`

      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}&title=${encodeURIComponent("Inside Out 2 Phone Addiction Test")}&summary=${encodeURIComponent(shareText)}`

      default:
        return baseUrl
    }
  }

  /**
   * 复制分享文本到剪贴板
   */
  async copyShareText(result: TestResult): Promise<boolean> {
    try {
      const shareText = this.generateShareText(result)
      await navigator.clipboard.writeText(shareText)
      return true
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }
  }

  /**
   * 生成结果摘要（用于历史记录）
   */
  generateResultSummary(result: TestResult): string {
    const { dominantEmotion, addictionLevel } = result
    return `${dominantEmotion.displayName} (${addictionLevel.level} - ${addictionLevel.percentage}%)`
  }

  /**
   * 检查分享功能支持
   */
  checkShareSupport(): {
    nativeShare: boolean
    clipboard: boolean
    webShare: boolean
  } {
    return {
      nativeShare: typeof navigator !== "undefined" && "share" in navigator,
      clipboard: typeof navigator !== "undefined" && "clipboard" in navigator,
      webShare: typeof navigator !== "undefined" && "share" in navigator,
    }
  }

  /**
   * 原生分享（如果支持）
   */
  async nativeShare(result: TestResult): Promise<boolean> {
    if (typeof navigator === "undefined" || !("share" in navigator)) {
      return false
    }

    try {
      await navigator.share({
        title: "Inside Out 2 Phone Addiction Test Results",
        text: this.generateShareText(result),
        url: "https://geekskai.com/tools/inside-out-2-glued-to-phone-test/",
      })
      return true
    } catch (error) {
      console.error("Native share failed:", error)
      return false
    }
  }
}

// 导出单例实例
export const shareUtils = new ShareUtils()

// 便捷函数
export const generateShareData = (result: TestResult): ShareCardData => {
  return shareUtils.generateShareCardData(result)
}

export const getShareUrl = (
  result: TestResult,
  platform: "twitter" | "facebook" | "linkedin"
): string => {
  return shareUtils.generateShareUrl(result, platform)
}

export const copyResultToClipboard = async (result: TestResult): Promise<boolean> => {
  return shareUtils.copyShareText(result)
}

/**
 * 生成结果图片的Canvas配置
 */
export const getCanvasConfig = () => {
  return {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    allowTaint: false,
    logging: false,
    width: 800,
    height: 1000,
    scrollX: 0,
    scrollY: 0,
  }
}

/**
 * 下载结果图片
 */
export const downloadResultImage = async (canvas: HTMLCanvasElement, result: TestResult) => {
  try {
    const link = document.createElement("a")
    link.download = `inside-out-phone-test-${result.dominantEmotion.id}-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  } catch (error) {
    console.error("Failed to download image:", error)
    throw error
  }
}
