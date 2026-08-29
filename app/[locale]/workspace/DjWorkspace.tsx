"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import {
  Clock3,
  FolderOpen,
  FolderPlus,
  HardDrive,
  Save,
  SlidersHorizontal,
  Trash2,
  Waves,
} from "lucide-react"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import type { AudioCreditBalance } from "@/lib/billing/types"
import {
  DEFAULT_SETTINGS,
  EMPTY_WORKSPACE,
  normalizeWorkspaceState,
  type ActivityEntry,
  type AudioPreparationSettings,
  type WorkspacePreset,
  type WorkspaceProject,
  type WorkspaceState,
} from "@/lib/workspace/state"
import AudioProcessorPanel from "./AudioProcessorPanel"

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value)
  )

const formatSettings = ({ format, loudnessTarget, wavBitDepth }: AudioPreparationSettings) =>
  `${format.toUpperCase()} · ${loudnessTarget} LUFS${format === "wav" ? ` · ${wavBitDepth}-bit` : ""}`

export default function DjWorkspace({
  userId,
  locale,
  initialCredits,
  checkoutSuccess,
}: {
  userId: string | null
  locale: string
  initialCredits: AudioCreditBalance | null
  checkoutSuccess: boolean
}) {
  const storageKey = useMemo(() => `geekskai:dj-workspace:v1:${userId ?? "visitor"}`, [userId])
  const [workspace, setWorkspace] = useState<WorkspaceState>(EMPTY_WORKSPACE)
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null)
  const [processorSettings, setProcessorSettings] =
    useState<AudioPreparationSettings>(DEFAULT_SETTINGS)
  const [projectName, setProjectName] = useState("")
  const [presetName, setPresetName] = useState("")
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null)

  useEffect(() => {
    try {
      const savedWorkspace = window.localStorage.getItem(storageKey)
      setWorkspace(
        savedWorkspace ? normalizeWorkspaceState(JSON.parse(savedWorkspace)) : EMPTY_WORKSPACE
      )
    } catch {
      setWorkspace(EMPTY_WORKSPACE)
    } finally {
      setLoadedStorageKey(storageKey)
    }
    trackClarityEvent("workspace_opened")
    if (userId) {
      void fetch("/api/workspace/activation/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "opened" }),
      })
    }
  }, [storageKey, userId])

  useEffect(() => {
    if (loadedStorageKey === storageKey) {
      window.localStorage.setItem(storageKey, JSON.stringify(workspace))
    }
  }, [loadedStorageKey, storageKey, workspace])

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
      settings: { ...processorSettings },
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
      ...processorSettings,
    }
    setWorkspace({
      ...workspace,
      presets: [...workspace.presets, preset],
      activity: [addActivity(`Saved preset “${name}”`), ...workspace.activity].slice(0, 20),
    })
    setPresetName("")
    setSettingsNotice(`Saved “${name}” from the current output settings.`)
    trackClarityEvent("workspace_preset_created")
  }

  const applySettings = (settings: AudioPreparationSettings, label: string) => {
    setProcessorSettings({ ...settings })
    setSettingsNotice(`${label} settings applied. Choose audio when you are ready.`)
  }

  const applyPreset = (preset: WorkspacePreset) => {
    applySettings(preset, preset.name)
    trackClarityEvent("workspace_preset_applied")
  }

  const openProject = (project: WorkspaceProject) => {
    applySettings(project.settings, project.name)
    trackClarityEvent("workspace_project_opened")
  }

  const deleteProject = (project: WorkspaceProject) => {
    if (!workspace) return
    if (!window.confirm(`Delete “${project.name}” from this browser?`)) return
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
    setProcessorSettings(DEFAULT_SETTINGS)
    setSettingsNotice(null)
    trackClarityEvent("workspace_local_data_cleared")
  }

  return (
    <div className="relative space-y-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4 sm:space-y-6 sm:pb-10 sm:pt-6 lg:pb-10">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(ellipse_80%_70%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]"
        aria-hidden
      />

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400 sm:text-xs">
            <Waves className="h-3.5 w-3.5" aria-hidden />
            Geekskai Audio Toolkit
          </p>
          <h1 className="mt-1.5 text-[clamp(1.5rem,3.5vw,2rem)] font-bold tracking-tight text-white">
            Local audio preparation
          </h1>
        </div>
        <p className="text-sm leading-6 text-slate-400 sm:text-right">
          Normalize audio you own in-browser. Projects and presets stay on this device only.
        </p>
      </header>

      <AudioProcessorPanel
        initialCredits={initialCredits}
        locale={locale}
        checkoutSuccess={checkoutSuccess}
        isSignedIn={Boolean(userId)}
        settings={processorSettings}
        onSettingsChange={(settings) => {
          setProcessorSettings(settings)
          setSettingsNotice(null)
        }}
      />

      {settingsNotice ? (
        <p
          role="status"
          className="rounded-xl border border-emerald-400/20 bg-emerald-950/25 px-4 py-3 text-sm leading-6 text-emerald-100"
        >
          {settingsNotice}
        </p>
      ) : null}

      <section className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-950/20 px-3 py-2.5 sm:px-4 sm:py-3">
        <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
        <p className="text-sm leading-6 text-amber-100/80">
          <span className="font-medium text-amber-50">Local storage only.</span> Audio files are
          never uploaded or saved in projects. Clearing browser data removes projects and presets
          from this device.
        </p>
      </section>

      {userId && loadedStorageKey === storageKey ? (
        <>
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
                <div>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">Save a project</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Save the current output settings—not the audio files.
                  </p>
                </div>
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
                <p className="text-sm text-slate-400">
                  Current settings: {formatSettings(processorSettings)}
                </p>
                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition-[background-color,opacity] duration-200 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                >
                  <FolderPlus className="h-4 w-4" aria-hidden />
                  Save project settings
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
                <div>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">Presets</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Apply a saved setup or name the current settings.
                  </p>
                </div>
              </div>
              <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
                {workspace.presets.map((preset) => (
                  <div key={preset.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{preset.name}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{formatSettings(preset)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-violet-400/25 px-3 text-sm font-semibold text-violet-200 transition-colors hover:bg-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={createPreset} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={presetName}
                  onChange={(event) => setPresetName(event.target.value)}
                  placeholder="Warm-up set"
                  aria-label="Preset name"
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 text-white outline-none transition-[border-color] duration-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                />
                <button
                  type="submit"
                  disabled={!presetName.trim()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition-[background-color,opacity] duration-200 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                >
                  <Save className="h-4 w-4" aria-hidden />
                  Save current
                </button>
              </form>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Projects ({workspace.projects.length})
            </h2>
            {workspace.projects.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Save the current output settings when you want to reuse them for another session.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-slate-800/80 border-y border-slate-800/80">
                {workspace.projects.map((project) => (
                  <article
                    key={project.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">{project.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatSettings(project.settings)}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">{formatDate(project.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openProject(project)}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-sky-400/25 px-3 text-sm font-semibold text-sky-200 transition-colors hover:bg-sky-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none sm:flex-none"
                      >
                        <FolderOpen className="h-4 w-4" aria-hidden />
                        Open settings
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(project)}
                        aria-label={`Delete ${project.name}`}
                        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 motion-reduce:transition-none"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </article>
                ))}
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
                className="min-h-11 rounded-lg px-3 text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 motion-reduce:transition-none"
              >
                Delete local data
              </button>
            </div>
            <div className="mt-4 space-y-0">
              {workspace.activity.length === 0 ? (
                <p className="text-sm text-slate-400">No activity yet.</p>
              ) : (
                workspace.activity.slice(0, 8).map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex justify-between gap-4 py-2.5 text-sm ${index > 0 ? "border-t border-slate-800/60" : ""}`}
                  >
                    <span className="text-slate-300">{entry.label}</span>
                    <time className="shrink-0 text-sm tabular-nums text-slate-400">
                      {formatDate(entry.createdAt)}
                    </time>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
