import { ReactNode, Suspense } from "react"
import { CoreContent } from "pliny/utils/contentlayer"
import type { Blog, Authors } from "contentlayer/generated"
import Comments from "@/components/Comments"
import Link from "@/components/Link"
import PageTitle from "@/components/PageTitle"
import SectionContainer from "@/components/SectionContainer"
import Image from "@/components/Image"
import Tag from "@/components/Tag"
import siteMetadata from "@/data/siteMetadata"
import ScrollTopAndComment from "@/components/ScrollTopAndComment"
import ProgressBar from "@/components/ProgressBar"
import ShareButtons from "@/components/ShareButtons"

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, readingTime } = content
  const basePath = path.split("/")[0]

  return (
    <SectionContainer>
      <ProgressBar />
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-stone-700">
          <header className="pt-5 md:pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm font-medium leading-6 text-[#16f2b3] md:gap-4 md:text-base">
                  {/* <span>Published on: </span> */}
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                  </time>
                  |<span>{readingTime.minutes}</span>Mins Read
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-stone-700 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-8 pt-6 xl:border-b xl:border-stone-700 xl:pt-11">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="mb-5 flex flex-wrap justify-center gap-4 md:mb-6 xl:block xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center gap-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          loading="lazy"
                          sizes="40px"
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="min-w-0 text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="truncate text-stone-100">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-400"
                            >
                              {author.twitter
                                .replace("https://twitter.com/", "@")
                                .replace("https://x.com/", "@")}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
                <Suspense fallback={<div>Loading share buttons...</div>}>
                  <ShareButtons />
                </Suspense>
              </dd>
            </dl>
            <div className="divide-y divide-stone-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose prose-invert max-w-none px-0 py-6 text-sm md:px-6 md:py-8 md:text-base xl:px-8">
                {children}
              </div>
              <div className="flex flex-wrap gap-2 pb-6 pt-6 text-sm leading-6 text-stone-300">
                <Link href={discussUrl(path)} rel="nofollow">
                  Discuss on Twitter
                </Link>
                {` • `}
                <Link href={editUrl(filePath)}>View on GitHub</Link>
              </div>
              {siteMetadata.comments && (
                <div className="pb-6 pt-6 text-center text-stone-300" id="comment">
                  <Suspense fallback={<div>Loading comments...</div>}>
                    <Comments slug={slug} />
                  </Suspense>
                </div>
              )}
            </div>
            <footer>
              <div className="divide-stone-700 text-sm font-medium leading-5 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-stone-400">Tags</h2>
                    <div className="mt-2 flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex flex-col gap-5 py-4 md:flex-row md:justify-between xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div className="min-w-0">
                        <h2 className="text-xs uppercase tracking-wide text-stone-400">
                          Previous Article
                        </h2>
                        <div className="mt-1 text-primary-500 hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div className="min-w-0 md:text-right xl:text-left">
                        <h2 className="text-xs uppercase tracking-wide text-stone-400">
                          Next Article
                        </h2>
                        <div className="mt-1 text-primary-500 hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
