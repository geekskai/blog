import { Answer, EmotionScore, AddictionLevel, TestResult, EmotionCharacter } from "../types"
import { EMOTIONS, ADDICTION_THRESHOLDS } from "../constants/emotions"
import { getRandomInsights, getRecommendations, ADDICTION_DESCRIPTIONS } from "../constants/results"

/**
 * 情绪计算引擎 - 核心算法类
 */
export class EmotionCalculator {
  /**
   * 计算情绪分数
   */
  calculateEmotionScores(answers: Answer[]): EmotionScore {
    const scores: EmotionScore = {
      joy: 0,
      anxiety: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      disgust: 0,
      embarrassment: 0,
      envy: 0,
      ennui: 0,
    }

    // 累计每个答案对各情绪的影响
    answers.forEach((answer) => {
      Object.entries(answer.emotionImpact).forEach(([emotion, impact]) => {
        if (emotion in scores) {
          scores[emotion as keyof EmotionScore] += impact
        }
      })
    })

    // 标准化分数 (0-100)
    return this.normalizeEmotionScores(scores)
  }

  /**
   * 标准化情绪分数
   */
  private normalizeEmotionScores(scores: EmotionScore): EmotionScore {
    const maxPossibleScore = 60 // 假设每题最高影响为4，15题
    const normalizedScores: EmotionScore = {} as EmotionScore

    Object.entries(scores).forEach(([emotion, score]) => {
      normalizedScores[emotion as keyof EmotionScore] = Math.min(
        100,
        Math.max(0, (score / maxPossibleScore) * 100)
      )
    })

    return normalizedScores
  }

  /**
   * 找出主导情绪
   */
  findDominantEmotion(scores: EmotionScore): EmotionCharacter {
    let maxScore = 0
    let dominantEmotion = "joy"

    Object.entries(scores).forEach(([emotion, score]) => {
      if (score > maxScore) {
        maxScore = score
        dominantEmotion = emotion
      }
    })

    return EMOTIONS[dominantEmotion]
  }

  /**
   * 计算手机依赖程度
   */
  calculateAddictionLevel(answers: Answer[], t?: (key: string) => string): AddictionLevel {
    let totalScore = 0
    let weightedSum = 0

    answers.forEach((answer) => {
      const questionWeight = this.getQuestionWeight(answer.questionId)
      totalScore += answer.value * questionWeight
      weightedSum += questionWeight
    })

    // 标准化到0-100分
    const normalizedScore = weightedSum > 0 ? (totalScore / (weightedSum * 4)) * 100 : 0
    const clampedScore = Math.min(100, Math.max(0, normalizedScore))

    return this.getAddictionLevelFromScore(clampedScore, t)
  }

  /**
   * 获取问题权重
   */
  private getQuestionWeight(questionId: string): number {
    // 这里可以根据问题ID返回不同权重
    // 目前使用统一权重，实际应用中可以根据问题重要性调整
    return 1.0
  }

  /**
   * 根据分数确定依赖程度
   */
  private getAddictionLevelFromScore(score: number, t?: (key: string) => string): AddictionLevel {
    let level: "Low" | "Moderate" | "High" | "Severe" = "Low"
    let color = ADDICTION_THRESHOLDS.low.color

    if (score >= ADDICTION_THRESHOLDS.severe.min) {
      level = "Severe"
      color = ADDICTION_THRESHOLDS.severe.color
    } else if (score >= ADDICTION_THRESHOLDS.high.min) {
      level = "High"
      color = ADDICTION_THRESHOLDS.high.color
    } else if (score >= ADDICTION_THRESHOLDS.moderate.min) {
      level = "Moderate"
      color = ADDICTION_THRESHOLDS.moderate.color
    }

    const descriptionKey = level.toLowerCase() as keyof typeof ADDICTION_DESCRIPTIONS
    const description = ADDICTION_DESCRIPTIONS[descriptionKey]

    return {
      level,
      score: Math.round(score),
      percentage: Math.round(score),
      description: t ? t(`addiction_${descriptionKey}_description`) : description.description,
      color,
    }
  }

  /**
   * 生成个性化洞察
   */
  generateInsights(
    dominantEmotion: EmotionCharacter,
    addictionLevel: AddictionLevel,
    t?: (key: string) => string
  ): string[] {
    const insights = getRandomInsights(dominantEmotion.id, 3)

    // 根据依赖程度添加特定洞察
    if (addictionLevel.level === "Severe") {
      insights.push(
        t
          ? t("insight_severe")
          : "Your phone usage patterns suggest it may be significantly impacting your daily life and well-being."
      )
    } else if (addictionLevel.level === "High") {
      insights.push(
        t
          ? t("insight_high")
          : "You show clear signs of phone dependency that could benefit from structured changes."
      )
    } else if (addictionLevel.level === "Low") {
      insights.push(
        t
          ? t("insight_low")
          : "You maintain a relatively healthy relationship with your phone - keep up the good habits!"
      )
    }

    return insights
  }

  /**
   * 主要计算方法 - 生成完整测试结果
   */
  calculateResult(answers: Answer[], t?: (key: string) => string): TestResult {
    // 计算情绪分数
    const emotionScores = this.calculateEmotionScores(answers)

    // 找出主导情绪
    const dominantEmotion = this.findDominantEmotion(emotionScores)

    // 计算依赖程度
    const addictionLevel = this.calculateAddictionLevel(answers, t)

    // 生成个性化洞察
    const personalizedInsights = this.generateInsights(dominantEmotion, addictionLevel, t)

    // 获取改善建议
    const recommendations = getRecommendations(
      dominantEmotion.id,
      addictionLevel.level.toLowerCase()
    )

    return {
      dominantEmotion,
      emotionScores,
      addictionLevel,
      personalizedInsights,
      recommendations,
      completedAt: Date.now(),
    }
  }

  /**
   * 计算情绪分布百分比（用于图表显示）
   */
  calculateEmotionPercentages(scores: EmotionScore): Record<string, number> {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const percentages: Record<string, number> = {}

    if (total === 0) {
      // 如果总分为0，平均分配
      Object.keys(scores).forEach((emotion) => {
        percentages[emotion] = Math.round(100 / Object.keys(scores).length)
      })
    } else {
      Object.entries(scores).forEach(([emotion, score]) => {
        percentages[emotion] = Math.round((score / total) * 100)
      })
    }

    return percentages
  }

  /**
   * 获取情绪排名（用于显示前3名情绪）
   */
  getEmotionRanking(
    scores: EmotionScore
  ): Array<{ emotion: string; score: number; percentage: number }> {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)

    return Object.entries(scores)
      .map(([emotion, score]) => ({
        emotion,
        score: Math.round(score),
        percentage: total > 0 ? Math.round((score / total) * 100) : 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }

  /**
   * 验证答案完整性
   */
  validateAnswers(answers: Answer[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (answers.length === 0) {
      // 验证错误不需要用户看到，只在控制台记录
      errors.push("No answers provided")
    }

    if (answers.length < 10) {
      // 验证错误不需要用户看到，只在控制台记录
      errors.push("Insufficient answers for reliable analysis")
    }

    // 检查答案格式
    answers.forEach((answer, index) => {
      if (!answer.questionId) {
        errors.push(`Answer ${index + 1}: Missing question ID`)
      }
      if (typeof answer.value !== "number" || answer.value < 1 || answer.value > 4) {
        errors.push(`Answer ${index + 1}: Invalid value (must be 1-4)`)
      }
      if (!answer.emotionImpact || typeof answer.emotionImpact !== "object") {
        errors.push(`Answer ${index + 1}: Missing or invalid emotion impact`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// 导出单例实例
export const emotionCalculator = new EmotionCalculator()

// 便捷函数
export const calculateEmotionResult = (
  answers: Answer[],
  t?: (key: string) => string
): TestResult => {
  return emotionCalculator.calculateResult(answers, t)
}

export const validateTestAnswers = (answers: Answer[]) => {
  return emotionCalculator.validateAnswers(answers)
}
