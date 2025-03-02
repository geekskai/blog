import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Hero from '@/components/Hero'
import ListLayout from '@/layouts/ListLayout'

const MAX_DISPLAY = 5
const POSTS_PER_PAGE = 6

export default function Home({ posts }) {
  // const posts = allCoreContent(sortPosts(allBlogs))
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
        <div className="absolute left-[42%] top-6 h-[100px] w-[100px] translate-x-1/2 rounded-full bg-violet-100 opacity-20 blur-3xl  filter"></div>

        <div className="flex -translate-y-[1px] justify-center">
          <div className="w-3/4">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500  to-transparent" />
          </div>
        </div>

        <div className="my-5 flex justify-center lg:py-8">
          <div className="flex  items-center">
            <span className="h-[2px] w-24 bg-[#1a1443]"></span>
            <span className="w-fit rounded-md bg-[#1a1443] p-2 px-5 text-xl text-white">
              Blogs List
            </span>
            <span className="h-[2px] w-24 bg-[#1a1443]"></span>
          </div>
        </div>
      </div>
      <ListLayout
        posts={posts.slice(0, MAX_DISPLAY)}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-center text-base font-medium">
          <Link
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:gap-3 hover:text-white hover:no-underline md:px-8 md:py-4 md:text-sm md:font-semibold"
            role="button"
            target="_blank"
            href="/blog"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
