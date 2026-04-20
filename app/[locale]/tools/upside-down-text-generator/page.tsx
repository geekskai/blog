"use client"

import ShareButtons from "@/components/ShareButtons"
import { useTranslations } from "next-intl"
import React, { useCallback, useMemo, useState } from "react"
import {
  BASE_STYLE_IDS,
  DECORATION_IDS,
  PRESET_EFFECTS,
  TRANSFORMATION_IDS,
  applyEmojiWrap,
  getEffectById,
} from "./lib/transforms"

const EMOJIS = ["✨", "🔥", "💫", "🫧", "🌈", "⚡", "💜", "🪩"]

const CATEGORY_STYLE_MAP: Record<string, string> = {
  "Enclosed Alphanumerics": "border-blue-500/30 bg-blue-500/10 text-blue-100",
  "Mathematical Styles": "border-purple-500/30 bg-purple-500/10 text-purple-100",
  "Combining Marks": "border-pink-500/30 bg-pink-500/10 text-pink-100",
  Transformation: "border-cyan-500/30 bg-cyan-500/10 text-cyan-100",
  Width: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
}

export default function UpsideDownTextGeneratorPage() {
  const t = useTranslations("UpsideDownTextGenerator")
  const [input, setInput] = useState(t("default_input"))
  const [baseStyleId, setBaseStyleId] = useState<string>("plain")
  const [decorationIds, setDecorationIds] = useState<string[]>([])
  const [transformationId, setTransformationId] = useState<string>("")
  const [emojiEnabled, setEmojiEnabled] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState("✨")
  const [copyStatus, setCopyStatus] = useState(t("ui.ready_to_copy"))

  const CATEGORY_MAP = useMemo(
    () => ({
      "Enclosed Alphanumerics": t("categories.enclosed"),
      "Mathematical Styles": t("categories.math"),
      "Combining Marks": t("categories.marks"),
      Transformation: t("categories.transform"),
      Width: t("categories.width"),
    }),
    [t]
  )

  const CATEGORY_ORDER = useMemo(
    () =>
      [
        "Enclosed Alphanumerics",
        "Mathematical Styles",
        "Combining Marks",
        "Transformation",
        "Width",
      ] as const,
    []
  )

  const groupedEffects = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: PRESET_EFFECTS.filter((effect) => effect.category === category).map((effect) => ({
          ...effect,
          displayName: t(`effects.${effect.id}.name`),
          displayDesc: t(`effects.${effect.id}.desc`),
        })),
      })),
    [CATEGORY_ORDER, t]
  )

  const previewCards = useMemo(
    () =>
      PRESET_EFFECTS.filter((effect) => effect.id !== "plain").map((effect) => ({
        ...effect,
        displayName: t(`effects.${effect.id}.name`),
        displayDesc: t(`effects.${effect.id}.desc`),
        output: effect.apply(input),
      })),
    [input, t]
  )

  const customOutput = useMemo(() => {
    let output = input

    if (baseStyleId && baseStyleId !== "plain") {
      const base = getEffectById(baseStyleId)
      if (base) output = base.apply(output)
    }

    if (transformationId) {
      const transform = getEffectById(transformationId)
      if (transform) output = transform.apply(output)
    }

    decorationIds.forEach((id) => {
      const deco = getEffectById(id)
      if (deco) output = deco.apply(output)
    })

    if (emojiEnabled) {
      output = applyEmojiWrap(output, selectedEmoji)
    }

    return output
  }, [baseStyleId, decorationIds, emojiEnabled, input, selectedEmoji, transformationId])

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

  const toggleDecoration = useCallback((id: string) => {
    setDecorationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-8 p-4 md:space-y-10 md:p-6">
        <header className="text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-indigo-500/15 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">🫧</span>
            <p className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-lg font-bold text-transparent">
              {t("free_tool_badge")}
            </p>
          </div>

          <h1 className="mb-3 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            {t("page_title")}
          </h1>
          <p className="mx-auto max-w-5xl text-base text-slate-300 md:text-lg">
            {t("seo_description")}
          </p>

          <div className="mx-auto mt-8 max-w-6xl rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-indigo-500/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="mb-3 text-xl font-bold text-purple-200 md:text-2xl">
              {t("tldr_title")}
            </h2>
            <p className="text-sm text-slate-200 md:text-base md:leading-7">{t("tldr")}</p>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-blue-500/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                {t("ui.playground_title")}
              </h2>
              <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {t("last_updated_label")}: 2026-03-04
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
                  <h3 className="text-sm font-semibold text-cyan-100">
                    {t("ui.custom_output_title")}
                  </h3>
                  <button
                    type="button"
                    onClick={() => void handleCopy(customOutput)}
                    className="rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100 transition-all duration-300 hover:bg-cyan-500/30"
                  >
                    {t("ui.copy")}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={customOutput}
                  className="h-32 w-full rounded-xl border border-cyan-500/30 bg-slate-900/40 p-3 text-sm text-white"
                />
                <p className="mt-2 text-xs text-cyan-100">{copyStatus}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-white">
                  {t("ui.base_style_title")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setBaseStyleId("plain")}
                    className={`rounded-xl border px-3 py-1.5 text-xs transition-all duration-300 ${
                      baseStyleId === "plain"
                        ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-100"
                        : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {t("ui.plain")}
                  </button>
                  {BASE_STYLE_IDS.map((id) => {
                    const selected = baseStyleId === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setBaseStyleId(id)}
                        className={`rounded-xl border px-3 py-1.5 text-xs transition-all duration-300 ${
                          selected
                            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-100"
                            : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {t(`effects.${id}.name`)}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-white">
                  {t("ui.decorations_title")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {DECORATION_IDS.map((id) => {
                    const selected = decorationIds.includes(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleDecoration(id)}
                        className={`rounded-xl border px-3 py-1.5 text-xs transition-all duration-300 ${
                          selected
                            ? "border-pink-500/50 bg-pink-500/20 text-pink-100"
                            : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {t(`effects.${id}.name`)}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-white">
                  {t("ui.transform_emoji_title")}
                </h3>
                <div className="mb-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTransformationId("")}
                    className={`rounded-xl border px-3 py-1.5 text-xs transition-all duration-300 ${
                      transformationId === ""
                        ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-100"
                        : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {t("ui.none")}
                  </button>
                  {TRANSFORMATION_IDS.map((id) => {
                    const selected = transformationId === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTransformationId(id)}
                        className={`rounded-xl border px-3 py-1.5 text-xs transition-all duration-300 ${
                          selected
                            ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-100"
                            : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {t(`effects.${id}.name`)}
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={emojiEnabled}
                      onChange={(event) => setEmojiEnabled(event.target.checked)}
                      className="h-4 w-4 accent-cyan-500"
                    />
                    {t("ui.emoji_wrapper")}
                  </label>
                  {emojiEnabled && (
                    <div className="flex flex-wrap gap-2">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setSelectedEmoji(emoji)}
                          className={`rounded-lg border px-2 py-1 text-sm ${
                            selectedEmoji === emoji
                              ? "border-purple-500/50 bg-purple-500/20"
                              : "border-white/15 bg-white/5"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
          <div className="grid gap-3 md:grid-cols-2">
            {previewCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => void handleCopy(card.output)}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                  CATEGORY_STYLE_MAP[card.category]
                }`}
              >
                <p className="mb-2 text-sm font-semibold">
                  {card.displayName}{" "}
                  <span className="text-xs opacity-70">
                    ({CATEGORY_MAP[card.category as keyof typeof CATEGORY_MAP] || card.category})
                  </span>
                </p>
                <p className="line-clamp-2 text-xs opacity-80">{card.displayDesc}</p>
                <div className="mt-3 rounded-lg border border-white/20 bg-slate-900/40 p-2 text-sm text-white">
                  {card.output || t("ui.empty_input")}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {t("ui.taxonomy_title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedEffects.map((group) => (
              <article
                key={group.category}
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-4"
              >
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {CATEGORY_MAP[group.category as keyof typeof CATEGORY_MAP] || group.category}
                </h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <strong>{item.displayName}</strong>: {item.displayDesc}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{t("limits_title")}</h2>
          <ul className="list-inside list-disc space-y-2 text-slate-200">
            {t.raw("boundaries").map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-5 text-2xl font-bold text-white md:text-3xl">{t("faq.title")}</h2>
          <div className="space-y-4">
            {t.raw("faq.items").map((item: { q: string; a: string }) => (
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
