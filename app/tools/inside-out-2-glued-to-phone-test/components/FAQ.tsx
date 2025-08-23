"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What does 'glued to phone' mean in the Inside Out 2 context?",
    answer:
      "Being 'glued to your phone' refers to excessive phone dependency where emotions like Anxiety or Joy drive compulsive phone checking. Our Inside Out 2 test analyzes which specific emotion controls your phone habits and creates this 'sticky' relationship with your device.",
  },
  {
    question: "How does the Inside Out 2 emotion phone addiction test work?",
    answer:
      "Our test uses 15 scientifically-designed questions to analyze your phone usage patterns through the lens of 9 Inside Out 2 emotions (Joy, Anxiety, Sadness, Anger, Fear, Disgust, Embarrassment, Envy, and Ennui). Each emotion has unique phone usage characteristics that help determine your digital dependency level.",
  },
  {
    question: "Which Inside Out 2 emotions are most likely to make you glued to your phone?",
    answer:
      "Anxiety often drives compulsive phone checking for validation and updates. Joy seeks constant entertainment and social connection. Sadness may use phones for comfort and escape. Each emotion creates different patterns of phone attachment and dependency.",
  },
  {
    question: "Can this test help me reduce my phone addiction?",
    answer:
      "Yes! By identifying which Inside Out 2 emotion drives your phone habits, you receive personalized recommendations for healthier digital wellness. Understanding your emotional triggers is the first step to breaking free from being glued to your phone.",
  },
  {
    question: "Is the Inside Out 2 phone addiction test accurate?",
    answer:
      "Our test is based on psychological research about emotional drivers and digital behavior patterns. While entertaining and educational, it's designed to provide insights into your phone habits rather than clinical diagnosis. The Inside Out 2 framework makes complex psychology accessible and engaging.",
  },
  {
    question: "How long does the Inside Out 2 glued to phone test take?",
    answer:
      "The complete test takes approximately 3-5 minutes. You'll answer 15 questions about your phone habits, emotional responses, and digital behaviors. The results provide instant analysis of which Inside Out 2 emotion controls your phone time.",
  },
]

export const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-8 backdrop-blur-xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-slate-300">
          Learn more about the Inside Out 2 phone addiction test
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            <button
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200"
            >
              <h3 className="pr-4 text-lg font-semibold text-white">{item.question}</h3>
              <div className="flex-shrink-0 text-blue-400">
                {openItems.has(index) ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </button>

            {openItems.has(index) && (
              <div className="border-t border-white/10 px-6 pb-6">
                <p className="pt-4 leading-relaxed text-slate-300">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
