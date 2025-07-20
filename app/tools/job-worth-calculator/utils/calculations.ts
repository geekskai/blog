import { FormData } from "../types"
import { pppFactors } from "../constants"

// 计算年工作天数
export const calculateWorkingDays = (formData: FormData): number => {
  const weeksPerYear = 52
  const totalWorkDays = weeksPerYear * Number(formData.workDaysPerWeek)
  const totalLeaves =
    Number(formData.annualLeave) +
    Number(formData.publicHolidays) +
    Number(formData.paidSickLeave) * 0.6 // 带薪病假按70%权重计算
  return Math.max(totalWorkDays - totalLeaves, 0)
}

// 计算日薪（标准化）
export const calculateDailySalary = (
  formData: FormData,
  selectedCountry: string,
  calculateWorkingDays: (formData: FormData) => number
): number => {
  if (!formData.salary) return 0
  const workingDays = calculateWorkingDays(formData)

  // 应用PPP转换因子标准化薪资
  const isNonChina = selectedCountry !== "CN"
  const pppFactor = isNonChina ? pppFactors[selectedCountry] || 4.19 : 4.19
  const standardizedSalary = Number(formData.salary) * (4.19 / pppFactor)

  return standardizedSalary / workingDays
}

// 获取显示用的日薪（转回原始货币）
export const getDisplaySalary = (
  formData: FormData,
  selectedCountry: string,
  calculateDailySalary: (
    formData: FormData,
    selectedCountry: string,
    calculateWorkingDays: (formData: FormData) => number
  ) => number
): string => {
  const dailySalaryInCNY = calculateDailySalary(formData, selectedCountry, calculateWorkingDays)
  const isNonChina = selectedCountry !== "CN"
  if (isNonChina) {
    // 非中国地区，转回本地货币
    const pppFactor = pppFactors[selectedCountry] || 4.19
    return ((dailySalaryInCNY * pppFactor) / 4.19).toFixed(2)
  } else {
    return dailySalaryInCNY.toFixed(2)
  }
}

// 根据学位类型和学校类型计算教育系数
export const calculateEducationFactor = (formData: FormData): number => {
  const degreeType = formData.degreeType
  const schoolType = formData.schoolType
  const bachelorType = formData.bachelorType

  let factor = 1.0 // 默认值

  // 专科及以下固定为0.8
  if (degreeType === "belowBachelor") {
    factor = 0.8
  }
  // 本科学历
  else if (degreeType === "bachelor") {
    if (schoolType === "secondTier")
      factor = 0.9 // 二本三本
    else if (schoolType === "firstTier")
      factor = 1.0 // 双非/QS100/USnews50
    else if (schoolType === "elite") factor = 1.2 // 985/211/QS30/USnews20
  }
  // 硕士学历 - 考虑本科背景
  else if (degreeType === "masters") {
    // 先获取本科背景的基础系数
    let bachelorBaseCoefficient = 0
    if (bachelorType === "secondTier")
      bachelorBaseCoefficient = 0.9 // 二本三本
    else if (bachelorType === "firstTier")
      bachelorBaseCoefficient = 1.0 // 双非/QS100/USnews50
    else if (bachelorType === "elite") bachelorBaseCoefficient = 1.2 // 985/211/QS30/USnews20

    // 再计算硕士学校的加成系数
    let mastersBonus = 0
    if (schoolType === "secondTier")
      mastersBonus = 0.4 // 二本三本硕士
    else if (schoolType === "firstTier")
      mastersBonus = 0.5 // 双非/QS100/USnews50硕士
    else if (schoolType === "elite") mastersBonus = 0.6 // 985/211/QS30/USnews20硕士

    // 最终学历系数 = 本科基础 + 硕士加成
    factor = bachelorBaseCoefficient + mastersBonus
  }
  // 博士学历
  else if (degreeType === "phd") {
    if (schoolType === "secondTier")
      factor = 1.6 // 二本三本博士
    else if (schoolType === "firstTier")
      factor = 1.8 // 双非/QS100/USnews50博士
    else if (schoolType === "elite") factor = 2.0 // 985/211/QS30/USnews20博士
  }

  return factor
}

// 主要价值计算函数
export const calculateValue = (formData: FormData, selectedCountry: string): number => {
  if (!formData.salary) return 0

  const dailySalary = calculateDailySalary(formData, selectedCountry, calculateWorkingDays)
  const workHours = Number(formData.workHours)
  const commuteHours = Number(formData.commuteHours)
  const restTime = Number(formData.restTime)

  // 确保正确转换为数字，使用parseFloat可以更可靠地处理字符串转数字
  const workDaysPerWeek = parseFloat(formData.workDaysPerWeek) || 5

  // 允许wfhDaysPerWeek为空字符串，计算时才处理为0
  const wfhInput = formData.wfhDaysPerWeek.trim()
  const wfhDaysPerWeek = wfhInput === "" ? 0 : Math.min(parseFloat(wfhInput) || 0, workDaysPerWeek)

  // 确保有办公室工作天数时才计算比例，否则设为0
  const officeDaysRatio =
    workDaysPerWeek > 0 ? (workDaysPerWeek - wfhDaysPerWeek) / workDaysPerWeek : 0

  // 班车系数只在勾选时使用，否则为1.0
  const shuttleFactor = formData.hasShuttle ? Number(formData.shuttle) : 1.0
  const effectiveCommuteHours = commuteHours * officeDaysRatio * shuttleFactor

  // 食堂系数只在勾选时使用，否则为1.0
  const canteenFactor = formData.hasCanteen ? Number(formData.canteen) : 1.0

  // 工作环境因素，包含食堂和家乡因素
  const environmentFactor =
    Number(formData.workEnvironment) *
    Number(formData.leadership) *
    Number(formData.teamwork) *
    Number(formData.cityFactor) *
    canteenFactor

  // 根据工作年限计算经验薪资倍数
  const workYears = Number(formData.workYears)
  let experienceSalaryMultiplier = 1.0

  if (workYears === 0) {
    // 应届生：直接根据工作类型设定初始调整系数，反映稳定性/风险价值
    if (formData.jobStability === "government") {
      experienceSalaryMultiplier = 0.8 // 体制内稳定性高，价值相对高
    } else if (formData.jobStability === "state") {
      experienceSalaryMultiplier = 0.9 // 央/国企较稳定，价值相对高
    } else if (formData.jobStability === "foreign") {
      experienceSalaryMultiplier = 0.95 // 外企，较为稳定
    } else if (formData.jobStability === "private") {
      experienceSalaryMultiplier = 1.0 // 私企作为基准
    } else if (formData.jobStability === "dispatch") {
      experienceSalaryMultiplier = 1.1 // 派遣社员风险高，价值相对低
    } else if (formData.jobStability === "freelance") {
      experienceSalaryMultiplier = 1.1 // 自由职业风险高，价值相对低
    }
  } else {
    // 非应届生：使用基于增长预期的模型
    let baseSalaryMultiplier = 1.0
    if (workYears === 1)
      baseSalaryMultiplier = 1.5 // 1年：1.50-2.00，取中间值
    else if (workYears <= 3)
      baseSalaryMultiplier = 2.2 // 2-3年：2.20-2.50，取中间值
    else if (workYears <= 5)
      baseSalaryMultiplier = 2.7 // 4-5年：2.70-3.00，取中间值
    else if (workYears <= 8)
      baseSalaryMultiplier = 3.2 // 6-8年：3.20-3.50，取中间值
    else if (workYears <= 10)
      baseSalaryMultiplier = 3.6 // 9-10年：3.60-3.80，取中间值
    else baseSalaryMultiplier = 3.9 // 11-13年：3.90-4.20，取中间值

    // 工作单位类型对涨薪幅度的影响系数
    let salaryGrowthFactor = 1.0 // 私企基准
    if (formData.jobStability === "foreign") {
      salaryGrowthFactor = 0.8 // 外企涨薪幅度为私企的80%
    } else if (formData.jobStability === "state") {
      salaryGrowthFactor = 0.4 // 央/国企涨薪幅度为私企的40%
    } else if (formData.jobStability === "government") {
      salaryGrowthFactor = 0.2 // 体制内涨薪幅度为私企的20%
    } else if (formData.jobStability === "dispatch") {
      salaryGrowthFactor = 1.2 // 派遣社员涨薪幅度为私企的120%（体现不稳定性）
    } else if (formData.jobStability === "freelance") {
      salaryGrowthFactor = 1.2 // 自由职业涨薪幅度为私企的120%（体现不稳定性）
    }

    // 根据公式: 1 + (对应幅度-1) * 工作单位系数，计算最终薪资倍数
    experienceSalaryMultiplier = 1 + (baseSalaryMultiplier - 1) * salaryGrowthFactor
  }

  // 薪资满意度应该受到经验薪资倍数的影响
  return (
    (dailySalary * environmentFactor) /
    (35 *
      (workHours + effectiveCommuteHours - 0.5 * restTime) *
      Number(formData.education) *
      experienceSalaryMultiplier)
  )
}
