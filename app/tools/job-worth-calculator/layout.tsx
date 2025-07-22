import { LanguageProvider } from "./components/LanguageContext"

export const metadata = {
  title: "Job Worth Calculator",
  description: "Calculate your job's worth with our free job worth calculator.",
  keywords: ["job worth calculator", "job worth", "calculator"],
  openGraph: {
    title: "Job Worth Calculator",
    description: "Calculate your job's worth with our free job worth calculator.",
    images: ["/images/job-worth-calculator.png"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}
