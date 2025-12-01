import { NextRequest, NextResponse } from "next/server"

// 强制动态渲染
// export const dynamic = "force-dynamic"

// Server-side API key (secure)
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_OPENWEATHER_API_KEY environment variable is required")
}

// Helper function to format city names for OpenWeatherMap API
function formatCityForAPI(cityInput: string): string {
  const trimmed = cityInput.trim()

  // If the input contains commas, we need to handle it carefully
  if (trimmed.includes(",")) {
    const parts = trimmed.split(",").map((part) => part.trim())

    if (parts.length === 2) {
      // Check if it looks like "City, ST" (US state format)
      const [city, stateOrCountry] = parts

      // If the second part is a 2-letter code that might be a US state
      if (stateOrCountry.length === 2 && /^[A-Z]{2}$/i.test(stateOrCountry)) {
        // Assume it's a US state and add country code
        return `${city},${stateOrCountry.toUpperCase()},US`
      } else {
        // Assume it's "City, Country" format
        return `${city},${stateOrCountry}`
      }
    } else if (parts.length === 3) {
      // Already in "City, State, Country" format
      return parts.join(",")
    }
  }

  // Single city name without state/country
  return trimmed
}

// Types for weather data - updated to match OpenWeatherMap API response
interface WeatherData {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: {
    speed: number
    deg?: number
    gust?: number
  }
  rain?: {
    "1h"?: number
    "3h"?: number
  }
  snow?: {
    "1h"?: number
    "3h"?: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type?: number
    id?: number
    message?: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

// Snow day probability calculation algorithm based on PRD specifications
function calculateSnowDayProbability(weatherData: WeatherData): {
  probability: number
  level: string
  color: string
  factors: {
    snowfall: { value: number; impact: number; description: string }
    temperature: { value: number; impact: number; description: string }
    windSpeed: { value: number; impact: number; description: string }
    visibility: { value: number; impact: number; description: string }
    baseScore: { value: number; impact: number; description: string }
  }
} {
  let probability = 0
  const factors = {
    snowfall: { value: 0, impact: 0, description: "" },
    temperature: { value: 0, impact: 0, description: "" },
    windSpeed: { value: 0, impact: 0, description: "" },
    visibility: { value: 0, impact: 0, description: "" },
    baseScore: { value: 10, impact: 10, description: "Base probability score" },
  }

  // Base score (10%)
  probability += 10

  // Snowfall impact (max 40%)
  const snowfall = weatherData.snow?.["1h"] || 0
  factors.snowfall.value = snowfall
  if (snowfall > 0) {
    const snowImpact = Math.min(snowfall * 8, 40)
    factors.snowfall.impact = snowImpact
    factors.snowfall.description = `${snowfall}mm/h snowfall adds ${snowImpact}% probability`
    probability += snowImpact
  } else {
    factors.snowfall.description = "No active snowfall"
  }

  // Temperature impact (max 25%)
  const temp = weatherData.main.temp
  factors.temperature.value = temp
  if (temp < -5) {
    const tempImpact = Math.min((-5 - temp) * 2, 25)
    factors.temperature.impact = tempImpact
    factors.temperature.description = `${temp}°C temperature adds ${tempImpact}% probability`
    probability += tempImpact
  } else {
    factors.temperature.description = `${temp}°C temperature - not cold enough for significant impact`
  }

  // Wind speed impact (max 20%)
  const windSpeedKmh = weatherData.wind.speed * 3.6 // Convert m/s to km/h
  factors.windSpeed.value = windSpeedKmh
  if (windSpeedKmh > 20) {
    const windImpact = Math.min((windSpeedKmh - 20) * 0.5, 20)
    factors.windSpeed.impact = windImpact
    factors.windSpeed.description = `${windSpeedKmh.toFixed(1)}km/h wind adds ${windImpact.toFixed(1)}% probability`
    probability += windImpact
  } else {
    factors.windSpeed.description = `${windSpeedKmh.toFixed(1)}km/h wind - below threshold`
  }

  // Visibility impact (max 15%)
  const visibilityKm = weatherData.visibility / 1000 // Convert to km
  factors.visibility.value = visibilityKm
  if (visibilityKm < 5) {
    const visibilityImpact = Math.min((5 - visibilityKm) * 3, 15)
    factors.visibility.impact = visibilityImpact
    factors.visibility.description = `${visibilityKm.toFixed(1)}km visibility adds ${visibilityImpact.toFixed(1)}% probability`
    probability += visibilityImpact
  } else {
    factors.visibility.description = `${visibilityKm.toFixed(1)}km visibility - good conditions`
  }

  // Ensure probability is within 0-100 range
  probability = Math.min(Math.max(probability, 0), 100)

  // Determine level and color based on probability
  let level: string
  let color: string

  if (probability <= 20) {
    level = "Very Low"
    color = "green"
  } else if (probability <= 40) {
    level = "Low"
    color = "yellow-green"
  } else if (probability <= 60) {
    level = "Moderate"
    color = "yellow"
  } else if (probability <= 80) {
    level = "High"
    color = "orange"
  } else {
    level = "Very High"
    color = "red"
  }

  return {
    probability: Math.round(probability),
    level,
    color,
    factors,
  }
}

// Generate recommendations based on probability
function getRecommendation(probability: number): string {
  if (probability <= 20) {
    return "Schools will likely operate normally. Normal travel conditions expected."
  } else if (probability <= 40) {
    return "Low chance of school closure. Monitor weather conditions and check school announcements."
  } else if (probability <= 60) {
    return "Moderate chance of school closure. Consider preparing backup plans and watch for official announcements."
  } else if (probability <= 80) {
    return "High chance of school closure. Likely delays or cancellations. Prepare alternative arrangements."
  } else {
    return "Very high chance of school closure. Expect significant disruptions. Stay home if possible."
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") // 'city', 'coords', 'zip'

    let apiUrl: string

    switch (type) {
      case "city": {
        const city = searchParams.get("q")
        if (!city) {
          return NextResponse.json({ error: "City name is required" }, { status: 400 })
        }
        // Format the city name properly for OpenWeatherMap API
        const formattedCity = formatCityForAPI(city)

        // Encode the entire formatted string (OpenWeatherMap handles comma-separated values)
        apiUrl = `${BASE_URL}/weather?q=${encodeURIComponent(formattedCity)}&appid=${API_KEY}&units=metric`
        break
      }

      case "coords": {
        const lat = searchParams.get("lat")
        const lon = searchParams.get("lon")
        if (!lat || !lon) {
          return NextResponse.json(
            { error: "Latitude and longitude are required" },
            { status: 400 }
          )
        }

        // Validate coordinates are numbers and in valid range
        const latNum = parseFloat(lat)
        const lonNum = parseFloat(lon)

        if (isNaN(latNum) || isNaN(lonNum)) {
          return NextResponse.json({ error: "Invalid coordinates format" }, { status: 400 })
        }

        if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
          return NextResponse.json({ error: "Coordinates out of valid range" }, { status: 400 })
        }

        apiUrl = `${BASE_URL}/weather?lat=${latNum}&lon=${lonNum}&appid=${API_KEY}&units=metric`
        break
      }

      case "zip": {
        const zip = searchParams.get("zip")
        const country = searchParams.get("country") || "US"
        if (!zip) {
          return NextResponse.json({ error: "Zip code is required" }, { status: 400 })
        }
        // Basic zip code validation
        const zipRegex = /^[a-zA-Z0-9\s-]{3,10}$/
        if (!zipRegex.test(zip.trim())) {
          return NextResponse.json({ error: "Invalid zip code format" }, { status: 400 })
        }

        // Country code validation (2-letter codes)
        const countryRegex = /^[A-Z]{2}$/i
        if (!countryRegex.test(country)) {
          return NextResponse.json({ error: "Invalid country code format" }, { status: 400 })
        }

        apiUrl = `${BASE_URL}/weather?zip=${encodeURIComponent(zip.trim())},${country.toUpperCase()}&appid=${API_KEY}&units=metric`
        break
      }

      default:
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
    }

    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          error: errorData.message || "Weather data not found",
          code: errorData.cod || response.status,
        },
        { status: response.status }
      )
    }

    const weatherData = await response.json()

    // Validate essential fields
    if (!weatherData.main || !weatherData.weather || !Array.isArray(weatherData.weather)) {
      return NextResponse.json({ error: "Invalid weather data received" }, { status: 502 })
    }

    // Calculate snow day probability
    const snowDayAnalysis = calculateSnowDayProbability(weatherData)

    // Create enhanced response with snow day prediction
    const enhancedResponse = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        coordinates: weatherData.coord,
      },
      current: {
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        windSpeed: weatherData.wind.speed,
        windSpeedKmh: weatherData.wind.speed * 3.6,
        visibility: weatherData.visibility,
        visibilityKm: weatherData.visibility / 1000,
        snowfall: weatherData.snow?.["1h"] || 0,
        cloudCover: weatherData.clouds.all,
      },
      snowDay: {
        probability: snowDayAnalysis.probability,
        level: snowDayAnalysis.level,
        color: snowDayAnalysis.color,
        recommendation: getRecommendation(snowDayAnalysis.probability),
        factors: snowDayAnalysis.factors,
      },
      timestamp: new Date().toISOString(),
      // Only include raw data in development
      ...(process.env.NODE_ENV === "development" && { raw: weatherData }),
    }

    return NextResponse.json(enhancedResponse)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
