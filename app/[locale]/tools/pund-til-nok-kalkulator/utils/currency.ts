import type {
  CurrencyCode,
  CurrencyInfo,
  ConversionResult,
  ExchangeRateData,
  ExchangeRateApiResponse,
} from "../types"

// Currency information
export const CURRENCY_INFO: Record<CurrencyCode, CurrencyInfo> = {
  GBP: {
    code: "GBP",
    name: "British Pound Sterling",
    symbol: "£",
    flag: "🇬🇧",
    country: "United Kingdom",
  },
  NOK: {
    code: "NOK",
    name: "Norwegian Krone",
    symbol: "kr",
    flag: "🇳🇴",
    country: "Norway",
  },
} as const

// Conversion limits
export const CONVERSION_LIMITS = {
  MIN_VALUE: 0,
  MAX_VALUE: 1000000,
  DEFAULT_AMOUNT: 100,
} as const

/**
 * Fetch current exchange rate from API
 */
export async function fetchExchangeRate(
  baseCurrency: CurrencyCode,
  targetCurrency: CurrencyCode
): Promise<ExchangeRateData> {
  try {
    // Using exchangerate.host API (free, no API key required)
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=${baseCurrency}&symbols=${targetCurrency}`,
      {
        headers: {
          Accept: "application/json",
        },
        // Cache for 1 hour
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: ExchangeRateApiResponse = await response.json()

    if (!data.success || !data.rates[targetCurrency]) {
      throw new Error("Invalid API response or missing exchange rate")
    }

    return {
      base: baseCurrency,
      target: targetCurrency,
      rate: data.rates[targetCurrency],
      lastUpdated: data.date,
      timestamp: data.timestamp || Date.now(),
    }
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error)

    // Fallback to approximate rates if API fails
    const fallbackRates = getFallbackRates(baseCurrency, targetCurrency)
    return {
      base: baseCurrency,
      target: targetCurrency,
      rate: fallbackRates,
      lastUpdated: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
    }
  }
}

/**
 * Get fallback exchange rates (approximate values)
 */
function getFallbackRates(base: CurrencyCode, target: CurrencyCode): number {
  // Approximate rates as of 2024 (fallback only)
  const rates: Record<string, number> = {
    "GBP-NOK": 13.5, // 1 GBP ≈ 13.5 NOK
    "NOK-GBP": 0.074, // 1 NOK ≈ 0.074 GBP
  }

  const key = `${base}-${target}`
  return rates[key] || 1
}

/**
 * Convert currency amount
 */
export function convertCurrency(
  amount: number,
  exchangeRate: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  lastUpdated: string
): ConversionResult {
  if (!isValidAmount(amount)) {
    return {
      input: 0,
      output: 0,
      inputCurrency: fromCurrency,
      outputCurrency: toCurrency,
      exchangeRate: 0,
      lastUpdated,
    }
  }

  const output = amount * exchangeRate

  return {
    input: amount,
    output: roundToDecimals(output, 2),
    inputCurrency: fromCurrency,
    outputCurrency: toCurrency,
    exchangeRate,
    lastUpdated,
  }
}

/**
 * Validate if amount is valid for conversion
 */
export function isValidAmount(amount: number): boolean {
  return (
    typeof amount === "number" &&
    !isNaN(amount) &&
    isFinite(amount) &&
    amount >= CONVERSION_LIMITS.MIN_VALUE &&
    amount <= CONVERSION_LIMITS.MAX_VALUE
  )
}

/**
 * Round number to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Format currency amount for display
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  decimals: number = 2
): string {
  if (!isValidAmount(amount)) return "0"

  const currencyInfo = CURRENCY_INFO[currency]
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return `${currencyInfo.symbol}${formattedAmount}`
}

/**
 * Parse user input string to number
 */
export function parseAmountInput(input: string): number {
  // Remove currency symbols and non-numeric characters except decimal point
  const cleaned = input.replace(/[£kr,\s]/g, "").replace(/[^\d.-]/g, "")
  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? 0 : parsed
}

/**
 * Get currency display name
 */
export function getCurrencyDisplayName(currency: CurrencyCode): string {
  return CURRENCY_INFO[currency].name
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_INFO[currency].symbol
}

/**
 * Get currency flag emoji
 */
export function getCurrencyFlag(currency: CurrencyCode): string {
  return CURRENCY_INFO[currency].flag
}

/**
 * Calculate percentage change between two rates
 */
export function calculateRateChange(
  oldRate: number,
  newRate: number
): {
  change: number
  changePercent: number
  isPositive: boolean
} {
  const change = newRate - oldRate
  const changePercent = (change / oldRate) * 100

  return {
    change: roundToDecimals(change, 4),
    changePercent: roundToDecimals(changePercent, 2),
    isPositive: change >= 0,
  }
}

/**
 * Generate common conversion amounts for quick reference
 */
export function getCommonConversions(
  exchangeRate: number,
  baseCurrency: CurrencyCode
): Array<{ base: number; converted: number }> {
  const commonAmounts =
    baseCurrency === "GBP"
      ? [1, 5, 10, 20, 50, 100, 500, 1000]
      : [10, 50, 100, 200, 500, 1000, 5000, 10000]

  return commonAmounts.map((amount) => ({
    base: amount,
    converted: roundToDecimals(amount * exchangeRate, 2),
  }))
}
