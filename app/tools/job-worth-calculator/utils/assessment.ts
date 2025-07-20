import { FormData } from "../types"

// 价值评估结果接口
export interface ValueAssessment {
  text: string
  color: string
}

// 获取价值评估
export const getValueAssessment = (
  formData: FormData,
  value: number,
  t: (key: string) => string
): ValueAssessment => {
  if (!formData.salary) return { text: t("rating_enter_salary"), color: "text-gray-500" }
  if (value < 0.6) return { text: t("rating_terrible"), color: "text-pink-800" }
  if (value < 1.0) return { text: t("rating_poor"), color: "text-red-500" }
  if (value <= 1.8) return { text: t("rating_average"), color: "text-orange-500" }
  if (value <= 2.5) return { text: t("rating_good"), color: "text-blue-500" }
  if (value <= 3.2) return { text: t("rating_great"), color: "text-green-500" }
  if (value <= 4.0) return { text: t("rating_excellent"), color: "text-purple-500" }
  return { text: t("rating_perfect"), color: "text-yellow-400" }
}

// 获取评级的翻译键，用于分享链接
export const getValueAssessmentKey = (formData: FormData, value: number): string => {
  if (!formData.salary) return "rating_enter_salary"
  if (value < 0.6) return "rating_terrible"
  if (value < 1.0) return "rating_poor"
  if (value <= 1.8) return "rating_average"
  if (value <= 2.5) return "rating_good"
  if (value <= 3.2) return "rating_great"
  if (value <= 4.0) return "rating_excellent"
  return "rating_perfect"
}
