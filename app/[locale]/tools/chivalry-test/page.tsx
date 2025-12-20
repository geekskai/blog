"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import {
  ChevronRight,
  ChevronLeft,
  Shield,
  CheckCircle,
  Sparkles,
  Sword,
  Users,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import {
  modernQuestions,
  knightQuestions,
  allQuestions,
  calculateScore,
  calculateTraitScores,
  getResultLevel,
  type QuizAnswers,
  type QuizMode,
  type TraitType,
} from "./constants"
import ShareButtons from "@/components/ShareButtons"
import RadarChart from "./components/RadarChart"
import ShareCard from "./components/ShareCard"
import { ContentSections } from "./components/ContentSections"

const ChivalryTest = () => {
  const t = useTranslations("ChivalryTest")

  const [quizMode, setQuizMode] = useState<QuizMode>("modern")
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [score, setScore] = useState<number | null>(null)
  const [traitScores, setTraitScores] = useState<Record<TraitType, number> | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showModeSelection, setShowModeSelection] = useState(true)

  // Get questions based on mode
  const getQuestions = () => {
    if (quizMode === "modern") return modernQuestions
    if (quizMode === "knight") return knightQuestions
    return allQuestions
  }

  const questions = getQuestions()

  // Calculate progress percentage
  const progress = ((currentQuestion - 1) / questions.length) * 100

  // Handle answer selection
  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }))
  }

  // Move to next question
  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate final score
      const finalScore = calculateScore(answers, questions)
      const traits = calculateTraitScores(answers, questions)
      setScore(finalScore)
      setTraitScores(traits)
      setIsComplete(true)
    }
  }

  // Move to previous question
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Start quiz
  const handleStartQuiz = (mode: QuizMode) => {
    setQuizMode(mode)
    setShowModeSelection(false)
    setCurrentQuestion(1)
    setAnswers({})
  }

  // Restart quiz
  const handleRestart = () => {
    setShowModeSelection(true)
    setCurrentQuestion(1)
    setAnswers({})
    setScore(null)
    setTraitScores(null)
    setIsComplete(false)
  }

  // Get current question data
  const currentQuestionData = questions.find((q) => q.id === currentQuestion)
  const selectedAnswer = answers[currentQuestion]
  const canProceed = selectedAnswer !== undefined

  // Get result level if quiz is complete
  const resultLevel = score !== null ? getResultLevel(score, quizMode) : null

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section - SEO Optimized */}
        <header className="mb-12 text-center">
          {/* Tool Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-3 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30">
            <div className="rounded-full bg-white/20 p-1">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-semibold">{t("chivalry_test")}</span>
          </div>

          {/* Main Title - H1 for SEO */}
          <h1 className="my-6 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-3xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-md mx-auto mb-6 max-w-3xl leading-relaxed text-slate-300 md:text-lg">
            {t("subtitle")}
          </p>

          {/* Share Buttons */}
          {!isComplete && !showModeSelection && <ShareButtons />}
        </header>

        {/* Mode Selection Screen */}
        {showModeSelection && !isComplete && (
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{t("choose_mode")}</h2>
              <p className="text-slate-400">{t("choose_mode_description")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Modern Mode Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/25 via-blue-500/20 to-blue-500/25 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-blue-500/25">
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/15 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-6 py-3 backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                    <h3 className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-xl font-bold text-transparent">
                      {t("modern_mode")}
                    </h3>
                  </div>
                  <p className="mb-6 text-slate-300">{t("modern_mode_description")}</p>
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      {t("modern_feature_1")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      {t("modern_feature_2")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      {t("modern_feature_3")}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartQuiz("modern")}
                    className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {t("start_modern_quiz")}
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Knight Mode Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/25 via-purple-500/20 to-pink-500/25 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-purple-500/25">
                <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-3 backdrop-blur-sm">
                    <Sword className="h-6 w-6 text-purple-500" />
                    <h3 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                      {t("knight_mode")}
                    </h3>
                  </div>
                  <p className="mb-6 text-slate-300">{t("knight_mode_description")}</p>
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      {t("knight_feature_1")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      {t("knight_feature_2")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      {t("knight_feature_3")}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartQuiz("knight")}
                    className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {t("start_knight_quiz")}
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hybrid Option */}
            <div className="mt-6 text-center">
              <button
                onClick={() => handleStartQuiz("hybrid")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <Users className="h-4 w-4" />
                {t("try_hybrid_mode")}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Content */}
        {!isComplete && !showModeSelection && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                  <span>
                    {t("question")} {currentQuestion} {t("of")} {questions.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
              <div className="border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-6">
                <h2 className="text-xl font-semibold text-white md:text-2xl">
                  {currentQuestionData?.text}
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {currentQuestionData?.answers.map((answer) => {
                    const isSelected = selectedAnswer === answer.id
                    return (
                      <button
                        key={answer.id}
                        onClick={() => handleAnswerSelect(currentQuestion, answer.id)}
                        className={`group relative w-full overflow-hidden rounded-lg border-2 p-4 text-left transition-all duration-300 ${
                          isSelected
                            ? "border-blue-500 bg-blue-900/20 shadow-md"
                            : "border-white/10 bg-white/5 hover:border-blue-400 hover:bg-blue-900/10"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
                        )}
                        <div className="relative flex items-center justify-between">
                          <span
                            className={`font-medium ${
                              isSelected ? "text-blue-300" : "text-slate-300"
                            }`}
                          >
                            {answer.text}
                          </span>
                          {isSelected && <CheckCircle className="h-5 w-5 text-blue-400" />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 1}
                    className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t("previous")}
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {currentQuestion === questions.length ? t("see_results") : t("next")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {isComplete && score !== null && resultLevel && traitScores && (
          <div className="space-y-8">
            {/* Main Result Card */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
              <div
                className={`border-b border-white/10 bg-gradient-to-r p-8 ${
                  resultLevel.color.includes("blue")
                    ? "from-blue-900/20 to-indigo-900/20"
                    : resultLevel.color.includes("purple")
                      ? "from-purple-900/20 to-pink-900/20"
                      : resultLevel.color.includes("emerald")
                        ? "from-emerald-900/20 to-teal-900/20"
                        : "from-amber-900/20 to-yellow-900/20"
                }`}
              >
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/5 p-4 shadow-lg backdrop-blur-sm">
                    <Shield className={`h-16 w-16 ${resultLevel.color}`} />
                  </div>
                  <h2 className="mb-2 text-4xl font-bold text-white md:text-5xl">
                    {resultLevel.title}
                  </h2>
                  <div className={`mb-4 text-6xl font-bold ${resultLevel.color} md:text-7xl`}>
                    {score}
                  </div>
                  <p className="mx-auto max-w-2xl text-lg text-slate-300">
                    {resultLevel.description}
                  </p>
                </div>
              </div>

              <div className="p-8">
                {/* Radar Chart */}
                <div className="mb-8">
                  <h3 className="mb-4 text-center text-xl font-semibold text-white">
                    {t("your_traits")}
                  </h3>
                  <RadarChart scores={traitScores} className="mx-auto" />
                </div>

                {/* Strengths */}
                {resultLevel.strengths.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-lg font-semibold text-white">{t("your_strengths")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {resultLevel.strengths.map((strength, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-emerald-900/30 px-4 py-2 text-sm font-medium text-emerald-300"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Daily Challenge */}
                {resultLevel.dailyChallenge && (
                  <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-4 backdrop-blur-sm">
                    <h3 className="mb-2 text-lg font-semibold text-emerald-300">
                      {t("daily_challenge")}
                    </h3>
                    <p className="text-emerald-200">{resultLevel.dailyChallenge}</p>
                  </div>
                )}

                {/* Improvement Suggestion */}
                <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-900/20 p-4 backdrop-blur-sm">
                  <h3 className="mb-2 text-lg font-semibold text-blue-300">
                    {t("improvement_suggestion")}
                  </h3>
                  <p className="text-blue-200">{resultLevel.improvement}</p>
                </div>

                {/* Share Card */}
                <div className="mb-6">
                  <ShareCard
                    score={score}
                    resultLevel={resultLevel}
                    traitScores={traitScores}
                    mode={quizMode}
                  />
                </div>

                {/* Share Section */}
                <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <h3 className="mb-3 text-lg font-semibold text-white">{t("share_results")}</h3>
                  <ShareButtons />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t("retake_test")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Sections - Always visible for SEO */}
        {!isComplete && <ContentSections />}
      </div>
    </div>
  )
}

export default ChivalryTest
