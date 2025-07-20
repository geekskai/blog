"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Wallet,
  History,
  Eye,
  FileText,
  Calculator,
  MapPin,
  Clock,
  Users,
  GraduationCap,
  Briefcase,
  TrendingUp,
} from "lucide-react"
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
  const [currentStep, setCurrentStep] = useState(1) // 新增步骤状态

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

  // 步骤导航配置
  const steps = [
    {
      id: 1,
      title: t("basic_info"),
      icon: Wallet,
      description: t("salary_and_location"),
    },
    {
      id: 2,
      title: t("work_schedule"),
      icon: Clock,
      description: t("working_hours_and_days"),
    },
    {
      id: 3,
      title: t("share_work_environment_title"),
      icon: Users,
      description: t("environment_and_relationships"),
    },
    {
      id: 4,
      title: t("share_education_and_experience"),
      icon: GraduationCap,
      description: t("background_info"),
    },
    {
      id: 5,
      title: t("final_assessment"),
      icon: TrendingUp,
      description: t("view_results"),
    },
  ]

  // 检查步骤完成状态
  const isStepCompleted = (stepId: number) => {
    switch (stepId) {
      case 1:
        return formData.salary && selectedCountry
      case 2:
        return formData.workDaysPerWeek && formData.workHours && formData.commuteHours
      case 3:
        return formData.workEnvironment && formData.leadership && formData.teamwork
      case 4:
        return formData.degreeType && formData.workYears && formData.jobStability
      case 5:
        return formData.salary && value > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* 顶部工具栏 - 语言、历史记录和访问统计 */}
          <div className="mb-6 flex items-center justify-between">
            {/* 左侧语言切换器 */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            {/* 右侧控制区域 */}
            <div className="flex items-center gap-3">
              {/* 访问统计 - 紧凑徽章设计 */}
              {isBrowser && (
                <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-2 text-xs text-slate-600 backdrop-blur-sm dark:bg-slate-800/60 dark:text-slate-400">
                  <div id="busuanzi_container_site_pv" className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-blue-500" />
                    <span
                      id="busuanzi_value_site_pv"
                      className={`font-medium transition-all duration-500 ${
                        visitorVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                      }`}
                    ></span>
                  </div>

                  <div className="h-3 w-px bg-slate-300 dark:bg-slate-600"></div>

                  <div id="busuanzi_container_site_uv" className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-500" />
                    <span
                      id="busuanzi_value_site_uv"
                      className={`font-medium transition-all delay-75 duration-500 ${
                        visitorVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                      }`}
                    ></span>
                  </div>
                </div>
              )}

              {/* 历史记录按钮 */}
              {isBrowser && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="group relative flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <History className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  <span className="hidden sm:inline">{t("history")}</span>
                  {history.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold text-white">
                      {history.length > 9 ? "9+" : history.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 主标题区域 - 紧凑设计 */}
          <div className="text-center">
            {/* 工具徽章 */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-3 text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30">
              <div className="rounded-full bg-white/20 p-1">
                <Calculator className="h-4 w-4" />
              </div>
              <span className="font-semibold">{t("job_worth_calculator")}</span>
            </div>

            {/* 主标题 */}
            <h1 className="mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-white dark:via-slate-100 dark:to-white lg:text-5xl">
              {t("title")}
            </h1>

            {/* 副标题描述 */}
            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {t("subtitle_description")}
            </p>
          </div>

          {/* 历史记录下拉面板 */}
          {isBrowser && showHistory && (
            <div className="relative z-50 mt-6">
              <div className="animate-in fade-in slide-in-from-top-4 absolute left-1/2 w-96 -translate-x-1/2 transform duration-200">
                <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-xl dark:bg-slate-800/95 dark:ring-slate-700/50">
                  <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
                        <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                          <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        {t("history")}
                      </h3>
                      <div className="flex gap-2">
                        {history.length > 0 && (
                          <button
                            onClick={clearAllHistory}
                            className="rounded-xl bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition-all hover:scale-105 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                          >
                            {t("clear_all")}
                          </button>
                        )}
                        <button
                          onClick={() => setShowHistory(false)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto p-6">
                    {history.length > 0 ? (
                      <div className="space-y-4">
                        {history.map((item, index) => (
                          <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4 transition-all hover:border-blue-200 hover:shadow-md dark:border-slate-600 dark:from-slate-700 dark:to-slate-600 dark:hover:border-blue-400"
                            style={{
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="mb-2 flex items-center gap-3">
                                  <span className={`text-xl font-bold ${item.assessmentColor}`}>
                                    {item.value}
                                  </span>
                                  <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-600 dark:text-slate-300">
                                    {item.countryCode !== "CN" ? "$" : "¥"}
                                    {item.salary}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatDate(item.timestamp)}
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 transition-all group-hover:opacity-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    const restoredFormData = restoreFromHistory(item)
                                    calculator.setFormData(restoredFormData)
                                    handleCountryChange(item.countryCode)
                                    setShowHistory(false)
                                  }}
                                  className="rounded-lg p-2 text-blue-500 transition-all hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  title={t("restore_history")}
                                >
                                  <svg
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
                                  className="rounded-lg p-2 text-blue-500 transition-all hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={(e) => deleteHistoryItem(item.id, e)}
                                  className="rounded-lg p-2 text-red-500 transition-all hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title={t("delete_history")}
                                >
                                  <svg
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
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                          <Clock className="h-8 w-8 text-slate-400" />
                        </div>
                        <h4 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
                          {t("no_history")}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {t("history_notice")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 步骤导航 */}
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = isStepCompleted(step.id)
                const isCurrent = currentStep === step.id
                const isClickable = step.id <= currentStep || isCompleted

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => isClickable && setCurrentStep(step.id)}
                      disabled={!isClickable}
                      className={`group flex flex-col items-center p-2 transition-all ${
                        isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div
                        className={`mb-1.5 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                          isCompleted
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                            : isCurrent
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                              : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                        } ${isClickable ? "group-hover:scale-105" : ""}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-xs font-medium ${
                            isCurrent
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {step.title}
                        </div>
                      </div>
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={`mx-2 h-px w-6 transition-colors ${
                          isStepCompleted(step.id)
                            ? "bg-green-300 dark:bg-green-700"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="space-y-6">
          {/* 步骤1: 基础信息 */}
          {currentStep === 1 && (
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-slate-700 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center">
                  <Wallet className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {t("basic_info")}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("enter_salary_and_location")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* 薪资输入 */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {selectedCountry !== "CN"
                      ? `${t("annual_salary")}(${getCurrentCurrencySymbol()})`
                      : t("annual_salary_cny")}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Wallet className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      placeholder={
                        selectedCountry !== "CN"
                          ? `${t("salary_placeholder")} ${getCurrentCurrencySymbol()}`
                          : t("salary_placeholder_cny")
                      }
                      className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* 国家选择 */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("country_selection")}
                    <span className="group relative ml-2 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      ?
                      <span className="invisible absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-slate-900 px-3 py-2 text-xs text-white group-hover:visible">
                        {t("ppp_tooltip")}
                      </span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-8 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("selected_ppp")}: {(pppFactors[selectedCountry] || 4.19).toFixed(2)}
                  </p>
                </div>

                {/* 下一步按钮 */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.salary}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("next_step")}
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 步骤2: 工作时间 */}
          {currentStep === 2 && (
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <div className="border-b border-slate-200 bg-gradient-to-r from-orange-50 to-yellow-50 p-6 dark:border-slate-700 dark:from-orange-900/20 dark:to-yellow-900/20">
                <div className="flex items-center">
                  <Clock className="mr-3 h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {t("work_schedule")}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("configure_working_hours")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* 工作天数配置 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("work_days_per_week")}
                    </label>
                    <input
                      type="number"
                      value={formData.workDaysPerWeek}
                      onChange={(e) => handleInputChange("workDaysPerWeek", e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("wfh_days_per_week")}
                      <span className="group relative ml-2 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        ?
                        <span className="invisible absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-slate-900 px-3 py-2 text-xs text-white group-hover:visible">
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
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* 假期配置 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("annual_leave")}
                    </label>
                    <input
                      type="number"
                      value={formData.annualLeave}
                      onChange={(e) => handleInputChange("annualLeave", e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("public_holidays")}
                    </label>
                    <input
                      type="number"
                      value={formData.publicHolidays}
                      onChange={(e) => handleInputChange("publicHolidays", e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("paid_sick_leave")}
                    </label>
                    <input
                      type="number"
                      value={formData.paidSickLeave}
                      onChange={(e) => handleInputChange("paidSickLeave", e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* 每日工作时间 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("work_hours")}
                      <span className="group relative ml-2 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        ?
                        <span className="invisible absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-slate-900 px-3 py-2 text-xs text-white group-hover:visible">
                          {t("work_hours_tooltip")}
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={formData.workHours}
                      onChange={(e) => handleInputChange("workHours", e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("commute_hours")}
                      <span className="group relative ml-2 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        ?
                        <span className="invisible absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-slate-900 px-3 py-2 text-xs text-white group-hover:visible">
                          {t("commute_tooltip")}
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      value={formData.commuteHours}
                      onChange={(e) => handleInputChange("commuteHours", e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("rest_time")}
                    </label>
                    <input
                      type="number"
                      value={formData.restTime}
                      onChange={(e) => handleInputChange("restTime", e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* 导航按钮 */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    {t("previous_step")}
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={
                      !formData.workDaysPerWeek || !formData.workHours || !formData.commuteHours
                    }
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("next_step")}
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 步骤3: 工作环境 */}
          {currentStep === 3 && (
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <div className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:border-slate-700 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="flex items-center">
                  <Users className="mr-3 h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {t("share_work_environment_title")}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("evaluate_workplace_factors")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 p-6">
                {/* 城市因素 */}
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

                {/* 工作环境 */}
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

                {/* 是否家乡 */}
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

                {/* 领导关系 */}
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

                {/* 同事关系 */}
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

                {/* 班车选项 */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="hasShuttle"
                      type="checkbox"
                      checked={formData.hasShuttle === true}
                      onChange={(e) => handleInputChange("hasShuttle", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="hasShuttle"
                      className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      {t("shuttle")}
                    </label>
                  </div>

                  {formData.hasShuttle && (
                    <div className="ml-7">
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
                    </div>
                  )}
                </div>

                {/* 食堂选项 */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="hasCanteen"
                      type="checkbox"
                      checked={formData.hasCanteen === true}
                      onChange={(e) => handleInputChange("hasCanteen", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="hasCanteen"
                      className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      {t("canteen")}
                    </label>
                  </div>

                  {formData.hasCanteen && (
                    <div className="ml-7">
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
                    </div>
                  )}
                </div>

                {/* 导航按钮 */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    {t("previous_step")}
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    disabled={
                      !formData.workEnvironment || !formData.leadership || !formData.teamwork
                    }
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("next_step")}
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 步骤4: 教育与经验 */}
          {currentStep === 4 && (
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <div className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 dark:border-slate-700 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center">
                  <GraduationCap className="mr-3 h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {t("share_education_and_experience")}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("provide_background_info")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 p-6">
                {/* 学历信息 */}
                <div className="space-y-6">
                  <h3 className="border-b border-slate-200 pb-2 text-lg font-medium text-slate-900 dark:border-slate-700 dark:text-white">
                    {t("education_level")}
                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("degree_type")}
                      </label>
                      <select
                        value={formData.degreeType}
                        onChange={(e) => handleInputChange("degreeType", e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="belowBachelor">{t("below_bachelor")}</option>
                        <option value="bachelor">{t("bachelor")}</option>
                        <option value="masters">{t("masters")}</option>
                        <option value="phd">{t("phd")}</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("school_type")}
                      </label>
                      <select
                        value={formData.schoolType}
                        onChange={(e) => handleInputChange("schoolType", e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("bachelor_background")}
                      </label>
                      <select
                        value={formData.bachelorType}
                        onChange={(e) => handleInputChange("bachelorType", e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="secondTier">{t("school_second_tier")}</option>
                        <option value="firstTier">{t("school_first_tier_bachelor")}</option>
                        <option value="elite">{t("school_elite_bachelor")}</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 工作经验 */}
                <div className="space-y-6">
                  <h3 className="border-b border-slate-200 pb-2 text-lg font-medium text-slate-900 dark:border-slate-700 dark:text-white">
                    {t("work_experience")}
                  </h3>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("work_years")}
                    </label>
                    <select
                      value={formData.workYears}
                      onChange={(e) => handleInputChange("workYears", e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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

                {/* 工作性质 */}
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

                {/* 导航按钮 */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    {t("previous_step")}
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    disabled={!formData.degreeType || !formData.workYears || !formData.jobStability}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("calculate_results")}
                    <Calculator className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 步骤5: 结果展示 */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {/* 结果卡片 */}
              <div
                ref={shareResultsRef}
                className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
              >
                <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:border-slate-700 dark:from-emerald-900/20 dark:to-teal-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="mr-3 h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {t("final_assessment")}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {t("your_job_worth_analysis")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getAssessment().color}`}>
                        {value.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {getAssessment().text}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 详细数据 */}
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {t("working_days_per_year")}
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {getWorkingDays()}
                          </div>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400">
                          <Briefcase className="h-8 w-8" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {t("average_daily_salary")}
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {getCurrentCurrencySymbol()}
                            {getDisplayDailySalary()}
                          </div>
                        </div>
                        <div className="text-green-600 dark:text-green-400">
                          <Wallet className="h-8 w-8" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {t("job_value")}
                          </div>
                          <div className={`text-2xl font-bold ${getAssessment().color}`}>
                            {value.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-purple-600 dark:text-purple-400">
                          <TrendingUp className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      {t("previous_step")}
                    </button>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        {t("recalculate")}
                      </button>

                      <Link
                        href={{
                          pathname: "/tools/job-worth-calculator/share",
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
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700"
                        onClick={() =>
                          formData.salary
                            ? saveToHistory(
                                formData,
                                value,
                                selectedCountry,
                                getAssessment().color,
                                language
                              )
                            : null
                        }
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {t("view_report")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalaryCalculator
