import { Authors, allAuthors } from "contentlayer/generated"
import { MDXLayoutRenderer } from "pliny/mdx-components"
import AuthorLayout from "@/layouts/AuthorLayout"
import { coreContent } from "pliny/utils/contentlayer"
import { genPageMetadata } from "app/seo"
import siteMetadata from "@/data/siteMetadata"
import { permanentRedirect } from "next/navigation"
import { buildPageSchema, SEO_ENTITY_IDS, serializeJsonLd } from "@/lib/seo"

const canonical = `${siteMetadata.siteUrl}/about/`
const aboutTitle = "About Geeks Kai | Engineer and Technical Writer"
const aboutDescription =
  "Meet Geeks Kai, the software engineer and technical writer behind Geekskai's browser tools, technical guides, and editorial standards."

export const metadata = genPageMetadata({
  title: aboutTitle,
  description: aboutDescription,
  alternates: {
    canonical,
    languages: { "x-default": canonical, en: canonical },
  },
  openGraph: {
    title: aboutTitle,
    description: aboutDescription,
    url: canonical,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: aboutTitle,
    description: aboutDescription,
    images: [siteMetadata.socialBanner],
  },
})

const aboutPageSchema = buildPageSchema({
  url: canonical,
  name: aboutTitle,
  description: aboutDescription,
  type: "ProfilePage",
  breadcrumbs: [
    { name: "Home", url: `${siteMetadata.siteUrl}/` },
    { name: "About", url: canonical },
  ],
})

const [aboutWebPage, aboutBreadcrumb] = aboutPageSchema["@graph"]
const aboutStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { ...aboutWebPage, mainEntity: { "@id": SEO_ENTITY_IDS.author } },
    aboutBreadcrumb,
    {
      "@type": "Person",
      "@id": SEO_ENTITY_IDS.author,
      name: "Geeks Kai",
      url: canonical,
      image: `${siteMetadata.siteUrl}/static/images/avatar.jpg`,
      jobTitle: "Software engineer and technical writer",
      worksFor: { "@id": SEO_ENTITY_IDS.organization },
      sameAs: [siteMetadata.x, siteMetadata.github, siteMetadata.linkedin],
    },
  ],
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== "en") permanentRedirect("/about/")

  const author = allAuthors.find((p) => p.slug === "default") as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(aboutStructuredData) }}
      />
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
