import { slug } from "github-slugger"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import siteMetadata from "@/data/siteMetadata"
import ListLayoutWithTags from "@/layouts/ListLayoutWithTags"
import { allBlogs } from "contentlayer/generated"
import tagData from "app/tag-data.json"
import { genPageMetadata } from "app/seo"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURI(params.tag)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )

  if (filteredPosts.length === 0) {
    return genPageMetadata({
      title: `${tag} - Tag Not Found`,
      description: `Tag "${tag}" not found on ${siteMetadata.title}`,
    })
  }

  const postCount = filteredPosts.length
  const capitalizedTag = tag[0].toUpperCase() + tag.slice(1)
  const description = `Explore ${postCount} ${postCount === 1 ? "article" : "articles"} tagged with "${capitalizedTag}" on ${siteMetadata.title}. Discover in-depth content, tutorials, and insights about ${tag}.`

  return genPageMetadata({
    title: `${capitalizedTag} - Tag Archive`,
    description,
    keywords: [
      tag,
      `${tag} articles`,
      `${tag} blog posts`,
      `${tag} content`,
      "tag archive",
      siteMetadata.title,
    ],
    alternates: {
      canonical: `https://geekskai.com/tags/${tag}/`,
      languages: {
        "x-default": `https://geekskai.com/tags/${tag}/`,
      },
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
    other: {
      "last-modified": new Date().toISOString(),
      "update-frequency": "weekly",
      "article-count": postCount.toString(),
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
  return paths
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURI(params.tag)
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  if (filteredPosts.length === 0) {
    return notFound()
  }

  const postCount = filteredPosts.length
  const capitalizedTag = tag[0].toUpperCase() + tag.slice(1)

  // Generate structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteMetadata.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tags",
        item: `${siteMetadata.siteUrl}/tags/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: capitalizedTag,
        item: `${siteMetadata.siteUrl}/tags/${tag}/`,
      },
    ],
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${capitalizedTag} - Tag Archive`,
    description: `Collection of ${postCount} ${postCount === 1 ? "article" : "articles"} tagged with "${capitalizedTag}"`,
    url: `${siteMetadata.siteUrl}/tags/${tag}/`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: postCount,
      itemListElement: filteredPosts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          name: post.title,
          url: `${siteMetadata.siteUrl}/${post.path}`,
          description: post.summary,
          datePublished: post.date,
        },
      })),
    },
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      <ListLayoutWithTags posts={filteredPosts} title={title}>
        {/* Core Facts Section for AI Extraction */}
        <section className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
              <div style={{ flex: 5 }}>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  <strong>{capitalizedTag}</strong> Tag Archive
                </h2>
                <p className="text-base text-slate-300 md:text-lg">
                  Discover <strong>{postCount}</strong> {postCount === 1 ? "article" : "articles"}{" "}
                  tagged with <strong>"{capitalizedTag}"</strong> on {siteMetadata.title}. Explore
                  in-depth content, tutorials, and insights about <strong>{tag}</strong>.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2 text-base text-slate-400 md:gap-6 md:text-lg">
                <div>
                  <strong className="text-white">Total Articles:</strong> {postCount}
                </div>
                <div>
                  <strong className="text-white">Tag:</strong> {capitalizedTag}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ListLayoutWithTags>
    </>
  )
}
