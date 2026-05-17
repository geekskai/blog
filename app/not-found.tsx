import { Metadata } from "next"
import Image from "next/image"
import NotFoundPage from "@/components/NotFoundPage"
import { getNotFoundLabels } from "@/lib/not-found"
import { getTranslations } from "next-intl/server"
import "css/tailwind.css"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "NotFound" })

  return {
    metadataBase: new URL("https://geekskai.com"),
    title: t("meta_title"),
    description: t("meta_description"),
    robots: { index: false, follow: true },
    themeColor: "#0f172a",
  }
}

export default async function NotFound() {
  const labels = await getNotFoundLabels("en")
  const basePath = process.env.BASE_PATH || ""

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 pl-[calc(100vw-100%)] text-white antialiased">
        <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6">
          <header className="flex shrink-0 justify-center py-6 sm:py-8">
            <a
              href={`${basePath}/`}
              className="group flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              aria-label="GeeksKai"
            >
              <Image
                src={`${basePath}/static/logos.png`}
                alt=""
                width={44}
                height={36}
                className="h-10 w-12 transition-transform duration-150 group-hover:scale-105"
                priority
              />
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                GeeksKai
              </span>
            </a>
          </header>
          <NotFoundPage
            labels={labels}
            links={{
              home: `${basePath}/`,
              tools: `${basePath}/tools`,
              blog: `${basePath}/blog/`,
            }}
          />
        </main>
      </body>
    </html>
  )
}
