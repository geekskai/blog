"use client"

import ShareButtons from "@/components/ShareButtons"
import { Copy, CopyCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import React, { useCallback, useMemo, useState } from "react"

type ReverseMode = "characters" | "words" | "lines"

type SegmenterInstance = {
  segment: (input: string) => Iterable<{ segment: string }>
}

type SegmenterConstructor = new (
  locales?: string | string[],
  options?: { granularity?: "grapheme" | "word" | "sentence" }
) => SegmenterInstance

const getGraphemeSegments = (text: string): string[] => {
  const segmenterCtor = (Intl as unknown as { Segmenter?: SegmenterConstructor }).Segmenter
  if (segmenterCtor) {
    const segmenter = new segmenterCtor(undefined, { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), (item) => item.segment)
  }
  return Array.from(text)
}

const reverseCharacters = (text: string): string => getGraphemeSegments(text).reverse().join("")

const reverseWords = (text: string): string =>
  text
    .split("\n")
    .map((line) => line.split(/\s+/).filter(Boolean).reverse().join(" "))
    .join("\n")

const reverseLines = (text: string): string => text.split("\n").reverse().join("\n")

const modeClassMap: Record<ReverseMode, string> = {
  characters: "border-blue-500/50 bg-blue-500/20 text-blue-100",
  words: "border-emerald-500/50 bg-emerald-500/20 text-emerald-100",
  lines: "border-purple-500/50 bg-purple-500/20 text-purple-100",
}

export default function BackwardsTextGeneratorPage() {
  const t = useTranslations("BackwardsTextGenerator")
  const [input, setInput] = useState(t("default_input"))
  const [mode, setMode] = useState<ReverseMode>("characters")
  const [copyStatus, setCopyStatus] = useState(t("ui.ready_to_copy"))

  const output = useMemo(() => {
    if (mode === "words") return reverseWords(input)
    if (mode === "lines") return reverseLines(input)
    return reverseCharacters(input)
  }, [input, mode])

  const handleCopy = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      try {
        await navigator.clipboard.writeText(text)
        setCopyStatus(t("ui.copied"))
        window.setTimeout(() => setCopyStatus(t("ui.ready_to_copy")), 1600)
      } catch {
        setCopyStatus(t("ui.copy_failed"))
        window.setTimeout(() => setCopyStatus(t("ui.ready_to_copy")), 1600)
      }
    },
    [t]
  )

  const examples = useMemo(
    () => [
      {
        id: "characters" as const,
        label: t("ui.mode_characters"),
        output: reverseCharacters(input),
      },
      {
        id: "words" as const,
        label: t("ui.mode_words"),
        output: reverseWords(input),
      },
      {
        id: "lines" as const,
        label: t("ui.mode_lines"),
        output: reverseLines(input),
      },
    ],
    [input, t]
  )

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 p-4 md:space-y-10 md:p-6">
        <header className="text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">↩️</span>
            <p className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-lg font-bold text-transparent">
              {t("free_tool_badge")}
            </p>
          </div>

          <h1 className="mb-3 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            {t("page_title")}
          </h1>
          <p className="mx-auto max-w-5xl text-base leading-relaxed text-slate-300 md:text-lg">
            {t("seo_description")}
          </p>

          <div className="mx-auto mt-8 max-w-6xl rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-purple-500/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="mb-3 text-xl font-bold text-indigo-200 md:text-2xl">
              {t("tldr_title")}
            </h2>
            <p className="text-sm leading-relaxed text-slate-200 md:text-base md:leading-7">
              {t("tldr")}
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {t("core_facts_title")}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <p className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-4 text-slate-200">
              <strong>{t("primary_intent_label")}</strong> {t("keyword_label")}
            </p>
            <p className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-slate-200">
              <strong>{t("pricing_label")}</strong> {t("free_label")}
            </p>
            <p className="rounded-2xl border border-purple-500/25 bg-purple-500/10 p-4 text-slate-200">
              <strong>{t("best_for_label")}</strong> {t("best_for")}
            </p>
            <p className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-4 text-slate-200">
              <strong>{t("key_benefit_label")}</strong> {t("key_benefit")}
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-indigo-500/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />

          <div className="relative space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                {t("ui.playground_title")}
              </h2>
              <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {t("last_updated_label")}: 2026-03-22
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <span className="mb-2 block text-sm font-semibold text-blue-200">
                  {t("ui.input_label")}
                </span>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t("ui.input_placeholder")}
                  className="h-32 w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-base text-white backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                />
              </label>

              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-cyan-100">Custom combined output</h3>
                  <button
                    type="button"
                    onClick={() => void handleCopy(output)}
                    className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100 transition-all duration-300 hover:bg-cyan-500/30"
                  >
                    {copyStatus === t("ui.ready_to_copy") ? (
                      <Copy className="h-4 w-4" />
                    ) : (
                      <CopyCheck className="h-4 w-4" />
                    )}
                    {copyStatus}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={output}
                  className="h-32 w-full rounded-xl border border-cyan-500/30 bg-slate-900/40 p-3 text-sm text-white"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">{t("ui.mode_title")}</h3>
              <div className="flex flex-wrap gap-2">
                {(["characters", "words", "lines"] as ReverseMode[]).map((id) => {
                  const selected = mode === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMode(id)}
                      className={`rounded-xl border px-3 py-1.5 text-xs transition-all duration-300 ${
                        selected
                          ? modeClassMap[id]
                          : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {id === "characters" && t("ui.mode_characters")}
                      {id === "words" && t("ui.mode_words")}
                      {id === "lines" && t("ui.mode_lines")}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <ShareButtons />

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            {t("ui.preview_title")}
          </h2>
          <p className="mb-5 text-sm text-slate-300">{t("ui.preview_description")}</p>
          <div className="grid gap-3 md:grid-cols-3">
            {examples.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => void handleCopy(example.output)}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                  modeClassMap[example.id]
                }`}
              >
                <p className="mb-2 text-sm font-semibold">{example.label}</p>
                <div className="rounded-lg border border-white/20 bg-slate-900/40 p-2 text-sm text-white">
                  {example.output || t("ui.empty_input")}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {t("ui.how_to_use_title")}
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-slate-300">
            {(t.raw("how_to_use_steps") as string[]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{t("use_cases_title")}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {(t.raw("use_cases") as string[]).map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{t("limits_title")}</h2>
          <ul className="list-inside list-disc space-y-2 text-slate-200">
            {(t.raw("boundaries") as string[]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-5 text-2xl font-bold text-white md:text-3xl">{t("faq.title")}</h2>
          <div className="space-y-4">
            {(t.raw("faq.items") as Array<{ q: string; a: string }>).map((item) => (
              <article
                key={item.q}
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 md:p-5"
              >
                <h3 className="mb-2 text-lg font-semibold text-white">{item.q}</h3>
                <p className="text-slate-300">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
