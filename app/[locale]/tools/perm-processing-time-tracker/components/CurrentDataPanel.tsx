"use client"

import React from "react"
import {
  Clock,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  RefreshCw,
  CheckCircle,
} from "lucide-react"
import { PERMData, TrendAnalysis } from "../types"
import { formatTimeRemaining, getDataFreshness } from "../utils/permDataParser"

interface CurrentDataPanelProps {
  data: PERMData | null
  trendAnalysis: TrendAnalysis
  isLoading: boolean
  lastFetched: Date | null
  onRefresh: () => void
}

export default function CurrentDataPanel({
  data,
  trendAnalysis,
  isLoading,
  lastFetched,
  onRefresh,
}: CurrentDataPanelProps) {
  if (!data) {
    return (
      <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="border-b border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Current PERM Processing Times</h2>
        </div>
        <div className="p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700">
            {isLoading ? (
              <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
            ) : (
              <Clock className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            {isLoading ? "Fetching Latest Data..." : "No Data Available"}
          </h3>
          <p className="mb-6 text-slate-400">
            {isLoading
              ? "Getting the latest PERM processing times from the DOL website. This may take a few moments."
              : "Click the refresh button to fetch the latest PERM processing times from the DOL website."}
          </p>
          {!isLoading && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Fetch Latest Data</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  const totalRemainingCases = Object.values(data.analystReview.remainingCases).reduce(
    (sum, cases) => sum + cases,
    0
  )

  const dataFreshness = lastFetched ? getDataFreshness(lastFetched) : null

  const getTrendIcon = () => {
    switch (trendAnalysis.direction) {
      case "improving":
        return <TrendingDown className="h-5 w-5 text-green-400" />
      case "worsening":
        return <TrendingUp className="h-5 w-5 text-red-400" />
      default:
        return <Minus className="h-5 w-5 text-yellow-400" />
    }
  }

  const getTrendColor = () => {
    switch (trendAnalysis.direction) {
      case "improving":
        return "text-green-400"
      case "worsening":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Current PERM Processing Times</h2>
              {dataFreshness && (
                <div className="mt-1 flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      dataFreshness.status === "fresh"
                        ? "bg-green-400"
                        : dataFreshness.status === "stale"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-slate-400">
                    {dataFreshness.description} ({dataFreshness.hoursOld}h ago)
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {lastFetched && (
                <div className="flex items-center space-x-1 text-xs text-slate-400">
                  <CheckCircle className="h-3 w-3" />
                  <span>Updated {lastFetched.toLocaleDateString()}</span>
                </div>
              )}
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Current Processing Time */}
            <div className="rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Average Processing Time</p>
                  <p className="text-2xl font-bold text-white">
                    {data.analystReview.averageDays} days
                  </p>
                  <p className="text-xs text-slate-400">
                    ~{Math.round(data.analystReview.averageDays / 30)} months
                  </p>
                </div>
              </div>
            </div>

            {/* Current Priority Date */}
            <div className="rounded-lg bg-gradient-to-r from-green-500/20 to-teal-500/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-500/20 p-2">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Currently Processing</p>
                  <p className="text-lg font-bold text-white">{data.analystReview.priorityDate}</p>
                  <p className="text-xs text-slate-400">Priority Date</p>
                </div>
              </div>
            </div>

            {/* Queue Length */}
            <div className="rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-orange-500/20 p-2">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Cases in Queue</p>
                  <p className="text-2xl font-bold text-white">
                    {totalRemainingCases.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">Pending Review</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="mt-6 rounded-lg bg-slate-700/50 p-4">
            <div className="flex items-start space-x-3">
              {getTrendIcon()}
              <div className="flex-1">
                <h3 className="font-medium text-white">Processing Trend</h3>
                <p className="mt-1 text-sm text-slate-300">{trendAnalysis.description}</p>
                {trendAnalysis.projectedChange !== 0 && (
                  <p className="mt-1 text-xs">
                    <span className={getTrendColor()}>
                      {trendAnalysis.direction === "improving" ? "-" : "+"}
                      {Math.abs(trendAnalysis.projectedChange)} days
                    </span>
                    <span className="text-slate-400"> projected change</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Breakdown */}
      <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="border-b border-slate-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Queue Breakdown by Month</h3>
        </div>
        <div className="max-h-64 overflow-y-auto p-6">
          <div className="space-y-3">
            {Object.entries(data.analystReview.remainingCases)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([month, cases]) => {
                const percentage = (cases / totalRemainingCases) * 100
                const isCurrentMonth = month === data.analystReview.priorityDate

                return (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-medium ${isCurrentMonth ? "text-blue-400" : "text-slate-300"}`}
                        >
                          {month}
                        </span>
                        {isCurrentMonth && (
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                            Currently Processing
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-white">{cases.toLocaleString()} cases</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCurrentMonth ? "bg-blue-500" : "bg-slate-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Additional Processing Queues */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Audit Review */}
        <div className="rounded-xl bg-slate-800/80 p-6 ring-1 ring-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Audit Review</h3>
          </div>
          <div className="mt-3">
            <p className="text-sm text-slate-400">Status: {data.auditReview.status}</p>
            {data.auditReview.averageDays && (
              <p className="text-sm text-slate-400">Average: {data.auditReview.averageDays} days</p>
            )}
          </div>
        </div>

        {/* Reconsideration */}
        <div className="rounded-xl bg-slate-800/80 p-6 ring-1 ring-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-white">Reconsideration</h3>
          </div>
          <div className="mt-3">
            <p className="text-sm text-slate-400">
              Currently Processing: {data.reconsideration.priorityDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
