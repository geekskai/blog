import { describe, expect, it } from "vitest"
import { DEFAULT_SETTINGS, normalizeWorkspaceState } from "./state"

describe("normalizeWorkspaceState", () => {
  it("migrates legacy projects from their referenced preset", () => {
    const workspace = normalizeWorkspaceState({
      presets: [{ id: "portable", name: "Portable", format: "mp3", loudnessTarget: -14 }],
      projects: [
        { id: "project-1", name: "Friday set", presetId: "portable", createdAt: "2026-08-29" },
      ],
      activity: [],
    })

    expect(workspace.projects[0].settings).toEqual({
      format: "mp3",
      loudnessTarget: -14,
      wavBitDepth: 24,
    })
  })

  it("preserves a project settings snapshot", () => {
    const workspace = normalizeWorkspaceState({
      presets: [],
      projects: [
        {
          id: "project-1",
          name: "Archive master",
          createdAt: "2026-08-29",
          settings: { format: "wav", loudnessTarget: -12, wavBitDepth: 16 },
        },
      ],
      activity: [],
    })

    expect(workspace.projects[0].settings).toEqual({
      format: "wav",
      loudnessTarget: -12,
      wavBitDepth: 16,
    })
  })

  it("falls back safely for invalid local data", () => {
    const workspace = normalizeWorkspaceState({ projects: "broken", presets: "broken" })

    expect(workspace.projects).toEqual([])
    expect(workspace.presets).toHaveLength(2)
    expect(workspace.presets[0]).toMatchObject(DEFAULT_SETTINGS)
  })
})
