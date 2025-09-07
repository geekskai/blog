// Currency types
export type CurrencyCode = "GBP" | "NOK"

// Exchange rate data interface
export interface ExchangeRateData {
  base: CurrencyCode
  target: CurrencyCode
  rate: number
  lastUpdated: string
  timestamp: number
  convertedAmount?: number
  originalAmount?: number
  source?: string
  method?:
    | "direct-base-rate"
    | "usd-cross-rate"
    | "direct-fallback"
    | "fallback-calculated"
    | "fallback-direct"
  usdRates?: {
    [key: string]: number
  }
  apiBase?: string
  warning?: string
  fromCache?: boolean
}

// Conversion result interface
export interface ConversionResult {
  input: number
  output: number
  inputCurrency: CurrencyCode
  outputCurrency: CurrencyCode
  exchangeRate: number
  lastUpdated: string
}

// Conversion history interface
export interface ConversionHistory {
  id: string
  timestamp: Date
  result: ConversionResult
}

// API response interface
export interface ExchangeRateApiResponse {
  success: boolean
  rates: Record<string, number>
  base: string
  date: string
  timestamp?: number
}

// Component props interfaces
export interface ConverterProps {
  defaultAmount?: number
  defaultCurrency?: CurrencyCode
  onConvert?: (result: ConversionResult) => void
}

// Copy status type
export type CopyStatus = "idle" | "copying" | "copied" | "error"

// Currency info interface
export interface CurrencyInfo {
  code: CurrencyCode
  name: string
  symbol: string
  flag: string
  country: string
}

// Historical rate data
export interface HistoricalRate {
  date: string
  rate: number
}

// Rate trend data
export interface RateTrend {
  period: "7d" | "30d" | "1y"
  data: HistoricalRate[]
  change: number
  changePercent: number
}
