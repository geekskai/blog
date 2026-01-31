import Link from "@/components/Link"
import Tag from "@/components/Tag"
import { slug } from "github-slugger"
import tagData from "app/tag-data.json"
import { genPageMetadata } from "app/seo"
import siteMetadata from "@/data/siteMetadata"

const tagCounts = tagData as Record<string, number>
const totalTags = Object.keys(tagCounts).length
const totalPosts = Object.values(tagCounts).reduce((sum, count) => sum + count, 0)

export const metadata = genPageMetadata({
  title: "Tags - Browse All Blog Topics",
  description: `Browse all ${totalTags} tags and explore ${totalPosts} articles organized by topics on ${siteMetadata.title}. Find content about technology, programming, AI tools, and more.`,
  keywords: [
    "blog tags",
    "content categories",
    "topic archive",
    "blog topics",
    siteMetadata.title,
    "article tags",
  ],
  alternates: {
    canonical: "https://geekskai.com/tags/",
  },
  other: {
    "last-modified": new Date().toISOString(),
    "update-frequency": "weekly",
    "total-tags": totalTags.toString(),
    "total-posts": totalPosts.toString(),
  },
})

export default async function Page() {
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

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
    ],
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tags - Browse All Blog Topics",
    description: `Browse all ${totalTags} tags and explore ${totalPosts} articles organized by topics`,
    url: `${siteMetadata.siteUrl}/tags/`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalTags,
      itemListElement: sortedTags.slice(0, 20).map((tag, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CollectionPage",
          name: tag,
          url: `${siteMetadata.siteUrl}/tags/${slug(tag)}/`,
          description: `${tagCounts[tag]} ${tagCounts[tag] === 1 ? "article" : "articles"} tagged with "${tag}"`,
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

      {/* Core Facts Section for AI Extraction */}
      <section className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Browse All <strong>Tags</strong> and Topics
              </h2>
              <p className="text-slate-300">
                Explore <strong>{totalTags}</strong> tags covering <strong>{totalPosts}</strong>{" "}
                {totalPosts === 1 ? "article" : "articles"} on {siteMetadata.title}. Find content
                organized by topics including <strong>technology</strong>,{" "}
                <strong>programming</strong>, <strong>AI tools</strong>, and more.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <div>
                <strong className="text-white">Total Tags:</strong> {totalTags}
              </div>
              <div>
                <strong className="text-white">Total Articles:</strong> {totalPosts}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start justify-start divide-y divide-stone-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-stone-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagKeys.length === 0 && "No tags found."}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mb-2 mr-5 mt-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}/`}
                  className="-ml-2 text-sm font-semibold uppercase text-stone-300"
                  aria-label={`View ${tagCounts[t]} ${tagCounts[t] === 1 ? "post" : "posts"} tagged ${t}`}
                >
                  {` (${tagCounts[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
