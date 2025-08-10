export interface PERMData {
  updateDate: Date
  analystReview: {
    priorityDate: string
    averageDays: number
    remainingCases: {
      [month: string]: number
    }
  }
  auditReview: {
    status: string
    averageDays?: number
  }
  reconsideration: {
    priorityDate: string
  }
}

export interface UserPERMCase {
  id: string
  submissionDate: Date
  caseType: "analyst" | "audit" | "reconsideration"
  isOEWS: boolean
  estimatedProcessingTime?: number
  currentQueuePosition?: number
  lastUpdated: Date
}

export interface ProcessingEstimate {
  optimistic: {
    date: Date
    description: string
  }
  realistic: {
    date: Date
    description: string
  }
  pessimistic: {
    date: Date
    description: string
  }
  confidence: number // 0-100
}

export interface HistoricalDataPoint {
  date: Date
  analystReviewDays: number
  priorityDate: string
  remainingCases: number
}

export interface NotificationSettings {
  enabled: boolean
  email?: string
  notifyOnUpdate: boolean
  notifyOnMilestone: boolean
  reminderFrequency: "weekly" | "monthly"
}

export interface PERMTrackerState {
  userCases: UserPERMCase[]
  currentData: PERMData | null
  historicalData: HistoricalDataPoint[]
  notifications: NotificationSettings
  isLoading: boolean
  lastFetched: Date | null
  error: string | null
}

export interface QueuePosition {
  position: number
  totalCases: number
  percentile: number
}

export interface TrendAnalysis {
  direction: "improving" | "worsening" | "stable"
  changePercent: number
  description: string
  projectedChange: number // days
}
