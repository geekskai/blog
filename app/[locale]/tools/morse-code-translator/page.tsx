"use client"

import { Link } from "app/i18n/navigation"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  Home,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react"

type Mode = "encode" | "decode"

const MORSE_CODE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  " ": "/",
}

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([char, code]) => [code, char])
)

const DOT_DURATION = 80
const LAST_UPDATED = "2026-03-04"

const FAQ_ITEM_KEYS = [
  "faq_1",
  "faq_2",
  "faq_3",
  "faq_4",
  "faq_5",
  "faq_6",
  "faq_7",
  "faq_8",
  "faq_9",
  "faq_10",
  "faq_11",
  "faq_12",
] as const

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((char) => MORSE_CODE[char] ?? "")
    .filter((code) => code !== "")
    .join(" ")
}

function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((code) => REVERSE_MORSE[code] ?? "?")
        .join("")
    )
    .join(" ")
}

export default function MorseCodeGenerator() {
  const t = useTranslations("MorseCodeTranslator")
  const [mode, setMode] = useState<Mode>("encode")
  const [inputText, setInputText] = useState(t("defaults.input_text"))
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [activeSymbol, setActiveSymbol] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const stopRef = useRef(false)

  const outputText = useMemo(
    () => (mode === "encode" ? textToMorse(inputText) : morseToText(inputText)),
    [inputText, mode]
  )

  const playbackSource = useMemo(
    () => (mode === "encode" ? outputText : inputText),
    [mode, outputText, inputText]
  )

  const visibleSymbols = useMemo(() => outputText.split(""), [outputText])
  const signalTrack = useMemo(() => playbackSource.split(""), [playbackSource])

  const getAudioCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return null
      audioCtxRef.current = new AudioCtx()
    }
    return audioCtxRef.current
  }, [])

  const beep = useCallback((ctx: AudioContext, durationMs: number) => {
    return new Promise<void>((resolve) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 600
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000 - 0.01)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + durationMs / 1000)

      window.setTimeout(resolve, durationMs)
    })
  }, [])

  const silence = useCallback((durationMs: number) => {
    return new Promise<void>((resolve) => window.setTimeout(resolve, durationMs))
  }, [])

  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      stopRef.current = true
      setIsPlaying(false)
      setActiveSymbol(null)
      return
    }

    const morse = playbackSource
    if (!morse.trim()) return

    const ctx = audioEnabled ? getAudioCtx() : null
    if (audioEnabled && !ctx) return

    stopRef.current = false
    setIsPlaying(true)

    const symbols = morse.split("")
    for (let i = 0; i < symbols.length; i += 1) {
      if (stopRef.current) break
      const symbol = symbols[i]
      setActiveSymbol(i)

      if (symbol === ".") {
        if (audioEnabled && ctx) {
          await beep(ctx, DOT_DURATION)
        } else {
          await silence(DOT_DURATION)
        }
        await silence(DOT_DURATION)
      } else if (symbol === "-") {
        if (audioEnabled && ctx) {
          await beep(ctx, DOT_DURATION * 3)
        } else {
          await silence(DOT_DURATION * 3)
        }
        await silence(DOT_DURATION)
      } else if (symbol === " ") {
        setActiveSymbol(null)
        await silence(DOT_DURATION * 2)
      } else if (symbol === "/") {
        setActiveSymbol(null)
        await silence(DOT_DURATION * 4)
      } else {
        setActiveSymbol(null)
        await silence(DOT_DURATION)
      }
    }

    setIsPlaying(false)
    setActiveSymbol(null)
  }, [audioEnabled, beep, getAudioCtx, isPlaying, playbackSource, silence])

  const handleCopy = useCallback(async () => {
    if (!outputText) return
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }, [outputText])

  const placeholder = mode === "encode" ? t("placeholders.encode") : t("placeholders.decode")

  const faqItems = useMemo(
    () =>
      FAQ_ITEM_KEYS.map((key) => ({
        question: t(`${key}.question`),
        answer: t(`${key}.answer`),
      })),
    [t]
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center transition-colors hover:text-slate-200">
              <Home className="h-4 w-4" />
              <span className="ml-1">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="/tools" className="transition-colors hover:text-slate-200">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="font-medium text-slate-100">{t("breadcrumb.current")}</li>
        </ol>
      </nav>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">..-.</span>
            <h1 className="bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl">
              {t("header.title")}
            </h1>
          </div>
          <p className="mx-auto max-w-3xl text-lg text-slate-300">
            {t.rich("header.quick_answer", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
              blue: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
              cyan: (chunks) => <strong className="text-cyan-300">{chunks}</strong>,
              purple: (chunks) => <strong className="text-purple-300">{chunks}</strong>,
            })}
          </p>
        </header>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-cyan-900/20 to-purple-900/25 p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">{t("core_facts.title")}</h2>
          <dl className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-4">
              <dt className="mb-1 text-slate-300">{t("core_facts.pricing_label")}</dt>
              <dd className="text-white">
                {t.rich("core_facts.pricing_value", {
                  strong: (chunks) => <strong className="text-emerald-300">{chunks}</strong>,
                })}
              </dd>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-4">
              <dt className="mb-1 text-slate-300">{t("core_facts.features_label")}</dt>
              <dd className="text-white">
                {t.rich("core_facts.features_value", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </dd>
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-4">
              <dt className="mb-1 text-slate-300">{t("core_facts.positioning_label")}</dt>
              <dd className="text-white">{t("core_facts.positioning_value")}</dd>
            </div>
            <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-red-500/10 p-4">
              <dt className="mb-1 text-slate-300">{t("core_facts.users_label")}</dt>
              <dd className="text-white">{t("core_facts.users_value")}</dd>
            </div>
          </dl>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/25 via-blue-900/20 to-slate-900/20 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">{t("overview.title")}</h2>
          <p className="mb-5 text-slate-300">
            {t.rich("overview.description", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
              blue: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
              cyan: (chunks) => <strong className="text-cyan-300">{chunks}</strong>,
            })}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-5">
              <h3 className="mb-2 text-lg font-semibold text-blue-200">
                {t("overview.card_1_title")}
              </h3>
              <p className="text-slate-200">
                {t.rich("overview.card_1_desc", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-5">
              <h3 className="mb-2 text-lg font-semibold text-purple-200">
                {t("overview.card_2_title")}
              </h3>
              <p className="text-slate-200">{t("overview.card_2_desc")}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-5">
              <h3 className="mb-2 text-lg font-semibold text-emerald-200">
                {t("overview.card_3_title")}
              </h3>
              <p className="text-slate-200">{t("overview.card_3_desc")}</p>
            </div>
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-slate-900/20 to-indigo-900/25 p-8 shadow-2xl backdrop-blur-xl">
          <div>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setMode("encode")
                  setInputText(t("defaults.input_text"))
                }}
                className={`rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                  mode === "encode"
                    ? "border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-cyan-500/15 text-white shadow-lg shadow-blue-500/25"
                    : "to-white/2 border-white/20 bg-gradient-to-br from-white/5 text-slate-300 hover:border-blue-500/40"
                }`}
              >
                <div className="text-sm uppercase tracking-wider text-slate-400">
                  {t("tool.mode_label")}
                </div>
                <div className="text-lg font-semibold">{t("tool.mode_encode")}</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("decode")
                  setInputText(t("defaults.morse_sos"))
                }}
                className={`rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                  mode === "decode"
                    ? "border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-pink-500/15 text-white shadow-lg shadow-purple-500/25"
                    : "to-white/2 border-white/20 bg-gradient-to-br from-white/5 text-slate-300 hover:border-purple-500/40"
                }`}
              >
                <div className="text-sm uppercase tracking-wider text-slate-400">
                  {t("tool.mode_label")}
                </div>
                <div className="text-lg font-semibold">{t("tool.mode_decode")}</div>
              </button>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              {mode === "encode" ? t("tool.input_text_label") : t("tool.input_morse_label")}
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder={placeholder}
              className="mb-6 w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 font-mono text-base text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            />

            <div className="mb-3 text-sm uppercase tracking-wide text-slate-400">
              {mode === "encode" ? t("tool.output_morse") : t("tool.output_text")}
            </div>
            <div className="mb-6 min-h-24 rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-lg leading-8 text-yellow-300">
              {visibleSymbols.length > 0 ? (
                visibleSymbols.map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className={`inline-block transition-all duration-75 ${
                      isPlaying && activeSymbol === index
                        ? "scale-125 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                        : ""
                    }`}
                  >
                    {char}
                  </span>
                ))
              ) : (
                <span className="italic text-slate-500">{t("tool.output_placeholder")}</span>
              )}
            </div>

            <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="mb-2 text-xs uppercase tracking-wider text-amber-200/80">
                {isPlaying ? t("tool.signal_playing") : t("tool.signal_preview")}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {signalTrack.length > 0 ? (
                  signalTrack.map((symbol, index) => {
                    if (symbol === " " || symbol === "/") {
                      return (
                        <div
                          key={`gap-${index}`}
                          className={`${symbol === "/" ? "w-5" : "w-2"} h-5 rounded-sm border border-transparent`}
                        />
                      )
                    }

                    const isDash = symbol === "-"
                    const isActive = isPlaying && activeSymbol === index

                    return (
                      <div key={`${symbol}-${index}`} className="relative my-1">
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-amber-300/70 blur-md" />
                        )}
                        <div
                          className={`relative rounded-full border transition-all duration-75 ${
                            isDash ? "h-4 w-9" : "h-4 w-4"
                          } ${
                            isActive
                              ? isDash
                                ? "border-amber-100 bg-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.98)]"
                                : "animate-pulse border-amber-200 bg-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.95)]"
                              : "border-amber-500/30 bg-amber-500/25"
                          }`}
                        />
                      </div>
                    )
                  })
                ) : (
                  <span className="text-sm text-slate-500">{t("tool.no_signal")}</span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePlay}
                className={`flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-4 font-semibold text-white transition-all duration-300 ${
                  isPlaying
                    ? "bg-gradient-to-r from-red-600 via-red-500 to-orange-500 shadow-xl shadow-red-500/25"
                    : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-purple-500/30"
                }`}
              >
                <span className="relative flex items-center gap-2">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isPlaying
                    ? t("tool.stop_playback")
                    : audioEnabled
                      ? t("tool.play_audio_flash")
                      : t("tool.play_flash")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setAudioEnabled((prev) => !prev)}
                className={`rounded-2xl border px-4 py-4 font-semibold transition-all duration-300 ${
                  audioEnabled
                    ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-200 hover:shadow-lg hover:shadow-emerald-500/25"
                    : "border-slate-500/30 bg-gradient-to-br from-slate-500/15 to-slate-700/10 text-slate-200 hover:shadow-lg hover:shadow-slate-500/20"
                }`}
                title={audioEnabled ? t("tool.audio_title_on") : t("tool.audio_title_off")}
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  {audioEnabled ? t("tool.audio_on") : t("tool.flash_only")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 px-6 py-4 font-semibold text-cyan-200 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copied ? t("tool.copied") : t("tool.copy_output")}
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/70 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-6 text-3xl font-bold text-white">{t("how_to.title")}</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-5">
              <h3 className="mb-2 text-lg font-semibold text-blue-200">
                {t("how_to.step_1_title")}
              </h3>
              <p className="text-slate-200">{t("how_to.step_1_desc")}</p>
            </li>
            <li className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-5">
              <h3 className="mb-2 text-lg font-semibold text-purple-200">
                {t("how_to.step_2_title")}
              </h3>
              <p className="text-slate-200">{t("how_to.step_2_desc")}</p>
            </li>
            <li className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-5">
              <h3 className="mb-2 text-lg font-semibold text-emerald-200">
                {t("how_to.step_3_title")}
              </h3>
              <p className="text-slate-200">{t("how_to.step_3_desc")}</p>
            </li>
          </ol>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-orange-900/20 via-red-900/15 to-slate-900/20 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">{t("boundaries.title")}</h2>
          <ul className="space-y-3 text-slate-300">
            <li>
              {t.rich("boundaries.can_do", {
                strong: (chunks) => <strong className="text-orange-300">{chunks}</strong>,
              })}
            </li>
            <li>
              {t.rich("boundaries.cannot_do", {
                strong: (chunks) => <strong className="text-orange-300">{chunks}</strong>,
              })}
            </li>
            <li>
              {t.rich("boundaries.input_scope", {
                strong: (chunks) => <strong className="text-orange-300">{chunks}</strong>,
              })}
            </li>
          </ul>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-rose-900/20 via-red-900/15 to-slate-900/20 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">{t("sos.title")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/15 to-pink-500/10 p-5">
              <div className="mb-2 text-sm uppercase tracking-wider text-rose-200">
                {t("sos.text_label")}
              </div>
              <div className="text-3xl font-black text-white">SOS</div>
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-orange-500/10 p-5">
              <div className="mb-2 text-sm uppercase tracking-wider text-red-200">
                {t("sos.morse_label")}
              </div>
              <div className="font-mono text-3xl font-black text-amber-200">... --- ...</div>
            </div>
            <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-5">
              <div className="mb-2 text-sm uppercase tracking-wider text-orange-200">
                {t("sos.use_case_label")}
              </div>
              <p className="text-slate-200">{t("sos.use_case_desc")}</p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/85 to-slate-800/75 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">{t("history.title")}</h2>
          <p className="text-slate-300">
            {t.rich("history.description", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
              amber: (chunks) => <strong className="text-amber-300">{chunks}</strong>,
            })}
          </p>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-900/20 via-blue-900/15 to-slate-900/20 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">{t("guide.title")}</h2>
          <p className="mb-4 text-slate-300">
            {t.rich("guide.p1", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
              cyan: (chunks) => <strong className="text-cyan-300">{chunks}</strong>,
              blue: (chunks) => <strong className="text-blue-300">{chunks}</strong>,
            })}
          </p>
          <p className="mb-4 text-slate-300">
            {t.rich("guide.p2", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
          </p>
          <p className="mb-4 text-slate-300">
            {t.rich("guide.p3", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
              rose: (chunks) => <strong className="text-rose-300">{chunks}</strong>,
            })}
          </p>
          <p className="mb-6 text-slate-300">
            {t.rich("guide.p4", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { label: t("guide.quick_a"), value: ".-" },
              { label: t("guide.quick_b"), value: "-..." },
              { label: t("guide.quick_c"), value: "-.-." },
              { label: t("guide.quick_e"), value: "." },
              { label: t("guide.quick_s"), value: "..." },
              { label: t("guide.quick_o"), value: "---" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-4"
              >
                <div className="mb-1 text-sm text-cyan-200">{item.label}</div>
                <div className="font-mono text-2xl font-bold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/70 p-8 shadow-2xl backdrop-blur-xl">
          <details>
            <summary className="cursor-pointer text-lg font-semibold text-white">
              {t("alphabet_chart.title")}
            </summary>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(MORSE_CODE)
                .filter(([char]) => char !== " ")
                .map(([char, code]) => (
                  <div
                    key={char}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono"
                  >
                    <span className="font-bold text-yellow-300">{char}</span>
                    <span className="text-slate-300">{code}</span>
                  </div>
                ))}
            </div>
          </details>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/25 via-purple-900/20 to-slate-900/20 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <CircleHelp className="h-6 w-6 text-indigo-300" />
            <h2 className="text-3xl font-bold text-white">{t("faq.title")}</h2>
          </div>
          <div className="space-y-5">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="border-b border-white/10 pb-5 last:border-b-0"
              >
                <h3 className="mb-2 text-lg font-semibold text-indigo-200">{item.question}</h3>
                <p className="text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">{t("sources.title")}</h2>
          <ul className="mb-5 space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <Volume2 className="mt-1 h-4 w-4 text-cyan-300" />
              <span>
                {t.rich("sources.item_1", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Volume2 className="mt-1 h-4 w-4 text-cyan-300" />
              <span>
                {t.rich("sources.item_2", {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </span>
            </li>
          </ul>
          <p className="text-sm text-slate-400">
            {t.rich("sources.last_updated", {
              strong: (chunks) => <strong className="text-slate-200">{chunks}</strong>,
              date: LAST_UPDATED,
            })}
          </p>
        </section>

        <section className="sr-only" aria-hidden="true">
          <h2>{t("hidden_seo.title")}</h2>
          <p>{t("hidden_seo.description")}</p>
        </section>
      </main>
    </div>
  )
}
