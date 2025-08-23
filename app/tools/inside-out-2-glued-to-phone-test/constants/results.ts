import { Recommendation } from "../types"

// 个性化洞察模板
export const INSIGHTS_TEMPLATES = {
  joy: [
    "Your phone brings genuine happiness and connection to your life",
    "You use technology to share positive moments with others",
    "Social media serves as a platform for spreading joy and creativity",
    "Your digital habits reflect an optimistic and social personality",
  ],

  anxiety: [
    "Your phone has become a source of stress rather than relief",
    "Constant connectivity is feeding your anxious thoughts",
    "FOMO (Fear of Missing Out) drives much of your phone usage",
    "You check your phone compulsively to manage uncertainty",
  ],

  sadness: [
    "You turn to your phone when feeling down or lonely",
    "Digital content serves as emotional comfort and escape",
    "Long browsing sessions help you avoid difficult feelings",
    "Your phone usage increases during emotionally challenging times",
  ],

  anger: [
    "Your phone becomes an outlet for frustration and anger",
    "You engage in arguments and conflicts through digital platforms",
    "Negative news and content trigger strong emotional reactions",
    "Impulsive posting and commenting reflect your emotional state",
  ],

  fear: [
    "Your phone provides a sense of security and connection to the world",
    "You need constant access to information to feel safe",
    "Being without your phone triggers anxiety and worry",
    "You use your device to verify information and seek reassurance",
  ],

  disgust: [
    "You're critical of most digital content but still consume it",
    "High standards make it hard to find satisfying online experiences",
    "You feel frustrated with algorithm-driven recommendations",
    "Despite criticism, you continue scrolling in search of quality content",
  ],

  embarrassment: [
    "You're aware of problematic phone habits but struggle to change them",
    "Guilt and shame surround your screen time usage",
    "You try to hide or minimize your actual phone usage from others",
    "Self-awareness about digital habits creates internal conflict",
  ],

  envy: [
    "Social comparison drives much of your phone usage",
    "Others' posts trigger feelings of jealousy and inadequacy",
    "You use your phone to monitor and compare your life to others",
    "Status and social positioning influence your digital behavior",
  ],

  ennui: [
    "Your phone has become your default boredom solution",
    "Mindless scrolling fills empty time without purpose",
    "You lack intentional goals when using your device",
    "Habitual usage patterns have replaced conscious choice",
  ],
}

// 分享引用模板
export const SHAREABLE_QUOTES = {
  joy: [
    "Joy is spreading happiness through my screen! 🌟 My phone brings connection and positivity to my daily life.",
    "Turns out Joy controls my phone time! 😊 I use technology to share smiles and stay connected with loved ones.",
    "Joy's in charge of my digital life! ✨ My phone habits reflect my optimistic and social nature.",
  ],

  anxiety: [
    "Anxiety has taken control of my phone! 😰 Those constant notification checks are real...",
    "My phone anxiety is showing! 📱 Time to set some boundaries and find digital peace.",
    "Anxiety's driving my screen time! 😟 Maybe it's time for some mindful phone habits.",
  ],

  sadness: [
    "Sadness is guiding my phone habits 😢 Using my device for comfort and emotional escape.",
    "My phone has become my emotional support system 💙 Sadness knows where to find digital comfort.",
    "Sadness controls my scrolling sessions 😔 Time to find healthier ways to process emotions.",
  ],

  anger: [
    "Anger's in control of my phone time! 😡 Those heated online discussions make sense now...",
    "My phone becomes my outlet when Anger takes over 🔥 Maybe time for some digital detox.",
    "Anger drives my digital reactions! 😠 Learning to pause before posting might help.",
  ],

  fear: [
    "Fear needs my phone for security! 😨 Constant connectivity helps me feel safe and informed.",
    "My phone is Fear's security blanket 📱 Always need to stay connected and updated.",
    "Fear controls my phone habits! 😰 Information and connection provide comfort and safety.",
  ],

  disgust: [
    "Disgust is judging my phone content! 🤢 High standards but still scrolling...",
    "My phone usage frustrates Disgust! 😤 Seeking quality content in a sea of mediocrity.",
    "Disgust controls my digital standards! 🙄 Critical of content but still consuming it.",
  ],

  embarrassment: [
    "Embarrassment knows my phone secrets! 😳 Aware of my habits but struggling to change them.",
    "My phone usage makes Embarrassment blush! 😅 Time to be more intentional with screen time.",
    "Embarrassment's watching my screen time! 🫣 Self-awareness is the first step to change.",
  ],

  envy: [
    "Envy drives my social media scrolling! 😒 Those comparison traps are real...",
    "My phone feeds Envy's need to compare! 🙄 Time to focus on my own journey instead.",
    "Envy controls my digital behavior! 😤 Social comparison is exhausting - need healthier habits.",
  ],

  ennui: [
    "Ennui has made my phone the ultimate boredom killer! 😑 Mindless scrolling fills the void.",
    "My phone is Ennui's favorite time-waster! 😐 Maybe time to find more purposeful activities.",
    "Ennui controls my aimless browsing! 🫤 Habitual usage without intention or goal.",
  ],
}

// 改善建议模板
export const RECOMMENDATIONS_TEMPLATES: Record<string, Recommendation[]> = {
  joy: [
    {
      category: "immediate",
      title: "Set Joyful Boundaries",
      description:
        "Use screen time limits during family time to ensure Joy doesn't overwhelm real-world connections",
      icon: "⏰",
      difficulty: "easy",
    },
    {
      category: "daily",
      title: "Create Phone-Free Joy Moments",
      description: "Dedicate 30 minutes daily to offline activities that bring you happiness",
      icon: "🌈",
      difficulty: "medium",
    },
    {
      category: "weekly",
      title: "Digital Gratitude Practice",
      description: "Weekly review of positive digital interactions and their impact on your mood",
      icon: "📝",
      difficulty: "easy",
    },
    {
      category: "longterm",
      title: "Balanced Digital Lifestyle",
      description:
        "Develop a sustainable approach that maintains Joy while preventing digital overwhelm",
      icon: "⚖️",
      difficulty: "medium",
    },
  ],

  anxiety: [
    {
      category: "immediate",
      title: "Turn Off Non-Essential Notifications",
      description:
        "Disable notifications for apps that aren't truly urgent to reduce anxiety triggers",
      icon: "🔕",
      difficulty: "easy",
    },
    {
      category: "daily",
      title: "Scheduled Phone Checking",
      description: "Set specific times for checking messages instead of constant monitoring",
      icon: "📅",
      difficulty: "medium",
    },
    {
      category: "weekly",
      title: "Digital Anxiety Assessment",
      description: "Weekly check-in on how phone usage affects your stress levels",
      icon: "📊",
      difficulty: "medium",
    },
    {
      category: "longterm",
      title: "Mindfulness-Based Phone Use",
      description: "Develop mindful phone habits that reduce rather than increase anxiety",
      icon: "🧘",
      difficulty: "hard",
    },
  ],

  sadness: [
    {
      category: "immediate",
      title: "Identify Emotional Triggers",
      description: "Notice when you reach for your phone to escape difficult emotions",
      icon: "🎯",
      difficulty: "medium",
    },
    {
      category: "daily",
      title: "Emotional Check-ins",
      description: "Before phone use, ask yourself: 'How am I feeling and what do I really need?'",
      icon: "💭",
      difficulty: "medium",
    },
    {
      category: "weekly",
      title: "Alternative Comfort Activities",
      description: "Develop a list of offline activities that provide emotional comfort",
      icon: "🎨",
      difficulty: "medium",
    },
    {
      category: "longterm",
      title: "Emotional Regulation Skills",
      description: "Learn healthy coping strategies that don't rely on digital distraction",
      icon: "💪",
      difficulty: "hard",
    },
  ],

  anger: [
    {
      category: "immediate",
      title: "Pause Before Posting",
      description: "Wait 10 minutes before posting or commenting when feeling angry",
      icon: "⏸️",
      difficulty: "medium",
    },
    {
      category: "daily",
      title: "Limit Triggering Content",
      description: "Reduce exposure to news and content that consistently triggers anger",
      icon: "🚫",
      difficulty: "easy",
    },
    {
      category: "weekly",
      title: "Digital Detox Sessions",
      description: "Regular breaks from social media and news to reset emotional state",
      icon: "🌿",
      difficulty: "medium",
    },
    {
      category: "longterm",
      title: "Anger Management Strategies",
      description: "Develop healthy outlets for anger that don't involve digital platforms",
      icon: "🎯",
      difficulty: "hard",
    },
  ],

  fear: [
    {
      category: "immediate",
      title: "Gradual Phone Separation",
      description: "Start with short periods away from your phone in safe environments",
      icon: "👶",
      difficulty: "medium",
    },
    {
      category: "daily",
      title: "Information Diet",
      description: "Limit news consumption to specific times to reduce fear-based checking",
      icon: "📰",
      difficulty: "medium",
    },
    {
      category: "weekly",
      title: "Safety Planning",
      description: "Create non-digital safety plans to reduce phone dependency for security",
      icon: "🛡️",
      difficulty: "medium",
    },
    {
      category: "longterm",
      title: "Build Real-World Security",
      description: "Develop confidence and security that doesn't depend on constant connectivity",
      icon: "🏠",
      difficulty: "hard",
    },
  ],

  disgust: [
    {
      category: "immediate",
      title: "Curate Quality Content",
      description: "Unfollow accounts and sources that consistently disappoint you",
      icon: "✂️",
      difficulty: "easy",
    },
    {
      category: "daily",
      title: "Intentional Consumption",
      description: "Set specific goals for what you want to achieve with each phone session",
      icon: "🎯",
      difficulty: "medium",
    },
    {
      category: "weekly",
      title: "Content Quality Review",
      description: "Weekly assessment of whether your digital consumption meets your standards",
      icon: "⭐",
      difficulty: "easy",
    },
    {
      category: "longterm",
      title: "Alternative Information Sources",
      description: "Find high-quality, satisfying alternatives to current digital habits",
      icon: "📚",
      difficulty: "medium",
    },
  ],

  embarrassment: [
    {
      category: "immediate",
      title: "Honest Screen Time Review",
      description: "Look at your actual screen time data without judgment, just awareness",
      icon: "📊",
      difficulty: "medium",
    },
    {
      category: "daily",
      title: "Self-Compassion Practice",
      description: "Replace self-criticism with understanding and gentle motivation for change",
      icon: "💝",
      difficulty: "medium",
    },
    {
      category: "weekly",
      title: "Progress Celebration",
      description: "Acknowledge small improvements in phone habits without perfectionism",
      icon: "🎉",
      difficulty: "easy",
    },
    {
      category: "longterm",
      title: "Sustainable Habit Change",
      description: "Focus on gradual, sustainable changes rather than dramatic restrictions",
      icon: "🌱",
      difficulty: "hard",
    },
  ],

  envy: [
    {
      category: "immediate",
      title: "Unfollow Comparison Triggers",
      description: "Remove accounts that consistently trigger feelings of inadequacy",
      icon: "👋",
      difficulty: "easy",
    },
    {
      category: "daily",
      title: "Gratitude Practice",
      description: "Daily focus on your own achievements and positive aspects of your life",
      icon: "🙏",
      difficulty: "medium",
    },
    {
      category: "weekly",
      title: "Personal Goal Setting",
      description: "Set and work toward your own goals instead of comparing with others",
      icon: "🎯",
      difficulty: "medium",
    },
    {
      category: "longterm",
      title: "Self-Worth Independence",
      description: "Build self-esteem that doesn't depend on social comparison",
      icon: "👑",
      difficulty: "hard",
    },
  ],

  ennui: [
    {
      category: "immediate",
      title: "Boredom Tolerance Practice",
      description: "Sit with boredom for 5 minutes before reaching for your phone",
      icon: "⏱️",
      difficulty: "medium",
    },
    {
      category: "daily",
      title: "Purposeful Phone Sessions",
      description: "Set a specific goal before picking up your phone",
      icon: "🎯",
      difficulty: "medium",
    },
    {
      category: "weekly",
      title: "Offline Activity Planning",
      description: "Schedule engaging offline activities to reduce default phone usage",
      icon: "📅",
      difficulty: "easy",
    },
    {
      category: "longterm",
      title: "Meaningful Engagement",
      description: "Develop hobbies and interests that provide genuine fulfillment",
      icon: "🎨",
      difficulty: "hard",
    },
  ],
}

// 依赖程度描述
export const ADDICTION_DESCRIPTIONS = {
  low: {
    title: "Healthy Digital Relationship",
    description:
      "You maintain a balanced and intentional relationship with your phone. Your usage is generally purposeful and doesn't significantly interfere with your daily life.",
    color: "#27AE60",
  },
  moderate: {
    title: "Some Dependency Patterns",
    description:
      "You show some signs of phone dependency, but it's manageable. Being more mindful of your usage patterns could help improve your digital wellness.",
    color: "#F39C12",
  },
  high: {
    title: "Significant Phone Dependency",
    description:
      "Your phone usage shows clear signs of dependency that may be impacting your daily life, relationships, or well-being. Consider implementing structured changes.",
    color: "#E67E22",
  },
  severe: {
    title: "Severe Phone Addiction Patterns",
    description:
      "Your relationship with your phone shows concerning patterns that likely significantly impact your life. Professional support or structured intervention may be helpful.",
    color: "#E74C3C",
  },
}

// 获取随机洞察
export const getRandomInsights = (emotion: string, count: number = 3) => {
  const insights = INSIGHTS_TEMPLATES[emotion] || INSIGHTS_TEMPLATES.joy
  return insights.slice(0, count)
}

// 获取随机分享引用
export const getRandomQuote = (emotion: string) => {
  const quotes = SHAREABLE_QUOTES[emotion] || SHAREABLE_QUOTES.joy
  return quotes[Math.floor(Math.random() * quotes.length)]
}

// 获取推荐建议
export const getRecommendations = (emotion: string, addictionLevel: string) => {
  const emotionRecs = RECOMMENDATIONS_TEMPLATES[emotion] || RECOMMENDATIONS_TEMPLATES.joy

  // 根据依赖程度调整建议数量和难度
  if (addictionLevel === "low") {
    return emotionRecs.filter((rec) => rec.difficulty === "easy").slice(0, 2)
  } else if (addictionLevel === "moderate") {
    return emotionRecs.filter((rec) => rec.difficulty !== "hard").slice(0, 3)
  } else {
    return emotionRecs.slice(0, 4) // 包含所有难度级别
  }
}
