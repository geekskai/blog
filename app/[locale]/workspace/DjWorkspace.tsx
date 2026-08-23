"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import {
  Clock3,
  FolderPlus,
  HardDrive,
  Save,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Waves,
} from "lucide-react"
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
  userId: string | null
  locale: string
  initialBillingStatus: AccountPlanStatus
  checkoutSuccess: boolean
}) {
  const storageKey = useMemo(() => `geekskai:dj-workspace:v1:${userId ?? "visitor"}`, [userId])
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
    return (
      <div className="min-h-[60vh] animate-pulse rounded-2xl border border-slate-800/80 bg-slate-950/50 motion-reduce:animate-none" />
    )
  }

  return (
    <div className="relative space-y-6 py-8 sm:space-y-8 sm:py-10">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(ellipse_80%_70%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]"
        aria-hidden
      />

      <header className="max-w-3xl">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400 sm:text-xs">
          <Waves className="h-3.5 w-3.5" aria-hidden />
          Geekskai Audio Toolkit
        </p>
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-white">
          Local audio preparation
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
          Normalize and convert audio files you own, then organize preparation projects and reuse
          format settings. Public downloader allowances remain separate from paid plans.
        </p>
      </header>

      <section className="relative overflow-hidden rounded-xl border border-amber-500/25 bg-amber-950/25 p-4 sm:p-5">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/[0.06] to-transparent"
          aria-hidden
        />
        <div className="relative flex gap-3 sm:gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-400/25 bg-amber-500/10 text-amber-300">
            <HardDrive className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-semibold text-amber-50">Stored on this device only</h2>
            <p className="mt-1 text-sm leading-6 text-amber-100/70">
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
        canRecordActivation={Boolean(userId)}
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <section className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-950/55 p-5 sm:p-6">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
            aria-hidden
          />
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-500/10 text-sky-300">
              <FolderPlus className="h-4 w-4" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold text-white sm:text-xl">New project</h2>
          </div>
          <form onSubmit={createProject} className="space-y-4">
            <label className="block text-sm text-slate-300">
              Project name
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Friday night set"
                className="mt-2 min-h-11 w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 text-white outline-none transition-[border-color] duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Preparation preset
              <select
                value={selectedPresetId}
                onChange={(event) => setSelectedPresetId(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 text-white outline-none transition-[border-color] duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
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
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition-[background-color,opacity] duration-200 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
            >
              <FolderPlus className="h-4 w-4" aria-hidden />
              Create project
            </button>
          </form>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-slate-950/55 p-5 sm:p-6">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent"
            aria-hidden
          />
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-500/10 text-violet-300">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold text-white sm:text-xl">Save a preset</h2>
          </div>
          <form onSubmit={createPreset} className="space-y-4">
            <input
              value={presetName}
              onChange={(event) => setPresetName(event.target.value)}
              placeholder="Warm-up set"
              aria-label="Preset name"
              className="min-h-11 w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 text-white outline-none transition-[border-color] duration-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={presetFormat}
                onChange={(event) => setPresetFormat(event.target.value as AudioFormat)}
                aria-label="Audio format"
                className="min-h-11 rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
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
                className="min-h-11 rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
              />
            </div>
            <p className="text-xs leading-5 text-slate-500">
              Saved presets can be reused in the local audio processor above.
            </p>
            <button
              type="submit"
              disabled={!presetName.trim()}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition-[background-color,opacity] duration-200 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
            >
              <Save className="h-4 w-4" aria-hidden />
              Save preset
            </button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Projects ({workspace.projects.length})
          </h2>
          <Sparkles className="h-4 w-4 text-slate-600" aria-hidden />
        </div>
        {workspace.projects.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-700/80 bg-slate-900/30 p-6 text-center text-sm text-slate-400">
            Create your first project to test whether this workspace is useful in your real flow.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {workspace.projects.map((project) => {
              const preset = workspace.presets.find(({ id }) => id === project.presetId)
              return (
                <article
                  key={project.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900/60 motion-reduce:transition-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">{project.name}</h3>
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
                      className="inline-flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 motion-reduce:transition-none"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-500/10 text-emerald-300">
              <Clock3 className="h-4 w-4" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold text-white sm:text-xl">Recent activity</h2>
          </div>
          <button
            type="button"
            onClick={clearWorkspace}
            className="min-h-9 rounded-lg px-2 text-xs font-medium text-slate-500 transition-colors duration-200 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 motion-reduce:transition-none sm:text-sm"
          >
            Delete local data
          </button>
        </div>
        <div className="mt-4 space-y-0">
          {workspace.activity.length === 0 ? (
            <p className="text-sm text-slate-500">No activity yet.</p>
          ) : (
            workspace.activity.slice(0, 8).map((entry, index) => (
              <div
                key={entry.id}
                className={`flex justify-between gap-4 py-2.5 text-sm ${index > 0 ? "border-t border-slate-800/60" : ""}`}
              >
                <span className="text-slate-300">{entry.label}</span>
                <time className="shrink-0 text-xs tabular-nums text-slate-600 sm:text-sm">
                  {formatDate(entry.createdAt)}
                </time>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
