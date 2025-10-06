import { useState, useCallback, useEffect } from "react"
import { HistoryItem, FormData } from "../types"
import {
  loadHistoryFromStorage,
  saveHistoryToStorage,
  clearHistoryFromStorage,
  createHistoryItem,
  formatDate,
} from "../utils/history"

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // 初始化时从localStorage加载历史记录
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadedHistory = loadHistoryFromStorage()
      setHistory(loadedHistory)
    }
  }, [])

  // 保存记录到历史中
  const saveToHistory = useCallback(
    (
      formData: FormData,
      value: number,
      selectedCountry: string,
      assessmentColor: string,
      language: string
    ) => {
      if (!formData.salary) return null

      const newHistoryItem = createHistoryItem(
        formData,
        value,
        selectedCountry,
        assessmentColor,
        language
      )

      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)] // 限制保存10条记录
      setHistory(updatedHistory)
      saveHistoryToStorage(updatedHistory)

      return newHistoryItem
    },
    [history]
  )

  // 删除单条历史记录
  const deleteHistoryItem = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      const updatedHistory = history.filter((item) => item.id !== id)
      setHistory(updatedHistory)
      saveHistoryToStorage(updatedHistory)
    },
    [history]
  )

  // 清空所有历史记录
  const clearAllHistory = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setHistory([])
    clearHistoryFromStorage()
  }, [])

  // 从历史记录恢复表单数据
  const restoreFromHistory = useCallback((item: HistoryItem): FormData => {
    return {
      salary: item.salary,
      nonChinaSalary: item.countryCode !== "CN",
      workDaysPerWeek: item.workDaysPerWeek,
      wfhDaysPerWeek: item.wfhDaysPerWeek,
      annualLeave: item.annualLeave,
      paidSickLeave: item.paidSickLeave,
      publicHolidays: item.publicHolidays,
      workHours: item.workHours,
      commuteHours: item.commuteHours,
      restTime: item.restTime,
      cityFactor: item.cityFactor,
      workEnvironment: item.workEnvironment,
      leadership: item.leadership,
      teamwork: item.teamwork,
      homeTown: item.homeTown,
      degreeType: item.degreeType,
      schoolType: item.schoolType,
      bachelorType: item.bachelorType,
      workYears: item.workYears,
      shuttle: item.shuttle,
      canteen: item.canteen,
      jobStability: item.jobStability,
      education: item.education,
      hasShuttle: typeof item.hasShuttle === "boolean" ? item.hasShuttle : false,
      hasCanteen: typeof item.hasCanteen === "boolean" ? item.hasCanteen : false,
    }
  }, [])

  return {
    // 状态
    history,
    showHistory,

    // 设置函数
    setShowHistory,

    // 操作函数
    saveToHistory,
    deleteHistoryItem,
    clearAllHistory,
    restoreFromHistory,

    // 工具函数
    formatDate,
  }
}
