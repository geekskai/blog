"use client"

import React, { useState, useEffect } from "react"
import { StartScreen } from "./components/StartScreen"
import { QuestionCard } from "./components/QuestionCard"
import { ResultCard } from "./components/ResultCard"
import { SEOContent } from "./components/SEOContent"
import { LearnMoreSection } from "./components/LearnMoreSection"
import { useEmotionTest } from "./hooks"
import { ChevronLeft, Home } from "lucide-react"
import { Link } from "@/app/i18n/navigation"
import { useTranslations } from "next-intl"

type AppState = "start" | "testing" | "results"

const EmotionPhoneTest: React.FC = () => {
  const t = useTranslations("InsideOut2GluedToPhoneTest")
  const [appState, setAppState] = useState<AppState>("start")
  const [fadeIn, setFadeIn] = useState(false)

  const {
    testState,
    getCurrentQuestion,
    answerQuestion,
    goToPreviousQuestion,
    restartTest,
    canGoBack,
    getTestStats,
  } = useEmotionTest((key) => t(key as any))

  // 页面加载动画
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // 监听测试状态变化
  useEffect(() => {
    if (testState.isComplete && testState.result) {
      setAppState("results")
    }
  }, [testState.isComplete, testState.result])

  const handleStartTest = () => {
    setAppState("testing")
    restartTest()
  }

  const handleRetakeTest = () => {
    setAppState("start")
    restartTest()
  }

  const handleGoBack = () => {
    if (appState === "testing" && canGoBack()) {
      goToPreviousQuestion()
    } else if (appState === "testing") {
      setAppState("start")
    } else if (appState === "results") {
      setAppState("start")
    }
  }

  const currentQuestion = getCurrentQuestion()
  const stats = getTestStats()

  return (
    <div
      className={`min-h-screen bg-slate-950 transition-opacity duration-1000 ${fadeIn ? "opacity-100" : "opacity-0"}`}
    >
      {/* 导航栏 */}
      {appState !== "start" && (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {appState === "testing" && canGoBack()
                    ? t("nav_previous_question")
                    : t("nav_back")}
                </button>

                {appState === "testing" && (
                  <div className="text-sm text-slate-300">
                    {t("nav_question_of", {
                      current: stats.currentQuestion,
                      total: stats.totalQuestions,
                    })}
                  </div>
                )}
              </div>

              <Link
                href="/tools"
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
              >
                <Home className="h-4 w-4" />
                {t("nav_all_tools")}
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* 主要内容区域 */}
      <main className="relative">
        {/* 背景装饰 */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-cyan-500/5 to-blue-500/5 blur-3xl" />
        </div>

        {/* 内容渲染 */}
        <div className="relative z-10">
          {appState === "start" && (
            <>
              <StartScreen onStart={handleStartTest} />
              <LearnMoreSection onStart={handleStartTest} />
              <SEOContent />
            </>
          )}

          {appState === "testing" && currentQuestion && (
            <div className="flex min-h-screen items-center justify-center p-4">
              <QuestionCard
                question={currentQuestion}
                currentIndex={testState.currentQuestionIndex}
                totalQuestions={stats.totalQuestions}
                onAnswer={answerQuestion}
                onPrevious={goToPreviousQuestion}
                onNext={() => {
                  // 手动跳转到下一题（如果有选择的话）
                  // 这里可以实现跳过当前题目的逻辑
                }}
                canGoBack={canGoBack()}
                canGoNext={false} // 暂时禁用，因为需要先选择答案
                isAnimating={testState.animationState.isTransitioning}
              />
            </div>
          )}

          {appState === "results" && testState.result && (
            <>
              <div className="flex min-h-screen items-center justify-center p-4 py-20">
                <ResultCard result={testState.result} onRetake={handleRetakeTest} />
              </div>

              {/* SEO Content Sections */}
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Features Section */}
                <div className="mb-16 text-center">
                  <h2 className="mb-4 text-3xl font-bold text-white">{t("page_features_title")}</h2>
                  <p className="mx-auto max-w-2xl text-xl text-slate-400">
                    {t("page_features_subtitle")}
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                  <div className="group text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                      <span className="text-4xl">🧠</span>
                    </div>
                    <h3 className="mb-6 text-xl font-semibold text-white">
                      {t("page_feature_1_title")}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-400">
                      {t.rich("page_feature_1_desc", {
                        strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                      })}
                    </p>
                  </div>

                  <div className="group text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                      <span className="text-4xl">📱</span>
                    </div>
                    <h3 className="mb-6 text-xl font-semibold text-white">
                      {t("page_feature_2_title")}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-400">
                      {t.rich("page_feature_2_desc", {
                        strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                      })}
                    </p>
                  </div>

                  <div className="group text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                      <span className="text-4xl">💡</span>
                    </div>
                    <h3 className="mb-6 text-xl font-semibold text-white">
                      {t("page_feature_3_title")}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-400">
                      {t.rich("page_feature_3_desc", {
                        strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                      })}
                    </p>
                  </div>
                </div>

                {/* How It Works Section */}
                <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
                  <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white">
                      {t("page_how_it_works_title")}
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-slate-400">
                      {t("page_how_it_works_subtitle")}
                    </p>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                        1
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">
                        {t("page_step_1_title")}
                      </h3>
                      <p className="text-slate-400">{t("page_step_1_desc")}</p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                        2
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">
                        {t("page_step_2_title")}
                      </h3>
                      <p className="text-slate-400">{t("page_step_2_desc")}</p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                        3
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">
                        {t("page_step_3_title")}
                      </h3>
                      <p className="text-slate-400">{t("page_step_3_desc")}</p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                        4
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">
                        {t("page_step_4_title")}
                      </h3>
                      <p className="text-slate-400">{t("page_step_4_desc")}</p>
                    </div>
                  </div>
                </div>

                {/* Educational Content Sections */}
                <div className="mt-20 space-y-16">
                  {/* What is Phone Addiction Section */}
                  <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                      {t("page_phone_addiction_title")}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-4 text-slate-200">
                          {t.rich("page_phone_addiction_text_1", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                        <p className="text-slate-200">
                          {t.rich("page_phone_addiction_text_2", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                      </div>
                      <div className="rounded-lg bg-blue-900/30 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-white">
                          {t("page_phone_addiction_signs_title")}
                        </h3>
                        <ul className="space-y-2 text-slate-200">
                          <li>• {t("page_phone_addiction_sign_1")}</li>
                          <li>• {t("page_phone_addiction_sign_2")}</li>
                          <li>• {t("page_phone_addiction_sign_3")}</li>
                          <li>• {t("page_phone_addiction_sign_4")}</li>
                          <li>• {t("page_phone_addiction_sign_5")}</li>
                          <li>• {t("page_phone_addiction_sign_6")}</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Inside Out 2 Emotions and Phone Habits */}
                  <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                      {t("page_emotions_title")}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg bg-purple-900/30 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-white">
                          {t("page_emotion_joy_title")}
                        </h3>
                        <div className="space-y-2 text-slate-200">
                          <p>
                            {t.rich("page_emotion_joy_text_1", {
                              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                            })}
                          </p>
                          <p>
                            {t.rich("page_emotion_joy_pattern", {
                              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-purple-900/30 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-white">
                          {t("page_emotion_anxiety_title")}
                        </h3>
                        <div className="space-y-2 text-slate-200">
                          <p>
                            {t.rich("page_emotion_anxiety_text_1", {
                              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                            })}
                          </p>
                          <p>
                            {t.rich("page_emotion_anxiety_pattern", {
                              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-purple-900/30 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-white">
                          {t("page_emotion_sadness_title")}
                        </h3>
                        <div className="space-y-2 text-slate-200">
                          <p>
                            {t.rich("page_emotion_sadness_text_1", {
                              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                            })}
                          </p>
                          <p>
                            {t.rich("page_emotion_sadness_pattern", {
                              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Phone Addiction vs Healthy Usage */}
                  <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                      {t("page_addiction_vs_healthy_title")}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-lg bg-green-900/30 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-white">
                          {t("page_addiction_signs_title")}
                        </h3>
                        <p className="mb-4 text-slate-200">
                          {t.rich("page_addiction_signs_text", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                        <ul className="space-y-2 text-slate-200">
                          <li>• {t("page_addiction_sign_1")}</li>
                          <li>• {t("page_addiction_sign_2")}</li>
                          <li>• {t("page_addiction_sign_3")}</li>
                          <li>• {t("page_addiction_sign_4")}</li>
                          <li>• {t("page_addiction_sign_5")}</li>
                        </ul>
                      </div>
                      <div className="rounded-lg bg-green-900/30 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-white">
                          {t("page_healthy_title")}
                        </h3>
                        <p className="mb-4 text-slate-200">
                          {t.rich("page_healthy_text", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                        <ul className="space-y-2 text-slate-200">
                          <li>• {t("page_healthy_habit_1")}</li>
                          <li>• {t("page_healthy_habit_2")}</li>
                          <li>• {t("page_healthy_habit_3")}</li>
                          <li>• {t("page_healthy_habit_4")}</li>
                          <li>• {t("page_healthy_habit_5")}</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* FAQ Section */}
                  <section className="rounded-xl bg-slate-800 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-white">{t("page_faq_title")}</h2>
                    <div className="space-y-6">
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          {t("page_faq_accuracy_question")}
                        </h3>
                        <p className="text-slate-400">
                          {t.rich("page_faq_accuracy_answer", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          {t("page_faq_meaning_question")}
                        </h3>
                        <p className="text-slate-400">
                          {t.rich("page_faq_meaning_answer", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          {t("page_faq_emotions_question")}
                        </h3>
                        <p className="text-slate-400">
                          {t.rich("page_faq_emotions_answer", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          {t("page_faq_help_question")}
                        </h3>
                        <p className="text-slate-400">
                          {t.rich("page_faq_help_answer", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          {t("page_faq_duration_question")}
                        </h3>
                        <p className="text-slate-400">
                          {t.rich("page_faq_duration_answer", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          {t("page_faq_free_question")}
                        </h3>
                        <p className="text-slate-400">
                          {t.rich("page_faq_free_answer", {
                            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                          })}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Results-specific content can be added here if needed */}
            </>
          )}
        </div>
      </main>

      {/* 页脚 */}
      {appState === "start" && (
        <footer className="border-t border-white/10 bg-slate-950/50 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm text-slate-400">{t("footer_inspired")}</p>
              <div className="mt-4 flex justify-center space-x-6">
                <Link
                  href="/tools/"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {t("footer_more_tools")}
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {t("footer_privacy")}
                </Link>
                <a
                  href="https://github.com/geekskai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default EmotionPhoneTest
