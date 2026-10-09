import ListLayoutWithTags from "@/layouts/ListLayoutWithTags"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"
import { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import siteMetadata from "@/data/siteMetadata"

const POSTS_PER_PAGE = 9

export const generateStaticParams = async () => {
  const posts = allCoreContent(sortPosts(allBlogs.filter((post) => !post.draft)))
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export async function generateMetadata(props: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await props.params
  const pageNumber = Number(page)
  const posts = allCoreContent(sortPosts(allBlogs.filter((post) => !post.draft)))
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) return {}
  const canonical = `${siteMetadata.siteUrl}/blog/page/${pageNumber}/`
  return {
    title: `All Posts - Page ${pageNumber}`,
    alternates: { canonical, languages: { "x-default": canonical } },
    openGraph: { url: canonical },
  }
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts = allCoreContent(sortPosts(allBlogs.filter((post) => !post.draft)))
  if (!/^\d+$/.test(params.page)) notFound()
  const pageNumber = Number(params.page)
  if (!Number.isInteger(pageNumber) || pageNumber < 1) notFound()
  if (pageNumber === 1) permanentRedirect("/blog/")
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (pageNumber > totalPages) notFound()
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages,
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
