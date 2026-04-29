// import siteMetadata from "@/data/siteMetadata"
// import NewsletterForm from "pliny/ui/NewsletterForm"
import Hero from "@/components/Hero"
import ListLayout from "@/layouts/ListLayout"
import { useTranslations } from "next-intl"
import Link from "next/link"
// import React from "react"

const MAX_DISPLAY = 5
const POSTS_PER_PAGE = 6

export default function Home({ posts }) {
  const t = useTranslations("HomePage")
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }
  return (
    <>
      <Hero />
      <div className="divide-y divide-stone-700">
        <div className="flex -translate-y-[1px] justify-center">
          <div className="w-full max-w-[85%] px-4 md:max-w-3xl md:px-0">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          </div>
        </div>

        <div className="my-4 flex justify-center px-4 md:my-5 md:px-6 lg:py-8">
          <div className="flex w-full max-w-fit items-center justify-center">
            <span className="h-[2px] min-w-8 flex-1 bg-[#1a1443] md:min-w-24"></span>
            <span className="mx-3 w-fit rounded-md bg-[#1a1443] px-3 py-2 text-base font-medium leading-6 text-white md:mx-4 md:px-5 md:text-xl">
              {t("hero_blogs_list")}
            </span>
            <span className="h-[2px] min-w-8 flex-1 bg-[#1a1443] md:min-w-24"></span>
          </div>
        </div>
      </div>
      <ListLayout
        posts={posts.slice(0, MAX_DISPLAY)}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title={t("blog_all_posts")}
      />

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-center px-4 pt-2 text-base font-medium md:px-6">
          <Link
            className="flex min-h-[44px] items-center justify-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-4 py-2.5 text-center text-xs font-medium uppercase tracking-[0.18em] text-white no-underline transition-all duration-200 ease-out hover:gap-3 hover:text-white hover:no-underline md:min-h-[52px] md:px-8 md:py-4 md:text-sm md:font-semibold"
            role="button"
            target="_blank"
            href="/blog"
          >
            {t("blog_all_posts")} &rarr;
          </Link>
        </div>
      )}
      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center px-4 pb-2 pt-6 md:px-6 md:pt-8">
          <NewsletterForm />
        </div>
      )} */}
    </>
  )
}
