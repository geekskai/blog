import React from "react"
import { RadioGroupProps } from "../types"
import { useLocale } from "next-intl"

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  const locale = useLocale()
  const language = locale === "zh-cn" ? "zh" : locale === "en" ? "en" : "ja"

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className={`grid ${language === "en" ? "grid-cols-3" : "grid-cols-4"} gap-2`}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`rounded-md px-3 py-2 text-sm transition-colors
              ${
                value === option.value
                  ? "bg-blue-100 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            onClick={(e) => {
              e.preventDefault() // 阻止默认行为
              e.stopPropagation() // 阻止事件冒泡
              onChange(name, option.value)
            }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
