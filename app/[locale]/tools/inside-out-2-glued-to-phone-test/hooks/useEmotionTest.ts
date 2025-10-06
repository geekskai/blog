import { useState, useCallback, useEffect } from "react"
import { Answer, Question, TestResult, TestState, AnimationState } from "../types"
import { QUESTIONS } from "../constants/questions"
import { calculateEmotionResult, validateTestAnswers } from "../utils/emotionCalculator"

/**
 * 情绪测试主要Hook
 */
export const useEmotionTest = () => {
  // 测试状态
  const [testState, setTestState] = useState<TestState>({
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false,
    result: null,
    animationState: {
      isTransitioning: false,
      currentEmotion: null,
      direction: "forward",
    },
  })

  // 是否为浏览器环境
  const [isBrowser, setIsBrowser] = useState(false)

  // 问题列表（可以是随机选择的子集）
  const [questions] = useState<Question[]>(() => {
    // 选择15个最重要的问题
    return QUESTIONS.slice(0, 15)
  })

  // 初始化浏览器环境检测
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // 回答问题
  const answerQuestion = useCallback(
    (answer: Answer) => {
      setTestState((prev) => {
        const newAnswers = [...prev.answers, answer]
        const nextIndex = prev.currentQuestionIndex + 1
        const isComplete = nextIndex >= questions.length

        // 如果测试完成，计算结果
        let result: TestResult | null = null
        if (isComplete) {
          const validation = validateTestAnswers(newAnswers)
          if (validation.isValid) {
            result = calculateEmotionResult(newAnswers)
          } else {
            console.error("Invalid answers:", validation.errors)
          }
        }

        return {
          ...prev,
          answers: newAnswers,
          currentQuestionIndex: nextIndex,
          isComplete,
          result,
          animationState: {
            ...prev.animationState,
            isTransitioning: true,
            direction: "forward",
          },
        }
      })

      // 动画完成后重置状态
      setTimeout(() => {
        setTestState((prev) => ({
          ...prev,
          animationState: {
            ...prev.animationState,
            isTransitioning: false,
          },
        }))
      }, 300)
    },
    [questions.length]
  )

  // 返回上一题
  const goToPreviousQuestion = useCallback(() => {
    setTestState((prev) => {
      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
          answers: prev.answers.slice(0, -1),
          isComplete: false,
          result: null,
          animationState: {
            ...prev.animationState,
            isTransitioning: true,
            direction: "backward",
          },
        }
      }
      return prev
    })

    // 动画完成后重置状态
    setTimeout(() => {
      setTestState((prev) => ({
        ...prev,
        animationState: {
          ...prev.animationState,
          isTransitioning: false,
        },
      }))
    }, 300)
  }, [])

  // 重新开始测试
  const restartTest = useCallback(() => {
    setTestState({
      currentQuestionIndex: 0,
      answers: [],
      isComplete: false,
      result: null,
      animationState: {
        isTransitioning: false,
        currentEmotion: null,
        direction: "forward",
      },
    })
  }, [])

  // 跳转到特定问题（用于调试或特殊需求）
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setTestState((prev) => ({
          ...prev,
          currentQuestionIndex: index,
          answers: prev.answers.slice(0, index),
          isComplete: false,
          result: null,
        }))
      }
    },
    [questions.length]
  )

  // 获取当前问题
  const getCurrentQuestion = useCallback((): Question | null => {
    if (testState.currentQuestionIndex < questions.length) {
      return questions[testState.currentQuestionIndex]
    }
    return null
  }, [testState.currentQuestionIndex, questions])

  // 获取进度百分比
  const getProgress = useCallback((): number => {
    return Math.round((testState.currentQuestionIndex / questions.length) * 100)
  }, [testState.currentQuestionIndex, questions.length])

  // 检查是否可以返回上一题
  const canGoBack = useCallback((): boolean => {
    return testState.currentQuestionIndex > 0 && !testState.isComplete
  }, [testState.currentQuestionIndex, testState.isComplete])

  // 获取测试统计信息
  const getTestStats = useCallback(() => {
    return {
      totalQuestions: questions.length,
      answeredQuestions: testState.answers.length,
      currentQuestion: testState.currentQuestionIndex + 1,
      progress: getProgress(),
      isComplete: testState.isComplete,
      canGoBack: canGoBack(),
    }
  }, [
    questions.length,
    testState.answers.length,
    testState.currentQuestionIndex,
    testState.isComplete,
    getProgress,
    canGoBack,
  ])

  // 保存测试到本地存储
  const saveTestToStorage = useCallback(() => {
    if (!isBrowser || !testState.result) return

    try {
      const testHistory = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        result: testState.result,
        answers: testState.answers,
      }

      const existingHistory = JSON.parse(localStorage.getItem("emotionTestHistory") || "[]")
      const updatedHistory = [testHistory, ...existingHistory.slice(0, 9)] // 保留最近10次

      localStorage.setItem("emotionTestHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Failed to save test to storage:", error)
    }
  }, [isBrowser, testState.result, testState.answers])

  // 从本地存储加载历史记录
  const loadTestHistory = useCallback(() => {
    if (!isBrowser) return []

    try {
      return JSON.parse(localStorage.getItem("emotionTestHistory") || "[]")
    } catch (error) {
      console.error("Failed to load test history:", error)
      return []
    }
  }, [isBrowser])

  // 当测试完成时自动保存
  useEffect(() => {
    if (testState.isComplete && testState.result) {
      saveTestToStorage()
    }
  }, [testState.isComplete, testState.result, saveTestToStorage])

  return {
    // 状态
    testState,
    questions,
    isBrowser,

    // 操作函数
    answerQuestion,
    goToPreviousQuestion,
    restartTest,
    goToQuestion,

    // 获取信息函数
    getCurrentQuestion,
    getProgress,
    canGoBack,
    getTestStats,

    // 存储相关
    saveTestToStorage,
    loadTestHistory,
  }
}

/**
 * 动画控制Hook
 */
export const useTestAnimation = () => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isTransitioning: false,
    currentEmotion: null,
    direction: "forward",
  })

  const startTransition = useCallback((direction: "forward" | "backward" = "forward") => {
    setAnimationState((prev) => ({
      ...prev,
      isTransitioning: true,
      direction,
    }))
  }, [])

  const endTransition = useCallback(() => {
    setAnimationState((prev) => ({
      ...prev,
      isTransitioning: false,
    }))
  }, [])

  const setCurrentEmotion = useCallback((emotion: string | null) => {
    setAnimationState((prev) => ({
      ...prev,
      currentEmotion: emotion,
    }))
  }, [])

  return {
    animationState,
    startTransition,
    endTransition,
    setCurrentEmotion,
  }
}

/**
 * 测试结果Hook
 */
export const useTestResult = (result: TestResult | null) => {
  const [isSharing, setIsSharing] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)

  const share = useCallback(
    async (platform?: "twitter" | "facebook" | "linkedin") => {
      if (!result) return

      setIsSharing(true)
      setShareError(null)

      try {
        // 这里会在分享组件中实现具体的分享逻辑
        console.log("Sharing result:", result, "to platform:", platform)

        // 模拟分享延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        setShareError(error instanceof Error ? error.message : "Share failed")
      } finally {
        setIsSharing(false)
      }
    },
    [result]
  )

  const downloadResult = useCallback(async () => {
    if (!result) return

    try {
      // 这里会在分享组件中实现下载逻辑
      console.log("Downloading result:", result)
    } catch (error) {
      setShareError(error instanceof Error ? error.message : "Download failed")
    }
  }, [result])

  return {
    isSharing,
    shareError,
    share,
    downloadResult,
  }
}
