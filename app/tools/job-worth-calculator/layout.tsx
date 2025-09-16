/**
 * Job Worth Calculator - Layout Component
 *
 * Based on the original work by Zippland (https://github.com/Zippland/worth-calculator)
 * Licensed under MIT License
 *
 * @copyright 2024 Zippland (Original), GeeksKai (Modifications)
 * @license MIT
 */

import { LanguageProvider } from "./components/LanguageContext"

export const metadata = {
  title: "Is My Job Worth the Grind? | Job Worth Calculator | 仕事の価値計算機",
  description:
    "这b班上得值不值 - 计算你的工作性价比 | Job Worth Calculator - Calculate your job's value | 仕事の価値計算機 - あなたの仕事の価値を計算する",
  keywords: ["job worth calculator", "job worth", "calculator"],
  openGraph: {
    title: "Is My Job Worth the Grind? | Job Worth Calculator | 仕事の価値計算機",
    description:
      "这b班上得值不值 - 计算你的工作性价比 | Job Worth Calculator - Calculate your job's value | 仕事の価値計算機 - あなたの仕事の価値を計算する",
    images: ["/public/static/images/job-worth-calculator.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is My Job Worth the Grind? | Job Worth Calculator | 仕事の価値計算機",
    description:
      "这b班上得值不值 - 计算你的工作性价比 | Job Worth Calculator - Calculate your job's value | 仕事の価値計算機 - あなたの仕事の価値を計算する",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/job-worth-calculator/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}
