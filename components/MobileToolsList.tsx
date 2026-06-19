"use client"

import Link from "./Link"
import { Zap } from "lucide-react"
import { toolsData, type ToolData } from "@/data/toolsData"

type MobileToolsListProps = {
  onNavigate: () => void
  viewAllLabel: string
}

const sortedCategories = [
  "Converters",
  "Dev Tools",
  "Utility",
  "Creative",
  "Productivity",
  "Others",
]

function getMenuCategory(tool: ToolData) {
  if (tool.category === "Development") {
    return tool.title.includes("Converter") || tool.title.includes("to")
      ? "Converters"
      : "Dev Tools"
  }

  if (["Education", "Entertainment", "Finance"].includes(tool.category)) {
    return "Others"
  }

  if (["Productivity", "Communication"].includes(tool.category)) {
    return "Productivity"
  }

  return tool.category
}

export default function MobileToolsList({ onNavigate, viewAllLabel }: MobileToolsListProps) {
  const groups = toolsData.reduce(
    (acc, tool) => {
      const category = getMenuCategory(tool)

      if (!acc[category]) acc[category] = []
      acc[category].push(tool)
      return acc
    },
    {} as Record<string, ToolData[]>
  )

  return (
    <>
      {sortedCategories.map((category) => {
        const tools = groups[category]
        if (!tools) return null

        return (
          <div key={category} className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400/80">
              {category}
            </h4>
            <div className="space-y-1">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={onNavigate}
                  prefetch={false}
                  className="group flex items-center gap-2 rounded-lg py-1.5 text-sm text-slate-400 transition-all duration-300 hover:text-white"
                >
                  <span className="text-slate-600 transition-colors group-hover:text-blue-400">
                    to
                  </span>
                  <span className="truncate group-hover:text-blue-300">
                    {tool.title
                      .split(" - ")[0]
                      .replace(
                        / Converter| Generator| Tracker| Calculator| Decoder & Lookup| Test/g,
                        ""
                      )}
                  </span>
                  {tool.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[8px] font-medium text-white ${tool.badgeColor} ml-auto flex-shrink-0`}
                    >
                      {tool.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      <Link
        href="/tools"
        onClick={onNavigate}
        prefetch={false}
        className="mt-4 flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-3 text-sm font-medium text-blue-400 transition-all duration-300 hover:bg-blue-500/20 hover:text-white"
      >
        <Zap className="h-4 w-4" />
        {viewAllLabel}
      </Link>
    </>
  )
}
