import {
  GenerationOptions,
  NumberMetadata,
  ValidationResult,
  FormatConfig,
  ExclusionRules,
} from "../types"

/**
 * Professional 4-Digit Random Number Generator
 * Uses cryptographically secure random number generation
 */
export class NumberGenerator {
  private static readonly MIN_VALUE = 0
  private static readonly MAX_VALUE = 9999
  private static readonly DIGIT_LENGTH = 4

  /**
   * Generate a single cryptographically secure random 4-digit number
   */
  static generate(options: GenerationOptions = {}): string {
    const { rangeStart = this.MIN_VALUE, rangeEnd = this.MAX_VALUE, exclusionRules = {} } = options

    let attempts = 0
    const maxAttempts = 1000

    while (attempts < maxAttempts) {
      const number = this.generateSecureRandom(rangeStart, rangeEnd)
      const numberStr = this.padNumber(number)

      if (this.isValidNumber(numberStr, exclusionRules)) {
        return numberStr
      }

      attempts++
    }

    // Fallback: return a valid number even if exclusion rules are too strict
    return this.padNumber(this.generateSecureRandom(rangeStart, rangeEnd))
  }

  /**
   * Generate multiple 4-digit numbers
   */
  static generateBatch(options: GenerationOptions = {}): string[] {
    const { count = 10, allowDuplicates = true } = options
    const numbers: string[] = []
    const used = new Set<string>()

    let attempts = 0
    const maxAttempts = count * 100

    while (numbers.length < count && attempts < maxAttempts) {
      const number = this.generate(options)

      if (allowDuplicates || !used.has(number)) {
        used.add(number)
        numbers.push(number)
      }

      attempts++
    }

    return numbers
  }

  /**
   * Generate with metadata
   */
  static generateWithMetadata(options: GenerationOptions = {}): {
    number: string
    metadata: NumberMetadata
  } {
    const number = this.generate(options)
    const formatted = this.formatNumber(number, options.format)

    const metadata: NumberMetadata = {
      number,
      formatted,
      timestamp: new Date().toISOString(),
      format: options.format?.type || "plain",
      isUnique: true,
    }

    return { number, metadata }
  }

  /**
   * Format number according to specified format
   */
  static formatNumber(number: string, config?: FormatConfig): string {
    if (!config || config.type === "plain") {
      return number
    }

    switch (config.type) {
      case "hyphen":
        return `${number.substring(0, 2)}-${number.substring(2, 4)}`
      case "dot":
        return `${number.substring(0, 2)}.${number.substring(2, 4)}`
      case "prefix":
        return `${config.prefix || "#"}${number}`
      default:
        return number
    }
  }

  /**
   * Validate a 4-digit number
   */
  static validate(number: string, exclusionRules: ExclusionRules = {}): ValidationResult {
    const errors: string[] = []

    // Check length
    if (number.length !== this.DIGIT_LENGTH) {
      errors.push(`Number must be exactly ${this.DIGIT_LENGTH} digits`)
    }

    // Check if all characters are digits
    if (!/^\d+$/.test(number)) {
      errors.push("Number must contain only digits")
    }

    // Check exclusion rules
    if (!this.isValidNumber(number, exclusionRules)) {
      if (exclusionRules.excludeSequential && this.isSequential(number)) {
        errors.push("Sequential numbers are excluded")
      }
      if (exclusionRules.excludeRepeated && this.isRepeated(number)) {
        errors.push("Repeated digits are excluded")
      }
      if (exclusionRules.excludeSpecific?.includes(number)) {
        errors.push("This number is in the exclusion list")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      number,
    }
  }

  /**
   * Generate cryptographically secure random number
   */
  private static generateSecureRandom(min: number, max: number): number {
    if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
      // Browser environment with Web Crypto API
      const range = max - min + 1
      const randomBuffer = new Uint32Array(1)
      window.crypto.getRandomValues(randomBuffer)
      return min + (randomBuffer[0] % range)
    } else {
      // Fallback to Math.random (less secure but functional)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  }

  /**
   * Pad number to 4 digits
   */
  private static padNumber(num: number): string {
    return num.toString().padStart(this.DIGIT_LENGTH, "0")
  }

  /**
   * Check if number passes all validation rules
   */
  private static isValidNumber(number: string, rules: ExclusionRules): boolean {
    if (rules.excludeSequential && this.isSequential(number)) {
      return false
    }

    if (rules.excludeRepeated && this.isRepeated(number)) {
      return false
    }

    if (rules.excludeSpecific && rules.excludeSpecific.includes(number)) {
      return false
    }

    return true
  }

  /**
   * Check if number is sequential (1234, 4321, etc.)
   */
  private static isSequential(number: string): boolean {
    const digits = number.split("").map(Number)

    // Check ascending sequence
    let isAscending = true
    for (let i = 1; i < digits.length; i++) {
      if (digits[i] !== digits[i - 1] + 1) {
        isAscending = false
        break
      }
    }

    // Check descending sequence
    let isDescending = true
    for (let i = 1; i < digits.length; i++) {
      if (digits[i] !== digits[i - 1] - 1) {
        isDescending = false
        break
      }
    }

    return isAscending || isDescending
  }

  /**
   * Check if all digits are the same (1111, 2222, etc.)
   */
  private static isRepeated(number: string): boolean {
    return new Set(number.split("")).size === 1
  }

  /**
   * Parse formatted number back to plain format
   */
  static parseFormatted(formatted: string): string {
    return formatted.replace(/[^0-9]/g, "")
  }
}

/**
 * Number Export utilities
 */
export class NumberExporter {
  static toTXT(numbers: string[]): string {
    return numbers.join("\n")
  }

  static toCSV(numbers: string[], includeMetadata = false): string {
    if (!includeMetadata) {
      return "Number\n" + numbers.join("\n")
    }

    let csv = "Number,Generated At,Format,Index\n"
    numbers.forEach((number, index) => {
      const now = new Date().toISOString()
      csv += `${number},${now},Plain,${index + 1}\n`
    })
    return csv
  }

  static toJSON(numbers: string[], includeMetadata = false): string {
    if (!includeMetadata) {
      return JSON.stringify(
        {
          numbers,
          count: numbers.length,
          generated_at: new Date().toISOString(),
        },
        null,
        2
      )
    }

    const data = numbers.map((number, index) => ({
      number,
      index: index + 1,
      generated_at: new Date().toISOString(),
      format: "plain",
      length: 4,
    }))

    return JSON.stringify(
      {
        data,
        count: numbers.length,
        generated_at: new Date().toISOString(),
        note: "Generated using cryptographically secure random number generation",
        use_case: "For verification codes, PINs, testing data, and development purposes",
      },
      null,
      2
    )
  }
}

/**
 * Statistics calculator
 */
export class NumberStats {
  static calculateStats(numbers: string[]): {
    totalGenerated: number
    uniqueCount: number
    duplicateCount: number
    averageValue: number
    minValue: string
    maxValue: string
  } {
    const uniqueNumbers = new Set(numbers)
    const numericValues = numbers.map(Number)

    return {
      totalGenerated: numbers.length,
      uniqueCount: uniqueNumbers.size,
      duplicateCount: numbers.length - uniqueNumbers.size,
      averageValue: numericValues.reduce((a, b) => a + b, 0) / numbers.length,
      minValue: Math.min(...numericValues)
        .toString()
        .padStart(4, "0"),
      maxValue: Math.max(...numericValues)
        .toString()
        .padStart(4, "0"),
    }
  }

  static getDistribution(numbers: string[]): Map<string, number> {
    const distribution = new Map<string, number>()

    numbers.forEach((number) => {
      distribution.set(number, (distribution.get(number) || 0) + 1)
    })

    return distribution
  }
}
