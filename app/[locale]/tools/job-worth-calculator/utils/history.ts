import { HistoryItem, FormData } from "../types"
import { getDisplaySalary, calculateWorkingDays } from "./calculations"
import { getValueAssessmentKey } from "./assessment"
import { getCountryName } from "./country"

// 格式化日期
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}

// 创建历史记录项
export const createHistoryItem = (
  formData: FormData,
  value: number,
  selectedCountry: string,
  assessmentColor: string,
  language: string
): HistoryItem => {
  return {
    id: Date.now().toString(),
    timestamp: Date.now(),
    value: value.toFixed(2),
    assessment: getValueAssessmentKey(formData, value),
    assessmentColor,
    salary: formData.salary,
    countryCode: selectedCountry,
    countryName: getCountryName(selectedCountry, language),

    // 添加所有需要在分享页面展示的字段
    cityFactor: formData.cityFactor,
    workHours: formData.workHours,
    commuteHours: formData.commuteHours,
    restTime: formData.restTime,
    dailySalary: getDisplaySalary(formData, selectedCountry, calculateWorkingDays),
    workDaysPerYear: calculateWorkingDays(formData).toString(),
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
    hasShuttle: formData.hasShuttle,
    hasCanteen: formData.hasCanteen,
  }
}

// 保存历史记录到localStorage
export const saveHistoryToStorage = (history: HistoryItem[]): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("jobValueHistory", JSON.stringify(history))
    } catch (e) {
      console.error("保存历史记录失败", e)
    }
  }
}

// 从localStorage加载历史记录
export const loadHistoryFromStorage = (): HistoryItem[] => {
  if (typeof window === "undefined") return []

  try {
    const savedHistory = localStorage.getItem("jobValueHistory")
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as Partial<HistoryItem>[]

      // 处理历史记录，为可能缺失的字段添加默认值
      return parsedHistory.map((item: Partial<HistoryItem>) => ({
        id: item.id || Date.now().toString(),
        timestamp: item.timestamp || Date.now(),
        value: item.value || "0",
        assessment: item.assessment || "rating_enter_salary",
        assessmentColor: item.assessmentColor || "text-gray-500",
        salary: item.salary || "",
        countryCode: item.countryCode || "CN",
        countryName: item.countryName || "中国",

        // 为缺失的分享页面字段添加默认值
        cityFactor: item.cityFactor || "1.0",
        workHours: item.workHours || "10",
        commuteHours: item.commuteHours || "2",
        restTime: item.restTime || "2",
        dailySalary: item.dailySalary || "0",
        workDaysPerYear: item.workDaysPerYear || "250",
        workDaysPerWeek: item.workDaysPerWeek || "5",
        wfhDaysPerWeek: item.wfhDaysPerWeek || "0",
        annualLeave: item.annualLeave || "5",
        paidSickLeave: item.paidSickLeave || "3",
        publicHolidays: item.publicHolidays || "13",
        workEnvironment: item.workEnvironment || "1.0",
        leadership: item.leadership || "1.0",
        teamwork: item.teamwork || "1.0",
        degreeType: item.degreeType || "bachelor",
        schoolType: item.schoolType || "firstTier",
        education: item.education || "1.0",
        homeTown: item.homeTown || "no",
        shuttle: item.shuttle || "1.0",
        canteen: item.canteen || "1.0",
        workYears: item.workYears || "0",
        jobStability: item.jobStability || "private",
        bachelorType: item.bachelorType || "firstTier",
        hasShuttle: typeof item.hasShuttle === "boolean" ? item.hasShuttle : false,
        hasCanteen: typeof item.hasCanteen === "boolean" ? item.hasCanteen : false,
      }))
    }
  } catch (e) {
    console.error("加载历史记录失败", e)
  }

  return []
}

// 清空历史记录
export const clearHistoryFromStorage = (): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("jobValueHistory")
    } catch (e) {
      console.error("清空历史记录失败", e)
    }
  }
}
