import { DecodedVehicle, HistoryItem } from "../types"

// Enhanced cache configuration per PRD requirements
const CACHE_CONFIG = {
  keyPrefix: "vin_decoder_v2_",
  historyKey: "vin_decoder_v2_history",
  cacheKey: "vin_decoder_v2_cache",
  maxHistoryItems: 10,
  maxCacheItems: 50,
  cacheTTL: 24 * 60 * 60 * 1000, // 24 hours as per PRD
  compressionThreshold: 1000, // Compress large payloads
} as const

interface CacheEntry {
  readonly vehicle: DecodedVehicle
  readonly timestamp: number
  readonly hits: number // Track usage frequency
  readonly compressed?: boolean
}

/**
 * Enhanced LRU cache for VIN decode results with performance optimizations
 */
class VINCache {
  private cache: Map<string, CacheEntry> = new Map()
  private accessCount = 0

  constructor() {
    this.loadFromStorage()
  }

  /**
   * Get cached vehicle data with hit tracking
   */
  get(vin: string): DecodedVehicle | null {
    const vinKey = vin.toUpperCase()
    const entry = this.cache.get(vinKey)

    if (!entry) return null

    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_CONFIG.cacheTTL) {
      this.cache.delete(vinKey)
      this.saveToStorage()
      return null
    }

    // Update hit count and move to end (most recently used)
    const updatedEntry: CacheEntry = {
      ...entry,
      hits: entry.hits + 1,
    }

    this.cache.delete(vinKey)
    this.cache.set(vinKey, updatedEntry)

    // Periodic cleanup every 100 accesses
    this.accessCount++
    if (this.accessCount % 100 === 0) {
      this.cleanup()
    }

    return entry.vehicle
  }

  /**
   * Set cached vehicle data with enhanced storage optimization
   */
  set(vin: string, vehicle: DecodedVehicle): void {
    const vinKey = vin.toUpperCase()

    // Remove oldest entries if at capacity (LRU eviction)
    if (this.cache.size >= CACHE_CONFIG.maxCacheItems && !this.cache.has(vinKey)) {
      // Remove least recently used (first entry)
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    const entry: CacheEntry = {
      vehicle,
      timestamp: Date.now(),
      hits: 1,
    }

    this.cache.set(vinKey, entry)
    this.saveToStorage()
  }

  /**
   * Enhanced cleanup method to remove expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > CACHE_CONFIG.cacheTTL) {
        expiredKeys.push(key)
      }
    })

    expiredKeys.forEach((key) => this.cache.delete(key))

    if (expiredKeys.length > 0) {
      this.saveToStorage()
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
    this.saveToStorage()
  }

  /**
   * Load cache from localStorage with error recovery
   */
  private loadFromStorage(): void {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(CACHE_CONFIG.cacheKey)
      if (stored) {
        const entries = JSON.parse(stored) as Array<[string, CacheEntry]>

        // Validate and filter entries
        const validEntries = entries.filter(([key, entry]) => {
          return (
            key &&
            entry &&
            entry.vehicle &&
            entry.timestamp &&
            Date.now() - entry.timestamp < CACHE_CONFIG.cacheTTL
          )
        })

        this.cache = new Map(validEntries)
      }
    } catch (error) {
      console.warn("Failed to load cache, starting fresh:", error)
      this.cache = new Map()
    }
  }

  /**
   * Save cache to localStorage with error handling
   */
  private saveToStorage(): void {
    if (typeof window === "undefined") return

    try {
      const entries = Array.from(this.cache.entries())
      localStorage.setItem(CACHE_CONFIG.cacheKey, JSON.stringify(entries))
    } catch (error) {
      console.error("Failed to save cache:", error)

      // If storage is full, try to clear old entries and retry
      if (error instanceof DOMException && error.code === 22) {
        this.cache.clear()
        try {
          localStorage.setItem(CACHE_CONFIG.cacheKey, JSON.stringify([]))
        } catch {
          console.error("Unable to save cache even after clearing")
        }
      }
    }
  }
}

// Singleton cache instance
export const vinCache = new VINCache()

/**
 * History management functions
 */
/**
 * Enhanced history management with improved error handling
 */
export const history = {
  /**
   * Get decode history with validation
   */
  get(): HistoryItem[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(CACHE_CONFIG.historyKey)
      if (stored) {
        const items = JSON.parse(stored) as HistoryItem[]

        // Validate and filter history items
        return items
          .filter((item) => item && item.id && item.vin && item.timestamp && item.vehicle)
          .slice(0, CACHE_CONFIG.maxHistoryItems)
      }
    } catch (error) {
      console.warn("Failed to load history, starting fresh:", error)
    }

    return []
  },

  /**
   * Add item to history with deduplication
   */
  add(vehicle: DecodedVehicle): void {
    if (typeof window === "undefined") return

    try {
      const items = this.get()

      // Remove duplicate if exists
      const filtered = items.filter((item) => item.vin !== vehicle.vin)

      // Create new history item with enhanced metadata
      const newItem: HistoryItem = {
        id: `${vehicle.vin}_${Date.now()}`,
        vin: vehicle.vin,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        timestamp: Date.now(),
        vehicle,
      }

      // Add to beginning and limit size
      const updated = [newItem, ...filtered].slice(0, CACHE_CONFIG.maxHistoryItems)

      localStorage.setItem(CACHE_CONFIG.historyKey, JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to save history:", error)

      // If storage is full, try to save with reduced history
      if (error instanceof DOMException && error.code === 22) {
        try {
          const reducedHistory = this.get().slice(0, Math.floor(CACHE_CONFIG.maxHistoryItems / 2))
          localStorage.setItem(CACHE_CONFIG.historyKey, JSON.stringify(reducedHistory))
        } catch {
          console.error("Unable to save history even with reduced size")
        }
      }
    }
  },

  /**
   * Clear all history
   */
  clear(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(CACHE_CONFIG.historyKey)
    } catch (error) {
      console.error("Failed to clear history:", error)
    }
  },

  /**
   * Remove specific item from history
   */
  remove(id: string): void {
    if (typeof window === "undefined") return

    try {
      const items = this.get()
      const filtered = items.filter((item) => item.id !== id)
      localStorage.setItem(CACHE_CONFIG.historyKey, JSON.stringify(filtered))
    } catch (error) {
      console.error("Failed to update history:", error)
    }
  },
}

/**
 * Dedupe concurrent requests for the same VIN
 */
const pendingRequests = new Map<string, Promise<DecodedVehicle>>()

export function dedupeRequest(
  vin: string,
  fetcher: () => Promise<DecodedVehicle>
): Promise<DecodedVehicle> {
  const vinUpper = vin.toUpperCase()

  // Check if there's already a pending request
  const pending = pendingRequests.get(vinUpper)
  if (pending) {
    return pending
  }

  // Create new request
  const request = fetcher().finally(() => {
    pendingRequests.delete(vinUpper)
  })

  pendingRequests.set(vinUpper, request)
  return request
}
