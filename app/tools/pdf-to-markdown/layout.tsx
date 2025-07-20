import { Metadata } from "next"

export const metadata: Metadata = {
  title: "PDF to Markdown - Fast & Free PDF to MD Converter | GeeksKai",
  description:
    "Convert PDFs to clean Markdown with formatting preserved. Free, secure, and no registration required. Perfect for developers and writers!",
  keywords: [
    "pdf to markdown",
    "pdf converter",
    "markdown converter",
    "pdf to md",
    "document converter",
    "free pdf tools",
  ],
  openGraph: {
    title: "PDF to Markdown - Fast & Free PDF to MD Converter",
    description:
      "Convert PDFs to clean Markdown with formatting preserved. Free, secure, and no registration required.",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}
