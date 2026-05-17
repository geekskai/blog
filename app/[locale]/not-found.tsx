import { Metadata } from "next"
import NotFoundPage from "@/components/NotFoundPage"
import { getPathname } from "@/app/i18n/navigation"
import { getNotFoundLabels } from "@/lib/not-found"
import { getLocale, getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound")

  return {
    title: t("meta_title"),
    description: t("meta_description"),
    robots: { index: false, follow: true },
  }
}

export default async function NotFound() {
  const locale = await getLocale()
  const labels = await getNotFoundLabels(locale)

  const links = {
    home: getPathname({ locale, href: "/" }),
    tools: getPathname({ locale, href: "/tools" }),
    blog: "/blog/",
  }

  return <NotFoundPage labels={labels} links={links} />
}
