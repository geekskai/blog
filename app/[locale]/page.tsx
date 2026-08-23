import { sortPosts, allCoreContent } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"
import Main from "../Main"
import { getTranslations } from "next-intl/server"
import siteMetadata from "@/data/siteMetadata"
import { buildPageSchema, serializeJsonLd } from "@/lib/seo"
import { getLocalizedUrl } from "../i18n/urls"

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HomePage" })
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const url = getLocalizedUrl(siteMetadata.siteUrl, locale, "/")
  const pageSchema = buildPageSchema({
    url,
    name: t("home_seo_title"),
    description: t("home_seo_description"),
    inLanguage: locale,
    breadcrumbs: [{ name: "Home", url }],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageSchema) }}
      />
      <Main posts={posts} />
    </>
  )
}
