// Chivalry Test - Type Definitions

export interface Answer {
  id: string
  text: string
  score: number
}

export interface Question {
  id: number
  text: string
  answers: Answer[]
}

export interface ResultLevel {
  min: number
  max: number
  title: string
  description: string
  strengths: string[]
  improvement: string
  color: string
}

export interface QuizAnswers {
  [questionId: number]: string // questionId -> answerId
}

export interface QuizState {
  currentQuestion: number
  answers: QuizAnswers
  isComplete: boolean
  score: number | null
}
