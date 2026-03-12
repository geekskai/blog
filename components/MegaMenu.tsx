"use client"

import React from "react"
// import Link from "@/components/Link"
import { Link } from "@/app/i18n/navigation"
import { toolsData, ToolData } from "@/data/toolsData"
import { useTranslations } from "next-intl"

const MegaMenu = ({ closeMenu }: { closeMenu?: () => void }) => {
  const t = useTranslations("HomePage")

  // Improved grouping logic to balance columns
  const groups = toolsData.reduce(
    (acc, tool) => {
      let category = tool.category

      // Split large categories
      if (category === "Development") {
        if (tool.title.includes("Converter") || tool.title.includes("to")) {
          category = "Converters"
        } else {
          category = "Dev Tools"
        }
      } else if (["Education", "Entertainment", "Finance"].includes(category)) {
        category = "Others"
      } else if (["Productivity", "Communication"].includes(category)) {
        category = "Productivity"
      }

      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(tool)
      return acc
    },
    {} as Record<string, ToolData[]>
  )

  // Sort categories to put larger ones first or specific order
  const sortedCategories = [
    "Converters",
    "Dev Tools",
    "Utility",
    "Creative",
    "Productivity",
    "Others",
  ]

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {sortedCategories.map((category) => {
        const tools = groups[category]
        if (!tools) return null

        return (
          <div key={category} className="flex flex-col space-y-5">
            <h3 className="border-b border-slate-800 pb-3 text-[12px] font-black uppercase tracking-[0.25em] text-blue-400">
              {category}
            </h3>
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    target="_blank"
                    onClick={closeMenu}
                    className="group flex items-center gap-3 whitespace-nowrap text-[15px] font-medium text-slate-400 transition-all duration-200 hover:text-white"
                  >
                    <span className="w-5 shrink-0 text-center font-bold text-slate-600 opacity-60 transition-all group-hover:text-blue-500 group-hover:opacity-100">
                      to
                    </span>
                    <span className="truncate transition-transform group-hover:translate-x-1">
                      {tool.title}
                    </span>
                    {tool.badge && (
                      <span
                        className={`ml-2 flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-white ${tool.badgeColor} opacity-70 group-hover:opacity-100`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default MegaMenu
