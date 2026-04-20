"use client"

import React, { useState } from "react"
import { formatDate } from "pliny/utils/formatDate"
import { CoreContent } from "pliny/utils/contentlayer"
import type { Blog } from "contentlayer/generated"
import Tag from "@/components/Tag"
import siteMetadata from "@/data/siteMetadata"
import Link from "@/components/Link"

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

export default function ListLayout({ posts, initialDisplayPosts = [] }: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState("")
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(" ")
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-y divide-stone-700">
        <div className="space-y-2 pb-6 pt-5 md:space-y-5 md:pb-8 md:pt-6">
          <div className="relative ml-auto max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="block min-h-[44px] w-full rounded-xl border border-stone-300 bg-stone-900 px-4 py-2.5 text-stone-50 focus:border-primary-500 focus:ring-primary-500"
              />
            </label>
            <svg
              className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul>
          {!filteredBlogPosts.length && "No posts found."}
          {displayPosts.map((post, key) => {
            const { path, date, title, summary, tags, readingTime } = post
            return (
              <li key={key} className="py-5 md:py-6">
                <article className="space-y-4 rounded-2xl border border-stone-800/80 bg-stone-900/30 p-4 xl:grid xl:grid-cols-4 xl:items-start xl:gap-6 xl:space-y-0 xl:p-6">
                  <p className="flex flex-wrap">
                    {tags?.map((tag) => {
                      return <Tag key={tag} text={tag} />
                    })}
                  </p>

                  <div className="space-y-4 xl:col-span-3">
                    <h3 className="text-xl font-bold leading-8 tracking-tight md:text-2xl">
                      <Link href={`/${path}`} className="text-stone-100 hover:text-primary-500">
                        {title}
                      </Link>
                    </h3>
                    <p className="prose max-w-none overflow-hidden text-sm leading-7 text-stone-300 md:text-base">
                      {summary}
                    </p>

                    <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col gap-1 text-left text-xs font-medium leading-6 text-[#16f2b3] md:flex-row md:gap-3 md:text-base">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        <span>{readingTime.minutes} Mins Read</span>
                      </div>
                      <Link
                        href={`/${path}`}
                        className="inline-flex h-10 items-center self-start rounded-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all duration-300 hover:from-pink-500 hover:to-violet-600 sm:self-auto"
                      >
                        <button className="flex h-[80%] items-center gap-1 rounded-full border-none px-3 py-0 text-center text-xs font-medium uppercase tracking-wider text-[#ffff] no-underline transition-all duration-200 ease-out hover:gap-3 md:px-4 md:text-sm md:font-semibold">
                          Read more &rarr;
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
