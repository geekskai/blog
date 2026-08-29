import type { AudioOutputFormat, WavBitDepth } from "@/lib/workspace/processor"

export interface AudioPreparationSettings {
  format: AudioOutputFormat
  loudnessTarget: number
  wavBitDepth: WavBitDepth
}

export interface WorkspacePreset extends AudioPreparationSettings {
  id: string
  name: string
}

export interface WorkspaceProject {
  id: string
  name: string
  settings: AudioPreparationSettings
  createdAt: string
}

export interface ActivityEntry {
  id: string
  label: string
  createdAt: string
}

export interface WorkspaceState {
  projects: WorkspaceProject[]
  presets: WorkspacePreset[]
  activity: ActivityEntry[]
}

export const DEFAULT_SETTINGS: AudioPreparationSettings = {
  format: "wav",
  loudnessTarget: -9,
  wavBitDepth: 24,
}

export const DEFAULT_PRESETS: WorkspacePreset[] = [
  { id: "club-wav", name: "Club / DJ", ...DEFAULT_SETTINGS },
  {
    id: "portable-mp3",
    name: "Streaming / portable",
    format: "mp3",
    loudnessTarget: -14,
    wavBitDepth: 24,
  },
]

export const EMPTY_WORKSPACE: WorkspaceState = {
  projects: [],
  presets: DEFAULT_PRESETS,
  activity: [],
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object"

const normalizeSettings = (
  value: unknown,
  fallback: AudioPreparationSettings = DEFAULT_SETTINGS
): AudioPreparationSettings => {
  if (!isRecord(value)) {
    return {
      format: fallback.format,
      loudnessTarget: fallback.loudnessTarget,
      wavBitDepth: fallback.wavBitDepth,
    }
  }
  const format = value.format === "mp3" || value.format === "wav" ? value.format : fallback.format
  const loudnessTarget =
    typeof value.loudnessTarget === "number" &&
    value.loudnessTarget >= -24 &&
    value.loudnessTarget <= -5
      ? value.loudnessTarget
      : fallback.loudnessTarget
  const wavBitDepth = value.wavBitDepth === 16 || value.wavBitDepth === 24 ? value.wavBitDepth : 24
  return { format, loudnessTarget, wavBitDepth }
}

export function normalizeWorkspaceState(value: unknown): WorkspaceState {
  if (!isRecord(value)) return EMPTY_WORKSPACE

  const savedPresets = Array.isArray(value.presets)
    ? value.presets.flatMap((item) => {
        if (!isRecord(item) || typeof item.id !== "string" || typeof item.name !== "string")
          return []
        return [{ id: item.id, name: item.name, ...normalizeSettings(item) }]
      })
    : []
  const presets = savedPresets.length ? savedPresets : DEFAULT_PRESETS

  const projects = Array.isArray(value.projects)
    ? value.projects.flatMap((item) => {
        if (
          !isRecord(item) ||
          typeof item.id !== "string" ||
          typeof item.name !== "string" ||
          typeof item.createdAt !== "string"
        ) {
          return []
        }
        const legacyPreset =
          typeof item.presetId === "string"
            ? presets.find((preset) => preset.id === item.presetId)
            : undefined
        return [
          {
            id: item.id,
            name: item.name,
            createdAt: item.createdAt,
            settings: normalizeSettings(item.settings, legacyPreset ?? DEFAULT_SETTINGS),
          },
        ]
      })
    : []

  const activity = Array.isArray(value.activity)
    ? value.activity.flatMap((item) =>
        isRecord(item) &&
        typeof item.id === "string" &&
        typeof item.label === "string" &&
        typeof item.createdAt === "string"
          ? [{ id: item.id, label: item.label, createdAt: item.createdAt }]
          : []
      )
    : []

  return { projects, presets, activity }
}
