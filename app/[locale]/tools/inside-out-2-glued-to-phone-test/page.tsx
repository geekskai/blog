"use client"

import React, { useState, useEffect } from "react"
import { StartScreen } from "./components/StartScreen"
import { QuestionCard } from "./components/QuestionCard"
import { ResultCard } from "./components/ResultCard"
import { SEOContent } from "./components/SEOContent"
import { LearnMoreSection } from "./components/LearnMoreSection"
import { useEmotionTest } from "./hooks/useEmotionTest"
import { ChevronLeft, Home } from "lucide-react"
import { Link } from "@/app/i18n/navigation"

type AppState = "start" | "testing" | "results"

const EmotionPhoneTest: React.FC = () => {
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
  } = useEmotionTest()

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
                  {appState === "testing" && canGoBack() ? "Previous Question" : "Back"}
                </button>

                {appState === "testing" && (
                  <div className="text-sm text-slate-300">
                    Question {stats.currentQuestion} of {stats.totalQuestions}
                  </div>
                )}
              </div>

              <Link
                href="/tools"
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
              >
                <Home className="h-4 w-4" />
                All Tools
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
                <ResultCard
                  result={testState.result}
                  onShare={() => {
                    // 分享功能将在ResultCard内部处理
                  }}
                  onRetake={handleRetakeTest}
                />
              </div>

              {/* SEO Content Sections */}
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Features Section */}
                <div className="mb-16 text-center">
                  <h2 className="mb-4 text-3xl font-bold text-white">
                    Professional Inside Out 2 Phone Addiction Analysis
                  </h2>
                  <p className="mx-auto max-w-2xl text-xl text-slate-400">
                    Discover which Disney Pixar emotion controls your phone habits with our
                    comprehensive glued to phone test
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                  <div className="group text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                      <span className="text-4xl">🧠</span>
                    </div>
                    <h3 className="mb-6 text-xl font-semibold text-white">
                      9 Inside Out 2 Emotions
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-400">
                      Analyze your phone habits through Joy, Anxiety, Sadness, Anger, Fear, Disgust,
                      Embarrassment, Envy, and Ennui from Disney's Inside Out 2.
                    </p>
                  </div>

                  <div className="group text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                      <span className="text-4xl">📱</span>
                    </div>
                    <h3 className="mb-6 text-xl font-semibold text-white">
                      Phone Addiction Detection
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-400">
                      Comprehensive assessment to determine if you're truly glued to your phone and
                      identify your digital dependency patterns.
                    </p>
                  </div>

                  <div className="group text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
                      <span className="text-4xl">💡</span>
                    </div>
                    <h3 className="mb-6 text-xl font-semibold text-white">
                      Personalized Digital Wellness
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-400">
                      Get customized recommendations based on your dominant emotion to break free
                      from phone addiction and improve screen time habits.
                    </p>
                  </div>
                </div>

                {/* How It Works Section */}
                <div className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
                  <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white">
                      How the Inside Out 2 Glued to Phone Test Works
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-slate-400">
                      Our scientifically-designed assessment analyzes your phone habits through
                      Disney Pixar's emotional framework
                    </p>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                        1
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">Answer 15 Questions</h3>
                      <p className="text-slate-400">
                        Complete our comprehensive questionnaire about your phone usage patterns and
                        emotional triggers.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-2xl font-bold text-white">
                        2
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">Emotion Analysis</h3>
                      <p className="text-slate-400">
                        Our algorithm analyzes which Inside Out 2 emotion drives your phone
                        addiction and digital habits.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-2xl font-bold text-white">
                        3
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">
                        Addiction Assessment
                      </h3>
                      <p className="text-slate-400">
                        Receive your phone stickiness score and understand how glued to your phone
                        you really are.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                        4
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">Get Recommendations</h3>
                      <p className="text-slate-400">
                        Receive personalized digital wellness tips to improve your relationship with
                        technology.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Educational Content Sections */}
                <div className="mt-20 space-y-16">
                  {/* What is Phone Addiction Section */}
                  <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                      Understanding Phone Addiction: Are You Glued to Your Phone?
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-4 text-slate-200">
                          Being "glued to your phone" is more than just frequent usage - it's when
                          your device becomes an emotional crutch that controls your daily life. Our
                          Inside Out 2 test helps identify which specific emotions drive your phone
                          dependency, whether it's Joy seeking constant entertainment, Anxiety
                          needing validation, or Sadness using digital escape.
                        </p>
                        <p className="text-slate-200">
                          Phone addiction manifests differently for everyone. Some people are driven
                          by FOMO (Fear of Missing Out), others by social comparison (Envy), and
                          many by simple boredom (Ennui). Understanding your emotional triggers is
                          the first step to healthier digital habits.
                        </p>
                      </div>
                      <div className="rounded-lg bg-blue-900/30 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-white">
                          Signs You're Glued to Your Phone
                        </h3>
                        <ul className="space-y-2 text-slate-200">
                          <li>• Checking your phone first thing in the morning</li>
                          <li>• Feeling anxious when your phone isn't nearby</li>
                          <li>• Using your phone longer than intended</li>
                          <li>• Reaching for your phone during emotional moments</li>
                          <li>• Difficulty focusing without checking notifications</li>
                          <li>• Using your phone as an escape from boredom or stress</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Inside Out 2 Emotions and Phone Habits */}
                  <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                      How Inside Out 2 Emotions Control Your Phone Habits
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg bg-purple-900/30 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-white">
                          😊 Joy & Social Connection
                        </h3>
                        <div className="space-y-2 text-slate-200">
                          <p>
                            Joy drives phone usage for entertainment and social sharing. If Joy
                            controls your phone time, you likely use your device to spread happiness
                            and stay connected with loved ones.
                          </p>
                          <p>
                            <strong>Phone Pattern:</strong> Social media browsing, sharing content,
                            video calls with friends.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-purple-900/30 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-white">
                          😰 Anxiety & Compulsive Checking
                        </h3>
                        <div className="space-y-2 text-slate-200">
                          <p>
                            Anxiety makes you glued to your phone through constant notification
                            checking and FOMO. Your phone becomes a security blanket that actually
                            increases stress.
                          </p>
                          <p>
                            <strong>Phone Pattern:</strong> Frequent checking, multiple app
                            switching, news consumption.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-purple-900/30 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-white">
                          😢 Sadness & Digital Escape
                        </h3>
                        <div className="space-y-2 text-slate-200">
                          <p>
                            Sadness uses your phone as emotional escape and comfort. Long browsing
                            sessions help avoid dealing with difficult feelings and provide
                            temporary relief.
                          </p>
                          <p>
                            <strong>Phone Pattern:</strong> Extended browsing, passive consumption,
                            comfort-seeking content.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Phone Addiction vs Healthy Usage */}
                  <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                      Phone Addiction vs Healthy Digital Habits: Breaking Free from Being Glued
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-lg bg-green-900/30 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-white">
                          🚨 Signs of Phone Addiction (Glued to Phone)
                        </h3>
                        <p className="mb-4 text-slate-200">
                          When you're truly <strong>glued to your phone</strong>, your device
                          controls you rather than the other way around. Our Inside Out 2 test helps
                          identify these patterns through emotional analysis.
                        </p>
                        <ul className="space-y-2 text-slate-200">
                          <li>• Compulsive checking driven by Anxiety</li>
                          <li>• Emotional dependency on digital validation</li>
                          <li>• Using phone to escape negative emotions</li>
                          <li>• Losing track of time during phone sessions</li>
                          <li>• Withdrawal symptoms when phone is unavailable</li>
                        </ul>
                      </div>
                      <div className="rounded-lg bg-green-900/30 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-white">
                          ✅ Healthy Phone Habits
                        </h3>
                        <p className="mb-4 text-slate-200">
                          Healthy phone usage is intentional and emotion-aware. Our test provides
                          personalized recommendations based on your dominant Inside Out 2 emotion.
                        </p>
                        <ul className="space-y-2 text-slate-200">
                          <li>• Purposeful phone sessions with clear goals</li>
                          <li>• Emotional awareness before reaching for phone</li>
                          <li>• Balanced digital and offline activities</li>
                          <li>• Comfortable periods without phone access</li>
                          <li>• Using technology to enhance rather than escape life</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* FAQ Section */}
                  <section className="rounded-xl bg-slate-800 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                      Frequently Asked Questions About Inside Out 2 Phone Addiction Test
                    </h2>
                    <div className="space-y-6">
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          How accurate is the Inside Out 2 glued to phone test?
                        </h3>
                        <p className="text-slate-400">
                          Our test uses psychological research about emotional drivers and digital
                          behavior patterns. While entertaining and educational using Disney's
                          Inside Out 2 framework, it provides genuine insights into which emotions
                          control your phone habits and how glued to your phone you really are.
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          What does "glued to phone" mean in the Inside Out 2 context?
                        </h3>
                        <p className="text-slate-400">
                          Being "glued to your phone" means having an emotional dependency where
                          specific Inside Out 2 emotions drive compulsive phone usage. Our test
                          identifies whether Joy, Anxiety, Sadness, or other emotions create this
                          sticky relationship with your device.
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Which Inside Out 2 emotions make you most glued to your phone?
                        </h3>
                        <p className="text-slate-400">
                          Anxiety often creates the strongest phone addiction through compulsive
                          checking and FOMO. Sadness uses phones for emotional escape, while Ennui
                          leads to mindless scrolling. Joy can create positive but excessive usage
                          through social connection seeking.
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Can this test help me reduce my phone addiction?
                        </h3>
                        <p className="text-slate-400">
                          Yes! By identifying which Inside Out 2 emotion drives your phone habits,
                          you receive personalized recommendations for healthier digital wellness.
                          Understanding your emotional triggers is the first step to breaking free
                          from being glued to your phone.
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          How long does the Inside Out 2 phone addiction test take?
                        </h3>
                        <p className="text-slate-400">
                          The complete test takes 3-5 minutes with 15 carefully designed questions.
                          You'll get instant results showing which Inside Out 2 emotion controls
                          your phone time, your addiction level, and personalized digital wellness
                          recommendations.
                        </p>
                      </div>
                      <div className="border-b border-slate-700 pb-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Is the Inside Out 2 glued to phone test free?
                        </h3>
                        <p className="text-slate-400">
                          Yes! Our Inside Out 2 phone addiction test is completely free with no
                          registration required. Take the test unlimited times, share your results,
                          and access all features without any restrictions or hidden costs.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Can I share my Inside Out 2 phone addiction results?
                        </h3>
                        <p className="text-slate-400">
                          Absolutely! Share your results on social media to discover which Inside
                          Out 2 emotions control your friends' phone habits. Our shareable results
                          include your dominant emotion, addiction level, and a personalized quote
                          perfect for social sharing.
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
              <p className="text-sm text-slate-400">
                Inspired by Disney Pixar's Inside Out 2 • Created for educational and entertainment
                purposes
              </p>
              <div className="mt-4 flex justify-center space-x-6">
                <Link
                  href="/tools"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  More Tools
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Privacy Policy
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
