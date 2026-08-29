"use client"

import React, { useMemo, useState } from "react"
import { formatDate } from "pliny/utils/formatDate"
import { CoreContent } from "pliny/utils/contentlayer"
import type { Blog } from "contentlayer/generated"
import Tag from "@/components/Tag"
import Link from "@/components/Link"
import { ArrowRight, Search, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
}

export default function ListLayout({ posts }: ListLayoutProps) {
  const t = useTranslations("HomePage")
  const locale = useLocale()
  const [searchValue, setSearchValue] = useState("")
  const normalizedSearch = searchValue.trim().toLowerCase()

  const filteredBlogPosts = useMemo(() => {
    if (!normalizedSearch) return posts

    return posts.filter((post) => {
      const searchContent = `${post.title} ${post.summary} ${post.tags?.join(" ") ?? ""}`
      return searchContent.toLowerCase().includes(normalizedSearch)
    })
  }, [normalizedSearch, posts])

  if (posts.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-8 text-center">
        <p className="text-sm leading-6 text-slate-300">{t("blog_no_posts")}</p>
        <Link
          href="/tools/"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-sky-300 no-underline hover:text-sky-200 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          {t("footer_view_all_tools")}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(15rem,0.68fr)_minmax(0,1.32fr)] lg:gap-12 xl:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        {t.has("home_guides_eyebrow") ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300 sm:text-xs">
            {t("home_guides_eyebrow")}
          </p>
        ) : null}
        <h2
          id="home-guides-title"
          className="mt-2 max-w-[14ch] text-[clamp(1.625rem,3.2vw,2.25rem)] font-bold leading-tight tracking-[-0.03em] text-white"
        >
          {t("home_guides_title")}
        </h2>
        <p className="mt-4 max-w-[42ch] text-base leading-7 text-slate-300">
          {t("home_guides_description")}
        </p>
        <Link
          href="/blog/"
          className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg px-1 text-sm font-semibold text-sky-300 no-underline transition-colors hover:text-sky-200 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none"
        >
          {t("blog_all_posts")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        <div className="relative mt-8 max-w-md">
          <label htmlFor="home-article-search" className="sr-only">
            {t("blog_search_articles")}
          </label>
          <input
            id="home-article-search"
            value={searchValue}
            type="search"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t("blog_search_articles")}
            className="block min-h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-11 py-2.5 text-base text-slate-50 caret-sky-300 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/25"
          />
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue("")}
              aria-label={t("blog_clear_search")}
              className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {filteredBlogPosts.length === 0 ? (
        <div className="border-y border-slate-800 py-10 text-center" role="status">
          <p className="text-sm text-slate-300">{t("blog_no_search_results")}</p>
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-sky-300 transition-colors hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none"
          >
            {t("blog_clear_search")}
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-800 border-y border-slate-800">
          {filteredBlogPosts.map((post, index) => {
            const { path, date, title, summary, tags, readingTime } = post
            const minutes = Math.max(1, Math.ceil(readingTime.minutes))

            return (
              <li key={path} className={index === 0 ? "py-8 sm:py-10" : "py-7 sm:py-8"}>
                <article className="max-w-3xl pr-2 sm:pr-6 lg:pr-10">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      {tags?.slice(0, 3).map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    <h3
                      className={`mt-4 font-semibold tracking-[-0.02em] text-white ${
                        index === 0
                          ? "text-2xl leading-9 sm:text-3xl sm:leading-10"
                          : "text-xl leading-8 sm:text-2xl"
                      }`}
                    >
                      <Link
                        href={`/${path}`}
                        className="text-white no-underline transition-colors hover:text-sky-300 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none"
                      >
                        {title}
                      </Link>
                    </h3>
                    <p className="mt-3 max-w-[72ch] break-words text-sm leading-7 text-slate-400 sm:text-base">
                      {summary}
                    </p>
                    <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-400 sm:text-sm">
                      <time dateTime={date}>{formatDate(date, locale)}</time>
                      <span aria-hidden="true">·</span>
                      <span>
                        {minutes} {t("blog_minutes_read")}
                      </span>
                    </p>
                    <Link
                      href={`/${path}`}
                      className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg px-1 text-sm font-semibold text-sky-300 no-underline transition-colors hover:text-sky-200 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none"
                    >
                      {t("blog_read_more")}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
