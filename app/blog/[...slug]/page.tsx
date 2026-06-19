import "css/prism.css"
import "katex/dist/katex.css"

import { components } from "@/components/MDXComponents"
import { MDXLayoutRenderer } from "pliny/mdx-components"
import { sortPosts, coreContent, allCoreContent } from "pliny/utils/contentlayer"
import { allBlogs, allAuthors } from "contentlayer/generated"
import type { Authors, Blog } from "contentlayer/generated"
import PostLayout from "@/layouts/PostLayout"
import { Metadata } from "next"
import siteMetadata from "@/data/siteMetadata"
import { notFound } from "next/navigation"
import { Suspense } from "react"

function ArticleContentFallback() {
  return (
    <div className="min-h-[40rem] space-y-4" aria-hidden="true">
      <div className="h-6 w-2/3 rounded bg-stone-800/60" />
      <div className="h-4 w-full rounded bg-stone-800/50" />
      <div className="h-4 w-11/12 rounded bg-stone-800/50" />
      <div className="h-4 w-4/5 rounded bg-stone-800/50" />
      <div className="h-64 rounded-xl bg-stone-800/40" />
    </div>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join("/"))
  const post = allBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ["default"]
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === "string" ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes("http") ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: "./",
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    other: {
      "last-modified": modifiedAt,
      "application/ld+json": [JSON.stringify(post.structuredData)],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({ slug: p.slug.split("/").map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join("/"))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  const authorList = post?.authors || ["default"]
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd["author"] = authorDetails.map((author) => {
    return {
      "@type": "Person",
      name: author.name,
      url: siteMetadata.siteUrl + author.avatar,
    }
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <Suspense fallback={<ArticleContentFallback />}>
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        </Suspense>
      </PostLayout>
    </>
  )
}
