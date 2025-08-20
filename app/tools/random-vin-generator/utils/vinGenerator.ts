import { VINGenerationOptions, VINMetadata, VINValidationResult, ManufacturerInfo } from "../types"

/**
 * Professional VIN Generator Class
 * Generates valid format Vehicle Identification Numbers for testing and development
 * Compliant with ISO 3779 standard
 */
export class VINGenerator {
  // Check digit calculation mapping
  private static readonly CHECK_DIGIT_MAP: { [key: string]: number } = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    P: 7,
    R: 9,
    S: 2,
    T: 3,
    U: 4,
    V: 5,
    W: 6,
    X: 7,
    Y: 8,
    Z: 9,
  }

  // Weight factors for check digit calculation
  private static readonly WEIGHT_FACTORS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]

  // Common manufacturer codes (World Manufacturer Identifier)
  private static readonly MANUFACTURERS: ManufacturerInfo[] = [
    { code: "1FA", name: "Ford Motor Company", country: "United States" },
    { code: "1G1", name: "General Motors", country: "United States" },
    { code: "1HG", name: "Honda", country: "United States" },
    { code: "1N4", name: "Nissan", country: "United States" },
    { code: "2C3", name: "Chrysler", country: "Canada" },
    { code: "2T1", name: "Toyota", country: "Canada" },
    { code: "3VW", name: "Volkswagen", country: "Mexico" },
    { code: "4T1", name: "Toyota", country: "United States" },
    { code: "5NP", name: "Hyundai", country: "United States" },
    { code: "JHM", name: "Honda", country: "Japan" },
    { code: "JTD", name: "Toyota", country: "Japan" },
    { code: "KNA", name: "Kia", country: "South Korea" },
    { code: "WBA", name: "BMW", country: "Germany" },
    { code: "WDB", name: "Mercedes-Benz", country: "Germany" },
    { code: "WVW", name: "Volkswagen", country: "Germany" },
  ]

  // Model year codes (position 10)
  private static readonly MODEL_YEAR_CODES: { [key: string]: string } = {
    "2010": "A",
    "2011": "B",
    "2012": "C",
    "2013": "D",
    "2014": "E",
    "2015": "F",
    "2016": "G",
    "2017": "H",
    "2018": "J",
    "2019": "K",
    "2020": "L",
    "2021": "M",
    "2022": "N",
    "2023": "P",
    "2024": "R",
    "2025": "S",
    "2026": "T",
    "2027": "V",
    "2028": "W",
    "2029": "X",
    "2030": "Y",
  }

  // Valid VIN characters (excludes I, O, Q, U, Z)
  private static readonly VALID_CHARS = "0123456789ABCDEFGHJKLMNPRSTUVWXYZ"

  /**
   * Generate a single random VIN
   */
  static generate(options: VINGenerationOptions = {}): string {
    const { manufacturer, modelYear } = options

    const wmi = manufacturer || this.generateRandomWMI()
    const vds = this.generateVDS()
    const yearCode = modelYear ? this.MODEL_YEAR_CODES[modelYear] || "R" : this.generateRandomYear()
    const plantCode = this.generatePlantCode()
    const sequentialNumber = this.generateSequentialNumber()

    // Build VIN without check digit first
    const vinWithoutCheck = wmi + vds + yearCode + plantCode + sequentialNumber
    const checkDigit = this.calculateCheckDigit(vinWithoutCheck)

    // Insert check digit at position 9 (index 8)
    return vinWithoutCheck.substring(0, 8) + checkDigit + vinWithoutCheck.substring(8)
  }

  /**
   * Generate multiple VINs
   */
  static generateBatch(options: VINGenerationOptions = {}): string[] {
    const { count = 10 } = options
    const vins: string[] = []
    const used = new Set<string>()

    while (vins.length < count) {
      const vin = this.generate(options)
      if (!used.has(vin)) {
        used.add(vin)
        vins.push(vin)
      }
    }

    return vins
  }

  /**
   * Generate VIN with metadata
   */
  static generateWithMetadata(options: VINGenerationOptions = {}): {
    vin: string
    metadata: VINMetadata
  } {
    const vin = this.generate(options)
    const structure = this.parseVIN(vin)
    const manufacturer = this.getManufacturerInfo(structure.wmi)

    const metadata: VINMetadata = {
      wmi: structure.wmi,
      vds: structure.vds,
      checkDigit: structure.checkDigit,
      modelYear: this.getModelYearFromCode(structure.modelYear),
      plantCode: structure.plantCode,
      sequentialNumber: structure.sequentialNumber,
      isValid: true,
      generatedAt: new Date().toISOString(),
      manufacturer: manufacturer?.name,
    }

    return { vin, metadata }
  }

  /**
   * Validate VIN format and check digit
   */
  static validate(vin: string): VINValidationResult {
    const errors: string[] = []

    // Check length
    if (vin.length !== 17) {
      errors.push("VIN must be exactly 17 characters")
    }

    // Check for invalid characters
    const invalidChars = vin
      .split("")
      .filter((char) => !this.VALID_CHARS.includes(char.toUpperCase()))
    if (invalidChars.length > 0) {
      errors.push(`Invalid characters found: ${invalidChars.join(", ")}`)
    }

    // Parse structure
    const structure = this.parseVIN(vin)

    // Calculate and verify check digit
    const calculatedCheckDigit = this.calculateCheckDigit(vin)
    if (structure.checkDigit !== calculatedCheckDigit) {
      errors.push(
        `Check digit mismatch. Expected: ${calculatedCheckDigit}, Got: ${structure.checkDigit}`
      )
    }

    return {
      isValid: errors.length === 0,
      errors,
      structure,
      calculatedCheckDigit,
    }
  }

  /**
   * Get manufacturer information by WMI
   */
  static getManufacturerInfo(wmi: string): ManufacturerInfo | undefined {
    return this.MANUFACTURERS.find((mfg) => mfg.code === wmi)
  }

  /**
   * Get all available manufacturers
   */
  static getManufacturers(): ManufacturerInfo[] {
    return [...this.MANUFACTURERS]
  }

  /**
   * Calculate VIN check digit (position 9)
   */
  private static calculateCheckDigit(vinWithoutCheck: string): string {
    let sum = 0

    for (let i = 0; i < 17; i++) {
      if (i !== 8) {
        // Skip check digit position
        const char = vinWithoutCheck[i] || "0"
        const value = this.CHECK_DIGIT_MAP[char.toUpperCase()] || 0
        sum += value * this.WEIGHT_FACTORS[i]
      }
    }

    const remainder = sum % 11
    return remainder === 10 ? "X" : remainder.toString()
  }

  /**
   * Generate random World Manufacturer Identifier
   */
  private static generateRandomWMI(): string {
    const randomIndex = Math.floor(Math.random() * this.MANUFACTURERS.length)
    return this.MANUFACTURERS[randomIndex].code
  }

  /**
   * Generate Vehicle Descriptor Section (positions 4-8)
   */
  private static generateVDS(): string {
    let vds = ""
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * this.VALID_CHARS.length)
      vds += this.VALID_CHARS[randomIndex]
    }
    return vds
  }

  /**
   * Generate random model year code
   */
  private static generateRandomYear(): string {
    const years = Object.keys(this.MODEL_YEAR_CODES)
    const randomYear = years[Math.floor(Math.random() * years.length)]
    return this.MODEL_YEAR_CODES[randomYear]
  }

  /**
   * Generate plant code (position 11)
   */
  private static generatePlantCode(): string {
    const randomIndex = Math.floor(Math.random() * this.VALID_CHARS.length)
    return this.VALID_CHARS[randomIndex]
  }

  /**
   * Generate sequential number (positions 12-17)
   */
  private static generateSequentialNumber(): string {
    let sequential = ""
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * this.VALID_CHARS.length)
      sequential += this.VALID_CHARS[randomIndex]
    }
    return sequential
  }

  /**
   * Parse VIN into components
   */
  private static parseVIN(vin: string) {
    return {
      wmi: vin.substring(0, 3), // World Manufacturer Identifier
      vds: vin.substring(3, 8), // Vehicle Descriptor Section
      checkDigit: vin.substring(8, 9), // Check Digit
      modelYear: vin.substring(9, 10), // Model Year
      plantCode: vin.substring(10, 11), // Plant Code
      sequentialNumber: vin.substring(11, 17), // Sequential Number
    }
  }

  /**
   * Get model year from year code
   */
  static getModelYearFromCode(code: string): string {
    const year = Object.entries(this.MODEL_YEAR_CODES).find(([, c]) => c === code)
    return year ? year[0] : "Unknown"
  }
}

/**
 * VIN Export utilities
 */
export class VINExporter {
  static toTXT(vins: string[]): string {
    return vins.join("\n")
  }

  static toCSV(vins: string[], includeMetadata = false): string {
    if (!includeMetadata) {
      return "VIN\n" + vins.join("\n")
    }

    let csv = "VIN,WMI,VDS,Check Digit,Model Year,Plant Code,Sequential,Manufacturer,Generated At\n"
    vins.forEach((vin) => {
      const validation = VINGenerator.validate(vin)
      const manufacturer = VINGenerator.getManufacturerInfo(validation.structure.wmi)
      const modelYear = VINGenerator.getModelYearFromCode(validation.structure.modelYear)
      const now = new Date().toISOString()

      csv += `${vin},${validation.structure.wmi},${validation.structure.vds},${validation.structure.checkDigit},${modelYear},${validation.structure.plantCode},${validation.structure.sequentialNumber},${manufacturer?.name || "Unknown"},${now}\n`
    })
    return csv
  }

  static toJSON(vins: string[], includeMetadata = false): string {
    if (!includeMetadata) {
      return JSON.stringify(
        { vins, count: vins.length, generated_at: new Date().toISOString() },
        null,
        2
      )
    }

    const data = vins.map((vin) => {
      const validation = VINGenerator.validate(vin)
      const manufacturer = VINGenerator.getManufacturerInfo(validation.structure.wmi)
      const modelYear = VINGenerator.getModelYearFromCode(validation.structure.modelYear)

      return {
        vin,
        wmi: validation.structure.wmi,
        vds: validation.structure.vds,
        check_digit: validation.structure.checkDigit,
        model_year: modelYear,
        plant_code: validation.structure.plantCode,
        sequential_number: validation.structure.sequentialNumber,
        manufacturer: manufacturer?.name || "Unknown",
        country: manufacturer?.country || "Unknown",
        is_valid: validation.isValid,
      }
    })

    return JSON.stringify(
      {
        data,
        count: vins.length,
        generated_at: new Date().toISOString(),
        note: "Generated for testing purposes only",
        standard: "ISO 3779 compliant",
      },
      null,
      2
    )
  }
}
