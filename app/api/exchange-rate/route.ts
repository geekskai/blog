import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  getCachedExchangeRate,
  setCachedExchangeRate,
  clearExpiredCache,
} from "../../lib/exchange-rate-cache"

// Input validation schema
const ExchangeRateRequestSchema = z.object({
  base: z.enum(["GBP", "NOK"]),
  target: z.enum(["GBP", "NOK"]),
  amount: z.string().optional().default("1"),
})

// Open Exchange Rates API response interfaces
interface OpenExchangeRatesLatestResponse {
  disclaimer: string
  license: string
  timestamp: number
  base: string // Always "USD"
  rates: Record<string, number>
}

interface ExchangeRateApiResponse {
  success: boolean
  rates: Record<string, number>
  base: string
  date: string
  timestamp?: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      base: searchParams.get("base"),
      target: searchParams.get("target"),
      amount: searchParams.get("amount") || "1",
    }

    // Validate input parameters
    const validatedParams = ExchangeRateRequestSchema.parse(params)

    // 清理过期缓存
    await clearExpiredCache()

    // 首先尝试从缓存获取数据
    const cachedData = await getCachedExchangeRate(validatedParams.base, validatedParams.target)

    let exchangeRateData

    if (cachedData) {
      // 使用缓存数据，重新计算金额
      const originalAmount = parseFloat(validatedParams.amount)
      const convertedAmount = originalAmount * cachedData.data.rate

      exchangeRateData = {
        ...cachedData.data,
        convertedAmount,
        originalAmount,
        fromCache: true, // 标记数据来源
      }
    } else {
      // 缓存未命中，从 API 获取新数据
      exchangeRateData = await fetchExchangeRateFromAPI(
        validatedParams.base,
        validatedParams.target,
        validatedParams.amount
      )
    }

    // Return successful response with caching headers
    const cacheControl = exchangeRateData.fromCache
      ? "public, s-maxage=86400, stale-while-revalidate=3600" // 24小时缓存（来自本地缓存）
      : "public, s-maxage=3600, stale-while-revalidate=1800" // 1小时缓存（来自API）

    return NextResponse.json(exchangeRateData, {
      headers: {
        "Cache-Control": cacheControl,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Cache-Status": exchangeRateData.fromCache ? "HIT" : "MISS",
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request parameters",
          details: error.errors,
          message: "Please provide valid 'base' and 'target' currency codes (GBP or NOK)",
        },
        { status: 400 }
      )
    }

    // Return fallback rates in case of API failure
    const fallbackData = getFallbackExchangeRate(
      (error as any).base || "GBP",
      (error as any).target || "NOK",
      (error as any).amount || "1"
    )

    return NextResponse.json(fallbackData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=150", // Shorter cache for fallback
      },
    })
  }
}

/**
 * Fetch exchange rate from external API using Open Exchange Rates (Free Plan - USD Base Only)
 */
async function fetchExchangeRateFromAPI(
  base: string,
  target: string,
  amount: string
): Promise<any> {
  try {
    // Primary API: Open Exchange Rates latest endpoint (Free plan - USD base only)
    // We'll calculate GBP ↔ NOK using USD as the base currency
    const apiKey = process.env.OPEN_EXCHANGE_RATES_API_KEY

    const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "GeeksKai-Currency-Converter/1.0",
      },
      // 10 second timeout
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: OpenExchangeRatesLatestResponse = await response.json()

    if (!data.rates || !data.rates[base] || !data.rates[target]) {
      throw new Error("Invalid API response or missing currency rates")
    }

    // Calculate cross rate using USD as base
    // For GBP to NOK: GBP/NOK = (USD/NOK) ÷ (USD/GBP)
    // Example: NOK 10.04675 ÷ GBP 0.740302 = 13.5717 NOK per GBP
    const usdToBase = data.rates[base] // e.g., 0.740302 (1 USD = 0.740302 GBP)
    const usdToTarget = data.rates[target] // e.g., 10.04675 (1 USD = 10.04675 NOK)
    const crossRate = usdToTarget / usdToBase // 10.04675 / 0.740302 = 13.5717

    const originalAmount = parseFloat(amount)
    const convertedAmount = originalAmount * crossRate

    const exchangeRateData = {
      success: true,
      base,
      target,
      rate: crossRate,
      convertedAmount,
      originalAmount,
      lastUpdated: new Date(data.timestamp * 1000).toISOString().split("T")[0],
      timestamp: data.timestamp * 1000,
      source: "openexchangerates.org",
      method: "usd-cross-rate",
      apiBase: data.base, // Always "USD" for free plan
      usdRates: {
        [base]: usdToBase,
        [target]: usdToTarget,
      },
    }

    // 保存到缓存（异步，不阻塞响应）
    setCachedExchangeRate(base, target, data, exchangeRateData).catch((err) => {})

    return exchangeRateData
  } catch (error) {
    console.warn("Open Exchange Rates API failed, trying fallback:", error)

    // Fallback 1: exchangerate.host (free, reliable)
    try {
      const fallbackResponse = await fetch(
        `https://api.exchangerate.host/latest?base=${base}&symbols=${target}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "GeeksKai-Currency-Converter/1.0",
          },
          signal: AbortSignal.timeout(5000),
        }
      )

      if (fallbackResponse.ok) {
        const fallbackData: ExchangeRateApiResponse = await fallbackResponse.json()
        if (fallbackData.success && fallbackData.rates[target]) {
          const rate = fallbackData.rates[target]
          const originalAmount = parseFloat(amount)
          const convertedAmount = originalAmount * rate

          return {
            success: true,
            base,
            target,
            rate,
            convertedAmount,
            originalAmount,
            lastUpdated: fallbackData.date,
            timestamp: Date.now(),
            source: "exchangerate.host",
            method: "direct-fallback",
          }
        }
      }
    } catch (fallbackError) {
      console.warn("exchangerate.host fallback also failed:", fallbackError)
    }

    // If all APIs fail, throw error to trigger fallback rates
    throw { ...error, base, target, amount }
  }
}

/**
 * Get fallback exchange rates when APIs are unavailable
 */
function getFallbackExchangeRate(base: string, target: string, amount: string) {
  // Based on actual Open Exchange Rates data from the API response
  // USD rates: GBP = 0.740302, NOK = 10.04675
  const usdRates: Record<string, number> = {
    GBP: 0.740302, // 1 USD = 0.740302 GBP
    NOK: 10.04675, // 1 USD = 10.04675 NOK
  }

  // Calculate cross rate: base/target = (USD/target) / (USD/base)
  const usdToBase = usdRates[base]
  const usdToTarget = usdRates[target]

  if (!usdToBase || !usdToTarget) {
    // Ultimate fallback with approximate rates
    const directRates: Record<string, number> = {
      "GBP-NOK": 13.57, // 10.04675 / 0.740302 ≈ 13.57
      "NOK-GBP": 0.0737, // 0.740302 / 10.04675 ≈ 0.0737
    }
    const key = `${base}-${target}`
    const rate = directRates[key] || 1
    const originalAmount = parseFloat(amount)
    const convertedAmount = originalAmount * rate

    return {
      success: true,
      base,
      target,
      rate,
      convertedAmount,
      originalAmount,
      lastUpdated: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
      source: "fallback-direct",
      warning: "Using approximate exchange rate due to API unavailability",
    }
  }

  const crossRate = usdToTarget / usdToBase
  const originalAmount = parseFloat(amount)
  const convertedAmount = originalAmount * crossRate

  return {
    success: true,
    base,
    target,
    rate: crossRate,
    convertedAmount,
    originalAmount,
    lastUpdated: new Date().toISOString().split("T")[0],
    timestamp: Date.now(),
    source: "fallback-calculated",
    warning: "Using cached exchange rate due to API unavailability",
    usdRates: {
      [base]: usdToBase,
      [target]: usdToTarget,
    },
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
