import { VINValidationResult } from "../types"
import { isValidVin as validateVinOffline } from "@shaggytools/nhtsa-api-wrapper"

// VIN validation constants
const VIN_LENGTH = 17 as const
const INVALID_CHARS = /[IOQ]/i // I, O, Q are not allowed in VINs

// Check digit calculation weights
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]

// Character to number mapping for check digit calculation
const CHAR_VALUES: Record<string, number> = {
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
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
}

/**
 * Validates a VIN using official NHTSA wrapper with enhanced error details
 * @param vin - The VIN to validate
 * @param t - Optional translation function
 * @returns Validation result with details
 */
export function validateVIN(
  vin: string,
  t?: (key: string, values?: Record<string, any>) => string
): VINValidationResult {
  const getText = (key: string, fallback: string) => (t ? t(key) : fallback)

  // Empty VIN - no error shown, button disabled
  if (!vin || vin.trim().length === 0) {
    return {
      isValid: false,
    }
  }

  const vinUpper = formatVIN(vin)

  // Incomplete VIN (less than 17 characters) - no error shown, button disabled
  // This allows users to type without seeing errors prematurely
  if (vinUpper.length < VIN_LENGTH) {
    return {
      isValid: false,
    }
  }

  // VIN too long - show error
  if (vinUpper.length > VIN_LENGTH) {
    return {
      isValid: false,
      error: getText("validation.vin_too_long", "VIN must be exactly 17 characters"),
    }
  }

  // VIN is exactly 17 characters - validate format
  // Check for invalid characters first
  if (INVALID_CHARS.test(vinUpper)) {
    return {
      isValid: false,
      error: getText(
        "validation.vin_invalid_chars",
        "VIN contains invalid characters (I, O, or Q are not allowed)"
      ),
    }
  }

  // Use official validation for complete VINs
  if (!validateVinOffline(vinUpper)) {
    return {
      isValid: false,
      error: getText("validation.vin_format_invalid", "VIN format is invalid"),
    }
  }

  // VIN is valid - calculate check digit for additional info
  const checkDigit = calculateCheckDigit(vinUpper)
  const actualCheckDigit = vinUpper[8]
  const checkDigitValid = checkDigit === actualCheckDigit

  return {
    isValid: true,
    checkDigit: {
      expected: checkDigit,
      actual: actualCheckDigit,
      isValid: checkDigitValid,
    },
  }
}

/**
 * Calculates the check digit for a VIN
 * @param vin - The VIN (must be 17 characters, uppercase)
 * @returns The calculated check digit
 */
function calculateCheckDigit(vin: string): string {
  let sum = 0

  for (let i = 0; i < 17; i++) {
    const char = vin[i]
    const value = CHAR_VALUES[char] ?? 0
    sum += value * WEIGHTS[i]
  }

  const remainder = sum % 11
  return remainder === 10 ? "X" : remainder.toString()
}

/**
 * Re-export official validation function for consistency
 * @param vin - The VIN to check
 * @returns true if valid, false otherwise
 */
export const isValidVin = validateVinOffline

/**
 * Formats a VIN for display (uppercase, trimmed)
 * @param vin - The VIN to format
 * @returns Formatted VIN
 */
export function formatVIN(vin: string): string {
  return vin.toUpperCase().trim()
}

/**
 * Extracts the WMI (World Manufacturer Identifier) from a VIN
 * @param vin - The VIN
 * @returns The WMI (first 3 characters) or null
 */
export function extractWMI(vin: string): string | null {
  if (!vin || vin.length < 3) return null
  return vin.substring(0, 3).toUpperCase()
}

/**
 * Extracts the VDS (Vehicle Descriptor Section) from a VIN
 * @param vin - The VIN
 * @returns The VDS (characters 4-9) or null
 */
export function extractVDS(vin: string): string | null {
  if (!vin || vin.length < 9) return null
  return vin.substring(3, 9).toUpperCase()
}

/**
 * Extracts the VIS (Vehicle Identifier Section) from a VIN
 * @param vin - The VIN
 * @returns The VIS (characters 10-17) or null
 */
export function extractVIS(vin: string): string | null {
  if (!vin || vin.length < 17) return null
  return vin.substring(9, 17).toUpperCase()
}

/**
 * Gets the model year character from a VIN
 * @param vin - The VIN
 * @returns The model year character (10th position) or null
 */
export function getModelYearChar(vin: string): string | null {
  if (!vin || vin.length < 10) return null
  return vin[9].toUpperCase()
}

/**
 * Gets the plant code from a VIN
 * @param vin - The VIN
 * @returns The plant code (11th position) or null
 */
export function getPlantCode(vin: string): string | null {
  if (!vin || vin.length < 11) return null
  return vin[10].toUpperCase()
}

/**
 * Gets the serial number from a VIN
 * @param vin - The VIN
 * @returns The serial number (last 6 characters) or null
 */
export function getSerialNumber(vin: string): string | null {
  if (!vin || vin.length < 17) return null
  return vin.substring(11, 17).toUpperCase()
}

/**
 * Provides helpful hints based on VIN validation errors
 * @param error - The validation error
 * @param t - Optional translation function
 * @returns User-friendly hint message
 */
export function getValidationHint(
  error?: string,
  t?: (key: string, values?: Record<string, any>) => string
): string {
  if (!error) return ""

  const getText = (key: string, fallback: string) => (t ? t(key) : fallback)

  if (error.includes("17 characters") || error.includes("characters")) {
    return getText(
      "validation.hint_length",
      "💡 Tip: VINs are exactly 17 characters long. Check for missing or extra characters."
    )
  }

  if (error.includes("I, O, or Q") || error.includes("invalid characters")) {
    return getText(
      "validation.hint_invalid_chars",
      "💡 Tip: The letters I, O, and Q are never used in VINs to avoid confusion with numbers."
    )
  }

  if (error.includes("invalid characters")) {
    return getText(
      "validation.hint_chars_only",
      "💡 Tip: VINs only contain letters A-Z (except I, O, Q) and numbers 0-9."
    )
  }

  return getText(
    "validation.hint_check_vin",
    "💡 Tip: Double-check the VIN on your vehicle's dashboard, door jamb, or registration documents."
  )
}

/**
 * Example VINs for testing and demonstration
 */
export const EXAMPLE_VINS = [
  { vin: "1HGBH41JXMN109186", description: "Honda Accord" },
  { vin: "5YJSA1DN5CFP01657", description: "Tesla Model S" },
  { vin: "WBA3B5C50EJ845971", description: "BMW 3 Series" },
  { vin: "1FTFW1ET5DFC10312", description: "Ford F-150" },
  { vin: "JTDKARFU5J3068263", description: "Toyota Prius" },
]

/**
 * Gets a random example VIN
 * @returns A random example VIN object
 */
export function getRandomExampleVIN() {
  return EXAMPLE_VINS[Math.floor(Math.random() * EXAMPLE_VINS.length)]
}
