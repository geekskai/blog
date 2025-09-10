// VIN Decoder Types - Enhanced per PRD v2.0

/**
 * Enhanced DecodedVehicle interface with comprehensive VPIC data
 * Supports all features from @shaggytools/nhtsa-api-wrapper
 */
export interface DecodedVehicle {
  vin: string

  // Basic Information
  year?: string
  make?: string
  model?: string
  trim?: string
  trim2?: string
  bodyClass?: string
  vehicleType?: string
  driveType?: string
  doors?: string
  gvwr?: string

  // Engine Specifications
  engine?: {
    cylinders?: string
    displacementCc?: string
    displacementL?: string
    fuelType?: string
    fuelTypeSecondary?: string
    powerHp?: string
    powerKw?: string
    configuration?: string
    manufacturer?: string
    model?: string
    cycles?: string
  }

  // Transmission
  transmission?: {
    type?: string
    style?: string
    speeds?: string
  }

  // Manufacturing Details
  manufacturing?: {
    wmi: string
    plantCity?: string
    plantCountry?: string
    plantState?: string
    manufacturerName?: string
    manufacturerId?: string
    commonName?: string
    parentCompanyName?: string
  }

  // Safety Features
  safety?: {
    airbags?: string
    airBagLocations?: string[]
    seatBelts?: string
    abs?: string
    esc?: string
    tpms?: string
    daytimeRunningLight?: string
    blindSpotMonitoring?: string
  }

  // Additional Specifications
  dimensions?: {
    wheelBase?: string
    trackWidth?: string
    curbWeight?: string
    bedLength?: string
    bedType?: string
  }

  // Canadian Specifications (if available)
  canadianSpecs?: {
    available: boolean
    specifications?: Record<string, string>
  }

  // Raw VPIC data for advanced users
  raw?: Record<string, string>

  // API Metadata
  metadata?: {
    apiVersion: string
    decodedAt: string
    dataSource: "extended" | "standard" | "basic"
    wmiDecoded: boolean
  }
}

export type DecodeStatus =
  | "idle"
  | "loading"
  | "success"
  | "invalid_vin"
  | "no_data"
  | "network_error"

export interface DecodeResult {
  status: DecodeStatus
  vehicle?: DecodedVehicle
  message?: string
  timestamp?: number
}

export interface VINValidationResult {
  isValid: boolean
  error?: string
  checkDigit?: {
    expected: string
    actual: string
    isValid: boolean
  }
}

export interface SearchState {
  vin: string
  isValidating: boolean
  validationResult?: VINValidationResult
  decodeResult?: DecodeResult
  isDecoding: boolean
}

export interface HistoryItem {
  id: string
  vin: string
  make?: string
  model?: string
  year?: string
  timestamp: number
  vehicle?: DecodedVehicle
}

export interface BrandInfo {
  slug: string
  name: string
  fullName: string
  description: string
  commonWMIs: string[]
  popularModels?: string[]
  country?: string
}

export interface ExportFormat {
  type: "json" | "csv" | "txt"
  includeRaw: boolean
}

// Batch processing interface
export interface BatchDecodeResult {
  results: DecodedVehicle[]
  errors: Array<{
    vin: string
    error: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

// Enhanced API response types
export interface VPICResponse<T = any> {
  Count: number
  Message: string
  SearchCriteria: string | null
  Results: T[]
}

// Manufacturer information from WMI decode
export interface ManufacturerInfo {
  CommonName?: string
  ManufacturerName?: string
  Make?: string
  ParentCompanyName?: string
  VehicleType?: string
  Country?: string
  CreatedOn?: string
  UpdatedOn?: string
}

// Legacy API response types (kept for compatibility)
export interface WMIResponse {
  Count: number
  Message: string
  SearchCriteria: string | null
  Results: Array<{
    Country?: string
    CreatedOn?: string
    DateAvailableToPublic?: string
    Id?: number
    Name?: string
    UpdatedOn?: string
    URL?: string
    VehicleType?: string
    WMI?: string
  }>
}

// Component Props
export interface VinInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isValid: boolean
  error?: string
  isLoading?: boolean
  placeholder?: string
  autoFocus?: boolean
}

export interface ResultSummaryProps {
  vehicle: DecodedVehicle
  onCopy?: () => void
  onShare?: () => void
}

export interface HistoryPanelProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClear: () => void
  maxItems?: number
}

export interface ShareExportBarProps {
  vehicle: DecodedVehicle | null
  onCopy: () => void
  onExport: (format: ExportFormat) => void
  onShare: () => void
}

// Brand Pages
export const SUPPORTED_BRANDS: BrandInfo[] = [
  {
    slug: "bmw",
    name: "BMW",
    fullName: "Bayerische Motoren Werke",
    description:
      "Decode BMW Vehicle Identification Numbers to get detailed specifications for BMW cars and SUVs.",
    commonWMIs: ["WBA", "WBS", "WBY", "WBW", "WBX"],
    popularModels: ["3 Series", "5 Series", "X3", "X5", "M3"],
    country: "Germany",
  },
  {
    slug: "chevrolet",
    name: "Chevrolet",
    fullName: "Chevrolet",
    description:
      "Decode Chevrolet VINs to get complete vehicle specifications for Chevy cars, trucks, and SUVs.",
    commonWMIs: ["1G1", "1GB", "1GC", "1GN", "2G1", "3GC", "3GN"],
    popularModels: ["Silverado", "Equinox", "Malibu", "Tahoe", "Camaro"],
    country: "United States",
  },
  {
    slug: "ford",
    name: "Ford",
    fullName: "Ford Motor Company",
    description:
      "Decode Ford VINs to get detailed specifications for Ford vehicles including F-Series, Mustang, and more.",
    commonWMIs: ["1FA", "1FB", "1FC", "1FD", "1FM", "1FT", "2FA", "3FA"],
    popularModels: ["F-150", "Mustang", "Explorer", "Escape", "Bronco"],
    country: "United States",
  },
  {
    slug: "toyota",
    name: "Toyota",
    fullName: "Toyota Motor Corporation",
    description:
      "Decode Toyota VINs to get complete specifications for Toyota cars, trucks, and SUVs.",
    commonWMIs: ["JTD", "JTE", "JTK", "JTM", "JTN", "4T1", "5TD", "5TE"],
    popularModels: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma"],
    country: "Japan",
  },
  {
    slug: "honda",
    name: "Honda",
    fullName: "Honda Motor Company",
    description:
      "Decode Honda VINs to get detailed vehicle specifications for Honda cars and SUVs.",
    commonWMIs: ["JHM", "1HG", "2HG", "2HK", "2HM", "5FN", "5FP"],
    popularModels: ["Accord", "Civic", "CR-V", "Pilot", "Odyssey"],
    country: "Japan",
  },
  {
    slug: "mercedes",
    name: "Mercedes-Benz",
    fullName: "Mercedes-Benz",
    description: "Decode Mercedes-Benz VINs to get specifications for Mercedes luxury vehicles.",
    commonWMIs: ["WDB", "WDC", "WDD", "WDF", "W1K", "W1N", "W1V"],
    popularModels: ["C-Class", "E-Class", "GLE", "GLC", "S-Class"],
    country: "Germany",
  },
  {
    slug: "audi",
    name: "Audi",
    fullName: "Audi AG",
    description: "Decode Audi VINs to get detailed specifications for Audi luxury vehicles.",
    commonWMIs: ["WAU", "WA1", "WUA", "WUB", "WUC"],
    popularModels: ["A4", "A6", "Q5", "Q7", "Q3"],
    country: "Germany",
  },
  {
    slug: "nissan",
    name: "Nissan",
    fullName: "Nissan Motor Company",
    description:
      "Decode Nissan VINs to get complete vehicle specifications for Nissan cars and SUVs.",
    commonWMIs: ["JN1", "JN3", "JN6", "JN8", "1N4", "1N6", "5N1"],
    popularModels: ["Altima", "Rogue", "Sentra", "Murano", "Frontier"],
    country: "Japan",
  },
  {
    slug: "volkswagen",
    name: "Volkswagen",
    fullName: "Volkswagen",
    description: "Decode VW VINs to get specifications for Volkswagen vehicles.",
    commonWMIs: ["WVW", "WVG", "WV1", "WV2", "WV3", "1VW", "3VW", "9VW"],
    popularModels: ["Jetta", "Tiguan", "Atlas", "Golf", "Passat"],
    country: "Germany",
  },
  {
    slug: "tesla",
    name: "Tesla",
    fullName: "Tesla, Inc.",
    description: "Decode Tesla VINs to get specifications for Tesla electric vehicles.",
    commonWMIs: ["5YJ", "7SA", "SFZ", "LRW"],
    popularModels: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
    country: "United States",
  },
]

export function getBrandBySlug(slug: string): BrandInfo | undefined {
  return SUPPORTED_BRANDS.find((brand) => brand.slug === slug)
}

export function getBrandByWMI(wmi: string): BrandInfo | undefined {
  const wmiUpper = wmi.toUpperCase()
  return SUPPORTED_BRANDS.find((brand) =>
    brand.commonWMIs.some((brandWmi) => wmiUpper.startsWith(brandWmi))
  )
}
