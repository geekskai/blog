import {
  DecodeVinValuesExtended,
  DecodeVinValues,
  DecodeWMI,
  isValidVin as validateVinOffline,
} from "@shaggytools/nhtsa-api-wrapper"
import { DecodedVehicle, VPICResponse, ManufacturerInfo } from "../types"

// API configuration
const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
} as const

/**
 * Enhanced VIN decode function with comprehensive error handling and data mapping
 * Implements PRD requirements for parallel API calls and graceful fallbacks
 */
export async function decodeVehicle(vin: string): Promise<DecodedVehicle> {
  const vinUpper = vin.toUpperCase().trim()
  const wmi = vinUpper.substring(0, 3)

  // Validate VIN offline first
  if (!validateVinOffline(vinUpper)) {
    throw new Error("Invalid VIN format")
  }

  try {
    // Execute parallel API calls with enhanced error handling
    const [vinResult, wmiResult] = await Promise.allSettled([
      DecodeVinValuesExtended(vinUpper).catch(() => DecodeVinValues(vinUpper)),
      DecodeWMI(wmi),
    ])

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

/**
 * Export the official validation function for consistency
 */
export { validateVinOffline as isValidVin }
