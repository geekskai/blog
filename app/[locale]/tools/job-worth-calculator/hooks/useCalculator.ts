import { useState, useCallback, useRef } from "react"
import { FormData } from "../types"
import {
  calculateValue,
  calculateWorkingDays,
  getDisplaySalary,
  calculateEducationFactor,
} from "../utils/calculations"
import { getValueAssessment, getValueAssessmentKey } from "../utils/assessment"
import { getCurrencySymbol } from "../utils/country"

// 默认表单数据
const defaultFormData: FormData = {
  salary: "",
  nonChinaSalary: false,
  workDaysPerWeek: "5",
  wfhDaysPerWeek: "0",
  annualLeave: "5",
  paidSickLeave: "3",
  publicHolidays: "13",
  workHours: "10",
  commuteHours: "2",
  restTime: "2",
  cityFactor: "1.0",
  workEnvironment: "1.0",
  leadership: "1.0",
  teamwork: "1.0",
  homeTown: "no",
  degreeType: "bachelor",
  schoolType: "firstTier",
  bachelorType: "firstTier",
  workYears: "0",
  shuttle: "1.0",
  canteen: "1.0",
  jobStability: "private",
  education: "1.0",
  hasShuttle: false,
  hasCanteen: false,
}

export const useCalculator = (t: (key: string) => string) => {
  // 状态管理
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [selectedCountry, setSelectedCountry] = useState<string>("CN")
  const [isBrowser, setIsBrowser] = useState(false)
  const scrollPositionRef = useRef(0)

  // 输入处理
  const handleInputChange = useCallback((name: string, value: string | boolean) => {
    // 触发自定义事件，保存滚动位置
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("beforeStateChange"))
    }

    // 直接设置值，不进行任何验证
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 在状态更新后，触发恢复滚动位置事件
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("afterStateChange"))
      }
    }, 0)
  }, [])

  // 国家选择处理
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCountry", countryCode)
    }
  }

  // 计算相关函数
  const getWorkingDays = useCallback(() => calculateWorkingDays(formData), [formData])

  const getDisplayDailySalary = useCallback(
    () => getDisplaySalary(formData, selectedCountry, calculateWorkingDays),
    [formData, selectedCountry]
  )

  const getValue = useCallback(
    () => calculateValue(formData, selectedCountry),
    [formData, selectedCountry]
  )

  const getAssessment = useCallback(
    () => getValueAssessment(formData, getValue(), t),
    [formData, getValue, t]
  )

  const getAssessmentKey = useCallback(
    () => getValueAssessmentKey(formData, getValue()),
    [formData, getValue]
  )

  const getCurrentCurrencySymbol = useCallback(
    () => getCurrencySymbol(selectedCountry),
    [selectedCountry]
  )

  // 教育系数计算和更新
  const updateEducationFactor = useCallback(() => {
    const factor = calculateEducationFactor(formData)
    if (formData.education !== String(factor)) {
      setFormData((prev) => ({
        ...prev,
        education: String(factor),
      }))
    }
    return factor
  }, [formData])

  return {
    // 状态
    formData,
    selectedCountry,
    isBrowser,
    scrollPositionRef,

    // 设置函数
    setFormData,
    setSelectedCountry,
    setIsBrowser,

    // 处理函数
    handleInputChange,
    handleCountryChange,
    updateEducationFactor,

    // 计算函数
    getWorkingDays,
    getDisplayDailySalary,
    getValue,
    getAssessment,
    getAssessmentKey,
    getCurrentCurrencySymbol,
  }
}
