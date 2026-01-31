import projectsData from "@/data/projectsData"
import Card from "@/components/Card"
import { genPageMetadata } from "app/seo"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import siteMetadata from "@/data/siteMetadata"
import { supportedLocales } from "@/app/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HomePage" })

  const projectCount = projectsData.length
  const title = t("projects_title") || "Projects"
  const description =
    t("projects_description") ||
    `Explore ${projectCount} ${projectCount === 1 ? "project" : "projects"} by ${siteMetadata.author}. Discover web applications, open-source projects, and innovative solutions built with modern technologies.`

  const isDefaultLocale = locale === "en"
  const languages: Record<string, string> = {
    "x-default": "https://geekskai.com/projects/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/projects/`
  })

  const localeMap: Record<string, string> = {
    en: "en_US",
    ja: "ja_JP",
    ko: "ko_KR",
    no: "no_NO",
    "zh-cn": "zh_CN",
    da: "da_DK",
  }

  const ogLocale = localeMap[locale] || "en_US"
  const baseUrl = siteMetadata.siteUrl
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}/projects/`

  return genPageMetadata({
    title: `${title} - ${siteMetadata.title}`,
    description,
    keywords: [
      "projects",
      "portfolio",
      "web development",
      "open source",
      "github projects",
      siteMetadata.title,
      "software projects",
      "web applications",
    ],
    alternates: {
      canonical: isDefaultLocale ? `${baseUrl}/projects/` : `${baseUrl}/${locale}/projects/`,
      languages: {
        ...languages,
      },
    },
    openGraph: {
      title: `${title} - ${siteMetadata.title}`,
      description,
      url,
      siteName: siteMetadata.title,
      locale: ogLocale,
      type: "website",
    },
    other: {
      "last-modified": new Date().toISOString(),
      "update-frequency": "monthly",
      "project-count": projectCount.toString(),
    },
  })
}

export default async function Projects({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HomePage" })
  const projectCount = projectsData.length
  // const isDefaultLocale = locale === "en"
  const baseUrl = siteMetadata.siteUrl
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}/projects/`

  // Generate structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("projects_title") || "Projects",
        item: url,
      },
    ],
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${t("projects_title") || "Projects"} - ${siteMetadata.title}`,
    description: `Collection of ${projectCount} ${projectCount === 1 ? "project" : "projects"} by ${siteMetadata.author}`,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projectCount,
      itemListElement: projectsData.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.description,
          url: project.href || url,
          applicationCategory: "WebApplication",
          ...(project.imgSrc && {
            image: `${baseUrl}${project.imgSrc}`,
          }),
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
      <div>
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-stone-100 md:text-4xl md:leading-10">
            {t("projects_title")}
          </h1>
          <p className="text-lg leading-7 text-stone-400">{t("projects_description")}</p>
        </div>

        {/* Core Facts Section for AI Extraction */}
        <section className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div style={{ flex: 5 }}>
                <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
                  <strong>{t("projects_title") || "Projects"}</strong> Portfolio
                </h2>
                <p className="text-base text-slate-300 md:text-lg">
                  Explore <strong>{projectCount}</strong>{" "}
                  {projectCount === 1 ? "project" : "projects"} by{" "}
                  <strong>{siteMetadata.author}</strong>. Discover <strong>web applications</strong>
                  , <strong>open-source projects</strong>, and innovative solutions built with
                  modern technologies including <strong>Vue.js</strong>, <strong>React</strong>,{" "}
                  <strong>Next.js</strong>, and more.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2 text-base text-slate-400 md:text-lg">
                <div>
                  <strong className="text-white">Total Projects:</strong> {projectCount}
                </div>
                <div>
                  <strong className="text-white">Author:</strong> {siteMetadata.author}
                </div>
              </div>
            </div>
          </div>
        </section>
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
