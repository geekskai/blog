import { SSNGenerationOptions, SSNMetadata, SSNValidationResult } from "../types"

/**
 * Professional SSN Generator Class
 * Generates valid format Social Security Numbers for testing and development
 */
export class SSNGenerator {
  // Forbidden area numbers (first 3 digits)
  private static readonly FORBIDDEN_AREAS = ["000", "666"]

  // Forbidden area ranges (900-999 reserved for future use)
  private static readonly FORBIDDEN_RANGES = [{ start: 900, end: 999 }]

  /**
   * Generate a single random SSN
   */
  static generate(): string {
    const area = this.generateAreaCode()
    const group = this.generateGroupCode()
    const serial = this.generateSerialCode()

    return `${area}-${group}-${serial}`
  }

  /**
   * Generate multiple SSNs
   */
  static generateBatch(options: SSNGenerationOptions = {}): string[] {
    const { count = 10 } = options
    const ssns: string[] = []
    const used = new Set<string>()

    while (ssns.length < count) {
      const ssn = this.generate()
      if (!used.has(ssn)) {
        used.add(ssn)
        ssns.push(ssn)
      }
    }

    return ssns
  }

  /**
   * Generate SSN with metadata
   */
  static generateWithMetadata(): { ssn: string; metadata: SSNMetadata } {
    const area = this.generateAreaCode()
    const group = this.generateGroupCode()
    const serial = this.generateSerialCode()
    const ssn = `${area}-${group}-${serial}`

    const metadata: SSNMetadata = {
      areaNumber: area,
      groupNumber: group,
      serialNumber: serial,
      isValid: true,
      generatedAt: new Date().toISOString(),
    }

    return { ssn, metadata }
  }

  /**
   * Validate SSN format
   */
  static validate(ssn: string): SSNValidationResult {
    const errors: string[] = []

    // Remove any formatting
    const cleanSSN = ssn.replace(/[-\s]/g, "")

    // Check length
    if (cleanSSN.length !== 9) {
      errors.push("SSN must be exactly 9 digits")
    }

    // Check if all characters are digits
    if (!/^\d{9}$/.test(cleanSSN)) {
      errors.push("SSN must contain only digits")
    }

    // Extract parts
    const area = cleanSSN.substring(0, 3)
    const group = cleanSSN.substring(3, 5)
    const serial = cleanSSN.substring(5, 9)

    // Validate area number
    if (this.FORBIDDEN_AREAS.includes(area)) {
      errors.push(`Area number ${area} is not valid`)
    }

    const areaNum = parseInt(area)
    if (this.FORBIDDEN_RANGES.some((range) => areaNum >= range.start && areaNum <= range.end)) {
      errors.push(`Area number ${area} is reserved`)
    }

    // Validate group number
    if (group === "00") {
      errors.push("Group number cannot be 00")
    }

    // Validate serial number
    if (serial === "0000") {
      errors.push("Serial number cannot be 0000")
    }

    return {
      isValid: errors.length === 0,
      errors,
      structure: {
        area,
        group,
        serial,
      },
    }
  }

  /**
   * Format SSN with proper formatting
   */
  static format(ssn: string): string {
    const clean = ssn.replace(/[-\s]/g, "")
    if (clean.length !== 9) {
      return ssn
    }
    return `${clean.substring(0, 3)}-${clean.substring(3, 5)}-${clean.substring(5, 9)}`
  }

  /**
   * Generate area code (first 3 digits)
   */
  private static generateAreaCode(): string {
    let area: string
    do {
      // Generate random 3-digit area code (001-899, excluding forbidden)
      area = String(Math.floor(Math.random() * 899) + 1).padStart(3, "0")
    } while (
      this.FORBIDDEN_AREAS.includes(area) ||
      this.FORBIDDEN_RANGES.some((range) => {
        const areaNum = parseInt(area)
        return areaNum >= range.start && areaNum <= range.end
      })
    )
    return area
  }

  /**
   * Generate group code (middle 2 digits)
   */
  private static generateGroupCode(): string {
    // Group code: 01-99 (cannot be 00)
    return String(Math.floor(Math.random() * 99) + 1).padStart(2, "0")
  }

  /**
   * Generate serial code (last 4 digits)
   */
  private static generateSerialCode(): string {
    // Serial code: 0001-9999 (cannot be 0000)
    return String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")
  }
}

/**
 * Export utilities
 */
export class SSNExporter {
  static toTXT(ssns: string[]): string {
    return ssns.join("\n")
  }

  static toCSV(ssns: string[], includeMetadata = false): string {
    if (!includeMetadata) {
      return "SSN\n" + ssns.join("\n")
    }

    let csv = "SSN,Area,Group,Serial,Generated At\n"
    ssns.forEach((ssn) => {
      const validation = SSNGenerator.validate(ssn)
      const now = new Date().toISOString()
      csv += `${ssn},${validation.structure.area},${validation.structure.group},${validation.structure.serial},${now}\n`
    })
    return csv
  }

  static toJSON(ssns: string[], includeMetadata = false): string {
    if (!includeMetadata) {
      return JSON.stringify(
        { ssns, count: ssns.length, generated_at: new Date().toISOString() },
        null,
        2
      )
    }

    const data = ssns.map((ssn) => {
      const validation = SSNGenerator.validate(ssn)
      return {
        ssn,
        area: validation.structure.area,
        group: validation.structure.group,
        serial: validation.structure.serial,
        is_valid: validation.isValid,
      }
    })

    return JSON.stringify(
      {
        data,
        count: ssns.length,
        generated_at: new Date().toISOString(),
        note: "Generated for testing purposes only",
      },
      null,
      2
    )
  }
}
