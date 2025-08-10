import { PERMData, HistoricalDataPoint, TrendAnalysis, QueuePosition } from "../types"

/**
 * Parse PERM data from DOL API response
 */
export function parsePERMData(apiData: any): PERMData {
  // If we have API data, use it; otherwise use fallback
  if (apiData && apiData.data) {
    return {
      updateDate: new Date(apiData.data.updateDate),
      analystReview: {
        priorityDate: apiData.data.analystReview.priorityDate,
        averageDays: apiData.data.analystReview.averageDays,
        remainingCases: apiData.data.analystReview.remainingCases,
      },
      auditReview: {
        status: apiData.data.auditReview.status,
        averageDays: apiData.data.auditReview.averageDays,
      },
      reconsideration: {
        priorityDate: apiData.data.reconsideration.priorityDate,
      },
    }
  }

  // Fallback data if API fails
  const fallbackData: PERMData = {
    updateDate: new Date(),
    analystReview: {
      priorityDate: "April 2024",
      averageDays: 483,
      remainingCases: {
        "November 2024": 1,
        "December 2024": 14,
        "January 2025": 62,
        "February 2025": 1046,
        "March 2025": 2433,
        "April 2025": 13098,
        "May 2025": 13047,
        "June 2025": 14347,
        "July 2025": 14264,
      },
    },
    auditReview: {
      status: "N/A",
      averageDays: undefined,
    },
    reconsideration: {
      priorityDate: "June 2025",
    },
  }

  return fallbackData
}

/**
 * Fetch latest PERM data from our API
 */
export async function fetchLatestPERMData(): Promise<PERMData> {
  try {
    const response = await fetch("/api/perm-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache control to ensure fresh data
      cache: "no-cache",
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const apiData = await response.json()

    if (!apiData.success) {
      console.warn("API returned error, using fallback data:", apiData.error)
    }

    return parsePERMData(apiData)
  } catch (error) {
    console.error("Failed to fetch PERM data:", error)
    // Return fallback data on error
    return parsePERMData(null)
  }
}

/**
 * Calculate estimated processing time based on submission date and current queue
 */
export function calculateProcessingEstimate(
  submissionDate: Date,
  currentData: PERMData,
  isOEWS: boolean = false
): {
  estimatedDays: number
  queuePosition: QueuePosition
  estimatedCompletionDate: Date
} {
  const submissionMonth = submissionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  // Find position in queue based on submission date
  const remainingCases = currentData.analystReview.remainingCases
  let position = 0
  let totalCases = 0

  // Calculate total cases ahead of submission
  for (const [month, cases] of Object.entries(remainingCases)) {
    totalCases += cases
    const monthDate = new Date(month)
    if (monthDate <= submissionDate) {
      position += cases
    }
  }

  const queuePosition: QueuePosition = {
    position,
    totalCases,
    percentile: Math.round((position / totalCases) * 100),
  }

  // Estimate processing time
  // Base processing time from current average
  let estimatedDays = currentData.analystReview.averageDays

  // Adjust based on queue position
  const queueFactor = position / totalCases
  estimatedDays = estimatedDays + queueFactor * 180 // Add up to 6 months based on position

  // OEWS vs Non-OEWS adjustment (OEWS typically faster by ~60 days)
  if (isOEWS) {
    estimatedDays -= 60
  }

  const estimatedCompletionDate = new Date(submissionDate)
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + estimatedDays)

  return {
    estimatedDays: Math.round(estimatedDays),
    queuePosition,
    estimatedCompletionDate,
  }
}

/**
 * Analyze trends in processing times
 */
export function analyzeTrends(historicalData: HistoricalDataPoint[]): TrendAnalysis {
  if (historicalData.length < 2) {
    return {
      direction: "stable",
      changePercent: 0,
      description: "Insufficient data for trend analysis",
      projectedChange: 0,
    }
  }

  const recent = historicalData.slice(-3)
  const older = historicalData.slice(-6, -3)

  const recentAvg = recent.reduce((sum, point) => sum + point.analystReviewDays, 0) / recent.length
  const olderAvg = older.reduce((sum, point) => sum + point.analystReviewDays, 0) / older.length

  const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100
  const projectedChange = recentAvg - olderAvg

  let direction: "improving" | "worsening" | "stable"
  let description: string

  if (Math.abs(changePercent) < 5) {
    direction = "stable"
    description = "Processing times have remained relatively stable"
  } else if (changePercent > 0) {
    direction = "worsening"
    description = "Processing times are increasing"
  } else {
    direction = "improving"
    description = "Processing times are decreasing"
  }

  return {
    direction,
    changePercent: Math.abs(changePercent),
    description,
    projectedChange: Math.round(projectedChange),
  }
}

/**
 * Format date to human-readable string
 */
export function formatTimeRemaining(targetDate: Date): string {
  const now = new Date()
  const diffMs = targetDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return "Processing time has passed estimate"
  }

  if (diffDays < 30) {
    return `${diffDays} days remaining`
  }

  const months = Math.floor(diffDays / 30)
  const days = diffDays % 30

  if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ${days > 0 ? `and ${days} days` : ""} remaining`
  }

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  return `${years} year${years > 1 ? "s" : ""} ${remainingMonths > 0 ? `and ${remainingMonths} months` : ""} remaining`
}

/**
 * Calculate business days between two dates (excluding weekends)
 */
export function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0
  const current = new Date(startDate)

  while (current <= endDate) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday or Saturday
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

/**
 * Get processing priority based on case age and type
 */
export function getProcessingPriority(
  submissionDate: Date,
  isOEWS: boolean
): {
  level: "high" | "medium" | "low"
  description: string
  color: string
} {
  const ageMonths = (Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

  if (ageMonths > 18) {
    return {
      level: "high",
      description: "High priority - Case is significantly aged",
      color: "text-red-400",
    }
  }

  if (ageMonths > 12) {
    return {
      level: "medium",
      description: "Medium priority - Above average processing time",
      color: "text-yellow-400",
    }
  }

  return {
    level: "low",
    description: "Normal processing - Within expected timeframe",
    color: "text-green-400",
  }
}

/**
 * Generate mock historical data for demonstration
 */
export function generateMockHistoricalData(): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  const baseDate = new Date("2024-01-01")

  for (let i = 0; i < 8; i++) {
    const date = new Date(baseDate)
    date.setMonth(date.getMonth() + i)

    // Simulate fluctuating processing times
    const baseDays = 450 + Math.sin(i * 0.5) * 50 + (Math.random() * 40 - 20)

    data.push({
      date,
      analystReviewDays: Math.round(baseDays),
      priorityDate: new Date(date.getTime() - baseDays * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long" }
      ),
      remainingCases: Math.floor(Math.random() * 15000) + 5000,
    })
  }

  return data
}

/**
 * Update historical data with new current data point
 */
export function updateHistoricalData(
  historicalData: HistoricalDataPoint[],
  currentData: PERMData
): HistoricalDataPoint[] {
  const newDataPoint: HistoricalDataPoint = {
    date: currentData.updateDate,
    analystReviewDays: currentData.analystReview.averageDays,
    priorityDate: currentData.analystReview.priorityDate,
    remainingCases: Object.values(currentData.analystReview.remainingCases).reduce(
      (sum, cases) => sum + cases,
      0
    ),
  }

  // Check if we already have data for this month
  const existingIndex = historicalData.findIndex(
    (point) =>
      point.date.getMonth() === newDataPoint.date.getMonth() &&
      point.date.getFullYear() === newDataPoint.date.getFullYear()
  )

  let updatedData: HistoricalDataPoint[]
  if (existingIndex >= 0) {
    // Update existing data point
    updatedData = [...historicalData]
    updatedData[existingIndex] = newDataPoint
  } else {
    // Add new data point and keep only last 12 months
    updatedData = [...historicalData, newDataPoint]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-12)
  }

  return updatedData
}

/**
 * Validate and clean PERM data
 */
export function validatePERMData(data: any): boolean {
  try {
    if (!data || typeof data !== "object") return false

    // Check required fields
    if (!data.analystReview || typeof data.analystReview !== "object") return false
    if (!data.analystReview.priorityDate || typeof data.analystReview.priorityDate !== "string")
      return false
    if (!data.analystReview.averageDays || typeof data.analystReview.averageDays !== "number")
      return false
    if (!data.analystReview.remainingCases || typeof data.analystReview.remainingCases !== "object")
      return false

    // Validate remaining cases data
    const remainingCases = data.analystReview.remainingCases
    for (const [month, cases] of Object.entries(remainingCases)) {
      if (typeof month !== "string" || typeof cases !== "number" || cases < 0) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}

/**
 * Get data freshness indicator
 */
export function getDataFreshness(lastUpdated: Date): {
  status: "fresh" | "stale" | "very-stale"
  description: string
  hoursOld: number
} {
  const now = new Date()
  const hoursOld = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)

  if (hoursOld < 6) {
    return {
      status: "fresh",
      description: "Data is current",
      hoursOld: Math.round(hoursOld),
    }
  } else if (hoursOld < 24) {
    return {
      status: "stale",
      description: "Data is several hours old",
      hoursOld: Math.round(hoursOld),
    }
  } else {
    return {
      status: "very-stale",
      description: "Data may be outdated",
      hoursOld: Math.round(hoursOld),
    }
  }
}
