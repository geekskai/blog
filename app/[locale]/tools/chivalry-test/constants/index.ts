// Chivalry Test - Questions and Answers (V2 - Dual Mode)

export type QuizMode = "modern" | "knight" | "hybrid"

export interface Question {
  id: number
  text: string
  answers: Answer[]
  mode: "modern" | "knight"
  trait?: TraitType // Which trait this question measures
}

export interface Answer {
  id: string
  text: string
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
    text: "If you're on a date and your phone rings, what do you do?",
    answers: [
      { id: "a", text: "Answer it immediately", score: 2 },
      { id: "b", text: "Check who it is, then decide", score: 5 },
      { id: "c", text: "Silence it and focus on your date", score: 9 },
      { id: "d", text: "Turn it off before the date starts", score: 10 },
    ],
  },
  {
    id: 2,
    mode: "modern",
    trait: "courtesy",
    text: "When entering a building, you notice someone behind you. What do you do?",
    answers: [
      { id: "a", text: "Walk through without looking back", score: 3 },
      { id: "b", text: "Hold the door briefly if they're close", score: 7 },
      { id: "c", text: "Hold the door open for them", score: 9 },
      { id: "d", text: "Hold the door and greet them warmly", score: 10 },
    ],
  },
  {
    id: 3,
    mode: "modern",
    trait: "courtesy",
    text: "A colleague is struggling with a heavy box. Your response?",
    answers: [
      { id: "a", text: "Offer to help carry it", score: 10 },
      { id: "b", text: "Ask if they need help", score: 8 },
      { id: "c", text: "Wait to see if they ask", score: 4 },
      { id: "d", text: "Continue with your own tasks", score: 2 },
    ],
  },
  {
    id: 4,
    mode: "modern",
    trait: "integrity",
    text: "You accidentally bump into someone on the street. What's your reaction?",
    answers: [
      { id: "a", text: "Apologize immediately and check if they're okay", score: 10 },
      { id: "b", text: "Say sorry quickly", score: 7 },
      { id: "c", text: "Nod and keep walking", score: 4 },
      { id: "d", text: "Ignore it if they seem fine", score: 2 },
    ],
  },
  {
    id: 5,
    mode: "modern",
    trait: "respect",
    text: "In a group conversation, someone gets interrupted. What do you do?",
    answers: [
      { id: "a", text: "Wait for them to finish their thought", score: 9 },
      { id: "b", text: "Acknowledge what they were saying", score: 8 },
      { id: "c", text: "Continue with the conversation", score: 4 },
      { id: "d", text: "Don't notice or care", score: 2 },
    ],
  },
  {
    id: 6,
    mode: "modern",
    trait: "integrity",
    text: "You see someone drop their wallet. What's your first action?",
    answers: [
      { id: "a", text: "Pick it up and return it immediately", score: 10 },
      { id: "b", text: "Call out to them", score: 8 },
      { id: "c", text: "Wait to see if they notice", score: 5 },
      { id: "d", text: "Leave it alone", score: 1 },
    ],
  },
  {
    id: 7,
    mode: "modern",
    trait: "respect",
    text: "When someone shares a personal problem with you, you:",
    answers: [
      { id: "a", text: "Listen attentively and offer support", score: 10 },
      { id: "b", text: "Listen but offer quick advice", score: 7 },
      { id: "c", text: "Change the subject", score: 3 },
      { id: "d", text: "Minimize their concerns", score: 2 },
    ],
  },
  {
    id: 8,
    mode: "modern",
    trait: "courtesy",
    text: "You're in a crowded elevator. The door opens and an elderly person enters. You:",
    answers: [
      { id: "a", text: "Offer your spot immediately", score: 10 },
      { id: "b", text: "Move to make more room", score: 8 },
      { id: "c", text: "Stay where you are", score: 4 },
      { id: "d", text: "Ignore them", score: 1 },
    ],
  },
  {
    id: 9,
    mode: "modern",
    trait: "loyalty",
    text: "A friend asks you to help them move on a weekend. You:",
    answers: [
      { id: "a", text: "Agree without hesitation", score: 10 },
      { id: "b", text: "Agree if you're free", score: 7 },
      { id: "c", text: "Make excuses", score: 3 },
      { id: "d", text: "Say you're too busy", score: 2 },
    ],
  },
  {
    id: 10,
    mode: "modern",
    trait: "integrity",
    text: "You make a mistake that affects others. Your response?",
    answers: [
      { id: "a", text: "Take full responsibility and fix it", score: 10 },
      { id: "b", text: "Apologize and explain", score: 7 },
      { id: "c", text: "Blame circumstances", score: 3 },
      { id: "d", text: "Avoid taking responsibility", score: 1 },
    ],
  },
  {
    id: 11,
    mode: "modern",
    trait: "courtesy",
    text: "Someone gives you a compliment. You:",
    answers: [
      { id: "a", text: "Accept graciously and return a compliment", score: 9 },
      { id: "b", text: "Say thank you sincerely", score: 8 },
      { id: "c", text: "Dismiss it awkwardly", score: 4 },
      { id: "d", text: "Ignore it", score: 2 },
    ],
  },
  {
    id: 12,
    mode: "modern",
    trait: "courtesy",
    text: "You're running late and see someone who needs directions. You:",
    answers: [
      { id: "a", text: "Stop and help them anyway", score: 10 },
      { id: "b", text: "Give quick directions while walking", score: 7 },
      { id: "c", text: "Say you're in a hurry", score: 4 },
      { id: "d", text: "Ignore them", score: 1 },
    ],
  },
  {
    id: 13,
    mode: "modern",
    trait: "respect",
    text: "In a meeting, a junior colleague presents an idea. You:",
    answers: [
      { id: "a", text: "Listen fully and provide constructive feedback", score: 10 },
      { id: "b", text: "Listen but offer quick suggestions", score: 7 },
      { id: "c", text: "Interrupt with your own ideas", score: 3 },
      { id: "d", text: "Check your phone during their presentation", score: 1 },
    ],
  },
  {
    id: 14,
    mode: "modern",
    trait: "integrity",
    text: "You notice a cashier gave you too much change. You:",
    answers: [
      { id: "a", text: "Return the excess immediately", score: 10 },
      { id: "b", text: "Mention it but keep it if they say it's fine", score: 6 },
      { id: "c", text: "Keep it without saying anything", score: 2 },
      { id: "d", text: "Consider it a lucky break", score: 1 },
    ],
  },
  {
    id: 15,
    mode: "modern",
    trait: "courtesy",
    text: "You're in a restaurant and the service is slow. You:",
    answers: [
      { id: "a", text: "Wait patiently and remain polite", score: 10 },
      { id: "b", text: "Ask politely about the delay", score: 7 },
      { id: "c", text: "Show visible frustration", score: 3 },
      { id: "d", text: "Complain loudly or leave", score: 1 },
    ],
  },
  {
    id: 16,
    mode: "modern",
    trait: "respect",
    text: "Someone has a different political view than you. You:",
    answers: [
      { id: "a", text: "Listen respectfully and engage in civil discussion", score: 10 },
      { id: "b", text: "Acknowledge their view but keep it brief", score: 6 },
      { id: "c", text: "Dismiss their opinion immediately", score: 2 },
      { id: "d", text: "Avoid the conversation entirely", score: 4 },
    ],
  },
  {
    id: 17,
    mode: "modern",
    trait: "loyalty",
    text: "A friend confides in you about a personal struggle. You:",
    answers: [
      { id: "a", text: "Keep their confidence and offer support", score: 10 },
      { id: "b", text: "Listen but share with one close friend", score: 4 },
      { id: "c", text: "Share it casually in conversation", score: 2 },
      { id: "d", text: "Post about it online", score: 1 },
    ],
  },
  {
    id: 18,
    mode: "modern",
    trait: "courtesy",
    text: "You're in a quiet library and someone is talking loudly. You:",
    answers: [
      { id: "a", text: "Politely ask them to lower their voice", score: 9 },
      { id: "b", text: "Give them a look but say nothing", score: 5 },
      { id: "c", text: "Complain to staff", score: 4 },
      { id: "d", text: "Join in the conversation", score: 2 },
    ],
  },
  {
    id: 19,
    mode: "modern",
    trait: "integrity",
    text: "You find a lost item with contact information. You:",
    answers: [
      { id: "a", text: "Contact the owner immediately", score: 10 },
      { id: "b", text: "Turn it in to lost and found", score: 8 },
      { id: "c", text: "Wait to see if someone claims it", score: 5 },
      { id: "d", text: "Keep it if valuable", score: 1 },
    ],
  },
  {
    id: 20,
    mode: "modern",
    trait: "respect",
    text: "Someone makes a mistake in a group project. You:",
    answers: [
      { id: "a", text: "Help them fix it without blame", score: 10 },
      { id: "b", text: "Point it out constructively", score: 7 },
      { id: "c", text: "Mention it to others", score: 3 },
      { id: "d", text: "Publicly criticize them", score: 1 },
    ],
  },
]

// Knight's Code Questions (15 questions)
export const knightQuestions: Question[] = [
  {
    id: 21,
    mode: "knight",
    trait: "honor",
    text: "While jousting in a tournament, you notice your opponent is injured. You:",
    answers: [
      { id: "a", text: "Stop immediately and ensure their safety", score: 10 },
      { id: "b", text: "Continue but avoid targeting the injury", score: 7 },
      { id: "c", text: "Use it to your advantage", score: 2 },
      { id: "d", text: "Press the attack harder", score: 1 },
    ],
  },
  {
    id: 22,
    mode: "knight",
    trait: "courage",
    text: "A village is threatened by bandits. You:",
    answers: [
      { id: "a", text: "Ride to defend them without hesitation", score: 10 },
      { id: "b", text: "Assess the situation first", score: 7 },
      { id: "c", text: "Wait for reinforcements", score: 4 },
      { id: "d", text: "Avoid the conflict", score: 1 },
    ],
  },
  {
    id: 23,
    mode: "knight",
    trait: "loyalty",
    text: "Your liege lord asks you to do something against your values. You:",
    answers: [
      { id: "a", text: "Refuse respectfully and explain why", score: 10 },
      { id: "b", text: "Try to find a compromise", score: 6 },
      { id: "c", text: "Do it reluctantly", score: 3 },
      { id: "d", text: "Obey without question", score: 2 },
    ],
  },
  {
    id: 24,
    mode: "knight",
    trait: "humility",
    text: "You win a great victory. How do you handle the praise?",
    answers: [
      { id: "a", text: "Credit your team and remain humble", score: 10 },
      { id: "b", text: "Accept graciously but stay modest", score: 8 },
      { id: "c", text: "Enjoy the recognition", score: 5 },
      { id: "d", text: "Boast about your achievements", score: 2 },
    ],
  },
  {
    id: 25,
    mode: "knight",
    trait: "courtesy",
    text: "A commoner approaches you with a request. You:",
    answers: [
      { id: "a", text: "Listen attentively and help if possible", score: 10 },
      { id: "b", text: "Hear them out politely", score: 7 },
      { id: "c", text: "Dismiss them quickly", score: 3 },
      { id: "d", text: "Ignore them", score: 1 },
    ],
  },
  {
    id: 26,
    mode: "knight",
    trait: "honor",
    text: "You discover a fellow knight has broken their oath. You:",
    answers: [
      { id: "a", text: "Confront them privately first", score: 9 },
      { id: "b", text: "Report to authorities", score: 7 },
      { id: "c", text: "Ignore it to avoid conflict", score: 3 },
      { id: "d", text: "Use it against them", score: 1 },
    ],
  },
  {
    id: 27,
    mode: "knight",
    trait: "courage",
    text: "You face an enemy stronger than you. You:",
    answers: [
      { id: "a", text: "Stand your ground with honor", score: 10 },
      { id: "b", text: "Fight strategically", score: 8 },
      { id: "c", text: "Retreat to fight another day", score: 4 },
      { id: "d", text: "Surrender immediately", score: 1 },
    ],
  },
  {
    id: 28,
    mode: "knight",
    trait: "loyalty",
    text: "Your sworn enemy saves your life. You:",
    answers: [
      { id: "a", text: "Acknowledge the debt and honor it", score: 10 },
      { id: "b", text: "Thank them but remain cautious", score: 6 },
      { id: "c", text: "Accept help but maintain hostility", score: 3 },
      { id: "d", text: "Use it as an opportunity to strike", score: 1 },
    ],
  },
  {
    id: 29,
    mode: "knight",
    trait: "humility",
    text: "A squire challenges you to a duel. You:",
    answers: [
      { id: "a", text: "Decline gracefully and offer to train them", score: 10 },
      { id: "b", text: "Accept but go easy on them", score: 7 },
      { id: "c", text: "Accept and prove your superiority", score: 4 },
      { id: "d", text: "Humiliate them publicly", score: 1 },
    ],
  },
  {
    id: 30,
    mode: "knight",
    trait: "courtesy",
    text: "You're invited to a feast. A guest is being rude. You:",
    answers: [
      { id: "a", text: "Address it diplomatically", score: 9 },
      { id: "b", text: "Speak to the host privately", score: 7 },
      { id: "c", text: "Ignore it", score: 4 },
      { id: "d", text: "Confront them publicly", score: 2 },
    ],
  },
  {
    id: 31,
    mode: "knight",
    trait: "honor",
    text: "You're offered a reward for a deed you didn't fully accomplish. You:",
    answers: [
      { id: "a", text: "Decline and explain the truth", score: 10 },
      { id: "b", text: "Accept but share credit", score: 6 },
      { id: "c", text: "Accept without comment", score: 3 },
      { id: "d", text: "Accept and exaggerate your role", score: 1 },
    ],
  },
  {
    id: 32,
    mode: "knight",
    trait: "courage",
    text: "You must choose between saving a friend or completing a mission. You:",
    answers: [
      { id: "a", text: "Save your friend, mission be damned", score: 10 },
      { id: "b", text: "Try to do both", score: 7 },
      { id: "c", text: "Complete the mission", score: 4 },
      { id: "d", text: "Save yourself", score: 1 },
    ],
  },
  {
    id: 33,
    mode: "knight",
    trait: "loyalty",
    text: "Your order's code conflicts with your personal beliefs. You:",
    answers: [
      { id: "a", text: "Seek guidance and reconcile both", score: 9 },
      { id: "b", text: "Follow the code but question it", score: 6 },
      { id: "c", text: "Follow your beliefs", score: 4 },
      { id: "d", text: "Abandon the order", score: 2 },
    ],
  },
  {
    id: 34,
    mode: "knight",
    trait: "humility",
    text: "A peasant teaches you something valuable. You:",
    answers: [
      { id: "a", text: "Acknowledge their wisdom and learn", score: 10 },
      { id: "b", text: "Accept it but maintain status", score: 6 },
      { id: "c", text: "Dismiss it due to their station", score: 2 },
      { id: "d", text: "Ignore them", score: 1 },
    ],
  },
  {
    id: 35,
    mode: "knight",
    trait: "courtesy",
    text: "You must deliver bad news to a grieving family. You:",
    answers: [
      { id: "a", text: "Do it with compassion and respect", score: 10 },
      { id: "b", text: "Be direct but kind", score: 7 },
      { id: "c", text: "Send someone else", score: 3 },
      { id: "d", text: "Avoid it entirely", score: 1 },
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
