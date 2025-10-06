"use client"
import { Info, Lightbulb, Target, Users, Wrench, GraduationCap } from "lucide-react"

export default function EducationalContent() {
  const useCases = [
    {
      icon: "🏠",
      title: "Home Construction & Renovation",
      description:
        "Calculate lumber needs for framing, flooring, decking, and home improvement projects with accurate board foot measurements.",
      examples: [
        "House framing and structural work",
        "Deck and patio construction",
        "Kitchen and bathroom renovations",
        "Basement finishing projects",
      ],
      userTypes: ["Contractors", "DIY Homeowners", "Architects"],
    },
    {
      icon: "🪵",
      title: "Woodworking & Furniture Making",
      description:
        "Plan material requirements for custom furniture, cabinets, and woodworking projects with precise calculations.",
      examples: [
        "Custom furniture construction",
        "Kitchen cabinet building",
        "Hardwood flooring installation",
        "Trim and millwork projects",
      ],
      userTypes: ["Woodworkers", "Cabinet Makers", "Furniture Designers"],
    },
    {
      icon: "🏭",
      title: "Commercial Construction",
      description:
        "Estimate lumber costs for large-scale construction projects, ensuring accurate material ordering and budget planning.",
      examples: [
        "Commercial building framing",
        "Multi-unit housing projects",
        "Warehouse construction",
        "Industrial facility builds",
      ],
      userTypes: ["General Contractors", "Project Managers", "Estimators"],
    },
    {
      icon: "📚",
      title: "Education & Training",
      description:
        "Learn lumber industry standards, measurement techniques, and cost estimation for construction education programs.",
      examples: [
        "Construction trade schools",
        "Carpentry apprenticeships",
        "Architecture programs",
        "Building science courses",
      ],
      userTypes: ["Students", "Instructors", "Trade Schools"],
    },
    {
      icon: "🏪",
      title: "Lumber Retail & Supply",
      description:
        "Provide accurate quotes and help customers calculate material needs for their construction and woodworking projects.",
      examples: [
        "Customer material quotes",
        "Inventory planning",
        "Bulk order calculations",
        "Delivery cost estimation",
      ],
      userTypes: ["Lumber Dealers", "Sales Staff", "Inventory Managers"],
    },
    {
      icon: "🔧",
      title: "Professional Services",
      description:
        "Support architectural design, structural engineering, and construction consulting with precise material calculations.",
      examples: [
        "Architectural specifications",
        "Structural design calculations",
        "Cost estimation services",
        "Building permit applications",
      ],
      userTypes: ["Architects", "Engineers", "Consultants"],
    },
  ]

  const educationalTopics = [
    {
      title: "Understanding Board Feet",
      content:
        "A board foot is a unit of measurement for lumber volume. One board foot equals a piece of wood 12 inches long, 12 inches wide, and 1 inch thick (144 cubic inches). This standardized measurement allows for consistent pricing and ordering across the lumber industry.",
      keyPoints: [
        "1 board foot = 144 cubic inches",
        "Standard unit for lumber pricing",
        "Independent of actual lumber dimensions",
        "Used globally in wood industry",
      ],
    },
    {
      title: "Nominal vs. Actual Dimensions",
      content:
        'Lumber is sold using nominal dimensions (like 2×4), but the actual dimensions are smaller due to planing and drying. A nominal 2×4 actually measures 1.5" × 3.5". Always use actual dimensions for board foot calculations to ensure accuracy.',
      keyPoints: [
        "Nominal: Traditional lumber names",
        "Actual: True measured dimensions",
        "Difference due to planing/drying",
        "Use actual for calculations",
      ],
    },
    {
      title: "Wood Grades and Quality",
      content:
        "Lumber is graded based on strength, appearance, and intended use. Higher grades cost more but offer better strength and appearance. Understanding grades helps in selecting appropriate materials for specific applications while managing costs.",
      keyPoints: [
        "Structural grades for load-bearing",
        "Appearance grades for visible work",
        "Economy grades for utility use",
        "Grade affects pricing significantly",
      ],
    },
    {
      title: "Waste Factors and Planning",
      content:
        "Professional projects typically include 5-15% waste factor to account for cuts, defects, and mistakes. This ensures adequate material without costly delays. The waste percentage varies by project complexity and worker experience.",
      keyPoints: [
        "Typical waste: 5-15% of total",
        "Complex projects need higher waste",
        "Accounts for cuts and mistakes",
        "Prevents material shortages",
      ],
    },
    {
      title: "Cost Estimation Best Practices",
      content:
        "Accurate cost estimation requires current lumber prices, proper waste calculations, and consideration of delivery costs and taxes. Prices fluctuate based on market conditions, so always get recent quotes for large projects.",
      keyPoints: [
        "Use current market prices",
        "Include delivery and taxes",
        "Account for price fluctuations",
        "Get quotes for large orders",
      ],
    },
    {
      title: "Sustainable Lumber Practices",
      content:
        "Consider certified sustainable lumber sources, local species to reduce transportation costs, and efficient cutting plans to minimize waste. Sustainable practices benefit the environment and can reduce project costs.",
      keyPoints: [
        "FSC certified lumber options",
        "Local species reduce costs",
        "Efficient cutting plans",
        "Environmental responsibility",
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* 使用场景 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-900/25 via-red-900/20 to-pink-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-orange-500/15 to-red-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/15 to-pink-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 backdrop-blur-sm">
              <Target className="h-5 w-5 text-orange-400" />
              <h3 className="bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
                Professional Use Cases
              </h3>
            </div>
            <p className="text-slate-300">
              Discover how professionals across industries use board foot calculations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase, index) => (
              <div
                key={useCase.title}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-2xl">{useCase.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{useCase.title}</h4>
                </div>

                <p className="mb-4 text-sm text-slate-300">{useCase.description}</p>

                <div className="mb-4 space-y-2">
                  <div className="text-xs font-medium text-orange-400">Common Applications:</div>
                  <ul className="space-y-1">
                    {useCase.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="h-1 w-1 rounded-full bg-orange-400" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-2 text-xs font-medium text-red-400">User Types:</div>
                  <div className="flex flex-wrap gap-1">
                    {useCase.userTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-300"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 教育内容 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/25 via-purple-900/20 to-blue-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-blue-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
              <h3 className="bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 bg-clip-text text-xl font-bold text-transparent">
                Lumber Industry Education
              </h3>
            </div>
            <p className="text-slate-300">
              Essential knowledge for understanding board foot calculations and lumber industry
              standards
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {educationalTopics.map((topic, index) => (
              <div
                key={topic.title}
                className="group rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                  {topic.title}
                </h4>

                <p className="mb-4 text-sm leading-relaxed text-slate-300">{topic.content}</p>

                <div>
                  <div className="mb-2 text-xs font-medium text-indigo-400">Key Points:</div>
                  <ul className="space-y-1">
                    {topic.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                        <div className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* 专业提示部分 */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* 计算技巧 */}
            <div className="rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 text-lg font-semibold text-white">Calculation Tips</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>• Always convert all dimensions to inches before calculating</p>
                    <p>• Use actual dimensions, not nominal lumber sizes</p>
                    <p>• Round up to the nearest board foot for ordering</p>
                    <p>• Include waste factor for realistic material needs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 行业标准 */}
            <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 text-lg font-semibold text-white">Industry Standards</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>• Board foot is the universal lumber measurement</p>
                    <p>• Pricing varies by species, grade, and region</p>
                    <p>• Sustainable sourcing is increasingly important</p>
                    <p>• Quality grades affect both price and performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 专业建议部分 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-green-900/25 via-emerald-900/20 to-teal-900/25 p-8 shadow-2xl backdrop-blur-xl">
        {/* 装饰性背景元素 */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-green-500/15 to-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-3 backdrop-blur-sm">
              <Users className="h-5 w-5 text-green-400" />
              <h3 className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-xl font-bold text-transparent">
                Professional Best Practices
              </h3>
            </div>
            <p className="text-slate-300">
              Expert advice for accurate lumber estimation and cost-effective project planning
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* 项目规划 */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white">Project Planning</h4>

              <div className="space-y-4">
                <div className="rounded-lg bg-slate-800/30 p-4">
                  <h5 className="mb-2 font-semibold text-green-400">Material Estimation</h5>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Create detailed cutting lists before ordering</li>
                    <li>• Consider lumber lengths available from suppliers</li>
                    <li>• Plan cuts to minimize waste and maximize efficiency</li>
                    <li>• Account for defects and grade variations</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-800/30 p-4">
                  <h5 className="mb-2 font-semibold text-emerald-400">Cost Management</h5>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Get quotes from multiple suppliers</li>
                    <li>• Consider bulk discounts for large orders</li>
                    <li>• Factor in delivery costs and timing</li>
                    <li>• Monitor market prices for optimal purchasing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 质量控制 */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white">Quality & Efficiency</h4>

              <div className="space-y-4">
                <div className="rounded-lg bg-slate-800/30 p-4">
                  <h5 className="mb-2 font-semibold text-teal-400">Material Selection</h5>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Match lumber grade to application requirements</li>
                    <li>• Consider moisture content for your climate</li>
                    <li>• Specify kiln-dried lumber for stability</li>
                    <li>• Inspect deliveries for quality compliance</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-800/30 p-4">
                  <h5 className="mb-2 font-semibold text-cyan-400">Waste Reduction</h5>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Optimize cutting patterns with software</li>
                    <li>• Save cutoffs for smaller project components</li>
                    <li>• Use proper storage to prevent damage</li>
                    <li>• Train crew on efficient cutting techniques</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <Info className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
              <div>
                <h4 className="mb-2 font-semibold text-green-300">Professional Tip</h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  Successful lumber projects require accurate calculations, quality material
                  selection, and efficient planning. Use this calculator as part of a comprehensive
                  project management approach that includes proper storage, handling, and
                  installation techniques. Always consult with local suppliers for current pricing
                  and availability, and consider environmental factors that may affect material
                  performance in your specific application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
