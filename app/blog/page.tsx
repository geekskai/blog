import ListLayoutWithTags from "@/layouts/ListLayoutWithTags"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"
import { genPageMetadata } from "app/seo"

// blog page size is 12
const POSTS_PER_PAGE = 12

export const metadata = genPageMetadata({ title: "Blog" })

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
