import { Authors, allAuthors } from "contentlayer/generated"
import { MDXLayoutRenderer } from "pliny/mdx-components"
import AuthorLayout from "@/layouts/AuthorLayout"
import { coreContent } from "pliny/utils/contentlayer"
import { genPageMetadata } from "app/seo"
import siteMetadata from "@/data/siteMetadata"
import { permanentRedirect } from "next/navigation"

const canonical = `${siteMetadata.siteUrl}/about/`

export const metadata = genPageMetadata({
  title: "About",
  alternates: {
    canonical,
    languages: { "x-default": canonical, en: canonical },
  },
  openGraph: {
    title: `About | ${siteMetadata.title}`,
    description: siteMetadata.description,
    url: canonical,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "en_US",
    type: "profile",
  },
})

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== "en") permanentRedirect("/about/")

  const author = allAuthors.find((p) => p.slug === "default") as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
