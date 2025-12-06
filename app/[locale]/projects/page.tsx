import projectsData from "@/data/projectsData"
import Card from "@/components/Card"
import { genPageMetadata } from "app/seo"
import { getTranslations } from "next-intl/server"

export const revalidate = 86400 // 24 hours

export const metadata = genPageMetadata({ title: "Projects" })

export default async function Projects() {
  const t = await getTranslations("HomePage")
  return (
    <>
      <div className="divide-y divide-stone-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-stone-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {t("projects_title")}
          </h1>
          <p className="text-lg leading-7 text-stone-400">{t("description")}</p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map(({ title, description, hrefRel, href, imgSrc }) => (
              <Card
                key={title}
                hrefRel={hrefRel}
                title={title}
                description={description}
                imgSrc={imgSrc}
                href={href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
