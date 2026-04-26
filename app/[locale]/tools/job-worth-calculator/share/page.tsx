"use client"

import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import React, { Suspense } from "react"
// 已移除本地语言系统，使用全站多语言

function ShareLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
      <div className="animate-pulse p-6 md:p-10">
        <div className="mb-8 h-10 w-48 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-4">
            <div className="h-40 rounded-3xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-64 rounded-3xl bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="h-[520px] rounded-3xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  )
}

// 动态导入ShareCard组件，禁用SSR
const ShareCard = dynamic(() => import("../ShareCard"), {
  ssr: false,
  loading: () => <ShareLoading />,
})

// 一个包装组件，负责从URL参数获取数据
function ShareCardWrapper() {
  const searchParams = useSearchParams()

  return (
    <div>
      <ShareCard
        // 基础数据
        value={searchParams.get("value") || "0"}
        assessment={searchParams.get("assessment") || "请输入年薪"}
        assessmentColor={searchParams.get("assessmentColor") || "text-gray-500"}
        cityFactor={searchParams.get("cityFactor") || "1.0"}
        workHours={searchParams.get("workHours") || "10"}
        commuteHours={searchParams.get("commuteHours") || "2"}
        restTime={searchParams.get("restTime") || "2"}
        dailySalary={searchParams.get("dailySalary") || "0"}
        isYuan={searchParams.get("isYuan") || "true"}
        workDaysPerYear={searchParams.get("workDaysPerYear") || "250"}
        countryCode={searchParams.get("countryCode") || "CN"}
        countryName={searchParams.get("countryName") || "中国"}
        currencySymbol={searchParams.get("currencySymbol") || "¥"}
        // 详细工作信息
        workDaysPerWeek={searchParams.get("workDaysPerWeek") || "5"}
        wfhDaysPerWeek={searchParams.get("wfhDaysPerWeek") || "0"}
        annualLeave={searchParams.get("annualLeave") || "5"}
        paidSickLeave={searchParams.get("paidSickLeave") || "12"}
        publicHolidays={searchParams.get("publicHolidays") || "13"}
        // 工作环境
        workEnvironment={searchParams.get("workEnvironment") || "1.0"}
        leadership={searchParams.get("leadership") || "1.0"}
        teamwork={searchParams.get("teamwork") || "1.0"}
        homeTown={searchParams.get("homeTown") || "no"}
        shuttle={searchParams.get("shuttle") || "1.0"}
        canteen={searchParams.get("canteen") || "1.0"}
        hasShuttle={searchParams.get("hasShuttle") === "true"}
        hasCanteen={searchParams.get("hasCanteen") === "true"}
        // 学历和工作经验
        degreeType={searchParams.get("degreeType") || "bachelor"}
        schoolType={searchParams.get("schoolType") || "elite"}
        bachelorType={searchParams.get("bachelorType") || "elite"}
        education={searchParams.get("education") || "1.2"}
        workYears={searchParams.get("workYears") || "0"}
        jobStability={searchParams.get("jobStability") || "private"}
      />
    </div>
  )
}

// 主页面组件
export default function SharePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-6 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* 语言切换器已移至全站导航 */}
        <Suspense fallback={<ShareLoading />}>
          <ShareCardWrapper />
        </Suspense>
      </div>
    </main>
  )
}
