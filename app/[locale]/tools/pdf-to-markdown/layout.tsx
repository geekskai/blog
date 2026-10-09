import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { buildLanguageAlternates, getLocalizedUrl } from "@/app/i18n/urls"
import { getIndexedToolLocales } from "@/app/sitemap-config"

const SITE_URL = "https://geekskai.com"
const TOOL_PATH = "/tools/pdf-to-markdown/"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "PdfToMarkdown" })
  const canonical = getLocalizedUrl(SITE_URL, locale, TOOL_PATH)
  return { title: t("title"), description: t("intro"), keywords: ["PDF to Markdown", "PDF to MD", "Markdown converter"], alternates: { canonical, languages: buildLanguageAlternates(SITE_URL, TOOL_PATH, [...getIndexedToolLocales(TOOL_PATH)]) }, openGraph: { type: "website", title: t("title"), description: t("intro"), url: canonical, siteName: "GeeksKai", locale }, twitter: { card: "summary_large_image", title: t("title"), description: t("intro") }, robots: { index: true, follow: true } }
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "PdfToMarkdown" })
  const url = getLocalizedUrl(SITE_URL, locale, TOOL_PATH)
  const jsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: t("title"), description: t("intro"), url, applicationCategory: "UtilityApplication", operatingSystem: "Any", isAccessibleForFree: true, inLanguage: locale, featureList: [t("about.description"), t("faq.local.answer"), t("faq.scanned.answer")] }
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: t("accessibility.home"), item: getLocalizedUrl(SITE_URL, locale, "/") }, { "@type": "ListItem", position: 2, name: t("breadcrumb.tools"), item: getLocalizedUrl(SITE_URL, locale, "/tools/") }, { "@type": "ListItem", position: 3, name: t("breadcrumb.current"), item: url }] }
  return <div className="min-h-screen"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</div>
}
