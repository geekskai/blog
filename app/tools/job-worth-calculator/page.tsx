"use client"

import React, { useState, useEffect, useRef } from "react"
import { Wallet, History, Eye, FileText } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "./components/LanguageSwitcher"
import { useLanguage } from "./components/LanguageContext"
import { RadioGroup } from "./components/RadioGroup"
import { useCalculator } from "./hooks/useCalculator"
import { useHistory } from "./hooks/useHistory"
import { pppFactors } from "./constants"
import { getCountryName } from "./utils/country"

const SalaryCalculator = () => {
  // 获取语言上下文
  const { t, language } = useLanguage()

  // 使用自定义hooks
  const calculator = useCalculator(t)
  const historyManager = useHistory()

  // 解构calculator
  const {
    formData,
    selectedCountry,
    isBrowser,
    setIsBrowser,
    handleInputChange,
    handleCountryChange,
    updateEducationFactor,
    getWorkingDays,
    getDisplayDailySalary,
    getValue,
    getAssessment,
    getAssessmentKey,
    getCurrentCurrencySymbol,
  } = calculator

  // 解构historyManager
  const {
    history,
    showHistory,
    setShowHistory,
    saveToHistory,
    deleteHistoryItem,
    clearAllHistory,
    restoreFromHistory,
    formatDate,
  } = historyManager

  // 访问统计状态
  const [visitorVisible, setVisitorVisible] = useState(false)

  // 添加用于创建分享图片的引用
  const shareResultsRef = useRef<HTMLDivElement>(null)

  // 在组件挂载时标记为浏览器环境
  useEffect(() => {
    setIsBrowser(true)
  }, [setIsBrowser])

  // 初始化时从localStorage加载国家设置
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCountry = localStorage.getItem("selectedCountry")
      if (savedCountry) {
        handleCountryChange(savedCountry)
      }
    }
  }, [handleCountryChange])

  // 监听访客统计加载
  useEffect(() => {
    const timer = setTimeout(() => {
      const pv = document.getElementById("busuanzi_value_site_pv")
      const uv = document.getElementById("busuanzi_value_site_uv")

      if (pv && pv.innerText !== "") {
        const currentCount = parseInt(pv.innerText, 10) || 0
        pv.innerText = (currentCount + 1700000).toString()

        if (uv && uv.innerText !== "") {
          const currentUV = parseInt(uv.innerText, 10) || 0
          uv.innerText = (currentUV + 250000).toString()
        }

        setVisitorVisible(true)
      } else {
        const retryTimer = setTimeout(() => {
          const pv = document.getElementById("busuanzi_value_site_pv")
          const uv = document.getElementById("busuanzi_value_site_uv")

          if (pv && pv.innerText !== "") {
            const currentCount = parseInt(pv.innerText, 10) || 0
            pv.innerText = (currentCount + 1700000).toString()

            if (uv && uv.innerText !== "") {
              const currentUV = parseInt(uv.innerText, 10) || 0
              uv.innerText = (currentUV + 1300000).toString()
            }

            setVisitorVisible(true)
          }
        }, 2000)
        return () => clearTimeout(retryTimer)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // 在组件初始化和学历选择变化时计算教育系数
  useEffect(() => {
    updateEducationFactor()
  }, [formData.degreeType, formData.schoolType, updateEducationFactor])

  const value = getValue()

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <div className="mb-4 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text py-2 text-3xl font-bold text-transparent md:text-4xl">
          {t("title")}
        </h1>

        <div className="mb-2 flex justify-center">
          <LanguageSwitcher />
        </div>

        <div className="mb-2 flex items-center justify-center gap-3">
          {/* 仅在客户端渲染历史记录按钮 */}
          {isBrowser && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <History className="h-3.5 w-3.5" />
              {t("history")}
            </button>
          )}
        </div>

        {/* 历史记录列表 - 仅在客户端渲染 */}
        {isBrowser && showHistory && (
          <div className="relative z-10">
            <div className="absolute left-1/2 mt-1 max-h-80 w-72 -translate-x-1/2 transform overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 md:w-96">
              <div className="p-3">
                <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                  <h3 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <History className="mr-1 h-3.5 w-3.5" />
                    {t("history")}
                  </h3>
                  <div className="flex gap-2">
                    {history.length > 0 && (
                      <button
                        onClick={clearAllHistory}
                        className="rounded px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                      >
                        {t("clear_all")}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowHistory(false)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {history.length > 0 ? (
                  <ul className="space-y-2">
                    {history.map((item) => (
                      <li
                        key={item.id}
                        className="dark:bg-gray-750 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className={`text-sm font-semibold ${item.assessmentColor}`}>
                              {item.value}
                            </span>
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                              {item.countryCode !== "CN" ? "$" : "¥"}
                              {item.salary}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{formatDate(item.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()

                              const restoredFormData = restoreFromHistory(item)
                              calculator.setFormData(restoredFormData)
                              handleCountryChange(item.countryCode)
                              setShowHistory(false)
                            }}
                            className="rounded p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                            title={t("restore_history")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                          <Link
                            href={{
                              pathname: "/tools/job-worth-calculator/share",
                              query: {
                                value: item.value,
                                assessment: item.assessment,
                                assessmentColor: item.assessmentColor,
                                cityFactor: item.cityFactor,
                                workHours: item.workHours,
                                commuteHours: item.commuteHours,
                                restTime: item.restTime,
                                dailySalary: item.dailySalary,
                                isYuan: item.countryCode !== "CN" ? "false" : "true",
                                workDaysPerYear: item.workDaysPerYear,
                                workDaysPerWeek: item.workDaysPerWeek,
                                wfhDaysPerWeek: item.wfhDaysPerWeek,
                                annualLeave: item.annualLeave,
                                paidSickLeave: item.paidSickLeave,
                                publicHolidays: item.publicHolidays,
                                workEnvironment: item.workEnvironment,
                                leadership: item.leadership,
                                teamwork: item.teamwork,
                                degreeType: item.degreeType,
                                schoolType: item.schoolType,
                                education: item.education,
                                homeTown: item.homeTown,
                                shuttle: item.shuttle,
                                canteen: item.canteen,
                                workYears: item.workYears,
                                jobStability: item.jobStability,
                                bachelorType: item.bachelorType,
                                countryCode: item.countryCode,
                                countryName: getCountryName(item.countryCode, language),
                                hasShuttle: item.hasShuttle,
                                hasCanteen: item.hasCanteen,
                              },
                            }}
                            className="rounded p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            title={t("delete_history")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <div className="mb-2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-10 w-10 opacity-30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("no_history")}</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {t("history_notice")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 访问统计 - 仅在客户端渲染 */}
        {isBrowser && (
          <div className="mt-1 flex justify-center gap-4 text-xs text-gray-400 dark:text-gray-600">
            <span
              id="busuanzi_container_site_pv"
              className={`transition-opacity duration-300 ${
                visitorVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {t("visits")}: <span id="busuanzi_value_site_pv"></span>
            </span>
            <span
              id="busuanzi_container_site_uv"
              className={`transition-opacity duration-300 ${
                visitorVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {t("visitors")}: <span id="busuanzi_value_site_uv"></span>
            </span>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-white shadow-xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-black/30">
        <div className="space-y-8 p-6">
          {/* 薪资与工作时间 section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedCountry !== "CN"
                  ? `${t("annual_salary")}(${getCurrentCurrencySymbol()})`
                  : t("annual_salary_cny")}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder={
                    selectedCountry !== "CN"
                      ? `${t("salary_placeholder")} ${getCurrentCurrencySymbol()}`
                      : t("salary_placeholder_cny")
                  }
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("country_selection")}
                <span className="group relative ml-1 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  ?
                  <span className="invisible absolute bottom-full left-1/2 z-10 mb-1 w-48 -translate-x-1/2 transform rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:visible sm:w-64">
                    {t("ppp_tooltip")}
                  </span>
                </span>
              </label>
              <select
                id="country"
                name="country"
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 sm:text-sm"
              >
                {Object.keys(pppFactors)
                  .sort((a, b) => {
                    if (a === "CN") return -1
                    if (b === "CN") return 1
                    return new Intl.Collator(["zh", "ja", "en"]).compare(
                      getCountryName(a, language),
                      getCountryName(b, language)
                    )
                  })
                  .map((code) => (
                    <option key={code} value={code}>
                      {getCountryName(code, language)} ({pppFactors[code].toFixed(2)})
                    </option>
                  ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t("selected_ppp")}: {(pppFactors[selectedCountry] || 4.19).toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("work_days_per_week")}
                </label>
                <input
                  type="number"
                  value={formData.workDaysPerWeek}
                  onChange={(e) => handleInputChange("workDaysPerWeek", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("wfh_days_per_week")}
                  <span className="group relative ml-1 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    ?
                    <span className="invisible absolute bottom-full left-1/2 z-10 mb-1 w-48 -translate-x-1/2 transform rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:visible sm:w-64">
                      {t("wfh_tooltip")}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.workDaysPerWeek}
                  step="1"
                  value={formData.wfhDaysPerWeek}
                  onChange={(e) => handleInputChange("wfhDaysPerWeek", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("annual_leave")}
                </label>
                <input
                  type="number"
                  value={formData.annualLeave}
                  onChange={(e) => handleInputChange("annualLeave", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("public_holidays")}
                </label>
                <input
                  type="number"
                  value={formData.publicHolidays}
                  onChange={(e) => handleInputChange("publicHolidays", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("paid_sick_leave")}
                </label>
                <input
                  type="number"
                  value={formData.paidSickLeave}
                  onChange={(e) => handleInputChange("paidSickLeave", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("work_hours")}
                  <span className="group relative ml-1 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    ?
                    <span className="invisible absolute bottom-full left-1/2 z-10 mb-1 w-48 -translate-x-1/2 transform rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:visible sm:w-64">
                      {t("work_hours_tooltip")}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.workHours}
                  onChange={(e) => handleInputChange("workHours", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("commute_hours")}
                  <span className="group relative ml-1 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    ?
                    <span className="invisible absolute bottom-full left-1/2 z-10 mb-1 w-48 -translate-x-1/2 transform rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:visible sm:w-64">
                      {t("commute_tooltip")}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.commuteHours}
                  onChange={(e) => handleInputChange("commuteHours", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("rest_time")}
                </label>
                <input
                  type="number"
                  value={formData.restTime}
                  onChange={(e) => handleInputChange("restTime", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

          {/* 环境系数 */}
          <div className="space-y-4">
            {/* 学历和工作年限 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("education_level")}
                </label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t("degree_type")}
                    </label>
                    <select
                      value={formData.degreeType}
                      onChange={(e) => handleInputChange("degreeType", e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="belowBachelor">{t("below_bachelor")}</option>
                      <option value="bachelor">{t("bachelor")}</option>
                      <option value="masters">{t("masters")}</option>
                      <option value="phd">{t("phd")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t("school_type")}
                    </label>
                    <select
                      value={formData.schoolType}
                      onChange={(e) => handleInputChange("schoolType", e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      disabled={formData.degreeType === "belowBachelor"}
                    >
                      <option value="secondTier">{t("school_second_tier")}</option>
                      {formData.degreeType === "bachelor" ? (
                        <>
                          <option value="firstTier">{t("school_first_tier_bachelor")}</option>
                          <option value="elite">{t("school_elite_bachelor")}</option>
                        </>
                      ) : (
                        <>
                          <option value="firstTier">{t("school_first_tier_higher")}</option>
                          <option value="elite">{t("school_elite_higher")}</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* 硕士显示本科背景选项 */}
                {formData.degreeType === "masters" && (
                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t("bachelor_background")}
                    </label>
                    <select
                      value={formData.bachelorType}
                      onChange={(e) => handleInputChange("bachelorType", e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="secondTier">{t("school_second_tier")}</option>
                      <option value="firstTier">{t("school_first_tier_bachelor")}</option>
                      <option value="elite">{t("school_elite_bachelor")}</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 工作年限选择 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("work_years")}
                </label>
                <select
                  value={formData.workYears}
                  onChange={(e) => handleInputChange("workYears", e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="0">{t("fresh_graduate")}</option>
                  <option value="1">{t("years_1_3")}</option>
                  <option value="2">{t("years_3_5")}</option>
                  <option value="4">{t("years_5_8")}</option>
                  <option value="6">{t("years_8_10")}</option>
                  <option value="10">{t("years_10_12")}</option>
                  <option value="15">{t("years_above_12")}</option>
                </select>
              </div>
            </div>

            {/* 添加工作类型RadioGroup */}
            <RadioGroup
              label={t("job_stability")}
              name="jobStability"
              value={formData.jobStability}
              onChange={handleInputChange}
              options={[
                { label: t("job_government"), value: "government" },
                { label: t("job_state"), value: "state" },
                { label: t("job_foreign"), value: "foreign" },
                { label: t("job_private"), value: "private" },
                { label: t("job_dispatch"), value: "dispatch" },
                { label: t("job_freelance"), value: "freelance" },
              ]}
            />

            <RadioGroup
              label={t("work_environment")}
              name="workEnvironment"
              value={formData.workEnvironment}
              onChange={handleInputChange}
              options={[
                { label: t("env_remote"), value: "0.8" },
                { label: t("env_factory"), value: "0.9" },
                { label: t("env_normal"), value: "1.0" },
                { label: t("env_cbd"), value: "1.1" },
              ]}
            />

            <RadioGroup
              label={t("city_factor")}
              name="cityFactor"
              value={formData.cityFactor}
              onChange={handleInputChange}
              options={[
                { label: t("city_tier1"), value: "0.70" },
                { label: t("city_newtier1"), value: "0.80" },
                { label: t("city_tier2"), value: "1.0" },
                { label: t("city_tier3"), value: "1.10" },
                { label: t("city_tier4"), value: "1.25" },
                { label: t("city_county"), value: "1.40" },
                { label: t("city_town"), value: "1.50" },
              ]}
            />

            <RadioGroup
              label={t("hometown")}
              name="homeTown"
              value={formData.homeTown}
              onChange={handleInputChange}
              options={[
                { label: t("not_hometown"), value: "no" },
                { label: t("is_hometown"), value: "yes" },
              ]}
            />

            <RadioGroup
              label={t("leadership")}
              name="leadership"
              value={formData.leadership}
              onChange={handleInputChange}
              options={[
                { label: t("leader_bad"), value: "0.7" },
                { label: t("leader_strict"), value: "0.9" },
                { label: t("leader_normal"), value: "1.0" },
                { label: t("leader_good"), value: "1.1" },
                { label: t("leader_favorite"), value: "1.3" },
              ]}
            />

            <RadioGroup
              label={t("teamwork")}
              name="teamwork"
              value={formData.teamwork}
              onChange={handleInputChange}
              options={[
                { label: t("team_bad"), value: "0.9" },
                { label: t("team_normal"), value: "1.0" },
                { label: t("team_good"), value: "1.1" },
                { label: t("team_excellent"), value: "1.2" },
              ]}
            />

            {/* 班车和食堂选项作为加分项，加上勾选框控制 */}
            <div className="space-y-2">
              <div className="mb-2 flex items-center">
                <input
                  id="hasShuttle"
                  type="checkbox"
                  checked={formData.hasShuttle === true}
                  onChange={(e) => handleInputChange("hasShuttle", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="hasShuttle"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("shuttle")}
                </label>
              </div>

              {formData.hasShuttle && (
                <RadioGroup
                  label=""
                  name="shuttle"
                  value={formData.shuttle}
                  onChange={handleInputChange}
                  options={[
                    { label: t("shuttle_none"), value: "1.0" },
                    { label: t("shuttle_inconvenient"), value: "0.9" },
                    { label: t("shuttle_convenient"), value: "0.7" },
                    { label: t("shuttle_direct"), value: "0.5" },
                  ]}
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="mb-2 flex items-center">
                <input
                  id="hasCanteen"
                  type="checkbox"
                  checked={formData.hasCanteen === true}
                  onChange={(e) => handleInputChange("hasCanteen", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="hasCanteen"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("canteen")}
                </label>
              </div>

              {formData.hasCanteen && (
                <RadioGroup
                  label=""
                  name="canteen"
                  value={formData.canteen}
                  onChange={handleInputChange}
                  options={[
                    { label: t("canteen_none"), value: "1.0" },
                    { label: t("canteen_average"), value: "1.05" },
                    { label: t("canteen_good"), value: "1.1" },
                    { label: t("canteen_excellent"), value: "1.15" },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 结果卡片优化 */}
      <div
        ref={shareResultsRef}
        className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-6 shadow-inner dark:from-gray-800 dark:to-gray-900"
      >
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("working_days_per_year")}
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {getWorkingDays()}
              {t("days_unit")}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("average_daily_salary")}
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {getCurrentCurrencySymbol()}
              {getDisplayDailySalary()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("job_value")}
            </div>
            <div className={`mt-1 text-2xl font-semibold ${getAssessment().color}`}>
              {value.toFixed(2)}
              <span className="ml-2 text-base">({getAssessment().text})</span>
            </div>
          </div>
        </div>

        {/* 修改分享按钮为链接到分享页面，并保存到历史 */}
        <div className="mt-6 flex justify-end">
          <Link
            href={{
              pathname: "/share",
              query: {
                value: value.toFixed(2),
                assessment: getAssessmentKey(),
                assessmentColor: getAssessment().color,
                cityFactor: formData.cityFactor,
                workHours: formData.workHours,
                commuteHours: formData.commuteHours,
                restTime: formData.restTime,
                dailySalary: getDisplayDailySalary(),
                isYuan: selectedCountry !== "CN" ? "false" : "true",
                workDaysPerYear: getWorkingDays().toString(),
                workDaysPerWeek: formData.workDaysPerWeek,
                wfhDaysPerWeek: formData.wfhDaysPerWeek,
                annualLeave: formData.annualLeave,
                paidSickLeave: formData.paidSickLeave,
                publicHolidays: formData.publicHolidays,
                workEnvironment: formData.workEnvironment,
                leadership: formData.leadership,
                teamwork: formData.teamwork,
                degreeType: formData.degreeType,
                schoolType: formData.schoolType,
                education: formData.education,
                homeTown: formData.homeTown,
                shuttle: formData.hasShuttle ? formData.shuttle : "1.0",
                canteen: formData.hasCanteen ? formData.canteen : "1.0",
                workYears: formData.workYears,
                jobStability: formData.jobStability,
                bachelorType: formData.bachelorType,
                countryCode: selectedCountry,
                countryName: getCountryName(selectedCountry, language),
                currencySymbol: getCurrentCurrencySymbol(),
                hasShuttle: formData.hasShuttle,
                hasCanteen: formData.hasCanteen,
              },
            }}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
              ${
                formData.salary
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                  : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
              }`}
            onClick={() =>
              formData.salary
                ? saveToHistory(formData, value, selectedCountry, getAssessment().color, language)
                : null
            }
          >
            <FileText className="h-4 w-4" />
            {t("view_report")}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SalaryCalculator
