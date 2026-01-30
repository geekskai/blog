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
import { useTranslations } from "next-intl"

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
  const t = useTranslations("PERMProcessingTimeTracker")

  if (!data) {
    return (
      <div className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="border-b border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{t("current_data.title")}</h2>
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
            {isLoading ? t("current_data.fetching_title") : t("current_data.no_data_title")}
          </h3>
          <p className="mb-6 text-slate-400">
            {isLoading
              ? t("current_data.fetching_description")
              : t("current_data.no_data_description")}
          </p>
          {!isLoading && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{t("current_data.fetch_button")}</span>
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
    <section className="space-y-6" aria-label="Current PERM Processing Data">
      {/* Main Stats Card */}
      <article className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
        <div className="border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">{t("current_data.title")}</h2>
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
                  <span>
                    {t("current_data.updated")} {lastFetched.toLocaleDateString()}
                  </span>
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
          {/* Key Metrics - SEO Optimized with Semantic Structure */}
          <dl className="grid gap-6 md:grid-cols-3">
            {/* Current Processing Time */}
            <div className="rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <Clock className="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-300">
                    {t("current_data.average_processing_time")}
                  </dt>
                  <dd className="text-2xl font-bold text-white">
                    <strong>
                      {data.analystReview.averageDays} {t("current_data.days")}
                    </strong>
                  </dd>
                  <dd className="text-xs text-slate-400">
                    ~{Math.round(data.analystReview.averageDays / 30)} months
                  </dd>
                </div>
              </div>
            </div>

            {/* Current Priority Date */}
            <div className="rounded-lg bg-gradient-to-r from-green-500/20 to-teal-500/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-500/20 p-2">
                  <Calendar className="h-6 w-6 text-green-400" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-300">
                    {t("current_data.currently_processing")}
                  </dt>
                  <dd className="text-lg font-bold text-white">
                    <strong>{data.analystReview.priorityDate}</strong>
                  </dd>
                  <dd className="text-xs text-slate-400">{t("current_data.priority_date")}</dd>
                </div>
              </div>
            </div>

            {/* Queue Length */}
            <div className="rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-orange-500/20 p-2">
                  <Users className="h-6 w-6 text-orange-400" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-300">
                    {t("current_data.cases_in_queue")}
                  </dt>
                  <dd className="text-2xl font-bold text-white">
                    <strong>{totalRemainingCases.toLocaleString()}</strong>
                  </dd>
                  <dd className="text-xs text-slate-400">{t("current_data.pending_review")}</dd>
                </div>
              </div>
            </div>
          </dl>

          {/* Trend Analysis */}
          <div className="mt-6 rounded-lg bg-slate-700/50 p-4">
            <div className="flex items-start space-x-3">
              <span aria-hidden="true">{getTrendIcon()}</span>
              <div className="flex-1">
                <h3 className="font-medium text-white">{t("current_data.processing_trend")}</h3>
                <p className="mt-1 text-sm text-slate-300">
                  <strong>{trendAnalysis.description}</strong>
                </p>
                {trendAnalysis.projectedChange !== 0 && (
                  <p className="mt-1 text-xs">
                    <span className={getTrendColor()}>
                      <strong>
                        {trendAnalysis.direction === "improving" ? "-" : "+"}
                        {Math.abs(trendAnalysis.projectedChange)} {t("current_data.days")}
                      </strong>
                    </span>
                    <span className="text-slate-400"> {t("current_data.projected_change")}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Queue Breakdown */}
      <article className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm">
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
                            {t("current_data.currently_processing_badge")}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-white">
                        {cases.toLocaleString()} {t("current_data.cases")}
                      </span>
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
      </article>

      {/* Additional Processing Queues */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Audit Review */}
        <article className="rounded-xl bg-slate-800/80 p-6 ring-1 ring-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            <h3 className="font-semibold text-white">{t("current_data.audit_review")}</h3>
          </div>
          <div className="mt-3">
            <p className="text-sm text-slate-400">
              {t("current_data.status")}: <strong>{data.auditReview.status}</strong>
            </p>
            {data.auditReview.averageDays && (
              <p className="text-sm text-slate-400">
                {t("current_data.average")}:{" "}
                <strong>
                  {data.auditReview.averageDays} {t("current_data.days")}
                </strong>
              </p>
            )}
          </div>
        </article>

        {/* Reconsideration */}
        <article className="rounded-xl bg-slate-800/80 p-6 ring-1 ring-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-5 w-5 text-purple-400" aria-hidden="true" />
            <h3 className="font-semibold text-white">{t("current_data.reconsideration")}</h3>
          </div>
          <div className="mt-3">
            <p className="text-sm text-slate-400">
              {t("current_data.currently_processing")}:{" "}
              <strong>{data.reconsideration.priorityDate}</strong>
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}
