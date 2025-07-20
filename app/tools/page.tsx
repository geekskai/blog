import Link from "next/link"
import { Calculator, FileText, Zap, Users, Globe, Download } from "lucide-react"

export default function ToolsPage() {
  const tools = [
    {
      id: "job-worth-calculator",
      title: "Job Worth Calculator",
      subtitle: "工作价值计算器",
      description:
        "Calculate your job's value with our comprehensive salary analyzer. Compare work-life balance, benefits, and compensation across different countries.",
      descriptionCN:
        "通过我们的综合薪资分析器计算您的工作价值。比较不同国家的工作与生活平衡、福利和薪酬。",
      icon: Calculator,
      href: "/tools/job-worth-calculator",
      features: [
        "Multi-language Support",
        "PPP Conversion",
        "Work-Life Balance Analysis",
        "History Tracking",
      ],
      featuresCN: ["多语言支持", "购买力平价转换", "工作生活平衡分析", "历史记录追踪"],
      badge: "Popular",
      badgeColor: "bg-blue-500",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      id: "pdf-to-markdown",
      title: "PDF to Markdown",
      subtitle: "PDF转Markdown",
      description:
        "Convert PDF documents to clean Markdown format. Perfect for developers and writers who need to extract and format content quickly.",
      descriptionCN:
        "将PDF文档转换为干净的Markdown格式。非常适合需要快速提取和格式化内容的开发者和写作者。",
      icon: FileText,
      href: "/tools/pdf-to-markdown",
      features: ["Format Preservation", "Clean Output", "No Registration", "Secure Processing"],
      featuresCN: ["保持格式", "清洁输出", "无需注册", "安全处理"],
      badge: "New",
      badgeColor: "bg-green-500",
      gradient: "from-green-500 to-teal-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white shadow-lg">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Free Tools</span>
              </div>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-gray-300 md:text-6xl">
              Free Online Tools for
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Developers & Creators
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300 md:text-xl">
              Discover a growing set of fast, free online tools designed for developers, writers,
              and digital workers. From PDF converters to job worth calculators — power up your
              workflow with GeeksKai.
            </p>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Multi-language</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>No Registration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {tools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800"
              >
                {/* Card Header */}
                <div className={`relative h-32 bg-gradient-to-r ${tool.gradient} p-6`}>
                  {/* Badge */}
                  <div className="absolute right-4 top-4">
                    <span
                      className={`${tool.badgeColor} rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg`}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tool.subtitle}</p>
                  </div>

                  <p className="mb-6 text-gray-600 dark:text-gray-300">{tool.description}</p>

                  <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    {tool.descriptionCN}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Features / 功能特性:
                    </h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {tool.features.map((feature, index) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {tool.featuresCN.map((feature, index) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-500 to-teal-600"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                      Try it now →
                    </span>
                    <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>
            )
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 dark:border-gray-600 dark:bg-gray-800">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-gray-400 to-gray-600 p-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              More Tools Coming Soon
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We're constantly adding new tools to help boost your productivity. Stay tuned!
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              更多工具即将推出，敬请期待！
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              Have a tool suggestion?
            </h2>
            <p className="mb-6 text-blue-100">
              Let us know what tools you'd like to see next. We're always looking to add value for
              our community.
            </p>
            <Link
              href="mailto:geeks.kai@gmail.com"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl"
            >
              Contact Us
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
