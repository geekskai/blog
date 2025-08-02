"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  Calculator,
  FileText,
  DollarSign,
  Zap,
  Users,
  Globe,
  Download,
  Palette,
  Monitor,
  Star,
  Sparkles,
  Clock,
  ArrowLeftRight,
  Search,
  Filter,
  Grid,
  ExternalLink,
} from "lucide-react"

export default function ToolsPage() {
  // State management for search and filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Professional gradient color palette for tool cards
  const gradients = useMemo(
    () => ({
      productivity: "from-blue-500 to-purple-600",
      development: "from-emerald-500 to-teal-600",
      creative: "from-orange-500 to-red-500",
      entertainment: "from-purple-500 to-pink-500",
      communication: "from-pink-500 to-rose-500",
      analytics: "from-indigo-500 to-blue-600",
      education: "from-yellow-500 to-orange-500",
      utility: "from-teal-500 to-cyan-500",
      security: "from-red-500 to-pink-500",
      finance: "from-green-500 to-emerald-600",
    }),
    []
  )

  const tools = useMemo(
    () => [
      {
        id: "discord-time-converter",
        title: "Discord Time Converter",
        description:
          "Professional bidirectional Discord time converter with timezone support and batch processing. Convert between Discord timestamps and regular time formats effortlessly.",
        icon: ArrowLeftRight,
        href: "/tools/discord-time-converter",
        features: [
          "Bidirectional Conversion",
          "Timezone Support",
          "Batch Processing",
          "History Tracking",
        ],
        badge: "New",
        badgeColor: "bg-emerald-500",
        gradient: gradients.communication,
        category: "Communication",
      },
      {
        id: "discord-timestamp-generator",
        title: "Discord Timestamp Generator",
        description:
          "Create dynamic timestamps that automatically update in Discord messages. Perfect for events, deadlines, and countdowns that work across all timezones.",
        icon: Clock,
        href: "/tools/discord-timestamp-generator",
        features: ["Real-time Updates", "Multiple Formats", "Timezone Aware", "Easy Copy & Paste"],
        badge: "Popular",
        badgeColor: "bg-purple-500",
        gradient: gradients.communication,
        category: "Communication",
      },
      {
        id: "job-worth-calculator",
        title: "Job Worth Calculator",
        description:
          "Calculate your job's true value with comprehensive salary analysis. Compare compensation, benefits, and work-life balance across different countries using PPP conversion.",
        icon: Calculator,
        href: "/tools/job-worth-calculator",
        features: [
          "PPP Conversion",
          "Work-Life Balance Analysis",
          "Benefits Calculator",
          "History Tracking",
        ],
        badge: "Popular",
        badgeColor: "bg-blue-500",
        gradient: gradients.productivity,
        category: "Productivity",
      },
      {
        id: "pdf-to-markdown",
        title: "PDF to Markdown Converter",
        description:
          "Professional PDF to Markdown converter. Extract text from PDF documents and transform them into clean, properly formatted Markdown files instantly.",
        icon: FileText,
        href: "/tools/pdf-to-markdown",
        features: [
          "Instant Conversion",
          "Format Preservation",
          "Browser-Based Processing",
          "Unlimited Usage",
        ],
        badge: "Professional",
        badgeColor: "bg-emerald-500",
        gradient: gradients.development,
        category: "Development",
      },
      {
        id: "tip-screen-generator",
        title: "Tip Screen Guide & Generator",
        description:
          "Understand the psychology behind tip screens and their impact on consumer behavior. Create realistic examples for educational purposes and UX research.",
        icon: DollarSign,
        href: "/tools/tip-screen-generator",
        features: [
          "Psychology Analysis",
          "Multiple Device Themes",
          "Educational Content",
          "Screenshot Export",
        ],
        badge: "Educational",
        badgeColor: "bg-orange-500",
        gradient: gradients.creative,
        category: "Design",
      },
      {
        id: "chromakopia-name-generator",
        title: "Chromakopia Name Generator",
        description:
          "Create your colorful alter ego inspired by Tyler, the Creator's Chromakopia. Generate unique personas that embody creativity and self-expression.",
        icon: Palette,
        href: "/tools/chromakopia-name-generator",
        features: [
          "Music-Inspired Personas",
          "Colorful Character Traits",
          "Creative Expression",
          "Social Sharing",
        ],
        badge: "Creative",
        badgeColor: "bg-purple-500",
        gradient: gradients.entertainment,
        category: "Entertainment",
      },
      {
        id: "invincible-title-card-generator",
        title: "Invincible Title Card Generator",
        description:
          "Create professional-grade title cards inspired by the acclaimed animated series. Features authentic typography and studio-quality export options.",
        icon: Monitor,
        href: "/tools/invincible-title-card-generator",
        features: [
          "Character Presets",
          "Advanced Typography",
          "HD Export Quality",
          "Real-time Preview",
        ],
        badge: "Professional",
        badgeColor: "bg-pink-500",
        gradient: gradients.creative,
        category: "Creative",
      },
      {
        id: "html-to-markdown",
        title: "HTML to Markdown Converter",
        description:
          "Convert HTML content to clean Markdown format with advanced customization. Support for URLs, batch processing, and intelligent content extraction.",
        icon: FileText,
        href: "/tools/html-to-markdown",
        features: [
          "URL Content Extraction",
          "Batch Processing",
          "Custom Formatting",
          "Real-time Preview",
        ],
        badge: "New",
        badgeColor: "bg-emerald-500",
        gradient: gradients.development,
        category: "Development",
      },
    ],
    [gradients]
  )

  // Get unique categories from tools
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tools.map((tool) => tool.category)))
    return ["All", ...cats.sort()]
  }, [tools])

  // Filter tools based on search term and selected category
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        searchTerm === "" ||
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [tools, searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white">
                <Grid className="h-4 w-4" />
                <span>{tools.length} Free Tools</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-5xl">
              Professional Tools for
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Modern Workflows
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              A curated collection of powerful, free online tools designed to enhance productivity
              for developers, creators, and digital professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="relative py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="mx-auto flex flex-col items-center gap-4">
              {/* Search Bar */}
              <div className="relative mb-6 w-full max-w-2xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-400"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Info */}
          {(searchTerm || selectedCategory !== "All") && (
            <div className="mb-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                {filteredTools.length === 0 ? (
                  <span>No tools found matching your search.</span>
                ) : (
                  <span>
                    Showing {filteredTools.length} of {tools.length} tools
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Tools Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:ring-slate-300 dark:bg-slate-800 dark:ring-slate-700 dark:hover:ring-slate-600"
                >
                  {/* Gradient Header */}
                  <div className={`relative h-24 bg-gradient-to-br ${tool.gradient} p-4`}>
                    {/* Badge */}
                    <div className="absolute right-3 top-3">
                      <div
                        className={`inline-flex items-center gap-1 rounded-full ${tool.badgeColor} px-2 py-1 text-xs font-medium text-white`}
                      >
                        <Star className="h-3 w-3" />
                        {tool.badge}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-3 left-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Category */}
                    <div className="mb-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {tool.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {tool.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {tool.description}
                    </p>

                    {/* Key Features (show only first 2) */}
                    <div className="mb-4">
                      <div className="space-y-1">
                        {tool.features.slice(0, 2).map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <div
                              className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${tool.gradient}`}
                            ></div>
                            <span className="text-xs text-slate-600 dark:text-slate-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                        {tool.features.length > 2 && (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              +{tool.features.length - 2} more features
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600 transition-colors duration-300 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                        Launch Tool
                      </span>
                      <div className="rounded-full bg-slate-100 p-1.5 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white dark:bg-slate-700 dark:group-hover:bg-blue-500">
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${tool.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                  ></div>
                </Link>
              )
            })}
          </div>

          {/* No Results State */}
          {filteredTools.length === 0 && (searchTerm || selectedCategory !== "All") && (
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                No tools found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative mt-20 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">
              Have a Tool Suggestion?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-blue-100">
              We&apos;re always looking to build tools that solve real problems. Share your ideas
              with us.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="mailto:geeks.kai@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Us
              </Link>
              <span className="text-blue-200">or</span>
              <Link
                href="https://github.com/geekskai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
