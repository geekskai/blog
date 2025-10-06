import { EmotionCharacter } from "../types"

// Inside Out 2 情绪角色定义
export const EMOTIONS: Record<string, EmotionCharacter> = {
  joy: {
    id: "joy",
    name: "Joy",
    displayName: "Joy",
    description:
      "You use your phone to spread happiness and stay connected with loved ones. Your digital life is generally positive, but Joy's enthusiasm might lead to longer sessions than planned.",
    traits: [
      "Social butterfly who loves sharing moments",
      "Uses phone for entertainment and connection",
      "Generally optimistic about technology",
      "Enjoys discovering new content and apps",
    ],
    phoneUsagePattern: "Social sharing, entertainment consumption, positive content creation",
    color: "#FFD700",
    gradientFrom: "#FFD700",
    gradientTo: "#FFA500",
    avatar: "🌟",
    emoji: "😊",
  },

  anxiety: {
    id: "anxiety",
    name: "Anxiety",
    displayName: "Anxiety",
    description:
      "Your phone has become a security blanket. Anxiety makes you check notifications constantly, fearing you'll miss something important.",
    traits: [
      "Compulsive notification checker",
      "Fear of missing out (FOMO)",
      "Stuck in checking loops",
      "Phone increases rather than reduces stress",
    ],
    phoneUsagePattern: "Frequent checking, multiple app switching, news consumption",
    color: "#FF6B35",
    gradientFrom: "#FF6B35",
    gradientTo: "#FF8E53",
    avatar: "😰",
    emoji: "😟",
  },

  sadness: {
    id: "sadness",
    name: "Sadness",
    displayName: "Sadness",
    description:
      "You use your phone to escape negative emotions and seek comfort. Long browsing sessions help you avoid dealing with difficult feelings.",
    traits: [
      "Uses phone for emotional escape",
      "Long passive consumption sessions",
      "Seeks comfort through digital content",
      "Difficulty with emotional regulation",
    ],
    phoneUsagePattern: "Extended browsing, passive consumption, comfort-seeking content",
    color: "#4A90E2",
    gradientFrom: "#4A90E2",
    gradientTo: "#7BB3F0",
    avatar: "😢",
    emoji: "😔",
  },

  anger: {
    id: "anger",
    name: "Anger",
    displayName: "Anger",
    description:
      "Your phone becomes an outlet for frustration. You engage in arguments, vent feelings, and sometimes regret your digital interactions.",
    traits: [
      "Emotionally reactive online behavior",
      "Engages in digital arguments",
      "Uses phone to vent frustrations",
      "Impulsive posting and commenting",
    ],
    phoneUsagePattern: "Reactive posting, argument engagement, news/politics consumption",
    color: "#E74C3C",
    gradientFrom: "#E74C3C",
    gradientTo: "#C0392B",
    avatar: "😡",
    emoji: "😠",
  },

  fear: {
    id: "fear",
    name: "Fear",
    displayName: "Fear",
    description:
      "Your phone provides a sense of security and connection to the world. You need it nearby to feel safe and informed.",
    traits: [
      "Phone provides security and safety",
      "Constant need for information updates",
      "Anxiety when phone is not accessible",
      "Uses phone to verify and fact-check",
    ],
    phoneUsagePattern: "Safety checking, information verification, emergency preparedness",
    color: "#9B59B6",
    gradientFrom: "#9B59B6",
    gradientTo: "#8E44AD",
    avatar: "😨",
    emoji: "😰",
  },

  disgust: {
    id: "disgust",
    name: "Disgust",
    displayName: "Disgust",
    description:
      "You're critical of most digital content but still find yourself scrolling. You have high standards but struggle to find truly satisfying content.",
    traits: [
      "Critical of digital content quality",
      "High standards for apps and content",
      "Frustrated with algorithm recommendations",
      "Selective but persistent usage",
    ],
    phoneUsagePattern: "Critical browsing, content curation, platform switching",
    color: "#27AE60",
    gradientFrom: "#27AE60",
    gradientTo: "#2ECC71",
    avatar: "🤢",
    emoji: "😤",
  },

  embarrassment: {
    id: "embarrassment",
    name: "Embarrassment",
    displayName: "Embarrassment",
    description:
      "You're aware of your phone habits but feel ashamed about them. You try to hide your usage and often feel guilty about screen time.",
    traits: [
      "Secretive about phone usage",
      "Guilt about screen time",
      "Deletes browsing history",
      "Aware but struggling to change",
    ],
    phoneUsagePattern: "Hidden usage, private browsing, guilt-driven behavior",
    color: "#E91E63",
    gradientFrom: "#E91E63",
    gradientTo: "#AD1457",
    avatar: "😳",
    emoji: "😅",
  },

  envy: {
    id: "envy",
    name: "Envy",
    displayName: "Envy",
    description:
      "Your phone usage is driven by comparison with others. Social media becomes a source of jealousy and competitive feelings.",
    traits: [
      "Compares lifestyle with others online",
      "Social media triggers jealousy",
      "Competitive digital behavior",
      "Status-conscious posting",
    ],
    phoneUsagePattern: "Social comparison, status checking, competitive browsing",
    color: "#F39C12",
    gradientFrom: "#F39C12",
    gradientTo: "#E67E22",
    avatar: "😒",
    emoji: "🙄",
  },

  ennui: {
    id: "ennui",
    name: "Ennui",
    displayName: "Ennui",
    description:
      "Your phone has become your default boredom killer. You scroll mindlessly to fill empty time, often without any specific purpose.",
    traits: [
      "Mindless scrolling to fill time",
      "No specific purpose or goal",
      "Habitual usage patterns",
      "Difficulty with boredom tolerance",
    ],
    phoneUsagePattern: "Aimless browsing, time-killing, habitual checking",
    color: "#95A5A6",
    gradientFrom: "#95A5A6",
    gradientTo: "#7F8C8D",
    avatar: "😑",
    emoji: "😐",
  },
}

// 情绪权重配置
export const EMOTION_WEIGHTS = {
  frequency: 0.25, // 使用频率权重
  emotional: 0.3, // 情绪触发权重
  social: 0.2, // 社交行为权重
  control: 0.25, // 控制能力权重
}

// 依赖程度阈值
export const ADDICTION_THRESHOLDS = {
  low: { min: 0, max: 25, color: "#27AE60" },
  moderate: { min: 25, max: 50, color: "#F39C12" },
  high: { min: 50, max: 75, color: "#E67E22" },
  severe: { min: 75, max: 100, color: "#E74C3C" },
}

// 情绪角色数组（用于遍历）
export const EMOTION_LIST = Object.values(EMOTIONS)

// 获取情绪角色
export const getEmotion = (id: string): EmotionCharacter => {
  return EMOTIONS[id] || EMOTIONS.joy
}

// 获取随机情绪（用于动画效果）
export const getRandomEmotion = (): EmotionCharacter => {
  const emotions = Object.values(EMOTIONS)
  return emotions[Math.floor(Math.random() * emotions.length)]
}
