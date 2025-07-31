import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Online Tools for Developers & Creators | GeeksKai Toolbox",
  description:
    "Discover a growing set of fast, free online tools designed for developers, writers, and digital workers. Features tip screen generator, PDF converters, job worth calculators and more productivity tools.",
  keywords: [
    "free tools",
    "developer tools",
    "online utilities",
    "tip screen",
    "tip screen generator",
    "pdf converter",
    "job calculator",
    "productivity tools",
    "web tools",
    "developer utilities",
    "online converters",
    "digital tools",
  ],
  openGraph: {
    title: "Free Online Tools for Developers & Creators | GeeksKai Toolbox",
    description:
      "Fast, free online tools for developers and creators. Tip screen generator, PDF converters, job calculators, and more productivity tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools for Developers & Creators",
    description:
      "Fast, free online tools including tip screen generator, PDF converters, and job calculators.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}
