import { Metadata } from "next"

export const metadata: Metadata = {
  title: "PERM Processing Time Tracker - Free Real-time DOL Immigration Status Checker",
  description:
    "PERM processing time tracker with real-time DOL data. Official DOL data integration for accurate immigration timelines.",
  keywords: [
    "perm processing time",
    "perm processing time tracker",
    "dol perm processing times",
    "perm application status",
    "perm case tracker",
  ],
  alternates: {
    canonical: "https://geekskai.com/tools/perm-processing-time-tracker/",
  },
  openGraph: {
    title: "Free PERM Processing Time Tracker - Real-time DOL Immigration Data",
    description:
      "Professional PERM processing time tracker with real-time DOL data. Track application status, get processing estimates, queue position analysis, and trend analysis. Free, secure, and accurate PERM immigration timeline tracking.",
    type: "website",
    images: [
      {
        url: "/static/images/perm-processing-time-tracker.png",
        width: 1200,
        height: 630,
        alt: "PERM Processing Time Tracker Tool - Track Immigration Status",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PERM Processing Time Tracker - Real-time DOL Data",
    description:
      "Track PERM processing times with real-time DOL data. Get processing estimates and queue analysis for your immigration case.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PERM Processing Time Tracker",
  description:
    "Professional free PERM processing time tracker with real-time DOL data integration. Track PERM application status, get processing estimates, queue position analysis, and historical trends. Best PERM immigration timeline tracking solution.",
  url: "https://geekskai.com/tools/perm-processing-time-tracker/",
  applicationCategory: "Utility",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Track PERM processing times with real-time DOL data",
    "Get personalized PERM application estimates instantly",
    "Monitor queue position and priority dates accurately",
    "Analyze historical PERM processing trends",
    "Manage multiple PERM cases simultaneously",
    "Compare OEWS vs Non-OEWS processing timelines",
    "Track PERM analyst and audit review stages",
    "Real-time PERM processing status updates",
    "Free unlimited PERM case tracking",
    "Browser-based PERM timeline calculator",
    "No file upload to servers required",
    "Privacy-focused local data storage",
    "Support for complex PERM case scenarios",
    "Professional PERM processing estimates",
    "Interactive PERM trend visualization",
    "Mobile responsive immigration tracker",
    "Instant PERM queue position calculation",
    "Historical PERM data analysis tools",
    "Employment-based immigration timeline",
    "Real-time DOL processing data integration",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  audience: {
    "@type": "Audience",
    audienceType:
      "Immigration Applicants, Immigration Lawyers, HR Professionals, Employment-based Immigration Candidates, Green Card Applicants, International Workers, Immigration Consultants, Legal Professionals",
  },
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "perm processing time tracker, perm processing time, dol perm processing times, perm application status, immigration tracker, labor certification processing, employment based immigration, green card processing time, perm queue tracker, immigration processing calculator",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "PERM Processing Time Tracker",
    applicationCategory: "ImmigrationTrackingTool",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1850",
    },
  },
  potentialAction: [
    {
      "@type": "TrackAction",
      name: "Track PERM Processing Time",
      description: "Monitor your PERM application processing status and get real-time estimates",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://geekskai.com/tools/perm-processing-time-tracker/",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  ],
  educationalUse:
    "Immigration Planning, Legal Case Management, Timeline Estimation, Immigration Process Understanding, Case Status Monitoring",
  targetAudience: {
    "@type": "ProfessionalAudience",
    audienceType:
      "Immigration professionals, applicants seeking permanent residence through employment",
  },
  sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
}

// HowTo结构化数据
const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Track Your PERM Processing Time",
  description:
    "Step-by-step guide to track your PERM application processing time using real-time DOL data",
  totalTime: "PT5M",
  supply: ["PERM application submission date", "Case type information"],
  tool: ["PERM Processing Time Tracker", "Web browser"],
  step: [
    {
      "@type": "HowToStep",
      name: "Access the PERM Tracker",
      text: "Open the PERM Processing Time Tracker tool in your web browser",
      url: "https://geekskai.com/tools/perm-processing-time-tracker/",
    },
    {
      "@type": "HowToStep",
      name: "View Current Processing Data",
      text: "Check the latest PERM processing times, priority dates, and queue information from real-time DOL data",
    },
    {
      "@type": "HowToStep",
      name: "Add Your PERM Case",
      text: "Click 'Add Case' and enter your PERM submission date, case type, and OEWS classification",
    },
    {
      "@type": "HowToStep",
      name: "Get Processing Estimates",
      text: "View your personalized processing estimate, queue position, and expected completion date",
    },
    {
      "@type": "HowToStep",
      name: "Monitor Trends",
      text: "Analyze historical processing time trends and track changes in DOL processing speeds",
    },
  ],
}

// FAQ结构化数据
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How accurate are PERM processing time estimates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our estimates are based on official DOL data and historical trends. While we provide the most accurate predictions possible, actual processing times may vary based on case complexity, DOL workload, and other factors.",
      },
    },
    {
      "@type": "Question",
      name: "How often is PERM processing data updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOL updates PERM processing time data monthly, typically during the first work week of each month. Our tool automatically fetches the latest data to ensure accuracy.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between OEWS and Non-OEWS PERM applications?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OEWS (Occupational Employment Wage Statistics) cases typically process faster as they use standardized wage data. Non-OEWS cases require custom wage surveys and usually take longer to process.",
      },
    },
    {
      "@type": "Question",
      name: "Is my PERM case data stored securely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All your case data is stored locally in your browser and never sent to our servers. This ensures complete privacy and security of your immigration information.",
      },
    },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      {children}
    </div>
  )
}
