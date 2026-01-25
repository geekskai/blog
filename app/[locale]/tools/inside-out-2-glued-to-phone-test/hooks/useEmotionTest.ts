"use client"

import { useState, useCallback } from "react"
import { Question, Answer, TestState, TestResult, AnimationState } from "../types"
import { QUESTIONS } from "../constants/questions"
import { calculateEmotionResult } from "../utils/emotionCalculator"

/**
 * Custom hook for managing emotion test state and logic
 */
export const useEmotionTest = (t?: (key: string) => string) => {
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

  const getCurrentQuestion = useCallback((): Question | null => {
    if (testState.currentQuestionIndex >= QUESTIONS.length) {
      return null
    }
    return QUESTIONS[testState.currentQuestionIndex] || null
  }, [testState.currentQuestionIndex])

  const answerQuestion = useCallback(
    (answer: Answer) => {
      setTestState((prev) => {
        const newAnswers = [...prev.answers]
        const existingAnswerIndex = newAnswers.findIndex((a) => a.questionId === answer.questionId)

        if (existingAnswerIndex >= 0) {
          newAnswers[existingAnswerIndex] = answer
        } else {
          newAnswers.push(answer)
        }

        const nextIndex = prev.currentQuestionIndex + 1
        const isComplete = nextIndex >= QUESTIONS.length

        let result: TestResult | null = null
        if (isComplete) {
          result = calculateEmotionResult(newAnswers, t)
        }

        return {
          ...prev,
          answers: newAnswers,
          currentQuestionIndex: nextIndex,
          isComplete,
          result,
          animationState: {
            isTransitioning: true,
            currentEmotion: null,
            direction: "forward",
          },
        }
      })

      // Reset animation state after transition
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
    [t]
  )

  const goToPreviousQuestion = useCallback(() => {
    setTestState((prev) => {
      if (prev.currentQuestionIndex <= 0) {
        return prev
      }

      const newIndex = prev.currentQuestionIndex - 1
      const newAnswers = prev.answers.slice(0, newIndex)

      return {
        ...prev,
        currentQuestionIndex: newIndex,
        answers: newAnswers,
        isComplete: false,
        result: null,
        animationState: {
          isTransitioning: true,
          currentEmotion: null,
          direction: "backward",
        },
      }
    })

    // Reset animation state after transition
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

  const canGoBack = useCallback((): boolean => {
    return testState.currentQuestionIndex > 0
  }, [testState.currentQuestionIndex])

  const getTestStats = useCallback(() => {
    return {
      currentQuestion: testState.currentQuestionIndex + 1,
      totalQuestions: QUESTIONS.length,
    }
  }, [testState.currentQuestionIndex])

  return {
    testState,
    getCurrentQuestion,
    answerQuestion,
    goToPreviousQuestion,
    restartTest,
    canGoBack,
    getTestStats,
  }
}
