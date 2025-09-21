import type { ConversionResult, Fraction } from "../types"
import {
  parseFractionalInput,
  findCommonEquivalents,
  convertDecimalToFraction,
} from "./fractionParser"

/**
 * Main conversion function: fraction to decimal
 */
export function convertFractionToDecimal(input: string, precision: number = 4): ConversionResult {
  const parsed = parseFractionalInput(input, precision)

  if (!parsed.isValid) {
    throw new Error(parsed.error || "Invalid input")
  }

  // Calculate decimal value
  const fractionDecimal = parsed.fraction ? parsed.fraction.decimal : 0
  const totalDecimal = parsed.wholeNumber + fractionDecimal

  // Format the result
  const formatted = formatDecimal(totalDecimal, precision)

  // Find common equivalent fractions
  const commonEquivalents = findCommonEquivalents(fractionDecimal)

  return {
    input: input.trim(),
    wholeNumber: parsed.wholeNumber,
    fraction: parsed.fraction,
    decimal: totalDecimal,
    formatted,
    commonEquivalents,
    timestamp: new Date(),
  }
}

/**
 * Reverse conversion: decimal to fraction
 */
export function convertDecimalToFractionResult(
  decimal: number,
  maxDenominator: number = 32
): ConversionResult {
  const wholeNumber = Math.floor(decimal)
  const fractionalPart = decimal - wholeNumber

  const fractionResult = convertDecimalToFraction(fractionalPart, maxDenominator)

  // Create fraction object if there's a fractional part
  let fraction: Fraction | null = null
  if (fractionResult.denominator > 1) {
    fraction = {
      numerator: fractionResult.numerator,
      denominator: fractionResult.denominator,
      simplified: null,
      decimal: fractionalPart,
    }
  }

  // Format the input representation
  let inputRepresentation: string
  if (wholeNumber > 0 && fraction) {
    inputRepresentation = `${wholeNumber} ${fraction.numerator}/${fraction.denominator}`
  } else if (fraction) {
    inputRepresentation = `${fraction.numerator}/${fraction.denominator}`
  } else {
    inputRepresentation = wholeNumber.toString()
  }

  return {
    input: decimal.toString(),
    wholeNumber,
    fraction,
    decimal,
    formatted: inputRepresentation,
    commonEquivalents: findCommonEquivalents(fractionalPart),
    timestamp: new Date(),
  }
}

/**
 * Format decimal number with specified precision
 */
export function formatDecimal(value: number, precision: number): string {
  if (precision === 0) {
    return Math.round(value).toString()
  }

  const fixed = value.toFixed(precision)
  // Remove trailing zeros after decimal point
  return fixed.replace(/\.?0+$/, "")
}

/**
 * Format fraction as string
 */
export function formatFraction(numerator: number, denominator: number): string {
  if (denominator === 1) {
    return numerator.toString()
  }

  const wholeNumber = Math.floor(numerator / denominator)
  const remainder = numerator % denominator

  if (wholeNumber > 0 && remainder > 0) {
    return `${wholeNumber} ${remainder}/${denominator}`
  } else if (remainder === 0) {
    return wholeNumber.toString()
  } else {
    return `${numerator}/${denominator}`
  }
}

/**
 * Get precision recommendation based on input
 */
export function getPrecisionRecommendation(input: string): number {
  // If input contains 32nds, recommend higher precision
  if (input.includes("/32")) return 5

  // If input contains 16ths, recommend medium precision
  if (input.includes("/16")) return 4

  // If input contains 8ths, recommend standard precision
  if (input.includes("/8")) return 3

  // Default precision for quarters and halves
  return 2
}

/**
 * Check if a fraction is commonly used in construction
 */
export function isCommonConstructionFraction(numerator: number, denominator: number): boolean {
  const commonDenominators = [2, 4, 8, 16, 32]
  return commonDenominators.includes(denominator)
}

/**
 * Generate ruler marks for visual display
 */
export function generateRulerMarks(
  maxValue: number = 6,
  increment: number = 0.0625
): Array<{
  position: number
  fraction: string
  decimal: number
  size: "major" | "minor" | "tiny"
}> {
  const marks = []

  for (let i = 0; i <= maxValue; i += increment) {
    const decimal = Math.round(i / increment) * increment

    // Determine mark size based on fraction
    let size: "major" | "minor" | "tiny" = "tiny"

    if (decimal % 1 === 0) {
      size = "major" // Whole numbers
    } else if (decimal % 0.5 === 0) {
      size = "major" // Half inches
    } else if (decimal % 0.25 === 0) {
      size = "minor" // Quarter inches
    } else if (decimal % 0.125 === 0) {
      size = "minor" // Eighth inches
    }

    // Convert to fraction representation
    const fractionResult = convertDecimalToFraction(decimal % 1, 32)
    const wholeNumber = Math.floor(decimal)

    let fractionStr: string
    if (wholeNumber > 0 && fractionResult.denominator > 1) {
      fractionStr = `${wholeNumber} ${fractionResult.numerator}/${fractionResult.denominator}`
    } else if (fractionResult.denominator > 1) {
      fractionStr = `${fractionResult.numerator}/${fractionResult.denominator}`
    } else {
      fractionStr = decimal.toString()
    }

    marks.push({
      position: decimal,
      fraction: fractionStr,
      decimal: decimal,
      size,
    })
  }

  return marks
}

/**
 * Calculate conversion accuracy score
 */
export function calculateAccuracyScore(original: number, converted: number): number {
  const difference = Math.abs(original - converted)
  const accuracy = Math.max(0, 1 - difference / Math.max(original, 1))
  return Math.round(accuracy * 100)
}
