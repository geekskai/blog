"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp, Play } from "lucide-react"

interface LearnMoreSectionProps {
  onStart: () => void
}

export const LearnMoreSection: React.FC<LearnMoreSectionProps> = ({ onStart }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const sections = [
    {
      id: "how-it-works",
      title: "How the Test Works",
      preview: "15 scientifically-designed questions analyze your emotional triggers...",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Our test uses 15 carefully crafted questions to analyze your phone usage patterns
            through the lens of Inside Out 2's emotional framework. Each question targets specific
            behavioral triggers and emotional responses.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-blue-500/10 p-4">
              <h4 className="mb-2 font-semibold text-blue-300">Emotion Analysis</h4>
              <p className="text-sm text-slate-400">
                Identifies which of the 9 Inside Out 2 emotions drives your phone habits
              </p>
            </div>
            <div className="rounded-lg bg-purple-500/10 p-4">
              <h4 className="mb-2 font-semibold text-purple-300">Addiction Assessment</h4>
              <p className="text-sm text-slate-400">
                Measures your phone dependency level and stickiness patterns
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "emotions",
      title: "Inside Out 2 Emotions",
      preview: "Joy, Anxiety, Sadness, and 6 more emotions each create unique phone patterns...",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Each Inside Out 2 emotion creates distinct phone usage patterns. Understanding your
            dominant emotion helps identify why you're glued to your phone.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { emoji: "😊", name: "Joy", pattern: "Social sharing & entertainment" },
              { emoji: "😰", name: "Anxiety", pattern: "Compulsive checking & FOMO" },
              { emoji: "😢", name: "Sadness", pattern: "Digital escape & comfort" },
              { emoji: "😡", name: "Anger", pattern: "Reactive posting & arguments" },
              { emoji: "😨", name: "Fear", pattern: "Information seeking & safety" },
              { emoji: "🤢", name: "Disgust", pattern: "Critical browsing & curation" },
            ].map((emotion) => (
              <div key={emotion.name} className="rounded-lg bg-slate-800/50 p-3 text-center">
                <div className="mb-1 text-2xl">{emotion.emoji}</div>
                <div className="mb-1 text-sm font-medium text-white">{emotion.name}</div>
                <div className="text-xs text-slate-400">{emotion.pattern}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "benefits",
      title: "What You'll Get",
      preview: "Personalized insights, digital wellness tips, and shareable results...",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Instant Results</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Your dominant emotion analysis</li>
                <li>• Phone addiction level assessment</li>
                <li>• Detailed emotional breakdown</li>
                <li>• Personalized character insights</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Actionable Guidance</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Custom digital wellness tips</li>
                <li>• Emotion-specific recommendations</li>
                <li>• Healthy habit suggestions</li>
                <li>• Shareable social media results</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className="border-t border-white/10 bg-slate-900/30 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Learn More About the Test</h2>
          <p className="text-lg text-slate-400">
            Get detailed information before you start, or jump right in
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200"
              >
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-white">{section.title}</h3>
                  <p className="text-sm text-slate-400">{section.preview}</p>
                </div>
                <div className="ml-4 flex-shrink-0 text-blue-400">
                  {expandedSection === section.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-white/10 px-6 pb-6">
                  <div className="pt-4">{section.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sticky CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
            <div className="text-left">
              <div className="font-semibold text-white">Ready to discover your emotion?</div>
              <div className="text-sm text-slate-400">Takes just 3 minutes • Completely free</div>
            </div>
            <button
              onClick={onStart}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Play className="h-4 w-4" />
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
