import type { ScientificNotation, AtomicScaleExample } from "../types"

/**
 * 科学记数法处理工具
 */

/**
 * 将数字转换为科学记数法对象
 */
export function createScientificNotation(value: number): ScientificNotation {
  if (value === 0) {
    return {
      coefficient: 0,
      exponent: 0,
      formatted: "0",
    }
  }

  const exponent = Math.floor(Math.log10(Math.abs(value)))
  const coefficient = value / Math.pow(10, exponent)

  return {
    coefficient: Math.round(coefficient * 100) / 100, // Round to 2 decimal places
    exponent,
    formatted: formatScientificNotation(coefficient, exponent),
  }
}

/**
 * 格式化科学记数法显示
 */
export function formatScientificNotation(coefficient: number, exponent: number): string {
  return `${coefficient.toFixed(2)} × 10${formatSuperscript(exponent)}`
}

/**
 * 将数字转换为上标格式
 */
export function formatSuperscript(num: number): string {
  const superscriptMap: { [key: string]: string } = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "-": "⁻",
    "+": "⁺",
  }

  return num
    .toString()
    .split("")
    .map((char) => superscriptMap[char] || char)
    .join("")
}

/**
 * 原子尺度示例数据
 */
export const ATOMIC_SCALE_EXAMPLES: AtomicScaleExample[] = [
  {
    name: "Hydrogen Atom Radius",
    size: 53, // Bohr radius ≈ 53 pm
    description: "The smallest atom in the periodic table",
    category: "atom",
  },
  {
    name: "Carbon Atom Radius",
    size: 70,
    description: "Essential element for organic chemistry",
    category: "atom",
  },
  {
    name: "Oxygen Atom Radius",
    size: 60,
    description: "Vital for respiration and combustion",
    category: "atom",
  },
  {
    name: "Carbon-Carbon Bond",
    size: 154,
    description: "Single bond length in organic molecules",
    category: "bond",
  },
  {
    name: "Carbon-Oxygen Bond",
    size: 143,
    description: "Common bond in organic compounds",
    category: "bond",
  },
  {
    name: "Hydrogen Bond",
    size: 200,
    description: "Weak intermolecular interaction",
    category: "bond",
  },
  {
    name: "Water Molecule",
    size: 280,
    description: "H₂O molecular diameter",
    category: "molecule",
  },
  {
    name: "Glucose Molecule",
    size: 900,
    description: "C₆H₁₂O₆ sugar molecule",
    category: "molecule",
  },
  {
    name: "DNA Double Helix Width",
    size: 2000,
    description: "Width of the DNA double helix structure",
    category: "structure",
  },
  {
    name: "Protein Alpha Helix",
    size: 1200,
    description: "Diameter of protein secondary structure",
    category: "structure",
  },
]

/**
 * 根据尺寸范围获取相关的原子尺度示例
 */
export function getRelevantAtomicExamples(
  sizeInPm: number,
  tolerance: number = 0.5
): AtomicScaleExample[] {
  const logSize = Math.log10(sizeInPm)

  return ATOMIC_SCALE_EXAMPLES.filter((example) => {
    const logExample = Math.log10(example.size)
    return Math.abs(logSize - logExample) <= tolerance
  }).sort((a, b) => Math.abs(a.size - sizeInPm) - Math.abs(b.size - sizeInPm))
}

/**
 * 获取按类别分组的原子尺度示例
 */
export function getAtomicExamplesByCategory(): Record<string, AtomicScaleExample[]> {
  return ATOMIC_SCALE_EXAMPLES.reduce(
    (acc, example) => {
      if (!acc[example.category]) {
        acc[example.category] = []
      }
      acc[example.category].push(example)
      return acc
    },
    {} as Record<string, AtomicScaleExample[]>
  )
}

/**
 * 生成尺度比较文本
 */
export function generateScaleComparison(cmValue: number, pmValue: number): string {
  const relevantExamples = getRelevantAtomicExamples(pmValue, 1.0)

  if (relevantExamples.length === 0) {
    return `${pmValue.toExponential(2)} picometers is at the atomic scale`
  }

  const closest = relevantExamples[0]
  const ratio = pmValue / closest.size

  if (ratio > 1.5) {
    return `About ${ratio.toFixed(1)}× larger than ${closest.name.toLowerCase()}`
  } else if (ratio < 0.67) {
    return `About ${(1 / ratio).toFixed(1)}× smaller than ${closest.name.toLowerCase()}`
  } else {
    return `Similar size to ${closest.name.toLowerCase()}`
  }
}

/**
 * 验证科学记数法输入
 */
export function validateScientificInput(input: string): {
  isValid: boolean
  value?: number
  error?: string
} {
  // Remove spaces and normalize
  const normalized = input.replace(/\s+/g, "").toLowerCase()

  // Try to match scientific notation patterns
  const patterns = [
    /^([+-]?\d*\.?\d+)[×x*]10\^?([+-]?\d+)$/,
    /^([+-]?\d*\.?\d+)e([+-]?\d+)$/,
    /^([+-]?\d*\.?\d+)$/,
  ]

  for (const pattern of patterns) {
    const match = normalized.match(pattern)
    if (match) {
      try {
        let value: number
        if (match.length === 3) {
          // Scientific notation
          const coefficient = parseFloat(match[1])
          const exponent = parseInt(match[2])
          value = coefficient * Math.pow(10, exponent)
        } else {
          // Regular number
          value = parseFloat(match[1])
        }

        if (isNaN(value) || !isFinite(value)) {
          return { isValid: false, error: "Invalid number format" }
        }

        return { isValid: true, value }
      } catch (error) {
        continue
      }
    }
  }

  return { isValid: false, error: "Unrecognized number format" }
}
