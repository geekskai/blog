export type EffectCategory =
  | "Enclosed Alphanumerics"
  | "Mathematical Styles"
  | "Combining Marks"
  | "Transformation"
  | "Width"

export interface TextEffect {
  id: string
  name: string
  category: EffectCategory
  description: string
  apply: (text: string) => string
}

export const transformText = (
  text: string,
  map: Record<string, string>,
  reverse = false
): string => {
  const chars = Array.from(text).map((char) => map[char] ?? char)
  return reverse ? chars.reverse().join("") : chars.join("")
}

const mapAsciiLetters = (
  upperStart: number,
  lowerStart: number,
  digitStart?: number
): Record<string, string> => {
  const result: Record<string, string> = {}

  for (let i = 0; i < 26; i++) {
    result[String.fromCharCode(65 + i)] = String.fromCodePoint(upperStart + i)
    result[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerStart + i)
  }

  if (digitStart !== undefined) {
    for (let i = 0; i < 10; i++) {
      result[String(i)] = String.fromCodePoint(digitStart + i)
    }
  }

  return result
}

const mergeMaps = (...maps: Array<Record<string, string>>): Record<string, string> =>
  Object.assign({}, ...maps)

const combineMark = (text: string, mark: string): string =>
  Array.from(text)
    .map((char) => (char.trim() ? `${char}${mark}` : char))
    .join("")

const combineLightning = (text: string): string => {
  const chars = Array.from(text)
  return chars
    .map((char, index) => {
      if (!char.trim()) return char
      return index < chars.length - 1 ? `${char}⚡︎` : char
    })
    .join("")
}

const combineZalgo = (text: string): string => {
  const up = ["\u030d", "\u030e", "\u0304", "\u0305", "\u033f"]
  const mid = ["\u0334", "\u0335", "\u0336"]
  const down = ["\u0316", "\u0317", "\u0318", "\u0319", "\u0324"]

  return Array.from(text)
    .map((char) => {
      if (!char.trim()) return char
      return `${char}${up[0]}${mid[0]}${down[0]}`
    })
    .join("")
}

const combineCursed = (text: string): string => {
  const up = ["\u030d", "\u030e", "\u0304", "\u0305", "\u033f", "\u0311", "\u0302"]
  const mid = ["\u0334", "\u0335", "\u0336", "\u034f"]
  const down = ["\u0316", "\u0317", "\u0318", "\u0319", "\u0324", "\u0329", "\u033a"]

  return Array.from(text)
    .map((char, index) => {
      if (!char.trim()) return char
      // Deterministic intensity pattern for stable copy/paste output.
      const upMark = up[index % up.length]
      const midMark = mid[(index + 1) % mid.length]
      const downMark = down[(index + 2) % down.length]
      const accent = index % 3 === 0 ? "͠" : index % 3 === 1 ? "̷" : "̸"
      return `${char}${upMark}${midMark}${downMark}${accent}`
    })
    .join("")
}

const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "ן",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  A: "∀",
  C: "Ɔ",
  E: "Ǝ",
  F: "Ⅎ",
  G: "פ",
  H: "H",
  I: "I",
  J: "ſ",
  L: "˥",
  M: "W",
  N: "N",
  P: "Ԁ",
  T: "┴",
  U: "∩",
  V: "Λ",
  Y: "⅄",
  1: "Ɩ",
  2: "ᄅ",
  3: "Ɛ",
  4: "ㄣ",
  5: "ϛ",
  6: "9",
  7: "ㄥ",
  8: "8",
  9: "6",
  0: "0",
  ".": "˙",
  ",": "'",
  "'": ",",
  '"': ",,",
  "`": ",",
  "?": "¿",
  "!": "¡",
  "[": "]",
  "]": "[",
  "(": ")",
  ")": "(",
  "{": "}",
  "}": "{",
  "<": ">",
  ">": "<",
  "&": "⅋",
  _: "‾",
}

const MIRROR_MAP: Record<string, string> = {
  a: "ɒ",
  b: "d",
  c: "ɔ",
  d: "b",
  e: "ɘ",
  f: "ꟻ",
  g: "ǫ",
  h: "ʜ",
  i: "i",
  j: "ꞁ",
  k: "ʞ",
  l: "|",
  m: "m",
  n: "n",
  o: "o",
  p: "q",
  q: "p",
  r: "ɿ",
  s: "ꙅ",
  t: "ƚ",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",
  A: "A",
  B: "ᙠ",
  C: "Ↄ",
  D: "◖",
  E: "Ǝ",
  F: "ꟻ",
  G: "Ꭾ",
  H: "H",
  I: "I",
  J: "Ⴑ",
  K: "⋊",
  L: "⅃",
  M: "M",
  N: "И",
  O: "O",
  P: "ꟼ",
  Q: "Ọ",
  R: "Я",
  S: "S",
  T: "T",
  U: "U",
  V: "V",
  W: "W",
  X: "X",
  Y: "Y",
  Z: "Z",
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
  "<": ">",
  ">": "<",
  "/": "\\",
  "\\": "/",
}

const CIRCLED_MAP = mergeMaps(mapAsciiLetters(0x24b6, 0x24d0), {
  "0": "⓪",
  "1": "①",
  "2": "②",
  "3": "③",
  "4": "④",
  "5": "⑤",
  "6": "⑥",
  "7": "⑦",
  "8": "⑧",
  "9": "⑨",
})

const NEGATIVE_CIRCLED_MAP = mergeMaps(mapAsciiLetters(0x1f150, 0x24d0), {
  "1": "❶",
  "2": "❷",
  "3": "❸",
  "4": "❹",
  "5": "❺",
  "6": "❻",
  "7": "❼",
  "8": "❽",
  "9": "❾",
  "0": "⓿",
})

const SQUARED_HOLLOW_MAP = mapAsciiLetters(0x1f130, 0x24d0)
const SQUARED_SOLID_MAP = mapAsciiLetters(0x1f170, 0x24d0)

const SERIF_BOLD_MAP = mapAsciiLetters(0x1d400, 0x1d41a, 0x1d7ce)
const SANS_BOLD_MAP = mapAsciiLetters(0x1d5d4, 0x1d5ee, 0x1d7ec)
const MATH_ITALIC_MAP = mapAsciiLetters(0x1d434, 0x1d44e)
const BOLD_ITALIC_MAP = mapAsciiLetters(0x1d468, 0x1d482)
const SCRIPT_MAP = mergeMaps(mapAsciiLetters(0x1d49c, 0x1d4b6), {
  B: "ℬ",
  E: "ℰ",
  F: "ℱ",
  H: "ℋ",
  I: "ℐ",
  L: "ℒ",
  M: "ℳ",
  R: "ℛ",
  e: "ℯ",
  g: "ℊ",
  o: "ℴ",
})
const BOLD_SCRIPT_MAP = mapAsciiLetters(0x1d4d0, 0x1d4ea)
const FRAKTUR_MAP = mergeMaps(mapAsciiLetters(0x1d504, 0x1d51e), {
  C: "ℭ",
  H: "ℌ",
  I: "ℑ",
  R: "ℜ",
  Z: "ℨ",
})
const BOLD_FRAKTUR_MAP = mapAsciiLetters(0x1d56c, 0x1d586)
const DOUBLE_STRUCK_MAP = mergeMaps(mapAsciiLetters(0x1d538, 0x1d552, 0x1d7d8), {
  C: "ℂ",
  H: "ℍ",
  N: "ℕ",
  P: "ℙ",
  Q: "ℚ",
  R: "ℝ",
  Z: "ℤ",
})

const fullwidth = (text: string): string =>
  Array.from(text)
    .map((char) => {
      if (char === " ") return "　"
      const cp = char.codePointAt(0)
      if (!cp) return char
      if (cp >= 33 && cp <= 126) return String.fromCodePoint(cp + 0xfee0)
      return char
    })
    .join("")

export const PRESET_EFFECTS: TextEffect[] = [
  {
    id: "plain",
    name: "Plain",
    category: "Transformation",
    description: "Original text with no transformation",
    apply: (text) => text,
  },
  {
    id: "negative-circle",
    name: "Solid Circle",
    category: "Enclosed Alphanumerics",
    description: "Negative circled digits and enclosed letters",
    apply: (text) => transformText(text, NEGATIVE_CIRCLED_MAP),
  },
  {
    id: "hollow-circle",
    name: "Hollow Circle",
    category: "Enclosed Alphanumerics",
    description: "Circled alphanumeric style",
    apply: (text) => transformText(text, CIRCLED_MAP),
  },
  {
    id: "hollow-square",
    name: "Hollow Square",
    category: "Enclosed Alphanumerics",
    description: "Outlined square enclosure style",
    apply: (text) => transformText(text, SQUARED_HOLLOW_MAP),
  },
  {
    id: "solid-square",
    name: "Solid Square",
    category: "Enclosed Alphanumerics",
    description: "Negative square enclosure style",
    apply: (text) => transformText(text, SQUARED_SOLID_MAP),
  },
  {
    id: "serif-bold",
    name: "Serif Bold",
    category: "Mathematical Styles",
    description: "Mathematical bold serif characters",
    apply: (text) => transformText(text, SERIF_BOLD_MAP),
  },
  {
    id: "sans-bold",
    name: "Sans Bold",
    category: "Mathematical Styles",
    description: "Mathematical bold sans-serif characters",
    apply: (text) => transformText(text, SANS_BOLD_MAP),
  },
  {
    id: "italic",
    name: "Math Italic",
    category: "Mathematical Styles",
    description: "Mathematical italic characters",
    apply: (text) => transformText(text, MATH_ITALIC_MAP),
  },
  {
    id: "bold-italic",
    name: "Bold Italic",
    category: "Mathematical Styles",
    description: "Mathematical bold italic characters",
    apply: (text) => transformText(text, BOLD_ITALIC_MAP),
  },
  {
    id: "script",
    name: "Script",
    category: "Mathematical Styles",
    description: "Handwritten script-like characters",
    apply: (text) => transformText(text, SCRIPT_MAP),
  },
  {
    id: "bold-script",
    name: "Bold Script",
    category: "Mathematical Styles",
    description: "Bold handwritten script characters",
    apply: (text) => transformText(text, BOLD_SCRIPT_MAP),
  },
  {
    id: "fraktur",
    name: "Fraktur",
    category: "Mathematical Styles",
    description: "Gothic-style Fraktur characters",
    apply: (text) => transformText(text, FRAKTUR_MAP),
  },
  {
    id: "bold-fraktur",
    name: "Bold Fraktur",
    category: "Mathematical Styles",
    description: "Bold gothic Fraktur characters",
    apply: (text) => transformText(text, BOLD_FRAKTUR_MAP),
  },
  {
    id: "double-struck",
    name: "Double Struck",
    category: "Mathematical Styles",
    description: "Blackboard bold character style",
    apply: (text) => transformText(text, DOUBLE_STRUCK_MAP),
  },
  {
    id: "strikethrough",
    name: "Strikethrough",
    category: "Combining Marks",
    description: "Cross-out style using combining overlay",
    apply: (text) => combineMark(text, "\u0336"),
  },
  {
    id: "wavy-underline",
    name: "Wavy Underline",
    category: "Combining Marks",
    description: "Decorative wave underline style",
    apply: (text) => combineMark(text, "\u0330"),
  },
  {
    id: "tail-mark",
    name: "Tail Mark",
    category: "Combining Marks",
    description: "Adds a small hook-like mark to each character",
    apply: (text) => combineMark(text, "\u0321"),
  },
  {
    id: "lightning",
    name: "Lightning",
    category: "Combining Marks",
    description: "Inserts lightning separators between characters",
    apply: (text) => combineLightning(text),
  },
  {
    id: "zalgo",
    name: "Zalgo",
    category: "Combining Marks",
    description: "Stacked marks for glitchy zalgo style",
    apply: (text) => combineZalgo(text),
  },
  {
    id: "cursed-chaos",
    name: "Cursed Chaos",
    category: "Combining Marks",
    description: "High-intensity corrupted text effect with layered marks",
    apply: (text) => combineCursed(text),
  },
  {
    id: "upside-down",
    name: "Upside Down",
    category: "Transformation",
    description: "Flips letters and reverses order",
    apply: (text) => transformText(text, UPSIDE_DOWN_MAP, true),
  },
  {
    id: "mirror",
    name: "Mirror",
    category: "Transformation",
    description: "Mirrors letters and reverses order",
    apply: (text) => transformText(text, MIRROR_MAP, true),
  },
  {
    id: "fullwidth",
    name: "Fullwidth (Vaporwave)",
    category: "Width",
    description: "Converts ASCII to fullwidth forms",
    apply: (text) => fullwidth(text),
  },
]

export const BASE_STYLE_IDS = PRESET_EFFECTS.filter((effect) =>
  ["Enclosed Alphanumerics", "Mathematical Styles", "Width"].includes(effect.category)
).map((effect) => effect.id)

export const DECORATION_IDS = PRESET_EFFECTS.filter(
  (effect) => effect.category === "Combining Marks"
).map((effect) => effect.id)

export const TRANSFORMATION_IDS = PRESET_EFFECTS.filter(
  (effect) => effect.category === "Transformation" && effect.id !== "plain"
).map((effect) => effect.id)

export const getEffectById = (id: string): TextEffect | undefined =>
  PRESET_EFFECTS.find((effect) => effect.id === id)

export const applyEmojiWrap = (text: string, emoji: string): string =>
  text.trim() ? `${emoji} ${text} ${emoji}` : text
