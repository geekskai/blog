"use client"

import ShareButtons from "@/components/ShareButtons"
import { useTranslations } from "next-intl"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  BASE_STYLE_IDS,
  DECORATION_IDS,
  PRESET_EFFECTS,
  TRANSFORMATION_IDS,
  applyEmojiWrap,
  getEffectById,
  type EffectCategory,
  type TextEffect,
} from "../lib/transforms"
import { Copy, CopyCheck } from "lucide-react"

interface FAQItem {
  q: string
  a: string
}

interface RelatedToolItem {
  label: string
  href: string
  description?: string
}

interface UnicodeToolTemplateProps {
  badgeEmoji: string
  badgeText: string
  title: string
  description: string
  tldr: string
  keywordLabel: string
  lastUpdated: string
  enabledEffectIds: string[]
  useCaseItems: string[]
  boundaryItems: string[]
  faqItems: FAQItem[]
  relatedTools?: RelatedToolItem[]
  seoSynonyms?: string[]
  bestFor?: string
  keyBenefit?: string
  defaultInput?: string
  allowComposer?: boolean
  allowEmojiWrapper?: boolean
}

const CATEGORY_ORDER: EffectCategory[] = [
  "Enclosed Alphanumerics",
  "Mathematical Styles",
  "Combining Marks",
  "Transformation",
  "Width",
]

const CATEGORY_STYLES: Record<EffectCategory, string> = {
  "Enclosed Alphanumerics": "border-blue-500/30 bg-blue-500/10 text-blue-100",
  "Mathematical Styles": "border-purple-500/30 bg-purple-500/10 text-purple-100",
  "Combining Marks": "border-pink-500/30 bg-pink-500/10 text-pink-100",
  Transformation: "border-cyan-500/30 bg-cyan-500/10 text-cyan-100",
  Width: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
}

const EMOJIS = ["✨", "🔥", "💫", "🫧", "🌈", "⚡", "💜", "🪩"]
const LATIN_ONLY_EFFECT_IDS = new Set([
  "negative-circle",
  "hollow-circle",
  "hollow-square",
  "solid-square",
  "serif-bold",
  "sans-bold",
  "italic",
  "bold-italic",
  "script",
  "bold-script",
  "fraktur",
  "bold-fraktur",
  "double-struck",
  "upside-down",
  "mirror",
  "fullwidth",
])

export default function UnicodeToolTemplate({
  badgeEmoji,
  badgeText,
  title,
  description,
  tldr,
  keywordLabel,
  lastUpdated,
  enabledEffectIds,
  useCaseItems,
  boundaryItems,
  faqItems,
  relatedTools = [],
  seoSynonyms = [],
  bestFor,
  keyBenefit,
  defaultInput = "Hello World",
  allowComposer = true,
  allowEmojiWrapper = true,
}: UnicodeToolTemplateProps) {
  const t = useTranslations("UnicodeTool")
  const te = useTranslations("UpsideDownTextGenerator")
  const displayBestFor = bestFor || t("default_best_for")
  const displayKeyBenefit = keyBenefit || t("default_key_benefit")

  const [input, setInput] = useState(defaultInput)
  const [baseStyleId, setBaseStyleId] = useState<string>("plain")
  const [decorationIds, setDecorationIds] = useState<string[]>([])
  const [transformationId, setTransformationId] = useState<string>("")
  const [emojiEnabled, setEmojiEnabled] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState("✨")
  const [simpleStyleId, setSimpleStyleId] = useState<string>("plain")
  const [copyStatus, setCopyStatus] = useState(t("ready_to_copy_status"))
  const [copiedPreviewCardId, setCopiedPreviewCardId] = useState<string | null>(null)

  const CATEGORY_MAP: Record<string, string> = useMemo(
    () => ({
      "Enclosed Alphanumerics": t.raw("categories.enclosed") || "Enclosed Alphanumerics",
      "Mathematical Styles": t.raw("categories.math") || "Mathematical Styles",
      "Combining Marks": t.raw("categories.marks") || "Combining Marks",
      Transformation: t.raw("categories.transform") || "Transformation",
      Width: t.raw("categories.width") || "Width",
    }),
    [t]
  )

  const getLocalizedEffectName = useCallback(
    (effect: TextEffect) => {
      try {
        return te(`effects.${effect.id}.name`)
      } catch {
        return effect.name
      }
    },
    [te]
  )

  const getLocalizedEffectDescription = useCallback(
    (effect: TextEffect) => {
      try {
        return te(`effects.${effect.id}.desc`)
      } catch {
        return effect.description
      }
    },
    [te]
  )

  const enabledEffects = useMemo(() => {
    const idSet = new Set(enabledEffectIds)
    return PRESET_EFFECTS.filter((effect) => idSet.has(effect.id)).map((effect) => ({
      ...effect,
      name: getLocalizedEffectName(effect),
      description: getLocalizedEffectDescription(effect),
    }))
  }, [enabledEffectIds, getLocalizedEffectDescription, getLocalizedEffectName])

  const previewCards = useMemo(
    () =>
      enabledEffects
        .filter((effect) => effect.id !== "plain")
        .map((effect) => ({ ...effect, output: effect.apply(input) })),
    [enabledEffects, input]
  )

  const simpleStylePool = useMemo(
    () => enabledEffects.filter((effect) => effect.id !== "plain"),
    [enabledEffects]
  )

  useEffect(() => {
    if (allowComposer) return
    if (simpleStylePool.length === 0) {
      setSimpleStyleId("plain")
      return
    }
    if (
      simpleStyleId === "plain" ||
      !simpleStylePool.some((effect) => effect.id === simpleStyleId)
    ) {
      setSimpleStyleId(simpleStylePool[0].id)
    }
  }, [allowComposer, simpleStyleId, simpleStylePool])

  const groupedEffects = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: enabledEffects.filter((effect) => effect.category === category),
      })).filter((group) => group.items.length > 0),
    [enabledEffects]
  )

  const hasNonLatinLetters = useMemo(
    () => Array.from(input).some((char) => /\p{L}/u.test(char) && !/\p{Script=Latin}/u.test(char)),
    [input]
  )

  const baseIds = useMemo(
    () => BASE_STYLE_IDS.filter((id) => enabledEffectIds.includes(id)),
    [enabledEffectIds]
  )
  const decorationPool = useMemo(
    () => DECORATION_IDS.filter((id) => enabledEffectIds.includes(id)),
    [enabledEffectIds]
  )
  const transformPool = useMemo(
    () => TRANSFORMATION_IDS.filter((id) => enabledEffectIds.includes(id)),
    [enabledEffectIds]
  )

  const activeLatinOnlyEffects = useMemo(() => {
    const selectedIds = new Set<string>()

    if (!allowComposer) {
      if (simpleStyleId !== "plain") selectedIds.add(simpleStyleId)
    } else {
      if (baseStyleId !== "plain") selectedIds.add(baseStyleId)
      if (transformationId) selectedIds.add(transformationId)
    }

    return Array.from(selectedIds)
      .filter((id) => LATIN_ONLY_EFFECT_IDS.has(id))
      .map((id) => {
        const effect = getEffectById(id)
        return effect ? getLocalizedEffectName(effect) : id
      })
  }, [allowComposer, baseStyleId, getLocalizedEffectName, simpleStyleId, transformationId])

  const getLocalizedEffectNameById = useCallback(
    (id: string) => {
      const effect = getEffectById(id)
      return effect ? getLocalizedEffectName(effect) : id
    },
    [getLocalizedEffectName]
  )

  const customOutput = useMemo(() => {
    let output = input

    if (!allowComposer) {
      if (simpleStyleId !== "plain") {
        const simpleStyle = getEffectById(simpleStyleId)
        if (simpleStyle && enabledEffectIds.includes(simpleStyleId)) {
          output = simpleStyle.apply(output)
        }
      }
      if (allowEmojiWrapper && emojiEnabled) {
        output = applyEmojiWrap(output, selectedEmoji)
      }
      return output
    }

    if (baseStyleId && baseStyleId !== "plain" && enabledEffectIds.includes(baseStyleId)) {
      const base = getEffectById(baseStyleId)
      if (base) output = base.apply(output)
    }

    if (transformationId && enabledEffectIds.includes(transformationId)) {
      const transform = getEffectById(transformationId)
      if (transform) output = transform.apply(output)
    }

    decorationIds.forEach((id) => {
      if (!enabledEffectIds.includes(id)) return
      const deco = getEffectById(id)
      if (deco) output = deco.apply(output)
    })

    if (allowEmojiWrapper && emojiEnabled) {
      output = applyEmojiWrap(output, selectedEmoji)
    }

    return output
  }, [
    allowEmojiWrapper,
    allowComposer,
    baseStyleId,
    decorationIds,
    emojiEnabled,
    enabledEffectIds,
    input,
    selectedEmoji,
    simpleStyleId,
    transformationId,
  ])

  const handleCopy = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      try {
        await navigator.clipboard.writeText(text)
        setCopyStatus(t("copied_button_label"))
        window.setTimeout(() => setCopyStatus(t("ready_to_copy_status")), 1600)
        return true
      } catch {
        setCopyStatus(t("copy_failed_label"))
        window.setTimeout(() => setCopyStatus(t("ready_to_copy_status")), 1600)
        return false
      }
    },
    [t]
  )

  const handlePreviewCardCopy = useCallback(
    async (cardId: string, text: string) => {
      const didCopy = await handleCopy(text)
      if (!didCopy) return
      setCopiedPreviewCardId(cardId)
    },
    [handleCopy]
  )

  useEffect(() => {
    if (!copiedPreviewCardId) return
    const timer = window.setTimeout(() => setCopiedPreviewCardId(null), 800)
    return () => window.clearTimeout(timer)
  }, [copiedPreviewCardId])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative mx-auto max-w-6xl space-y-8 p-4 md:space-y-10 md:p-6">
        <header className="text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-indigo-500/15 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">{badgeEmoji}</span>
            <p className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-lg font-bold text-transparent">
              {badgeText}
            </p>
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-5xl text-base text-slate-300 md:text-lg">{description}</p>
          <div className="mx-auto mt-8 max-w-6xl rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-indigo-500/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="mb-3 text-xl font-bold text-purple-200 md:text-2xl">
              {t("qanda_title")}
            </h2>
            <p className="text-sm text-slate-200 md:text-base md:leading-7">{tldr}</p>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {t("core_facts_title")}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <p className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-4 text-slate-200">
              <strong>{t("primary_intent_label")}</strong> {keywordLabel}
            </p>
            <p className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-slate-200">
              <strong>{t("pricing_label")}</strong> {t("free_label")}
            </p>
            <p className="rounded-2xl border border-purple-500/25 bg-purple-500/10 p-4 text-slate-200">
              <strong>{t("best_for_label")}</strong> {displayBestFor}
            </p>
            <p className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-4 text-slate-200">
              <strong>{t("key_benefit_label")}</strong> {displayKeyBenefit}
            </p>
          </div>
          {seoSynonyms.length > 0 && (
            <p className="mt-4 text-sm text-slate-300">
              <strong>{t("related_searches_label")}</strong> {seoSynonyms.join(", ")}
            </p>
          )}
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-blue-500/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="relative space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white md:text-3xl">{t("playground_title")}</h2>
              <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {t("last_updated_label")}: {lastUpdated}
              </p>
            </div>
            <p className="text-xs text-slate-300">
              {t("primary_keyword_label")} {keywordLabel}
            </p>
            <p className="text-xs text-slate-400">{t("latin_compatibility_note")}</p>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <span className="mb-2 block text-sm font-semibold text-blue-200">
                  {t("input_label")}
                </span>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t("input_placeholder")}
                  className="h-32 w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-base text-white backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                />
              </label>

              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-cyan-100">
                    {allowComposer ? t("custom_output_label") : t("primary_output_label")}
                  </h3>
                  <button
                    type="button"
                    onClick={() => void handleCopy(customOutput)}
                    className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100 transition-all duration-300 hover:bg-cyan-500/30"
                  >
                    {copyStatus === t("ready_to_copy_status") ? (
                      <Copy className="h-4 w-4" />
                    ) : (
                      <CopyCheck className="h-4 w-4" />
                    )}
                    {copyStatus}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={customOutput}
                  className="h-32 w-full rounded-xl border border-cyan-500/30 bg-slate-900/40 p-3 text-sm text-white"
                />
                {hasNonLatinLetters && activeLatinOnlyEffects.length > 0 && (
                  <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                    {t("latin_compatibility_warning", {
                      effects: activeLatinOnlyEffects.join(", "),
                    })}
                  </p>
                )}
              </div>
            </div>

            {!allowComposer && simpleStylePool.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-white">{t("select_style_label")}</h3>
                <div className="flex flex-wrap gap-2">
                  {simpleStylePool.map((effect) => {
                    const selected = simpleStyleId === effect.id
                    return (
                      <button
                        key={effect.id}
                        type="button"
                        onClick={() => setSimpleStyleId(effect.id)}
                        className={`rounded-xl border px-3 py-1.5 text-xs transition-all duration-300 ${
                          selected
                            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-100"
                            : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <span>{effect.name}</span>
                          {LATIN_ONLY_EFFECT_IDS.has(effect.id) && (
                            <span className="rounded-md border border-amber-400/40 bg-amber-500/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-amber-200">
                              {t("latin_only_badge")}
                            </span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {allowComposer && (
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">{t("base_style_label")}</h3>
                  <select
                    value={baseStyleId}
                    onChange={(event) => setBaseStyleId(event.target.value)}
                    className="h-11 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 text-sm text-slate-100 outline-none transition-all focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="plain">{t("plain_style")}</option>
                    {baseIds.map((id) => (
                      <option key={id} value={id}>
                        {getLocalizedEffectNameById(id)}
                        {LATIN_ONLY_EFFECT_IDS.has(id) ? ` (${t("latin_only_badge")})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    {t("decorations_label")}
                  </h3>
                  <details className="group rounded-xl border border-white/15 bg-slate-900/50">
                    <summary className="flex h-11 cursor-pointer list-none items-center justify-between px-3 text-sm text-slate-100">
                      <span className="truncate pr-3">
                        {decorationIds.length > 0
                          ? `${decorationIds.length} selected`
                          : `${t("none_style")} selected`}
                      </span>
                      <span className="text-xs text-slate-400 transition-transform duration-300 group-open:rotate-180">
                        v
                      </span>
                    </summary>
                    <div className="max-h-40 space-y-1 overflow-y-auto border-t border-white/10 px-2 py-2">
                      {decorationPool.map((id) => {
                        const selected = decorationIds.includes(id)
                        return (
                          <label
                            key={id}
                            className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                              selected
                                ? "bg-pink-500/20 text-pink-100"
                                : "text-slate-200 hover:bg-white/5"
                            }`}
                          >
                            <span className="truncate">{getLocalizedEffectNameById(id)}</span>
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                setDecorationIds((prev) =>
                                  prev.includes(id)
                                    ? prev.filter((item) => item !== id)
                                    : [...prev, id]
                                )
                              }}
                              className="h-4 w-4 shrink-0 accent-pink-500"
                            />
                          </label>
                        )
                      })}
                    </div>
                  </details>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    {t("transform_emoji_label")}
                  </h3>
                  <select
                    value={transformationId}
                    onChange={(event) => setTransformationId(event.target.value)}
                    className="mb-3 h-11 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 text-sm text-slate-100 outline-none transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="">{t("none_style")}</option>
                    {transformPool.map((id) => (
                      <option key={id} value={id}>
                        {getLocalizedEffectNameById(id)}
                        {LATIN_ONLY_EFFECT_IDS.has(id) ? ` (${t("latin_only_badge")})` : ""}
                      </option>
                    ))}
                  </select>

                  {allowEmojiWrapper && (
                    <div className="space-y-2">
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={emojiEnabled}
                          onChange={(event) => setEmojiEnabled(event.target.checked)}
                          className="h-4 w-4 accent-cyan-500"
                        />
                        {t("add_emoji_wrapper_label")}
                      </label>
                      {emojiEnabled && (
                        <select
                          value={selectedEmoji}
                          onChange={(event) => setSelectedEmoji(event.target.value)}
                          className="h-10 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 text-sm text-slate-100 outline-none transition-all focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20"
                        >
                          {EMOJIS.map((emoji) => (
                            <option key={emoji} value={emoji}>
                              {emoji}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <ShareButtons />

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            {t("one_click_preview_title")}
          </h2>
          <p className="mb-5 text-sm text-slate-300">{t("one_click_preview_description")}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {previewCards.map((card) => (
              <article
                key={card.id}
                role="button"
                tabIndex={0}
                onClick={() => void handlePreviewCardCopy(card.id, card.output)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    void handlePreviewCardCopy(card.id, card.output)
                  }
                }}
                className={`relative cursor-pointer rounded-2xl border p-4 text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                  CATEGORY_STYLES[card.category as keyof typeof CATEGORY_STYLES] || ""
                }`}
                aria-label={`${card.name}`}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    void handlePreviewCardCopy(card.id, card.output)
                  }}
                  className="absolute right-3 top-3 rounded-lg border border-white/20 bg-black/20 p-1.5 text-slate-200 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-500/20 hover:text-cyan-100"
                  aria-label={`Copy ${card.output}`}
                >
                  {copiedPreviewCardId === card.id ? (
                    <CopyCheck className="h-3.5 w-3.5 text-emerald-300" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>

                <p className="mb-2 pr-10 text-sm font-semibold">
                  {card.name}{" "}
                  {LATIN_ONLY_EFFECT_IDS.has(card.id) && (
                    <span className="mr-1 rounded-md border border-amber-400/40 bg-amber-500/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-amber-200">
                      {t("latin_only_badge")}
                    </span>
                  )}
                  <span className="text-xs opacity-70">
                    ({CATEGORY_MAP[card.category] || card.category})
                  </span>
                </p>
                <p className="line-clamp-2 text-xs opacity-80">{card.description}</p>
                <div className="mt-3 rounded-lg border border-white/20 bg-slate-900/40 p-2 text-sm text-white">
                  {card.output || t("empty_input_placeholder")}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {t("how_to_use_title")} {keywordLabel}
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-slate-300">
            <li>
              {t("how_to_use_step1")} <strong>{t("how_to_use_step2")}</strong>{" "}
              {t("how_to_use_step3")}
            </li>
            <li>{t("how_to_use_step4")}</li>
            <li>{t("how_to_use_step5")}</li>
          </ol>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{t("taxonomy_title")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedEffects.map((group) => (
              <article
                key={group.category}
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-4"
              >
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {CATEGORY_MAP[group.category] || group.category}
                </h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <strong>{item.name}</strong>: {item.description}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{t("use_cases_title")}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {useCaseItems.map((item) => (
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
            {boundaryItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {relatedTools.length > 0 && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t("related_tools_title")}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {relatedTools.map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className="rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 transition-all duration-300 hover:border-blue-500/40 hover:from-blue-500/15 hover:to-purple-500/15"
                >
                  <p className="text-sm font-semibold text-blue-200">{tool.label}</p>
                  {tool.description && (
                    <p className="mt-1 text-xs text-slate-300">{tool.description}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="mb-5 text-2xl font-bold text-white md:text-3xl">{t("faq_title")}</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
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
