import { Question } from "../types"

// Inside Out 2 情绪手机依赖测试问题库
export const QUESTIONS: Question[] = [
  // 频率与时长类问题 (Frequency & Duration)
  {
    id: "morning_habit",
    text: "When you wake up in the morning, what's your first instinct?",
    category: "frequency",
    addictionWeight: 0.8,
    emotionWeights: {
      anxiety: 0.3,
      ennui: 0.2,
      joy: 0.15,
      sadness: 0.15,
      fear: 0.1,
      anger: 0.05,
      disgust: 0.03,
      embarrassment: 0.02,
      envy: 0.0,
    },
    options: [
      {
        id: "check_immediately",
        text: "Check messages and social media immediately",
        value: 4,
        emotionImpact: { anxiety: 3, ennui: 1, embarrassment: 1 },
      },
      {
        id: "plan_day",
        text: "Look at the time and plan my day",
        value: 1,
        emotionImpact: { joy: 2, fear: 1 },
      },
      {
        id: "scroll_bed",
        text: "Stay in bed scrolling for 'just 5 more minutes'",
        value: 3,
        emotionImpact: { sadness: 2, ennui: 3, embarrassment: 1 },
      },
      {
        id: "annoyed_notifications",
        text: "Feel annoyed by notifications",
        value: 2,
        emotionImpact: { anger: 3, disgust: 1 },
      },
    ],
  },

  {
    id: "daily_pickups",
    text: "How many times do you estimate you pick up your phone per day?",
    category: "frequency",
    addictionWeight: 1.0,
    emotionWeights: {
      anxiety: 0.25,
      ennui: 0.25,
      embarrassment: 0.2,
      joy: 0.1,
      sadness: 0.1,
      fear: 0.05,
      anger: 0.03,
      disgust: 0.02,
      envy: 0.0,
    },
    options: [
      {
        id: "under_30",
        text: "Less than 30 times",
        value: 1,
        emotionImpact: { joy: 1, disgust: 1 },
      },
      {
        id: "30_60",
        text: "30-60 times",
        value: 2,
        emotionImpact: { joy: 2, anxiety: 1 },
      },
      {
        id: "60_100",
        text: "60-100 times",
        value: 3,
        emotionImpact: { anxiety: 2, ennui: 2, embarrassment: 1 },
      },
      {
        id: "over_100",
        text: "Over 100 times (I've lost count)",
        value: 4,
        emotionImpact: { anxiety: 3, ennui: 3, embarrassment: 2 },
      },
    ],
  },

  // 情绪触发类问题 (Emotional Triggers)
  {
    id: "stress_response",
    text: "When you're feeling stressed or overwhelmed, you...",
    category: "emotional",
    addictionWeight: 0.9,
    emotionWeights: {
      sadness: 0.3,
      anxiety: 0.25,
      anger: 0.15,
      fear: 0.1,
      ennui: 0.1,
      joy: 0.05,
      embarrassment: 0.03,
      disgust: 0.02,
      envy: 0.0,
    },
    options: [
      {
        id: "scroll_distract",
        text: "Immediately reach for your phone to distract yourself",
        value: 4,
        emotionImpact: { sadness: 3, anxiety: 2, embarrassment: 1 },
      },
      {
        id: "seek_support",
        text: "Use your phone to call or text someone for support",
        value: 2,
        emotionImpact: { joy: 2, fear: 1, anxiety: 1 },
      },
      {
        id: "angry_scroll",
        text: "Aggressively scroll through content or pick fights online",
        value: 3,
        emotionImpact: { anger: 3, anxiety: 1, embarrassment: 1 },
      },
      {
        id: "avoid_phone",
        text: "Try to avoid your phone and deal with stress directly",
        value: 1,
        emotionImpact: { joy: 1, disgust: 1 },
      },
    ],
  },

  {
    id: "loneliness_response",
    text: "When you feel lonely or disconnected, your phone becomes...",
    category: "emotional",
    addictionWeight: 0.85,
    emotionWeights: {
      sadness: 0.35,
      anxiety: 0.2,
      envy: 0.15,
      joy: 0.1,
      fear: 0.1,
      ennui: 0.05,
      embarrassment: 0.03,
      anger: 0.02,
      disgust: 0.0,
    },
    options: [
      {
        id: "connection_tool",
        text: "A bridge to connect with friends and family",
        value: 2,
        emotionImpact: { joy: 3, anxiety: 1 },
      },
      {
        id: "escape_mechanism",
        text: "An escape from uncomfortable feelings",
        value: 4,
        emotionImpact: { sadness: 3, ennui: 2, embarrassment: 1 },
      },
      {
        id: "comparison_trap",
        text: "A window into others' seemingly perfect lives",
        value: 3,
        emotionImpact: { envy: 3, sadness: 2, anxiety: 1 },
      },
      {
        id: "security_blanket",
        text: "A security blanket that makes you feel less alone",
        value: 3,
        emotionImpact: { fear: 3, sadness: 1, anxiety: 1 },
      },
    ],
  },

  // 社交行为类问题 (Social Patterns)
  {
    id: "social_validation",
    text: "How do you feel when your post doesn't get many likes or comments?",
    category: "social",
    addictionWeight: 0.7,
    emotionWeights: {
      envy: 0.25,
      sadness: 0.25,
      embarrassment: 0.2,
      anxiety: 0.15,
      anger: 0.1,
      joy: 0.03,
      fear: 0.02,
      disgust: 0.0,
      ennui: 0.0,
    },
    options: [
      {
        id: "deeply_disappointed",
        text: "Disappointed and question the quality of my content",
        value: 3,
        emotionImpact: { sadness: 3, embarrassment: 2, anxiety: 1 },
      },
      {
        id: "analyze_optimize",
        text: "Analyze what went wrong and try to optimize next time",
        value: 3,
        emotionImpact: { anxiety: 3, envy: 2, embarrassment: 1 },
      },
      {
        id: "delete_pretend",
        text: "Delete it and pretend it never happened",
        value: 4,
        emotionImpact: { embarrassment: 3, fear: 1, sadness: 1 },
      },
      {
        id: "dont_care",
        text: "Don't really care, I post for myself",
        value: 1,
        emotionImpact: { joy: 2, disgust: 1 },
      },
    ],
  },

  {
    id: "fomo_level",
    text: "When you see friends posting about events you weren't invited to...",
    category: "social",
    addictionWeight: 0.6,
    emotionWeights: {
      envy: 0.4,
      sadness: 0.25,
      anxiety: 0.15,
      anger: 0.1,
      embarrassment: 0.05,
      fear: 0.03,
      joy: 0.02,
      disgust: 0.0,
      ennui: 0.0,
    },
    options: [
      {
        id: "deep_investigation",
        text: "Go down a rabbit hole investigating who was there",
        value: 4,
        emotionImpact: { envy: 3, anxiety: 2, embarrassment: 1 },
      },
      {
        id: "feel_excluded",
        text: "Feel genuinely hurt and excluded",
        value: 3,
        emotionImpact: { sadness: 3, envy: 2 },
      },
      {
        id: "angry_reaction",
        text: "Get angry and consider unfriending them",
        value: 3,
        emotionImpact: { anger: 3, envy: 1, embarrassment: 1 },
      },
      {
        id: "happy_for_them",
        text: "Feel happy they had a good time",
        value: 1,
        emotionImpact: { joy: 3 },
      },
    ],
  },

  // 控制能力类问题 (Self-Control)
  {
    id: "intended_vs_actual",
    text: "How often do you use your phone longer than you initially intended?",
    category: "control",
    addictionWeight: 1.0,
    emotionWeights: {
      ennui: 0.3,
      embarrassment: 0.25,
      anxiety: 0.2,
      sadness: 0.15,
      joy: 0.05,
      anger: 0.03,
      fear: 0.02,
      disgust: 0.0,
      envy: 0.0,
    },
    options: [
      {
        id: "rarely_happens",
        text: "Rarely - I'm pretty good at sticking to my intentions",
        value: 1,
        emotionImpact: { joy: 2, disgust: 1 },
      },
      {
        id: "sometimes",
        text: "Sometimes, especially when I'm bored or tired",
        value: 2,
        emotionImpact: { ennui: 2, anxiety: 1 },
      },
      {
        id: "often",
        text: "Often - I frequently lose track of time",
        value: 3,
        emotionImpact: { ennui: 3, embarrassment: 2, anxiety: 1 },
      },
      {
        id: "always",
        text: "Almost always - I have no control once I start",
        value: 4,
        emotionImpact: { ennui: 3, embarrassment: 3, anxiety: 2 },
      },
    ],
  },

  {
    id: "withdrawal_symptoms",
    text: "When you can't access your phone for an extended period, you feel...",
    category: "control",
    addictionWeight: 0.95,
    emotionWeights: {
      anxiety: 0.35,
      fear: 0.25,
      anger: 0.15,
      sadness: 0.1,
      embarrassment: 0.1,
      joy: 0.03,
      ennui: 0.02,
      disgust: 0.0,
      envy: 0.0,
    },
    options: [
      {
        id: "completely_fine",
        text: "Completely fine, maybe even relieved",
        value: 1,
        emotionImpact: { joy: 3, disgust: 1 },
      },
      {
        id: "slightly_anxious",
        text: "Slightly anxious but manageable",
        value: 2,
        emotionImpact: { anxiety: 2, fear: 1 },
      },
      {
        id: "very_uncomfortable",
        text: "Very uncomfortable and constantly thinking about it",
        value: 3,
        emotionImpact: { anxiety: 3, fear: 2, embarrassment: 1 },
      },
      {
        id: "panic_mode",
        text: "Panic-like symptoms and desperate to get it back",
        value: 4,
        emotionImpact: { anxiety: 3, fear: 3, anger: 1, embarrassment: 2 },
      },
    ],
  },

  // 功能性使用类问题 (Functional Usage)
  {
    id: "boredom_response",
    text: "When you're bored, your first instinct is to...",
    category: "functional",
    addictionWeight: 0.8,
    emotionWeights: {
      ennui: 0.4,
      joy: 0.2,
      anxiety: 0.15,
      sadness: 0.1,
      embarrassment: 0.1,
      envy: 0.03,
      anger: 0.02,
      fear: 0.0,
      disgust: 0.0,
    },
    options: [
      {
        id: "grab_phone",
        text: "Immediately grab your phone and start scrolling",
        value: 4,
        emotionImpact: { ennui: 3, embarrassment: 2 },
      },
      {
        id: "specific_app",
        text: "Open a specific app or game you enjoy",
        value: 2,
        emotionImpact: { joy: 3, ennui: 1 },
      },
      {
        id: "mindless_browse",
        text: "Mindlessly browse until something catches your attention",
        value: 3,
        emotionImpact: { ennui: 3, anxiety: 1 },
      },
      {
        id: "offline_activity",
        text: "Look for something to do that doesn't involve your phone",
        value: 1,
        emotionImpact: { joy: 2, disgust: 1 },
      },
    ],
  },

  {
    id: "multitasking_habits",
    text: "While using your phone, how often do you simultaneously do other activities?",
    category: "functional",
    addictionWeight: 0.7,
    emotionWeights: {
      anxiety: 0.3,
      ennui: 0.25,
      embarrassment: 0.2,
      joy: 0.1,
      sadness: 0.1,
      anger: 0.03,
      fear: 0.02,
      disgust: 0.0,
      envy: 0.0,
    },
    options: [
      {
        id: "full_attention",
        text: "I give my phone my full attention when using it",
        value: 2,
        emotionImpact: { joy: 2, anxiety: 1 },
      },
      {
        id: "background_tasks",
        text: "I often have it open while doing other simple tasks",
        value: 3,
        emotionImpact: { ennui: 2, anxiety: 2, embarrassment: 1 },
      },
      {
        id: "constant_switching",
        text: "I'm constantly switching between phone and other activities",
        value: 4,
        emotionImpact: { anxiety: 3, ennui: 2, embarrassment: 2 },
      },
      {
        id: "focused_sessions",
        text: "I prefer focused sessions for both phone and other activities",
        value: 1,
        emotionImpact: { joy: 2, disgust: 1 },
      },
    ],
  },

  // 额外的深度问题
  {
    id: "sleep_disruption",
    text: "How does your phone affect your sleep routine?",
    category: "control",
    addictionWeight: 0.85,
    emotionWeights: {
      anxiety: 0.25,
      ennui: 0.25,
      embarrassment: 0.2,
      sadness: 0.15,
      fear: 0.1,
      joy: 0.03,
      anger: 0.02,
      disgust: 0.0,
      envy: 0.0,
    },
    options: [
      {
        id: "no_impact",
        text: "No impact - I put it away well before bedtime",
        value: 1,
        emotionImpact: { joy: 2, disgust: 1 },
      },
      {
        id: "occasional_delay",
        text: "Sometimes delays my sleep by 15-30 minutes",
        value: 2,
        emotionImpact: { ennui: 2, anxiety: 1 },
      },
      {
        id: "significant_delay",
        text: "Regularly keeps me up 1+ hours past intended bedtime",
        value: 3,
        emotionImpact: { ennui: 3, anxiety: 2, embarrassment: 1 },
      },
      {
        id: "severe_disruption",
        text: "Severely disrupts sleep - I often scroll until very late",
        value: 4,
        emotionImpact: { ennui: 3, anxiety: 2, embarrassment: 3, sadness: 1 },
      },
    ],
  },

  {
    id: "notification_anxiety",
    text: "When you hear a notification sound, you...",
    category: "emotional",
    addictionWeight: 0.75,
    emotionWeights: {
      anxiety: 0.4,
      fear: 0.2,
      joy: 0.15,
      anger: 0.1,
      embarrassment: 0.1,
      ennui: 0.03,
      sadness: 0.02,
      disgust: 0.0,
      envy: 0.0,
    },
    options: [
      {
        id: "immediate_check",
        text: "Must check it immediately, no matter what you're doing",
        value: 4,
        emotionImpact: { anxiety: 3, fear: 2, embarrassment: 1 },
      },
      {
        id: "excited_check",
        text: "Feel excited and check it as soon as convenient",
        value: 2,
        emotionImpact: { joy: 3, anxiety: 1 },
      },
      {
        id: "annoyed_ignore",
        text: "Feel annoyed and try to ignore it",
        value: 2,
        emotionImpact: { anger: 3, disgust: 1 },
      },
      {
        id: "calm_response",
        text: "Calmly finish what you're doing first",
        value: 1,
        emotionImpact: { joy: 2, disgust: 1 },
      },
    ],
  },

  {
    id: "content_satisfaction",
    text: "After a long phone session, you typically feel...",
    category: "emotional",
    addictionWeight: 0.8,
    emotionWeights: {
      embarrassment: 0.25,
      sadness: 0.25,
      ennui: 0.2,
      disgust: 0.15,
      anxiety: 0.1,
      joy: 0.03,
      anger: 0.02,
      fear: 0.0,
      envy: 0.0,
    },
    options: [
      {
        id: "satisfied_informed",
        text: "Satisfied and well-informed",
        value: 1,
        emotionImpact: { joy: 3 },
      },
      {
        id: "entertained_happy",
        text: "Entertained and in a good mood",
        value: 2,
        emotionImpact: { joy: 3, ennui: 1 },
      },
      {
        id: "empty_regretful",
        text: "Empty and regretful about the time wasted",
        value: 4,
        emotionImpact: { embarrassment: 3, sadness: 2, ennui: 2 },
      },
      {
        id: "frustrated_unsatisfied",
        text: "Frustrated that nothing was truly satisfying",
        value: 3,
        emotionImpact: { disgust: 3, ennui: 2, anger: 1 },
      },
    ],
  },
]

// 问题分类权重
export const CATEGORY_WEIGHTS = {
  frequency: 0.25,
  emotional: 0.3,
  social: 0.2,
  control: 0.25,
  functional: 0.0, // 功能性问题不直接影响依赖分数，但影响情绪分析
}

// 获取特定分类的问题
export const getQuestionsByCategory = (category: string) => {
  return QUESTIONS.filter((q) => q.category === category)
}

// 获取随机问题子集
export const getRandomQuestions = (count: number = 15) => {
  const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, QUESTIONS.length))
}

// 验证问题完整性
export const validateQuestions = () => {
  const categories = ["frequency", "emotional", "social", "control", "functional"]
  const categoryCounts = categories.map((cat) => QUESTIONS.filter((q) => q.category === cat).length)

  return {
    totalQuestions: QUESTIONS.length,
    categoryCounts: Object.fromEntries(categories.map((cat, i) => [cat, categoryCounts[i]])),
    isBalanced: Math.max(...categoryCounts) - Math.min(...categoryCounts) <= 2,
  }
}
