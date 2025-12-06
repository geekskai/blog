export interface TitleCardState {
  text: string
  smallSubtitle: string
  subtitle: string
  showCredits: boolean
  showWatermark: boolean
  color: string
  background: string
  backgroundImage: string | null // Data URL or null for uploaded image
  fontSize: number
  outline: number
  outlineColor: string
  subtitleOffset: number
  generating: boolean
  effects: string[] // Array of effect IDs (e.g., ["blood-splatter-1", "scratch-1"])
}

export interface CharacterPreset {
  name: string
  background: string
  color: string
  text: string
  description: string
}

export interface BackgroundPreset {
  name: string
  value: string
  type: "solid" | "gradient"
}

export interface TextColorPreset {
  name: string
  value: string
}

export interface EffectPreset {
  id: string
  name: string
  image: string // Path to effect image
  description: string
  category: "blood" | "scratch" | "mark" | "damage" | "other"
}

export type TabType = "presets" | "colors" | "text" | "effects"
