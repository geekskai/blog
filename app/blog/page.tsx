import ListLayoutWithTags from "@/layouts/ListLayoutWithTags"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"
import siteMetadata from "@/data/siteMetadata"
import { buildPageSchema, serializeJsonLd } from "@/lib/seo"

const POSTS_PER_PAGE = 9

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
  const canonical = `${siteMetadata.siteUrl}/blog/`
  const collectionSchema = buildPageSchema({
    url: canonical,
    name: "Geekskai Blog | Practical Technology and Tool Guides",
    description:
      "Practical guides on web development, online tools, audio workflows, software, and production-focused engineering.",
    type: "CollectionPage",
    breadcrumbs: [
      { name: "Home", url: `${siteMetadata.siteUrl}/` },
      { name: "Blog", url: canonical },
    ],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }}
      />
      <ListLayoutWithTags
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
