import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Online Tools for Developers & Creators | GeeksKai Toolbox",
  description:
    "Discover a growing set of fast, free online tools designed for developers, writers, and digital workers. From PDF converters to job worth calculators — power up your workflow with GeeksKai.",
  keywords: [
    "free tools",
    "developer tools",
    "online utilities",
    "pdf converter",
    "job calculator",
    "productivity tools",
  ],
  openGraph: {
    title: "Free Online Tools for Developers & Creators | GeeksKai Toolbox",
    description:
      "Discover fast, free online tools for developers and creators. PDF converters, job calculators, and more productivity tools.",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}
