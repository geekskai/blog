import { useState, useEffect, useCallback } from "react"
import { PERMTrackerState, UserPERMCase, PERMData, NotificationSettings } from "../types"
import {
  parsePERMData,
  fetchLatestPERMData,
  calculateProcessingEstimate,
  analyzeTrends,
  generateMockHistoricalData,
  updateHistoricalData,
  validatePERMData,
  getDataFreshness,
} from "../utils/permDataParser"

const STORAGE_KEY = "perm-tracker-data"
const LAST_FETCH_KEY = "perm-last-fetch"

export const usePERMTracker = () => {
  const [state, setState] = useState<PERMTrackerState>({
    userCases: [],
    currentData: null,
    historicalData: [],
    notifications: {
      enabled: false,
      notifyOnUpdate: true,
      notifyOnMilestone: true,
      reminderFrequency: "monthly",
    },
    isLoading: false,
    lastFetched: null,
    error: null,
  })

  // Load saved data on mount
  useEffect(() => {
    loadSavedData()
  }, [])

  // Auto-fetch data if needed
  useEffect(() => {
    const autoFetch = async () => {
      if (shouldRefreshData()) {
        try {
          await fetchLatestData()
        } catch (error) {
          // Silently fail auto-fetch - user can manually refresh
          console.warn("Auto-fetch failed:", error)
        }
      }
    }

    // Small delay to allow component to mount
    const timer = setTimeout(autoFetch, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Save data whenever state changes
  useEffect(() => {
    if (state.userCases.length > 0 || state.currentData) {
      saveData()
    }
  }, [state.userCases, state.currentData, state.notifications])

  const loadSavedData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      const lastFetch = localStorage.getItem(LAST_FETCH_KEY)

      if (savedData) {
        const parsed = JSON.parse(savedData)
        setState((prev) => ({
          ...prev,
          userCases:
            parsed.userCases?.map((userCase: any) => ({
              ...userCase,
              submissionDate: new Date(userCase.submissionDate),
              lastUpdated: new Date(userCase.lastUpdated),
            })) || [],
          currentData: parsed.currentData
            ? {
                ...parsed.currentData,
                updateDate: new Date(parsed.currentData.updateDate),
              }
            : null,
          historicalData:
            parsed.historicalData?.map((point: any) => ({
              ...point,
              date: new Date(point.date),
            })) || generateMockHistoricalData(),
          notifications: parsed.notifications || prev.notifications,
          lastFetched: lastFetch ? new Date(lastFetch) : null,
        }))
      } else {
        // Initialize with mock data for demonstration
        setState((prev) => ({
          ...prev,
          historicalData: generateMockHistoricalData(),
        }))
      }
    } catch (error) {
      console.error("Failed to load saved data:", error)
    }
  }, [])

  const saveData = useCallback(() => {
    try {
      const dataToSave = {
        userCases: state.userCases,
        currentData: state.currentData,
        historicalData: state.historicalData,
        notifications: state.notifications,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      if (state.lastFetched) {
        localStorage.setItem(LAST_FETCH_KEY, state.lastFetched.toISOString())
      }
    } catch (error) {
      console.error("Failed to save data:", error)
    }
  }, [state])

  const fetchLatestData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Fetch real data from our API endpoint
      const newData = await fetchLatestPERMData()

      // Validate the fetched data
      if (!validatePERMData(newData)) {
        throw new Error("Invalid data received from server")
      }

      setState((prev) => ({
        ...prev,
        currentData: newData,
        historicalData: updateHistoricalData(prev.historicalData, newData),
        lastFetched: new Date(),
        isLoading: false,
      }))

      return newData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setState((prev) => ({
        ...prev,
        error: `Failed to fetch latest PERM data: ${errorMessage}`,
        isLoading: false,
      }))
      throw error
    }
  }, [])

  const addCase = useCallback(
    (
      submissionDate: Date,
      caseType: "analyst" | "audit" | "reconsideration" = "analyst",
      isOEWS: boolean = false
    ) => {
      const newCase: UserPERMCase = {
        id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        submissionDate,
        caseType,
        isOEWS,
        lastUpdated: new Date(),
      }

      // Calculate estimates if we have current data
      if (state.currentData) {
        const estimate = calculateProcessingEstimate(submissionDate, state.currentData, isOEWS)
        newCase.estimatedProcessingTime = estimate.estimatedDays
        newCase.currentQueuePosition = estimate.queuePosition.position
      }

      setState((prev) => ({
        ...prev,
        userCases: [...prev.userCases, newCase],
      }))

      return newCase
    },
    [state.currentData]
  )

  const removeCase = useCallback((caseId: string) => {
    setState((prev) => ({
      ...prev,
      userCases: prev.userCases.filter((userCase) => userCase.id !== caseId),
    }))
  }, [])

  const updateCase = useCallback((caseId: string, updates: Partial<UserPERMCase>) => {
    setState((prev) => ({
      ...prev,
      userCases: prev.userCases.map((userCase) =>
        userCase.id === caseId ? { ...userCase, ...updates, lastUpdated: new Date() } : userCase
      ),
    }))
  }, [])

  const updateNotificationSettings = useCallback((settings: Partial<NotificationSettings>) => {
    setState((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...settings },
    }))
  }, [])

  const refreshEstimates = useCallback(() => {
    if (!state.currentData) return

    setState((prev) => ({
      ...prev,
      userCases: prev.userCases.map((userCase) => {
        const estimate = calculateProcessingEstimate(
          userCase.submissionDate,
          state.currentData!,
          userCase.isOEWS
        )

        return {
          ...userCase,
          estimatedProcessingTime: estimate.estimatedDays,
          currentQueuePosition: estimate.queuePosition.position,
          lastUpdated: new Date(),
        }
      }),
    }))
  }, [state.currentData])

  const getTrendAnalysis = useCallback(() => {
    return analyzeTrends(state.historicalData)
  }, [state.historicalData])

  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LAST_FETCH_KEY)
    setState({
      userCases: [],
      currentData: null,
      historicalData: generateMockHistoricalData(),
      notifications: {
        enabled: false,
        notifyOnUpdate: true,
        notifyOnMilestone: true,
        reminderFrequency: "monthly",
      },
      isLoading: false,
      lastFetched: null,
      error: null,
    })
  }, [])

  const shouldRefreshData = useCallback(() => {
    if (!state.lastFetched) return true

    const now = new Date()
    const lastFetch = new Date(state.lastFetched)
    const hoursSinceLastFetch = (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60)

    // Refresh if more than 6 hours old
    return hoursSinceLastFetch > 6
  }, [state.lastFetched])

  return {
    // State
    ...state,

    // Computed values
    trendAnalysis: getTrendAnalysis(),
    shouldRefreshData: shouldRefreshData(),

    // Actions
    fetchLatestData,
    addCase,
    removeCase,
    updateCase,
    updateNotificationSettings,
    refreshEstimates,
    clearAllData,

    // Utilities
    hasUserCases: state.userCases.length > 0,
    totalCases: state.userCases.length,
  }
}
