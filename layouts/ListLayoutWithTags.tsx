
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
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split("/")[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
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
}: ListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  // const author = allAuthors.find((p) => p.slug === 'default') as Authors
  // const { name, occupation } = coreContent(author)
  return (
    <div className="flex flex-col gap-4">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mt-3 whitespace-pre-wrap text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          </div>
        </div>
      </section>
      <div className="flex gap-4 sm:gap-6 xl:gap-8">
        <div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-y-12 xl:grid-cols-3">
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags, images } = post
              const author = allAuthors.find((p) => p.slug === "default") as Authors
              const { avatar, name } = coreContent(author)
              return (
                <article key={path} className="flex flex-col gap-2 space-y-2 xl:space-y-0">
                  <Link href={`/${path}`} className="flex flex-col gap-4 space-y-2 xl:space-y-0">
                    {images && (
                      <Image
                        alt={title}
                        src={images}
                        priority
                        className="h-[192px] w-[384px] rounded-lg object-cover object-center"
                        width={384}
                        height={192}
                      />
                    )}
                    <div className="flex items-center gap-2">
                      {avatar && (
                        <Image
                          src={avatar}
                          alt="avatar"
                          width={20}
                          height={20}
                          className="size-5 rounded-full"
                        />
                      )}
                      {name} &bull;
                      <dd className="text-base font-medium leading-6 text-stone-300">
                        <time dateTime={date} suppressHydrationWarning>
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </dd>
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold leading-8 tracking-tight text-stone-100">
                        {title}
                      </h2>
                      <p className="prose max-w-none overflow-scroll text-stone-300">{summary}</p>
                    </div>
                  </Link>
                  <div className="flex flex-wrap">
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
