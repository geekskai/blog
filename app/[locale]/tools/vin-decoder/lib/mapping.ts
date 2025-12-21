import { DecodedVehicle } from "../types"

/**
 * Format and clean vehicle data for display
 */
export function formatVehicleData(vehicle: DecodedVehicle): DecodedVehicle {
  const formatted = { ...vehicle }

  // Clean up empty or "Not Applicable" values
  Object.keys(formatted).forEach((key) => {
    const value = (formatted as any)[key]
    if (
      typeof value === "string" &&
      (value === "Not Applicable" || value === "N/A" || value === "" || value === "null")
    ) {
      delete (formatted as any)[key]
    }
  })

  return formatted
}

/**
 * Get display value or fallback
 */
export function getDisplayValue(
  value: string | undefined,
  fallback?: string,
  t?: (key: string, values?: Record<string, any>) => string
): string {
  const defaultFallback = t ? t("mapping.not_available") : "Not available"
  const finalFallback = fallback || defaultFallback

  if (!value || value === "Not Applicable" || value === "N/A" || value === "null") {
    return finalFallback
  }
  return value
}

/**
 * Format engine displacement for display
 */
export function formatEngineDisplacement(
  cc?: string,
  liters?: string,
  t?: (key: string, values?: Record<string, any>) => string
): string {
  const parts: string[] = []
  const notAvailable = t ? t("mapping.not_available") : "Not available"

  if (liters && liters !== "Not Applicable") {
    parts.push(`${liters}L`)
  }

  if (cc && cc !== "Not Applicable") {
    parts.push(`${cc}cc`)
  }

  return parts.join(" / ") || notAvailable
}

/**
 * Format vehicle summary for sharing
 */
export function formatVehicleSummary(
  vehicle: DecodedVehicle,
  t?: (key: string, values?: Record<string, any>) => string
): string {
  const getText = (key: string, fallback: string) => (t ? t(key) : fallback)
  const parts: string[] = []

  // Year Make Model
  if (vehicle.year || vehicle.make || vehicle.model) {
    const yearMakeModel = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")
    parts.push(yearMakeModel)
  }

  // Trim
  if (vehicle.trim) {
    parts.push(`${getText("mapping.trim", "Trim")}: ${vehicle.trim}`)
  }

  // Body
  if (vehicle.bodyClass) {
    parts.push(`${getText("mapping.body", "Body")}: ${vehicle.bodyClass}`)
  }

  // Engine
  if (vehicle.engine) {
    const engineParts: string[] = []

    if (vehicle.engine.cylinders) {
      engineParts.push(`${vehicle.engine.cylinders} ${getText("mapping.cylinders", "cylinders")}`)
    }

    const displacement = formatEngineDisplacement(
      vehicle.engine.displacementCc,
      vehicle.engine.displacementL,
      t
    )
    const notAvailable = t ? t("mapping.not_available") : "Not available"
    if (displacement !== notAvailable) {
      engineParts.push(displacement)
    }

    if (vehicle.engine.fuelType) {
      engineParts.push(vehicle.engine.fuelType)
    }

    if (engineParts.length > 0) {
      parts.push(`${getText("mapping.engine", "Engine")}: ${engineParts.join(", ")}`)
    }
  }

  // Drive Type
  if (vehicle.driveType) {
    parts.push(`${getText("mapping.drive", "Drive")}: ${vehicle.driveType}`)
  }

  // VIN
  parts.push(`${getText("mapping.vin", "VIN")}: ${vehicle.vin}`)

  return parts.join("\n")
}

/**
 * Export vehicle data as JSON
 */
export function exportAsJSON(vehicle: DecodedVehicle, includeRaw = false): string {
  const data = includeRaw ? vehicle : { ...vehicle, raw: undefined }
  return JSON.stringify(data, null, 2)
}

/**
 * Export vehicle data as CSV
 */
export function exportAsCSV(vehicle: DecodedVehicle): string {
  const rows: string[][] = []

  // Headers and values
  rows.push(["Field", "Value"])

  // Basic info
  rows.push(["VIN", vehicle.vin])
  rows.push(["Year", getDisplayValue(vehicle.year)])
  rows.push(["Make", getDisplayValue(vehicle.make)])
  rows.push(["Model", getDisplayValue(vehicle.model)])
  rows.push(["Trim", getDisplayValue(vehicle.trim)])
  rows.push(["Body Class", getDisplayValue(vehicle.bodyClass)])
  rows.push(["Vehicle Type", getDisplayValue(vehicle.vehicleType)])
  rows.push(["Drive Type", getDisplayValue(vehicle.driveType)])
  rows.push(["Doors", getDisplayValue(vehicle.doors)])
  rows.push(["GVWR", getDisplayValue(vehicle.gvwr)])

  // Engine
  if (vehicle.engine) {
    rows.push(["Engine Cylinders", getDisplayValue(vehicle.engine.cylinders)])
    rows.push(["Engine Displacement (L)", getDisplayValue(vehicle.engine.displacementL)])
    rows.push(["Engine Displacement (CC)", getDisplayValue(vehicle.engine.displacementCc)])
    rows.push(["Fuel Type", getDisplayValue(vehicle.engine.fuelType)])
    rows.push(["Engine Power (HP)", getDisplayValue(vehicle.engine.powerHp)])
    rows.push(["Engine Configuration", getDisplayValue(vehicle.engine.configuration)])
    rows.push(["Engine Manufacturer", getDisplayValue(vehicle.engine.manufacturer)])
  }

  // Transmission
  if (vehicle.transmission) {
    rows.push(["Transmission Type", getDisplayValue(vehicle.transmission.type)])
    rows.push(["Transmission Speeds", getDisplayValue(vehicle.transmission.speeds)])
  }

  // Manufacturing
  if (vehicle.manufacturing) {
    rows.push(["WMI", vehicle.manufacturing.wmi])
    rows.push(["Manufacturer", getDisplayValue(vehicle.manufacturing.manufacturerName)])
    rows.push(["Plant City", getDisplayValue(vehicle.manufacturing.plantCity)])
    rows.push(["Plant State", getDisplayValue(vehicle.manufacturing.plantState)])
    rows.push(["Plant Country", getDisplayValue(vehicle.manufacturing.plantCountry)])
  }

  // Safety
  if (vehicle.safety) {
    rows.push(["Airbags", getDisplayValue(vehicle.safety.airbags)])
    rows.push(["Seat Belts", getDisplayValue(vehicle.safety.seatBelts)])
    rows.push(["ABS", getDisplayValue(vehicle.safety.abs)])
    rows.push(["ESC", getDisplayValue(vehicle.safety.esc)])
    rows.push(["TPMS", getDisplayValue(vehicle.safety.tpms)])
  }

  // Convert to CSV string
  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

/**
 * Export vehicle data as plain text
 */
export function exportAsText(vehicle: DecodedVehicle): string {
  const lines: string[] = []

  lines.push("=== VEHICLE INFORMATION ===")
  lines.push("")

  // Basic info
  lines.push(`VIN: ${vehicle.vin}`)
  lines.push(`Year: ${getDisplayValue(vehicle.year)}`)
  lines.push(`Make: ${getDisplayValue(vehicle.make)}`)
  lines.push(`Model: ${getDisplayValue(vehicle.model)}`)
  lines.push(`Trim: ${getDisplayValue(vehicle.trim)}`)
  lines.push(`Body Class: ${getDisplayValue(vehicle.bodyClass)}`)
  lines.push(`Vehicle Type: ${getDisplayValue(vehicle.vehicleType)}`)
  lines.push(`Drive Type: ${getDisplayValue(vehicle.driveType)}`)
  lines.push(`Doors: ${getDisplayValue(vehicle.doors)}`)
  lines.push(`GVWR: ${getDisplayValue(vehicle.gvwr)}`)

  // Engine
  if (vehicle.engine) {
    lines.push("")
    lines.push("=== ENGINE ===")
    lines.push(`Cylinders: ${getDisplayValue(vehicle.engine.cylinders)}`)
    lines.push(
      `Displacement: ${formatEngineDisplacement(vehicle.engine.displacementCc, vehicle.engine.displacementL)}`
    )
    lines.push(`Fuel Type: ${getDisplayValue(vehicle.engine.fuelType)}`)
    lines.push(`Power: ${getDisplayValue(vehicle.engine.powerHp)} HP`)
    lines.push(`Configuration: ${getDisplayValue(vehicle.engine.configuration)}`)
    lines.push(`Manufacturer: ${getDisplayValue(vehicle.engine.manufacturer)}`)
  }

  // Transmission
  if (vehicle.transmission) {
    lines.push("")
    lines.push("=== TRANSMISSION ===")
    lines.push(`Type: ${getDisplayValue(vehicle.transmission.type)}`)
    lines.push(`Speeds: ${getDisplayValue(vehicle.transmission.speeds)}`)
  }

  // Manufacturing
  if (vehicle.manufacturing) {
    lines.push("")
    lines.push("=== MANUFACTURING ===")
    lines.push(`WMI: ${vehicle.manufacturing.wmi}`)
    lines.push(`Manufacturer: ${getDisplayValue(vehicle.manufacturing.manufacturerName)}`)
    lines.push(`Plant City: ${getDisplayValue(vehicle.manufacturing.plantCity)}`)
    lines.push(`Plant State: ${getDisplayValue(vehicle.manufacturing.plantState)}`)
    lines.push(`Plant Country: ${getDisplayValue(vehicle.manufacturing.plantCountry)}`)
  }

  // Safety
  if (vehicle.safety) {
    lines.push("")
    lines.push("=== SAFETY ===")
    lines.push(`Airbags: ${getDisplayValue(vehicle.safety.airbags)}`)
    lines.push(`Seat Belts: ${getDisplayValue(vehicle.safety.seatBelts)}`)
    lines.push(`ABS: ${getDisplayValue(vehicle.safety.abs)}`)
    lines.push(`ESC: ${getDisplayValue(vehicle.safety.esc)}`)
    lines.push(`TPMS: ${getDisplayValue(vehicle.safety.tpms)}`)
  }

  lines.push("")
  lines.push("Generated by GeeksKai VIN Decoder")
  lines.push(new Date().toLocaleString())

  return lines.join("\n")
}

/**
 * Get vehicle title for display
 */
export function getVehicleTitle(vehicle: DecodedVehicle): string {
  const parts: string[] = []

  if (vehicle.year) parts.push(vehicle.year)
  if (vehicle.make) parts.push(vehicle.make)
  if (vehicle.model) parts.push(vehicle.model)

  if (parts.length === 0) {
    return vehicle.vin
  }

  return parts.join(" ")
}

/**
 * Get vehicle subtitle for display
 */
export function getVehicleSubtitle(vehicle: DecodedVehicle): string {
  const parts: string[] = []

  if (vehicle.trim) {
    parts.push(vehicle.trim)
  }

  if (vehicle.bodyClass) {
    parts.push(vehicle.bodyClass)
  }

  if (parts.length === 0 && vehicle.vehicleType) {
    parts.push(vehicle.vehicleType)
  }

  return parts.join(" • ")
}
