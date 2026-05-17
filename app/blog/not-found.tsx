import { Metadata } from "next"
import NotFoundPage from "@/components/NotFoundPage"
import { getNotFoundLabels } from "@/lib/not-found"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound")

  return {
    title: t("meta_title"),
    description: t("meta_description"),
    robots: { index: false, follow: true },
  }
}

export default async function NotFound() {
  const labels = await getNotFoundLabels("en")

  return (
    <NotFoundPage
      labels={labels}
      links={{
        home: "/",
        tools: "/tools",
        blog: "/blog/",
      }}
    />
  )
}
