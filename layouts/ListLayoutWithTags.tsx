"use client"
import Image from "@/components/Image"
import { usePathname } from "next/navigation"
import { formatDate } from "pliny/utils/formatDate"
import { coreContent, CoreContent } from "pliny/utils/contentlayer"
import { allAuthors, Authors, type Blog } from "contentlayer/generated"
import Link from "@/components/Link"
import Tag from "@/components/Tag"
import siteMetadata from "@/data/siteMetadata"

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  images?: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  children?: React.ReactNode
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split("/")[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex items-center justify-between gap-3 text-sm md:text-base">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="rounded-full border border-stone-700 px-3 py-2 transition-colors hover:border-primary-500 hover:text-primary-400"
          >
            Previous
          </Link>
        )}
        <span className="text-center text-stone-300">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="rounded-full border border-stone-700 px-3 py-2 transition-colors hover:border-primary-500 hover:text-primary-400"
          >
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  children,
}: ListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="py-1 md:py-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mt-2 whitespace-pre-wrap text-3xl font-bold leading-tight tracking-tight md:mt-3 md:text-4xl lg:text-5xl">
              {title}
            </h1>
          </div>
        </div>
      </section>
      {children}
      <div className="flex gap-4 md:gap-6 xl:gap-8">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-y-10 xl:grid-cols-3">
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags, images } = post
              const author = allAuthors.find((p) => p.slug === "default") as Authors
              const { avatar, name } = coreContent(author)
              return (
                <article
                  key={path}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-stone-800/80 bg-stone-900/30 p-4 transition-colors hover:border-stone-700 md:p-5"
                >
                  <Link href={`/${path}`} className="flex flex-col gap-4">
                    {images && (
                      <Image
                        loading="lazy"
                        alt={title}
                        src={images}
                        className="h-48 w-full rounded-xl object-cover object-center"
                        width={384}
                        height={192}
                      />
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-stone-300">
                      {avatar && (
                        <Image
                          src={avatar}
                          alt="avatar"
                          loading="lazy"
                          width={20}
                          height={20}
                          className="size-5 rounded-full"
                        />
                      )}
                      <span>{name}</span>
                      <span>&bull;</span>
                      <dd className="text-sm font-medium leading-6 text-stone-300">
                        <time dateTime={date} suppressHydrationWarning>
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </dd>
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold leading-8 tracking-tight text-stone-100 md:text-2xl">
                        {title}
                      </h2>
                      <p className="prose max-w-none overflow-hidden text-sm leading-7 text-stone-300 md:text-base">
                        {summary}
                      </p>
                    </div>
                  </Link>
                  <div className="mt-auto flex flex-wrap">
                    {tags?.map((tag) => {
                      return <Tag key={tag} text={tag} />
                    })}
                  </div>
                </article>
              )
            })}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}
