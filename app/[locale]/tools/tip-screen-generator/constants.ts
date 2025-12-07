/**
 * Constants for tip screen generator
 */

export const DEFAULT_BILL_AMOUNT = 25.75
export const DEFAULT_SELECTED_TIP = 20
export const DEFAULT_THEME = "ipad-pos" as const

export const DEFAULT_DARK_PATTERNS = {
  hideSkip: false,
  defaultHighest: true,
  guiltyText: false,
  smallSkip: false,
  watchingEyes: false,
  tipFirst: true,
} as const

export const TIP_PERCENTAGES = [15, 20, 25, 30] as const

export const MAX_BILL_AMOUNT = 9999.99
export const MIN_BILL_AMOUNT = 0
