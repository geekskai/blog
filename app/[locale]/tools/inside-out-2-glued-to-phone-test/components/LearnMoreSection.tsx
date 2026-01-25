"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp, Play } from "lucide-react"
import { useTranslations } from "next-intl"

interface LearnMoreSectionProps {
  onStart: () => void
}

export const LearnMoreSection: React.FC<LearnMoreSectionProps> = ({ onStart }) => {
  const t = useTranslations("InsideOut2GluedToPhoneTest")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const sections = [
    {
      id: "how-it-works",
      title: t("learn_more_section_1_title"),
      preview: t("learn_more_section_1_preview"),
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">{t("learn_more_section_1_text")}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-blue-500/10 p-4">
              <h4 className="mb-2 font-semibold text-blue-300">
                {t("learn_more_section_1_feature_1_title")}
              </h4>
              <p className="text-sm text-slate-400">
                {t("learn_more_section_1_feature_1_desc")}
              </p>
            </div>
            <div className="rounded-lg bg-purple-500/10 p-4">
              <h4 className="mb-2 font-semibold text-purple-300">
                {t("learn_more_section_1_feature_2_title")}
              </h4>
              <p className="text-sm text-slate-400">
                {t("learn_more_section_1_feature_2_desc")}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "emotions",
      title: t("learn_more_section_2_title"),
      preview: t("learn_more_section_2_preview"),
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">{t("learn_more_section_2_text")}</p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                emoji: "😊",
                name: t("learn_more_emotion_joy"),
                pattern: t("learn_more_emotion_joy_pattern"),
              },
              {
                emoji: "😰",
                name: t("learn_more_emotion_anxiety"),
                pattern: t("learn_more_emotion_anxiety_pattern"),
              },
              {
                emoji: "😢",
                name: t("learn_more_emotion_sadness"),
                pattern: t("learn_more_emotion_sadness_pattern"),
              },
              {
                emoji: "😡",
                name: t("learn_more_emotion_anger"),
                pattern: t("learn_more_emotion_anger_pattern"),
              },
              {
                emoji: "😨",
                name: t("learn_more_emotion_fear"),
                pattern: t("learn_more_emotion_fear_pattern"),
              },
              {
                emoji: "🤢",
                name: t("learn_more_emotion_disgust"),
                pattern: t("learn_more_emotion_disgust_pattern"),
              },
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
      title: t("learn_more_section_3_title"),
      preview: t("learn_more_section_3_preview"),
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">
                {t("learn_more_section_3_instant_title")}
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• {t("learn_more_section_3_instant_1")}</li>
                <li>• {t("learn_more_section_3_instant_2")}</li>
                <li>• {t("learn_more_section_3_instant_3")}</li>
                <li>• {t("learn_more_section_3_instant_4")}</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-white">
                {t("learn_more_section_3_action_title")}
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• {t("learn_more_section_3_action_1")}</li>
                <li>• {t("learn_more_section_3_action_2")}</li>
                <li>• {t("learn_more_section_3_action_3")}</li>
                <li>• {t("learn_more_section_3_action_4")}</li>
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
          <h2 className="mb-4 text-3xl font-bold text-white">{t("learn_more_title")}</h2>
          <p className="text-lg text-slate-400">{t("learn_more_subtitle")}</p>
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
              <div className="font-semibold text-white">{t("learn_more_cta_ready")}</div>
              <div className="text-sm text-slate-400">{t("learn_more_cta_time")}</div>
            </div>
            <button
              onClick={onStart}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Play className="h-4 w-4" />
              {t("learn_more_cta_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
