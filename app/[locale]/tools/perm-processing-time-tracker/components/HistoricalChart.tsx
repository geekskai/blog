"use client"

import React, { useMemo } from "react"
import { TrendingUp, TrendingDown, BarChart3, Calendar, Info } from "lucide-react"
import { HistoricalDataPoint } from "../types"
import { useTranslations } from "../hooks/useTranslations"

interface HistoricalChartProps {
  data: HistoricalDataPoint[]
}

export default function HistoricalChart({ data }: HistoricalChartProps) {
  const t = useTranslations()
  const chartData = useMemo(() => {
    if (data.length === 0) return { max: 0, min: 0, range: 0 }

    const days = data.map((point) => point.analystReviewDays)
    const max = Math.max(...days)
    const min = Math.min(...days)
    const range = max - min

    return { max, min, range }
  }, [data])

  const getBarHeight = (days: number) => {
    if (chartData.range === 0) return 50
    return 20 + ((days - chartData.min) / chartData.range) * 60 // 20% to 80% height
  }

  const getBarColor = (index: number, days: number) => {
    const isRecent = index >= data.length - 2
    const isIncreasing = index > 0 && days > data[index - 1].analystReviewDays

    if (isRecent) {
      return isIncreasing ? "bg-red-500" : "bg-green-500"
    }
    return "bg-blue-500"
  }

  const averageProcessingTime =
    data.length > 0
      ? Math.round(data.reduce((sum, point) => sum + point.analystReviewDays, 0) / data.length)
      : 0

  const recentTrend =
    data.length >= 2
      ? data[data.length - 1].analystReviewDays - data[data.length - 2].analystReviewDays
      : 0

  return (
    <section
      className="overflow-hidden rounded-xl bg-slate-800/80 shadow-xl ring-1 ring-slate-700 backdrop-blur-sm"
      aria-label="Historical Processing Time Trends"
    >
      <div className="border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-blue-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white">{t("historical_chart.title")}</h2>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-400">{t("historical_chart.historical")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-slate-400">{t("historical_chart.improving")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-slate-400">{t("historical_chart.worsening")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {data.length === 0 ? (
          <div className="py-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-white">No Historical Data</h3>
            <p className="mt-2 text-slate-400">
              Historical processing time data will appear here once available.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats - SEO Optimized */}
            <dl className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-slate-700/50 p-4 text-center">
                <dd className="text-2xl font-bold text-blue-400">
                  <strong>{averageProcessingTime}</strong>
                </dd>
                <dt className="text-sm text-slate-400">{t("historical_chart.average_days")}</dt>
              </div>
              <div className="rounded-lg bg-slate-700/50 p-4 text-center">
                <dd className="text-2xl font-bold text-white">
                  <strong>{chartData.max}</strong>
                </dd>
                <dt className="text-sm text-slate-400">
                  {t("historical_chart.peak_processing_time")}
                </dt>
              </div>
              <div className="rounded-lg bg-slate-700/50 p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  {recentTrend > 0 ? (
                    <TrendingUp className="h-5 w-5 text-red-400" aria-hidden="true" />
                  ) : recentTrend < 0 ? (
                    <TrendingDown className="h-5 w-5 text-green-400" aria-hidden="true" />
                  ) : (
                    <div className="h-5 w-5" aria-hidden="true" />
                  )}
                  <dd
                    className={`text-2xl font-bold ${
                      recentTrend > 0
                        ? "text-red-400"
                        : recentTrend < 0
                          ? "text-green-400"
                          : "text-slate-400"
                    }`}
                  >
                    <strong>
                      {recentTrend > 0 ? "+" : ""}
                      {recentTrend}
                    </strong>
                  </dd>
                </div>
                <dt className="text-sm text-slate-400">{t("historical_chart.recent_change")}</dt>
              </div>
            </dl>

            {/* Chart */}
            <div className="relative">
              <div
                className="flex items-end justify-between space-x-2 py-4"
                style={{ minHeight: "200px" }}
              >
                {data.map((point, index) => {
                  const height = getBarHeight(point.analystReviewDays)
                  const colorClass = getBarColor(index, point.analystReviewDays)

                  return (
                    <div key={index} className="group relative flex flex-1 flex-col items-center">
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                        <div className="text-center">
                          <p className="font-medium">{point.analystReviewDays} days</p>
                          <p className="text-slate-400">
                            {point.date.toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-slate-400">
                            {t("historical_chart.processing")} {point.priorityDate}
                          </p>
                          <p className="text-slate-400">
                            {point.remainingCases.toLocaleString()} {t("current_data.cases")}
                          </p>
                        </div>
                        <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 transform bg-slate-900"></div>
                      </div>

                      {/* Bar */}
                      <div
                        className={`w-full rounded-t-sm transition-all duration-300 hover:opacity-80 ${colorClass}`}
                        style={{ height: `${height}%` }}
                      />

                      {/* X-axis label */}
                      <div className="mt-2 text-center">
                        <p className="text-xs font-medium text-slate-300">
                          {point.date.toLocaleDateString("en-US", { month: "short" })}
                        </p>
                        <p className="text-xs text-slate-500">{point.date.getFullYear()}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-4 text-xs text-slate-400">
                <span>
                  {chartData.max} {t("current_data.days")}
                </span>
                <span>
                  {Math.round((chartData.max + chartData.min) / 2)} {t("current_data.days")}
                </span>
                <span>
                  {chartData.min} {t("current_data.days")}
                </span>
              </div>
            </div>

            {/* Insights */}
            <div className="mt-6 rounded-lg border border-blue-800 bg-blue-900/20 p-4">
              <div className="flex items-start space-x-3">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" aria-hidden="true" />
                <div>
                  <h3 className="font-medium text-blue-300">
                    {t("historical_chart.insights_title")}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-blue-200">
                    <p>
                      {t.rich("historical_chart.insights_average", {
                        months: data.length.toString(),
                        days: averageProcessingTime.toString(),
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </p>
                    <p>
                      •{" "}
                      {recentTrend !== 0
                        ? t.rich("historical_chart.insights_trend", {
                            trend: t(
                              recentTrend > 0
                                ? "historical_chart.insights_trend_increased"
                                : "historical_chart.insights_trend_decreased"
                            ),
                            days: Math.abs(recentTrend).toString(),
                            strong: (chunks) => <strong className="text-blue-200">{chunks}</strong>,
                          })
                        : t.rich("historical_chart.insights_trend_stable_text", {
                            trend: t("historical_chart.insights_trend_stable"),
                            strong: (chunks) => <strong className="text-blue-200">{chunks}</strong>,
                          })}
                    </p>
                    <p>
                      •{" "}
                      {t.rich("historical_chart.insights_range", {
                        min: chartData.min.toString(),
                        max: chartData.max.toString(),
                        range: chartData.range.toString(),
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
