import ListLayoutWithTags from "@/layouts/ListLayoutWithTags"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"
import { genPageMetadata } from "app/seo"

// blog page size is 12
const POSTS_PER_PAGE = 12

export const metadata = genPageMetadata({
  title: "Latest Insights on AI Tools, Productivity Hacks & Online Utilities | GeeksKai",
  description:
    "Explore expert-written guides and insights on AI tools, online utilities, and productivity tips. Stay updated with the latest articles from GeeksKai Blog.",
  keywords: ["AI tools", "online utilities", "productivity tips", "GeeksKai Blog"],
})

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))
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
    <ListLayoutWithTags
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
