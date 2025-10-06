export interface TitleCardState {
  text: string
  smallSubtitle: string
  subtitle: string
  showCredits: boolean
  showWatermark: boolean
  color: string
  background: string
  fontSize: number
  outline: number
  outlineColor: string
  subtitleOffset: number
  generating: boolean
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

export type TabType = "presets" | "colors" | "text" | "effects"
