// Chivalry Test - Questions and Answers (V2 - Dual Mode)

export type QuizMode = "modern" | "knight" | "hybrid"

export interface Question {
  id: number
  textKey: string // Translation key for question text
  answers: Answer[]
  mode: "modern" | "knight"
  trait?: TraitType // Which trait this question measures
}

export interface Answer {
  id: string
  textKey: string // Translation key for answer text
  score: number // Score weight (0-10)
}

export type TraitType = "courtesy" | "respect" | "integrity" | "courage" | "loyalty"

export type QuizAnswers = Record<number, string> // questionId -> answerId

// Modern Etiquette Questions (20 questions)
export const modernQuestions: Question[] = [
  {
    id: 1,
    mode: "modern",
    trait: "respect",
    textKey: "q_modern_1",
    answers: [
      { id: "a", textKey: "q_modern_1_a", score: 2 },
      { id: "b", textKey: "q_modern_1_b", score: 5 },
      { id: "c", textKey: "q_modern_1_c", score: 9 },
      { id: "d", textKey: "q_modern_1_d", score: 10 },
    ],
  },
  {
    id: 2,
    mode: "modern",
    trait: "courtesy",
    textKey: "q_modern_2",
    answers: [
      { id: "a", textKey: "q_modern_2_a", score: 3 },
      { id: "b", textKey: "q_modern_2_b", score: 7 },
      { id: "c", textKey: "q_modern_2_c", score: 9 },
      { id: "d", textKey: "q_modern_2_d", score: 10 },
    ],
  },
  {
    id: 3,
    mode: "modern",
    trait: "courtesy",
    textKey: "q_modern_3",
    answers: [
      { id: "a", textKey: "q_modern_3_a", score: 10 },
      { id: "b", textKey: "q_modern_3_b", score: 8 },
      { id: "c", textKey: "q_modern_3_c", score: 4 },
      { id: "d", textKey: "q_modern_3_d", score: 2 },
    ],
  },
  {
    id: 4,
    mode: "modern",
    trait: "integrity",
    textKey: "q_modern_4",
    answers: [
      { id: "a", textKey: "q_modern_4_a", score: 10 },
      { id: "b", textKey: "q_modern_4_b", score: 7 },
      { id: "c", textKey: "q_modern_4_c", score: 4 },
      { id: "d", textKey: "q_modern_4_d", score: 2 },
    ],
  },
  {
    id: 5,
    mode: "modern",
    trait: "respect",
    textKey: "q_modern_5",
    answers: [
      { id: "a", textKey: "q_modern_5_a", score: 9 },
      { id: "b", textKey: "q_modern_5_b", score: 8 },
      { id: "c", textKey: "q_modern_5_c", score: 4 },
      { id: "d", textKey: "q_modern_5_d", score: 2 },
    ],
  },
  {
    id: 6,
    mode: "modern",
    trait: "integrity",
    textKey: "q_modern_6",
    answers: [
      { id: "a", textKey: "q_modern_6_a", score: 10 },
      { id: "b", textKey: "q_modern_6_b", score: 8 },
      { id: "c", textKey: "q_modern_6_c", score: 5 },
      { id: "d", textKey: "q_modern_6_d", score: 1 },
    ],
  },
  {
    id: 7,
    mode: "modern",
    trait: "respect",
    textKey: "q_modern_7",
    answers: [
      { id: "a", textKey: "q_modern_7_a", score: 10 },
      { id: "b", textKey: "q_modern_7_b", score: 7 },
      { id: "c", textKey: "q_modern_7_c", score: 3 },
      { id: "d", textKey: "q_modern_7_d", score: 2 },
    ],
  },
  {
    id: 8,
    mode: "modern",
    trait: "courtesy",
    textKey: "q_modern_8",
    answers: [
      { id: "a", textKey: "q_modern_8_a", score: 10 },
      { id: "b", textKey: "q_modern_8_b", score: 8 },
      { id: "c", textKey: "q_modern_8_c", score: 4 },
      { id: "d", textKey: "q_modern_8_d", score: 1 },
    ],
  },
  {
    id: 9,
    mode: "modern",
    trait: "loyalty",
    textKey: "q_modern_9",
    answers: [
      { id: "a", textKey: "q_modern_9_a", score: 10 },
      { id: "b", textKey: "q_modern_9_b", score: 7 },
      { id: "c", textKey: "q_modern_9_c", score: 3 },
      { id: "d", textKey: "q_modern_9_d", score: 2 },
    ],
  },
  {
    id: 10,
    mode: "modern",
    trait: "integrity",
    textKey: "q_modern_10",
    answers: [
      { id: "a", textKey: "q_modern_10_a", score: 10 },
      { id: "b", textKey: "q_modern_10_b", score: 7 },
      { id: "c", textKey: "q_modern_10_c", score: 3 },
      { id: "d", textKey: "q_modern_10_d", score: 1 },
    ],
  },
  {
    id: 11,
    mode: "modern",
    trait: "courtesy",
    textKey: "q_modern_11",
    answers: [
      { id: "a", textKey: "q_modern_11_a", score: 9 },
      { id: "b", textKey: "q_modern_11_b", score: 8 },
      { id: "c", textKey: "q_modern_11_c", score: 4 },
      { id: "d", textKey: "q_modern_11_d", score: 2 },
    ],
  },
  {
    id: 12,
    mode: "modern",
    trait: "courtesy",
    textKey: "q_modern_12",
    answers: [
      { id: "a", textKey: "q_modern_12_a", score: 10 },
      { id: "b", textKey: "q_modern_12_b", score: 7 },
      { id: "c", textKey: "q_modern_12_c", score: 4 },
      { id: "d", textKey: "q_modern_12_d", score: 1 },
    ],
  },
  {
    id: 13,
    mode: "modern",
    trait: "respect",
    textKey: "q_modern_13",
    answers: [
      { id: "a", textKey: "q_modern_13_a", score: 10 },
      { id: "b", textKey: "q_modern_13_b", score: 7 },
      { id: "c", textKey: "q_modern_13_c", score: 3 },
      { id: "d", textKey: "q_modern_13_d", score: 1 },
    ],
  },
  {
    id: 14,
    mode: "modern",
    trait: "integrity",
    textKey: "q_modern_14",
    answers: [
      { id: "a", textKey: "q_modern_14_a", score: 10 },
      { id: "b", textKey: "q_modern_14_b", score: 6 },
      { id: "c", textKey: "q_modern_14_c", score: 2 },
      { id: "d", textKey: "q_modern_14_d", score: 1 },
    ],
  },
  {
    id: 15,
    mode: "modern",
    trait: "courtesy",
    textKey: "q_modern_15",
    answers: [
      { id: "a", textKey: "q_modern_15_a", score: 10 },
      { id: "b", textKey: "q_modern_15_b", score: 7 },
      { id: "c", textKey: "q_modern_15_c", score: 3 },
      { id: "d", textKey: "q_modern_15_d", score: 1 },
    ],
  },
  {
    id: 16,
    mode: "modern",
    trait: "respect",
    textKey: "q_modern_16",
    answers: [
      { id: "a", textKey: "q_modern_16_a", score: 10 },
      { id: "b", textKey: "q_modern_16_b", score: 6 },
      { id: "c", textKey: "q_modern_16_c", score: 2 },
      { id: "d", textKey: "q_modern_16_d", score: 4 },
    ],
  },
  {
    id: 17,
    mode: "modern",
    trait: "loyalty",
    textKey: "q_modern_17",
    answers: [
      { id: "a", textKey: "q_modern_17_a", score: 10 },
      { id: "b", textKey: "q_modern_17_b", score: 4 },
      { id: "c", textKey: "q_modern_17_c", score: 2 },
      { id: "d", textKey: "q_modern_17_d", score: 1 },
    ],
  },
  {
    id: 18,
    mode: "modern",
    trait: "courtesy",
    textKey: "q_modern_18",
    answers: [
      { id: "a", textKey: "q_modern_18_a", score: 9 },
      { id: "b", textKey: "q_modern_18_b", score: 5 },
      { id: "c", textKey: "q_modern_18_c", score: 4 },
      { id: "d", textKey: "q_modern_18_d", score: 2 },
    ],
  },
  {
    id: 19,
    mode: "modern",
    trait: "integrity",
    textKey: "q_modern_19",
    answers: [
      { id: "a", textKey: "q_modern_19_a", score: 10 },
      { id: "b", textKey: "q_modern_19_b", score: 8 },
      { id: "c", textKey: "q_modern_19_c", score: 5 },
      { id: "d", textKey: "q_modern_19_d", score: 1 },
    ],
  },
  {
    id: 20,
    mode: "modern",
    trait: "respect",
    textKey: "q_modern_20",
    answers: [
      { id: "a", textKey: "q_modern_20_a", score: 10 },
      { id: "b", textKey: "q_modern_20_b", score: 7 },
      { id: "c", textKey: "q_modern_20_c", score: 3 },
      { id: "d", textKey: "q_modern_20_d", score: 1 },
    ],
  },
]

// Knight's Code Questions (15 questions)
export const knightQuestions: Question[] = [
  {
    id: 1,
    mode: "knight",
    trait: "integrity",
    textKey: "q_knight_1",
    answers: [
      { id: "a", textKey: "q_knight_1_a", score: 10 },
      { id: "b", textKey: "q_knight_1_b", score: 7 },
      { id: "c", textKey: "q_knight_1_c", score: 2 },
      { id: "d", textKey: "q_knight_1_d", score: 1 },
    ],
  },
  {
    id: 2,
    mode: "knight",
    trait: "courage",
    textKey: "q_knight_2",
    answers: [
      { id: "a", textKey: "q_knight_2_a", score: 10 },
      { id: "b", textKey: "q_knight_2_b", score: 7 },
      { id: "c", textKey: "q_knight_2_c", score: 4 },
      { id: "d", textKey: "q_knight_2_d", score: 1 },
    ],
  },
  {
    id: 3,
    mode: "knight",
    trait: "loyalty",
    textKey: "q_knight_3",
    answers: [
      { id: "a", textKey: "q_knight_3_a", score: 10 },
      { id: "b", textKey: "q_knight_3_b", score: 6 },
      { id: "c", textKey: "q_knight_3_c", score: 3 },
      { id: "d", textKey: "q_knight_3_d", score: 2 },
    ],
  },
  {
    id: 4,
    mode: "knight",
    trait: "courtesy",
    textKey: "q_knight_4",
    answers: [
      { id: "a", textKey: "q_knight_4_a", score: 10 },
      { id: "b", textKey: "q_knight_4_b", score: 8 },
      { id: "c", textKey: "q_knight_4_c", score: 5 },
      { id: "d", textKey: "q_knight_4_d", score: 2 },
    ],
  },
  {
    id: 5,
    mode: "knight",
    trait: "courtesy",
    textKey: "q_knight_5",
    answers: [
      { id: "a", textKey: "q_knight_5_a", score: 10 },
      { id: "b", textKey: "q_knight_5_b", score: 7 },
      { id: "c", textKey: "q_knight_5_c", score: 3 },
      { id: "d", textKey: "q_knight_5_d", score: 1 },
    ],
  },
  {
    id: 6,
    mode: "knight",
    trait: "integrity",
    textKey: "q_knight_6",
    answers: [
      { id: "a", textKey: "q_knight_6_a", score: 9 },
      { id: "b", textKey: "q_knight_6_b", score: 7 },
      { id: "c", textKey: "q_knight_6_c", score: 3 },
      { id: "d", textKey: "q_knight_6_d", score: 1 },
    ],
  },
  {
    id: 7,
    mode: "knight",
    trait: "courage",
    textKey: "q_knight_7",
    answers: [
      { id: "a", textKey: "q_knight_7_a", score: 10 },
      { id: "b", textKey: "q_knight_7_b", score: 8 },
      { id: "c", textKey: "q_knight_7_c", score: 4 },
      { id: "d", textKey: "q_knight_7_d", score: 1 },
    ],
  },
  {
    id: 8,
    mode: "knight",
    trait: "loyalty",
    textKey: "q_knight_8",
    answers: [
      { id: "a", textKey: "q_knight_8_a", score: 10 },
      { id: "b", textKey: "q_knight_8_b", score: 6 },
      { id: "c", textKey: "q_knight_8_c", score: 3 },
      { id: "d", textKey: "q_knight_8_d", score: 1 },
    ],
  },
  {
    id: 9,
    mode: "knight",
    trait: "courtesy",
    textKey: "q_knight_9",
    answers: [
      { id: "a", textKey: "q_knight_9_a", score: 10 },
      { id: "b", textKey: "q_knight_9_b", score: 7 },
      { id: "c", textKey: "q_knight_9_c", score: 4 },
      { id: "d", textKey: "q_knight_9_d", score: 1 },
    ],
  },
  {
    id: 10,
    mode: "knight",
    trait: "courtesy",
    textKey: "q_knight_10",
    answers: [
      { id: "a", textKey: "q_knight_10_a", score: 9 },
      { id: "b", textKey: "q_knight_10_b", score: 7 },
      { id: "c", textKey: "q_knight_10_c", score: 4 },
      { id: "d", textKey: "q_knight_10_d", score: 2 },
    ],
  },
  {
    id: 11,
    mode: "knight",
    trait: "integrity",
    textKey: "q_knight_11",
    answers: [
      { id: "a", textKey: "q_knight_11_a", score: 10 },
      { id: "b", textKey: "q_knight_11_b", score: 6 },
      { id: "c", textKey: "q_knight_11_c", score: 3 },
      { id: "d", textKey: "q_knight_11_d", score: 1 },
    ],
  },
  {
    id: 12,
    mode: "knight",
    trait: "courage",
    textKey: "q_knight_12",
    answers: [
      { id: "a", textKey: "q_knight_12_a", score: 10 },
      { id: "b", textKey: "q_knight_12_b", score: 7 },
      { id: "c", textKey: "q_knight_12_c", score: 4 },
      { id: "d", textKey: "q_knight_12_d", score: 1 },
    ],
  },
  {
    id: 13,
    mode: "knight",
    trait: "loyalty",
    textKey: "q_knight_13",
    answers: [
      { id: "a", textKey: "q_knight_13_a", score: 9 },
      { id: "b", textKey: "q_knight_13_b", score: 6 },
      { id: "c", textKey: "q_knight_13_c", score: 4 },
      { id: "d", textKey: "q_knight_13_d", score: 2 },
    ],
  },
  {
    id: 14,
    mode: "knight",
    trait: "respect",
    textKey: "q_knight_14",
    answers: [
      { id: "a", textKey: "q_knight_14_a", score: 10 },
      { id: "b", textKey: "q_knight_14_b", score: 6 },
      { id: "c", textKey: "q_knight_14_c", score: 2 },
      { id: "d", textKey: "q_knight_14_d", score: 1 },
    ],
  },
  {
    id: 15,
    mode: "knight",
    trait: "courtesy",
    textKey: "q_knight_15",
    answers: [
      { id: "a", textKey: "q_knight_15_a", score: 10 },
      { id: "b", textKey: "q_knight_15_b", score: 7 },
      { id: "c", textKey: "q_knight_15_c", score: 3 },
      { id: "d", textKey: "q_knight_15_d", score: 1 },
    ],
  },
]

// Combine all questions
export const allQuestions: Question[] = [...modernQuestions, ...knightQuestions]

// Result levels based on score
export interface ResultLevel {
  min: number
  max: number
  title: string
  modernTitle?: string
  knightTitle?: string
  description: string
  strengths: string[]
  improvement: string
  color: string
  dailyChallenge?: string
}

export const modernResultLevels: ResultLevel[] = [
  {
    min: 0,
    max: 30,
    title: "The Kind Observer",
    description:
      "You're developing your awareness of others. Small acts of kindness can make a big difference.",
    strengths: ["Independent", "Self-aware", "Growing"],
    improvement: "Try to notice one opportunity each day to show courtesy or respect.",
    color: "text-blue-400",
    dailyChallenge: "Hold the door for someone today",
  },
  {
    min: 31,
    max: 60,
    title: "Everyday Knight",
    description:
      "You show respect and courtesy in daily life. You're building the foundation of modern chivalry.",
    strengths: ["Respectful", "Considerate", "Practical"],
    improvement: "Look for opportunities to go beyond basic courtesy—show genuine care.",
    color: "text-purple-400",
    dailyChallenge: "Listen fully to someone without interrupting",
  },
  {
    min: 61,
    max: 85,
    title: "True Gentleman",
    description:
      "You consistently demonstrate respect, integrity, and kindness. Modern chivalry is part of who you are.",
    strengths: ["Noble", "Integrity-driven", "Compassionate"],
    improvement: "Continue inspiring others through your example.",
    color: "text-emerald-400",
    dailyChallenge: "Help someone without expecting anything in return",
  },
  {
    min: 86,
    max: 100,
    title: "Chivalry Champion",
    description:
      "You embody modern chivalry in every interaction. Your respect, integrity, and kindness set the standard.",
    strengths: ["Exemplary", "Noble", "Inspiring"],
    improvement: "Share your values and mentor others in the path of chivalry.",
    color: "text-amber-400",
    dailyChallenge: "Mentor someone in practicing chivalry",
  },
]

export const knightResultLevels: ResultLevel[] = [
  {
    min: 0,
    max: 30,
    title: "Squire in Training",
    description: "You're learning the ways of honor and virtue. Every knight started as a squire.",
    strengths: ["Learning", "Humble", "Growing"],
    improvement: "Study the virtues: honor, courage, loyalty, humility, and courtesy.",
    color: "text-blue-400",
    dailyChallenge: "Practice one knightly virtue today",
  },
  {
    min: 31,
    max: 60,
    title: "Knight of Honor",
    description:
      "You understand the knight's code and practice it in your daily life. Honor guides your actions.",
    strengths: ["Honorable", "Dedicated", "Virtuous"],
    improvement: "Deepen your commitment to all five knightly virtues.",
    color: "text-purple-400",
    dailyChallenge: "Stand up for someone who needs help",
  },
  {
    min: 61,
    max: 85,
    title: "Paladin of Virtues",
    description:
      "You embody the knightly virtues. Your honor, courage, and loyalty inspire those around you.",
    strengths: ["Virtuous", "Courageous", "Loyal"],
    improvement: "Continue to be a beacon of virtue in your community.",
    color: "text-emerald-400",
    dailyChallenge: "Defend someone's honor or reputation",
  },
  {
    min: 86,
    max: 100,
    title: "Champion of the Round",
    description:
      "You are a true champion of chivalry. Your unwavering commitment to honor and virtue sets you apart.",
    strengths: ["Exemplary", "Noble", "Legendary"],
    improvement: "Lead others on the path of true chivalry and honor.",
    color: "text-amber-400",
    dailyChallenge: "Mentor a new knight in the ways of honor",
  },
]

// Calculate scores
export function calculateScore(answers: Record<number, string>, questions: Question[]): number {
  let totalScore = 0
  let maxScore = 0

  questions.forEach((question) => {
    const answerId = answers[question.id]
    if (answerId) {
      const answer = question.answers.find((a) => a.id === answerId)
      if (answer) {
        totalScore += answer.score
      }
    }
    const maxAnswerScore = Math.max(...question.answers.map((a) => a.score))
    maxScore += maxAnswerScore
  })

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
}

// Calculate trait scores
export function calculateTraitScores(
  answers: Record<number, string>,
  questions: Question[]
): Record<TraitType, number> {
  const traitScores: Record<string, { total: number; max: number }> = {
    courtesy: { total: 0, max: 0 },
    respect: { total: 0, max: 0 },
    integrity: { total: 0, max: 0 },
    courage: { total: 0, max: 0 },
    loyalty: { total: 0, max: 0 },
  }

  questions.forEach((question) => {
    if (!question.trait) return

    // Skip if trait is not in the valid TraitType list
    if (!(question.trait in traitScores)) return

    const answerId = answers[question.id]
    const maxAnswerScore = Math.max(...question.answers.map((a) => a.score))

    if (answerId) {
      const answer = question.answers.find((a) => a.id === answerId)
      if (answer) {
        traitScores[question.trait].total += answer.score
      }
    }
    traitScores[question.trait].max += maxAnswerScore
  })

  const result: Record<TraitType, number> = {
    courtesy: 0,
    respect: 0,
    integrity: 0,
    courage: 0,
    loyalty: 0,
  }

  Object.keys(traitScores).forEach((trait) => {
    const scores = traitScores[trait]
    result[trait as TraitType] = scores.max > 0 ? Math.round((scores.total / scores.max) * 100) : 0
  })

  return result
}

// Get result level based on score
export function getResultLevel(score: number, mode: QuizMode = "modern"): ResultLevel {
  const levels = mode === "knight" ? knightResultLevels : modernResultLevels
  const level = levels.find((level) => score >= level.min && score <= level.max)
  return level || levels[0]
}
