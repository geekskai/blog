// Inside Out 2 情绪角色定义
export interface EmotionCharacter {
  id: string
  name: string
  displayName: string
  description: string
  traits: string[]
  phoneUsagePattern: string
  color: string
  gradientFrom: string
  gradientTo: string
  avatar: string
  emoji: string
}

// 测试问题接口
export interface Question {
  id: string
  text: string
  category: QuestionCategory
  options: QuestionOption[]
  emotionWeights: Record<string, number>
  addictionWeight: number
}

export interface QuestionOption {
  id: string
  text: string
  value: number
  emotionImpact: Record<string, number>
}

export type QuestionCategory =
  | "frequency" // 使用频率与时长
  | "emotional" // 情绪触发因素
  | "social" // 社交行为模式
  | "control" // 控制能力
  | "functional" // 功能性使用

// 用户答案接口
export interface Answer {
  questionId: string
  optionId: string
  value: number
  emotionImpact: Record<string, number>
}

// 情绪分数接口
export interface EmotionScore {
  joy: number
  anxiety: number
  sadness: number
  anger: number
  fear: number
  disgust: number
  embarrassment: number
  envy: number
  ennui: number
}

// 依赖程度接口
export interface AddictionLevel {
  level: "Low" | "Moderate" | "High" | "Severe"
  score: number
  percentage: number
  description: string
  color: string
}

// 测试结果接口
export interface TestResult {
  dominantEmotion: EmotionCharacter
  emotionScores: EmotionScore
  addictionLevel: AddictionLevel
  personalizedInsights: string[]
  recommendations: Recommendation[]
  shareableQuote: string
  completedAt: number
}

// 建议接口
export interface Recommendation {
  category: "immediate" | "daily" | "weekly" | "longterm"
  title: string
  description: string
  icon: string
  difficulty: "easy" | "medium" | "hard"
}

// 历史记录接口
export interface TestHistory {
  id: string
  timestamp: number
  result: TestResult
  answers: Answer[]
}

// 分享卡片数据接口
export interface ShareCardData {
  dominantEmotion: EmotionCharacter
  addictionLevel: AddictionLevel
  emotionBreakdown: EmotionScore
  shareableQuote: string
  userStats: {
    testDate: string
    topEmotions: string[]
  }
}

// 组件Props接口
export interface QuestionCardProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  onAnswer: (answer: Answer) => void
  onPrevious?: () => void
  onNext?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  isAnimating?: boolean
}

export interface ProgressBarProps {
  current: number
  total: number
  emotion?: string
}

export interface EmotionAvatarProps {
  emotion: EmotionCharacter
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  glowing?: boolean
}

export interface ResultCardProps {
  result: TestResult
  onShare: () => void
  onRetake: () => void
}

// 动画状态接口
export interface AnimationState {
  isTransitioning: boolean
  currentEmotion: string | null
  direction: "forward" | "backward"
}

// 测试状态接口
export interface TestState {
  currentQuestionIndex: number
  answers: Answer[]
  isComplete: boolean
  result: TestResult | null
  animationState: AnimationState
}
