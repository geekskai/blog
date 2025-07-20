// 定义历史记录项的接口
export interface HistoryItem {
  id: string
  timestamp: number
  value: string
  assessment: string
  assessmentColor: string
  salary: string
  countryCode: string
  countryName: string

  // 添加所有需要在分享页面展示的字段
  cityFactor: string
  workHours: string
  commuteHours: string
  restTime: string
  dailySalary: string
  workDaysPerYear: string
  workDaysPerWeek: string
  wfhDaysPerWeek: string
  annualLeave: string
  paidSickLeave: string
  publicHolidays: string
  workEnvironment: string
  leadership: string
  teamwork: string
  degreeType: string
  schoolType: string
  education: string
  homeTown: string
  shuttle: string
  canteen: string
  workYears: string
  jobStability: string
  bachelorType: string
  hasShuttle: boolean
  hasCanteen: boolean
}

// 定义表单数据接口
export interface FormData {
  salary: string
  nonChinaSalary: boolean
  workDaysPerWeek: string
  wfhDaysPerWeek: string
  annualLeave: string
  paidSickLeave: string
  publicHolidays: string
  workHours: string
  commuteHours: string
  restTime: string
  cityFactor: string
  workEnvironment: string
  leadership: string
  teamwork: string
  homeTown: string
  degreeType: string
  schoolType: string
  bachelorType: string
  workYears: string
  shuttle: string
  canteen: string
  jobStability: string
  education: string
  hasShuttle: boolean
  hasCanteen: boolean
}

// 定义计算结果接口
export interface Result {
  value: number
  workDaysPerYear: number
  dailySalary: number
  assessment: string
  assessmentColor: string
}

// RadioGroup组件的Props接口
export interface RadioGroupProps {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string | boolean) => void
  options: Array<{ label: string; value: string }>
}
