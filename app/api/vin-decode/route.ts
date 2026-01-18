import { NextRequest, NextResponse } from "next/server"
import { DecodedVehicle } from "../../[locale]/tools/vin-decoder/types"

/**
 * Auto.dev API response interface
 */
interface AutoDevResponse {
  vin: string
  vinValid?: boolean
  wmi?: string
  origin?: string
  squishVin?: string
  checkDigit?: string
  checksum?: boolean
  type?: string
  make?: string
  model?: string
  trim?: string
  style?: string
  body?: string
  engine?: string
  drive?: string
  transmission?: string
  vehicle?: {
    vin?: string
    year?: number
    make?: string
    model?: string
    manufacturer?: string
  }
  ambiguous?: boolean
}

/**
 * Decode VIN using Auto.dev API (server-side)
 */
async function decodeWithAutoDev(vin: string): Promise<DecodedVehicle> {
  const apiKey = process.env.VIN_DECODE_AUTO_DEV_API_KEY

  if (!apiKey) {
    throw new Error("Auto.dev API key not configured")
  }

  const vinUpper = vin.toUpperCase().trim()
  const wmi = vinUpper.substring(0, 3)

  try {
    const response = await fetch(`https://api.auto.dev/vin/${vinUpper}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("VIN not found in Auto.dev database")
      }
      if (response.status === 400) {
        throw new Error("Invalid VIN format")
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Auto.dev API error: ${response.status} ${response.statusText}`
      )
    }

    const data: AutoDevResponse = await response.json()
    console.log(`🚀 ~AutoDevResponse data:`, data)

    // Map Auto.dev response to DecodedVehicle format
    const vehicle: DecodedVehicle = {
      vin: vinUpper,
      metadata: {
        apiVersion: "2.0",
        decodedAt: new Date().toISOString(),
        dataSource: "basic",
        wmiDecoded: false,
      },
    }

    // Basic vehicle information
    if (data.vehicle) {
      vehicle.year = data.vehicle.year?.toString()
      vehicle.make = data.vehicle.make || data.make
      vehicle.model = data.vehicle.model || data.model
      vehicle.manufacturing = {
        wmi: data.wmi || wmi,
        manufacturerName: data.vehicle.manufacturer,
      }
    } else {
      vehicle.make = data.make
      vehicle.model = data.model
      vehicle.manufacturing = {
        wmi: data.wmi || wmi,
      }
    }

    // Trim and style
    vehicle.trim = data.trim
    vehicle.trim2 = data.style
    vehicle.bodyClass = data.body
    vehicle.driveType = data.drive

    // Parse engine information from engine string (e.g., "5.3L V8 OHV 16V FFV")
    if (data.engine) {
      const engineData: DecodedVehicle["engine"] = {}

      // Extract displacement (e.g., "5.3L")
      const displacementMatch = data.engine.match(/(\d+\.?\d*)\s*L/i)
      if (displacementMatch) {
        engineData.displacementL = displacementMatch[1]
        // Convert to CC (approximate)
        const liters = parseFloat(displacementMatch[1])
        if (!isNaN(liters)) {
          engineData.displacementCc = Math.round(liters * 1000).toString()
        }
      }

      // Extract cylinders (e.g., "V8", "V6", "I4")
      const cylinderMatch = data.engine.match(/[VI](\d+)/i)
      if (cylinderMatch) {
        engineData.cylinders = cylinderMatch[1]
      }

      // Extract configuration
      if (data.engine.includes("V8")) {
        engineData.configuration = "V8"
      } else if (data.engine.includes("V6")) {
        engineData.configuration = "V6"
      } else if (data.engine.includes("I4") || data.engine.includes("L4")) {
        engineData.configuration = "I4"
      }

      // Extract fuel type
      if (data.engine.includes("FFV")) {
        engineData.fuelType = "Flexible Fuel"
      } else if (data.engine.includes("Electric")) {
        engineData.fuelType = "Electric"
      } else if (data.engine.includes("Hybrid")) {
        engineData.fuelType = "Hybrid"
      }

      vehicle.engine = engineData
    }

    // Transmission
    if (data.transmission) {
      vehicle.transmission = {
        type: data.transmission,
      }
    }

    // Manufacturing details
    if (!vehicle.manufacturing) {
      vehicle.manufacturing = { wmi: data.wmi || wmi }
    }
    if (data.origin) {
      vehicle.manufacturing.plantCountry = data.origin
    }

    // Store raw Auto.dev data
    const rawData: Record<string, string> = {}
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof AutoDevResponse]
      if (value !== null && value !== undefined) {
        if (typeof value === "object") {
          rawData[key] = JSON.stringify(value)
        } else {
          rawData[key] = String(value)
        }
      }
    })
    vehicle.raw = rawData

    return vehicle
  } catch (error) {
    console.error("Auto.dev decode error:", error)
    throw error instanceof Error ? error : new Error("Failed to decode VIN with Auto.dev API")
  }
}

/**
 * POST /api/vin-decode
 * Decode VIN using Auto.dev API (server-side fallback)
 */
export async function POST(request: NextRequest) {
  try {
    const { vin }: { vin: string } = await request.json()

    if (!vin) {
      return NextResponse.json({ error: "VIN is required" }, { status: 400 })
    }

    const vinUpper = vin.toUpperCase().trim()

    // Basic VIN format validation (17 characters, alphanumeric excluding I, O, Q)
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vinUpper)) {
      return NextResponse.json({ error: "Invalid VIN format" }, { status: 400 })
    }
    console.warn(vin, "NHTSA API failed or cannot decode, falling back to Auto.dev API")

    const vehicle = await decodeWithAutoDev(vinUpper)

    return NextResponse.json(vehicle, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600", // 24小时缓存
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("VIN decode API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to decode VIN",
      },
      { status: 500 }
    )
  }
}
