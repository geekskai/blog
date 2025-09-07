import { promises as fs } from "fs"
import path from "path"

// 缓存文件路径
const CACHE_DIR = path.join(process.cwd(), ".cache")
const CACHE_FILE = path.join(CACHE_DIR, "exchange-rates.json")

// 缓存数据接口
interface CachedExchangeRate {
  timestamp: number
  date: string // YYYY-MM-DD 格式
  data: {
    base: string
    target: string
    rate: number
    convertedAmount?: number
    originalAmount?: number
    lastUpdated: string
    source: string
    method: string
    apiBase: string
    usdRates: {
      [key: string]: number
    }
  }
  apiResponse: {
    timestamp: number
    base: string
    rates: Record<string, number>
  }
}

// 确保缓存目录存在
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR)
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true })
  }
}

// 获取今天的日期字符串
function getTodayString(): string {
  return new Date().toISOString().split("T")[0]
}

// 检查缓存是否有效（今天的数据）
function isCacheValid(cachedData: CachedExchangeRate): boolean {
  const today = getTodayString()
  return cachedData.date === today
}

// 读取缓存数据
export async function getCachedExchangeRate(
  base: string,
  target: string
): Promise<CachedExchangeRate | null> {
  try {
    await ensureCacheDir()
    const cacheContent = await fs.readFile(CACHE_FILE, "utf-8")
    const cachedData: CachedExchangeRate = JSON.parse(cacheContent)

    // 检查缓存是否有效
    if (isCacheValid(cachedData)) {
      console.log(`📦 Using cached exchange rate for ${base}-${target} (${cachedData.date})`)

      // 重新计算汇率（因为可能是不同的货币对）
      const usdToBase = cachedData.apiResponse.rates[base]
      const usdToTarget = cachedData.apiResponse.rates[target]

      if (usdToBase && usdToTarget) {
        const crossRate = usdToTarget / usdToBase

        return {
          ...cachedData,
          data: {
            ...cachedData.data,
            base,
            target,
            rate: crossRate,
            usdRates: {
              [base]: usdToBase,
              [target]: usdToTarget,
            },
          },
        }
      }
    } else {
      console.log(`🗑️ Cache expired for ${cachedData.date}, today is ${getTodayString()}`)
    }
  } catch (error) {
    console.log("📦 No valid cache found, will fetch fresh data")
  }

  return null
}

// 保存缓存数据
export async function setCachedExchangeRate(
  base: string,
  target: string,
  apiResponse: any,
  exchangeRateData: any
): Promise<void> {
  try {
    await ensureCacheDir()

    const cacheData: CachedExchangeRate = {
      timestamp: Date.now(),
      date: getTodayString(),
      data: exchangeRateData,
      apiResponse: {
        timestamp: apiResponse.timestamp,
        base: apiResponse.base,
        rates: apiResponse.rates,
      },
    }

    await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2))
    console.log(`💾 Cached exchange rate data for ${getTodayString()}`)
  } catch (error) {
    console.error("Failed to cache exchange rate data:", error)
  }
}

// 获取缓存状态信息
export async function getCacheStatus(): Promise<{
  exists: boolean
  isValid: boolean
  date?: string
  age?: number // 小时
}> {
  try {
    await ensureCacheDir()
    const cacheContent = await fs.readFile(CACHE_FILE, "utf-8")
    const cachedData: CachedExchangeRate = JSON.parse(cacheContent)

    const isValid = isCacheValid(cachedData)
    const ageHours = (Date.now() - cachedData.timestamp) / (1000 * 60 * 60)

    return {
      exists: true,
      isValid,
      date: cachedData.date,
      age: ageHours,
    }
  } catch {
    return {
      exists: false,
      isValid: false,
    }
  }
}

// 清除过期缓存
export async function clearExpiredCache(): Promise<void> {
  try {
    const status = await getCacheStatus()
    if (status.exists && !status.isValid) {
      await fs.unlink(CACHE_FILE)
      console.log("🗑️ Cleared expired cache")
    }
  } catch (error) {
    console.error("Failed to clear expired cache:", error)
  }
}
