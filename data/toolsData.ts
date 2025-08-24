import {
  Calculator,
  FileText,
  DollarSign,
  Palette,
  Monitor,
  Star,
  Sparkles,
  Clock,
  ArrowLeftRight,
  Shield,
  Car,
  Table,
  Ruler,
  Zap,
} from "lucide-react"

export interface ToolData {
  id: string
  title: string
  description: string
  icon: any
  href: string
  features: string[]
  badge: string
  badgeColor: string
  gradient: string
  category: string
}

// Professional gradient color palette for tool cards
export const gradients = {
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
}

export const toolsData: ToolData[] = [
  {
    id: "ccm-to-hp-converter",
    title: "CCM to HP Converter",
    description:
      "Professional engine displacement to horsepower converter with 2-stroke/4-stroke and turbocharged/naturally aspirated support. Perfect for motorcycles, cars, boats, and racing applications.",
    icon: Zap,
    href: "/tools/ccm-to-hp-converter/",
    features: [
      "Bidirectional CCM ↔ HP Conversion",
      "2-Stroke & 4-Stroke Engine Support",
      "Turbocharged & Natural Aspiration",
      "Real Vehicle Examples",
    ],
    badge: "New",
    badgeColor: "bg-orange-500",
    gradient: gradients.creative,
    category: "Utility",
  },
  {
    id: "cm-to-tommer-converter",
    title: "CM to Tommer Converter",
    description:
      "Professional centimeter to tommer (Danish/Norwegian inch) converter with precision control. Perfect for furniture shopping, construction projects, and international commerce.",
    icon: Ruler,
    href: "/tools/cm-to-tommer-converter/",
    features: [
      "Bidirectional Conversion",
      "Precision Control (0-3 decimals)",
      "Quick Reference Table",
      "Educational Content",
    ],
    badge: "New",
    badgeColor: "bg-blue-500",
    gradient: gradients.utility,
    category: "Utility",
  },
  {
    id: "discord-time-converter",
    title: "Discord Time Converter",
    description:
      "Professional bidirectional Discord time converter with timezone support and batch processing. Convert between Discord timestamps and regular time formats effortlessly.",
    icon: ArrowLeftRight,
    href: "/tools/discord-time-converter/",
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
    href: "/tools/discord-timestamp-generator/",
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
    href: "/tools/job-worth-calculator/",
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
    href: "/tools/pdf-to-markdown/",
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
    href: "/tools/tip-screen-generator/",
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
    id: "inside-out-2-glued-to-phone-test",
    title: "Inside Out 2 Glued to Phone Test",
    description:
      "Are you glued to your phone? Take the viral Inside Out 2 emotion test to discover which Disney character controls your phone addiction. Analyze Joy, Anxiety, Sadness & 6 more emotions driving your screen time habits.",
    icon: Sparkles,
    href: "/tools/inside-out-2-glued-to-phone-test/",
    features: [
      "9 Inside Out 2 Emotions",
      "Phone Addiction Analysis",
      "Personalized Insights",
      "Shareable Results",
    ],
    badge: "Viral",
    badgeColor: "bg-pink-500",
    gradient: gradients.entertainment,
    category: "Entertainment",
  },
  {
    id: "chromakopia-name-generator",
    title: "Chromakopia Name Generator",
    description:
      "Create your colorful alter ego inspired by Tyler, the Creator's Chromakopia. Generate unique personas that embody creativity and self-expression.",
    icon: Palette,
    href: "/tools/chromakopia-name-generator/",
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
    href: "/tools/invincible-title-card-generator/",
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
    href: "/tools/html-to-markdown/",
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
  {
    id: "perm-processing-time-tracker",
    title: "PERM Processing Time Tracker",
    description:
      "Track your PERM application processing times with real-time DOL data. Get personalized estimates, queue position tracking, and historical trend analysis for your immigration case.",
    icon: Clock,
    href: "/tools/perm-processing-time-tracker/",
    features: [
      "Real-time DOL Data",
      "Personal Case Tracking",
      "Queue Position Estimates",
      "Historical Trend Analysis",
    ],
    badge: "New",
    badgeColor: "bg-blue-500",
    gradient: gradients.productivity,
    category: "Productivity",
  },
  {
    id: "snow-day-calculator",
    title: "Snow Day Calculator",
    description:
      "Professional snow day prediction using real-time weather data and advanced algorithms. Get accurate school closure probability with detailed weather factor analysis.",
    icon: Star,
    href: "/tools/snow-day-calculator/",
    features: [
      "Real-time Weather Data",
      "AI-Powered Analysis",
      "Accurate Predictions",
      "Detailed Factor Breakdown",
    ],
    badge: "New",
    badgeColor: "bg-emerald-500",
    gradient: gradients.utility,
    category: "Utility",
  },
  {
    id: "random-ssn-generator",
    title: "Random SSN Generator",
    description:
      "Generate valid format Social Security Numbers for software testing and development. Educational tool with SSN structure guide and batch processing capabilities.",
    icon: Shield,
    href: "/tools/random-ssn-generator/",
    features: [
      "Valid SSN Format Generation",
      "Educational Structure Guide",
      "Batch Processing & Export",
      "Developer-Focused Design",
    ],
    badge: "New",
    badgeColor: "bg-blue-500",
    gradient: gradients.development,
    category: "Development",
  },
  {
    id: "random-vin-generator",
    title: "Random VIN Generator",
    description:
      "Generate ISO 3779 compliant Vehicle Identification Numbers for automotive software testing. Professional tool with valid check digits and manufacturer codes.",
    icon: Car,
    href: "/tools/random-vin-generator/",
    features: [
      "ISO 3779 Compliant Format",
      "Valid Check Digit Calculation",
      "Manufacturer Code Database",
      "Bulk Generation & Export",
    ],
    badge: "Professional",
    badgeColor: "bg-emerald-500",
    gradient: gradients.development,
    category: "Development",
  },
  {
    id: "json-to-table",
    title: "JSON to Table Converter",
    description:
      "Professional JSON to Table converter online. Convert JSON to HTML, ASCII, Excel tables instantly with advanced customization and structure preservation.",
    icon: Table,
    href: "/tools/json-to-table/",
    features: [
      "Multiple Output Formats",
      "Structure Preservation",
      "Advanced Customization",
      "Real-time Preview",
    ],
    badge: "New",
    badgeColor: "bg-blue-500",
    gradient: gradients.development,
    category: "Development",
  },
]

export default toolsData
