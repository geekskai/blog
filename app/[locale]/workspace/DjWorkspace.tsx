"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Clock3, FolderPlus, HardDrive, Save, SlidersHorizontal, Trash2 } from "lucide-react"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import type { AccountPlanStatus } from "@/lib/billing/types"
import AudioProcessorPanel from "./AudioProcessorPanel"

type AudioFormat = "wav" | "mp3"

interface WorkspacePreset {
  id: string
  name: string
  format: AudioFormat
  loudnessTarget: number
}

interface WorkspaceProject {
  id: string
  name: string
  presetId: string
  createdAt: string
}

interface ActivityEntry {
  id: string
  label: string
  createdAt: string
}

interface WorkspaceState {
  projects: WorkspaceProject[]
  presets: WorkspacePreset[]
  activity: ActivityEntry[]
}

const DEFAULT_PRESETS: WorkspacePreset[] = [
  { id: "club-wav", name: "Club prep", format: "wav", loudnessTarget: -9 },
  { id: "portable-mp3", name: "Portable set", format: "mp3", loudnessTarget: -14 },
]

const EMPTY_WORKSPACE: WorkspaceState = {
  projects: [],
  presets: DEFAULT_PRESETS,
  activity: [],
}

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value)
  )

export default function DjWorkspace({
  userId,
  locale,
  initialBillingStatus,
  checkoutSuccess,
}: {
  userId: string
  locale: string
  initialBillingStatus: AccountPlanStatus
  checkoutSuccess: boolean
}) {
  const storageKey = useMemo(() => `geekskai:dj-workspace:v1:${userId}`, [userId])
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null)
  const [projectName, setProjectName] = useState("")
  const [selectedPresetId, setSelectedPresetId] = useState(DEFAULT_PRESETS[0].id)
  const [presetName, setPresetName] = useState("")
  const [presetFormat, setPresetFormat] = useState<AudioFormat>("wav")
  const [loudnessTarget, setLoudnessTarget] = useState(-9)

  useEffect(() => {
    try {
      const savedWorkspace = window.localStorage.getItem(storageKey)
      setWorkspace(savedWorkspace ? JSON.parse(savedWorkspace) : EMPTY_WORKSPACE)
    } catch {
      setWorkspace(EMPTY_WORKSPACE)
    }
    trackClarityEvent("workspace_opened")
  }, [storageKey])

  useEffect(() => {
    if (workspace) {
      window.localStorage.setItem(storageKey, JSON.stringify(workspace))
    }
  }, [storageKey, workspace])

  const addActivity = (label: string): ActivityEntry => ({
    id: createId(),
    label,
    createdAt: new Date().toISOString(),
  })

  const createProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = projectName.trim()
    if (!workspace || !name) return

    const project: WorkspaceProject = {
      id: createId(),
      name,
      presetId: selectedPresetId,
      createdAt: new Date().toISOString(),
    }
    setWorkspace({
      ...workspace,
      projects: [project, ...workspace.projects],
      activity: [addActivity(`Created project “${name}”`), ...workspace.activity].slice(0, 20),
    })
    setProjectName("")
    trackClarityEvent("workspace_project_created")
  }

  const createPreset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = presetName.trim()
    if (!workspace || !name) return

    const preset: WorkspacePreset = {
      id: createId(),
      name,
      format: presetFormat,
      loudnessTarget,
    }
    setWorkspace({
      ...workspace,
      presets: [...workspace.presets, preset],
      activity: [addActivity(`Saved preset “${name}”`), ...workspace.activity].slice(0, 20),
    })
    setSelectedPresetId(preset.id)
    setPresetName("")
    trackClarityEvent("workspace_preset_created")
  }

  const deleteProject = (project: WorkspaceProject) => {
    if (!workspace) return
    setWorkspace({
      ...workspace,
      projects: workspace.projects.filter(({ id }) => id !== project.id),
      activity: [addActivity(`Removed project “${project.name}”`), ...workspace.activity].slice(
        0,
        20
      ),
    })
  }

  const clearWorkspace = () => {
    if (!window.confirm("Delete all projects, custom presets, and activity from this browser?")) {
      return
    }
    window.localStorage.removeItem(storageKey)
    setWorkspace(EMPTY_WORKSPACE)
    setSelectedPresetId(DEFAULT_PRESETS[0].id)
    trackClarityEvent("workspace_local_data_cleared")
  }

  if (!workspace) {
    return <div className="min-h-[60vh] animate-pulse rounded-2xl bg-slate-900/60" />
  }

  return (
    <div className="space-y-8 py-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          Geekskai Audio Toolkit
        </p>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Local audio preparation</h1>
        <p className="max-w-3xl text-slate-300">
          Normalize and convert audio files you own, then organize preparation projects and reuse
          format settings. Public downloader allowances remain separate from paid plans.
        </p>
      </header>

      <section className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
        <div className="flex gap-3">
          <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div>
            <h2 className="font-semibold text-amber-100">Stored on this device only</h2>
            <p className="mt-1 text-sm leading-6 text-amber-100/75">
              Project metadata and presets stay in this browser. Audio files are never uploaded.
              Clearing browser data or changing devices removes this workspace; cloud sync is not
              part of this first phase.
            </p>
          </div>
        </div>
      </section>

      <AudioProcessorPanel
        initialBillingStatus={initialBillingStatus}
        locale={locale}
        checkoutSuccess={checkoutSuccess}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-5 flex items-center gap-3">
            <FolderPlus className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">New project</h2>
          </div>
          <form onSubmit={createProject} className="space-y-4">
            <label className="block text-sm text-slate-300">
              Project name
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Friday night set"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Preparation preset
              <select
                value={selectedPresetId}
                onChange={(event) => setSelectedPresetId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              >
                {workspace.presets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} · {preset.format.toUpperCase()} · {preset.loudnessTarget} LUFS
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={!projectName.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FolderPlus className="h-4 w-4" />
              Create project
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-5 flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Save a preset</h2>
          </div>
          <form onSubmit={createPreset} className="space-y-4">
            <input
              value={presetName}
              onChange={(event) => setPresetName(event.target.value)}
              placeholder="Warm-up set"
              aria-label="Preset name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={presetFormat}
                onChange={(event) => setPresetFormat(event.target.value as AudioFormat)}
                aria-label="Audio format"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
              >
                <option value="wav">WAV</option>
                <option value="mp3">MP3</option>
              </select>
              <input
                type="number"
                min={-24}
                max={-5}
                value={loudnessTarget}
                onChange={(event) => setLoudnessTarget(Number(event.target.value))}
                aria-label="Loudness target in LUFS"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
              />
            </div>
            <p className="text-xs text-slate-500">
              Saved presets can be reused in the local audio processor above.
            </p>
            <button
              type="submit"
              disabled={!presetName.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save preset
            </button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">Projects ({workspace.projects.length})</h2>
        {workspace.projects.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
            Create your first project to test whether this workspace is useful in your real flow.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {workspace.projects.map((project) => {
              const preset = workspace.presets.find(({ id }) => id === project.presetId)
              return (
                <article
                  key={project.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {preset
                          ? `${preset.name} · ${preset.format.toUpperCase()} · ${preset.loudnessTarget} LUFS`
                          : "Preset removed"}
                      </p>
                      <p className="mt-2 text-xs text-slate-600">{formatDate(project.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteProject(project)}
                      aria-label={`Delete ${project.name}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Recent activity</h2>
          </div>
          <button
            type="button"
            onClick={clearWorkspace}
            className="text-sm text-slate-500 transition hover:text-red-300"
          >
            Delete local data
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {workspace.activity.length === 0 ? (
            <p className="text-sm text-slate-500">No activity yet.</p>
          ) : (
            workspace.activity.slice(0, 8).map((entry) => (
              <div key={entry.id} className="flex justify-between gap-4 text-sm">
                <span className="text-slate-300">{entry.label}</span>
                <time className="shrink-0 text-slate-600">{formatDate(entry.createdAt)}</time>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
