import { DecodeVinValuesExtended, DecodeVinValues, DecodeWMI } from "@shaggytools/nhtsa-api-wrapper"
import { DecodedVehicle } from "../types"

/**
 * Decode VIN using Auto.dev API via server-side API route (paid fallback)
 */
async function decodeWithAutoDev(vin: string): Promise<DecodedVehicle> {
  const vinUpper = vin.toUpperCase().trim()

  try {
    const response = await fetch("/api/vin-decode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vin: vinUpper }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `Auto.dev API error: ${response.status} ${response.statusText}`
      )
    }

    const vehicle: DecodedVehicle = await response.json()
    return vehicle
  } catch (error) {
    console.error("Auto.dev decode error:", error)
    throw error instanceof Error ? error : new Error("Failed to decode VIN with Auto.dev API")
  }
}

/**
 * Check if NHTSA API response indicates "cannot decode"
 */
function isCannotDecodeResponse(result: any): boolean {
  if (!result || !result.Results || result.Results.length === 0) {
    return true
  }

  const message = result.Message?.toLowerCase() || ""
  const count = result.Count || 0

  // Check for "cannot decode" messages
  const cannotDecodePatterns = [
    "cannot decode",
    "unable to decode",
    "no data",
    "not found",
    "invalid",
  ]

  if (cannotDecodePatterns.some((pattern) => message.includes(pattern))) {
    return true
  }

  // Check if count is 0 or results are empty
  if (count === 0 || result.Results.length === 0) {
    return true
  }

  // Check if the first result has no meaningful data
  const firstResult = result.Results[0]
  if (firstResult) {
    const hasData =
      firstResult.Make || firstResult.Model || firstResult.ModelYear || firstResult.Manufacturer

    if (!hasData) {
      return true
    }
  }

  return false
}

/**
 * Enhanced VIN decode function with comprehensive error handling and data mapping
 * Implements PRD requirements for parallel API calls and graceful fallbacks
 * Falls back to Auto.dev API if NHTSA API fails or returns "cannot decode"
 */
export async function decodeVehicle(vin: string): Promise<DecodedVehicle> {
  const vinUpper = vin.toUpperCase().trim()
  const wmi = vinUpper.substring(0, 3)

  // Validate VIN offline first
  // if (!validateVinOffline(vinUpper)) {
  //   throw new Error("Invalid VIN format")
  // }

  try {
    // Execute parallel API calls with enhanced error handling
    const [vinResult, wmiResult] = await Promise.allSettled([
      DecodeVinValuesExtended(vinUpper).catch(() => DecodeVinValues(vinUpper)),
      DecodeWMI(wmi),
    ])

    // Check if NHTSA API failed or returned "cannot decode"
    const shouldUseFallback =
      vinResult.status === "rejected" ||
      (vinResult.status === "fulfilled" && isCannotDecodeResponse(vinResult.value))

    // If NHTSA failed or cannot decode, try Auto.dev API as fallback
    if (shouldUseFallback) {
      try {
        // console.log("NHTSA API failed or cannot decode, falling back to Auto.dev API")
        return await decodeWithAutoDev(vinUpper)
      } catch (autoDevError) {
        // If Auto.dev also fails, throw the original error or Auto.dev error
        if (vinResult.status === "rejected") {
          throw vinResult.reason || autoDevError
        }
        throw autoDevError
      }
    }

    // Initialize vehicle with metadata
    const vehicle: DecodedVehicle = {
      vin: vinUpper,
      metadata: {
        apiVersion: "3.0.4",
        decodedAt: new Date().toISOString(),
        dataSource: "extended",
        wmiDecoded: false,
      },
    }

    // Process VIN results
    if (vinResult.status === "fulfilled" && vinResult.value.Results?.length > 0) {
      const result = vinResult.value.Results[0]
      const rawData: Record<string, string> = {}

      // Store all fields as raw data
      Object.keys(result).forEach((key) => {
        const value = result[key as keyof typeof result]
        if (value !== null && value !== undefined) {
          rawData[key] = String(value)
        }
      })

      // Enhanced value extraction with better cleaning
      const getValue = (fieldName: string): string | undefined => {
        const value = result[fieldName as keyof typeof result]
        if (!value) return undefined

        const stringValue = String(value).trim()
        const invalidValues = ["", "Not Applicable", "N/A", "null", "undefined", "0"]

        return invalidValues.includes(stringValue) ? undefined : stringValue
      }

      // Update metadata based on actual data source
      if (vehicle.metadata) {
        vehicle.metadata.dataSource = Object.prototype.hasOwnProperty.call(rawData, "ExtendedData")
          ? "extended"
          : "standard"
      }

      // Map basic vehicle information
      Object.assign(vehicle, {
        make: getValue("Make") || getValue("Manufacturer"),
        model: getValue("Model"),
        year: getValue("ModelYear"),
        trim: getValue("Trim"),
        trim2: getValue("Trim2"),
        bodyClass: getValue("BodyClass"),
        vehicleType: getValue("VehicleType"),
        driveType: getValue("DriveType"),
        doors: getValue("Doors"),
        gvwr: getValue("GVWR"),
      })

      // Enhanced Engine Information mapping
      const engineData = {
        cylinders: getValue("EngineCylinders"),
        displacementCc: getValue("DisplacementCC"),
        displacementL: getValue("DisplacementL"),
        fuelType: getValue("FuelTypePrimary"),
        fuelTypeSecondary: getValue("FuelTypeSecondary"),
        powerKw: getValue("EngineKW"),
        configuration: getValue("EngineConfiguration"),
        manufacturer: getValue("EngineManufacturer"),
        model: getValue("EngineModel"),
        cycles: getValue("EngineCycles"),
      }

      // Only create engine object if we have data
      const hasEngineData = Object.values(engineData).some((value) => value !== undefined)
      if (hasEngineData) {
        vehicle.engine = { ...engineData }

        // Convert kW to HP if available
        if (engineData.powerKw && vehicle.engine) {
          const kw = parseFloat(engineData.powerKw)
          if (!isNaN(kw)) {
            vehicle.engine.powerHp = Math.round(kw * 1.34102).toString()
          }
        }
      }

      // Enhanced Transmission mapping
      const transmissionData = {
        type: getValue("TransmissionStyle"),
        style: getValue("TransmissionType"),
        speeds: getValue("TransmissionSpeeds"),
      }

      const hasTransmissionData = Object.values(transmissionData).some(
        (value) => value !== undefined
      )
      if (hasTransmissionData) {
        vehicle.transmission = { ...transmissionData }
      }

      // Enhanced Manufacturing mapping
      const manufacturingData = {
        wmi,
        plantCity: getValue("PlantCity"),
        plantCountry: getValue("PlantCountry"),
        plantState: getValue("PlantState"),
        manufacturerId: getValue("ManufacturerId"),
        manufacturerName: getValue("ManufacturerName"),
        commonName: getValue("CommonName"),
        parentCompanyName: getValue("ParentCompanyName"),
      }

      vehicle.manufacturing = manufacturingData

      // Enhanced Safety Features mapping
      const safetyData = {
        airbags:
          getValue("AirBagLocFront") || getValue("AirBagLocCurtain") || getValue("AirBagLocSide"),
        airBagLocations: [
          getValue("AirBagLocFront"),
          getValue("AirBagLocCurtain"),
          getValue("AirBagLocSide"),
          getValue("AirBagLocKnee"),
        ].filter(Boolean) as string[],
        seatBelts: getValue("SeatBeltsAll"),
        abs: getValue("ABS"),
        esc: getValue("ESC"),
        tpms: getValue("TPMS"),
        daytimeRunningLight: getValue("DaytimeRunningLight"),
        blindSpotMonitoring: getValue("BlindSpotMonitoring"),
      }

      const hasSafetyData = Object.values(safetyData).some((value) =>
        Array.isArray(value) ? value.length > 0 : value !== undefined
      )
      if (hasSafetyData) {
        vehicle.safety = safetyData
      }

      // Enhanced Dimensions mapping
      const dimensionsData = {
        wheelBase: getValue("WheelBase"),
        trackWidth: getValue("TrackWidth"),
        curbWeight: getValue("CurbWeight"),
        bedLength: getValue("BedLength"),
        bedType: getValue("BedType"),
      }

      const hasDimensionsData = Object.values(dimensionsData).some((value) => value !== undefined)
      if (hasDimensionsData) {
        vehicle.dimensions = dimensionsData
      }

      // Store raw data for advanced users
      vehicle.raw = rawData
    }

    // Process WMI results with enhanced error handling
    if (wmiResult.status === "fulfilled" && wmiResult.value.Results?.length > 0) {
      const wmiData = wmiResult.value.Results[0]

      if (!vehicle.manufacturing) {
        vehicle.manufacturing = { wmi }
      }

      // Enhanced WMI data processing
      const wmiManufacturerName = wmiData.ManufacturerName || wmiData.CommonName
      const wmiMake = wmiData.Make
      const wmiVehicleType = wmiData.VehicleType

      // Merge WMI data with existing manufacturing info
      Object.assign(vehicle.manufacturing, {
        manufacturerName: wmiManufacturerName || vehicle.manufacturing.manufacturerName,
        commonName: wmiData.CommonName || vehicle.manufacturing.commonName,
        parentCompanyName: wmiData.ParentCompanyName || vehicle.manufacturing.parentCompanyName,
      })

      // Set make from WMI if not already set
      if (wmiMake && !vehicle.make) {
        Object.assign(vehicle, { make: String(wmiMake) })
      }

      // Set vehicle type from WMI if not already set
      if (wmiVehicleType && !vehicle.vehicleType) {
        Object.assign(vehicle, { vehicleType: String(wmiVehicleType) })
      }

      // Update metadata
      if (vehicle.metadata) {
        vehicle.metadata.wmiDecoded = true
      }
    }

    // Ensure manufacturing object exists with at least WMI
    if (!vehicle.manufacturing) {
      vehicle.manufacturing = { wmi }
    }

    return vehicle
  } catch (error) {
    console.error("VIN decode error:", error)
    throw new Error(
      error instanceof Error
        ? `Failed to decode VIN: ${error.message}`
        : "Failed to decode VIN: Unknown error"
    )
  }
}
