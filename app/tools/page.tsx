"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
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

  // Add CSS animation styles
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950/30 to-purple-950/30">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl"></div>
          <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 blur-3xl"></div>
        </div>

        {/* Floating Elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-2 w-2 animate-pulse rounded-full bg-blue-400 opacity-60"></div>
          <div className="absolute right-1/3 top-32 h-1 w-1 animate-pulse rounded-full bg-purple-400 opacity-40 delay-700"></div>
          <div className="absolute bottom-40 left-1/3 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 opacity-50 delay-1000"></div>
          <div className="absolute bottom-20 right-1/4 h-1 w-1 animate-pulse rounded-full bg-pink-400 opacity-30 delay-500"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="mb-8 flex justify-center">
              <div className="group relative inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-6 py-3 text-sm font-medium text-slate-200 shadow-lg ring-1 ring-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Grid className="h-3 w-3 text-white" />
                </div>
                <span className="relative">{tools.length} Free Tools • Always Updated</span>
                <Sparkles className="h-4 w-4 text-blue-500" />
              </div>
            </div>

            {/* Main Heading with Staggered Animation */}
            <div className="mb-6 space-y-2">
              <h1 className="text-5xl font-bold tracking-tight text-white lg:text-7xl">
                <span className="block">Tools that</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  supercharge
                </span>
                <span className="block">your workflow</span>
              </h1>
            </div>

            {/* Enhanced Description */}
            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-slate-300">
              Discover powerful, free online tools crafted for{" "}
              <span className="font-semibold text-blue-400">developers</span>,{" "}
              <span className="font-semibold text-purple-400">creators</span>, and{" "}
              <span className="font-semibold text-emerald-400">innovators</span>
              .
              <br />
              <span className="text-lg text-slate-400">
                No signup required. Always free. Built with care.
              </span>
            </p>

            {/* Interactive Stats */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-6">
              <div className="group cursor-pointer rounded-2xl bg-slate-800/60 px-6 py-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">25K+</div>
                    <div className="text-sm text-slate-400">Happy Users</div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer rounded-2xl bg-slate-800/60 px-6 py-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-sm text-slate-400">Free Forever</div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer rounded-2xl bg-slate-800/60 px-6 py-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-slate-400">Setup Required</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA with scroll indicator */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <button
                  onClick={() => {
                    document.querySelector("#tools-section")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }}
                  className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <span>Explore Tools</span>
                  <div className="transition-transform duration-300 group-hover:translate-x-1">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </button>

                <div className="text-sm text-slate-400">or scroll down to browse</div>
              </div>

              {/* Scroll Indicator */}
              <div className="mt-8 animate-bounce">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-0.5 bg-gradient-to-b from-transparent via-slate-400 to-transparent"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div id="tools-section" className="relative bg-gradient-to-b from-slate-900/50 to-slate-950">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-20 h-px w-20 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>
          <div className="absolute right-1/3 top-40 h-px w-16 bg-gradient-to-r from-transparent via-purple-300/50 to-transparent"></div>
          <div className="absolute bottom-32 left-1/3 h-px w-24 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-200 shadow-lg ring-1 ring-slate-700/50 backdrop-blur-sm">
              <Filter className="h-4 w-4 text-blue-500" />
              <span>Discover & Explore</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Professional Tools
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Hand-picked tools designed to streamline your workflow and boost productivity
            </p>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="mb-16">
            <div className="mx-auto w-full">
              {/* Search Bar Container */}
              <div className="group relative mx-auto mb-8 max-w-4xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
                <div className="relative rounded-2xl bg-slate-800/80 p-1 shadow-xl ring-1 ring-slate-700/50 backdrop-blur-sm transition-all duration-300 group-focus-within:ring-blue-500/50">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                      <Search className="h-5 w-5 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search tools by name, description, or feature..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border-0 bg-transparent py-4 pl-14 pr-6 text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-6 text-slate-400 hover:text-slate-300"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Category Filter */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {categories.map((category, index) => {
                  const isSelected = selectedCategory === category
                  const gradients = [
                    "from-blue-500 to-blue-600",
                    "from-purple-500 to-purple-600",
                    "from-emerald-500 to-emerald-600",
                    "from-orange-500 to-orange-600",
                    "from-pink-500 to-pink-600",
                    "from-indigo-500 to-indigo-600",
                  ]
                  const gradient = gradients[index % gradients.length]

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`group relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isSelected
                          ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                          : "bg-slate-800/60 text-slate-200 shadow-md ring-1 ring-slate-700/50 backdrop-blur-sm hover:bg-slate-700 hover:text-slate-100"
                      }`}
                    >
                      <span className="relative z-10">{category}</span>
                      {!isSelected && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                        ></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Results Info with Animation */}
          {(searchTerm || selectedCategory !== "All") && (
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-900/20 px-4 py-2 text-sm text-blue-300">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                {filteredTools.length === 0 ? (
                  <span>No tools found matching your criteria</span>
                ) : (
                  <span>
                    Found {filteredTools.length} of {tools.length} tools
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Tools Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool, index) => {
              const IconComponent = tool.icon
              const delay = `delay-${(index % 8) * 100}`

              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden rounded-3xl bg-slate-800/70 shadow-lg ring-1 ring-slate-700/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:ring-slate-600/50 ${delay}`}
                  style={{
                    animationDelay: `${(index % 8) * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  {/* Enhanced Gradient Header */}
                  <div className={`relative h-32 bg-gradient-to-br ${tool.gradient} p-6`}>
                    {/* Floating Particles */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      <div className="absolute right-4 top-6 h-1 w-1 animate-pulse rounded-full bg-white/40 delay-700"></div>
                      <div className="absolute left-6 top-4 h-0.5 w-0.5 animate-pulse rounded-full bg-white/30 delay-1000"></div>
                    </div>

                    {/* Enhanced Badge */}
                    <div className="absolute right-4 top-4">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full ${tool.badgeColor} px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-sm`}
                      >
                        <Star className="h-3 w-3 animate-pulse" />
                        {tool.badge}
                      </div>
                    </div>

                    {/* Enhanced Icon with Glow */}
                    <div className="absolute bottom-4 left-4">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md"></div>
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30">
                          <IconComponent className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" />
                        </div>
                      </div>
                    </div>

                    {/* Category Pill */}
                    <div className="absolute bottom-4 right-4">
                      <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Card Content */}
                  <div className="p-6">
                    {/* Title with Gradient on Hover */}
                    <h3 className="mb-3 text-xl font-bold text-white transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent">
                      {tool.title}
                    </h3>

                    {/* Enhanced Description */}
                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                      {tool.description}
                    </p>

                    {/* Interactive Features List */}
                    <div className="mb-6">
                      <div className="space-y-2">
                        {tool.features.slice(0, 2).map((feature, featureIndex) => (
                          <div
                            key={feature}
                            className="flex items-center gap-3 opacity-80 transition-all duration-300 group-hover:opacity-100"
                            style={{
                              transitionDelay: `${featureIndex * 100}ms`,
                            }}
                          >
                            <div className="relative">
                              <div
                                className={`h-2 w-2 rounded-full bg-gradient-to-r ${tool.gradient} shadow-sm`}
                              ></div>
                              <div
                                className={`absolute inset-0 h-2 w-2 rounded-full bg-gradient-to-r ${tool.gradient} opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-50`}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                              {feature}
                            </span>
                          </div>
                        ))}
                        {tool.features.length > 2 && (
                          <div className="flex items-center gap-3 opacity-60 transition-opacity duration-300 group-hover:opacity-80">
                            <div className="h-2 w-2 rounded-full bg-slate-600"></div>
                            <span className="text-sm text-slate-400">
                              +{tool.features.length - 2} more features
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced CTA Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-400 transition-all duration-300 group-hover:text-blue-300">
                        Launch Tool
                      </span>
                      <div className="relative">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative rounded-xl bg-slate-700 p-2.5 transition-all duration-300 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-lg">
                          <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        </div>
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
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No tools found</h3>
              <p className="text-slate-400">Try adjusting your search or filter criteria</p>
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

      {/* Interactive CTA Section */}
      <div className="relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_45deg,transparent,rgba(139,92,246,0.1),transparent)]"></div>
        </div>

        {/* Animated Particles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[20%] h-1 w-1 animate-pulse rounded-full bg-blue-400 opacity-60"></div>
          <div className="absolute right-[15%] top-[30%] h-0.5 w-0.5 animate-pulse rounded-full bg-purple-400 opacity-40 delay-1000"></div>
          <div className="absolute bottom-[25%] left-[20%] h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 opacity-50 delay-700"></div>
          <div className="delay-1500 absolute bottom-[35%] right-[25%] h-1 w-1 animate-pulse rounded-full bg-pink-400 opacity-30"></div>
          <div className="absolute left-[70%] top-[40%] h-0.5 w-0.5 animate-pulse rounded-full bg-cyan-400 opacity-45 delay-500"></div>
          <div className="delay-1200 absolute bottom-[20%] right-[60%] h-1 w-1 animate-pulse rounded-full bg-orange-400 opacity-35"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Icon Cloud */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -right-2 -top-2 h-6 w-6 animate-bounce rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main CTA Heading */}
            <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
              <span className="block">Got an idea for a</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                game-changing tool?
              </span>
            </h2>

            {/* Enhanced Description */}
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300">
              Join our mission to build tools that{" "}
              <span className="font-semibold text-blue-400">empower creators</span> and{" "}
              <span className="font-semibold text-purple-400">solve real problems</span>.
              <br />
              <span className="text-slate-400">
                Your suggestion could be the next tool thousands of people love.
              </span>
            </p>

            {/* Interactive Action Cards */}
            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="mailto:geeks.kai@gmail.com"
                className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/15"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Send us an Email</h3>
                  <p className="text-sm text-slate-400">
                    Drop us a line with your tool idea. We read every message!
                  </p>
                </div>
              </Link>

              <Link
                href="https://github.com/geekskai"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/15"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Contribute on GitHub</h3>
                  <p className="text-sm text-slate-400">
                    Join our open source journey. Code, ideas, feedback welcome!
                  </p>
                </div>
              </Link>

              <div className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Coming Soon</h3>
                  <p className="text-sm text-slate-400">
                    Community voting and tool request board. Stay tuned!
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 ring-2 ring-slate-900"></div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 ring-2 ring-slate-900"></div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 ring-2 ring-slate-900"></div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white ring-2 ring-slate-900">
                    +
                  </div>
                </div>
                <span>Join 25,000+ happy users worldwide</span>
              </div>

              <div className="text-xs text-slate-500">
                Built with ❤️ by developers, for developers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
