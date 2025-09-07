import { NextResponse } from "next/server"
import { getCacheStatus } from "../../lib/exchange-rate-cache"

export async function GET() {
  try {
    const cacheStatus = await getCacheStatus()

    return NextResponse.json(
      {
        success: true,
        cache: cacheStatus,
        optimization: {
          dailyLimit: "1 API call per day",
          monthlyLimit: "~30 API calls per month",
          currentStrategy: "File-based daily caching",
          benefits: [
            "Reduces API calls by 95%+",
            "Faster response times",
            "Reliable service even during API outages",
            "Cost-effective operation",
          ],
        },
        tips: {
          forUsers: "Exchange rates update once daily for optimal performance",
          forDevelopers: "Cache automatically refreshes every 24 hours",
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300", // 5分钟缓存
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  } catch (error) {
    console.error("Cache status error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get cache status",
        cache: {
          exists: false,
          isValid: false,
        },
      },
      { status: 500 }
    )
  }
}
