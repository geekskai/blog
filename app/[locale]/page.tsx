import { sortPosts, allCoreContent } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"
import Main from "../Main"

export const revalidate = 86400 // 24 hours

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
